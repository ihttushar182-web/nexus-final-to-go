# 14 — Capabilities & Product Lines

**This document is the commercial inventory. `data/capabilities.ts` is the executable
source of truth; if the two disagree, the data file is right and this document is stale.**

The buyer-facing page is `/capabilities`.

---

## 1. Positioning rule (the most important thing in this document)

> **We do not sell technology. We deliver systems and outcomes.**

Nexus Lift's combined strength is *business understanding + system design + AI + automation
+ custom web development + CRM + data + dashboards*. Selling that as a list of technologies
would undersell it and invite price comparison against tool vendors.

So every capability is written in three parts, in this order:

1. **Outcome** — what changes in the business. This is the selling line.
2. **Problem** — the friction that makes the business need it.
3. **System** — what we actually build (the tool names live here, as detail).

The technology stack is published (buyers and stakeholders legitimately ask), but it sits in
its own section under an explicit "these are the means, not the goal" heading.

`capabilityPositioning` in the data file holds this framing so it can be reused on any page
or in any assistant prompt, and `capabilityPositioning.outcomeNote` carries the standard
clarification that a description explains how a system operates — **not a guaranteed result**.

---

## 2. The canonical lines (A–W)

23 lines, grouped into six system families. Codes are stable: they are used in
conversation, proposals and internal shorthand.

### Family 1 — AI Systems
| # | Line | Layer(s) | Outcome |
| --- | --- | --- | --- |
| A | AI Automation | Operations, Intelligence | Daily repetitive work completes on its own |
| B | AI Agents | Operations, Growth | An agent handles the first layer of sales/support |
| C | AI Chatbots | Growth, Operations | Questions are answered immediately, any hour |
| T | RAG / Knowledge Assistant | Intelligence, Operations | Answers come from your own documents, with citations |
| U | AI Document Automation | Operations, Intelligence | Invoices, forms and contracts enter the system themselves |

### Family 2 — Automation & Integration
| # | Line | Layer(s) | Outcome |
| --- | --- | --- | --- |
| D | n8n Automation | Operations, Control | Every step runs as a defined, logged workflow |
| E | Make / Zapier Automation | Operations | The tools you already pay for talk to each other |
| F | API Integration | Operations, Control | Your system connects directly to outside services |
| G | Webhook Integration | Operations, Control | The system learns about events instead of being asked |

### Family 3 — Customer & Revenue Systems
| # | Line | Layer(s) | Outcome |
| --- | --- | --- | --- |
| H | Custom CRM | Structure, Growth | Every customer and lead in one place, with history |
| I | CRM Automation | Growth, Operations | Follow-ups and updates happen; no lead is forgotten |

### Family 4 — Websites & Digital Presence
| # | Line | Layer(s) | Outcome |
| --- | --- | --- | --- |
| L | Next.js Website | Identity, Growth | Fast, mobile-friendly, findable, credible |
| N | AI Website | Identity, Growth | The site answers questions and captures the enquiry |
| O | Lead Generation Website | Growth | Enquiries arrive, qualify themselves, and route correctly |
| P | Personal Website | Identity | One dependable place under your own name |
| Q | Personal Brand Website | Identity, Growth | A clear position that the right people find |
| R | Portfolio Website | Identity | The work speaks for itself |

### Family 5 — Data, Dashboards & Control
| # | Line | Layer(s) | Outcome |
| --- | --- | --- | --- |
| J | Business Dashboard | Intelligence, Control | The real state of the business on one screen |
| K | Internal Business Tools | Operations, Control | Daily team work runs in one defined tool |

### Family 6 — Platforms, Portals & Custom Tools
| # | Line | Layer(s) | Outcome |
| --- | --- | --- | --- |
| M | Custom Web Application | Operations, Structure | Software built around your process |
| S | AI SaaS MVP | Growth, Intelligence | An idea becomes a usable, measurable product |
| V | Client Portal | Structure, Operations | Customers see status themselves; admin drops |
| W | Custom Business Tools | Operations, Control | A tool shaped exactly around how you work |

---

## 3. Nothing was left behind

