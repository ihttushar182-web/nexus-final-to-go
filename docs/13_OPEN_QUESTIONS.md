# 13 — Open Questions

**Rule that produced this file (§62):** when a fact was not stated in the business
documents, it was **not invented**. A sensible placeholder was used instead, and it is
recorded here. Nothing in this file should be presented to a customer as a confirmed fact
until the business answers it.

Status legend: **OPEN** — business decision needed · **PLACEHOLDER** — a technically safe
value is running in production, confirm or replace it · **DEFERRED** — intentionally out
of scope for this build.

---

## A. Commercial facts that are still unknown

### A1. Prices for five solution products — OPEN
`currentPrice: null`, displayed as *TBC* on the site:

| Product | Slug |
| --- | --- |
| Business Structure & Management Setup | `business-structure-setup` |
| Website & Conversion System | `website-conversion-system` |
| Automation & Integration System | `automation-integration` |
| AI Agent & Assistant System | `ai-assistant-system` |
| Custom Portal / Business Application | `custom-portal-application` |

These are quote-based engagements. **Question:** publish a starting price, a price range,
or keep them as "price confirmed after a scoping call"?

### A2. Hosting plan prices beyond the three active tiers — OPEN
Only Nexus Host Starter, Business and Growth have published prices. Reseller, white-label,
managed and WordPress tiers have no price in the source documents. The Nexus Host page
states plainly that these are confirmed on request — it does not invent a number.
**Question:** confirm pricing, or confirm that they should stay off the price list.

### A3. Bank transfer details — OPEN
The payment-methods list mentions bank transfer "on request", but no account name, number,
bank or branch appears anywhere in the source documents, and none is published on the site.
**Question:** supply the details if they should be public, or keep transfers as an
individually arranged option (current behaviour).

### A4. Delivery time commitments per package — PLACEHOLDER
Each product carries a delivery window from the documents. **Question:** confirm these are
operationally achievable at current capacity, especially for the Premium profile. The
support rules forbid promising a date that is not verified in the system, so the published
windows should be ranges the team can always hit.

---

## B. Deferred product scope

### B1. Customer portal — DEFERRED
`/login`, `/dashboard` and `/account` are live URLs rendering a "coming soon" explanation
(`components/portal/PortalPlaceholder.tsx`). They exist so the URL structure, navigation
and SEO surface are already correct and do not have to be retrofitted.

The database already models what a portal needs (orders, payment events, revisions,
deliveries, tickets, customers), so enabling it is additive. `NEXT_PUBLIC_ENABLE_PORTAL`
documents the state.
**Question:** is the portal on the roadmap, and does it need Supabase Auth?

### B2. Website checkout — DEFERRED, deliberately
There is no checkout, by design — the sales path is Messenger/WhatsApp → bKash → human
verification. The architecture supports adding one later (orders, order items, payment
events, payment states) without a rewrite. `NEXT_PUBLIC_ENABLE_CHECKOUT=false` records this.
**Question:** confirm this stays the model for the next 12 months.

### B3. Multi-user admin accounts — DEFERRED
Admin authentication is a single credential (`ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH`) with a
`role` field on the session (`ceo | manager | sales | marketing | delivery | support`).
The role is not yet enforced per screen, and there is no user table.
**Question:** will more than one staff member need access, and should permissions differ
per role? If yes, the migration path is Supabase Auth plus a `profiles` table, changing only
`lib/auth/session.ts`.

---

## C. Integrations that need credentials

### C1. Messenger deep link — PLACEHOLDER
`NEXT_PUBLIC_MESSENGER_URL` is empty, so `buildMessengerLink()` falls back to the Facebook
page URL. A true `m.me` deep link needs the page username.
**Question:** supply the page username or a `m.me` URL to remove the extra click.

