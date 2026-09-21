import type { LocalizedText } from "@/types";

/**
 * Lead magnet data — "Bangladesh SME System Maturity Report 2026".
 *
 * Every figure below comes from Nexus Lift's own audit sample as supplied by operations
 * (Master Business System v2.0 → Lead Magnet). It is first-party internal data, not
 * third-party research, and the page says so explicitly.
 */
export const smeReport = {
  title: {
    bn: "Bangladesh SME System Maturity Report 2026",
    en: "Bangladesh SME System Maturity Report 2026",
  },
  subtitle: {
    bn: "১০০+ Business Audit থেকে প্রাপ্ত অন্তর্দৃষ্টি",
    en: "Insights from 100+ business audits",
  },
  sampleNote: {
    bn: "এই সংখ্যাগুলো Nexus Lift-এর নিজস্ব Audit Sample থেকে সংগৃহীত (১০০+ বাংলাদেশী SME)। এটি কোনো তৃতীয় পক্ষের গবেষণা বা Industry Statistic নয়।",
    en: "These figures come from Nexus Lift's own audit sample (100+ Bangladeshi SMEs). They are not third-party research and not an industry statistic.",
  },
  executiveSummary: {
    bn: [
      "আমরা ১০০+ বাংলাদেশী SME Business Audit করেছি। এই রিপোর্টে তাদের System Maturity-এর চিত্র তুলে ধরা হলো।",
      "মূল বিষয়: ৯২% Business Founder-dependent, ৮৫% Process Manual, এবং ৭৮% Business-এ কোনো Dashboard নেই।",
    ],
    en: [
      "We have audited 100+ Bangladeshi SME businesses. This report presents the picture of their system maturity.",
      "Key findings: 92% of businesses are founder-dependent, 85% operate on manual process, and 78% have no dashboard.",
    ],
  },
  layerScores: [
    { layer: "identity", percent: 65 },
    { layer: "structure", percent: 52 },
    { layer: "operations", percent: 45 },
    { layer: "growth", percent: 60 },
    { layer: "intelligence", percent: 38 },
    { layer: "control", percent: 32 },
  ],
  topBottlenecks: [
    { label: { bn: "Founder Dependency", en: "Founder dependency" } as LocalizedText, percent: 92 },
    { label: { bn: "Manual Process", en: "Manual process" } as LocalizedText, percent: 85 },
    { label: { bn: "No Visibility", en: "No visibility" } as LocalizedText, percent: 78 },
  ],
  solutions: [
    {
      bn: "Structure ঠিক করলে Founder Dependency কমে।",
      en: "Fixing structure reduces founder dependency.",
    },
    {
      bn: "SOP তৈরি করলে Manual Process Systematic হয়।",
      en: "Creating SOPs turns manual process into a system.",
    },
    {
      bn: "Dashboard বানালে Visibility তৈরি হয়।",
      en: "Building a dashboard creates visibility.",
    },
  ],
  cta: {
    bn: "আপনার Business-এর Maturity জানতে চান?",
    en: "Would you like to know your own business's maturity?",
  },
  ctaBody: {
    bn: "Free Business Audit দিয়ে আপনার ৬টি Layer-এর অবস্থা জানুন এবং প্রথম Priorities ঠিক করুন।",
    en: "Use the free business audit to see the state of your six layers and decide the first priority.",
  },
} as const;
