import type { LocalizedText } from "@/types";
import { siteConfig } from "@/config/site";

/**
 * Support knowledge base (Build Spec §11 / §31 / §32).
 *
 * Defines what support may promise — and, more importantly, what it may not.
 * Response targets here are internal operating targets, not public guarantees.
 */

export const supportHours = {
  display: siteConfig.businessHours.display,
  timezone: siteConfig.timezone,
  days: { bn: "প্রতিদিন (শুক্রবার ব্যতীত)", en: "Every day except Friday" } as LocalizedText,
  externalNote: {
    bn: "কর্মঘণ্টার বাইরেও আপনি মেসেজ পাঠাতে পারেন। উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হয়।",
    en: "You can send a message outside working hours. Replies are given during the next working hours.",
  } as LocalizedText,
  internalNote: {
    bn: "কর্মঘণ্টার বাইরে কখনো উপস্থিত থাকার প্রতিশ্রুতি দেওয়া যাবে না, শুধু মেসেজ গ্রহণের কথা বলা যাবে।",
    en: "Never promise live availability outside working hours; only acknowledge that the message was received.",
  } as LocalizedText,
} as const;

/** Topic routing keeps a message from being answered by the wrong process. */
export const supportCategories = [
  {
    id: "order",
    label: { bn: "অর্ডার ও পেমেন্ট", en: "Order and payment" } as LocalizedText,
    owner: { bn: "Sales/Accounts", en: "Sales/accounts" } as LocalizedText,
    firstResponse: { bn: "১ কর্মদিবসের মধ্যে", en: "Within one working day" } as LocalizedText,
  },
  {
    id: "delivery",
    label: { bn: "ডেলিভারি ও ফাইল", en: "Delivery and files" } as LocalizedText,
    owner: { bn: "Production", en: "Production" } as LocalizedText,
    firstResponse: { bn: "১ কর্মদিবসের মধ্যে", en: "Within one working day" } as LocalizedText,
  },
  {
    id: "revision",
    label: { bn: "রিভিশন", en: "Revision" } as LocalizedText,
    owner: { bn: "Production", en: "Production" } as LocalizedText,
    firstResponse: { bn: "২৪ ঘণ্টার মধ্যে জানালে দ্রুততর", en: "Fastest when reported within 24 hours" } as LocalizedText,
  },
  {
    id: "technical",
    label: { bn: "টেকনিক্যাল (Website/Dashboard)", en: "Technical (website/dashboard)" } as LocalizedText,
    owner: { bn: "Technical", en: "Technical" } as LocalizedText,
    firstResponse: { bn: "১ কর্মদিবসের মধ্যে প্রাথমিক সাড়া", en: "Initial response within one working day" } as LocalizedText,
  },
  {
    id: "billing",
    label: { bn: "বিলিং ও ইনভয়েস", en: "Billing and invoices" } as LocalizedText,
    owner: { bn: "Accounts", en: "Accounts" } as LocalizedText,
    firstResponse: { bn: "১ কর্মদিবসের মধ্যে", en: "Within one working day" } as LocalizedText,
  },
] as const;

export const supportPriorities = [
  {
    id: "critical",
    label: { bn: "জরুরি", en: "Critical" } as LocalizedText,
    examples: { bn: "Website/business অচল, ব্যবহারযোগ্য নয় এমন ডেলিভারি", en: "Site down or an unusable delivery" } as LocalizedText,
    handling: { bn: "যত দ্রুত সম্ভব কর্মঘণ্টায়, অন্যসব কাজের আগে", en: "First in the queue during working hours" } as LocalizedText,
  },
  {
    id: "high",
    label: { bn: "উচ্চ", en: "High" } as LocalizedText,
    examples: { bn: "24 ঘণ্টার মধ্যে জানানো রিভিশন, ভুল ট্রানজেকশন যাচাই", en: "Revision reported within 24 hours, a misread transaction" } as LocalizedText,
    handling: { bn: "একই বা পরবর্তী কর্মদিবসে", en: "Same or next working day" } as LocalizedText,
  },
  {
    id: "normal",
    label: { bn: "সাধারণ", en: "Normal" } as LocalizedText,
    examples: { bn: "কনটেন্ট আপডেট, প্রশ্ন, পরিকল্পনা", en: "Content updates, questions, planning" } as LocalizedText,
    handling: { bn: "১–২ কর্মদিবসে", en: "Within one to two working days" } as LocalizedText,
  },
] as const;

