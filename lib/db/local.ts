import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import type {
  AuditSubmission,
  Customer,
  DailyMetric,
  Lead,
  LeadEvent,
  Order,
  PaymentEvent,
  SupportTicket,
  WebhookLogEntry,
} from "@/types";
import type {
  AuditCreateInput,
  LeadCreateInput,
  LeadQuery,
  LeadUpdateInput,
  OrderCreateInput,
  Repository,
} from "./types";

/**
 * Local persistent store (DB_DRIVER=local).
 *
 * Purpose: development, preview and single-instance deployments must work without
 * any database credentials, while exposing exactly the same repository contract as
 * Supabase. Data lives in one JSON document written atomically via a temp file +
 * rename, and every write is serialised through a promise queue.
 *
 * This is intentionally not a multi-writer database. Production should set
 * DB_DRIVER=supabase (see docs/02_DATABASE.md).
 */

interface Database {
  version: number;
  audits: AuditSubmission[];
  leads: Lead[];
  leadEvents: LeadEvent[];
  orders: Order[];
  paymentEvents: PaymentEvent[];
  customers: Customer[];
  tickets: SupportTicket[];
  webhookLogs: WebhookLogEntry[];
  dailyMetrics: DailyMetric[];
}

const EMPTY_DB: Database = {
  version: 1,
  audits: [],
  leads: [],
  leadEvents: [],
  orders: [],
  paymentEvents: [],
  customers: [],
  tickets: [],
  webhookLogs: [],
  dailyMetrics: [],
};

const MAX_LOG_ENTRIES = 500;

export class LocalRepository implements Repository {
  readonly driver = "local" as const;
  private readonly file: string;
  private queue: Promise<unknown> = Promise.resolve();
  private cache: Database | null = null;

  constructor(dir = process.env.LOCAL_DB_DIR ?? ".data") {
    this.file = path.join(process.cwd(), dir, "nexus-lift.json");
  }

  /** Serialise every mutation so concurrent requests never clobber the document. */
  private run<T>(operation: (db: Database) => Promise<T> | T): Promise<T> {
    const next = this.queue.then(async () => {
      const db = await this.load();
      const result = await operation(db);
      await this.persist(db);
      return result;
    });
    this.queue = next.catch(() => undefined);
    return next;
  }

  private async load(): Promise<Database> {
    if (this.cache) return this.cache;
    try {
      const raw = await readFile(this.file, "utf8");
      const parsed = JSON.parse(raw) as Database;
      this.cache = { ...EMPTY_DB, ...parsed };
    } catch {
      this.cache = structuredClone(EMPTY_DB);
    }
    return this.cache;
  }

