# 02 — Database

## 1. Two drivers, one contract

`lib/db/types.ts` defines the `Repository` interface. Everything else in the app talks to
that interface, never to a database client.

| Driver | Selected when | Used for |
| --- | --- | --- |
| `LocalRepository` | default, or `DB_DRIVER=local` | development, preview, single-instance deploys |
| `SupabaseRepository` | `DB_DRIVER=supabase` **and** `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` present | production |

If the Supabase driver fails to construct, `getRepository()` logs the error and falls
back to the local store rather than crashing the site.

```ts
const repository = getRepository();      // never `new SupabaseClient(...)` in a route
await repository.createLead({ ... });
```

## 2. Local store

`lib/db/local.ts` keeps one JSON document (`.data/nexus-lift.json` by default, override
with `LOCAL_DB_DIR`).

- Writes are **atomic** (write to a temp file, then `rename`) so a crash cannot corrupt
  the file.
- Every mutation is serialised through an internal promise queue, so two concurrent
  requests cannot clobber each other's changes.
- The document is cached in memory between reads.
- Webhook log entries are capped (`MAX_LOG_ENTRIES`) so the file cannot grow without limit.

It is intentionally **not** a multi-writer database. Treat it as: perfect for demo,
preview and small production; move to Supabase the moment two web dynos exist.

## 3. Tables

`db/schema.sql` is the canonical PostgreSQL/Supabase schema; `db/seed.sql` mirrors the
TypeScript content layer idempotently.

| Table | Purpose | Key columns |
| --- | --- | --- |
| `audit_submissions` | Free Business Audit responses | `business_name`, `answers` (jsonb), `snapshot` (jsonb), `priority_layer` |
| `leads` | CRM records | `status`, `score`, `source`, `product_interest`, `owner`, `next_followup_at` |
| `lead_events` | append-only activity trail | `lead_id`, `type`, `message`, `actor` |
| `orders` | orders | `order_number`, `status`, `payment_status`, `items` (jsonb), `total` |
| `payment_events` | payment audit trail | `order_id`, `type`, `amount`, `method`, `reference`, `actor` |
| `customers` | one row per buyer | `email` (unique), `orders` |
| `support_tickets` | support queue | `subject`, `status`, `channel` |
| `webhook_logs` | inbound automation log | `endpoint`, `event`, `status`, `detail`, `payload` |
| `daily_metrics` | reporting snapshots | `date`, `mrr`, `leads`, `orders` |

Apply with:

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql      # optional, idempotent
```

## 4. Enumerations

These mirror `lib/validation/schemas.ts` exactly, so an API payload can never write a
state the database does not understand.

- **Lead status:** `new`, `qualified`, `contacted`, `interested`, `proposal`, `won`, `lost`, `nurture`
- **Order status:** `inquiry`, `pending_information`, `awaiting_payment`, `payment_verification`,
  `confirmed`, `in_production`, `revision_1`, `revision_2`, `final_review`, `delivered`,
  `after_sales`, `completed`, `cancelled`
- **Payment status:** `pending`, `submitted`, `verified`, `rejected`, `adjustment_required`

## 5. The payment rule (§30) — read this before touching orders

Money states are the most dangerous part of the system. The rule is encoded once, in
`lib/orders/payment.ts`:

> A payment that has been verified **cannot** be moved backwards by any automated or
> customer-triggered event.

`resolvePaymentTransition(order, input)` returns the next `{ paymentStatus, status }`
plus a `changed` flag:

| Situation | Result |
| --- | --- |
| Fresh order, customer submits a reference | → `submitted` / `payment_verification` |
| Order was `rejected` / `adjustment_required`, customer resubmits | → `submitted` (allowed) |
| Order is already `verified` | unchanged (`changed: false`) |
| Order already `confirmed`, in production, delivered or completed | unchanged |
| Order `cancelled` | unchanged |
| Explicit `verified: true` from an admin or a secret-authenticated webhook | → `verified` / `confirmed` |

Both `/api/orders/[id]/payment` and the n8n `payment` webhook call this helper, so the
two paths cannot drift. `tests/payment-state.test.ts` covers every row above.

The only two ways to reach `verified`:
1. `PATCH /api/admin/orders/:id` with an authenticated admin session.
2. `POST /api/webhooks/n8n/payment` with the correct secret **and** `verified: true`.

The customer-facing endpoint has no `paymentStatus` field in its schema at all — a
tampered request is rejected by Zod before any code runs.

## 6. Relational integrity & retention notes

- `leads` are de-duplicated on *(lowercased email + product interest)*: a repeat enquiry
  updates the existing record and appends a note event. This keeps the CRM honest
  (`tests/repository.test.ts`).
- `lead_events` and `payment_events` are **append-only**; the UI never edits history.
- `orders.revenue` in the dashboard counts **only** `payment_status = 'verified'` and
  excludes cancelled orders — unverified money is never reported as revenue.
- `webhook_logs` is a diagnostic trail, safe to prune; the local driver caps it
  automatically.

## 7. Backups

- **Supabase:** use the project's point-in-time recovery; no custom job needed.
- **Local driver:** copy `.data/nexus-lift.json` on a schedule. It is a single file, so
  any host-level snapshot works. Do not store it in git (it is gitignored).
