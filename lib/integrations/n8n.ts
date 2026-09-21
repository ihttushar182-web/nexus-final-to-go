import { logger } from "@/lib/logger";

/**
 * Outbound automation hook (Build Spec §33).
 *
 * When N8N_WEBHOOK_URL is configured, every domain event is forwarded to n8n so the
 * automation layer can react (CRM sync, notification, reporting). When it is not
 * configured the call is logged and skipped — the business flow never depends on it.
 */

export type AutomationEvent =
  | "lead.created"
  | "audit.submitted"
  | "contact.submitted"
  | "order.created"
  | "payment.submitted"
  | "order.status_changed";

export interface AutomationPayload {
  event: AutomationEvent;
  occurredAt: string;
  data: Record<string, unknown>;
}

export async function emitAutomationEvent(event: AutomationEvent, data: Record<string, unknown>) {
  const url = process.env.N8N_WEBHOOK_URL;
  const payload: AutomationPayload = { event, occurredAt: new Date().toISOString(), data };

  if (!url) {
    logger.info("n8n", `N8N_WEBHOOK_URL not configured — event kept in the local log`, { event });
    return { forwarded: false as const };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(process.env.N8N_WEBHOOK_SECRET ? { "x-nexus-signature": process.env.N8N_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify(payload),
      // Never let a slow automation endpoint block a customer request.
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      logger.warn("n8n", "Automation endpoint returned a non-OK status", { event, status: response.status });
      return { forwarded: false as const, status: response.status };
    }
    return { forwarded: true as const, status: response.status };
  } catch (error) {
    logger.error("n8n", "Automation forward failed", { event, error: String(error) });
    return { forwarded: false as const, error: String(error) };
  }
}

/**
 * Webhook authentication for inbound n8n calls (Build Spec §33 / §43).
 * Accepts either `x-nexus-secret` or an `Authorization: Bearer` header.
 */
export function verifyWebhookSecret(request: Request): { ok: boolean; reason?: string } {
  const expected = process.env.N8N_WEBHOOK_SECRET;

  if (!expected) {
    const isProduction = process.env.NODE_ENV === "production";
    if (isProduction) {
      return { ok: false, reason: "N8N_WEBHOOK_SECRET is not configured on the server" };
    }
    return { ok: true, reason: "secret not configured (development mode)" };
  }

  const header = request.headers.get("x-nexus-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const provided = header ?? bearer;

  if (!provided) return { ok: false, reason: "Missing webhook secret header" };
  if (provided.length !== expected.length) return { ok: false, reason: "Invalid webhook secret" };
  return { ok: provided === expected, reason: provided === expected ? undefined : "Invalid webhook secret" };
}

/** Optional IP allow-list for automation endpoints (N8N_ALLOWED_IPS, comma separated). */
export function verifyWebhookSource(request: Request): { ok: boolean; reason?: string } {
  const allowList = process.env.N8N_ALLOWED_IPS?.split(",").map((ip) => ip.trim()).filter(Boolean);
  if (!allowList?.length) return { ok: true };

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  if (allowList.includes(ip)) return { ok: true };
  return { ok: false, reason: `Source ${ip || "unknown"} is not in N8N_ALLOWED_IPS` };
}
