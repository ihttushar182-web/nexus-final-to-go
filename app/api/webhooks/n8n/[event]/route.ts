import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";
import { verifyWebhookSecret, verifyWebhookSource, emitAutomationEvent } from "@/lib/integrations/n8n";
import { apiError, clientIdentifier, logger, rateLimit } from "@/lib/logger";
import { webhookEnvelopeSchema } from "@/lib/validation/schemas";
import { resolvePaymentTransition } from "@/lib/orders/payment";

/**
 * Inbound automation endpoints (Build Spec §33):
 *
 *   POST /api/webhooks/n8n/lead
 *   POST /api/webhooks/n8n/order
 *   POST /api/webhooks/n8n/payment
 *   POST /api/webhooks/n8n/message
 *   POST /api/webhooks/n8n/audit
 *
 * Every request is authenticated with a shared secret header, rate limited, logged,
 * and — where an idempotency key is supplied — de-duplicated.
 */
export const dynamic = "force-dynamic";

const allowedEvents = new Set(["lead", "order", "payment", "message", "audit"]);

export async function POST(request: Request, { params }: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const endpoint = `/api/webhooks/n8n/${event}`;

  if (!allowedEvents.has(event)) {
    return apiError("Unknown webhook event", 404);
  }

  const limit = rateLimit(clientIdentifier(request, `webhook:${event}`), { max: 120, windowMs: 60_000 });
  if (!limit.ok) {
    await logSafely({ endpoint, event, status: "rejected", detail: "rate limited" });
    return apiError("Rate limit exceeded", 429);
  }

  const secret = verifyWebhookSecret(request);
  if (!secret.ok) {
    await logSafely({ endpoint, event, status: "rejected", detail: secret.reason });
    logger.warn("webhook", "Rejected inbound webhook", { endpoint, reason: secret.reason });
    return apiError(secret.reason ?? "Unauthorized", 401);
  }

  const source = verifyWebhookSource(request);
  if (!source.ok) {
    await logSafely({ endpoint, event, status: "rejected", detail: source.reason });
    return apiError("Forbidden", 403);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    await logSafely({ endpoint, event, status: "error", detail: "invalid json" });
    return apiError("Invalid JSON body", 400);
  }

  const parsed = webhookEnvelopeSchema.safeParse(body);
  if (!parsed.success) {
    await logSafely({ endpoint, event, status: "error", detail: "schema validation failed" });
    return apiError("Invalid webhook payload", 422);
  }

  const payload = parsed.data;

  try {
    const repository = getRepository();

    // Idempotency: a repeated delivery with the same key is acknowledged, not re-applied.
    if (payload.idempotencyKey) {
      const recent = await repository.listWebhookLogs(200);
      const duplicate = recent.find(
        (entry) => entry.endpoint === endpoint && (entry.payload as { idempotencyKey?: string } | undefined)?.idempotencyKey === payload.idempotencyKey,
      );
      if (duplicate) {
        logger.info("webhook", "Duplicate webhook ignored", { endpoint, key: payload.idempotencyKey });
        return NextResponse.json({ ok: true, duplicate: true, id: duplicate.id });
      }
    }

    switch (event) {
      case "lead": {
        const data = payload.payload as { name?: string; email?: string; phone?: string; source?: string; channel?: string; productInterest?: string } | undefined;
        if (!data?.name || !data?.email || !data?.phone) return apiError("lead payload requires name, email and phone", 422);
        const lead = await repository.createLead({
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: data.source ?? "n8n",
          channel: (data.channel as "web" | "whatsapp" | "messenger" | "email" | "phone" | undefined) ?? "web",
          productInterest: data.productInterest,
        });
        await logSafely({ endpoint, event, status: "accepted", payload, detail: `lead ${lead.id}` });
        return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
      }
      case "order": {
        const data = payload.payload as { orderId?: string; status?: string } | undefined;
        if (!data?.orderId) return apiError("order payload requires orderId", 422);
        const order = await repository.getOrder(data.orderId);
        if (!order) return apiError("Order not found", 404);
        if (data.status) {
          await repository.updateOrder(order.id, { status: data.status as never });
        }
        await logSafely({ endpoint, event, status: "accepted", payload, detail: `order ${order.orderNumber}` });
        return NextResponse.json({ ok: true, id: order.id });
      }
      case "payment": {
        const data = payload.payload as { orderId?: string; reference?: string; amount?: number; method?: string; verified?: boolean } | undefined;
        if (!data?.orderId) return apiError("payment payload requires orderId", 422);
        const order = await repository.getOrder(data.orderId);
        if (!order) return apiError("Order not found", 404);

        await repository.addPaymentEvent({
          orderId: order.id,
          type: data.verified ? "verified" : "submitted",
          amount: data.amount ?? order.total,
          method: data.method ?? "bKash",
          reference: data.reference,
          actor: "n8n",
        });
        // Only an explicit verification flips the payment status, and a verified payment
        // is never moved backwards by a late or duplicated notification (§30).
        const transition = resolvePaymentTransition(order, { verified: data.verified });
        if (transition.changed) {
          await repository.updateOrder(order.id, {
            paymentStatus: transition.paymentStatus,
            status: transition.status,
          });
        } else {
          logger.info("webhook", "Payment notification did not change order state", {
            orderId: order.id,
            paymentStatus: order.paymentStatus,
          });
        }

        await logSafely({ endpoint, event, status: "accepted", payload, detail: `payment ${order.orderNumber}` });
        return NextResponse.json({ ok: true, id: order.id });
      }
      case "message": {
        const data = payload.payload as { conversationId?: string; body?: string; direction?: string; channel?: string } | undefined;
        if (!data?.body) return apiError("message payload requires body", 422);
        await logSafely({ endpoint, event, status: "accepted", payload, detail: "message logged" });
        return NextResponse.json({ ok: true });
      }
      case "audit": {
        const data = payload.payload as { auditId?: string } | undefined;
        if (!data?.auditId) return apiError("audit payload requires auditId", 422);
        const audit = await repository.getAudit(data.auditId);
        if (!audit) return apiError("Audit not found", 404);
        await emitAutomationEvent("audit.submitted", { auditId: audit.id, priorityLayer: audit.snapshot.priorityLayer, echo: true });
        await logSafely({ endpoint, event, status: "accepted", payload, detail: `audit ${audit.id}` });
        return NextResponse.json({ ok: true, id: audit.id });
      }
      default:
        return apiError("Unknown webhook event", 404);
    }
  } catch (error) {
    await logSafely({ endpoint, event, status: "error", detail: String(error), payload });
    logger.error("webhook", "Webhook handling failed", { endpoint, error: String(error) });
    return apiError("Webhook processing failed", 500);
  }
}

async function logSafely(entry: {
  endpoint: string;
  event: string;
  status: "accepted" | "rejected" | "error";
  detail?: string;
  payload?: unknown;
}) {
  try {
    await getRepository().logWebhook(entry);
  } catch (error) {
    logger.warn("webhook", "Could not persist webhook log", { error: String(error) });
  }
}
