import { getRepository } from "@/lib/db";
import { contactSchema, fieldErrors } from "@/lib/validation/schemas";
import { emitAutomationEvent } from "@/lib/integrations/n8n";
import { leadConfirmationTemplate, sendEmail } from "@/lib/integrations/email";
import { apiError, apiSuccess, clientIdentifier, logger, rateLimit } from "@/lib/logger";

/**
 * POST /api/contact
 * Creates a CRM lead and a support ticket in one transaction so nothing is lost if
 * an inbox is unattended outside working hours.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientIdentifier(request, "contact"), { max: 8, windowMs: 60_000 });
  if (!limit.ok) return apiError("Too many requests. Please try again shortly.", 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Please check the highlighted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  const input = parsed.data;
  if (input.company_website) {
    logger.warn("contact", "Honeypot triggered");
    return apiSuccess({ id: "ignored" }, 202);
  }

  try {
    const repository = getRepository();
    const lead = await repository.createLead({
      name: input.name,
      email: input.email,
      phone: input.phone,
      source: input.source ?? "contact_form",
      channel: input.channel ?? "web",
      businessName: input.businessName,
      problem: input.subject,
      serviceInterest: input.serviceInterest,
      notes: input.message,
      status: "new",
    });

    await repository.createTicket({
      subject: input.subject,
      message: input.message,
      status: "open",
      channel: "web",
    });

    await Promise.allSettled([
      emitAutomationEvent("contact.submitted", {
        leadId: lead.id,
        subject: input.subject,
        email: lead.email,
        phone: lead.phone,
      }),
      sendEmail(leadConfirmationTemplate(lead)),
    ]);

    logger.info("contact", "Contact enquiry received", { leadId: lead.id });
    return apiSuccess({ id: lead.id }, 201);
  } catch (error) {
    logger.error("contact", "Contact submission failed", { error: String(error) });
    return apiError("We could not send your message. Please try WhatsApp instead.", 500);
  }
}
