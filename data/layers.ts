import type { BusinessLayer, LayerId } from "@/types";

/**
 * The 6 Connected Business Layers.
 * Source: Nexus Lift Master Business System v2.0 — Part 1 "6 Connected Business Layers"
 * + Full-Stack Master Build Specification §04 "CORE BUSINESS FRAMEWORK".
 */
export const businessLayers: BusinessLayer[] = [
  {
    id: "identity",
    order: 1,
    code: "01",
    name: { bn: "Identity", en: "Identity" },
    question: {
      bn: "ব্যবসাটি কী এবং মানুষ একে কীভাবে দেখে?",
      en: "What is the business and how is it perceived?",
    },
    questionBn: "ব্যবসাটি কী এবং মানুষ একে কীভাবে দেখে?",
    summary: {
      bn: "Brand, Positioning, Business Profile, Messaging এবং Visual Identity।",
      en: "Brand, positioning, business profile, messaging and visual identity.",
    },
    includes: {
      bn: ["Brand", "Positioning", "Business Profile", "Messaging", "Visual Identity"],
      en: ["Brand", "Positioning", "Business Profile", "Messaging", "Visual Identity"],
    },
    examples: {
      bn: [
        "একটি পরিষ্কার Business Profile যেটি কাস্টমার প্রথমেই বিশ্বাস করতে পারে",
        "সব চ্যানেলে একই Positioning ও Message",
        "Logo ও Visual System যা Consistency ধরে রাখে",
      ],
      en: [
        "A clear business profile a customer can trust on first contact",
        "The same positioning and message across every channel",
        "A logo and visual system that stays consistent",
      ],
    },
    metric: { bn: "Identity", en: "Identity" },
  },
  {
    id: "structure",
    order: 2,
    code: "02",
    name: { bn: "Structure", en: "Structure" },
    question: {
      bn: "কে কী কাজ করবে এবং authority কীভাবে সাজানো?",
      en: "Who does what and how is authority organized?",
    },
    questionBn: "কে কী কাজ করবে এবং authority কীভাবে সাজানো?",
    summary: {
      bn: "Organogram, Departments, Roles, Responsibilities, Reporting এবং Authority।",
      en: "Organogram, departments, roles, responsibilities, reporting and authority.",
    },
    includes: {
      bn: ["Organogram", "Departments", "Roles", "Responsibilities", "Reporting", "Authority"],
      en: ["Organogram", "Departments", "Roles", "Responsibilities", "Reporting", "Authority"],
    },
    examples: {
      bn: [
        "Organogram যেখানে প্রতিটি Role স্পষ্ট",
        "Role & Responsibility Matrix (কে কী decide করবে)",
        "প্রতিটি কাজের একজন নির্দিষ্ট Owner",
      ],
      en: [
        "An organogram where every role is defined",
        "A role & responsibility matrix (who decides what)",
        "One named owner for every recurring task",
      ],
    },
    metric: { bn: "Structure", en: "Structure" },
  },
  {
    id: "operations",
    order: 3,
    code: "03",
    name: { bn: "Operations", en: "Operations" },
    question: {
      bn: "কাজগুলো কীভাবে consistently এবং নিয়মিত হবে?",
      en: "How does repeated work happen consistently?",
    },
    questionBn: "কাজগুলো কীভাবে consistently এবং নিয়মিত হবে?",
    summary: {
      bn: "SOP, Workflow, Process Mapping, Documentation, Approval এবং Escalation।",
      en: "SOP, workflow, process mapping, documentation, approval and escalation.",
    },
    includes: {
      bn: ["SOP", "Workflow", "Process Mapping", "Documentation", "Approval", "Escalation"],
      en: ["SOP", "Workflow", "Process Mapping", "Documentation", "Approval", "Escalation"],
    },
    examples: {
      bn: [
        "Sales, Delivery, Support — প্রতিটির জন্য লিখিত SOP",
        "Checklist যা প্রতিদিন ব্যবহার হয়",
        "Approval ও Escalation Policy যাতে সিদ্ধান্ত আটকে না থাকে",
      ],
      en: [
        "A written SOP for sales, delivery and support",
        "Checklists that are actually used every day",
        "Approval and escalation policy so decisions never stall",
      ],
    },
    metric: { bn: "Operations", en: "Operations" },
  },
  {
    id: "growth",
    order: 4,
    code: "04",
    name: { bn: "Growth", en: "Growth" },
    question: {
      bn: "ব্যবসা কীভাবে Customer আকর্ষণ করবে এবং Convert করবে?",
      en: "How does the business attract and convert customers?",
    },
    questionBn: "ব্যবসা কীভাবে Customer আকর্ষণ করবে এবং Convert করবে?",
    summary: {
      bn: "Website, Landing Pages, SEO, Marketing, Content এবং Conversion।",
      en: "Website, landing pages, SEO, marketing, content and conversion.",
    },
    includes: {
      bn: ["Website", "Landing Pages", "SEO", "Marketing", "Content", "Conversion"],
      en: ["Website", "Landing Pages", "SEO", "Marketing", "Content", "Conversion"],
    },
    examples: {
      bn: [
        "Website যা শুধু থাকার জন্য নয়, Lead আনার জন্য তৈরি",
        "SEO Setup যাতে Customer নিজে খুঁজে আসে",
        "Conversion Flow যেখানে Interest থেকে Enquiry হয়",
      ],
      en: [
        "A website built to generate leads, not just to exist",
        "SEO setup so customers find the business directly",
        "A conversion flow from interest to enquiry",
      ],
    },
    metric: { bn: "Growth", en: "Growth" },
  },
  {
    id: "intelligence",
    order: 5,
    code: "05",
    name: { bn: "Intelligence", en: "Intelligence" },
    question: {
      bn: "Customer Data, AI এবং Automation কীভাবে যুক্ত?",
      en: "How does the business use information and automation?",
    },
    questionBn: "Customer Data, AI এবং Automation কীভাবে যুক্ত?",
    summary: {
      bn: "CRM, AI, Automation, Customer Data, Agents এবং Integrations।",
      en: "CRM, AI, automation, customer data, agents and integrations.",
    },
    includes: {
      bn: ["CRM", "AI", "Automation", "Customer Data", "Agents", "Integrations"],
      en: ["CRM", "AI", "Automation", "Customer Data", "Agents", "Integrations"],
    },
    examples: {
      bn: [
        "সব Lead একটি Central CRM-এ",
        "Follow-up Automation যাতে কোনো Lead হারায় না",
        "AI Assistant যা সাধারণ প্রশ্নের উত্তর দেয়",
      ],
      en: [
        "Every lead in one central CRM",
        "Follow-up automation so no lead is lost",
        "An AI assistant that handles routine questions",
      ],
    },
    metric: { bn: "Intelligence", en: "Intelligence" },
  },
  {
    id: "control",
    order: 6,
    code: "06",
    name: { bn: "Control", en: "Control" },
    question: {
      bn: "Management কীভাবে Business দেখবে, মাপবে এবং উন্নত করবে?",
      en: "How does management see and improve the business?",
    },
    questionBn: "Management কীভাবে Business দেখবে, মাপবে এবং উন্নত করবে?",
    summary: {
      bn: "Business OS, Dashboards, KPI, Reporting, Analytics এবং Management Review।",
      en: "Business OS, dashboards, KPI, reporting, analytics and management review.",
    },
    includes: {
      bn: ["Business OS", "Dashboards", "KPI", "Reporting", "Analytics", "Management Review"],
      en: ["Business OS", "Dashboards", "KPI", "Reporting", "Analytics", "Management Review"],
    },
    examples: {
      bn: [
        "CEO Dashboard যেখানে Real-time Numbers দেখা যায়",
        "KPI Tracking এবং সাপ্তাহিক Review Meeting",
        "Management যেখানে Data দেখে সিদ্ধান্ত নেয়, অনুমানে নয়",
      ],
      en: [
        "A CEO dashboard showing real-time numbers",
        "KPI tracking and a weekly review meeting",
        "Management deciding from data, not guesswork",
      ],
    },
    metric: { bn: "Control", en: "Control" },
  },
];

