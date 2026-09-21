import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { products } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { insights } from "@/data/insights";

/**
 * Regression guard for the soft-404 fix.
 *
 * Because the root layout reads the locale cookie, pages render dynamically and a
 * `notFound()` thrown during the page body only swaps the UI — the status line is
 * already committed as 200. Rejecting unknown catalogue slugs in the proxy keeps the
 * status honest for crawlers (§35).
 */
function requestFor(pathname: string) {
  return new NextRequest(new URL(`http://localhost:3000${pathname}`));
}

describe("catalogue slug validation", () => {
  it("lets every real product, solution and insight through", () => {
    const paths = [
      ...products.map((product) => `/products/${product.slug}`),
      ...solutionCategories.map((category) => `/solutions/${category.id}`),
      ...insights.map((article) => `/insights/${article.slug}`),
    ];
    expect(paths.length).toBeGreaterThan(20);
    for (const pathname of paths) {
      const response = proxy(requestFor(pathname));
      expect(response.status, `${pathname} should not be blocked`).not.toBe(404);
    }
  });

  it("returns a real 404 for an unknown slug in these sections", () => {
    for (const pathname of ["/products/does-not-exist", "/solutions/does-not-exist", "/insights/does-not-exist"]) {
      const response = proxy(requestFor(pathname));
      expect(response.status, pathname).toBe(404);
    }
  });

  it("never touches the section listing pages themselves", () => {
    for (const pathname of ["/products", "/solutions", "/insights"]) {
      expect(proxy(requestFor(pathname)).status, pathname).not.toBe(404);
    }
  });

  it("leaves unrelated routes alone", () => {
    for (const pathname of ["/", "/about", "/business-audit", "/contact", "/faq"]) {
      expect(proxy(requestFor(pathname)).status, pathname).not.toBe(404);
    }
  });
});
