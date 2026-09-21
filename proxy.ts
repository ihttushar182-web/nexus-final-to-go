import { NextResponse, type NextRequest } from "next/server";
import { products } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { insights } from "@/data/insights";

/**
 * Catalogue slug validation (Build Spec §35 — technical SEO / QA §60).
 *
 * Why this runs here: the site resolves language from a cookie in the root layout, so
 * pages render dynamically and the response is already streaming by the time a page
 * calls `notFound()`. The status line is committed at that point, so the customer sees
 * the 404 page but crawlers receive `200` — a "soft 404", which lets search engines
 * index URLs that do not exist.
 *
 * Rejecting unknown slugs here, before rendering starts, keeps the real 404 status and
 * still serves the styled `app/not-found.tsx` page.
 */

const productSlugs = new Set(products.map((product) => product.slug));
const solutionSlugs = new Set<string>(solutionCategories.map((category) => category.id));
const insightSlugs = new Set(insights.map((article) => article.slug));

function lastSegment(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = lastSegment(pathname);

  let known = true;
  if (pathname.startsWith("/products/")) known = productSlugs.has(segment);
  else if (pathname.startsWith("/solutions/")) known = solutionSlugs.has(segment);
  else if (pathname.startsWith("/insights/")) known = insightSlugs.has(segment);

  if (known) return NextResponse.next();

  // Same URL, explicit 404: the router renders app/not-found.tsx and the status stays honest.
  return NextResponse.rewrite(request.nextUrl, { status: 404 });
}

export const config = {
  matcher: ["/products/:path*", "/solutions/:path*", "/insights/:path*"],
};
