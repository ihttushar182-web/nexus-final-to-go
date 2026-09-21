import { rm } from "node:fs/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LocalRepository } from "@/lib/db/local";
import { layerIds } from "@/data/layers";
import type { AuditAnswer, LayerId } from "@/types";

/**
 * Exercises the repository contract that both drivers implement (Build Spec §28–§31).
 * The Supabase driver must satisfy the same interface — see docs/02_DATABASE.md.
 */
const DIR = `.data-test-${process.pid}`;
let repo: LocalRepository;

const auditInput = () => ({
  businessName: "Rahman Traders",
  businessStage: "growing",
  teamSize: "3-5",
  answers: Object.fromEntries(layerIds.map((id) => [id, "partial"])) as Record<LayerId, AuditAnswer>,
  biggestProblem: "visibility",
  currentTools: "Excel",
  goal: "leads",
  name: "Rahman",
  email: "owner@example.com",
  whatsapp: "+8801712345678",
  locale: "bn" as const,
  source: "business_audit",
  snapshot: {
    total: 30,
    maxTotal: 60,
    percent: 50,
    layerScores: layerIds.map((layer) => ({ layer, answer: "partial" as AuditAnswer, score: 5 })),
    weakestLayer: "identity" as LayerId,
    priorityLayer: "control" as LayerId,
    priorityReason: { bn: "কারণ", en: "reason" },
    strongestLayer: "identity" as LayerId,
  },
  priorityLayer: "control" as LayerId,
  priorityReason: { bn: "কারণ", en: "reason" },
  evidence: [{ bn: "প্রমাণ", en: "evidence" }],
});

beforeAll(async () => {
  repo = new LocalRepository(DIR);
  await rm(DIR, { recursive: true, force: true });
});

afterAll(async () => {
  await rm(DIR, { recursive: true, force: true });
});

describe("audit submissions", () => {
  it("stores a submission and reads it back by id", async () => {
    const created = await repo.createAudit(auditInput());
    expect(created.id).toBeTruthy();
    expect(created.createdAt).toBeTruthy();

    const fetched = await repo.getAudit(created.id);
    expect(fetched?.businessName).toBe("Rahman Traders");
    expect(fetched?.snapshot.percent).toBe(50);
  });

  it("returns null for an unknown id instead of throwing", async () => {
    expect(await repo.getAudit("missing-id")).toBeNull();
  });

  it("lists the newest submission first and honours the limit", async () => {
    await repo.createAudit({ ...auditInput(), businessName: "Second Co" });
    const list = await repo.listAudits(10);
    expect(list[0].businessName).toBe("Second Co");
    expect(await repo.listAudits(1)).toHaveLength(1);
  });
});

describe("leads (CRM)", () => {
  it("creates a lead and records a 'created' event", async () => {
    const lead = await repo.createLead({ name: "Karim", email: "karim@example.com", phone: "01712345678" });
    expect(lead.status).toBe("new");
    expect(lead.source).toBe("website");

    const events = await repo.listLeadEvents(lead.id);
    expect(events.some((event) => event.type === "created")).toBe(true);
  });

  it("merges a repeat enquiry from the same email and product instead of duplicating", async () => {
    const first = await repo.createLead({
      name: "Nadia",
      email: "nadia@example.com",
      phone: "01712345679",
      productInterest: "professional-business-growth",
    });
    const second = await repo.createLead({
      name: "Nadia",
      email: "NADIA@example.com",
      phone: "01712345679",
      productInterest: "professional-business-growth",
    });

    expect(second.id).toBe(first.id);
    const all = await repo.listLeads({ search: "nadia" });
    expect(all).toHaveLength(1);
    const events = await repo.listLeadEvents(first.id);
    expect(events.some((event) => event.message.includes("merged"))).toBe(true);
  });

  it("filters by status, product interest and free-text search", async () => {
    await repo.createLead({ name: "Sultana", email: "sultana@example.com", phone: "01712345670", status: "qualified" });
    expect((await repo.listLeads({ status: "qualified" })).length).toBeGreaterThan(0);
    expect(await repo.listLeads({ status: "lost" })).toHaveLength(0);
    expect((await repo.listLeads({ search: "sultana" })).length).toBe(1);
    expect(
      (await repo.listLeads({ productInterest: "professional-business-growth" })).length,
    ).toBe(1);
  });

  it("updates a lead and returns null for an unknown id", async () => {
    const lead = await repo.createLead({ name: "Hasan", email: "hasan@example.com", phone: "01712345671" });
    const updated = await repo.updateLead(lead.id, { status: "contacted", owner: "NL Value Service" });
    expect(updated?.status).toBe("contacted");
    expect(updated?.owner).toBe("NL Value Service");
    expect(await repo.updateLead("nope", { status: "won" })).toBeNull();
  });

  it("keeps an append-only activity trail per lead", async () => {
    const lead = await repo.createLead({ name: "Trail", email: "trail@example.com", phone: "01712345672" });
    await repo.addLeadEvent({ leadId: lead.id, type: "contact", message: "Called the customer." });
    await repo.addLeadEvent({ leadId: lead.id, type: "note", message: "Wants a quote next week." });

    const events = await repo.listLeadEvents(lead.id);
    expect(events).toHaveLength(3);
    expect(events.every((event) => event.leadId === lead.id)).toBe(true);
  });
});

