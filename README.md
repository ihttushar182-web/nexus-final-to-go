# Nexus Lift

**Connecting Sources, Lifting Business** — business systems & growth infrastructure for
Bangladeshi SMEs.

This repository is not a marketing brochure. It is the business infrastructure itself: the
public website, the Free Business Audit funnel, a CRM/admin area for leads, orders,
payments and audits, and an API surface for marketing automation.

---

## Quick start

```bash
npm ci
cp .env.example .env.local     # optional for local work — sensible defaults are built in
npm run dev                    # http://localhost:3000
```

The app runs with **no credentials** in development: with `DB_DRIVER=local` it persists to
`.data/nexus-lift.json`, so you can click through the audit funnel and the admin area
immediately. No database, no third-party account, no network access needed at build time.

To sign in to `/admin` locally:

```bash
node scripts/hash-password.mjs "your-strong-password"
# put the printed ADMIN_PASSWORD_HASH (plus AUTH_SECRET) in .env.local
```

In development a plaintext `ADMIN_PASSWORD` is also accepted; **in production a hash is
required** and the plaintext value is refused.

## Verify

```bash
npm run verify     # typecheck → lint → tests → production build
```

Individually: `npm run typecheck` · `npm run lint` · `npm run test` · `npm run build`.

Current state: TypeScript clean, ESLint clean, 95 tests across 10 spec files, production
build green for every route.

## What's inside

| Area | Where | Notes |
| --- | --- | --- |
| Public site | `app/` | home, about, framework, **capabilities**, solutions, products, insights, case studies, FAQ, contact, book-call, legal |
| Capabilities | `app/capabilities/` | the 23 delivery lines (A–W) in 6 system families, sold as outcomes |
| Free Business Audit | `app/business-audit/` | four-step form → scored result page, stored as a CRM lead |
| Admin & CRM | `app/admin/` | auth-gated: dashboard, leads, audits, orders, customers, messages, products, content, settings |
| API | `app/api/` | audit, leads, contact, orders, payments, search, health, admin, n8n webhooks |
| Business logic | `lib/` | scoring, payment state machine, repository, validation, i18n, integrations |
| Content & knowledge | `data/` + `config/site.ts` | every price, feature and policy — the single source of truth |
| Database | `db/` | PostgreSQL/Supabase schema + idempotent seed |
| Docs | `docs/` | 13 documents, from architecture to the open-questions register |

## Two decisions worth knowing before you change anything

**There is no website checkout — on purpose.** Sales happen in Messenger/WhatsApp, payment
is bKash, and a human verifies the transaction before production starts. The data model
already supports adding a checkout later, so this is a sequencing decision, not a limit.

**A verified payment can only be changed by a person.** `lib/orders/payment.ts` encodes that
rule, and both the customer endpoint and the automation webhook go through it. A customer
resubmitting a transaction ID — or a late, duplicated notification — can never push an order
back out of `verified`, confirmation or production. `tests/payment-state.test.ts` guards it.

## Documentation

| Doc | Contents |
| --- | --- |
| [01 Architecture](docs/01_ARCHITECTURE.md) | stack, directory map, knowledge layer, request flow, security posture |
| [02 Database](docs/02_DATABASE.md) | drivers, tables, enums, the payment rule, backups |
| [03 API](docs/03_API.md) | every endpoint, payloads, error codes, rate limits |
| [04 Admin](docs/04_ADMIN.md) | authentication, screens, lead lifecycle, replacing the CRM |
| [05 Products](docs/05_PRODUCTS.md) | the catalogue, exact prices, how the site sells |
| [06 Audit System](docs/06_AUDIT_SYSTEM.md) | scoring, priority selection, honesty requirements |
| [07 i18n](docs/07_I18N.md) | Bangla default + English, fonts, adding strings |
| [08 SEO](docs/08_SEO.md) | metadata, structured data, 404 hygiene, AI-search readiness |
| [09 Analytics](docs/09_ANALYTICS.md) | the event vocabulary and privacy rules |
| [10 Deployment](docs/10_DEPLOYMENT.md) | environment, database choice, go-live checklist |
| [11 Testing](docs/11_TESTING.md) | what each spec protects + the manual QA checklist |
| [12 Maintenance](docs/12_MAINTENANCE.md) | routine tasks, how to change prices/content, gotchas |
| [13 Open Questions](docs/13_OPEN_QUESTIONS.md) | **every unresolved business decision and placeholder** |
| [14 Capabilities](docs/14_CAPABILITIES.md) | the 23 product lines, family grouping, merges, honesty rules |

## Principles this codebase is held to

- **Sell outcomes and systems, not technologies.** Every capability is written as the result
  it produces; the tools that build it are published but explicitly subordinate.
- **Never invent a business fact.** Prices, delivery times, policies and statistics come
  from the business documents or they are marked *TBC* and logged in `docs/13_OPEN_QUESTIONS.md`.
- **No unsupported claims.** No market-leader language, no guarantees, no fake urgency, no
  invented statistics, no competitor bashing. `data/brand.ts` lists these rules for
  machines; `tests/catalogue.test.ts` fails the build if a percentage ships without a source.
- **Business logic never lives in components.** Pages compose; `lib/` decides.
- **One source of truth per fact.** A price exists in exactly one file.
- **Validate on the server.** Client validation is UX; Zod on the server is the boundary.

## License

Proprietary — © Nexus Lift. All rights reserved. Fonts are used under their own
(SIL Open Font License) terms; see `app/fonts/`.
