import "server-only";
import { cookies } from "next/headers";
import type { Locale } from "@/types";
import { LOCALE_COOKIE, resolveLocale } from "./config";
import { createTranslator } from "./dictionaries";

/**
 * Server-side locale resolution.
 *
 * The chosen language is stored in a cookie so a single URL keeps serving both
 * languages — no duplicated route tree, no duplicated components (Build Spec §56).
 * Pages that call this helper render dynamically, which is expected for a site that
 * also reads live CRM data.
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return resolveLocale(store.get(LOCALE_COOKIE)?.value);
}

export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: createTranslator(locale) };
}
