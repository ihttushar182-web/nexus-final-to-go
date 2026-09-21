# 03 — API

All endpoints are Next.js route handlers under `app/api/`. Every one of them:

- validates its payload with Zod **on the server** (`lib/validation/schemas.ts`),
- is rate limited per IP (`lib/logger.ts` → `rateLimit`),
- returns a consistent envelope: `{ ok: true, ... }` or `{ ok: false, error, fieldErrors? }`,
- logs through `lib/logger.ts` (never `console.log` with customer data).

Error codes: `400` malformed JSON · `401` unauthenticated · `404` not found ·
`405` method not allowed · `422` validation failed · `429` rate limited · `500` server error.

---

## Public

### `GET /api/health`
Service probe. Returns status, version, timestamp and a database check.

```json
{ "status": "ok", "version": "2.0.0", "timestamp": "2026-09-21T07:40:54.319Z",
  "checks": { "database": "ok", "driver": "local", "latencyMs": 0 } }
```

### `POST /api/audit`
Submits the Free Business Audit. Scores the six layers (Yes = 10, Partial = 5, No = 0),
determines the priority layer, stores the submission **and** creates/updates a CRM lead.

```jsonc
// request
{
  "businessName": "Rahman Traders",
  "businessLink": "https://facebook.com/rahman",   // optional
  "businessStage": "growing",
  "teamSize": "3-5",
  "answers": { "identity": "yes", "structure": "partial", "operations": "no",
               "growth": "yes", "intelligence": "no", "control": "partial" },
  "biggestProblem": "visibility",
  "currentTools": "Excel, WhatsApp",               // optional
  "goal": "leads",
  "name": "Rahman", "email": "rahman@example.com", "whatsapp": "01814716713",
  "locale": "bn"                                   // optional
}
// response
{ "ok": true, "id": "ffef1129-…", "priorityLayer": "operations" }
```

The result page is `/business-audit/result/{id}`. Unknown ids render the not-found page.

### `POST /api/leads`
Generic lead capture (same core schema as contact, without subject/message). De-duplicates
on *(email + product interest)*.

### `POST /api/contact`
Contact form. Extends the lead schema with `subject` and `message` (min 10 chars) and
accepts `source`, `channel`, `utm`, plus a honeypot field `company_website` which must be
empty. A bot that fills it gets `422`.

### `POST /api/orders`
Creates an order **from a product slug**, never from a client-supplied price:

```jsonc
{ "customerName": "Karim", "customerEmail": "karim@example.com",
  "customerPhone": "01712345678", "productSlug": "professional-business-starter",
  "quantity": 1, "notes": "optional" }
// → { "ok": true, "id": "…", "orderNumber": "NL-1001", "total": 999 }
```

The unit price is read from `/data/products.ts`, and the total is computed server-side.
A new order always starts `awaiting_payment` / `pending`.

### `POST /api/orders/{id}/payment`
The customer submits a bKash transaction reference. This is a **request for verification**,
never an approval. A verified payment is never moved backwards (see `docs/02_DATABASE.md` §5).

```jsonc
{ "orderId": "…", "reference": "TRX77HH22", "amount": 999, "method": "bKash" }
// → { "ok": true, "paymentStatus": "submitted", "status": "payment_verification",
//     "note": "Your payment information is under verification. …" }
```

### `GET /api/search?q=&locale=`
Searches products, solutions, insights, FAQs and case studies in the requested language.
Queries shorter than two characters return an empty result set (no DB work).
Rate limit: 60/min/IP. Response: `{ ok, query, count, results[] }` where each result is
`{ type, title, description, href }`.

---

## Admin (session required)

Authentication is a signed HttpOnly cookie set by `POST /api/admin/session`. Every admin
endpoint below returns `401` without a valid session. In production the admin password
must be supplied as an `ADMIN_PASSWORD_HASH` (scrypt) — a plaintext `ADMIN_PASSWORD` is
refused.

### `POST /api/admin/session`
```jsonc
{ "email": "admin@nexuslift.com", "password": "…" }
// → { "ok": true, "email": "…", "role": "ceo", "expiresAt": 1790020098261 }
```
Rate limited to 6 attempts per 5 minutes per IP; failures are logged as warnings.
`GET` returns the current session or `401`. `DELETE` signs out.

### `PATCH /api/admin/leads/{id}`
Body is a partial: `{ status?, owner?, notes?, score?, nextFollowupAt? }`.
Setting any status other than `new` records `lastContactAt`; non-empty `notes` also append
a `note` event with `actor = session.email`.

### `PATCH /api/admin/orders/{id}`
Body: `{ status?, paymentStatus?, notes? }`. A `paymentStatus` change appends a
`payment_event`, and the endpoint emits `order.status_changed` to n8n.

**This is one of only two paths that can set `paymentStatus: "verified"`.** The second is
the n8n payment webhook with `verified: true`.

---

## Automation webhooks

### `POST /api/webhooks/n8n/{lead|order|payment|message|audit}`

- Auth: `x-nexus-secret: <N8N_WEBHOOK_SECRET>` header (or `Authorization: Bearer <secret>`).
  Missing header → `401`. **If the secret is unset in production the endpoint fails
  closed**; in development it accepts and warns.
- Idempotency: send `idempotencyKey`; a repeat is acknowledged as
  `{ "ok": true, "duplicate": true }` without side effects.
- Every call is written to `webhook_logs` with `accepted` / `rejected` / `error`.

```jsonc
// shared envelope
{ "event": "lead.created", "idempotencyKey": "evt-001",
  "occurredAt": "2026-09-21T07:00:00Z", "payload": { … } }
```

| Endpoint | Payload | Effect |
| --- | --- | --- |
| `lead` | `{ name, email, phone, source?, productInterest? }` | creates/de-duplicates a lead |
| `order` | `{ orderId, status? }` | updates order status |
| `payment` | `{ orderId, reference?, amount?, method?, verified? }` | appends a payment event; only `verified: true` sets `verified` |
| `message` | `{ conversationId, body, channel, direction? }` | logged (Messenger/WhatsApp history) |
| `audit` | `{ auditId }` | looks up a stored audit for follow-up |

---

## Rate limits

| Scope | Limit |
| --- | --- |
| Public form posts (`/api/audit`, `/api/contact`, `/api/leads`, `/api/orders`, payment) | 20 / minute / IP |
| Search | 60 / minute / IP |
| Admin login | 6 / 5 minutes / IP |
| Webhooks | secret-authenticated, plus the global limiter |

Limits are configurable with `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS`.
The limiter is in-memory: with multiple instances, move it to Redis or Supabase.