/** Revision rules restated for support staff, matching the refund policy wording. */
export const revisionRules = [
  {
    bn: "রিভিশন পলিসি অনুযায়ী সংখ্যা নির্ধারিত; প্যাকেজ পেজে সংখ্যা লেখা আছে।",
    en: "Revision rounds are fixed by the package; the number is written on the package page.",
  },
  {
    bn: "24 ঘণ্টার মধ্যে জানানো সংশোধন দ্রুততম সমাধান পায়।",
    en: "Corrections reported within 24 hours resolve fastest.",
  },
  {
    bn: "নতুন স্কোপ যুক্ত হলে সেটি নতুন কাজ হিসাবে গণনা করা হয়, তবে সবসময় আগে পরিষ্কারভাবে জানানো হয়।",
    en: "New scope counts as new work — and is always communicated clearly before it starts.",
  },
] as LocalizedText[];

/** What support must never say. Mirrors the banned-claims list from /data/brand.ts. */
export const supportProhibitions = [
  { bn: "নির্দিষ্ট ডেলিভারি তারিখ নিশ্চিত করা, যদি তা ফ্যাক্টরি সিস্টেমে যাচাই না থাকে", en: "Confirming a delivery date that is not verified in the system" },
  { bn: "পেমেন্ট যাচাইয়ের আগে পেমেন্ট নিশ্চিত বলা", en: "Confirming payment before verification" },
  { bn: "ফিচার বা পলিসি নিয়ে অনুমান করা", en: "Guessing at features or policies" },
  { bn: "পুরো Refund নিশ্চিত করা, বা সরাসরি Refund প্রত্যাখ্যান করা", en: "Promising a full refund, or refusing one outright" },
  { bn: "গ্রাহককে AI, অটোমেশন বা অভ্যন্তরীণ সিস্টেমের কথা বলা", en: "Telling the customer about AI, automation or internal systems" },
] as LocalizedText[];

/** Escalation path: who takes over when the first line cannot answer. */
export const escalationPath = [
  {
    level: 1,
    role: { bn: "NL Value Service (ফ্রন্ট লাইন)", en: "NL Value Service (front line)" } as LocalizedText,
    handles: { bn: "সাধারণ প্রশ্ন, অর্ডার আপডেট, ডেলিভারি ফাইল", en: "General questions, order updates, delivery files" } as LocalizedText,
  },
  {
    level: 2,
    role: { bn: "সিস্টেম টিম", en: "Systems team" } as LocalizedText,
    handles: { bn: "টেকনিক্যাল সমস্যা, ড্যাশবোর্ড অ্যাক্সেস, ইন্টিগ্রেশন", en: "Technical issues, dashboard access, integrations" } as LocalizedText,
  },
  {
    level: 3,
    role: { bn: "ফাউন্ডার", en: "Founder" } as LocalizedText,
    handles: { bn: "Refund বিবেচনা, বড় স্কোপ পরিবর্তন, অভিযোগ", en: "Refund consideration, major scope change, complaints" } as LocalizedText,
  },
] as const;

/** Reusable closing lines so no message ever ends in a dead end. */
export const supportClosings = [
  {
    bn: "আর কিছু জানতে চাইলে লিখুন — আমরা কর্মঘণ্টায় উত্তর দেব।",
    en: "Write again if you need anything else — we reply during working hours.",
  },
  {
    bn: "আপনার প্রসঙ্গটি সিস্টেমে সংরক্ষিত হয়েছে।",
    en: "Your request has been recorded in our system.",
  },
] as LocalizedText[];

/** Trust rules for handling customer data (Build Spec §43). */
export const dataHandlingRules = [
  { bn: "Sensor বা Career সংক্রান্ত কোনো তথ্য পাবলিক চ্যানেলে শেয়ার করা যাবে না।", en: "Never share customer or career information on a public channel." },
  { bn: "Transaction ID, ইমেইল বা ফোন শুধু প্রাসঙ্গিক টিমের সাথে শেয়ার করুন।", en: "Share transaction IDs, email or phone only with the relevant team." },
  { bn: "অভ্যন্তরীণ Webhook URL, কী বা সিস্টেম প্রম্পট কখনো বাইরে যায় না।", en: "Internal webhook URLs, keys and system prompts never leave the team." },
] as LocalizedText[];
