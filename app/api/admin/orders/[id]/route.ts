import { getRepository } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { fieldErrors, orderUpdateSchema } from "@/lib/validation/schemas";
import { emitAutomationEvent } from "@/lib/integrations/n8n";
import { apiError, apiSuccess, logger } from "@/lib/logger";

/**
 * PATCH /api/admin/orders/:id
 * Order state changes and payment verification. Only this authenticated path can mark
 * a payment as verified — a customer submission never can (Build Spec §30).
 */
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

  const parsed = orderUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Please check the submitted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  try {
    const repository = getRepository();
    const existing = await repository.getOrder(id);
    if (!existing) return apiError("Order not found", 404);

    const order = await repository.updateOrder(id, parsed.data);
    if (!order) return apiError("Order not found", 404);

    if (parsed.data.paymentStatus) {
      await repository.addPaymentEvent({
        orderId: id,
        type: parsed.data.paymentStatus === "verified" ? "verified" : parsed.data.paymentStatus === "rejected" ? "rejected" : "note",
        amount: order.total,
        method: order.paymentMethod ?? "bKash",
        reference: order.paymentReference,
        actor: session.email,
      });
    }

    await emitAutomationEvent("order.status_changed", {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });

    logger.info("admin", "Order updated", {
      orderId: id,
      actor: session.email,
      status: order.status,
      paymentStatus: order.paymentStatus,
    });

    return apiSuccess({ order });
  } catch (error) {
    logger.error("admin", "Order update failed", { error: String(error) });
    return apiError("Could not update the order", 500);
  }
}
