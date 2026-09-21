import type { Locale } from "@/types";

export const locales: Locale[] = ["bn", "en"];
export const defaultLocale: Locale = "bn";
export const LOCALE_COOKIE = "nl_lang";

export const localeMeta: Record<Locale, { label: string; native: string; htmlLang: string }> = {
  bn: { label: "Bengali", native: "বাংলা", htmlLang: "bn" },
  en: { label: "English", native: "English", htmlLang: "en" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as string[]).includes(value);
}

export function resolveLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}
