import type { AuditAnswer, AuditSnapshot, LayerId, LocalizedText } from "@/types";
import { businessLayers, layerIds } from "@/data/layers";

/**
 * Audit scoring engine (Build Spec §22).
 *
 * Yes = 10, Partial = 5, No = 0 — each of the six layers is scored independently.
 * The result is explicitly presented as a diagnostic aid, never as a scientific score.
 */

export const ANSWER_SCORES: Record<AuditAnswer, number> = {
  yes: 10,
  partial: 5,
  no: 0,
};

export const MAX_LAYER_SCORE = 10;

export interface MaturityBand {
  id: string;
  label: LocalizedText;
  min: number;
}

/** Band labels are taken verbatim from Build Spec §22. */
export const maturityBands: MaturityBand[] = [
  { id: "strong", min: 9, label: { bn: "Strong Foundation", en: "Strong Foundation" } },
  { id: "partial", min: 7, label: { bn: "Partially Defined", en: "Partially Defined" } },
  { id: "needs-development", min: 5, label: { bn: "Needs Development", en: "Needs Development" } },
  { id: "manual", min: 3, label: { bn: "Mostly Manual", en: "Mostly Manual" } },
  { id: "limited", min: 1, label: { bn: "Limited Integration", en: "Limited Integration" } },
  { id: "no-visibility", min: 0, label: { bn: "Low Visibility", en: "Low Visibility" } },
];

export function getMaturityBand(score: number): MaturityBand {
  return maturityBands.find((band) => score >= band.min) ?? maturityBands[maturityBands.length - 1];
}

export function scoreAnswer(answer: AuditAnswer): number {
  return ANSWER_SCORES[answer] ?? 0;
}

export interface PrioritySignals {
  /** Layer implied by the "biggest problem" answer. */
  problemLayer?: LayerId;
  /** Layer implied by the six-month goal answer. */
  goalLayer?: LayerId;
}

/**
 * Priority determination (Build Spec §22): based on the lowest layer, the stated
 * biggest problem and the stated goal. Deterministic and explainable:
 *
 *  1. Weakest layer score wins.
 *  2. On a tie, the layer implied by the biggest problem wins.
 *  3. Then the layer implied by the six-month goal.
 *  4. Then the canonical layer order (identity → control).
 */
export function determinePriority(
  layerScores: { layer: LayerId; score: number }[],
  signals: PrioritySignals = {},
): { priorityLayer: LayerId; weakestLayer: LayerId; reason: LocalizedText } {
  const sorted = [...layerScores].sort((a, b) => a.score - b.score);
  const lowest = sorted[0]?.score ?? 0;
  const tied = sorted.filter((item) => item.score === lowest);

  const weakestLayer = orderByCanonical(tied.map((item) => item.layer))[0] ?? "identity";

  let priorityLayer = weakestLayer;
  let reasonSource: "score" | "problem" | "goal" | "order" = "score";

  const problemInTie = signals.problemLayer && tied.some((item) => item.layer === signals.problemLayer);
  const goalInTie = signals.goalLayer && tied.some((item) => item.layer === signals.goalLayer);

  if (tied.length > 1) {
    if (problemInTie && signals.problemLayer) {
      priorityLayer = signals.problemLayer;
      reasonSource = "problem";
    } else if (goalInTie && signals.goalLayer) {
      priorityLayer = signals.goalLayer;
      reasonSource = "goal";
    } else {
      reasonSource = "order";
    }
  }

  const layer = businessLayers.find((item) => item.id === priorityLayer)!;
  const layerName = layer.name;

  const reasonBySource: Record<typeof reasonSource, LocalizedText> = {
    score: {
      bn: `আপনার উত্তর অনুযায়ী ${layerName.bn} Layer-এর স্কোর সবচেয়ে কম — এটিই এখন প্রধান বাধা।`,
      en: `Based on your answers the ${layerName.en} layer scored lowest — that is the current bottleneck.`,
    },
    problem: {
      bn: `আপনি যে সমস্যাটি প্রধান বলেছেন সেটি ${layerName.bn} Layer-এর সাথে যুক্ত, এবং এই Layer-এর স্কোরও সবচেয়ে কম।`,
      en: `The problem you named as biggest maps to the ${layerName.en} layer, which also scored lowest.`,
    },
    goal: {
      bn: `আপনার ৬ মাসের লক্ষ্যের সাথে ${layerName.bn} Layer সবচেয়ে বেশি সম্পর্কিত, এবং এই Layer-এর স্কোরও সবচেয়ে কম।`,
      en: `Your six-month goal relates most closely to the ${layerName.en} layer, which also scored lowest.`,
    },
    order: {
      bn: `একাধিক Layer সমান কম স্কোর পেয়েছে, তাই ${layerName.bn} Layer-কে প্রথম Priorities ধরা হয়েছে।`,
      en: `Several layers scored equally low, so the ${layerName.en} layer is taken as the first priority.`,
    },
  };

  return { priorityLayer, weakestLayer, reason: reasonBySource[reasonSource] };
}

