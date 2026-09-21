import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import * as layers from "@/data/layers";
import * as products from "@/data/products";
import * as solutions from "@/data/solutions";
import * as faq from "@/data/faq";
import * as policies from "@/data/policies";
import * as insights from "@/data/insights";
import * as caseStudies from "@/data/case-studies";
import * as auditForm from "@/data/audit-form";
import * as report from "@/data/report";
import * as brand from "@/data/brand";
import * as sales from "@/data/sales";
import * as support from "@/data/support";
import * as navigation from "@/data/navigation";
import { messages } from "@/lib/i18n/dictionaries";
import { locales } from "@/lib/i18n/config";

const modules = { layers, products, solutions, faq, policies, insights, caseStudies, auditForm, report, brand, sales, support, navigation };

/**
 * Walks every exported value and finds objects shaped like LocalizedText.
 * This is the guard that stops a half-translated string from reaching a customer:
 * Bangla is the default language, so a missing `bn` value is the most damaging gap.
 */
function collectLocalized(value: unknown, trail: string, found: { trail: string; value: { bn?: unknown; en?: unknown } }[], seen = new Set<unknown>()) {
  if (!value || typeof value !== "object" || seen.has(value)) return found;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectLocalized(item, `${trail}[${index}]`, found, seen));
    return found;
  }

  const keys = Object.keys(value as object);
  const record = value as Record<string, unknown>;
  if (keys.length === 2 && keys.includes("bn") && keys.includes("en")) {
    // Only require both values to be present and non-empty. An empty *list* is a
    // legitimate shape (a section that is intentionally bullets-only), and is covered
    // by the per-section content rule further down.
    found.push({ trail, value: record });
    return found;
  }

  for (const [key, child] of Object.entries(record)) {
    collectLocalized(child, `${trail}.${key}`, found, seen);
  }
  return found;
}

describe("bilingual content integrity (§56)", () => {
  it("has both a Bangla and an English value everywhere", () => {
    const gaps: string[] = [];
    for (const [name, mod] of Object.entries(modules)) {
      const localized: { trail: string; value: { bn?: unknown; en?: unknown } }[] = [];
      for (const [exportName, exported] of Object.entries(mod)) {
        collectLocalized(exported, `${name}.${exportName}`, localized);
      }
      for (const entry of localized) {
        for (const locale of locales) {
          const text = entry.value[locale];
          // A missing key, or a blank string, always means something is untranslated.
          const empty =
            text === undefined ||
            text === null ||
            (typeof text === "string" && text.trim().length === 0) ||
            (Array.isArray(text) && text.length === 0 && !Array.isArray(entry.value[locale === "bn" ? "en" : "bn"]));
          if (empty) gaps.push(`${entry.trail} → missing "${locale}"`);
        }
      }
    }
    expect(gaps).toEqual([]);
  });

  it("dictionary keys are translated for every locale", () => {
    const gaps: string[] = [];
    for (const key of Object.keys(messages) as (keyof typeof messages)[]) {
      const entry = messages[key] as Record<string, unknown>;
      for (const locale of locales) {
        const text = entry[locale];
        if (typeof text !== "string" || text.trim().length === 0) gaps.push(`${key}:${locale}`);
      }
    }
    expect(gaps).toEqual([]);
  });

  it("contains no characters from a foreign script leaked into the copy", () => {
    // Started as a CJK check after CJK text was found in the content files, then widened
    // after Devanagari, Armenian and Hangul characters were each found replacing a
    // Bengali word. U+0964 (the danda "।") is shared with Bengali and is legitimate.
    const cjk =
      /[\u3000-\u303f\u3040-\u30ff\u4e00-\u9fff\uac00-\ud7af\u0530-\u058f\u0590-\u05ff\u0600-\u06ff\u0370-\u03ff\u0400-\u04ff\u0900-\u0963\u0965-\u097f\u0e00-\u0e7f]/;
    const offenders: string[] = [];
    for (const [name, mod] of Object.entries(modules)) {
      const json = JSON.stringify(mod);
      if (cjk.test(json)) offenders.push(name);
    }
    const dictionaryJson = JSON.stringify(messages);
    if (cjk.test(dictionaryJson)) offenders.push("dictionaries");
    expect(offenders).toEqual([]);
  });
});

describe("insight section content", () => {
  it("renders something in both languages for every section", () => {
    // A section is allowed to be bullets-only, but it may never be empty in a
    // language: Bangla is the default, so an empty `bn` section is a broken page.
    const empty: string[] = [];
    for (const article of insights.insights) {
      article.body.forEach((section, index) => {
        for (const locale of locales) {
          const hasParagraph = (section.paragraphs?.[locale]?.length ?? 0) > 0;
          const hasBullet = (section.bullets?.[locale]?.length ?? 0) > 0;
          if (!hasParagraph && !hasBullet) {
            empty.push(`${article.slug} body[${index}] "${section.heading.en}" → ${locale}`);
          }
        }
      });
    }
    expect(empty).toEqual([]);
  });
});

describe("navigation integrity", () => {
  const nav = navigation as Record<string, unknown>;

  function collectHrefs(value: unknown, seen = new Set<unknown>()): string[] {
    if (!value || typeof value !== "object" || seen.has(value)) return [];
    seen.add(value);
    if (Array.isArray(value)) return value.flatMap((item) => collectHrefs(item, seen));
    const record = value as Record<string, unknown>;
    const out: string[] = [];
    if (typeof record.href === "string") out.push(record.href);
    for (const child of Object.values(record)) {
      if (typeof child === "object") out.push(...collectHrefs(child, seen));
    }
    return out;
  }

  const hrefs = [...new Set(Object.values(nav).flatMap((exported) => collectHrefs(exported)))];

  it("finds navigation links to verify", () => {
    expect(hrefs.length).toBeGreaterThan(5);
  });

  /** Walks the app directory, accepting a dynamic sibling ([slug]) in place of a literal segment. */
  function routeExists(href: string) {
    const root = path.join(process.cwd(), "app");
    const segments = href.split("/").filter(Boolean);
    let dir = root;
    for (const segment of segments) {
      const literal = path.join(dir, segment);
      if (existsSync(literal)) {
        dir = literal;
        continue;
      }
      const dynamic = existsSync(dir)
        ? readdirSync(dir).find((entry) => entry.startsWith("[") && entry.endsWith("]"))
        : undefined;
      if (!dynamic) return false;
      dir = path.join(dir, dynamic);
    }
    return existsSync(path.join(dir, "page.tsx")) || existsSync(`${dir}.tsx`);
  }

  it("points every internal link at a route that actually exists", () => {
    const missing = hrefs
      .filter((href) => href.startsWith("/") && !href.startsWith("//"))
      .map((href) => href.split("#")[0].split("?")[0])
      .filter((href) => href.length > 1)
      .filter((href) => !routeExists(href));

    expect([...new Set(missing)]).toEqual([]);
  });
});
