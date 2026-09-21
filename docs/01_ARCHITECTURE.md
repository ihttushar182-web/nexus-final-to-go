# 01 — Architecture

> Nexus Lift — Business Systems & Growth Infrastructure
> Reference for anyone maintaining this codebase.

## 1. What this system is

A production Next.js application that is **the business infrastructure itself**, not a
brochure site. It contains:

- the public website (marketing, products, framework, insights, legal),
- the lead-generation funnel (Free Business Audit) with real scoring and persistence,
- a CRM / admin area where staff work leads, orders, payments and audits,
- an API surface for the marketing automation platform (n8n),
- a single, structured knowledge layer (`/data`) that both the website and any future
  assistant read from.

## 2. Stack

| Concern | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | React Server Components by default |
| Language | TypeScript (strict) | `npx tsc --noEmit` is clean |
| Styling | Tailwind CSS v4 + design tokens | tokens defined in `app/globals.css` |
| Validation | Zod v4 | every public endpoint validates server-side |
| Persistence | Repository pattern over two drivers | Supabase (production) / local JSON (dev, preview) |
| Auth | Signed HMAC cookie + scrypt password | `lib/auth/session.ts` |
| Tests | Vitest | 9 spec files, 79 tests |
| Icons | lucide-react | brand marks live in `components/ui/BrandIcons.tsx` |
| Fonts | Self-hosted woff2 via `next/font/local` | `app/fonts/` + `scripts/sync-fonts.mjs` |

## 3. Directory map

```
app/                 routes only — no business logic
  api/               REST endpoints (audit, leads, contact, orders, health, search, admin, webhooks)
  admin/             staff area (auth-gated in app/admin/layout.tsx)
  business-audit/    the funnel + /result/[id]
components/          presentation, grouped by domain
  ui/                design-system primitives (Button, Badge, Section, Field, DataDisplay…)
  home/              homepage sections in the §16 order
  audit/             multi-step audit form
  admin/             admin login, shell, editors
  …                  product, solutions, insights, framework, contact, search, legal, portal
config/site.ts       brand, contact, business hours, payment methods, service persona
data/                THE CONTENT SOURCE OF TRUTH (see §5)
db/                  schema.sql + seed.sql for PostgreSQL/Supabase
lib/                 business logic — framework-independent and unit-tested
  audit/             scoring engine + option-label resolvers
  orders/            payment state machine
  db/                repository contract + local & Supabase drivers
  validation/        Zod schemas
  integrations/      whatsapp, email, n8n
  auth/              admin session
  i18n/              locale config, dictionaries, server resolver
  analytics/         event tracking
proxy.ts             catalogue slug validation (real 404s, see §7)
types/               all domain types
docs/                this documentation set
```

**Rule (§62):** business logic never lives in `app/` or `components/`. Pages compose
data and components; they do not compute prices, scores or state transitions.

## 4. Request flow (typical)

1. A page (server component) calls `getLocale()` and reads from `/data` or `getRepository()`.
2. Interactive parts are thin client components (`components/audit/AuditForm.tsx`,
   `components/contact/ContactForm.tsx`, `components/search/SearchClient.tsx`,
   `components/admin/*`).
3. Those post JSON to `/api/*`, where Zod validates the payload, rate limiting applies,
   the repository persists, and automation events are emitted to n8n.

## 5. The knowledge layer (`/data`)

Every fact a customer can read comes from one of these files — never from a component:

| File | Owns |
| --- | --- |
| `config/site.ts` | brand name, tagline, contact details, business hours, payment methods, service persona |
| `data/products.ts` | 11 products + hosting plans, all prices, deliverables, delivery times, revisions |
| `data/layers.ts` | the six connected layers, growth methodology, maturity ladder |
| `data/solutions.ts` | 11 solution categories and their layer mapping |
| `data/faq.ts` | FAQ items with a `source` field per answer |
| `data/case-studies.ts` | case studies with `evidenceNote` attribution |
| `data/insights.ts` | articles; every numeric section carries a `source` |
| `data/policies.ts` | privacy, terms, refund policy |
| `data/audit-form.ts` | funnel questions and answer options |
| `data/brand.ts` | voice, claim rules, banned phrases, service-identity rules |
| `data/sales.ts` | order flow, payment steps, objection handling, price sheet |
| `data/support.ts` | support hours, categories, priorities, escalation, prohibitions |
| `data/navigation.ts` | header/footer navigation |

Why it matters (§36): an assistant must read structured knowledge, not scrape the UI.
`data/brand.ts`, `data/sales.ts` and `data/support.ts` exist purely for that — they are
the guardrails (what may be claimed, what may be promised, what must never be said).

A test (`tests/content-integrity.test.ts`) proves every `{ bn, en }` pair has both
languages, that no stray CJK text has leaked in, and that every navigation link resolves
to a real route.

## 6. Persistence abstraction

`lib/db/index.ts` exposes `getRepository()`, which returns one of two drivers behind a
single `Repository` interface (`lib/db/types.ts`):

- **SupabaseRepository** — used when `DB_DRIVER=supabase` and credentials exist.
- **LocalRepository** — a single JSON document written atomically (temp file + rename),
  serialised through a promise queue. Used for development, preview and single-instance
  deployments, so the project runs with **zero credentials**.

Swapping drivers changes no calling code. See `docs/02_DATABASE.md`.

## 7. Two behaviours worth knowing

**Locale is cookie-based.** `getLocale()` reads a cookie, which makes pages render
dynamically. That is a deliberate trade-off: one URL serves both Bangla and English
(§56) instead of duplicating the route tree. The migration path to `/[locale]/` static
routes is described in `docs/07_I18N.md`.

**Unknown catalogue slugs are rejected in `proxy.ts`.** Because rendering is dynamic,
a `notFound()` thrown inside a page body can only swap the UI — the status line is
already committed as `200`, which would let crawlers index non-existent URLs. The proxy
validates `/products/*`, `/solutions/*` and `/insights/*` before rendering and returns a
real `404` with the styled not-found page. `tests/proxy.test.ts` locks this in.

## 8. Quality gates

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint .            (flat config)
npm run test        # vitest run          (79 tests)
npm run build       # next build          (all routes)
npm run verify      # all of the above, in order
```

## 9. Security posture (§43)

- Every public POST validates with Zod **on the server**; client validation is UX only.
- A hidden honeypot field (`company_website`) rejects form bots.
- Rate limiting per IP per endpoint (`lib/logger.ts`).
- Admin auth is a signed, HttpOnly, SameSite=Lax cookie; scrypt password hashing;
  12-hour expiry verified on every request; failures are logged.
- In production a plaintext `ADMIN_PASSWORD` is **refused** — `ADMIN_PASSWORD_HASH` is required.
- Webhooks require a shared secret header and fail closed when it is unset in production.
- Customer-supplied money never sets `verified`: only an authenticated admin action or a
  secret-authenticated webhook can (§30). See `lib/orders/payment.ts`.
- No secret is ever read in a client component; `lib/db/*` and `lib/auth/*` import
  `server-only` so a mistake becomes a build error.
