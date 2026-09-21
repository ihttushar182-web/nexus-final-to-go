import { NextResponse } from "next/server";

/**
 * Structured application logging (Build Spec §58).
 * Secrets are never logged — only the fields explicitly passed in.
 */
type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, scope: string, message: string, meta?: Record<string, unknown>) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    scope,
    message,
    ...(meta ? { meta } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (scope: string, message: string, meta?: Record<string, unknown>) => log("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: Record<string, unknown>) => log("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: Record<string, unknown>) => log("error", scope, message, meta),
};

/* ───────────────────────────────── rate limiting ───────────────────────────── */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory fixed-window limiter for public endpoints.
 * For multi-instance deployments swap the Map for Redis (documented in
 * docs/10_SECURITY.md) — the call signature stays identical.
 */
export function rateLimit(
  identifier: string,
  options: { windowMs?: number; max?: number } = {},
): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const windowMs = options.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  const max = options.max ?? Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 20);
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, retryAfterSeconds: 0 };
  }
  if (bucket.count >= max) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, remaining: max - bucket.count, retryAfterSeconds: 0 };
}

/** Best-effort client identity for rate limiting (proxy aware). */
export function clientIdentifier(request: Request, scope = "global") {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}

/* ─────────────────────────────── api responses ────────────────────────────── */

export function apiError(
  message: string,
  status = 400,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export function apiSuccess<T extends Record<string, unknown>>(data: T, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}