function orderByCanonical(layers: LayerId[]): LayerId[] {
  return [...layers].sort((a, b) => layerIds.indexOf(a) - layerIds.indexOf(b));
}

export function buildSnapshot(
  answers: Record<LayerId, AuditAnswer>,
  signals: PrioritySignals = {},
): AuditSnapshot {
  const layerScores = layerIds.map((layer) => ({
    layer,
    answer: answers[layer] ?? "no",
    score: scoreAnswer(answers[layer] ?? "no"),
  }));

  const total = layerScores.reduce((sum, item) => sum + item.score, 0);
  const maxTotal = layerIds.length * MAX_LAYER_SCORE;
  const { priorityLayer, weakestLayer, reason } = determinePriority(layerScores, signals);
  const sorted = [...layerScores].sort((a, b) => b.score - a.score);
  const strongest = orderByCanonical(sorted.filter((item) => item.score === sorted[0]?.score).map((i) => i.layer))[0] ?? "identity";

  return {
    total,
    maxTotal,
    percent: Math.round((total / maxTotal) * 100),
    layerScores,
    weakestLayer,
    priorityLayer,
    priorityReason: reason,
    strongestLayer: strongest,
  };
}

/**
 * Note on evidence: the result page must never claim causation. These strings are used
 * to build the "Evidence" block from the user's own inputs only.
 */
export function buildEvidence(
  snapshot: AuditSnapshot,
  inputs: { biggestProblemLabel?: string; goalLabel?: string; tools?: string },
): LocalizedText[] {
  const layer = businessLayers.find((item) => item.id === snapshot.priorityLayer)!;
  const score = snapshot.layerScores.find((item) => item.layer === snapshot.priorityLayer)?.score ?? 0;

  const evidence: LocalizedText[] = [
    {
      bn: `আপনার ${layer.name.bn} Layer স্কোর ${score}/10 — এটিই আপনার ছয়টি Layer-এর মধ্যে সবচেয়ে কম।`,
      en: `Your ${layer.name.en} layer scored ${score}/10 — the lowest of your six layers.`,
    },
  ];

  if (inputs.biggestProblemLabel) {
    evidence.push({
      bn: `আপনি প্রধান সমস্যা হিসেবে উল্লেখ করেছেন: "${inputs.biggestProblemLabel}"।`,
      en: `You identified the biggest problem as: "${inputs.biggestProblemLabel}".`,
    });
  }
  if (inputs.goalLabel) {
    evidence.push({
      bn: `আপনার ৬ মাসের লক্ষ্য: "${inputs.goalLabel}"।`,
      en: `Your six-month goal: "${inputs.goalLabel}".`,
    });
  }
  if (inputs.tools) {
    evidence.push({
      bn: `বর্তমানে যে Tools ব্যবহার করছেন: ${inputs.tools}।`,
      en: `Tools currently in use: ${inputs.tools}.`,
    });
  }

  evidence.push({
    bn: "মনে রাখবেন: এটি একটি Diagnostic Snapshot, কোনো বৈজ্ঞানিকভাবে যাচাইকৃত স্কোর নয়।",
    en: "Note: this is a diagnostic snapshot, not a scientifically validated score.",
  });

  return evidence;
}

/** Solution path per priority layer — matches the dynamic variations in the Master System. */
export const priorityPlaybooks: Record<
  LayerId,
  {
    headline: LocalizedText;
    body: LocalizedText;
    steps: LocalizedText[];
    solutionSlug: string;
    productSlug: string;
    ctaLabel: LocalizedText;
  }
