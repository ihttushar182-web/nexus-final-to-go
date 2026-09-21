import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";
import type { AuditSubmission, Lead, Order } from "@/types";

/**
 * Transactional email abstraction (Build Spec §34).
 *
 * No single provider is hard-coded. `EMAIL_PROVIDER=console` (default) logs the message
 * so development and preview work end to end; setting `EMAIL_PROVIDER_KEY` and swapping
 * the transport below is the only change needed to send real mail.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  template: EmailTemplateId;
  meta?: Record<string, unknown>;
}

export type EmailTemplateId =
  | "audit_confirmation"
  | "lead_confirmation"
  | "contact_confirmation"
  | "order_confirmation"
  | "payment_received"
  | "order_status"
  | "delivery"
  | "after_sales";

export interface EmailProvider {
  readonly id: string;
  send(message: EmailMessage): Promise<{ ok: boolean; id?: string; error?: string }>;
}

/** Default transport: structured log only — never claims a mail was delivered. */
const consoleProvider: EmailProvider = {
  id: "console",
  async send(message) {
    logger.info("email", `[${message.template}] queued for ${message.to}`, { subject: message.subject });
    return { ok: true, id: `console-${Date.now()}` };
  },
};

let provider: EmailProvider = consoleProvider;

export function configureEmailProvider(next: EmailProvider) {
  provider = next;
}

export function getEmailProvider() {
  return provider;
}

export async function sendEmail(message: EmailMessage) {
  try {
    return await provider.send(message);
  } catch (error) {
    logger.error("email", "Failed to send email", { template: message.template, error: String(error) });
    return { ok: false, error: String(error) };
  }
}


/* ─────────────────────────────── templates ────────────────────────────────── */

export function auditConfirmationTemplate(submission: AuditSubmission, resultUrl: string): EmailMessage {
  const priority = submission.snapshot.priorityLayer.toUpperCase();
  return {
    to: submission.email,
    template: "audit_confirmation",
    subject: `আপনার Business Snapshot প্রস্তুত ✅ | Next Priority: ${priority}`,
    text: [
      `Hi ${submission.name},`,
      "",
      "আপনার Free Business Audit সম্পন্ন হয়েছে।",
      `Next Priority: ${priority}`,
      "",
      `Snapshot দেখুন: ${resultUrl}`,
      "",
      "চাইলে একটি ১৫ মিনিটের Strategy Call করতে পারেন (সম্পূর্ণ Free)।",
      "",
      "Regards,",
      "Team Nexus Lift",
      siteConfig.tagline.bn,
    ].join("\n"),
    meta: { submissionId: submission.id, priority },
  };
}

export function leadConfirmationTemplate(lead: Lead): EmailMessage {
  return {
    to: lead.email,
    template: "lead_confirmation",
    subject: "আমরা আপনার Message পেয়েছি ✅ | Nexus Lift",
    text: [
      `Hi ${lead.name},`,
      "",
      "আপনার Enquiry আমাদের কাছে পৌঁছেছে।",
      lead.productInterest ? `Product interest: ${lead.productInterest}` : "",
      "",
      `আমাদের কর্মঘণ্টা: ${siteConfig.businessHours.display.bn}`,
      "কর্মঘণ্টার বাইরে Message করলে উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হবে।",
      "",
      `WhatsApp: ${siteConfig.phoneDisplay}`,
      `Email: ${siteConfig.email}`,
      "",
      "Regards,",
      "Team Nexus Lift",
    ]
      .filter(Boolean)
      .join("\n"),
    meta: { leadId: lead.id },
  };
}

export function orderConfirmationTemplate(order: Order): EmailMessage {
  return {
    to: order.customerEmail,
    template: "order_confirmation",
    subject: `Order ${order.orderNumber} — পেমেন্ট নিশ্চিতকরণের অপেক্ষায়`,
    text: [
      `Hi ${order.customerName},`,
      "",
      `আপনার Order নম্বর: ${order.orderNumber}`,
      `মোট: ${siteConfig.currencySymbol}${order.total}`,
      "",
      "Status: Awaiting payment verification.",
      "পেমেন্ট নিশ্চিত না হওয়া পর্যন্ত Production শুরু হয় না।",
      "",
      "Regards,",
      "Team Nexus Lift",
    ].join("\n"),
    meta: { orderId: order.id, orderNumber: order.orderNumber },
  };
}

export function paymentReceivedTemplate(order: Order, reference: string): EmailMessage {
  return {
    to: order.customerEmail,
    template: "payment_received",
    subject: `পেমেন্ট তথ্য পেয়েছি ✅ | Order ${order.orderNumber}`,
    text: [
      `Hi ${order.customerName},`,
      "",
      `আপনার দেওয়া Transaction Reference: ${reference}`,
      "",
      "আমাদের টিম এই পেমেন্টটি যাচাই করছে। যাচাই সম্পন্ন হওয়ার পর Production শুরু হবে এবং আমরা আপনাকে জানাবো।",
      "",
      "Regards,",
      "Team Nexus Lift",
    ].join("\n"),
    meta: { orderId: order.id },
  };
}