The owner's declared capability list contained far more phrases than 23 lines. Every phrase
is mapped to the line that carries it in `declaredCapabilities`, and
`tests/capabilities.test.ts` fails the build if any phrase has no home.

Merges applied (so the site does not claim the same thing twice under different names):

| Declared phrases | Merged into |
| --- | --- |
| Business AI Automation · AI Automation | **A** AI Automation |
| AI Agents · AI Business Assistants · AI Sales Agents · AI Customer Support Agents | **B** AI Agents |
| AI Lead Generation Systems · AI Lead Qualification · Lead-generating websites | **O** Lead Generation Website |
| RAG systems · AI knowledge assistants · Knowledge bases · AI document systems | **T** RAG / Knowledge Assistant (documents split to **U**) |
| Webhooks | **G** Webhook Integration |
| API integrations · REST API integrations · CRM integrations | **F** API Integration |
| Lead management systems · Sales pipeline systems · Custom CRM | **H** Custom CRM |
| Business dashboards · Analytics dashboards · Admin dashboards | **J** Business Dashboard |
| Internal business tools | **K** Internal Business Tools |
| Client portals · Employee portals | **V** Client Portal |
| AI-powered websites | **N** AI Website |
| Custom business websites · Next.js | **L** Next.js Website |
| AI-powered custom tools · Custom web applications | **M** Custom Web Application |
| SaaS MVPs · AI SaaS systems | **S** AI SaaS MVP |
| Personalized business tools · Custom business tools | **W** Custom Business Tools |
| Personal websites / Personal brand websites / Portfolio websites | **P / Q / R** |
| Make automation · Zapier automation | **E** Make / Zapier Automation |
| React · Node.js · Supabase · PostgreSQL | Technology stack (delivery tooling, never the offer) |

---

## 4. How a capability relates to a product

These are **different layers of the same business**, and confusing them is the fastest way
to make the site dishonest:

| | `/capabilities` | `/products` | `/solutions` |
| --- | --- | --- | --- |
| Answers | "What can you build?" | "What can I buy today?" | "What outcome do I need?" |
| Carries a price | **No, never** | Yes, or an explicit *TBC* | No |
| Commercial state | `engagement: product \| scoped` | Priced package | Outcome area |

- `engagement: "product"` — a catalogue product carries the scope and the price. The card
  links to it.
- `engagement: "scoped"` — genuinely custom work (**S** AI SaaS MVP, **W** Custom Business
  Tools). The card says *"Scope and cost confirmed in conversation"* and links nowhere near
  a price. **No price may be invented for these.**

A test enforces this: a productised line must point at a real product, and a scoped line
must point at none.

---

## 5. Honesty rules applied to this inventory

1. **No prices.** Enforced by a test that fails on a taka symbol, "BDT" or "Tk 1,000"
   anywhere in the capability copy.
2. **No guaranteed outcomes.** Enforced by a test that rejects guarantee language; the
   standard clarification is published on the page.
3. **No invented facts.** Every line is a transcription of the declared capability list —
   nothing was added to make the page look fuller.
4. **Technology is subordinate.** Enforced by a test asserting the positioning statement and
   that every technology entry states what it enables rather than what it is.
5. **Every line maps to the framework.** Each capability declares which of the six layers it
   moves, and a test proves all six layers are reachable. This keeps the page from becoming
   a disconnected menu — the sequence still starts with the diagnosis.

---

## 6. Adding or changing a line

1. Edit `data/capabilities.ts`. Keep the structure: `outcome` → `problem` → `system` →
   `includes`, plus `layers`, `related` and `engagement`.
2. If the line is new, give it the next free letter code and add every phrase it carries to
   `declaredCapabilities`.
3. If it is a priceable product, add the product to `data/products.ts` (with a real or *TBC*
   price) and set `engagement: "product"`.
4. Run `npm run test` — the capability spec will fail if a phrase is unmapped, a layer or
   solution reference is broken, a price leaked in, or a guarantee slipped into the copy.
5. Update the tables in this document.

## 7. Open commercial questions

Which lines should become priced packages, and the scope boundaries for the two custom
lines, are business decisions recorded in `docs/13_OPEN_QUESTIONS.md` (§F).