> = {
  identity: {
    headline: { bn: "Recommended Next Priority: IDENTITY", en: "Recommended next priority: IDENTITY" },
    body: {
      bn: "আপনার Business-এর সবচেয়ে বড় বাধা হতে পারে Identity অস্পষ্ট থাকা। যখন কাস্টমার প্রথম দেখাতেই বুঝতে পারে না আপনি কে এবং কতটা নির্ভরযোগ্য, তখন দাম নিয়ে দরকষাকষি শুরু হয়।",
      en: "Your biggest constraint may be an unclear identity. When a customer cannot tell who you are and how reliable you are at first contact, the conversation turns into a price negotiation.",
    },
    steps: [
      { bn: "Positioning ও Messaging এক জায়গায় লিখুন।", en: "Write your positioning and messaging in one place." },
      { bn: "Business Profile তৈরি করুন যা পাঠানো যায়।", en: "Create a business profile you can send to anyone." },
      { bn: "Visual Consistency নিশ্চিত করুন — একই রঙ, একই ফন্ট, একই সুর।", en: "Make the visuals consistent — same colours, same fonts, same voice." },
    ],
    solutionSlug: "brand-identity",
    productSlug: "brand-identity-system",
    ctaLabel: { bn: "Brand Services দেখুন", en: "Explore brand services" },
  },
  structure: {
    headline: { bn: "Recommended Next Priority: STRUCTURE", en: "Recommended next priority: STRUCTURE" },
    body: {
      bn: "আপনার Business-এর সবচেয়ে বড় বাধা হতে পারে Structure অস্পষ্ট থাকা। যখন 'সবাই সব কাজ করে', তখন দায়িত্ব হারিয়ে যায় এবং প্রতিটি সিদ্ধান্ত Founder-এর কাছেই আসে।",
      en: "Your biggest constraint may be an unclear structure. When everyone does everything, accountability disappears and every decision lands with the founder.",
    },
    steps: [
      { bn: "Organogram তৈরি করুন — কে কার কাছে রিপোর্ট করবে।", en: "Create an organogram — who reports to whom." },
      { bn: "Role & Responsibility Matrix লিখুন।", en: "Write a role & responsibility matrix." },
      { bn: "Authority Matrix দিয়ে সিদ্ধান্তের সীমানা ঠিক করুন।", en: "Define decision limits with an authority matrix." },
    ],
    solutionSlug: "business-structure",
    productSlug: "business-structure-setup",
    ctaLabel: { bn: "Business Structure দেখুন", en: "Explore business structure" },
  },
  operations: {
    headline: { bn: "Recommended Next Priority: OPERATIONS", en: "Recommended next priority: OPERATIONS" },
    body: {
      bn: "আপনার Business-এর সবচেয়ে বড় বাধা হতে পারে Manual Process। Team যখন SOP ছাড়া কাজ করে, তখন Growth হলেও Quality কমে যায়। Scaling করার আগে Process stabilize করা জরুরি।",
      en: "Your biggest constraint may be manual process. When a team works without SOPs, quality falls even as growth rises. Processes must stabilise before scaling.",
    },
    steps: [
      { bn: "Key Processes ডকুমেন্ট করুন (Sales, Delivery, Support)।", en: "Document the key processes (sales, delivery, support)." },
      { bn: "SOP ও Checklist তৈরি করুন।", en: "Create SOPs and checklists." },
      { bn: "Team-কে Training দিন।", en: "Train the team." },
    ],
    solutionSlug: "sop-operations",
    productSlug: "sop-process-system",
    ctaLabel: { bn: "SOP Services দেখুন", en: "Explore SOP services" },
  },
  growth: {
    headline: { bn: "Recommended Next Priority: GROWTH", en: "Recommended next priority: GROWTH" },
    body: {
      bn: "আপনার Business-এর সবচেয়ে বড় বাধা হতে পারে Lead না আসা। Website থাকলেও Conversion Path না থাকলে ভিজিটর কেবল দেখে চলে যায়।",
      en: "Your biggest constraint may be lead flow. A website without a conversion path lets visitors look and leave.",
    },
    steps: [
      { bn: "Offer ও Message এক বাক্যে স্পষ্ট করুন।", en: "Make the offer and message clear in one sentence." },
      { bn: "একটি Primary CTA ও Conversion Path তৈরি করুন।", en: "Create one primary CTA and conversion path." },
      { bn: "SEO ও Content Architecture সেটআপ করুন।", en: "Set up SEO and content architecture." },
    ],
    solutionSlug: "website-conversion",
    productSlug: "website-conversion-system",
    ctaLabel: { bn: "Growth Services দেখুন", en: "Explore growth services" },
  },
  intelligence: {
    headline: { bn: "Recommended Next Priority: INTELLIGENCE", en: "Recommended next priority: INTELLIGENCE" },
    body: {
      bn: "আপনার Business-এর সবচেয়ে বড় বাধা হতে পারে Data Scattered। Customer Data Excel, WhatsApp এবং Memory-তে ছড়িয়ে থাকলে Follow-up মিস হয় এবং Sales কমে যায়।",
      en: "Your biggest constraint may be scattered data. When customer data lives across Excel, WhatsApp and memory, follow-ups are missed and sales decline.",
    },
    steps: [
      { bn: "Centralized CRM Setup করুন।", en: "Set up a centralised CRM." },
      { bn: "Lead Management System বানান।", en: "Build a lead management system." },
      { bn: "Automation ও AI Integration করুন।", en: "Add automation and AI integration." },
    ],
    solutionSlug: "crm-customer-systems",
    productSlug: "crm-customer-system",
    ctaLabel: { bn: "CRM Services দেখুন", en: "Explore CRM services" },
  },
  control: {
    headline: { bn: "Recommended Next Priority: CONTROL", en: "Recommended next priority: CONTROL" },
    body: {
      bn: "আপনার Business-এর সবচেয়ে বড় বাধা হতে পারে No Visibility। Business কেমন চলছে তা পরিষ্কার না হলে Decision ভুল হয় — কারণ অনুমান দিয়ে সিদ্ধান্ত নিতে হয়।",
      en: "Your biggest constraint may be a lack of visibility. When it is unclear how the business is performing, decisions go wrong because they are made on assumption.",
    },
    steps: [
      { bn: "CEO Dashboard তৈরি করুন।", en: "Build a CEO dashboard." },
      { bn: "KPI Tracking System চালু করুন।", en: "Start a KPI tracking system." },
      { bn: "Weekly Review Meeting System বানান।", en: "Introduce a weekly review meeting system." },
    ],
    solutionSlug: "business-os-dashboards",
    productSlug: "business-os-dashboard",
    ctaLabel: { bn: "Dashboard Services দেখুন", en: "Explore dashboard services" },
  },
};
