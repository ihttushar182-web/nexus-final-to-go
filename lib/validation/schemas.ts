import { z } from "zod";
import { layerIds } from "@/data/layers";

/**
 * Server-side validation (Build Spec §43).
 * Every public endpoint validates with these schemas — client validation is a UX
 * convenience, never the security boundary.
 */

const phone = z
  .string()
  .trim()
  .min(8, "Phone number is too short")
  .max(20, "Phone number is too long")
  .regex(/^[+\d][\d\s-]{7,19}$/, "Enter a valid phone number");

const email = z.string().trim().toLowerCase().email("Enter a valid email address").max(160);

export const localeSchema = z.enum(["bn", "en"]);

export const auditAnswerSchema = z.enum(["yes", "partial", "no"]);

export const auditSubmissionSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required").max(160),
  businessLink: z.string().trim().max(200).optional().or(z.literal("")),
  businessStage: z.string().trim().min(1, "Select your business stage").max(60),
  teamSize: z.string().trim().min(1, "Select your team size").max(60),
  answers: z.object(
    Object.fromEntries(layerIds.map((id) => [id, auditAnswerSchema])) as Record<
      (typeof layerIds)[number],
      typeof auditAnswerSchema
    >,
  ),
  biggestProblem: z.string().trim().min(1, "Select your biggest problem").max(80),
  currentTools: z.string().trim().max(240).optional().or(z.literal("")),
  goal: z.string().trim().min(1, "Select your six-month goal").max(80),
  name: z.string().trim().min(2, "Your name is required").max(120),
  email,
  whatsapp: phone,
  source: z.string().trim().max(60).optional(),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  locale: localeSchema.optional(),
});
export type AuditSubmissionInput = z.infer<typeof auditSubmissionSchema>;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email,
  phone,
  source: z.string().trim().max(60).optional(),
  channel: z.enum(["web", "whatsapp", "messenger", "email", "phone"]).optional(),
  businessName: z.string().trim().max(160).optional(),
  businessStage: z.string().trim().max(60).optional(),
  goal: z.string().trim().max(200).optional(),
  problem: z.string().trim().max(600).optional(),
  serviceInterest: z.string().trim().max(120).optional(),
  productInterest: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(1000).optional(),
  /** Honeypot — must stay empty. */
  company_website: z.string().max(0).optional().or(z.literal("")),
  utm: z.record(z.string(), z.string().max(200)).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const contactSchema = leadSchema.extend({
  subject: z.string().trim().min(2, "Subject is required").max(160),
  message: z.string().trim().min(10, "Please describe your enquiry").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerEmail: email,
  customerPhone: phone,
  businessName: z.string().trim().max(160).optional(),
  productSlug: z.string().trim().min(1).max(120),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
  notes: z.string().trim().max(1000).optional(),
  paymentMethod: z.string().trim().max(40).optional(),
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export const paymentSubmissionSchema = z.object({
  orderId: z.string().trim().min(1).max(80),
  reference: z.string().trim().min(4, "Transaction ID is required").max(80),
  amount: z.coerce.number().nonnegative().optional(),
  method: z.string().trim().max(40).default("bKash"),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(160),
  password: z.string().min(6, "Password is required").max(200),
});

export const leadStatusSchema = z.enum([
  "new",
  "qualified",
  "contacted",
  "interested",
  "proposal",
  "won",
  "lost",
  "nurture",
]);

export const orderStatusSchema = z.enum([
  "inquiry",
  "pending_information",
  "awaiting_payment",
  "payment_verification",
  "confirmed",
  "in_production",
  "revision_1",
  "revision_2",
  "final_review",
  "delivered",
  "after_sales",
  "completed",
  "cancelled",
]);

export const paymentStatusSchema = z.enum(["pending", "submitted", "verified", "rejected", "adjustment_required"]);

export const leadUpdateSchema = z.object({
  status: leadStatusSchema.optional(),
  owner: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(2000).optional(),
  score: z.coerce.number().int().min(0).max(100).optional(),
  nextFollowupAt: z.string().trim().max(40).nullable().optional(),
});

export const orderUpdateSchema = z.object({
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const webhookEnvelopeSchema = z.object({
  event: z.string().trim().min(1).max(80),
  payload: z.unknown().optional(),
  idempotencyKey: z.string().trim().max(120).optional(),
  occurredAt: z.string().trim().max(40).optional(),
});

/** Flatten a ZodError into a field → message map for the UI. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const output: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "form";
    if (!output[path]) output[path] = issue.message;
  }
  return output;
}
