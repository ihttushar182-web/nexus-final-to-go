import { getRepository } from "@/lib/db";
import { fieldErrors, orderSchema } from "@/lib/validation/schemas";
import { getProduct } from "@/data/products";
import { emitAutomationEvent } from "@/lib/integrations/n8n";
import { orderConfirmationTemplate, sendEmail } from "@/lib/integrations/email";
import { apiError, apiSuccess, clientIdentifier, logger, rateLimit } from "@/lib/logger";

/**
 * POST /api/orders
 *
 * Records order intent. Direct checkout is NOT the current sales mechanism
 * (Build Spec §07): an order created here is 'awaiting_payment' and only becomes
 * 'confirmed' after a human verifies the bKash payment.
 */
export async function POST(request: Request) {
  const limit = rateLimit(clientIdentifier(request, "orders"), { max: 8, windowMs: 60_000 });
  if (!limit.ok) return apiError("Too many requests. Please try again shortly.", 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = orderSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Please check the highlighted fields.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  const input = parsed.data;
  if (input.company_website) return apiSuccess({ id: "ignored" }, 202);

  const product = getProduct(input.productSlug);
  if (!product || product.currentPrice == null) {
    return apiError("This product is not available for online ordering. Please contact us on WhatsApp.", 422);
  }

  try {
    const repository = getRepository();
    const lead = await repository.findLeadByEmail(input.customerEmail);

    const order = await repository.createOrder({
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      businessName: input.businessName,
      paymentMethod: input.paymentMethod,
      leadId: lead?.id,
      notes: input.notes,
      items: [
        {
          productId: product.id,
          productSlug: product.slug,
          productName: product.name.en,
          quantity: input.quantity,
          unitPrice: product.currentPrice,
        },
      ],
    });

    await Promise.allSettled([
      emitAutomationEvent("order.created", {
        orderId: order.id,
        orderNumber: order.orderNumber,
        product: product.slug,
        total: order.total,
        customerEmail: order.customerEmail,
      }),
      sendEmail(orderConfirmationTemplate(order)),
    ]);

    logger.info("orders", "Order intent recorded", { orderId: order.id, orderNumber: order.orderNumber });
    return apiSuccess({ id: order.id, orderNumber: order.orderNumber, total: order.total }, 201);
  } catch (error) {
    logger.error("orders", "Order creation failed", { error: String(error) });
    return apiError("We could not create the order. Please contact us on WhatsApp.", 500);
  }
}