### C2. Analytics provider — OPEN
`lib/analytics/track.ts` pushes a complete event vocabulary to `dataLayer` and to a
`window.nlTrack` hook, but no provider is hard-coded and no third-party script is loaded.
**Question:** GA4, Meta Pixel, Plausible, or all events into Supabase? Until this is
answered the site collects nothing, which is the privacy-safe default.

### C3. Email provider — PLACEHOLDER
`EMAIL_PROVIDER=console` means emails are logged, not sent. The template layer
(`lib/integrations/email.ts`) is complete for audit confirmations, order confirmations and
payment receipts.
**Question:** which provider (Resend, Postmark, SMTP via the host)? Set
`EMAIL_PROVIDER_KEY` and the sender address when chosen.

### C4. Supabase project — OPEN
`db/schema.sql` and `db/seed.sql` are ready, and the Supabase driver is implemented, but no
project is provisioned, so the app runs on the local JSON store.
**Question:** provision the project and switch `DB_DRIVER=supabase` before running more than
one instance (the local driver is single-writer by design).

### C5. n8n workflows — OPEN
The inbound endpoints exist and are tested (`/api/webhooks/n8n/{lead,order,payment,message,audit}`),
and outbound events are emitted, but the n8n side is not part of this repository.
**Question:** who owns the workflow definitions, and where are they version-controlled?
Also confirm the header name (`x-nexus-secret`) in the n8n HTTP node configuration.

### C6. Facebook / Meta credentials — OPEN
`META_PAGE_ID`, `META_ACCESS_TOKEN`, `META_APP_SECRET` and `META_VERIFY_TOKEN` are
documented but unset, so the Messenger webhook is not live.

---

## D. Content and legal review

### D1. Legal documents need professional review — OPEN
`/privacy`, `/terms` and `/refund-policy` are rendered from `data/policies.ts`, written
strictly from the business documents with no invented clauses. Each page carries a visible
"not legal advice / subject to applicable law" notice.
**Question:** has a lawyer reviewed them for Bangladesh jurisdiction? In particular the
refund position on digital deliverables and the data-handling wording.

### D2. Refund thresholds — OPEN
The refund policy states refunds are considered case by case by the business owner, with
the reasoning shown on the page. No numeric threshold, deadline or cap was specified in the
source documents, so none is published.
**Question:** confirm the internal rule, and decide how much of it can be public.

### D3. Case-study and insight attribution — PLACEHOLDER
Every case study carries an `evidenceNote` and every numeric insight section carries a
`source` (client-reported operational records, client CRM activity log, or Nexus Lift's own
internal audit sample). A test fails the build if a percentage is published without a source.
**Question:** who signs off on adding new case studies, and is client permission recorded
before a number is published?

### D4. Case-study client names — PLACEHOLDER
Where the source documents did not name a client, the case study is written without one
rather than inventing a company. **Question:** add real names/quotes with written permission,
or keep them anonymised.

---

## E. Technical decisions worth revisiting

### E1. Locale delivery method — DECIDED, revisit if per-language SEO matters
Language comes from a cookie so one URL serves both Bangla and English. The consequence is
dynamic rendering. Migrating to static `/[locale]/…` routes with `hreflang` is described in
`docs/07_I18N.md` §3 and is a contained refactor (all content is already `{ bn, en }`).
**Question:** is ranking separately for Bangla and English queries a business goal?

### E2. Soft 404 on `/business-audit/result/{id}` — KNOWN LIMITATION
Unknown catalogue slugs now return a real `404` via `proxy.ts`. Audit result ids are
opaque UUIDs from the database and cannot be validated in the proxy, so an unknown result
id renders the not-found page with a `200` status. The page is `noindex` and is only ever
reached from a successful submission, so the SEO exposure is nil.
**If this ever matters:** validate the id in the route handler and return a real 404 there.

### E3. In-memory rate limiting — PLACEHOLDER
`lib/logger.ts` keeps counters in process memory (configurable via `RATE_LIMIT_*`). It
resets on deploy and is per-instance. **Question:** move to Redis or Supabase when the site
runs on more than one instance.

