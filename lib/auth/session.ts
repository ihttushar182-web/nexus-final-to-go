import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin authentication (Build Spec §31 / §43).
 *
 * Deliberately dependency-free:
 *  - password is checked against `ADMIN_PASSWORD_HASH` (scrypt) when present, and
 *    falls back to `ADMIN_PASSWORD` for local development only;
 *  - the session is a signed (HMAC-SHA256) cookie, HttpOnly + SameSite=Lax + Secure
 *    in production, with an expiry that is verified on every request.
 *
 * Production deployments that need multi-user staff accounts should move to Supabase
 * Auth with the `profiles` table — the guard below is the single place to change.
 */

const COOKIE_NAME = "nl_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 16) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET must be set (min 16 characters) in production");
  }
  return "nexus-lift-development-secret";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string | undefined): boolean {
  if (!stored) return false;
  const [scheme, salt, digest] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !digest) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(digest, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export interface AdminSession {
  email: string;
  role: "ceo" | "manager" | "sales" | "marketing" | "delivery" | "support";
  expiresAt: number;
}

function encodeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (expected.length !== signature.length) return null;
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!session.expiresAt || session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

function credentialsValid(email: string, password: string): boolean {
  const expectedEmail = (process.env.ADMIN_EMAIL ?? "admin@nexuslift.com").toLowerCase();
  if (email.toLowerCase() !== expectedEmail) return false;

  if (process.env.ADMIN_PASSWORD_HASH) {
    return verifyPassword(password, process.env.ADMIN_PASSWORD_HASH);
  }
  const fallback = process.env.ADMIN_PASSWORD;
  if (!fallback) return false;
  if (process.env.NODE_ENV === "production") {
    // Refuse the shared dev password in production.
    return false;
  }
  return fallback === password;
}

export async function createSession(email: string, password: string): Promise<AdminSession | null> {
  if (!credentialsValid(email, password)) return null;
  const session: AdminSession = {
    email: email.toLowerCase(),
    role: (process.env.ADMIN_ROLE as AdminSession["role"]) ?? "ceo",
    expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
  };
  const store = await cookies();
  store.set(COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return session;
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return decodeSession(store.get(COOKIE_NAME)?.value);
}

export async function requireSession(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

/** True when the admin area is configured with a non-default password. */
export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD);
}
