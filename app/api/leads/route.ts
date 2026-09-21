import { getRepository } from "@/lib/db";
import { fieldErrors, leadSchema } from "@/lib/validation/schemas";
import { emitAutomationEvent } from "@/lib/integrations/n8n";
import { leadConfirmationTemplate, sendEmail } from "@/lib/integrations/email";
import { apiError, apiSuccess, clientIdentifier, logger, rateLimit } from "@/lib/logger";
import { getProduct } from "@/data/products";

/**
 * POST /api/leads
 * Generic lead capture used by product enquiry forms and any future landing page.
 * Rate limited, validated server-side, honeypot protected.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientIdentifier(request, "leads"), { max: 10, windowMs: 60_000 });
  if (!limit.ok) return apiError("Too many requests. Please try again shortly.", 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Please check the highlighted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  const input = parsed.data;
  if (input.company_website) {
    // Honeypot filled — accept silently so bots do not learn the rule.
    logger.warn("leads", "Honeypot triggered");
    return apiSuccess({ id: "ignored" }, 202);
  }

  const product = input.productInterest ? getProduct(input.productInterest) : undefined;

  try {
    const repository = getRepository();
    const lead = await repository.createLead({
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
      productInterest: product ? product.slug : input.productInterest,
      notes: input.notes,
      status: "new",
    });

    await Promise.allSettled([
      emitAutomationEvent("lead.created", {
        leadId: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        productInterest: lead.productInterest,
        problem: lead.problem,
      }),
      sendEmail(leadConfirmationTemplate(lead)),
    ]);

    logger.info("leads", "Lead created", { leadId: lead.id, product: lead.productInterest ?? null });
    return apiSuccess({ id: lead.id }, 201);
  } catch (error) {
    logger.error("leads", "Lead creation failed", { error: String(error) });
    return apiError("We could not save your enquiry. Please try again or use WhatsApp.", 500);
  }
}
