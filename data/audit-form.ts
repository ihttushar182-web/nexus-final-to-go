import type { LayerId, LocalizedText } from "@/types";

/** Business stages used in the audit form. */
export const businessStages: { id: string; label: LocalizedText }[] = [
  { id: "idea", label: { bn: "আইডিয়া / শুরু করার প্রস্তুতি", en: "Idea / preparing to start" } },
  { id: "new", label: { bn: "নতুন (০–১ বছর)", en: "New (0–1 year)" } },
  { id: "growing", label: { bn: "বাড়ছে (১–৫ বছর)", en: "Growing (1–5 years)" } },
  { id: "established", label: { bn: "প্রতিষ্ঠিত (৫+ বছর)", en: "Established (5+ years)" } },
  { id: "scaling", label: { bn: "Scale করার পর্যায়ে", en: "At a scaling stage" } },
];

export const teamSizes: { id: string; label: LocalizedText }[] = [
  { id: "solo", label: { bn: "একা (Founder only)", en: "Solo (founder only)" } },
  { id: "2-5", label: { bn: "২–৫ জন", en: "2–5 people" } },
  { id: "6-15", label: { bn: "৬–১৫ জন", en: "6–15 people" } },
  { id: "16-50", label: { bn: "১৬–৫০ জন", en: "16–50 people" } },
  { id: "50+", label: { bn: "৫০+ জন", en: "50+ people" } },
];

/** Biggest-problem options — each maps to a layer so scoring stays deterministic. */
export const biggestProblemOptions: { id: string; label: LocalizedText; layer: LayerId }[] = [
  {
    id: "founder-dependent",
    label: { bn: "সব কাজ Founder-এর ওপর নির্ভর করে", en: "Everything depends on the founder" },
    layer: "structure",
  },
  {
    id: "manual-process",
    label: { bn: "প্রক্রিয়া Manual, লিখিত নেই", en: "Processes are manual with nothing written down" },
    layer: "operations",
  },
  {
    id: "no-visibility",
    label: { bn: "Business কেমন চলছে বোঝা যায় না", en: "It is unclear how the business is performing" },
    layer: "control",
  },
  {
    id: "lead-crisis",
    label: { bn: "Website/মার্কেটিং থেকে Lead আসে না", en: "The website and marketing bring no leads" },
    layer: "growth",
  },
  {
    id: "data-chaos",
    label: { bn: "Customer Data ছড়িয়ে আছে, Follow-up মিস হয়", en: "Customer data is scattered and follow-ups are missed" },
    layer: "intelligence",
  },
  {
    id: "weak-identity",
    label: { bn: "উপস্থাপনা ও Brand পেশাদার নয়", en: "Our presentation and brand do not look professional" },
    layer: "identity",
  },
];

/** Six-month goal options — also layer-mapped, used as the second tie-breaker. */
export const goalOptions: { id: string; label: LocalizedText; layer: LayerId }[] = [
  { id: "goal-identity", label: { bn: "একটি প্রতিষ্ঠিত, পেশাদার Brand তৈরি করা", en: "Build an established, professional brand" }, layer: "identity" },
  { id: "goal-structure", label: { bn: "টিম ও দায়িত্ব পরিষ্কার করা", en: "Clarify the team and responsibilities" }, layer: "structure" },
  { id: "goal-operations", label: { bn: "নির্ভরযোগ্য প্রক্রিয়া (SOP) তৈরি করা", en: "Create reliable procedures (SOPs)" }, layer: "operations" },
  { id: "goal-growth", label: { bn: "বেশি Lead ও Customer পাওয়া", en: "Generate more leads and customers" }, layer: "growth" },
  { id: "goal-intelligence", label: { bn: "Data, CRM ও Automation চালু করা", en: "Introduce data, CRM and automation" }, layer: "intelligence" },
  { id: "goal-control", label: { bn: "Visibility ও KPI Tracking চালু করা", en: "Introduce visibility and KPI tracking" }, layer: "control" },
];

export const toolOptions: { id: string; label: LocalizedText }[] = [
  { id: "excel", label: { bn: "Excel / Google Sheets", en: "Excel / Google Sheets" } },
  { id: "whatsapp", label: { bn: "WhatsApp", en: "WhatsApp" } },
  { id: "notion", label: { bn: "Notion / Docs", en: "Notion / Docs" } },
  { id: "crm", label: { bn: "কোনো CRM", en: "A CRM" } },
  { id: "accounting", label: { bn: "Accounting Software", en: "Accounting software" } },
  { id: "nothing", label: { bn: "কিছুই নেই — সব মনে রাখতে হয়", en: "Nothing — it all depends on memory" } },
];

export function findProblemOption(id: string) {
  return biggestProblemOptions.find((option) => option.id === id);
}

export function findGoalOption(id: string) {
  return goalOptions.find((option) => option.id === id);
}

export function findToolOption(id: string) {
  return toolOptions.find((option) => option.id === id);
}

/** Steps of the audit wizard. */
export const auditSteps = [
  { id: 1, title: { bn: "Business Profile", en: "Business profile" }, hint: { bn: "আপনার ব্যবসা সম্পর্কে মৌলিক তথ্য", en: "Basic information about your business" } },
  { id: 2, title: { bn: "Current Systems", en: "Current systems" }, hint: { bn: "৬টি Layer-এর বর্তমান অবস্থা", en: "The current state of your six layers" } },
  { id: 3, title: { bn: "The Bottleneck", en: "The bottleneck" }, hint: { bn: "সবচেয়ে বড় সমস্যা ও লক্ষ্য", en: "Your biggest problem and goal" } },
  { id: 4, title: { bn: "Contact", en: "Contact" }, hint: { bn: "Snapshot পেতে যোগাযোগের তথ্য", en: "Contact details to receive your snapshot" } },
] as const;

export const layerAnswerOptions: { id: "yes" | "partial" | "no"; label: LocalizedText }[] = [
  { id: "yes", label: { bn: "হ্যাঁ", en: "Yes" } },
  { id: "partial", label: { bn: "আংশিক", en: "Partial" } },
  { id: "no", label: { bn: "না", en: "No" } },
];
