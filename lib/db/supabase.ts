import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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
 * Supabase adapter.
 *
 * Uses the service-role key and therefore must only ever be constructed on the server
 * (route handlers, server components, admin actions). Never import this module from a
 * client component — the key would leak into the browser bundle.
 */
export class SupabaseRepository implements Repository {
  readonly driver = "supabase" as const;
  private client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SupabaseRepository requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
    }
    this.client = createClient(url, key, { auth: { persistSession: false } });
  }

  private get table() {
    return this.client.from.bind(this.client);
  }

  /* ───────────────────────────────── audit ───────────────────────────────── */

  async createAudit(input: AuditCreateInput): Promise<AuditSubmission> {
    const { data, error } = await this.table("audit_submissions")
      .insert({
        business_name: input.businessName,
        business_link: input.businessLink ?? null,
        business_stage: input.businessStage,
        team_size: input.teamSize,
        biggest_problem: input.biggestProblem,
        current_tools: input.currentTools ?? null,
        goal: input.goal,
        name: input.name,
        email: input.email,
        whatsapp: input.whatsapp,
        total_score: input.snapshot.total,
        percent_score: input.snapshot.percent,
        weakest_layer: input.snapshot.weakestLayer,
        priority_layer: input.snapshot.priorityLayer,
        strongest_layer: input.snapshot.strongestLayer,
        priority_reason_bn: input.snapshot.priorityReason.bn,
        priority_reason_en: input.snapshot.priorityReason.en,
        source: input.source ?? "website",
        utm: input.utm ?? {},
      })
      .select("id, created_at")
      .single();
    if (error) throw error;

    await this.table("audit_answers").insert(
      input.snapshot.layerScores.map((item) => ({
        submission_id: data.id,
        layer: item.layer,
        answer: item.answer,
        score: item.score,
      })),
    );

    return { ...input, id: data.id, createdAt: data.created_at };
  }

  async getAudit(id: string): Promise<AuditSubmission | null> {
    const { data, error } = await this.table("audit_submissions").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const { data: answers } = await this.table("audit_answers").select("*").eq("submission_id", id);
    return mapAudit(data, answers ?? []);
  }

  async listAudits(limit = 200): Promise<AuditSubmission[]> {
    const { data, error } = await this.table("audit_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => mapAudit(row, []));
  }

  /* ───────────────────────────────── leads ───────────────────────────────── */

  async createLead(input: LeadCreateInput): Promise<Lead> {
    const { data, error } = await this.table("leads")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        source: input.source ?? "website",
        channel: input.channel ?? "web",
        business_name: input.businessName ?? null,
        business_stage: input.businessStage ?? null,
        goal: input.goal ?? null,
        problem: input.problem ?? null,
        service_interest: input.serviceInterest ?? null,
        product_interest: input.productInterest ?? null,
        status: input.status ?? "new",
        score: input.score ?? 0,
        owner: input.owner ?? null,
        notes: input.notes ?? null,
        audit_submission_id: input.auditSubmissionId ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return mapLead(data);
  }

  async getLead(id: string): Promise<Lead | null> {
    const { data, error } = await this.table("leads").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? mapLead(data) : null;
  }

  async findLeadByEmail(email: string): Promise<Lead | null> {
    const { data, error } = await this.table("leads").select("*").ilike("email", email).maybeSingle();
    if (error) throw error;
    return data ? mapLead(data) : null;
  }

  async listLeads(query: LeadQuery = {}): Promise<Lead[]> {
    let request = this.table("leads").select("*").order("created_at", { ascending: false }).limit(query.limit ?? 200);
    if (query.status && query.status !== "all") request = request.eq("status", query.status);
    if (query.productInterest) request = request.eq("product_interest", query.productInterest);
    if (query.source) request = request.eq("source", query.source);
    if (query.search) {
      const term = `%${query.search}%`;
      request = request.or(`name.ilike.${term},email.ilike.${term},phone.ilike.${term},business_name.ilike.${term}`);
    }
    const { data, error } = await request;
    if (error) throw error;
    return (data ?? []).map(mapLead);
  }

  async updateLead(id: string, patch: LeadUpdateInput): Promise<Lead | null> {
    const { data, error } = await this.table("leads")
      .update({
        ...(patch.status ? { status: patch.status } : {}),
        ...(patch.owner !== undefined ? { owner: patch.owner } : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
        ...(patch.score !== undefined ? { score: patch.score } : {}),
        ...(patch.nextFollowupAt !== undefined ? { next_followup_at: patch.nextFollowupAt } : {}),
        ...(patch.lastContactAt !== undefined ? { last_contact_at: patch.lastContactAt } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data ? mapLead(data) : null;
  }

  async addLeadEvent(event: Omit<LeadEvent, "id" | "createdAt">): Promise<LeadEvent> {
    const { data, error } = await this.table("lead_events")
      .insert({ lead_id: event.leadId, type: event.type, message: event.message, actor: event.actor ?? null })
      .select("*")
      .single();
    if (error) throw error;
    return { id: data.id, leadId: data.lead_id, type: data.type, message: data.message, actor: data.actor, createdAt: data.created_at };
  }

  async listLeadEvents(leadId: string): Promise<LeadEvent[]> {
    const { data, error } = await this.table("lead_events")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      leadId: row.lead_id,
      type: row.type,
      message: row.message,
      actor: row.actor,
      createdAt: row.created_at,
    }));
  }

  /* ───────────────────────────────── orders ──────────────────────────────── */

  async createOrder(input: OrderCreateInput): Promise<Order> {
    const { data: customer, error: customerError } = await this.table("customers")
      .upsert(
        {
          name: input.customerName,
          email: input.customerEmail,
          phone: input.customerPhone,
          business_name: input.businessName ?? null,
        },
        { onConflict: "email" },
      )
      .select("*")
      .single();
    if (customerError) throw customerError;

    const total = input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const orderNumber = `NL-${Date.now().toString().slice(-6)}`;
    const { data, error } = await this.table("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customer.id,
        lead_id: input.leadId ?? null,
        total,
        payment_method: input.paymentMethod ?? "bKash",
        notes: input.notes ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;

    await this.table("order_items").insert(
      input.items.map((item) => ({
        order_id: data.id,
        product_id: item.productId,
        product_slug: item.productSlug,
        product_name: item.productName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      })),
    );

    return mapOrder({ ...data, items: input.items, customer_name: input.customerName, customer_email: input.customerEmail, customer_phone: input.customerPhone });
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await this.table("orders")
      .select("*, customers(name, email, phone), order_items(*)")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapOrder(data) : null;
  }

  async listOrders(limit = 200): Promise<Order[]> {
    const { data, error } = await this.table("orders")
      .select("*, customers(name, email, phone), order_items(*)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapOrder);
  }

  async updateOrder(id: string, patch: { status?: Order["status"]; paymentStatus?: Order["paymentStatus"]; notes?: string }) {
    const { data, error } = await this.table("orders")
      .update({
        ...(patch.status ? { status: patch.status } : {}),
        ...(patch.paymentStatus ? { payment_status: patch.paymentStatus } : {}),
        ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, customers(name, email, phone), order_items(*)")
      .maybeSingle();
    if (error) throw error;
    return data ? mapOrder(data) : null;
  }

  async addPaymentEvent(event: Omit<PaymentEvent, "id" | "createdAt">): Promise<PaymentEvent> {
    const { data, error } = await this.table("payment_events")
      .insert({
        order_id: event.orderId,
        type: event.type,
        amount: event.amount,
        method: event.method,
        reference: event.reference ?? null,
        actor: event.actor ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      orderId: data.order_id,
      type: data.type,
      amount: data.amount,
      method: data.method,
      reference: data.reference,
      actor: data.actor,
      createdAt: data.created_at,
    };
  }

  /* ─────────────────────────────── customers ─────────────────────────────── */

  async listCustomers(limit = 200): Promise<Customer[]> {
    const { data: customers, error } = await this.table("customers").select("*").limit(limit);
    if (error) throw error;
    const { data: orders } = await this.table("orders").select("id, customer_id");
    return (customers ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      businessName: row.business_name,
      orders: (orders ?? []).filter((order) => order.customer_id === row.id).map((order) => order.id),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /* ──────────────────────────────── support ──────────────────────────────── */

  async createTicket(input: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
    const { data, error } = await this.table("support_tickets")
      .insert({
        customer_id: input.customerId ?? null,
        order_id: input.orderId ?? null,
        subject: input.subject,
        message: input.message,
        status: input.status,
        channel: input.channel,
      })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      customerId: data.customer_id,
      orderId: data.order_id,
      subject: data.subject,
      message: data.message,
      status: data.status,
      channel: data.channel,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  async listTickets(limit = 200): Promise<SupportTicket[]> {
    const { data, error } = await this.table("support_tickets")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      customerId: row.customer_id,
      orderId: row.order_id,
      subject: row.subject,
      message: row.message,
      status: row.status,
      channel: row.channel,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /* ─────────────────────────────── platform ──────────────────────────────── */

  async logWebhook(entry: Omit<WebhookLogEntry, "id" | "createdAt">): Promise<WebhookLogEntry> {
    const { data, error } = await this.table("webhook_logs")
      .insert({
        endpoint: entry.endpoint,
        event: entry.event,
        status: entry.status,
        detail: entry.detail ?? null,
        payload: (entry.payload as object) ?? null,
      })
      .select("*")
      .single();
    if (error) throw error;
    return {
      id: data.id,
      endpoint: data.endpoint,
      event: data.event,
      status: data.status,
      detail: data.detail,
      payload: data.payload,
      createdAt: data.created_at,
    };
  }

  async listWebhookLogs(limit = 100): Promise<WebhookLogEntry[]> {
    const { data, error } = await this.table("webhook_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      endpoint: row.endpoint,
      event: row.event,
      status: row.status,
      detail: row.detail,
      payload: row.payload,
      createdAt: row.created_at,
    }));
  }

  async listDailyMetrics(limit = 30): Promise<DailyMetric[]> {
    const { data, error } = await this.table("daily_metrics")
      .select("*")
      .order("date", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row) => ({
      date: row.date,
      mrr: Number(row.mrr),
      activeClients: row.active_clients,
      newLeads: row.new_leads,
      dealsWon: row.deals_won,
      openTickets: row.open_tickets,
    }));
  }

  async stats() {
    const [leads, orders, audits] = await Promise.all([
      this.table("leads").select("status"),
      this.table("orders").select("status, payment_status, total"),
      this.table("audit_submissions").select("id"),
    ]);
    const leadRows = leads.data ?? [];
    const orderRows = orders.data ?? [];
    const activeStatuses = new Set(["inquiry", "pending_information", "awaiting_payment", "payment_verification", "confirmed", "in_production", "revision_1", "revision_2", "final_review"]);
    return {
      totalLeads: leadRows.length,
      newLeads: leadRows.filter((row) => row.status === "new").length,
      qualifiedLeads: leadRows.filter((row) => ["qualified", "interested", "proposal"].includes(row.status)).length,
      orders: orderRows.length,
      pendingPayments: orderRows.filter((row) => ["pending", "submitted"].includes(row.payment_status)).length,
      activeOrders: orderRows.filter((row) => activeStatuses.has(row.status)).length,
      deliveredOrders: orderRows.filter((row) => ["delivered", "after_sales", "completed"].includes(row.status)).length,
      revenue: orderRows
        .filter((row) => row.payment_status === "verified" && row.status !== "cancelled")
        .reduce((sum, row) => sum + Number(row.total), 0),
      audits: audits.data?.length ?? 0,
    };
  }
}

/* ─────────────────────────────── row mappers ───────────────────────────────── */

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapAudit(row: any, answers: any[]): AuditSubmission {
  const layerScores = answers.length
    ? answers.map((answer) => ({ layer: answer.layer, answer: answer.answer, score: answer.score }))
    : [];
  return {
    id: row.id,
    businessName: row.business_name,
    businessLink: row.business_link ?? undefined,
    businessStage: row.business_stage,
    teamSize: row.team_size,
    answers: Object.fromEntries(layerScores.map((item) => [item.layer, item.answer])),
    biggestProblem: row.biggest_problem,
    currentTools: row.current_tools ?? undefined,
    goal: row.goal,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    source: row.source,
    utm: row.utm ?? undefined,
    createdAt: row.created_at,
    snapshot: {
      total: row.total_score,
      maxTotal: 60,
      percent: row.percent_score,
      layerScores,
      weakestLayer: row.weakest_layer,
      priorityLayer: row.priority_layer,
      strongestLayer: row.strongest_layer,
      priorityReason: { bn: row.priority_reason_bn ?? "", en: row.priority_reason_en ?? "" },
    },
  };
}

function mapLead(row: any): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    source: row.source,
    channel: row.channel,
    businessName: row.business_name ?? undefined,
    businessStage: row.business_stage ?? undefined,
    goal: row.goal ?? undefined,
    problem: row.problem ?? undefined,
    serviceInterest: row.service_interest ?? undefined,
    productInterest: row.product_interest ?? undefined,
    status: row.status,
    score: row.score,
    owner: row.owner ?? undefined,
    lastContactAt: row.last_contact_at ?? undefined,
    nextFollowupAt: row.next_followup_at ?? undefined,
    notes: row.notes ?? undefined,
    auditSubmissionId: row.audit_submission_id ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrder(row: any): Order {
  const customer = row.customers ?? {};
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    customerName: customer.name ?? row.customer_name ?? "",
    customerEmail: customer.email ?? row.customer_email ?? "",
    customerPhone: customer.phone ?? row.customer_phone ?? "",
    items: (row.order_items ?? row.items ?? []).map((item: any) => ({
      productId: item.product_id ?? item.productId,
      productSlug: item.product_slug ?? item.productSlug,
      productName: item.product_name ?? item.productName,
      quantity: item.quantity,
      unitPrice: Number(item.unit_price ?? item.unitPrice),
    })),
    total: Number(row.total),
    currency: row.currency ?? "BDT",
    status: row.status,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method ?? undefined,
    paymentReference: row.payment_reference ?? undefined,
    leadId: row.lead_id ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
