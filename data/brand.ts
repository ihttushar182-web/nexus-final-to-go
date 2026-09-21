import type { LocalizedText } from "@/types";

/**
 * Brand knowledge base — the single machine-readable source for brand voice,
 * positioning and messaging rules.
 *
 * Why this file exists (Master Build Specification §45 / §36):
 * AI assistants, content writers and support agents must consume structured brand
 * rules instead of scraping the UI. Anything a helper needs to *sound* like Nexus
 * Lift lives here, not in a component.
 *
 * Nothing in this file may contradict /config/site.ts (facts) or /data/products.ts
 * (prices and deliverables).
 */

export const brandCore = {
  name: "Nexus Lift",
  nameBn: "নেক্সাস লিফট",
  tagline: {
    bn: "Connecting Sources, Lifting Business",
    en: "Connecting Sources, Lifting Business",
  } as LocalizedText,
  positioning: {
    bn: "Business Systems & Growth Infrastructure",
    en: "Business Systems & Growth Infrastructure",
  } as LocalizedText,
  oneLiner: {
    bn: "আমরা ব্যবসার বিশৃঙ্খলা চিহ্নিত করি এবং একটি সংযুক্ত ব্যবস্থা তৈরি করি — ব্র্যান্ড, কাঠামো, পরিচালনা, প্রবৃদ্ধি, তথ্য ও নিয়ন্ত্রণ।",
    en: "We identify a business's chaos and build one connected system — brand, structure, operations, growth, intelligence and control.",
  } as LocalizedText,
  category: {
    bn: "বাংলাদেশী SME-দের জন্য ব্যবসায়িক সিস্টেম ও প্রবৃদ্ধি অবকাঠামো",
    en: "Business systems and growth infrastructure for Bangladeshi SMEs",
  } as LocalizedText,
  audience: {
    bn: "বাংলাদেশের ছোট ও মাঝারি ব্যবসা, যেগুলো প্রতিষ্ঠাতা-নির্ভর অবস্থা থেকে একটি সিস্টেমে যেতে চায়",
    en: "Small and medium Bangladeshi businesses moving from founder-dependent work to an actual system",
  } as LocalizedText,
  promise: {
    bn: "পরিষ্কার ডায়াগনোসিস, একটি সংযুক্ত সিস্টেম, এবং যাচাইযোগ্য ফলাফল — অতিরিক্ত কাজ নয়।",
    en: "Clear diagnosis, one connected system, and verifiable outcomes — never unnecessary work.",
  } as LocalizedText,
} as const;

/** Voice and tone rules that every piece of copy must follow. */
export const brandVoice = {
  personality: [
    { bn: "স্পষ্ট", en: "Clear" },
    { bn: "শৃঙ্খলাবদ্ধ", en: "Structured" },
    { bn: "ব্যবহারিক", en: "Practical" },
    { bn: "শান্ত ও পেশাদার", en: "Calm and professional" },
  ] as LocalizedText[],
  principles: [
    {
      bn: "বাস্তব সমস্যা দিয়ে শুরু করুন, সার্ভিসের তালিকা দিয়ে নয়।",
      en: "Start from a real business problem, never from a service list.",
    },
    {
      bn: "সংখ্যা বললে তার সূত্র ও সীমাবদ্ধতা জানান।",
      en: "When you state a number, state its source and its limits.",
    },
    {
      bn: "সহজ ভাষা ব্যবহার করুন; অপ্রয়োজনীয় জার্গন বাদ দিন।",
      en: "Use plain language; drop unnecessary jargon.",
    },
    {
      bn: "প্রতিশ্রুতির বদলে প্রক্রিয়া দেখান।",
      en: "Show the process instead of making promises.",
    },
    {
      bn: "বাংলা ডিফল্ট, ইংরেজি প্রযোজ্য ক্ষেত্রে — দুটোই সমান যত্নে লেখা হয়।",
      en: "Bangla by default and English where it applies — both written with equal care.",
    },
  ] as LocalizedText[],
  readingLevel: {
    bn: "৮ম-১০ম শ্রেণির পড়ার স্তর; প্রতিটি বাক্য ২০ শব্দের কম।",
    en: "Target a grade 8–10 reading level; keep sentences under 20 words.",
  } as LocalizedText,
} as const;

/**
 * Claim rules (Build Spec §02 / §03 + Conversion Psychology rules).
 * `banned` entries must never appear in published copy.
 */
