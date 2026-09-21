import { createSession, destroySession, getSession } from "@/lib/auth/session";
import { adminLoginSchema, fieldErrors } from "@/lib/validation/schemas";
import { apiError, apiSuccess, clientIdentifier, logger, rateLimit } from "@/lib/logger";

/** POST /api/admin/session — sign in. DELETE — sign out. GET — current session. */
export async function POST(request: Request) {
  const limit = rateLimit(clientIdentifier(request, "admin-login"), { max: 6, windowMs: 5 * 60_000 });
  if (!limit.ok) return apiError("Too many sign-in attempts. Please wait a few minutes.", 429);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError("Invalid JSON body", 400);
  }

  const parsed = adminLoginSchema.safeParse(json);
  if (!parsed.success) {
    return apiError("Enter a valid email and password.", 422, { fieldErrors: fieldErrors(parsed.error) });
  }

  const session = await createSession(parsed.data.email, parsed.data.password);
  if (!session) {
    logger.warn("auth", "Failed admin sign-in attempt");
    return apiError("Email or password is incorrect.", 401);
  }

  logger.info("auth", "Admin signed in", { email: session.email, role: session.role });
  return apiSuccess({ email: session.email, role: session.role, expiresAt: session.expiresAt });
}

export async function DELETE() {
  await destroySession();
  logger.info("auth", "Admin signed out");
  return apiSuccess({ signedOut: true });
}

export async function GET() {
  const session = await getSession();
  if (!session) return apiError("Not signed in", 401);
  return apiSuccess({ email: session.email, role: session.role, expiresAt: session.expiresAt });
}
