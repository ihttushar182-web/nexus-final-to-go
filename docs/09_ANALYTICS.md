# 09 — Analytics & events

## 1. One function, one vocabulary

`lib/analytics/track.ts` is the only way an event leaves the browser:

```ts
import { track } from "@/lib/analytics/track";
track("whatsapp_click", { page: "/products/professional-business-starter", cta_location: "product_hero" });
```

Events are pushed to `window.dataLayer` (GTM-compatible) and to an optional
`window.nlTrack(event, properties)` hook that any provider can subscribe to. Because the
transport is a single function, switching to GA4, Plausible or a warehouse sink is a
one-file change — no component edits.

`NEXT_PUBLIC_ANALYTICS_ID` is attached to every payload when set. The provider is
deliberately not hard-coded; see `docs/13_OPEN_QUESTIONS.md`.

## 2. The event vocabulary (§49)

| Event | Fired when | Key properties |
| --- | --- | --- |
| `page_view` | route change | `page` |
| `product_view` | a product page is viewed | `product_id`, `product_name` |
| `audit_start` | the audit form is opened | `page` |
| `audit_step_complete` | each funnel step is completed | `step`, `business_stage` |
| `audit_complete` | a submission succeeds | `priority_layer`, `layer` |
| `whatsapp_click` | any WhatsApp CTA | `product_id`, `product_name`, `page`, `cta_location` |
| `messenger_click` | any Messenger CTA | `page`, `cta_location` |
| `contact_submit` | the contact form succeeds | `page` |
| `lead_created` | a lead is acknowledged | `source` |
| `order_intent` | an "order now" click, before any sale | `product_id`, `product_name` |
| `payment_submitted` | a customer submits a payment reference | `value` |
| `cta_click` | generic tracked link | `cta_location`, `page` |

The names are stable on purpose: report definitions should not need rewriting because a
button moved.

## 3. Privacy rules

- **Never** send name, email, phone, business name, transaction IDs, message bodies or
  anything a customer typed. Property values are limited to ids, slugs, page paths and
  funnel metadata.
- The events above are defined by `AnalyticsProperties`; anything not in that list is a
  code-review flag.
- `page_view` fires on the path only — never with query strings.
- No third-party script is loaded by default, so there is no cookie-consent burden until a
  provider is actually configured.

## 4. Funnel reporting

The sequence to build reports on:

```
page_view → audit_start → audit_step_complete (×4) → audit_complete → lead_created
product_view → order_intent → whatsapp_click → (off-site) → payment_submitted
```

`whatsapp_click` includes `product_id` and `cta_location`, so it is possible to see which
product and which placement actually starts conversations.

## 5. Server-side truth

Client events measure intent; the database measures reality. For authoritative numbers use
the repository, not the browser:

- `repository.stats()` — leads, qualified leads, orders, pending payments, active orders,
  delivered orders, **verified revenue**, audits.
- `repository.listDailyMetrics()` — daily reporting snapshots.

Revenue is counted only from `payment_status = 'verified'` and excludes cancelled orders.
If analytics and the dashboard disagree, the dashboard is correct.

## 6. Enabling a provider

1. Set `NEXT_PUBLIC_ANALYTICS_ID`.
2. Either load the provider's script and let it read `dataLayer`, **or** register a hook:

```ts
window.nlTrack = (event, props) => myProvider.send(event, props);
```

3. Verify in the network tab that no PII appears in any payload.
