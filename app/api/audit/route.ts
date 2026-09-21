import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { buildSnapshot } from "@/lib/audit/scoring";
import { auditSubmissionSchema, fieldErrors } from "@/lib/validation/schemas";
import { findGoalOption, findProblemOption } from "@/data/audit-form";
import { emitAutomationEvent } from "@/lib/integrations/n8n";
import { auditConfirmationTemplate, sendEmail } from "@/lib/integrations/email";
import { apiError, apiSuccess, clientIdentifier, logger, rateLimit } from "@/lib/logger";
import { absoluteUrl } from "@/lib/utils";
import { layerIds } from "@/data/layers";

/**
 * POST /api/audit
 * Validates, scores, stores the submission, creates (or updates) the CRM lead,
 * sends the confirmation email and forwards the event to the automation layer.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientIdentifier(request, "audit"), { max: 8, windowMs: 60_000 });
  if (!limit.ok) {
    return apiError("Too many submissions from this address. Please try again shortly.", 429);
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = auditSubmissionSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Please check the highlighted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  const input = parsed.data;
  const problemOption = findProblemOption(input.biggestProblem);
  const goalOption = findGoalOption(input.goal);
  const answers = Object.fromEntries(layerIds.map((layer) => [layer, input.answers[layer]])) as typeof input.answers;

  const snapshot = buildSnapshot(answers, {
    problemLayer: problemOption?.layer,
    goalLayer: goalOption?.layer,
  });

  try {
    const repository = getRepository();
    const submission = await repository.createAudit({
      businessName: input.businessName,
      businessLink: input.businessLink || undefined,
      businessStage: input.businessStage,
      teamSize: input.teamSize,
      answers,
      biggestProblem: input.biggestProblem,
      currentTools: input.currentTools || undefined,
      goal: input.goal,
      name: input.name,
      email: input.email,
      whatsapp: input.whatsapp,
      source: input.source ?? "website",
      utm: input.utm,
      snapshot,
    });

    // CRM capture. Human follow-up is decided by the team, not the system.
    const lead = await repository.createLead({
      name: input.name,
      email: input.email,
      phone: input.whatsapp,
      source: input.source ?? "website",
      channel: "web",
      businessName: input.businessName,
      businessStage: input.businessStage,
      goal: goalOption?.id,
      problem: problemOption?.id,
      serviceInterest: snapshot.priorityLayer,
      status: "new",
      score: snapshot.percent,
      auditSubmissionId: submission.id,
      notes: input.currentTools ? `Tools: ${input.currentTools}` : undefined,
    });

    logger.info("audit", "Audit submitted", {
      auditId: submission.id,
      leadId: lead.id,
      priority: snapshot.priorityLayer,
      percent: snapshot.percent,
    });

    await Promise.allSettled([
      emitAutomationEvent("audit.submitted", {
        auditId: submission.id,
        leadId: lead.id,
        priorityLayer: snapshot.priorityLayer,
        totalScore: snapshot.total,
        percent: snapshot.percent,
        businessStage: submission.businessStage,
        teamSize: submission.teamSize,
        email: submission.email,
        whatsapp: submission.whatsapp,
      }),
      sendEmail(auditConfirmationTemplate(submission, absoluteUrl(`/business-audit/result/${submission.id}`))),
    ]);

    return apiSuccess({ id: submission.id, priorityLayer: snapshot.priorityLayer }, 201);
  } catch (error) {
    logger.error("audit", "Audit submission failed", { error: String(error) });
    return apiError("We could not save your audit right now. Please try again.", 500);
  }
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Method not allowed" }, { status: 405 });
}