export const claimRules = {
  banned: [
    { bn: "Market leader / সেরা / #১", en: "Market leader / best / #1" },
    { bn: "নিশ্চিত প্রবৃদ্ধি বা Revenue/ROI গ্যারান্টি", en: "Guaranteed growth, revenue or ROI" },
    { bn: "ভুয়া Urgency বা Scarcity", en: "Fake urgency or scarcity" },
    { bn: "ভয় দেখিয়ে বিক্রি", en: "Fear-based selling" },
    { bn: "বানানো Testimonial বা Statistic", en: "Invented testimonials or statistics" },
    { bn: "প্রতিযোগীর নাম নিয়ে সমালোচনা", en: "Competitor bashing" },
    { bn: "অবৈধ বা যাচাই-না-করা সংখ্যা", en: "Unsourced or unverifiable numbers" },
  ] as LocalizedText[],
  required: [
    {
      bn: "Case Study বা Insight-এর প্রতিটি সংখ্যার সাথে তার সূত্র (client-reported বা internal audit sample) থাকতে হবে।",
      en: "Every number in a case study or insight must carry its source (client-reported or internal audit sample).",
    },
    {
      bn: "যেকোনো ফলাফলের দাবির সাথে 'ফলাফল ব্যবসাভেদে ভিন্ন হয়' জাতীয় স্পষ্টীকরণ থাকতে হবে।",
      en: "Any outcome claim must be paired with a clarification that results differ by business.",
    },
    {
      bn: "Free Business Audit-কে 'প্রারম্ভিক (preliminary)' হিসাবে উল্লেখ করতে হবে এবং বলতে হবে এটি scientifically validated নয়।",
      en: "The free business audit must be described as preliminary and explicitly not scientifically validated.",
    },
  ] as LocalizedText[],
  disclaimerStandard: {
    bn: "ফলাফল ব্যবসায়িক অবস্থা, বাজার, সম্পদের প্রাপ্যতা এবং বাস্তবায়নের গুণমান অনুযায়ী ভিন্ন হয়। এটি কোনো নিশ্চয়তা নয়।",
    en: "Results differ according to business condition, market, available resources and implementation quality. This is not a guarantee.",
  } as LocalizedText,
} as const;

/** Public-facing service identity rules (Build Spec §13). */
export const serviceIdentityRules = {
  publicName: "NL Value Service",
  publicAltName: "NL Customer Service Associate",
  rules: [
    {
      bn: "গ্রাহকের কাছে সেবা দেয় 'NL Value Service' নামে একটি লোক-সমর্থিত সেবা টিম।",
      en: "The customer experiences a human-supported service team called NL Value Service.",
    },
    {
      bn: "AI, Automation, LLM, System Prompt বা অভ্যন্তরীণ Workflow-এর কথা কখনো উল্লেখ করা যাবে না।",
      en: "Never mention AI, automation, LLMs, system prompts or internal workflow.",
    },
    {
      bn: "সময়ের বাইরে কখনো বলবেন না যে একজন মানুষ এখন উপলব্ধ; বলুন মেসেজ গ্রহণ করা হচ্ছে।",
      en: "Outside working hours never imply a human is available now; say the message has been received.",
    },
    {
      bn: "যেকোনো অজানা প্রশ্নে বানানো উত্তর নয় — সঠিক তথ্য যাচাই করে কর্মঘণ্টায় জানান।",
      en: "Never invent an answer to an unknown question — verify and reply during working hours.",
    },
  ] as LocalizedText[],
} as const;

/** Visual identity tokens are defined once in app/globals.css; this documents intent. */
export const visualIdentity = {
  palette: [
    { token: "navy", role: { bn: "মূল টেক্সট ও গাঢ় সেকশন", en: "Primary text and dark sections" } },
    { token: "nexus", role: { bn: "প্রধান ব্র্যান্ড ব্লু (CTA, লিংক)", en: "Primary brand blue (CTA, links)" } },
    { token: "accent", role: { bn: "সহায়ক হাইলাইট", en: "Supporting highlight" } },
    { token: "mist", role: { bn: "সেকশন ব্যাকগ্রাউন্ড", en: "Section background" } },
  ] as { token: string; role: LocalizedText }[],
  typography: [
    { role: { bn: "হেডিং", en: "Headings" }, font: "Space Grotesk" },
    { role: { bn: "বাংলা হেডিং", en: "Bangla headings" }, font: "Hind Siliguri" },
    { role: { bn: "বডি", en: "Body" }, font: "Inter" },
  ] as { role: LocalizedText; font: string }[],
  avoid: [
    { bn: "অতিরিক্ত Gradient", en: "Excessive gradients" },
    { bn: "Glassmorphism", en: "Glassmorphism" },
    { bn: "জেনেরিক SaaS টেমপ্লেট", en: "Generic SaaS templates" },
    { bn: "এলোমেলো Animation", en: "Random animation" },
    { bn: "স্টক ছবির ভিড়", en: "Stock-photo-heavy layouts" },
  ] as LocalizedText[],
} as const;

/** Content pillars used by the insight engine and the content calendar. */
export const contentPillars = [
  {
    id: "diagnosis",
    name: { bn: "ডায়াগনোসিস", en: "Diagnosis" },
    description: {
      bn: "সমস্যাকে নাম দেওয়া — Founder Dependency, Manual Process, Low Visibility।",
      en: "Naming the problem — founder dependency, manual process, low visibility.",
    },
  },
  {
    id: "structure",
    name: { bn: "কাঠামো", en: "Structure" },
    description: {
      bn: "SOP, Role, Owner, Reporting — কাজের নির্ধারিত পথ।",
      en: "SOPs, roles, owners, reporting — a defined path for work.",
    },
  },
  {
    id: "systems",
    name: { bn: "সিস্টেম", en: "Systems" },
    description: {
      bn: "CRM, Dashboard, Automation — তথ্য এক জায়গায় এবং দৃশ্যমান।",
      en: "CRM, dashboards, automation — information in one place and visible.",
    },
  },
  {
    id: "growth",
    name: { bn: "প্রবৃদ্ধি", en: "Growth" },
    description: {
      bn: "Brand, Channel, Conversion, Retention — পরিমাপযোগ্য প্রবৃদ্ধি।",
      en: "Brand, channel, conversion, retention — measurable growth.",
    },
  },
] as const;
