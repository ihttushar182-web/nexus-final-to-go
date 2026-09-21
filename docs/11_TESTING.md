# 11 — Testing & QA

## 1. Running the suite

```bash
npm run test          # vitest run — 9 files, 79 tests
npm run test:watch    # during development
npm run typecheck     # tsc --noEmit
npm run lint          # eslint .
npm run verify        # all of the above + next build
```

`npm run verify` is the gate: it must be green before any deploy.

## 2. What is covered, and why

| File | Protects |
| --- | --- |
| `tests/audit-scoring.test.ts` | the scoring contract — Yes 10 / Partial 5 / No 0, six independent layers, the six maturity bands, deterministic priority selection (lowest layer → stated problem → goal → canonical order), and the rule that the evidence block must never claim scientific validation |
| `tests/validation.test.ts` | server-side validation: complete audit required, invalid answer values and malformed email/phone rejected, field errors shaped for the UI, **no price and no payment status in the public order contract** |
| `tests/catalogue.test.ts` | the catalogue is honest: the three headline packages exist at exactly ৳999 / ৳1,499 / ৳2,999 (was ৳1,900 / ৳2,599 / ৳4,499), unique slugs, no product without a name/description, savings computed only from real numbers, every solution maps to a real layer, exactly six layers, legal routes resolve, and **no percentage may be printed without a `source`** |
| `tests/repository.test.ts` | the CRM and order backbone: audit round-trip, lead de-duplication on email + product, status/search filters, append-only lead events, server-computed order totals, a new order is never verified, the payment lifecycle, customer reuse, verified-only revenue, tickets, webhook logs, durability across instances |
| `tests/payment-state.test.ts` | the money rules: verified is sticky, production/delivery/cancelled never regress, a rejection can be resubmitted, and only an explicit verification marks a payment verified |
| `tests/content-integrity.test.ts` | bilingual completeness across all of `/data` and the dictionaries, no leaked CJK characters, every insight section renders in both languages, every navigation link resolves to a real route (including dynamic segments) |
| `tests/proxy.test.ts` | no soft 404s: every real product/solution/insight slug passes, unknown slugs return 404, listing pages and unrelated routes are untouched |
| `tests/whatsapp.test.ts` | the WhatsApp contract: product name and link encoded into the prefilled message, language-aware wording, number from configuration, and a Messenger link that never dead-ends |
| `tests/utils.test.ts` | formatting (currency, percent, dates, relative time), localisation helpers returning safe fallbacks, and validators — including that `isBangladeshiPhone` accepts `01814716713`, `1814716713`, `+8801814716713` and `880 1814-716713`, and rejects `12345` |

## 3. Test conventions

- Tests import the **domain layer** (`/lib`, `/data`, `/config`), not React components:
  the logic is framework-independent by design.
- `server-only` is aliased to a stub in `vitest.config.ts` (it is a bundler marker, not
  runtime behaviour), so `lib/db` and `lib/auth` remain testable in plain Node.
- The repository test writes to `.data-test-<pid>` and cleans up before and after, so tests
  never touch real data and can run in parallel.
- Assertions are written against real contracts. When a test and the implementation
  disagree, decide which one is wrong — several early tests encoded the assumption rather
  than the requirement, and the implementation was right.

## 4. Manual QA checklist (§60)

Run before each release, on both mobile (360 / 390 / 430) and desktop (1280 / 1440+):

**Navigation**
- [ ] Header, footer and every in-page link resolve; no dead link or 404.
- [ ] Mobile drawer opens, closes on navigation, and locks background scroll.
- [ ] Language toggle switches every visible string, including form labels and errors.

**Funnel**
- [ ] Audit form: cannot advance with a missing answer; back/forward keeps data.
- [ ] Invalid email/phone shows an inline error, not a crash.
- [ ] Success → result page shows the layer bars, the priority layer and the disclaimer
      that it is *not* scientifically validated.
- [ ] Contact form: honeypot filled by a bot is rejected; a human submission succeeds.
- [ ] The lead appears in `/admin/leads` with the right source.

**Commerce**
- [ ] Product pages show the right price, savings and revision count.
- [ ] WhatsApp CTA opens a chat pre-filled with the product name.
- [ ] There is no checkout button anywhere (the current sales path is human).
- [ ] Customer payment submission moves the order to *payment verification*, and the
      dashboard still shows it as an unverified payment.
- [ ] Admin verification flips it to verified/confirmed, and a customer resubmission does
      **not** undo that.

**Admin**
- [ ] Wrong password is rejected and logged; correct password signs in.
- [ ] `/admin` is unreachable without a session.
- [ ] Lead status change stamps last contact and appends an attributed note.

**Content honesty (spot-check)**
- [ ] No "market leader", "#1", "guaranteed", fake countdown or invented statistic.
- [ ] Every number in a case study or insight shows its source.
- [ ] Working hours (10:00–17:00) are stated wherever availability is implied.

## 5. Accessibility spot-checks (§42)

- Keyboard: every interactive element is reachable and focus is visible.
- Forms: inputs are labelled; errors are announced (`role="status"` / `aria-live`).
- One `<h1>` per page; heading levels never skip.
- Colour contrast on the navy / mist palettes; do not rely on colour alone for state.
- The language toggle and mobile drawer are labelled controls, not icon-only buttons.