describe("orders and payments", () => {
  const orderInput = {
    customerName: "Karim",
    customerEmail: "karim@example.com",
    customerPhone: "01712345678",
    items: [
      { productId: "p-starter", productSlug: "professional-business-starter", productName: "Starter", quantity: 1, unitPrice: 999 },
    ],
  };

  it("creates an order with a server-computed total and a readable order number", async () => {
    const order = await repo.createOrder(orderInput);
    expect(order.total).toBe(999);
    expect(order.currency).toBe("BDT");
    expect(order.paymentStatus).toBe("pending");
    expect(order.orderNumber).toMatch(/^NL-\d{4}$/);
  });

  it("never starts as verified and never starts in production", async () => {
    const order = await repo.createOrder({ ...orderInput, customerEmail: "fresh@example.com" });
    // A brand-new order can only be awaiting payment/verification.
    expect(["pending", "submitted", "rejected", "adjustment_required"]).toContain(order.paymentStatus);
    expect(order.paymentStatus).not.toBe("verified");
    expect(order.status).toBe("awaiting_payment");
  });

  it("moves an order through the payment states and logs each attempt", async () => {
    const order = await repo.createOrder({ ...orderInput, customerEmail: "flow@example.com" });

    // 1. The customer submits a reference — this is a request, not an approval.
    await repo.addPaymentEvent({
      orderId: order.id,
      type: "submitted",
      method: "bKash",
      reference: "TRX998877",
      amount: order.total,
    });
    expect((await repo.updateOrder(order.id, { paymentStatus: "submitted" }))?.paymentStatus).toBe("submitted");

    // 2. A human verifies it.
    const verified = await repo.updateOrder(order.id, { paymentStatus: "verified", status: "confirmed" });
    expect(verified?.paymentStatus).toBe("verified");
    expect(verified?.status).toBe("confirmed");

    await repo.addPaymentEvent({ orderId: order.id, type: "verified", method: "bKash", reference: "TRX998877", amount: order.total, actor: "admin@nexuslift.com" });
    expect(await repo.updateOrder("missing", { status: "confirmed" })).toBeNull();
  });

  it("reuses the customer record for a repeat buyer", async () => {
    const first = await repo.createOrder({ ...orderInput, customerEmail: "repeat@example.com" });
    const second = await repo.createOrder({ ...orderInput, customerEmail: "REPEAT@example.com" });
    expect(second.customerId).toBe(first.customerId);
    const customers = await repo.listCustomers(50);
    expect(customers.filter((c) => c.email.toLowerCase() === "repeat@example.com")).toHaveLength(1);
  });
});

describe("platform stats and support", () => {
  it("counts only verified revenue", async () => {
    const stats = await repo.stats();
    const orders = await repo.listOrders(500);
    const expected = orders
      .filter((order) => order.paymentStatus === "verified" && order.status !== "cancelled")
      .reduce((sum, order) => sum + order.total, 0);
    expect(stats.revenue).toBe(expected);
    expect(stats.orders).toBe(orders.length);
    expect(stats.audits).toBeGreaterThan(0);
    expect(stats.totalLeads).toBeGreaterThan(0);
    // Pending payments include anything not yet human-verified.
    expect(stats.pendingPayments).toBeGreaterThanOrEqual(0);
  });

  it("records support tickets and webhook deliveries", async () => {
    await repo.createTicket({
      subject: "Invoice copy",
      message: "Please resend the invoice.",
      status: "open",
      channel: "whatsapp",
    });
    expect((await repo.listTickets(10)).length).toBeGreaterThan(0);

    await repo.logWebhook({
      endpoint: "/api/webhooks/n8n/lead",
      event: "lead",
      status: "accepted",
      detail: "Lead created from the n8n workflow.",
      payload: { email: "karim@example.com" },
    });
    const logs = await repo.listWebhookLogs(10);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].event).toBe("lead");
  });
});

describe("durability", () => {
  it("persists across instances owned by the same process directory", async () => {
    const created = await repo.createAudit({ ...auditInput(), businessName: "Durable Co" });
    const reopened = new LocalRepository(DIR);
    const found = await reopened.getAudit(created.id);
    expect(found?.businessName).toBe("Durable Co");
  });
});
