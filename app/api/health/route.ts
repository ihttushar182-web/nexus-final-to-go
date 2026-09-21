import { NextResponse } from "next/server";
import { getRepository } from "@/lib/db";

/**
 * GET /api/health (Build Spec §65)
 * Reports liveness plus the active storage driver. No secrets, no internal paths.
 */
export async function GET() {
  const startedAt = Date.now();
  let database: "ok" | "degraded" = "ok";
  let driver = "unknown";

  try {
    const repository = getRepository();
    driver = repository.driver;
    await repository.stats();
  } catch {
    database = "degraded";
  }

  return NextResponse.json(
    {
      status: database === "ok" ? "ok" : "degraded",
      version: process.env.npm_package_version ?? "2.0.0",
      timestamp: new Date().toISOString(),
      checks: {
        database,
        driver,
        latencyMs: Date.now() - startedAt,
      },
    },
    { status: database === "ok" ? 200 : 503, headers: { "cache-control": "no-store" } },
  );
}
