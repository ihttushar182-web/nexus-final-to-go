import { getRepository } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { fieldErrors, leadUpdateSchema } from "@/lib/validation/schemas";
import { apiError, apiSuccess, logger } from "@/lib/logger";

/** PATCH /api/admin/leads/:id — CRM update (status, owner, notes, follow-up). */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = leadUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Please check the submitted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  try {
    const repository = getRepository();
    const existing = await repository.getLead(id);
    if (!existing) return apiError("Lead not found", 404);

    const patch = parsed.data;
    const lead = await repository.updateLead(id, {
      ...patch,
      // Touching a lead from the admin counts as contact activity.
      lastContactAt: patch.status && patch.status !== "new" ? new Date().toISOString() : undefined,
    });

    if (patch.notes) {
      await repository.addLeadEvent({
        leadId: id,
        type: "note",
        message: patch.notes,
        actor: session.email,
      });
    }

    logger.info("admin", "Lead updated", { leadId: id, actor: session.email, status: patch.status ?? existing.status });
    return apiSuccess({ lead });
  } catch (error) {
    logger.error("admin", "Lead update failed", { error: String(error) });
    return apiError("Could not update the lead", 500);
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return apiError("Unauthorized", 401);

  const { id } = await params;
  const repository = getRepository();
  const lead = await repository.getLead(id);
  if (!lead) return apiError("Lead not found", 404);
  const events = await repository.listLeadEvents(id);
  return apiSuccess({ lead, events });
}