export const layerIds: LayerId[] = businessLayers.map((layer) => layer.id);

export function getLayer(id: LayerId | string): BusinessLayer | undefined {
  return businessLayers.find((layer) => layer.id === id);
}

export const connectedFlow = [
  "identity",
  "structure",
  "operations",
  "growth",
  "intelligence",
  "control",
] as const;

/** Problem → Growth methodology (Master System v2.0 + Build Spec §05). */
export const growthMethodology = [
  {
    step: "01",
    id: "problem",
    name: { bn: "Problem", en: "Problem" },
    question: { bn: "কী আটকে আছে?", en: "What is stuck?" },
    output: { bn: "Problem definition", en: "Problem definition" },
  },
  {
    step: "02",
    id: "diagnosis",
    name: { bn: "Diagnosis", en: "Diagnosis" },
    question: { bn: "Bottleneck কোথায়?", en: "Where is the bottleneck?" },
    output: { bn: "Root-cause snapshot", en: "Root-cause snapshot" },
  },
  {
    step: "03",
    id: "strategy",
    name: { bn: "Strategy", en: "Strategy" },
    question: { bn: "কোনটি আগে জরুরি?", en: "What matters first?" },
    output: { bn: "Prioritized action", en: "Prioritized action" },
  },
  {
    step: "04",
    id: "system",
    name: { bn: "System", en: "System" },
    question: { bn: "কী structure দরকার?", en: "What structure is needed?" },
    output: { bn: "System blueprint", en: "System blueprint" },
  },
  {
    step: "05",
    id: "implementation",
    name: { bn: "Implementation", en: "Implementation" },
    question: { bn: "এটি কীভাবে কাজ করবে?", en: "How will it work?" },
    output: { bn: "Working system", en: "Working system" },
  },
  {
    step: "06",
    id: "growth",
    name: { bn: "Growth", en: "Growth" },
    question: { bn: "এরপর কী improve হবে?", en: "What improves next?" },
    output: { bn: "Measurement + optimization", en: "Measurement + optimization" },
  },
] as const;

/** Customer maturity ladder (Master System v2.0 — Customer Maturity Ladder). */
export const maturityLadder = [
  { level: 1, name: { bn: "Start", en: "Start" }, focus: { bn: "Brand + Domain + Hosting", en: "Brand + Domain + Hosting" } },
  { level: 2, name: { bn: "Present", en: "Present" }, focus: { bn: "Business Profile + Website + SEO", en: "Business Profile + Website + SEO" } },
  { level: 3, name: { bn: "Organize", en: "Organize" }, focus: { bn: "Organogram + SOP + CRM", en: "Organogram + SOP + CRM" } },
  { level: 4, name: { bn: "Control", en: "Control" }, focus: { bn: "Business OS + Dashboard", en: "Business OS + Dashboard" } },
  { level: 5, name: { bn: "Automate", en: "Automate" }, focus: { bn: "n8n / Make / Zapier / APIs", en: "n8n / Make / Zapier / APIs" } },
  { level: 6, name: { bn: "Intelligence", en: "Intelligence" }, focus: { bn: "AI Agents + Assistants + RAG", en: "AI Agents + Assistants + RAG" } },
  { level: 7, name: { bn: "Scale", en: "Scale" }, focus: { bn: "Custom software + Portals + SaaS", en: "Custom software + Portals + SaaS" } },
] as const;
