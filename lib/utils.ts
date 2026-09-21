import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";
import type { Locale, LocalizedText } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolve a localized value, falling back to Bengali (the default language). */
export function t(value: LocalizedText | undefined | null, locale: Locale): string {
  if (!value) return "";
  return value[locale] ?? value.bn ?? value.en ?? "";
}

export function tList(value: { bn: string[]; en: string[] } | undefined | null, locale: Locale): string[] {
  if (!value) return [];
  return value[locale] ?? value.bn ?? [];
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatCurrency(amount: number, options: { withSymbol?: boolean } = {}) {
  const { withSymbol = true } = options;
  const value = numberFormatter.format(amount);
  return withSymbol ? `${siteConfig.currencySymbol}${value}` : value;
}

export function formatPercent(value: number, digits = 0) {
  return `${value.toFixed(digits)}%`;
}

export function formatDate(value: string | Date, locale: Locale = "bn") {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: siteConfig.timezone,
  }).format(date);
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: siteConfig.timezone,
  }).format(date);
}

export function formatRelative(value: string | Date, now: Date = new Date()) {
  const date = typeof value === "string" ? new Date(value) : value;
  const diffMs = now.getTime() - date.getTime();
  const abs = Math.abs(diffMs);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < minute) return rtf.format(Math.round(diffMs / 1000) * -1, "second");
  if (abs < hour) return rtf.format(Math.round(diffMs / minute) * -1, "minute");
  if (abs < day) return rtf.format(Math.round(diffMs / hour) * -1, "hour");
  return rtf.format(Math.round(diffMs / day) * -1, "day");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function truncate(input: string, length = 160) {
  if (input.length <= length) return input;
  return `${input.slice(0, length - 1).trimEnd()}…`;
}

/** Normalize a Bangladeshi phone number to international format for wa.me links. */
export function normalizePhone(input: string, defaultCountry = "880") {
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith(defaultCountry)) return digits;
  if (digits.startsWith("0")) return `${defaultCountry}${digits.slice(1)}`;
  if (digits.length === 10 && digits.startsWith("1")) return `${defaultCountry}${digits}`;
  return digits;
}

export function absoluteUrl(path = "/") {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/**
 * Accepts every format a Bangladeshi customer actually types:
 *   01814716713 · 1814716713 · +8801814716713 · 880 1814-716713
 * Normalising first, then allowing the optional national trunk prefix, keeps the
 * "018…" format from being rejected as invalid (it is the most common input).
 */
export function isBangladeshiPhone(value: string) {
  const digits = normalizePhone(value);
  return /^8801[3-9]\d{8}$/.test(digits);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function chunk<T>(items: T[], size: number): T[][] {
  const output: T[][] = [];
  for (let i = 0; i < items.length; i += size) output.push(items.slice(i, i + size));
  return output;
}

export function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