  private async persist(db: Database) {
    await mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${process.pid}.tmp`;
    await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
    await rename(tmp, this.file);
  }

  private async read<T>(operation: (db: Database) => T): Promise<T> {
    const db = await this.load();
    return operation(db);
  }

  /* ───────────────────────────────── audit ───────────────────────────────── */

  async createAudit(input: AuditCreateInput): Promise<AuditSubmission> {
    const submission: AuditSubmission = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
    return this.run((db) => {
      db.audits.unshift(submission);
      return submission;
    });
  }

  async getAudit(id: string) {
    return this.read((db) => db.audits.find((item) => item.id === id) ?? null);
  }

  async listAudits(limit = 200) {
    return this.read((db) => db.audits.slice(0, limit));
  }

  /* ───────────────────────────────── leads ───────────────────────────────── */

  async createLead(input: LeadCreateInput): Promise<Lead> {
    const now = new Date().toISOString();
    const lead: Lead = {
      id: randomUUID(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      source: input.source ?? "website",
      channel: input.channel ?? "web",
      businessName: input.businessName,
      businessStage: input.businessStage,
      goal: input.goal,
      problem: input.problem,
      serviceInterest: input.serviceInterest,
      productInterest: input.productInterest,
      status: input.status ?? "new",
      score: input.score ?? 0,
      owner: input.owner,
      notes: input.notes,
      auditSubmissionId: input.auditSubmissionId,
      createdAt: now,
      updatedAt: now,
    };
    return this.run((db) => {
      // Duplicate rule: same email + same product interest stays a single record.
      const duplicate = db.leads.find(
        (item) => item.email.toLowerCase() === lead.email.toLowerCase() && item.productInterest === lead.productInterest,
      );
      if (duplicate) {
        duplicate.updatedAt = now;
        if (!duplicate.notes && lead.notes) duplicate.notes = lead.notes;
        if (lead.auditSubmissionId) duplicate.auditSubmissionId = lead.auditSubmissionId;
        db.leadEvents.unshift({
          id: randomUUID(),
          leadId: duplicate.id,
          type: "note",
          message: "Repeat enquiry merged into the existing lead record.",
          createdAt: now,
        });
        return duplicate;
      }
      db.leads.unshift(lead);
      db.leadEvents.unshift({
        id: randomUUID(),
        leadId: lead.id,
        type: "created",
        message: `Lead created from ${lead.source} / ${lead.channel}.`,
        createdAt: now,
      });
      return lead;
    });
  }

  async getLead(id: string) {
    return this.read((db) => db.leads.find((item) => item.id === id) ?? null);
  }

  async findLeadByEmail(email: string) {
    return this.read(
      (db) => db.leads.find((item) => item.email.toLowerCase() === email.toLowerCase()) ?? null,
    );
  }

  async listLeads(query: LeadQuery = {}) {
    return this.read((db) => {
      let items = [...db.leads];
      if (query.status && query.status !== "all") items = items.filter((item) => item.status === query.status);
      if (query.productInterest) items = items.filter((item) => item.productInterest === query.productInterest);
      if (query.source) items = items.filter((item) => item.source === query.source);
      if (query.search) {
        const term = query.search.toLowerCase();
        items = items.filter((item) =>
          [item.name, item.email, item.phone, item.businessName, item.problem, item.notes]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(term)),
        );
      }
      return items.slice(0, query.limit ?? 200);
    });
  }

  async updateLead(id: string, patch: LeadUpdateInput) {
    return this.run((db) => {
      const lead = db.leads.find((item) => item.id === id);
      if (!lead) return null;
      const now = new Date().toISOString();
      if (patch.status && patch.status !== lead.status) {
        db.leadEvents.unshift({
          id: randomUUID(),
          leadId: id,
          type: "status_change",
          message: `Status changed from ${lead.status} to ${patch.status}.`,
          createdAt: now,
        });
        lead.status = patch.status;
      }
      if (patch.owner !== undefined) lead.owner = patch.owner;
      if (patch.notes !== undefined) lead.notes = patch.notes;
      if (patch.score !== undefined) lead.score = patch.score;
      if (patch.nextFollowupAt !== undefined) lead.nextFollowupAt = patch.nextFollowupAt ?? undefined;
      if (patch.lastContactAt !== undefined) lead.lastContactAt = patch.lastContactAt ?? undefined;
      lead.updatedAt = now;
      return lead;
    });
  }

  async addLeadEvent(event: Omit<LeadEvent, "id" | "createdAt">) {
    const entry: LeadEvent = { ...event, id: randomUUID(), createdAt: new Date().toISOString() };
    return this.run((db) => {
      db.leadEvents.unshift(entry);
      return entry;
    });
  }

  async listLeadEvents(leadId: string) {
    return this.read((db) => db.leadEvents.filter((item) => item.leadId === leadId));
  }

  /* ───────────────────────────────── orders ──────────────────────────────── */

  async createOrder(input: OrderCreateInput): Promise<Order> {
    const now = new Date().toISOString();
    const total = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return this.run((db) => {
      let customer = db.customers.find((item) => item.email.toLowerCase() === input.customerEmail.toLowerCase());
      if (!customer) {
        customer = {
          id: randomUUID(),
          name: input.customerName,
          email: input.customerEmail,
          phone: input.customerPhone,
          businessName: input.businessName,
          orders: [],
          createdAt: now,
          updatedAt: now,
        };
        db.customers.unshift(customer);
      }
      const order: Order = {
        id: randomUUID(),
        orderNumber: `NL-${String(db.orders.length + 1001).padStart(4, "0")}`,
        customerId: customer.id,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        items: input.items,
        total,
        currency: "BDT",
        status: "awaiting_payment",
        paymentStatus: "pending",
        paymentMethod: input.paymentMethod ?? "bKash",
        leadId: input.leadId,
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
      };
      db.orders.unshift(order);
      customer.orders.push(order.id);
      customer.updatedAt = now;
      return order;
    });
  }

  async getOrder(id: string) {
    return this.read((db) => db.orders.find((item) => item.id === id) ?? null);
  }

  async listOrders(limit = 200) {
    return this.read((db) => db.orders.slice(0, limit));
  }

  async updateOrder(
    id: string,
    patch: { status?: Order["status"]; paymentStatus?: Order["paymentStatus"]; notes?: string },
  ) {
    return this.run((db) => {
      const order = db.orders.find((item) => item.id === id);
      if (!order) return null;
      if (patch.status) order.status = patch.status;
      if (patch.paymentStatus) order.paymentStatus = patch.paymentStatus;
      if (patch.notes !== undefined) order.notes = patch.notes;
      order.updatedAt = new Date().toISOString();
      return order;
    });
  }

  async addPaymentEvent(event: Omit<PaymentEvent, "id" | "createdAt">) {
    const entry: PaymentEvent = { ...event, id: randomUUID(), createdAt: new Date().toISOString() };
    return this.run((db) => {
      db.paymentEvents.unshift(entry);
      return entry;
    });
  }

  /* ─────────────────────────────── customers ─────────────────────────────── */

  async listCustomers(limit = 200) {
    return this.read((db) => db.customers.slice(0, limit));
  }

  /* ──────────────────────────────── support ──────────────────────────────── */

  async createTicket(input: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const ticket: SupportTicket = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
    return this.run((db) => {
      db.tickets.unshift(ticket);
      return ticket;
    });
  }

  async listTickets(limit = 200) {
    return this.read((db) => db.tickets.slice(0, limit));
  }

  /* ─────────────────────────────── platform ──────────────────────────────── */

  async logWebhook(entry: Omit<WebhookLogEntry, "id" | "createdAt">) {
    const record: WebhookLogEntry = { ...entry, id: randomUUID(), createdAt: new Date().toISOString() };
    return this.run((db) => {
      db.webhookLogs.unshift(record);
      db.webhookLogs = db.webhookLogs.slice(0, MAX_LOG_ENTRIES);
      return record;
    });
  }

  async listWebhookLogs(limit = 100) {
    return this.read((db) => db.webhookLogs.slice(0, limit));
  }

  async listDailyMetrics(limit = 30) {
    return this.read((db) => db.dailyMetrics.slice(0, limit));
  }

  async stats() {
    return this.read((db) => {
      const openStatuses = new Set(["inquiry", "pending_information", "awaiting_payment", "payment_verification", "confirmed", "in_production", "revision_1", "revision_2", "final_review"]);
      return {
        totalLeads: db.leads.length,
        newLeads: db.leads.filter((lead) => lead.status === "new").length,
        qualifiedLeads: db.leads.filter((lead) => ["qualified", "interested", "proposal"].includes(lead.status)).length,
        orders: db.orders.length,
        pendingPayments: db.orders.filter((order) => order.paymentStatus === "submitted" || order.paymentStatus === "pending").length,
        activeOrders: db.orders.filter((order) => openStatuses.has(order.status)).length,
        deliveredOrders: db.orders.filter((order) => ["delivered", "after_sales", "completed"].includes(order.status)).length,
        revenue: db.orders
          .filter((order) => order.paymentStatus === "verified" && order.status !== "cancelled")
          .reduce((sum, order) => sum + order.total, 0),
        audits: db.audits.length,
      };
    });
  }
}
