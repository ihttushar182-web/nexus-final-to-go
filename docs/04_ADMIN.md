# 04 — Admin & CRM

The staff area at `/admin`. It is the operational surface of the business: leads, orders,
payments, audits and messages.

## 1. Access

`app/admin/layout.tsx` guards every child route:

- no valid session → renders the sign-in form instead of the page;
- a development hint appears **only** when no admin credential is configured, so the
  behaviour is obvious locally without weakening production;
- the whole area is `dynamic = "force-dynamic"` and sends
  `robots: { index: false, follow: false, nocache: true }`.

### Setting the password

```bash
node scripts/hash-password.mjs "your-strong-password"
# → ADMIN_PASSWORD_HASH=scrypt:…
```

Put the output in `.env.local`. **In production the plaintext `ADMIN_PASSWORD` is
refused** — a hash is required. Sessions last 12 hours and are verified (signature +
expiry) on every request.

### Roles

`AdminSession.role` accepts `ceo | manager | sales | marketing | delivery | support`
(set with `ADMIN_ROLE`). The current build authenticates a single operator; the role field
exists so multi-user auth can be added without changing the session shape. See
`docs/13_OPEN_QUESTIONS.md`.

## 2. Screens

| Route | What it does |
| --- | --- |
| `/admin` | dashboard: lead/order/revenue/audit counters, recent leads, recent audits |
| `/admin/leads` | CRM list with status, source, score and last contact; filters |
| `/admin/leads/{id}` | lead detail: profile, the audit that produced it, and the full activity trail; editor for status / owner / score / next follow-up / notes |
| `/admin/audits` | every audit submission with its layer scores and priority layer |
| `/admin/orders` | orders with status, payment status and total |
| `/admin/orders/{id}` | order editor: advance status, record payment decisions, add notes |
| `/admin/customers` | customers derived from orders |
| `/admin/messages` | inbound webhook log (Messenger/WhatsApp/n8n) |
| `/admin/products` | read-only view of the catalogue (prices come from `/data/products.ts`) |
| `/admin/content` | read-only view of content inventory (insights, FAQs, case studies) |
| `/admin/settings` | configuration status: which integrations are configured, driver in use |

## 3. Creating an order for a customer

Orders are normally created by the customer via `/api/orders`, or by an admin from a
conversation. The order always:

1. resolves the price from the catalogue — an admin cannot typo a price,
2. starts `awaiting_payment` / `pending`,
3. only reaches `verified` through an explicit admin decision or a verified webhook.

## 4. Lead lifecycle

```
new → qualified → contacted → interested → proposal → won
                                             ↘ lost
                                             ↘ nurture
```

- Setting any status other than `new` stamps `lastContactAt`.
- Adding notes appends a `note` event attributed to the signed-in user, so the trail shows
  who knew what, when.
- Repeat enquiries from the same email + product interest merge into the existing record
  with a merge note — the CRM never shows the same person twice.

## 5. Replacing the CRM later

Everything the admin UI does goes through `Repository` (`lib/db/types.ts`). To move to
HubSpot, Zoho or a custom CRM:

1. implement the same interface in `lib/db/<crm>.ts`,
2. return it from `getRepository()`,
3. leave the UI untouched.

The UI has no knowledge of Supabase, tables or SQL — that is the point of the abstraction.

## 6. Operational notes

- The dashboard's revenue figure counts **verified, non-cancelled** orders only. If it
  looks lower than expected, that is correct behaviour, not a bug.
- `/admin/products` and `/admin/content` are intentionally read-only: product pricing and
  copy are code-reviewed changes in `/data`, so a price can never be changed by accident
  in a form and never diverges from the public page.
- Actions are logged server-side (`lib/logger.ts`) with the acting email where relevant.