### E4. Site domain — PLACEHOLDER
`NEXT_PUBLIC_SITE_URL` defaults to `https://nexuslift.com`. Canonicals, OG URLs, the
sitemap and `robots.txt` all derive from it.
**Question:** confirm the production domain (and any `www` redirect policy) before launch.

### E5. Placeholder brand assets — PLACEHOLDER
`app/favicon.ico` is generated from the brand mark. There is no photography or logo asset
package beyond the wordmark and icon components, because none was supplied.
**Question:** is there an official logo file, and are there approved photographs to replace
the current typographic treatment?

### E6. Legal entity details — OPEN
No registered company name, trade licence number, address or VAT/BIN number appears in the
source documents, so none is published and the footer shows only contact channels.
**Question:** supply the registered details if they should appear on invoices, the contact
page or the legal pages.

---

## F. Capability inventory (added after the owner supplied the product-line list)

### F1. Which capability lines should become priced products? — OPEN
23 lines are published as delivery capability. Only some are priceable today: the three
Brand Profile packages, plus products carrying the AI, CRM, dashboard, website, SOP and
document lines. **Two lines are explicitly `engagement: "scoped"`** and show no price:
**S** AI SaaS MVP and **W** Custom Business Tools.

**Question:** which of the remaining lines should get a published starting price, and which
should stay quote-only? A published price makes the line easy to buy and easy to compare; a
quote-only line protects scope flexibility. This is a commercial call, not a technical one.

### F2. AI SaaS MVP scope boundary — OPEN
An MVP can mean anything from a clickable prototype to a live product with billing. The
current page says the first version carries the provable core features, accounts, payment
readiness and measurement — but sets no boundary on users, features or timeline.
**Question:** define the MVP boundary (what is always included, what is billed separately)
so scoping conversations start from a shared definition.

### F3. Data handling for RAG / knowledge assistants — OPEN
**T** RAG / Knowledge Assistant and **U** AI Document Automation both process the client's
own documents, which may contain customer data, contracts or financial records. The site
makes no claim about where that data is stored, how long it is retained, or whether it trains
anything.
**Question:** confirm the policy (storage location, retention, whether documents are ever
used for model training, deletion on request) so it can be stated accurately — and check it
against `data/policies.ts`. Until this is answered, avoid promising anything about it in a
sales conversation.

### F4. Technology disclosure level — OPEN
The full stack (n8n, Make, Zapier, Next.js, React, Node.js, PostgreSQL, Supabase) is now
published with a "means, not the goal" framing. Publishing it helps buyers who search for
tools by name and reassures technical stakeholders, but it also invites comparison shopping
on tools rather than outcomes.
**Question:** keep the full list public, or summarise it as capabilities only? (Current
default: public, and clearly subordinate.)

### F5. Personal / portfolio lines and the SME positioning — OPEN
**P**, **Q** and **R** (Personal Website, Personal Brand Website, Portfolio Website) sit under
this site's SME systems positioning. They are genuinely offered, but they serve a different
buyer (an individual, not a business) and a lower price point.
**Question:** keep them on `/capabilities`, or give them their own entry point? Their
presence changes how the brand reads to an SME owner evaluating a systems engagement.

### F6. Delivery capacity per line — OPEN
The published inventory implies the business can deliver all 23 lines. It says nothing about
availability, lead times or concurrent capacity. If several lines are effectively
best-effort or partner-delivered, the page should say so rather than let a buyer assume the
same delivery standard throughout.
**Question:** which lines are actively delivered in-house today, and what is the realistic
concurrent capacity?

### F7. Certification, partnership or compliance claims — OPEN
No certifications, vendor partnerships or compliance accreditations are published, because
none was stated. If any exist (for example a platform partner tier or an information-security
accreditation), they are a legitimate trust signal that is currently missing.
**Question:** supply any verifiable credentials worth publishing.
