import { getRepository } from "@/lib/db";
import { fieldErrors, paymentSubmissionSchema } from "@/lib/validation/schemas";
import { emitAutomationEvent } from "@/lib/integrations/n8n";
import { paymentReceivedTemplate, sendEmail } from "@/lib/integrations/email";
import { apiError, apiSuccess, clientIdentifier, logger, rateLimit } from "@/lib/logger";
import { resolvePaymentTransition } from "@/lib/orders/payment";

/**
 * POST /api/orders/:id/payment
 *
 * A customer submitting a transaction ID does NOT verify the payment
 * (Build Spec §30): the order moves to 'payment_verification' and waits for a human.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const limit = rateLimit(clientIdentifier(request, "payment"), { max: 8, windowMs: 60_000 });
  if (!limit.ok) return apiError("Too many requests. Please try again shortly.", 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = paymentSubmissionSchema.safeParse({ ...(json as object), orderId: id });
  if (!parsed.success) {
    return apiError("Please check the highlighted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  const input = parsed.data;

  try {
    const repository = getRepository();
    const order = await repository.getOrder(id);
    if (!order) return apiError("Order not found", 404);

    // A verified payment must never be pushed backwards by a customer message (§30).
    const transition = resolvePaymentTransition(order);
    const updated = transition.changed
      ? await repository.updateOrder(id, {
          paymentStatus: transition.paymentStatus,
          status: transition.status,
        })
      : order;
    if (!updated) return apiError("Order not found", 404);

    await repository.addPaymentEvent({
      orderId: id,
      type: "submitted",
      amount: input.amount ?? order.total,
      method: input.method,
      reference: input.reference,
    });

    await Promise.allSettled([
      emitAutomationEvent("payment.submitted", {
        orderId: id,
        orderNumber: order.orderNumber,
        reference: input.reference,
        amount: input.amount ?? order.total,
      }),
      sendEmail(paymentReceivedTemplate(updated, input.reference)),
    ]);

    logger.info("orders", "Payment reference submitted for verification", { orderId: id });

    return apiSuccess({
      orderId: id,
      paymentStatus: updated.paymentStatus,
      status: updated.status,
      note: transition.changed
        ? "Your payment information is under verification. Production starts after verification."
        : "We already have your payment on record for this order. Our team will confirm the next step.",
    });
  } catch (error) {
    logger.error("orders", "Payment submission failed", { error: String(error) });
    return apiError("We could not record the payment information. Please contact us on WhatsApp.", 500);
  }
}
