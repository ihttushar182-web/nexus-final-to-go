# 08 — SEO & AI-search readiness

## 1. Per-page metadata

Every route exports `metadata` (or `generateMetadata` for dynamic routes) with a title,
description and canonical path. Open Graph data is set for shareable pages. The root
`app/layout.tsx` sets `metadataBase` from `NEXT_PUBLIC_SITE_URL`, so canonicals and OG
URLs are absolute in production.

Dynamic routes resolve metadata from the content layer — e.g. `/products/[slug]` uses
`product.seoTitle` / `product.seoDescription`, and `/insights/[slug]` additionally emits
`articleSection`, `wordCount` and `inLanguage`.

## 2. Structured data (JSON-LD)

| Page | Schema |
| --- | --- |
| All pages | `Organization` (`components/seo/OrganizationSchema.tsx`) |
| Homepage | `FAQPage` over the selected home FAQs |
| `/products/[slug]` | `Product` — `offers` is **omitted when the price is TBC** |
| `/insights/[slug]` | `Article` / `BlogPosting` per `article.schemaType` |
| `/faq` | one `FAQPage` covering all items |
| `/solutions/[slug]`, `/resources/sme-maturity-report` | `BreadcrumbList` |

Structured data is generated from the same data as the page — it cannot drift.

## 3. 404 hygiene (fixed in this build)

Because the site resolves language from a cookie, pages render dynamically and the
response is already streaming when a page calls `notFound()`. The UI showed the 404 page
but crawlers received `200` — a **soft 404** that lets search engines index URLs which do
not exist.

`proxy.ts` now validates `/products/*`, `/solutions/*` and `/insights/*` before rendering
and returns `404` with the styled not-found page. `tests/proxy.test.ts` covers the
regression: every real slug must pass, every unknown slug must 404, and listing pages plus
unrelated routes must be untouched.

## 4. Sitemap & robots

- `app/sitemap.ts` — static pages plus every product, solution, insight and case study.
- `app/robots.ts` — allows the public site, disallows `/admin`, `/api`, `/search`,
  `/business-audit/result`, `/login`, `/dashboard`, `/account`.
- Private areas additionally set `robots: { index: false }` in their own metadata, and
  `/admin/layout.tsx` adds `nocache` — a defence in depth against a misconfigured crawler.

## 5. Canonicals and duplicates

Each page declares one canonical path. `/audit` is a short link that redirects to
`/business-audit`, so the funnel has exactly one canonical URL. `/search` is `noindex`
but `follow`, because result pages add no value to an index.

## 6. Titles, headings and structure

- One `<h1>` per page, from `PageHero`.
- Section headings are `<h2>`, sub-blocks `<h3>` — no heading level is skipped.
- Title template is applied at the root layout (`… | Nexus Lift`), so no page repeats the
  brand name twice.

## 7. Performance (§37)

- Server components by default; client JavaScript is limited to the interactive pieces
  (forms, search, drawer, admin editors).
- No web-font request to a third party — fonts are self-hosted and preloaded by
  `next/font/local`.
- Images/icons are inline SVG (lucide) or CSS, so there is no image-blocking paint.
- Content pages carry no carousels, no animation libraries and no client-side data fetch.

## 8. AI-search readiness (§36)

The site is built so an assistant can answer questions from structured knowledge rather
than scraped markup:

- `/data` holds the product catalogue, FAQ answers (with their source), policies, brand
  rules, sales flow and support rules as typed objects.
- `data/faq.ts` answers carry a `source` field, and insights carry per-section `source`
  attribution, so a machine reader can see the provenance of a number instead of
  repeating it as fact.
- `data/brand.ts` publishes the claim rules explicitly: what may never be said (market
  leader, guarantees, fake urgency, invented statistics, competitor bashing) and what must
  always accompany a claim (attribution and the "results differ" disclaimer).

## 9. Monitoring checklist

- Confirm `sitemap.xml` and `robots.txt` after each deploy.
- Check that unknown product/solution/insight URLs still return `404` (not `200`).
- Re-run Lighthouse on `/`, `/products/professional-business-starter` and `/business-audit`.
- Validate JSON-LD on the homepage and a product page with a structured-data tool.
