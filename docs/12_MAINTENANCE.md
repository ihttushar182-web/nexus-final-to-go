# 12 — Maintenance

## 1. The daily loop

| Task | Where |
| --- | --- |
| Answer new enquiries | WhatsApp / Messenger (the site routes there) |
| Work the pipeline | `/admin/leads` — set status, add notes, set next follow-up |
| Verify payments | `/admin/orders` → set `paymentStatus: verified` **only after the money is confirmed** |
| Advance orders | `/admin/orders/{id}` |
| Review audits | `/admin/audits` — the funnel's output, with layer scores |
| Check automation | `/admin/messages` — inbound webhook log |

## 2. Common changes

**A price changes**
1. `data/products.ts`
2. `docs/05_PRODUCTS.md` table
3. `npm run test` (the catalogue test fails if the headline packages drift)
4. `npm run build` and spot-check the product page and card

**A new insight article**
1. Add it to `data/insights.ts` with `{ bn, en }` for every field.
2. Any section containing a number needs a `source` — the content-integrity test fails
   otherwise.
3. Add the slug to `app/sitemap.ts` coverage (dynamic insights are picked up automatically)
   and verify the page renders in both languages.

**A new FAQ**
1. `data/faq.ts`, with a `source` describing where the answer came from.
2. Reference its id from the product or page that should show it.

**A new product**
1. `data/products.ts` — include the SEO fields, deliverables, delivery time, revisions,
   requirements and FAQ ids. If the price is not confirmed, use `null` (renders as TBC)
   and add it to `docs/13_OPEN_QUESTIONS.md`.
2. No extra product may be invented: the catalogue is the business's actual offer.

**Changing the WhatsApp number or contact details**
1. The environment variable (`NEXT_PUBLIC_WHATSAPP_NUMBER`) or `config/site.ts`.
2. Nothing else — no component holds a number. `tests/whatsapp.test.ts` proves links are
   built from configuration.

## 3. Adding a page

1. Create `app/<route>/page.tsx` with `metadata` (title, description, canonical).
2. Read content from `/data`; never hard-code copy in the component.
3. Build it from existing primitives (`Section`, `PageHero`, `ButtonLink`, …) before
   writing new ones.
4. Add the route to `data/navigation.ts` if it belongs in the header/footer —
   `tests/content-integrity.test.ts` will fail if the link does not resolve.
5. Add it to `app/sitemap.ts`.
6. `npm run verify`.

## 4. Adding an API endpoint

1. Create `app/api/<name>/route.ts`.
2. Validate with a Zod schema in `lib/validation/schemas.ts`.
3. Rate limit with `rateLimit(clientIdentifier(request, "<scope>"))`.
4. Persist through `getRepository()` — never call a database client directly.
5. Return `apiSuccess` / `apiError`; log with `lib/logger.ts`.
6. Document it in `docs/03_API.md`.

## 5. Periodic checks

**Monthly**
- [ ] `npm outdated` and plan upgrades; never run `npm audit fix --force` unreviewed.
- [ ] Confirm backups exist (Supabase PITR, or a copy of `.data/nexus-lift.json`).
- [ ] Skim `/admin/messages` for rejected webhooks — a steady stream means a secret or
      payload mismatch in n8n.
- [ ] Verify unknown catalogue URLs still 404.

**Quarterly**
- [ ] Re-run the manual QA checklist (`docs/11_TESTING.md` §4).
- [ ] Review FAQ answers against reality — a stale answer is a broken promise.
- [ ] Re-read `docs/13_OPEN_QUESTIONS.md` and close what the business has decided.
- [ ] Check case-study and insight numbers are still attributed to their source.

## 6. Known operational gotchas

- **Do not run the local driver on more than one instance.** It serialises writes in
  process; two instances can overwrite each other. Use Supabase.
- **`AUTH_SECRET` must not change silently.** Rotating it invalidates every admin session
  (that is the correct behaviour; just expect to sign in again).
- **In production, only `ADMIN_PASSWORD_HASH` works.** Setting a plaintext
  `ADMIN_PASSWORD` will look like a wrong-password loop.
- **Unsetting `N8N_WEBHOOK_SECRET` disables webhooks in production** by design (fail
  closed). The endpoint will answer `401` with a clear reason.
- **Never let a customer message set `paymentStatus: verified`.** The rule lives in
  `lib/orders/payment.ts`; both the customer endpoint and the webhook go through it.
  `tests/payment-state.test.ts` is the guard.

## 7. Security review triggers

Re-review `docs/01_ARCHITECTURE.md` §9 whenever you:
- add a public POST endpoint,
- add a file that touches the database or a secret,
- add a third-party script,
- introduce multi-user admin accounts (see `docs/13_OPEN_QUESTIONS.md`).
