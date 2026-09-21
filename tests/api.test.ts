import { randomBytes, scryptSync } from "node:crypto";
import { rm } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

/**
 * API route tests — the business-critical flows (Build Spec §43 / §59 / §62).
 *
 * These exercise the real route handlers, not a reimplementation, because the risks that
 * matter are at the boundary: what a stranger can post, what the server trusts, and what
 * an unauthenticated caller can reach.
 *
 * Protected here:
 *   1. Money — a client can never set a price, and can never mark its own payment verified.
 *   2. Auth — admin endpoints reject an unauthenticated caller, and the signed cookie round-trips.
 *   3. Automation — webhooks fail closed without the secret and de-duplicate on replay.
 *   4. Funnel — a valid submission is scored and stored, an invalid one is refused with field errors.
 *   5. Abuse — the honeypot and per-IP rate limits actually engage.
 */

const TEST_DIR = `.data-api-test-${process.pid}`;
const ADMIN_EMAIL = "admin@test.local";
const ADMIN_PASSWORD = "test-password-123456";

// The password hash is built here rather than imported, so the environment is fully
// configured before any route module is loaded (which is why imports below are dynamic).
const salt = randomBytes(16).toString("hex");
const digest = scryptSync(ADMIN_PASSWORD, salt, 64).toString("hex");

process.env.LOCAL_DB_DIR = TEST_DIR;
process.env.ADMIN_EMAIL = ADMIN_EMAIL;
process.env.ADMIN_PASSWORD_HASH = `scrypt:${salt}:${digest}`;
process.env.AUTH_SECRET = "test-secret-value-that-is-long-enough";
process.env.N8N_WEBHOOK_SECRET = "test-n8n-secret";

/** `next/headers` is request-scoped; routes under test get a plain in-memory store. */
const cookieStore = new Map<string, string>();
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (cookieStore.has(name) ? { name, value: cookieStore.get(name)! } : undefined),
    set: (name: string, value: string) => {
      cookieStore.set(name, value);
    },
    delete: (name: string) => {
      cookieStore.delete(name);
    },
    has: (name: string) => cookieStore.has(name),
  }),
}));

type Route = {
  POST?: (request: Request, context?: unknown) => Promise<Response>;
  GET?: (request: Request, context?: unknown) => Promise<Response>;
  PATCH?: (request: Request, context?: unknown) => Promise<Response>;
  DELETE?: (request: Request, context?: unknown) => Promise<Response>;
};

let health: Route;
let audit: Route;
let contact: Route;
let leads: Route;
let orders: Route;
let payment: Route;
let search: Route;
let webhook: Route;
let adminSession: Route;
let adminLeads: Route;
let adminOrders: Route;
let repository: { listLeads: (q?: unknown) => Promise<{ id: string; status: string }[]>; listAudits: (n?: number) => Promise<{ id: string }[]>; getOrder: (id: string) => Promise<{ paymentStatus: string; status: string } | null>; listLeadEvents: (id: string) => Promise<{ type: string }[]> };

/** A distinct IP per call keeps the in-memory limiter from coupling unrelated tests. */
let ipCounter = 0;
function uniqueIp() {
  ipCounter += 1;
  return `10.1.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`;
}

function post(path: string, body: unknown, ip = uniqueIp(), headers: Record<string, string> = {}) {
  return new Request(`http://localhost:3000${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip, ...headers },
    body: JSON.stringify(body),
  });
}

function get(path: string, ip = uniqueIp(), headers: Record<string, string> = {}) {
  return new Request(`http://localhost:3000${path}`, {
    method: "GET",
    headers: { "x-forwarded-for": ip, ...headers },
  });
}

