import "server-only";
import { LocalRepository } from "./local";
import { SupabaseRepository } from "./supabase";
import type { Repository } from "./types";

/**
 * Driver selection.
 *
 * DB_DRIVER=supabase with valid credentials → Supabase (production).
 * Anything else → the local persistent store, so development and preview always work.
 *
 * The instance is cached on globalThis to survive Next.js hot reloads in dev.
 */
declare global {
  var __nexusRepository: Repository | undefined;
}

function createRepository(): Repository {
  const driver = (process.env.DB_DRIVER ?? "local").toLowerCase();
  const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (driver === "supabase" && hasSupabase) {
    try {
      return new SupabaseRepository();
    } catch (error) {
      console.error("[db] Supabase driver failed, falling back to local store:", error);
    }
  }
  return new LocalRepository();
}

export function getRepository(): Repository {
  if (!globalThis.__nexusRepository) {
    globalThis.__nexusRepository = createRepository();
  }
  return globalThis.__nexusRepository;
}

export type { Repository } from "./types";
