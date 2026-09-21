# 05 — Products & Pricing

**This is a commercial document. Prices here must match `data/products.ts`, which is the
only executable source of truth.** If the two ever disagree, the page is right and this
file is stale.

## 1. Brand Profile packages (the three headline products)

| Package | URL | Price | Was | Savings |
| --- | --- | --- | --- | --- |
| Professional Business Profile — Starter | `/products/professional-business-starter` | ৳999 | ৳1,900 | ৳901 (47%) |
| Professional Business Profile — Growth | `/products/professional-business-growth` | ৳1,499 | ৳2,599 | ৳1,100 (42%) |
| Professional Business Profile — Premium | `/products/professional-business-premium` | ৳2,999 | ৳4,499 | ৳1,500 (33%) |

All three are one-time payments in BDT. `tests/catalogue.test.ts` asserts these exact
numbers, so a price change that is not reflected everywhere fails the build's test gate.

## 2. The full catalogue

Beyond the three profiles, `data/products.ts` holds the solution products and the Nexus
Host plans (11 products plus hosting tiers). Two rules apply to every entry:

1. **No invented prices.** A product whose price is not yet confirmed carries
   `currentPrice: null` and is displayed as *TBC* — the UI never guesses and never shows
   a blank price. Anything still TBC is listed in `docs/13_OPEN_QUESTIONS.md`.
2. **No invented features.** Every deliverable, delivery time and revision count in the
   data file came from the business documents.

## 3. Product page structure (§09)

Every product page renders, in order:

1. name, badge, short description,
2. price block — current price, struck-through original price, savings and discount %,
3. what is included (deliverables) and features,
4. delivery time, delivery format and revision rounds,
5. process steps,
6. requirements the customer must provide,
7. target customer, the problem it solves, the outcome,
8. FAQ (from `data/faq.ts` ids referenced by the product),
9. cross-sell / upsell links,
10. WhatsApp + Messenger CTAs, followed by the audit CTA.

JSON-LD `Product` is emitted with `offers` **omitted when the price is TBC** — publishing
an offer without a price would be misleading structured data.

## 4. How the site sells (§07 — important)

There is **no website checkout**, by design. The purchase path is:

```
Product page → WhatsApp / Messenger (message pre-filled with the product name)
            → human confirms the package
            → bKash payment + transaction ID
            → human verification
            → production and delivery
```

`NEXT_PUBLIC_ENABLE_CHECKOUT=false` documents the current state. The data model already
supports a checkout later (orders, order items, payment events, payment states), so adding
one is an additive change — not a rewrite.

## 5. WhatsApp CTA contract (§25)

`lib/integrations/whatsapp.ts` is the only place a WhatsApp link is built:

```ts
buildWhatsAppLink({ productName, intent, url, locale });
// https://wa.me/8801814716713?text=<encoded product name + intent + product URL>
```

The number comes from `siteConfig.whatsapp` (env-configurable) — never hard-coded in a
component. `tests/whatsapp.test.ts` proves the link carries the product name, that it is a
valid encoded URL, and that it falls back to the intent and then to a safe default instead
of sending an empty message.

## 6. Nexus Host

Hosting prices are published **only** for the three active plans. Reseller, white-label,
managed and WordPress hosting tiers deliberately show *TBC* with an explicit note that the
price is confirmed on request — the site never invents a hosting price.

## 7. Changing a price — checklist

1. Edit `data/products.ts` (`currentPrice` / `originalPrice`).
2. Update the table in this document.
3. Run `npm run test` — `tests/catalogue.test.ts` will fail if the three headline packages
   drift, which is the reminder to update this file too.
4. `npm run build`, then verify the product page and the card on `/products`.

Prices also appear in `db/seed.sql` for demo data; regenerate it if you want seeded demo
orders to match.
