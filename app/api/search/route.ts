import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { insights } from "@/data/insights";
import { faqItems } from "@/data/faq";
import { caseStudies } from "@/data/case-studies";
import { apiError, clientIdentifier, rateLimit } from "@/lib/logger";

/**
 * GET /api/search?q=&locale=
 *
 * Search abstraction (Build Spec §55): the query surface is stable, so the backing
 * implementation can move to PostgreSQL full-text, Algolia, Typesense or Meilisearch
 * without touching the UI.
 */
export async function GET(request: Request) {
  const limit = rateLimit(clientIdentifier(request, "search"), { max: 60, windowMs: 60_000 });
  if (!limit.ok) return apiError("Too many searches. Please slow down.", 429);

  const url = new URL(request.url);
  const query = (url.searchParams.get("q") ?? "").trim().toLowerCase();
  const locale = url.searchParams.get("locale") === "en" ? "en" : "bn";

  if (query.length < 2) {
    return NextResponse.json({ ok: true, query, results: [] });
  }

  const matches = (haystack: string[]) => haystack.some((value) => value.toLowerCase().includes(query));

  const results = [
    ...products
      .filter((product) =>
        matches([product.name[locale], product.shortDescription[locale], product.description[locale], ...product.features[locale]]),
      )
      .map((product) => ({
        type: "product" as const,
        title: product.name[locale],
        description: product.shortDescription[locale],
        href: `/products/${product.slug}`,
      })),
    ...solutionCategories
      .filter((category) => matches([category.name[locale], category.summary[locale], ...category.capabilities[locale]]))
      .map((category) => ({
        type: "solution" as const,
        title: category.name[locale],
        description: category.summary[locale],
        href: `/solutions/${category.slug}`,
      })),
    ...insights
      .filter((article) => matches([article.title[locale], article.excerpt[locale], article.category]))
      .map((article) => ({
        type: "insight" as const,
        title: article.title[locale],
        description: article.excerpt[locale],
        href: `/insights/${article.slug}`,
      })),
    ...faqItems
      .filter((item) => matches([item.question[locale], item.answer[locale]]))
      .map((item) => ({
        type: "faq" as const,
        title: item.question[locale],
        description: item.answer[locale].slice(0, 160),
        href: "/faq",
      })),
    ...caseStudies
      .filter((study) => matches([study.title[locale], study.summary[locale], study.industry[locale]]))
      .map((study) => ({
        type: "case-study" as const,
        title: study.title[locale],
        description: study.summary[locale],
        href: `/case-studies#${study.slug}`,
      })),
  ].slice(0, 24);

  return NextResponse.json(
    { ok: true, query, count: results.length, results },
    { headers: { "cache-control": "no-store" } },
  );
}
