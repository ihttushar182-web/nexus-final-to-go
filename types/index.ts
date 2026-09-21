/** Central domain types for the Nexus Lift platform. */

export type Locale = "bn" | "en";

/** A string that exists in both site languages. */
export interface LocalizedText {
  bn: string;
  en: string;
}

export interface LocalizedList {
  bn: string[];
  en: string[];
}

export type Currency = "BDT";

export type LayerId =
  | "identity"
  | "structure"
  | "operations"
  | "growth"
  | "intelligence"
  | "control";

export interface BusinessLayer {
  id: LayerId;
  order: number;
  code: string;
  name: LocalizedText;
  question: LocalizedText;
  questionBn: string;
  summary: LocalizedText;
  includes: LocalizedList;
  examples: LocalizedList;
  /** Short label shown on the audit bars / dashboard. */
  metric: LocalizedText;
}

export type SolutionCategoryId =
  | "brand-identity"
  | "business-structure"
  | "sop-operations"
  | "website-conversion"
  | "crm-customer-systems"
  | "marketing-infrastructure"
  | "business-os-dashboards"
  | "ai-agents-assistants"
  | "automation-integrations"
  | "hosting-infrastructure"
  | "custom-technology";

export interface SolutionCategory {
  id: SolutionCategoryId;
  order: number;
  slug: string;
  name: LocalizedText;
  headline: LocalizedText;
  summary: LocalizedText;
  layer: LayerId | "platform";
  icon: string;
  capabilities: LocalizedList;
  deliverables: LocalizedList;
  bestFor: LocalizedText;
  outcomes: LocalizedList;
  productSlugs: string[];
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
}

export type ProductStatus = "active" | "coming-soon" | "draft";
export type BillingPeriod = "one-time" | "monthly";

export interface ProductProcessStep {
  step: number;
  title: LocalizedText;
  description: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  category: SolutionCategoryId;
  layer: LayerId | "platform";
  shortDescription: LocalizedText;
  description: LocalizedText;
  targetCustomer: LocalizedText;
  problem: LocalizedText;
  outcome: LocalizedText;
  features: LocalizedList;
  deliverables: LocalizedList;
  process: ProductProcessStep[];
  deliveryTime: LocalizedText;
  deliveryFormat: LocalizedText;
  revisionCount: number | null;
  revisionPolicy: LocalizedText;
  requirements: LocalizedList;
  originalPrice: number | null;
  currentPrice: number | null;
  priceNote: LocalizedText | null;
  currency: Currency;
  billing: BillingPeriod;
  status: ProductStatus;
  badge: LocalizedText | null;
  featured: boolean;
  faq: string[];
  relatedProducts: string[];
  upsell: string | null;
  crossSell: string[];
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
}

export interface FaqItem {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
  category: "general" | "audit" | "product" | "payment" | "support" | "hosting";
  /** Where the answer originally came from, so nothing is invented. */
  source?: string;
}

export interface CaseStudy {
  slug: string;
  industry: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  context: LocalizedText;
  problem: LocalizedText;
  diagnosis: LocalizedText;
  system: LocalizedText;
  implementation: LocalizedText;
  result: LocalizedText;
  metrics: { label: LocalizedText; before: string; after: string }[];
  evidenceNote: LocalizedText;
  lesson: LocalizedText;
  timeline: LocalizedText;
  featured: boolean;
}

export interface InsightArticle {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: InsightCategory;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  featured: boolean;
  schemaType: "Article" | "BlogPosting";
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  body: LocalizedSection[];
}

export type InsightCategory =
  | "business-systems"
  | "brand"
  | "operations"
  | "growth"
  | "crm"
  | "automation"
  | "ai"
  | "seo"
  | "hosting"
  | "research"
  | "case-studies";

export interface LocalizedSection {
  heading: LocalizedText;
  paragraphs: { bn: string[]; en: string[] };
  bullets?: { bn: string[]; en: string[] };
  callout?: LocalizedText;
  source?: string;
}

export interface PolicySection {
  heading: LocalizedText;
  body: LocalizedList;
}

export interface Policy {
  slug: string;
  title: LocalizedText;
  updatedAt: string;
  intro: LocalizedText;
  sections: PolicySection[];
}

/* ---------------------------------- Audit --------------------------------- */

export type AuditAnswer = "yes" | "partial" | "no";

export interface AuditLayerAnswer {
  layer: LayerId;
  answer: AuditAnswer;
  score: number;
}

export interface AuditSnapshot {
  total: number;
  maxTotal: number;
  percent: number;
  layerScores: AuditLayerAnswer[];
  weakestLayer: LayerId;
  priorityLayer: LayerId;
  priorityReason: LocalizedText;
  strongestLayer: LayerId;
}

export interface AuditSubmission {
  id: string;
  businessName: string;
  businessLink?: string;
  businessStage: string;
  teamSize: string;
  answers: Record<LayerId, AuditAnswer>;
  biggestProblem: string;
  currentTools?: string;
  goal: string;
  name: string;
  email: string;
  whatsapp: string;
  source?: string;
  utm?: Record<string, string>;
  snapshot: AuditSnapshot;
  createdAt: string;
}

/* ---------------------------------- CRM ----------------------------------- */

export type LeadStatus =
  | "new"
  | "qualified"
  | "contacted"
  | "interested"
  | "proposal"
  | "won"
  | "lost"
  | "nurture";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  channel: string;
  businessName?: string;
  businessStage?: string;
  goal?: string;
  problem?: string;
  serviceInterest?: string;
  productInterest?: string;
  status: LeadStatus;
  score: number;
  owner?: string;
  lastContactAt?: string;
  nextFollowupAt?: string;
  notes?: string;
  auditSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadEvent {
  id: string;
  leadId: string;
  type: "created" | "status_change" | "note" | "contact" | "audit" | "order";
  message: string;
  actor?: string;
  createdAt: string;
}

export type OrderStatus =
  | "inquiry"
  | "pending_information"
  | "awaiting_payment"
  | "payment_verification"
  | "confirmed"
  | "in_production"
  | "revision_1"
  | "revision_2"
  | "final_review"
  | "delivered"
  | "after_sales"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "submitted" | "verified" | "rejected" | "adjustment_required";

export interface OrderItem {
  productId: string;
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  currency: Currency;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  paymentReference?: string;
  leadId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentEvent {
  id: string;
  orderId: string;
  type: "submitted" | "verified" | "rejected" | "adjustment_required" | "note";
  amount: number;
  method: string;
  reference?: string;
  actor?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  orders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  customerId?: string;
  orderId?: string;
  subject: string;
  message: string;
  status: "open" | "pending" | "resolved" | "closed";
  channel: "whatsapp" | "messenger" | "email" | "web";
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  direction: "inbound" | "outbound";
  channel: "whatsapp" | "messenger" | "email" | "web";
  body: string;
  createdAt: string;
}

export interface WebhookLogEntry {
  id: string;
  endpoint: string;
  event: string;
  status: "accepted" | "rejected" | "error";
  detail?: string;
  payload?: unknown;
  createdAt: string;
}

export interface DailyMetric {
  date: string;
  mrr: number;
  activeClients: number;
  newLeads: number;
  dealsWon: number;
  openTickets: number;
}
