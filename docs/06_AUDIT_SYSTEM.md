# 06 — Free Business Audit

The lead-generation engine: a multi-step form that produces a preliminary maturity
snapshot and a suggested first priority. It is the site's main conversion path.

Live at `/business-audit` (short links: `/audit` redirects here). Result pages live at
`/business-audit/result/{id}`.

## 1. Form stages

| Stage | Fields |
| --- | --- |
| 1 — Business | business name, website/social link, business stage, team size |
| 2 — The six layers | one Yes / Partial / No answer per layer: Identity, Structure, Operations, Growth, Intelligence, Control |
| 3 — Context | biggest problem, current tools, six-month goal |
| 4 — Contact | name, email, WhatsApp |

All four stages post as **one** payload to `POST /api/audit` — partial submissions are not
stored, so the CRM never holds half a record.

## 2. Scoring (§22)

```ts
Yes = 10   Partial = 5   No = 0
```

Six layers × 10 = a maximum of 60. Each layer is scored independently, and each layer's
score maps to a maturity band:

| Score | Band |
| --- | --- |
| 9–10 | Strong Foundation |
| 7–8 | Partially Defined |
| 5–6 | Needs Development |
| 3–4 | Mostly Manual |
| 1–2 | Limited Integration |
| 0 | Low Visibility |

### Priority selection

Deterministic and explainable (`lib/audit/scoring.ts`):

1. the **lowest-scoring layer** wins;
2. on a tie, the layer implied by the stated **biggest problem** wins;
3. then the layer implied by the six-month **goal**;
4. then canonical layer order (identity → control), so the same input always gives the
   same answer.

The chosen layer drives the "solution path" shown on the result page
(`priorityPlaybooks`).

## 3. The result page

`/business-audit/result/{id}` shows:

- the layer score bars and the resulting band per layer,
- the priority layer and **why** it was chosen, quoting the customer's own inputs
  (`buildEvidence`) — the evidence block only ever cites the customer's answers,
- a suggested first priority with concrete next steps,
- the matching products/solutions, and WhatsApp/Messenger CTAs.

The page is `force-dynamic` (it reads a live record) and is `noindex`: it is personal
output, not public content.

## 4. Honesty requirements (§02/§03) — non-negotiable

This funnel must **never**:

- claim the result is scientifically validated — the copy states the opposite, in both
  languages, and `tests/audit-scoring.test.ts` fails if that disclaimer disappears;
- promise growth, revenue or ROI;
- invent a benchmark or compare the customer to "other businesses" using made-up numbers;
- imply a human is available outside 10:00–17:00 (Bangladesh time).

The snapshot is described as a *diagnostic aid* / *preliminary maturity snapshot*
everywhere it appears.

## 5. What happens to a submission

1. The payload is validated by Zod (`auditSubmissionSchema`) — all six answers are required.
2. The submission is stored (`repository.createAudit`) with its computed snapshot.
3. A **lead** is created (or merged into the existing one for that email) with
   `source: "business_audit"`, `status: "new"`, the goal, the problem and the audit's score.
4. An automation event is emitted to n8n so the team is notified.
5. The customer lands on the result page.

## 6. Files

| Concern | File |
| --- | --- |
| Questions and answer options | `data/audit-form.ts` |
| Scoring, bands, priority, evidence | `lib/audit/scoring.ts` |
| Option-id → label resolvers | `lib/audit/labels.ts` |
| The form (client component) | `components/audit/AuditForm.tsx` |
| Result view | `components/audit/AuditSnapshotView.tsx` |
| Endpoint | `app/api/audit/route.ts` |
| Tests | `tests/audit-scoring.test.ts` |

## 7. Changing the questions

1. Edit `data/audit-form.ts` and, if needed, `auditSubmissionSchema` in
   `lib/validation/schemas.ts`.
2. If an option id changes, update `lib/audit/labels.ts` so stored old submissions still
   render a readable label.
3. Run `npm run test`. Stored submissions keep their original `answers` JSON, so old
   results remain readable — never mutate historical snapshots.
