/**
 * Repository contract.
 *
 * The website never talks to a database driver directly — it talks to this interface.
 * That keeps the CRM replaceable (Build Spec §32: "Make the CRM replaceable") and lets
 * the app run on the local persistent store during development while using Supabase in
 * production without touching a single page.
 */
import type {
  AuditSubmission,
  Customer,
  DailyMetric,
  Lead,
  LeadEvent,
  LeadStatus,
  Order,
  OrderStatus,
  PaymentEvent,
  PaymentStatus,
  SupportTicket,
  WebhookLogEntry,
} from "@/types";

export type AuditCreateInput = Omit<AuditSubmission, "id" | "createdAt">;

export interface LeadCreateInput {
  name: string;
  email: string;
  phone: string;
  source?: string;
  channel?: string;
  businessName?: string;
  businessStage?: string;
  goal?: string;
  problem?: string;
  serviceInterest?: string;
  productInterest?: string;
  status?: LeadStatus;
  score?: number;
  owner?: string;
  notes?: string;
  auditSubmissionId?: string;
}

export interface LeadUpdateInput {
  status?: LeadStatus;
  owner?: string;
  notes?: string;
  score?: number;
  nextFollowupAt?: string | null;
  lastContactAt?: string | null;
}

export interface OrderCreateInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName?: string;
  items: { productId: string; productSlug: string; productName: string; quantity: number; unitPrice: number }[];
  leadId?: string;
  notes?: string;
  paymentMethod?: string;
}

export interface LeadQuery {
  status?: LeadStatus | "all";
  search?: string;
  productInterest?: string;
  source?: string;
  limit?: number;
}

export interface Repository {
  readonly driver: "local" | "supabase";

  /* Audit */
  createAudit(input: AuditCreateInput): Promise<AuditSubmission>;
  getAudit(id: string): Promise<AuditSubmission | null>;
  listAudits(limit?: number): Promise<AuditSubmission[]>;

  /* Leads / CRM */
  createLead(input: LeadCreateInput): Promise<Lead>;
  getLead(id: string): Promise<Lead | null>;
  findLeadByEmail(email: string): Promise<Lead | null>;
  listLeads(query?: LeadQuery): Promise<Lead[]>;
  updateLead(id: string, patch: LeadUpdateInput): Promise<Lead | null>;
  addLeadEvent(event: Omit<LeadEvent, "id" | "createdAt">): Promise<LeadEvent>;
  listLeadEvents(leadId: string): Promise<LeadEvent[]>;

  /* Orders */
  createOrder(input: OrderCreateInput): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  listOrders(limit?: number): Promise<Order[]>;
  updateOrder(id: string, patch: { status?: OrderStatus; paymentStatus?: PaymentStatus; notes?: string }): Promise<Order | null>;
  addPaymentEvent(event: Omit<PaymentEvent, "id" | "createdAt">): Promise<PaymentEvent>;

  /* Customers */
  listCustomers(limit?: number): Promise<Customer[]>;

  /* Support */
  createTicket(input: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket>;
  listTickets(limit?: number): Promise<SupportTicket[]>;

  /* Platform */
  logWebhook(entry: Omit<WebhookLogEntry, "id" | "createdAt">): Promise<WebhookLogEntry>;
  listWebhookLogs(limit?: number): Promise<WebhookLogEntry[]>;
  listDailyMetrics(limit?: number): Promise<DailyMetric[]>;
  /** Lead + order counts used by the admin dashboard. */
  stats(): Promise<{
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    orders: number;
    pendingPayments: number;
    activeOrders: number;
    deliveredOrders: number;
    revenue: number;
    audits: number;
  }>;
}