function patch(path: string, body: unknown, ip = uniqueIp()) {
  return new Request(`http://localhost:3000${path}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

const params = (id: string) => ({ params: Promise.resolve({ id }) });

const validAudit = () => ({
  businessName: "Rahman Traders",
  businessStage: "growing",
  teamSize: "3-5",
  answers: {
    identity: "yes",
    structure: "partial",
    operations: "no",
    growth: "yes",
    intelligence: "no",
    control: "partial",
  },
  biggestProblem: "visibility",
  currentTools: "Excel, WhatsApp",
  goal: "leads",
  name: "Rahman",
  email: "rahman@example.com",
  whatsapp: "01814716713",
  locale: "bn",
});

beforeAll(async () => {
  await rm(TEST_DIR, { recursive: true, force: true });
  health = await import("@/app/api/health/route");
  audit = await import("@/app/api/audit/route");
  contact = await import("@/app/api/contact/route");
  leads = await import("@/app/api/leads/route");
  orders = await import("@/app/api/orders/route");
  search = await import("@/app/api/search/route");
  adminSession = await import("@/app/api/admin/session/route");
  // Dynamic-segment handlers declare a required `{ params: Promise<...> }`
  // second argument, which the permissive Route shape above cannot express.
  // Every call site passes the matching context explicitly.
  payment = (await import("@/app/api/orders/[id]/payment/route")) as unknown as Route;
  webhook = (await import("@/app/api/webhooks/n8n/[event]/route")) as unknown as Route;
  adminLeads = (await import("@/app/api/admin/leads/[id]/route")) as unknown as Route;
  adminOrders = (await import("@/app/api/admin/orders/[id]/route")) as unknown as Route;
  const db = await import("@/lib/db");
  repository = db.getRepository() as unknown as typeof repository;
});

afterAll(async () => {
  await rm(TEST_DIR, { recursive: true, force: true });
});

/* ─────────────────────────────── health ─────────────────────────────── */

describe("GET /api/health", () => {
  it("reports status, version, timestamp and a database check", async () => {
    const response = await health.GET!(get("/api/health"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.version).toBe("2.0.0");
    expect(body.checks.database).toBe("ok");
    expect(new Date(body.timestamp).getTime()).toBeGreaterThan(0);
  });
});

/* ─────────────────────────────── audit funnel ─────────────────────────────── */

describe("POST /api/audit", () => {
  it("scores a complete submission, stores it, and identifies the weakest layer", async () => {
    const response = await audit.POST!(post("/api/audit", validAudit()));
    expect(response.status).toBe(201);
    const body = await response.json();

    expect(body.ok).toBe(true);
    // operations answers "no" (0) — it must win over the other partial layers.
    expect(body.priorityLayer).toBe("operations");

    const stored = await repository.listAudits(50);
    expect(stored.some((item) => item.id === body.id)).toBe(true);
  });

  it("creates a CRM lead from the same submission", async () => {
    const pending = repository.listLeads({ search: "rahman@example.com" });
    const found = await pending;
    expect(found.length).toBeGreaterThan(0);
  });

  it("refuses an incomplete submission and returns per-field errors", async () => {
    const response = await audit.POST!(post("/api/audit", { ...validAudit(), answers: { identity: "yes" } }));
    expect(response.status).toBe(422);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(Object.keys(body.fieldErrors ?? {}).length).toBeGreaterThan(0);
  });

  it("refuses an invalid answer value", async () => {
    const bad = validAudit();
    (bad.answers as Record<string, string>).control = "maybe";
    const response = await audit.POST!(post("/api/audit", bad));
    expect(response.status).toBe(422);
  });

  it("drops a bot submission without storing an audit or a lead", async () => {
    const beforeAudits = (await repository.listAudits(50)).length;
    const response = await audit.POST!(post("/api/audit", { ...validAudit(), company_website: "http://spam.example" }));
    expect(response.status).toBe(202);
    expect((await response.json()).ok).toBe(true);
    const afterAudits = (await repository.listAudits(50)).length;
    expect(afterAudits).toBe(beforeAudits);
  });

  it("rejects a malformed JSON body instead of crashing", async () => {
    const request = new Request("http://localhost:3000/api/audit", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": uniqueIp() },
      body: "{not json",
    });
    const response = await audit.POST!(request);
    expect(response.status).toBe(400);
  });

  it("rate limits a single address after 8 submissions in a minute", async () => {
    const ip = uniqueIp();
    const statuses: number[] = [];
    for (let i = 0; i < 9; i += 1) {
      const response = await audit.POST!(post("/api/audit", validAudit(), ip));
      statuses.push(response.status);
    }
    expect(statuses.slice(0, 8).every((status) => status === 201)).toBe(true);
    expect(statuses[8]).toBe(429);
  });
});

/* ──────────────────────── public lead capture ──────────────────────── */

describe("POST /api/leads", () => {
  const valid = {
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "01712345677",
    businessName: "Jahan Boutique",
    source: "pricing_page",
    channel: "web",
    productInterest: "professional-business-growth",
    notes: "Wants the growth package before Eid.",
  };

  it("stores a qualified enquiry against the product of interest", async () => {
    const response = await leads.POST!(post("/api/leads", valid));
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.ok).toBe(true);

    const found = await repository.listLeads({ search: valid.email });
    expect(found.length).toBe(1);
  });

  it("drops a bot submission without storing it", async () => {
    const before = (await repository.listLeads({ search: "bot@example.com" })).length;
    const response = await leads.POST!(post("/api/leads", { ...valid, email: "bot@example.com", company_website: "http://spam.example" }));
    expect(response.status).toBe(202);
    const after = (await repository.listLeads({ search: "bot@example.com" })).length;
    expect(after).toBe(before);
    expect(after).toBe(0);
  });

  it("refuses a lead with no way to reply", async () => {
    expect((await leads.POST!(post("/api/leads", { ...valid, phone: "123" }))).status).toBe(422);
    expect((await leads.POST!(post("/api/leads", { ...valid, email: "not-an-email" }))).status).toBe(422);
  });
});

/* ─────────────────────────────── contact ─────────────────────────────── */

describe("POST /api/contact", () => {
  const valid = {
    name: "Karim",
    email: "karim@example.com",
    phone: "01712345678",
    subject: "Business profile",
    message: "I need a business profile for my shop.",
    source: "contact_form",
    channel: "web",
  };

  it("accepts a real enquiry", async () => {
    const response = await contact.POST!(post("/api/contact", valid));
    expect(response.status).toBe(201);
    expect((await response.json()).ok).toBe(true);
  });

  it("silently drops a bot that fills the honeypot", async () => {
    const before = (await repository.listLeads({ search: valid.email })).length;
    const response = await contact.POST!(post("/api/contact", { ...valid, company_website: "http://spam.example" }));
    // A bot must not learn that it was detected, and nothing may be stored.
    expect(response.status).toBe(202);
    const body = await response.json();
    expect(body.ok).toBe(true);
    const after = (await repository.listLeads({ search: valid.email })).length;
    expect(after).toBe(before);
  });

  it("rejects an invalid email and a too-short message", async () => {
    expect((await contact.POST!(post("/api/contact", { ...valid, email: "nope" }))).status).toBe(422);
    expect((await contact.POST!(post("/api/contact", { ...valid, message: "hi" }))).status).toBe(422);
  });
});

/* ─────────────────────────────── orders & money ─────────────────────────────── */

describe("POST /api/orders", () => {
  it("prices the order from the catalogue, ignoring anything the client sends", async () => {
    const response = await orders.POST!(
      post("/api/orders", {
        customerName: "Karim Rahman",
        customerEmail: "karim@example.com",
        customerPhone: "01712345678",
        productSlug: "professional-business-starter",
        quantity: 1,
        // A tampered client tries to dictate the price.
        unitPrice: 1,
        total: 1,
        price: 1,
      }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.total).toBe(999);
    expect(body.orderNumber).toMatch(/^NL-\d{4}$/);
  });

  it("refuses a product that is not orderable, rather than inventing a price", async () => {
    const response = await orders.POST!(
      post("/api/orders", {
        customerName: "Karim",
        customerEmail: "karim@example.com",
        customerPhone: "01712345678",
        // This product exists but has no confirmed price (TBC).
        productSlug: "ai-saas-mvp",
      }),
    );
    expect([404, 422]).toContain(response.status);
  });

  it("refuses a quantity of zero", async () => {
    const response = await orders.POST!(
      post("/api/orders", {
        customerName: "Karim",
        customerEmail: "karim@example.com",
        customerPhone: "01712345678",
        productSlug: "professional-business-starter",
        quantity: 0,
      }),
    );
    expect(response.status).toBe(422);
  });
});

describe("POST /api/orders/[id]/payment — the money rules (§30)", () => {
  async function createOrder(email: string) {
    const response = await orders.POST!(
      post("/api/orders", {
        customerName: "Payment Tester",
        customerEmail: email,
        customerPhone: "01712345678",
        productSlug: "professional-business-growth",
      }),
    );
    return (await response.json()) as { id: string; total: number };
  }

  it("moves an order into verification but never marks it verified", async () => {
    const order = await createOrder("pay1@example.com");
    const response = await payment.POST!(
      post(`/api/orders/${order.id}/payment`, {
        orderId: order.id,
        reference: "TRX-AAA-111",
        amount: order.total,
        method: "bKash",
      }),
      params(order.id),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.paymentStatus).toBe("submitted");
    expect(body.status).toBe("payment_verification");
    expect(body.paymentStatus).not.toBe("verified");
  });

  it("ignores a client that asks for its own payment to be verified", async () => {
    const order = await createOrder("pay2@example.com");
    await payment.POST!(
      post(`/api/orders/${order.id}/payment`, {
        orderId: order.id,
        reference: "TRX-BBB-222",
        amount: order.total,
        paymentStatus: "verified",
        verified: true,
      }),
      params(order.id),
    );
    const stored = await repository.getOrder(order.id);
    expect(stored?.paymentStatus).toBe("submitted");
    expect(stored?.paymentStatus).not.toBe("verified");
  });

  it("never lets a resubmission undo a payment a human has verified", async () => {
    const order = await createOrder("pay3@example.com");

    // The customer submits a reference, then an admin verifies it.
    await payment.POST!(
      post(`/api/orders/${order.id}/payment`, {
        orderId: order.id,
        reference: "TRX-CCC-333",
        amount: order.total,
      }),
      params(order.id),
    );
    const db = await import("@/lib/db");
    await db.getRepository().updateOrder(order.id, { paymentStatus: "verified", status: "confirmed" });

    // The customer sends the same reference again.
    const response = await payment.POST!(
      post(`/api/orders/${order.id}/payment`, {
        orderId: order.id,
        reference: "TRX-CCC-333",
        amount: order.total,
      }),
      params(order.id),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.paymentStatus).toBe("verified");
    expect(body.status).toBe("confirmed");

    const stored = await repository.getOrder(order.id);
    expect(stored?.paymentStatus).toBe("verified");
  });

  it("returns 404 for an order that does not exist", async () => {
    const response = await payment.POST!(
      post("/api/orders/00000000-0000-0000-0000-000000000000/payment", {
        orderId: "00000000-0000-0000-0000-000000000000",
        reference: "TRX-DDD-444",
        amount: 100,
      }),
      params("00000000-0000-0000-0000-000000000000"),
    );
    expect(response.status).toBe(404);
  });

  it("requires a usable transaction reference", async () => {
    const order = await createOrder("pay4@example.com");
    const response = await payment.POST!(
      post(`/api/orders/${order.id}/payment`, { orderId: order.id, reference: "12", amount: order.total }),
      params(order.id),
    );
    expect(response.status).toBe(422);
  });
});

/* ─────────────────────────────── admin auth ─────────────────────────────── */

describe("admin authentication", () => {
  const ip = "10.9.9.9";

  it("rejects a wrong password without revealing which part was wrong", async () => {
    const response = await adminSession.POST!(
      post("/api/admin/session", { email: ADMIN_EMAIL, password: "wrong-password" }, ip),
    );
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toMatch(/email or password/i);
  });

  it("signs in with the correct credentials and sets a session cookie", async () => {
    cookieStore.clear();
    const response = await adminSession.POST!(
      post("/api/admin/session", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, ip),
    );
    expect(response.status).toBe(200);
    expect((await response.json()).ok).toBe(true);
    expect(cookieStore.size).toBe(1);
  });

  it("reports the current session, then refuses once signed out", async () => {
    const current = await adminSession.GET!(get("/api/admin/session", ip));
    expect(current.status).toBe(200);
    expect((await current.json()).email).toBe(ADMIN_EMAIL);

    await adminSession.DELETE!(get("/api/admin/session", ip));
    const after = await adminSession.GET!(get("/api/admin/session", ip));
    expect(after.status).toBe(401);
  });

  it("rejects admin data endpoints without a session", async () => {
    cookieStore.clear();
    const lead = await adminLeads.PATCH!(patch("/api/admin/leads/any-id", { status: "won" }), params("any-id"));
    expect(lead.status).toBe(401);
    expect((await lead.json()).ok).toBe(false);

    const order = await adminOrders.PATCH!(patch("/api/admin/orders/any-id", { status: "confirmed" }), params("any-id"));
    expect(order.status).toBe(401);
  });

  it("lets a signed-in admin update a lead and records who did it", async () => {
    await adminSession.POST!(post("/api/admin/session", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }, ip));

    const target = (await repository.listLeads({ limit: 1 }))[0];
    const response = await adminLeads.PATCH!(
      patch(`/api/admin/leads/${target.id}`, { status: "qualified", notes: "Spoke on WhatsApp." }),
      params(target.id),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.lead.status).toBe("qualified");

    const events = await repository.listLeadEvents(target.id);
    expect(events.some((event) => event.type === "status_change")).toBe(true);
    expect(events.some((event) => event.type === "note")).toBe(true);
  });

  it("lets a signed-in admin verify a payment — the only human path to 'verified'", async () => {
    const created = await orders.POST!(
      post("/api/orders", {
        customerName: "Verify Me",
        customerEmail: "verify@example.com",
        customerPhone: "01712345678",
        productSlug: "professional-business-premium",
      }),
    );
    const order = (await created.json()) as { id: string };

    const response = await adminOrders.PATCH!(
      patch(`/api/admin/orders/${order.id}`, { paymentStatus: "verified", status: "confirmed" }),
      params(order.id),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.order.paymentStatus).toBe("verified");

    const stored = await repository.getOrder(order.id);
    expect(stored?.paymentStatus).toBe("verified");
  });
});

/* ─────────────────────────────── webhooks ─────────────────────────────── */

describe("POST /api/webhooks/n8n/[event]", () => {
  const secret = "test-n8n-secret";
  const context = { params: Promise.resolve({ event: "lead" }) };

  it("rejects an unknown event", async () => {
    const response = await webhook.POST!(
      post("/api/webhooks/n8n/not-a-real-event", { event: "x" }, uniqueIp(), { "x-nexus-secret": secret }),
      { params: Promise.resolve({ event: "not-a-real-event" }) },
    );
    expect(response.status).toBe(404);
  });

  it("rejects a missing or wrong secret", async () => {
    const missing = await webhook.POST!(
      post("/api/webhooks/n8n/lead", { event: "lead.created", payload: {} }),
      context,
    );
    expect(missing.status).toBe(401);

    const wrong = await webhook.POST!(
      post("/api/webhooks/n8n/lead", { event: "lead.created", payload: {} }, uniqueIp(), { "x-nexus-secret": "nope" }),
      context,
    );
    expect(wrong.status).toBe(401);
  });

  it("accepts a correctly signed lead and creates it", async () => {
    const response = await webhook.POST!(
      post(
        "/api/webhooks/n8n/lead",
        { event: "lead.created", idempotencyKey: "evt-lead-1", payload: { name: "Webhook Lead", email: "wh@example.com", phone: "01712345699" } },
        uniqueIp(),
        { "x-nexus-secret": secret },
      ),
      context,
    );
    expect(response.status).toBe(201);
    expect((await response.json()).ok).toBe(true);

    const found = await repository.listLeads({ search: "wh@example.com" });
    expect(found.length).toBe(1);
  });

  it("acknowledges a replayed delivery without applying it twice", async () => {
    const body = {
      event: "lead.created",
      idempotencyKey: "evt-replay-1",
      payload: { name: "Replay Lead", email: "replay@example.com", phone: "01712345688" },
    };
    const first = await webhook.POST!(post("/api/webhooks/n8n/lead", body, uniqueIp(), { "x-nexus-secret": secret }), context);
    expect(first.status).toBe(201);

    const second = await webhook.POST!(post("/api/webhooks/n8n/lead", body, uniqueIp(), { "x-nexus-secret": secret }), context);
    expect(second.status).toBe(200);
    expect((await second.json()).duplicate).toBe(true);

    const found = await repository.listLeads({ search: "replay@example.com" });
    expect(found.length).toBe(1);
  });

  it("refuses an unsigned payload when the schema does not match", async () => {
    const response = await webhook.POST!(
      post("/api/webhooks/n8n/lead", { payload: {} }, uniqueIp(), { "x-nexus-secret": secret }),
      context,
    );
    expect(response.status).toBe(422);
  });

  it("fails closed in production when no secret is configured", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("N8N_WEBHOOK_SECRET", "");
    try {
      const response = await webhook.POST!(
        post("/api/webhooks/n8n/lead", { event: "lead.created", payload: {} }, uniqueIp(), { "x-nexus-secret": "anything" }),
        context,
      );
      expect(response.status).toBe(401);
      expect((await response.json()).error).toMatch(/not configured/i);
    } finally {
      vi.unstubAllEnvs();
    }
  });
});

/* ─────────────────────────────── search ─────────────────────────────── */

describe("GET /api/search", () => {
  it("returns matches across content types", async () => {
    const response = await search.GET!(get("/api/search?q=crm&locale=bn"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.count).toBeGreaterThan(0);
    expect(body.results[0]).toHaveProperty("href");
  });

  it("does no lookup for a one-character query", async () => {
    const response = await search.GET!(get("/api/search?q=a&locale=en"));
    const body = await response.json();
    expect(body.results).toEqual([]);
  });

  it("is safe against an injection-shaped query", async () => {
    const response = await search.GET!(get("/api/search?q=%27%20OR%201%3D1--&locale=en"));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
  });
});
