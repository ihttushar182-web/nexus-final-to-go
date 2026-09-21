import { findGoalOption, findProblemOption, findToolOption } from "@/data/audit-form";
import type { Locale } from "@/types";

/** Resolves stored audit option ids into human labels for the result page and admin. */
export function bottomProblemLabel(id: string, locale: Locale): string {
  const option = findProblemOption(id);
  return option ? option.label[locale] : id;
}

export function goalLabel(id: string, locale: Locale): string {
  const option = findGoalOption(id);
  return option ? option.label[locale] : id;
}

export function toolLabel(id: string, locale: Locale): string {
  if (!id) return "";
  return id
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => findToolOption(token)?.label[locale] ?? token)
    .join(", ");
}

export function stageLabel(id: string, locale: Locale): string {
  const map: Record<string, { bn: string; en: string }> = {
    idea: { bn: "আইডিয়া / শুরু করার প্রস্তুতি", en: "Idea / preparing to start" },
    new: { bn: "নতুন (০–১ বছর)", en: "New (0–1 year)" },
    growing: { bn: "বাড়ছে (১–৫ বছর)", en: "Growing (1–5 years)" },
    established: { bn: "প্রতিষ্ঠিত (৫+ বছর)", en: "Established (5+ years)" },
    scaling: { bn: "Scale করার পর্যায়ে", en: "At a scaling stage" },
  };
  return map[id]?.[locale] ?? id;
}

export function teamSizeLabel(id: string, locale: Locale): string {
  const map: Record<string, { bn: string; en: string }> = {
    solo: { bn: "একা (Founder only)", en: "Solo (founder only)" },
    "2-5": { bn: "২–৫ জন", en: "2–5 people" },
    "6-15": { bn: "৬–১৫ জন", en: "6–15 people" },
    "16-50": { bn: "১৬–৫০ জন", en: "16–50 people" },
    "50+": { bn: "৫০+ জন", en: "50+ people" },
  };
  return map[id]?.[locale] ?? id;
}
