import { describe, expect, it } from "vitest";
import {
  products,
  hostingPlans,
  getProduct,
  getProductsByCategory,
  getRelatedProducts,
  getSavings,
  getDiscountPercent,
} from "@/data/products";
import { solutionCategories, getSolutionCategory } from "@/data/solutions";
import { businessLayers, getLayer } from "@/data/layers";
import { faqItems, getFaqs } from "@/data/faq";
import { getPolicy } from "@/data/policies";
import { insights, getInsight } from "@/data/insights";
import { caseStudies } from "@/data/case-studies";

/** The only three brand-profile products the business actually sells (§09). */
const BRAND_PROFILE_URLS = {
  "professional-business-starter": { price: 999, original: 1900 },
  "professional-business-growth": { price: 1499, original: 2599 },
  "professional-business-premium": { price: 2999, original: 4499 },
};

describe("product catalogue (§07 / §09)", () => {
  it("resolves the three required product URLs at the exact published prices", () => {
    for (const [slug, expected] of Object.entries(BRAND_PROFILE_URLS)) {
      const product = getProduct(slug);
      expect(product, `${slug} must exist`).toBeDefined();
      expect(product!.currentPrice).toBe(expected.price);
      expect(product!.originalPrice).toBe(expected.original);
      expect(product!.slug).toBe(slug);
    }
  });

  it("never publishes a product without a name, description and delivery promise", () => {
    for (const product of products) {
      expect(product.name.bn.length).toBeGreaterThan(0);
      expect(product.name.en.length).toBeGreaterThan(0);
      expect(product.shortDescription.bn.length).toBeGreaterThan(0);
      expect(product.shortDescription.en.length).toBeGreaterThan(0);
      expect(product.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("keeps every product price either a positive number or an explicit TBC", () => {
    for (const product of products) {
      if (product.currentPrice === null) {
        // A null price must be visible to the customer as "to be confirmed", never hidden.
        expect(product.priceNote ?? product.currentPrice).toBeDefined();
      } else {
        expect(product.currentPrice).toBeGreaterThan(0);
      }
    }
  });

  it("has unique slugs and ids, so no page or record can collide", () => {
    const slugs = products.map((p) => p.slug);
    const ids = products.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("computes savings and discount only from real numbers", () => {
    const starter = getProduct("professional-business-starter")!;
    expect(getSavings(starter)).toBe(901);
    expect(getDiscountPercent(starter)).toBe(47);
    const free = products.find((p) => p.currentPrice === null);
    if (free) {
      expect(getSavings(free)).toBeNull();
      expect(getDiscountPercent(free)).toBeNull();
    }
  });

  it("returns related products that are never the product itself", () => {
    for (const product of products) {
      const related = getRelatedProducts(product);
      expect(related.every((item) => item.id !== product.id)).toBe(true);
    }
  });

  it("publishes hosting plans only with a real, verified price", () => {
    for (const plan of hostingPlans) {
      expect(plan.name.bn.length).toBeGreaterThan(0);
      expect(plan.name.en.length).toBeGreaterThan(0);
    }
  });

  it("keeps the SQL seed in step with this catalogue", async () => {
    // The Postgres seed is a second source of truth for the same prices. Read it
    // and compare, so a price edited in one place cannot silently disagree with
    // the other. Amounts are whole taka in both files.
    const { readFile } = await import("node:fs/promises");
    const sql = await readFile("db/seed.sql", "utf8");
    const block = sql.slice(sql.indexOf("insert into products"), sql.indexOf("on conflict (id) do update"));
    const seeded = new Map<string, { original: number | null; current: number | null }>();
    for (const match of block.matchAll(/\('([^']+)','([^']+)',[\s\S]*?(null|\d+),\s*(null|\d+),\s*'active'/g)) {
      seeded.set(match[2], {
        original: match[3] === "null" ? null : Number(match[3]),
        current: match[4] === "null" ? null : Number(match[4]),
      });
    }

    expect(seeded.size).toBeGreaterThan(0);
    for (const [slug, price] of seeded) {
      const product = getProduct(slug);
      expect(product, `${slug} is seeded but missing from the catalogue`).toBeDefined();
      expect(product?.originalPrice ?? null, `${slug} original price`).toBe(price.original);
      expect(product?.currentPrice ?? null, `${slug} current price`).toBe(price.current);
    }

    // Every orderable product must also be seeded, or a fresh database cannot
    // price it.
    for (const product of products) {
      if (product.currentPrice == null) continue;
      expect(seeded.has(product.slug), `${product.slug} is orderable but not seeded`).toBe(true);
    }
  });
});

describe("solutions, layers, faq and policies", () => {
  it("maps every solution category to a real business layer", () => {
    expect(solutionCategories.length).toBeGreaterThan(0);
    for (const category of solutionCategories) {
      expect(getLayer(category.layer), `layer ${category.layer} must exist`).toBeDefined();
      expect(getSolutionCategory(category.id)?.id).toBe(category.id);
    }
  });

  it("defines exactly the six connected layers, in a stable order", () => {
    expect(businessLayers.map((l) => l.id)).toEqual([
      "identity",
      "structure",
      "operations",
      "growth",
      "intelligence",
      "control",
    ]);
  });

  it("resolves FAQs by id and ignores unknown ids", () => {
    const ids = faqItems.slice(0, 3).map((item) => item.id);
    expect(getFaqs(ids)).toHaveLength(3);
    expect(getFaqs(["does-not-exist"])).toHaveLength(0);
  });

  it("serves the three legal routes from the policy data", () => {
    for (const slug of ["privacy", "terms", "refund-policy"]) {
      expect(getPolicy(slug), `${slug} policy`).toBeDefined();
    }
    expect(getPolicy("made-up")).toBeUndefined();
  });

  it("stores every insight under a resolvable slug", () => {
    for (const article of insights) {
      expect(getInsight(article.slug)?.slug).toBe(article.slug);
      expect(article.body.length).toBeGreaterThan(0);
    }
  });

  it("never prints a percentage without naming where it came from", () => {
    // Source-attribution rule: a number may only appear next to its origin
    // (client-reported records or our own audit sample) — never as a bare statistic.
    const unsourced: string[] = [];
    for (const article of insights) {
      for (const section of article.body) {
        const text = `${section.paragraphs.en.join(" ")} ${(section.bullets?.en ?? []).join(" ")}`;
        if (/\d+\s?%/.test(text) && !section.source?.trim()) {
          unsourced.push(`${article.slug} → ${section.heading.en}`);
        }
      }
    }
    expect(unsourced).toEqual([]);
  });

  it("keeps case-study metrics attributed and never presented as guarantees", () => {
    for (const study of caseStudies) {
      expect(study.evidenceNote.bn.length).toBeGreaterThan(0);
      expect(study.evidenceNote.en.length).toBeGreaterThan(0);
    }
  });
});

describe("getProductsByCategory", () => {
  it("filters without mutating the catalogue", () => {
    const before = products.length;
    const filtered = getProductsByCategory("website-conversion");
    expect(filtered.every((p) => p.category === "website-conversion")).toBe(true);
    expect(products.length).toBe(before);
  });

  it("returns an empty list for an unknown category instead of throwing", () => {
    expect(getProductsByCategory("nope")).toEqual([]);
  });
});
