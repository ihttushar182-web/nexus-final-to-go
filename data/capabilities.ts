import type { LayerId, LocalizedList, LocalizedText } from "@/types";

/**
 * Capability & product-line inventory.
 *
 * Source: the business's own declared capability list (supplied directly by the owner).
 * This file is the single source of truth for "what can we actually build?", and it is
 * deliberately separate from /data/products.ts:
 *
 *   - /data/products.ts  = what is packaged, scoped and priced (the catalogue)
 *   - /data/solutions.ts = the eleven outcome areas the site sells
 *   - /data/capabilities.ts = the full delivery inventory behind those pages
 *
 * WHY THIS EXISTS
 * Delivery capability is much wider than the packaged catalogue. A buyer asks
 * "do you do RAG? employee portals? a SaaS MVP?" — this file answers that without
 * inventing price, scope or delivery promises for work that is genuinely custom.
 *
 * HOW IT IS POSITIONED (§02/§03 + owner directive)
 * Nexus Lift sells OUTCOMES AND SYSTEMS, not technologies. Every entry therefore leads
 * with `outcome` (what changes in the business) and treats the implementation as
 * supporting detail. `technologyStack` at the bottom is explicitly subordinate.
 *
 * HONESTY RULES APPLIED HERE
 *  - No prices. A capability either points at a real catalogue product (which carries
 *    the price) or its scope is confirmed in conversation.
 *  - No guaranteed results. `outcome` describes how the system operates, not a
 *    promised business result. See claimRules in /data/brand.ts.
 *  - Nothing from the declared list was dropped: `declaredCapabilities` maps every
 *    original phrase to the line that carries it, and a test fails if any does not resolve.
 */

export interface CapabilityFamily {
  id: string;
  order: number;
  name: LocalizedText;
  /** The outcome this family of systems exists to produce. */
  outcome: LocalizedText;
  summary: LocalizedText;
}

export interface Capability {
  /** Stable id used in URLs, links and tests. */
  id: string;
  /** The letter from the owner's product-line list (A–W). */
  code: string;
  order: number;
  name: LocalizedText;
  family: string;
  /** Which of the six connected layers this work moves. */
  layers: LayerId[];
  /** The result the business gets. This is the selling line. */
  outcome: LocalizedText;
  /** The problem that makes the business need it. */
  problem: LocalizedText;
  /** What we actually build — the system, not the tool. */
  system: LocalizedText;
  /** Concrete things included. */
  includes: LocalizedList;
  /** Phrases from the declared capability list that this line carries. */
  covers?: LocalizedList;
  related: {
    solutions: string[];
    products: string[];
  };
  /** "product" = a catalogue product carries the scope and price; "scoped" = confirmed in conversation. */
  engagement: "product" | "scoped";
}

/* ────────────────────────────── families ────────────────────────────── */

export const capabilityFamilies: CapabilityFamily[] = [
  {
    id: "ai-systems",
    order: 1,
    name: { bn: "AI Systems", en: "AI Systems" },
    outcome: {
      bn: "যে কাজগুলো প্রতিদিন একই নিয়মে করা হয়, সেগুলো সিস্টেম করে দেয় — আপনার টিম শুধু সিদ্ধান্ত নেয়।",
      en: "The work that repeats every day gets done by the system, so your team only makes decisions.",
    },
    summary: {
      bn: "AI Automation, AI Agents, Chatbots, Knowledge Assistant এবং Document Automation — আপনার নিজের ডেটা ও প্রক্রিয়ার উপর তৈরি।",
      en: "AI automation, agents, chatbots, knowledge assistants and document automation — built on your own data and process.",
    },
  },
  {
    id: "automation-integration",
    order: 2,
    name: { bn: "Automation & Integration", en: "Automation & Integration" },
    outcome: {
      bn: "এক সিস্টেমের তথ্য আর হাতে অন্য জায়গায় টাইপ করতে হয় না — সব নিজে নিজেই যুক্ত হয়।",
      en: "Information never gets retyped from one system into another — it connects itself.",
    },
    summary: {
      bn: "n8n, Make, Zapier, REST API এবং Webhook দিয়ে আপনার বর্তমান টুলগুলোকে একসাথে যুক্ত করা।",
      en: "n8n, Make, Zapier, REST APIs and webhooks connecting the tools you already use.",
    },
  },
  {
    id: "customer-revenue",
    order: 3,
    name: { bn: "Customer & Revenue Systems", en: "Customer & Revenue Systems" },
    outcome: {
      bn: "একটি Lead-ও হারায় না, আর কে কোন ধাপে আছে তা সবসময় জানা থাকে।",
      en: "No lead gets lost, and you always know which stage every one of them is in.",
    },
    summary: {
      bn: "Custom CRM, Lead Management, Sales Pipeline এবং CRM Automation — আপনার বিক্রয় প্রক্রিয়ার চারপাশে তৈরি।",
      en: "Custom CRM, lead management, sales pipeline and CRM automation — built around how you actually sell.",
    },
  },
  {
    id: "web-presence",
    order: 4,
    name: { bn: "Websites & Digital Presence", en: "Websites & Digital Presence" },
    outcome: {
      bn: "যে ওয়েবসাইট শুধু সুন্দর নয় — সেটি enquiry আনে এবং নিজেই উত্তর দিতে পারে।",
      en: "A website that does not just look good — it brings enquiries and can answer on its own.",
    },
    summary: {
      bn: "Next.js Website, AI Website, Lead Generation Website এবং Personal/Brand/Portfolio Website।",
      en: "Next.js websites, AI websites, lead-generation websites and personal, brand and portfolio sites.",
    },
  },
  {
    id: "data-control",
    order: 5,
    name: { bn: "Data, Dashboards & Control", en: "Data, Dashboards & Control" },
    outcome: {
      bn: "ব্যবসার আসল অবস্থা একটি স্ক্রিনে দেখা যায় — অনুমান নয়, তথ্য দিয়ে সিদ্ধান্ত।",
      en: "The real state of the business is visible on one screen, so decisions come from data instead of guesswork.",
    },
    summary: {
      bn: "Business Dashboard, Analytics, Admin Panel এবং Internal Business Tools।",
      en: "Business dashboards, analytics, admin panels and internal business tools.",
    },
  },
  {
    id: "platforms",
    order: 6,
    name: { bn: "Platforms, Portals & Custom Tools", en: "Platforms, Portals & Custom Tools" },
    outcome: {
      bn: "আপনার প্রক্রিয়ার জন্য বানানো নিজস্ব সফটওয়্যার — যা বাজারের সাধারণ টুলে করা যায় না।",
      en: "Software built around your process — for the work off-the-shelf tools cannot do.",
    },
    summary: {
      bn: "Custom Web Application, AI SaaS MVP, Client Portal এবং Custom Business Tools।",
      en: "Custom web applications, AI SaaS MVPs, client portals and custom business tools.",
    },
  },
];

/* ───────────────────────────── capabilities ─────────────────────────── */

export const capabilities: Capability[] = [
  /* ── AI Systems ── */
  {
    id: "ai-automation",
    code: "A",
    order: 1,
    name: { bn: "AI Automation", en: "AI Automation" },
    family: "ai-systems",
    layers: ["operations", "intelligence"],
    outcome: {
      bn: "প্রতিদিনের পুনরাবৃত্ত কাজ (তথ্য এন্ট্রি, যাচাই, রিপোর্ট, ফলো-আপ) নিজে নিজেই সম্পন্ন হয়।",
      en: "Daily repetitive work — data entry, checking, reporting, follow-up — completes on its own.",
    },
    problem: {
      bn: "একই তথ্য বারবার হাতে টাইপ করা হয়, আর প্রতিটি কাজ মানুষের মনে রাখার উপর নির্ভর করে।",
      en: "The same information is retyped again and again, and every task depends on somebody remembering it.",
    },
    system: {
      bn: "Trigger-ভিত্তিক AI Workflow: তথ্য আসে (Form, Email, WhatsApp) → যাচাই ও শ্রেণীবিভাগ হয় → সঠিক জায়গায় যায় → রিপোর্ট তৈরি হয়।",
      en: "A trigger-based AI workflow: information arrives (form, email, WhatsApp) → it is checked and classified → it goes to the right place → a report is produced.",
    },
    includes: {
      bn: ["Workflow mapping", "Trigger ও Rule ডিজাইন", "AI শ্রেণীবিভাগ ও সারাংশ", "রিপোর্টিং ও হ্যান্ডঅফ", "Error handling ও লগ"],
      en: ["Workflow mapping", "Trigger and rule design", "AI classification and summaries", "Reporting and handoff", "Error handling and logs"],
    },
    covers: {
      bn: ["Business AI Automation", "প্রতিদিনের পুনরাবৃত্ত কাজের অটোমেশন"],
      en: ["Business AI Automation", "AI-powered repetitive work"],
    },
    related: { solutions: ["automation-integrations"], products: ["automation-integration"] },
    engagement: "product",
  },
  {
    id: "ai-agents",
    code: "B",
    order: 2,
    name: { bn: "AI Agents", en: "AI Agents" },
    family: "ai-systems",
    layers: ["operations", "growth"],
    outcome: {
      bn: "Sales ও Support-এর প্রথম স্তরের কাজ একটি Agent করে — প্রশ্নের উত্তর, আগ্রহ যাচাই, অ্যাপয়েন্টমেন্ট সেট।",
      en: "An agent handles the first layer of sales and support — answering, qualifying interest, setting appointments.",
    },
    problem: {
      bn: "কর্মঘণ্টার বাইরে এলে enquiry পড়ে থাকে, আর টিম ছোট হলে একই প্রশ্নের উত্তর দিতে দিন চলে যায়।",
      en: "Enquiries arriving outside working hours sit unanswered, and a small team spends the day repeating the same answers.",
    },
    system: {
      bn: "আপনার তথ্য ও নিয়ম দিয়ে একটি Assistant/Agent — FAQ উত্তর দেয়, Lead qualify করে, দরকারে মানুষের কাছে হস্তান্তর করে এবং প্রতিটি কথোপকথন লগ করে।",
      en: "An assistant or agent built on your own information and rules — it answers, qualifies leads, hands over to a human when needed, and logs every conversation.",
    },
    includes: {
      bn: ["AI Sales Agent (lead যাচাই ও ফলো-আপ)", "AI Customer Support Agent (সাধারণ প্রশ্ন)", "AI Business Assistant (টিমের জন্য)", "Human handoff নিয়ম", "কথোপকথনের লগ ও রিপোর্ট"],
      en: ["AI sales agent (qualifying and follow-up)", "AI customer support agent (routine questions)", "AI business assistant (for the team)", "Human handoff rules", "Conversation logs and reports"],
    },
    covers: {
      bn: ["AI Sales Agents", "AI Customer Support Agents", "AI Business Assistants"],
      en: ["AI Sales Agents", "AI Customer Support Agents", "AI Business Assistants"],
    },
    related: { solutions: ["ai-agents-assistants"], products: ["ai-assistant-system"] },
    engagement: "product",
  },
  {
    id: "ai-chatbots",
    code: "C",
    order: 3,
    name: { bn: "AI Chatbots", en: "AI Chatbots" },
    family: "ai-systems",
    layers: ["growth", "operations"],
    outcome: {
      bn: "Website, Messenger বা WhatsApp-এ আসা প্রশ্ন সাথে সাথেই উত্তর পায় — কর্মঘণ্টা হোক বা না হোক।",
      en: "Questions on the website, Messenger or WhatsApp get answered immediately — working hours or not.",
    },
    problem: {
      bn: "কাস্টমার উত্তরের জন্য অপেক্ষা করে, তারপর চলে যায় — আর একই প্রশ্নের উত্তর টিমকে প্রতিদিন দিতে হয়।",
      en: "Customers wait, then leave, and the team answers the same questions every single day.",
    },
    system: {
      bn: "আপনার Business Profile, Price, Service এবং Policy দিয়ে প্রশিক্ষিত Chatbot — অজানা প্রশ্নে বানানো উত্তর দেয় না, বরং সঠিক তথ্য যাচাই করে জানায়।",
      en: "A chatbot trained on your business profile, prices, services and policies — it never invents an answer to an unknown question; it verifies and replies.",
    },
    includes: {
      bn: ["Knowledge base তৈরি", "Chatbot ও Personality সেটআপ", "Channel যুক্ত করা (Web/Messenger/WhatsApp)", "অজানা প্রশ্নের নিয়ম", "লগ ও সাধারণ প্রশ্নের রিপোর্ট"],
      en: ["Knowledge base creation", "Chatbot and personality setup", "Channel connection (web/Messenger/WhatsApp)", "Unknown-question rules", "Logs and common-question reports"],
    },
    related: { solutions: ["ai-agents-assistants"], products: ["ai-assistant-system"] },
    engagement: "product",
  },
  {
    id: "rag-knowledge-assistant",
    code: "T",
    order: 4,
    name: { bn: "RAG / Knowledge Assistant", en: "RAG / Knowledge Assistant" },
    family: "ai-systems",
    layers: ["intelligence", "operations"],
    outcome: {
      bn: "টিম বা কাস্টমার প্রশ্ন করলে উত্তর আসে আপনার নিজের ডকুমেন্ট থেকে — অনুমান নয়, সূত্রসহ।",
      en: "A question from your team or a customer is answered from your own documents — with the source, not a guess.",
    },
    problem: {
      bn: "জ্ঞান ছড়িয়ে আছে PDF, Chat, Email আর মানুষের মাথায় — নতুন কেউ শিখতে সময় নেয়, আর পুরনো নিয়ম ভুলে যায়।",
      en: "Knowledge is scattered across PDFs, chats, emails and people's heads, so new staff take longer to learn and old rules get forgotten.",
    },
    system: {
      bn: "আপনার ডকুমেন্ট থেকে একটি searchable knowledge assistant — প্রশ্নের উত্তর দেয় এবং কোন ডকুমেন্টের কোন অংশ থেকে এসেছে তা দেখায়।",
      en: "A searchable knowledge assistant over your documents — it answers and shows which part of which document the answer came from.",
    },
    includes: {
      bn: ["ডকুমেন্ট সংগ্রহ ও পরিষ্কার করা", "Knowledge base সেটআপ", "সূত্রসহ উত্তর (citation)", "টিম বা কাস্টমার অ্যাক্সেস", "নিয়ন্ত্রণ ও আপডেট প্রক্রিয়া"],
      en: ["Document collection and clean-up", "Knowledge base setup", "Answers with citations", "Team or customer access", "Controls and an update process"],
    },
    covers: {
      bn: ["RAG systems", "AI knowledge assistants", "Knowledge bases", "AI document systems"],
      en: ["RAG systems", "AI knowledge assistants", "Knowledge bases", "AI document systems"],
    },
    related: { solutions: ["ai-agents-assistants"], products: ["ai-assistant-system"] },
    engagement: "product",
  },
  {
    id: "ai-document-automation",
    code: "U",
    order: 5,
    name: { bn: "AI Document Automation", en: "AI Document Automation" },
    family: "ai-systems",
    layers: ["operations", "intelligence"],
    outcome: {
      bn: "ইনভয়েস, চালান, ফর্ম বা চুক্তি থেকে তথ্য নিজে নিজেই পড়া হয় এবং সিস্টেমে উঠে যায়।",
      en: "Invoices, delivery notes, forms and contracts are read and entered into the system automatically.",
    },
    problem: {
      bn: "কাগজ বা PDF থেকে তথ্য তুলতে ঘণ্টার পর ঘণ্টা যায়, আর ভুল হওয়ার সুযোগ থাকে।",
      en: "Hours go into typing information out of paper and PDFs, and mistakes slip through.",
    },
    system: {
      bn: "ডকুমেন্ট নিন → তথ্য বের করা, যাচাই ও classification → আপনার সিস্টেমে এন্ট্রি → ব্যতিক্রম হলে মানুষের কাছে পাঠানো।",
      en: "A document comes in → information is extracted, checked and classified → it is entered into your system → anything unusual is routed to a person.",
    },
    includes: {
      bn: ["ডকুমেন্ট টাইপ চিহ্নিত করা", "তথ্য বের করার নিয়ম", "যাচাই ও ভুল ধরার নিয়ম", "সিস্টেমে সংরক্ষণ", "ব্যতিক্রম হ্যান্ডলিং"],
      en: ["Document type detection", "Extraction rules", "Validation and error-catching rules", "Storage in your system", "Exception handling"],
    },
    covers: {
      bn: ["AI document systems", "AI-powered custom tools (ডকুমেন্ট অংশ)"],
      en: ["AI document systems", "AI-powered custom tools (document side)"],
    },
    related: { solutions: ["automation-integrations"], products: ["automation-integration"] },
    engagement: "product",
  },

  /* ── Automation & Integration ── */
  {
    id: "n8n-automation",
    code: "D",
    order: 6,
    name: { bn: "n8n Automation", en: "n8n Automation" },
    family: "automation-integration",
    layers: ["operations", "control"],
    outcome: {
      bn: "প্রতিটি ব্যবসায়িক ধাপ একটি নির্ধারিত Workflow-এ চলে — কেউ ভুলে গেলেও কাজ আটকে থাকে না।",
      en: "Every business step runs as a defined workflow, so nothing stalls because someone forgot.",
    },
    problem: {
      bn: "কাজ এগোয় মানুষের মনে রাখার উপর — ছুটির দিন বা ভুল হলে প্রক্রিয়া থেমে যায়।",
      en: "Work advances only because people remember it; a holiday or a mistake stops the process.",
    },
    system: {
      bn: "n8n দিয়ে Trigger → শর্ত → কাজ → নোটিফিকেশন শৃঙ্খল, যেখানে প্রতিটি ধাপ লগ হয় এবং ব্যর্থ হলে দেখা যায়।",
      en: "A trigger → condition → action → notification chain in n8n, where every step is logged and failures are visible.",
    },
    includes: {
      bn: ["Workflow ডিজাইন", "Trigger ও শর্ত", "নোটিফিকেশন ও রিমাইন্ডার", "Error alert", "Run log ও ডকুমেন্টেশন"],
      en: ["Workflow design", "Triggers and conditions", "Notifications and reminders", "Error alerts", "Run logs and documentation"],
    },
    covers: {
      bn: ["n8n automation"],
      en: ["n8n automation"],
    },
    related: { solutions: ["automation-integrations"], products: ["automation-integration"] },
    engagement: "product",
  },
  {
    id: "make-zapier-automation",
    code: "E",
    order: 7,
    name: { bn: "Make / Zapier Automation", en: "Make / Zapier Automation" },
    family: "automation-integration",
    layers: ["operations"],
    outcome: {
      bn: "যে টুলগুলোতে আপনি এখন কাজ করেন, সেগুলো নিজেদের মধ্যে কথা বলে — দুবার কাজ করতে হয় না।",
      en: "The tools you already work in talk to each other, so nothing has to be done twice.",
    },
    problem: {
      bn: "একই তথ্য Google Sheet, Email আর CRM-এ আলাদা করে বসাতে হয়।",
      en: "The same record has to be placed into a spreadsheet, an email and a CRM separately.",
    },
    system: {
      bn: "Make বা Zapier-এ সেই যুক্তিগুলো তৈরি করা যেগুলো আপনার বর্তমান টুলেই চলে, খরচ ও সীমা মাথায় রেখে।",
      en: "The same connections built in Make or Zapier, running inside the tools you already pay for, with cost and limits in mind.",
    },
    includes: {
      bn: ["টুল নির্বাচন (n8n/Make/Zapier তুলনা)", "Scenario তৈরি", "তথ্য ম্যাপিং", "পরীক্ষা ও হস্তান্তর", "রক্ষণাবেক্ষণ গাইড"],
      en: ["Tool choice (n8n/Make/Zapier comparison)", "Scenario building", "Data mapping", "Testing and handover", "Maintenance guide"],
    },
    covers: {
      bn: ["Make automation", "Zapier automation"],
      en: ["Make automation", "Zapier automation"],
    },
    related: { solutions: ["automation-integrations"], products: ["automation-integration"] },
    engagement: "product",
  },
  {
    id: "api-integration",
    code: "F",
    order: 8,
    name: { bn: "API Integration", en: "API Integration" },
    family: "automation-integration",
    layers: ["operations", "control"],
    outcome: {
      bn: "আপনার সিস্টেম বাইরের সেবার সাথে সরাসরি যুক্ত — Accounts, Courier, Payment বা Marketplace হোক।",
      en: "Your system connects directly to outside services — accounts, courier, payments or marketplaces.",
    },
    problem: {
      bn: "দুই সিস্টেমের মাঝে তথ্য হাতে আনা-নেওয়া হয়, তাই হিসাব মেলে না আর সময় নষ্ট হয়।",
      en: "Data is moved by hand between two systems, so the numbers do not reconcile and time is lost.",
    },
    system: {
      bn: "REST API সংযোগ: অনুমোদন, তথ্য বিনিময়, ত্রুটি সামলানো এবং প্রয়োজনীয় জায়গায় তথ্য সংরক্ষণ।",
      en: "A REST API connection: authorisation, data exchange, error handling and storing what matters.",
    },
    includes: {
      bn: ["API যাচাই ও নকশা", "Authentication সেটআপ", "তথ্য ম্যাপিং", "Rate limit ও retry নিয়ম", "মনিটরিং ও ডকুমেন্টেশন"],
      en: ["API review and design", "Authentication setup", "Data mapping", "Rate-limit and retry rules", "Monitoring and documentation"],
    },
    covers: {
      bn: ["API integrations", "REST API integrations", "CRM integrations (সংযোগ অংশ)"],
      en: ["API integrations", "REST API integrations", "CRM integrations (connection side)"],
    },
    related: { solutions: ["automation-integrations"], products: ["automation-integration"] },
    engagement: "product",
  },
  {
    id: "webhook-integration",
    code: "G",
    order: 9,
    name: { bn: "Webhook Integration", en: "Webhook Integration" },
    family: "automation-integration",
    layers: ["operations", "control"],
    outcome: {
      bn: "কোনো ঘটনা ঘটলেই (নতুন অর্ডার, পেমেন্ট, মেসেজ) সিস্টেম সাথে সাথে জানে — জিজ্ঞেস করতে হয় না।",
      en: "When something happens — a new order, a payment, a message — the system knows at once instead of being asked.",
    },
    problem: {
      bn: "তথ্য জানতে বারবার পেজ রিফ্রেশ বা হাতে চেক করতে হয়, তাই দেরি হয়।",
      en: "Finding out means refreshing a page or checking by hand, so everything is late.",
    },
    system: {
      bn: "Inbound webhook endpoint: গোপন সূত্র দিয়ে যাচাই, ডুপ্লিকেট আটকানো (idempotency), লগ রাখা এবং সঠিক প্রক্রিয়া চালু করা।",
      en: "An inbound webhook endpoint: secret-verified, duplicate-safe (idempotent), logged, and wired to the right process.",
    },
    includes: {
      bn: ["Endpoint ডিজাইন", "গোপন সূত্র দিয়ে যাচাই", "ডুপ্লিকেট প্রতিরোধ", "কী-অনুযায়ী কাজ", "লগ ও ব্যর্থতার রিপোর্ট"],
      en: ["Endpoint design", "Secret-based verification", "Duplicate prevention", "Key-based routing", "Logs and failure reports"],
    },
    covers: {
      bn: ["Webhooks", "ইভেন্ট-ভিত্তিক সংযোগ"],
      en: ["Webhooks", "Event-based connections"],
    },
    related: { solutions: ["automation-integrations"], products: ["automation-integration"] },
    engagement: "product",
  },

  /* ── Customer & Revenue Systems ── */
  {
    id: "custom-crm",
    code: "H",
    order: 10,
    name: { bn: "Custom CRM", en: "Custom CRM" },
    family: "customer-revenue",
    layers: ["structure", "growth"],
    outcome: {
      bn: "প্রতিটি Customer ও Lead এক জায়গায় — কে কোথায় আছে, কে কী চেয়েছে, পরের ধাপ কী: সব স্পষ্ট।",
      en: "Every customer and lead in one place — who they are, what they wanted, and what the next step is.",
    },
    problem: {
      bn: "তথ্য ছড়িয়ে আছে Excel, WhatsApp আর মানুষের ফোনে; কেউ চলে গেলে তার সম্পর্কও চলে যায়।",
      en: "Information lives in spreadsheets, WhatsApp and people's phones, so when someone leaves, the relationships leave with them.",
    },
    system: {
      bn: "আপনার বিক্রয় প্রক্রিয়া অনুযায়ী CRM: ধাপ, দায়িত্ব, ফলো-আপ তারিখ, Score এবং প্রতিটি Lead-এর পূর্ণ ইতিহাস।",
      en: "A CRM shaped around your sales process: stages, owners, follow-up dates, scoring and the full history of every lead.",
    },
    includes: {
      bn: ["Lead Management System", "Sales Pipeline ও ধাপ", "Lead Scoring", "Follow-up ও রিমাইন্ডার", "Activity Trail", "Admin অ্যাক্সেস ও রিপোর্ট"],
      en: ["Lead management system", "Sales pipeline and stages", "Lead scoring", "Follow-ups and reminders", "Activity trail", "Admin access and reports"],
    },
    covers: {
      bn: ["Lead management systems", "Sales pipeline systems", "CRM integrations (ডেটা অংশ)"],
      en: ["Lead management systems", "Sales pipeline systems", "CRM integrations (data side)"],
    },
    related: { solutions: ["crm-customer-systems", "business-structure"], products: ["crm-customer-system"] },
    engagement: "product",
  },
  {
    id: "crm-automation",
    code: "I",
    order: 11,
    name: { bn: "CRM Automation", en: "CRM Automation" },
    family: "customer-revenue",
    layers: ["growth", "operations"],
    outcome: {
      bn: "ফলো-আপ, রিমাইন্ডার আর স্টেটাস আপডেট নিজে নিজেই হয় — কোনো Lead ভুলে বাদ পড়ে না।",
      en: "Follow-ups, reminders and status updates happen automatically, so no lead is forgotten.",
    },
    problem: {
      bn: "ভালো Lead-ও হারিয়ে যায় কারণ নির্দিষ্ট দিনে কেউ ফলো-আপ করতে ভুলে যায়।",
      en: "Good leads are lost simply because nobody followed up on the right day.",
    },
    system: {
      bn: "CRM-এর নিয়ম: নির্দিষ্ট সময় পর ফলো-আপ, স্টেটাস বদলালে পরের কাজ তৈরি, আর আটকে থাকা Lead-এর তালিকা।",
      en: "CRM rules: follow up after a set interval, create the next task when a status changes, and surface the leads that are stuck.",
    },
    includes: {
      bn: ["ফলো-আপ ক্রম", "স্টেটাস-ভিত্তিক কাজ তৈরি", "দায়িত্ব বণ্টন", "নোটিফিকেশন", "পাইপলাইন রিপোর্ট"],
      en: ["Follow-up sequences", "Status-triggered tasks", "Assignment rules", "Notifications", "Pipeline reporting"],
    },
    covers: {
      bn: ["CRM automation", "ফলো-আপ অটোমেশন"],
      en: ["CRM automation", "Follow-up automation"],
    },
    related: { solutions: ["crm-customer-systems"], products: ["crm-customer-system"] },
    engagement: "product",
  },

  /* ── Websites & Digital Presence ── */
  {
    id: "nextjs-website",
    code: "L",
    order: 12,
    name: { bn: "Next.js Website", en: "Next.js Website" },
    family: "web-presence",
    layers: ["identity", "growth"],
    outcome: {
      bn: "দ্রুত, মোবাইল-বান্ধব ও সহজে খুঁজে পাওয়া যায় এমন ওয়েবসাইট — যা আপনার বিজনেসকে বিশ্বাসযোগ্য দেখায়।",
      en: "A fast, mobile-friendly and findable website that makes the business look credible.",
    },
    problem: {
      bn: "ওয়েবসাইট ধীর, মোবাইলে ভাঙে, আর কাস্টমার নির্ভরযোগ্য তথ্য পায় না।",
      en: "The site is slow, breaks on mobile, and customers cannot find dependable information on it.",
    },
    system: {
      bn: "Next.js দিয়ে তৈরি সাইট: দ্রুত লোড, SEO বান্ধব কাঠামো, স্পষ্ট সেবার পৃষ্ঠা, যোগাযোগের Form এবং পরিমাপযোগ্য CTA।",
      en: "A Next.js build: fast loading, SEO-ready structure, clear service pages, working contact forms and measurable calls to action.",
    },
    includes: {
      bn: ["সাইট স্ট্রাকচার ও কনটেন্ট নকশা", "Responsive ডিজাইন (মোবাইল/ডেস্কটপ)", "SEO সেটআপ", "Contact ফর্ম", "Analytics ও হ্যান্ডওভার"],
      en: ["Site structure and content design", "Responsive design (mobile/desktop)", "SEO setup", "Contact form", "Analytics and handover"],
    },
    covers: {
      bn: ["Custom business websites", "Next.js"],
      en: ["Custom business websites", "Next.js"],
    },
    related: { solutions: ["website-conversion", "brand-identity"], products: ["website-conversion-system"] },
    engagement: "product",
  },
  {
    id: "ai-website",
    code: "N",
    order: 13,
    name: { bn: "AI Website", en: "AI Website" },
    family: "web-presence",
    layers: ["identity", "growth"],
    outcome: {
      bn: "ওয়েবসাইট নিজেই প্রশ্নের উত্তর দেয়, কাস্টমারকে চিনে প্রয়োজন অনুযায়ী দেখায় এবং Enquiry জমা করে।",
      en: "The website answers questions by itself, adapts to what the visitor needs, and captures the enquiry.",
    },
    problem: {
      bn: "ভিজিটর উত্তর না পেয়ে চলে যায়, আর কে কী খুঁজছিল তা কেউ জানে না।",
      en: "Visitors leave without an answer, and nobody learns what they were actually looking for.",
    },
    system: {
      bn: "আপনার নিজের কনটেন্টের উপর তৈরি AI Assistant, স্মার্ট সার্চ এবং প্রশ্নভিত্তিক Enquiry ফর্ম সহ ওয়েবসাইট।",
      en: "A website with an AI assistant built on your own content, smart search, and enquiry forms that adapt to the question.",
    },
    includes: {
      bn: ["AI Assistant যুক্ত করা", "কনটেন্ট-ভিত্তিক উত্তর", "Smart Search", "Enquiry Capture", "প্রশ্নের রিপোর্ট"],
      en: ["AI assistant integration", "Content-grounded answers", "Smart search", "Enquiry capture", "Question reporting"],
    },
    covers: {
      bn: ["AI-powered websites", "AI-powered custom tools (ওয়েব অংশ)"],
      en: ["AI-powered websites", "AI-powered custom tools (web side)"],
    },
    related: { solutions: ["website-conversion", "ai-agents-assistants"], products: ["website-conversion-system"] },
    engagement: "product",
  },
  {
    id: "lead-generation-website",
    code: "O",
    order: 14,
    name: { bn: "Lead Generation Website", en: "Lead Generation Website" },
    family: "web-presence",
    layers: ["growth"],
    outcome: {
      bn: "ওয়েবসাইট Enquiry আনে এবং আসা Enquiry নিজেই যাচাই হয়ে ঠিক জায়গায় পৌঁছায়।",
      en: "The website brings enquiries in — and each one is qualified and routed to the right place.",
    },
    problem: {
      bn: "ভিজিটর আসে কিন্তু Enquiry হয় না, আর যে অল্প Enquiry আসে তা ঠিকভাবে Follow-up হয় না।",
      en: "Visitors arrive but do not enquire, and the few enquiries that come in are not followed up properly.",
    },
    system: {
      bn: "Conversion-কেন্দ্রিক সাইট + Lead Capture + AI Lead Qualification + CRM-এ সরাসরি প্রেরণ + Follow-up ট্রিগার।",
      en: "A conversion-focused site plus lead capture, AI lead qualification, direct routing into the CRM, and follow-up triggers.",
    },
    includes: {
      bn: ["Offer ও Message পরিষ্কার করা", "Landing ও Form ডিজাইন", "AI Lead Qualification", "CRM-এ প্রেরণ", "কোন চ্যানেল থেকে এল তার পরিমাপ"],
      en: ["Sharpening the offer and message", "Landing and form design", "AI lead qualification", "Routing into the CRM", "Measuring which channel produced it"],
    },
    covers: {
      bn: ["Lead-generating websites", "AI Lead Generation Systems", "AI Lead Qualification"],
      en: ["Lead-generating websites", "AI Lead Generation Systems", "AI Lead Qualification"],
    },
    related: { solutions: ["website-conversion", "marketing-infrastructure"], products: ["website-conversion-system"] },
    engagement: "product",
  },
  {
    id: "personal-website",
    code: "P",
    order: 15,
    name: { bn: "Personal Website", en: "Personal Website" },
    family: "web-presence",
    layers: ["identity"],
    outcome: {
      bn: "নিজের নামে একটি নির্ভরযোগ্য জায়গা — যেখানে পরিচয়, কাজ ও যোগাযোগের পথ একসাথে থাকে।",
      en: "One dependable place under your own name, with your identity, work and contact route together.",
    },
    problem: {
      bn: "পরিচয় ছড়িয়ে আছে Facebook, LinkedIn আর ছবির ফোল্ডারে; কেউ খুঁজলে পূর্ণ চিত্র পায় না।",
      en: "Your profile is scattered across Facebook, LinkedIn and folders of photos, so a search never shows the whole picture.",
    },
    system: {
      bn: "দ্রুত, পরিচ্ছন্ন ব্যক্তিগত সাইট: পরিচয়, কাজ, অভিজ্ঞতা, যোগাযোগ এবং আপনার নিজের ডোমেইন।",
      en: "A fast, clean personal site: identity, work, experience, contact, on your own domain.",
    },
    includes: {
      bn: ["ডোমেইন ও সাইট সেটআপ", "পরিচিতি ও কাজের অংশ", "যোগাযোগের পথ", "Mobile optimisation", "Basic SEO"],
      en: ["Domain and site setup", "About and work sections", "Contact route", "Mobile optimisation", "Basic SEO"],
    },
    covers: {
      bn: ["Personal websites"],
      en: ["Personal websites"],
    },
    related: { solutions: ["brand-identity"], products: ["professional-business-starter"] },
    engagement: "product",
  },
  {
    id: "personal-brand-website",
    code: "Q",
    order: 16,
    name: { bn: "Personal Brand Website", en: "Personal Brand Website" },
    family: "web-presence",
    layers: ["identity", "growth"],
    outcome: {
      bn: "আপনার নামে নির্দিষ্ট একটি অবস্থান তৈরি হয় — যাতে সঠিক মানুষ আপনাকে খুঁজে পায় এবং বিশ্বাস করে।",
      en: "A clear position is built around your name, so the right people find you and trust you.",
    },
    problem: {
      bn: "কনটেন্ট আছে কিন্তু একটিমাত্র জায়গায় নেই, তাই দর্শক ফিরে আসে না এবং সুযোগ তৈরি হয় না।",
      en: "You publish, but it never collects in one place, so audiences do not return and opportunities do not form.",
    },
    system: {
      bn: "Positioning, স্পষ্ট Message, কনটেন্টের ঘর এবং Enquiry বা বুকিংয়ের পথ — সব একসাথে।",
      en: "Positioning, a clear message, a home for your content, and a route to enquiry or booking — together.",
    },
    includes: {
      bn: ["Positioning ও Message", "কনটেন্ট স্ট্রাকচার", "Enquiry / Booking পথ", "সোশ্যাল চ্যানেল সংযোগ", "Measurement সেটআপ"],
      en: ["Positioning and message", "Content structure", "Enquiry or booking route", "Social channel connection", "Measurement setup"],
    },
    covers: {
      bn: ["Personal brand websites", "Personalized business tools (ব্যক্তিগত ব্র্যান্ড অংশ)"],
      en: ["Personal brand websites", "Personalized business tools (personal brand side)"],
    },
    related: { solutions: ["brand-identity", "marketing-infrastructure"], products: ["professional-business-growth"] },
    engagement: "product",
  },
  {
    id: "portfolio-website",
    code: "R",
    order: 17,
    name: { bn: "Portfolio Website", en: "Portfolio Website" },
    family: "web-presence",
    layers: ["identity"],
    outcome: {
      bn: "আপনার কাজ নিজেই কথা বলে — সম্ভাব্য ক্লায়েন্ট বা নিয়োগকর্তা একবার দেখেই সিদ্ধান্তে পৌঁছায়।",
      en: "The work speaks for itself, so a prospective client or employer decides after a single look.",
    },
    problem: {
      bn: "কাজের প্রমাণ ফেসবুক পোস্ট বা ড্রাইভ লিংকে থাকে, যেখানে কেউ গুরুত্ব দিয়ে দেখে না।",
      en: "The evidence of your work lives in Facebook posts and Drive links, where nobody looks carefully.",
    },
    system: {
      bn: "Professional Portfolio Website: কাজের কেস, প্রক্রিয়া, ফলাফল এবং যোগাযোগের স্পষ্ট পথ।",
      en: "A professional portfolio: case work, process, outcomes and a clear way to make contact.",
    },
    includes: {
      bn: ["কেস/প্রজেক্ট স্ট্রাকচার", "Prime কাজের নির্বাচন", "কেস লেখা", "যোগাযোগের পথ", "Mobile ও SEO optimisation"],
      en: ["Case and project structure", "Selecting the best work", "Writing the cases", "Contact route", "Mobile and SEO optimisation"],
    },
    covers: {
      bn: ["Professional portfolio websites"],
      en: ["Professional portfolio websites"],
    },
    related: { solutions: ["brand-identity"], products: ["professional-business-starter"] },
    engagement: "product",
  },

  /* ── Data, Dashboards & Control ── */
  {
    id: "business-dashboard",
    code: "J",
    order: 18,
    name: { bn: "Business Dashboard", en: "Business Dashboard" },
    family: "data-control",
    layers: ["intelligence", "control"],
    outcome: {
      bn: "বিক্রয়, Enquiry, খরচ, উৎপাদন ও কাজের চাপ এক স্ক্রিনে — প্রতিদিন সকালে সিদ্ধান্ত নেওয়া সহজ হয়।",
      en: "Sales, enquiries, cost, output and workload on one screen, so the morning decision is easy.",
    },
    problem: {
      bn: "সংখ্যা পেতে আলাদা ফাইল খুলতে হয়, তাই সিদ্ধান্ত দেরিতে বা অনুমানে নেওয়া হয়।",
      en: "Getting a number means opening separate files, so decisions come late or from guesswork.",
    },
    system: {
      bn: "আপনার আসল ডেটা থেকে তৈরি Dashboard: নির্দিষ্ট সূচক, সময়ভিত্তিক তুলনা, ব্যতিক্রম চিহ্নিত করা এবং প্রিন্ট বা শেয়ার করার সুবিধা।",
      en: "A dashboard built on your real data: the right metrics, comparison over time, exceptions flagged, and something you can print or share.",
    },
    includes: {
      bn: ["গুরুত্বপূর্ণ সূচক নির্বাচন", "ডেটা সোর্স যুক্ত করা", "Dashboard ডিজাইন", "ব্যতিক্রম সংকেত", "ব্যবহারের প্রশিক্ষণ"],
      en: ["Choosing the vital metrics", "Connecting the data sources", "Dashboard design", "Exception signals", "Training on using it"],
    },
    covers: {
      bn: ["Analytics dashboards", "Admin dashboards", "Business dashboards"],
      en: ["Analytics dashboards", "Admin dashboards", "Business dashboards"],
    },
    related: { solutions: ["business-os-dashboards"], products: ["business-os-dashboard"] },
    engagement: "product",
  },
  {
    id: "internal-business-tools",
    code: "K",
    order: 19,
    name: { bn: "Internal Business Tools", en: "Internal Business Tools" },
    family: "data-control",
    layers: ["operations", "control"],
    outcome: {
      bn: "টিমের প্রতিদিনের কাজ একটি নির্দিষ্ট সফটওয়্যারে চলে — কম ভুল, কম দেরি, স্পষ্ট দায়িত্ব।",
      en: "Daily team work runs in one defined tool — fewer mistakes, less delay, clear ownership.",
    },
    problem: {
      bn: "একই কাজ কেউ Excel-এ, কেউ WhatsApp-এ, কেউ কাগজে করে; হিসাব মেলে না।",
      en: "One job is done in a spreadsheet by one person, on WhatsApp by another and on paper by a third, so nothing reconciles.",
    },
    system: {
      bn: "আপনার দৈনন্দিন কাজের জন্য অভ্যন্তরীণ সফটওয়্যার: Entry, অনুমোদন, হস্তান্তর, ইতিহাস ও রিপোর্ট — এক জায়গায়।",
      en: "Internal software for your daily work: entry, approval, handover, history and reports in one place.",
    },
    includes: {
      bn: ["কাজের ধাপ ম্যাপ করা", "Tool ডিজাইন ও তৈরি", "Role ও অনুমতি", "রিপোর্টিং", "টিম প্রশিক্ষণ ও হ্যান্ডওভার"],
      en: ["Mapping the workflow", "Tool design and build", "Roles and permissions", "Reporting", "Team training and handover"],
    },
    covers: {
      bn: ["Internal business tools", "Employee portals (অভ্যন্তরীণ অংশ)", "Admin dashboards (টিম অংশ)"],
      en: ["Internal business tools", "Employee portals (internal side)", "Admin dashboards (team side)"],
    },
    related: { solutions: ["business-os-dashboards", "sop-operations"], products: ["sop-process-system", "business-os-dashboard"] },
    engagement: "product",
  },

  /* ── Platforms, Portals & Custom Tools ── */
  {
    id: "custom-web-application",
    code: "M",
    order: 20,
    name: { bn: "Custom Web Application", en: "Custom Web Application" },
    family: "platforms",
    layers: ["operations", "structure"],
    outcome: {
      bn: "আপনার প্রক্রিয়ার জন্য বানানো নিজস্ব Application — যা বাজারের সাধারণ টুলে করা যায় না।",
      en: "An application built around your process, for the work ordinary tools cannot do.",
    },
    problem: {
      bn: "সাধারণ টুলের সাথে নিজের প্রক্রিয়া মেলাতে গিয়ে কাজ আটকে থাকে বা জোর করে বদলাতে হয়।",
      en: "The process either stalls to fit a generic tool, or gets forced into shapes it does not have.",
    },
    system: {
      bn: "Database, ব্যবহারকারী, অনুমতি, Workflow এবং Interface সহ একটি পূর্ণ ওয়েব অ্যাপ্লিকেশন।",
      en: "A complete web application with a database, users, permissions, workflows and an interface.",
    },
    includes: {
      bn: ["প্রয়োজন বিশ্লেষণ", "Architecture ও ডেটা নকশা", "তৈরি ও পরীক্ষা", "Deployment", "ডকুমেন্টেশন"],
      en: ["Requirement analysis", "Architecture and data design", "Build and testing", "Deployment", "Documentation"],
    },
    covers: {
      bn: ["Custom web applications", "AI-powered custom tools (অ্যাপ্লিকেশন অংশ)"],
      en: ["Custom web applications", "AI-powered custom tools (application side)"],
    },
    related: { solutions: ["custom-technology"], products: ["custom-portal-application"] },
    engagement: "product",
  },
  {
    id: "ai-saas-mvp",
    code: "S",
    order: 21,
    name: { bn: "AI SaaS MVP", en: "AI SaaS MVP" },
    family: "platforms",
    layers: ["growth", "intelligence"],
    outcome: {
      bn: "আপনার আইডিয়া একটি ব্যবহারযোগ্য Product হয়ে ওঠে — যাচাই, ব্যবহারকারী ও পরিমাপ সহ।",
      en: "Your idea becomes a usable product — with validation, real users and measurement built in.",
    },
    problem: {
      bn: "আইডিয়া আছে কিন্তু Product নেই, তাই বাজারে যাচাই করা যায় না এবং কিছু শেখা হয় না।",
      en: "There is an idea but no product, so it cannot be tested in the market and nothing is learned.",
    },
    system: {
      bn: "প্রথম সংস্করণ (MVP): প্রমাণযোগ্য মূল ফিচার, Account ব্যবস্থা, Payment প্রস্তুতি এবং পরিমাপ — দ্রুত চালু করা যায় এমনভাবে।",
      en: "A first version: the provable core features, accounts, payment readiness and measurement, put live fast.",
    },
    includes: {
      bn: ["Scope নির্ধারণ (কোনটা MVP-তে থাকবে)", "Product ডিজাইন ও তৈরি", "Account ও Subscription ভিত্তি", "Analytics", "রোলআউট ও পরবর্তী পরিকল্পনা"],
      en: ["Scope definition (what an MVP must contain)", "Product design and build", "Account and subscription foundation", "Analytics", "Rollout and the next plan"],
    },
    covers: {
      bn: ["SaaS MVPs", "AI SaaS systems"],
      en: ["SaaS MVPs", "AI SaaS systems"],
    },
    related: { solutions: ["custom-technology"], products: [] },
    engagement: "scoped",
  },
  {
    id: "client-portal",
    code: "V",
    order: 22,
    name: { bn: "Client Portal", en: "Client Portal" },
    family: "platforms",
    layers: ["structure", "operations"],
    outcome: {
      bn: "কাস্টমার নিজেই অবস্থা দেখে নিতে পারে — তাই 'কী হয়েছে?' প্রশ্ন কমে, আর পেশাদারিত্ব বাড়ে।",
      en: "Customers check status themselves, so 'any update?' messages drop and the service feels professional.",
    },
    problem: {
      bn: "প্রতিটি আপডেট জানাতে হয় হাতে; ফাইল, অবস্থা আর পেমেন্ট নিয়ে বারবার প্রশ্ন আসে।",
      en: "Every update has to be sent by hand, and questions about files, status and payments keep coming.",
    },
    system: {
      bn: "লগইন সহ Portal: কাস্টমার নিজের অর্ডার, অবস্থা, ফাইল, রিভিশন, ইনভয়েস ও Support দেখতে পারে — আর আপনার পক্ষে দায়িত্ব কমে।",
      en: "A logged-in portal: customers see their orders, status, files, revisions, invoices and support — and your side carries less admin.",
    },
    includes: {
      bn: ["User ও Access ব্যবস্থা", "অর্ডার ও অবস্থার দৃশ্য", "ফাইল ডেলিভারি", "Support / Message", "Employee Portal ভিত্তি"],
      en: ["Users and access", "Order and status view", "File delivery", "Support and messaging", "Employee portal foundation"],
    },
    covers: {
      bn: ["Client portals", "Employee portals"],
      en: ["Client portals", "Employee portals"],
    },
    related: { solutions: ["custom-technology"], products: ["custom-portal-application"] },
    engagement: "product",
  },
  {
    id: "custom-business-tools",
    code: "W",
    order: 23,
    name: { bn: "Custom Business Tools", en: "Custom Business Tools" },
    family: "platforms",
    layers: ["operations", "control"],
    outcome: {
      bn: "আপনার নিজের কাজের ধরন অনুযায়ী হাতে-গড়া টুল — যেখানে AI, হিসাব আর সিদ্ধান্ত সহায়তা একসাথে থাকে।",
      en: "A tool shaped exactly around how your business works, with AI, calculation and decision support in one place.",
    },
    problem: {
      bn: "প্রতিদিনের হিসাব, নির্বাচন বা সিদ্ধান্তের কাজ কেউ Excel-এ করে, আবার কেউ মাথায়।",
      en: "Daily calculation, selection or decision work is done in a spreadsheet by one person and in someone's head by another.",
    },
    system: {
      bn: "নির্দিষ্ট কাজের জন্য ছোট, নির্ভুল Tool: হিসাব, নিয়ম, স্মরণ ও সিদ্ধান্তের সহায়তা — প্রয়োজন অনুযায়ী AI সহ।",
      en: "A small, precise tool for a specific job: calculation, rules, memory and decision support — with AI where it genuinely helps.",
    },
    includes: {
      bn: ["কাজের গঠন বিশ্লেষণ", "Tool তৈরি", "নিয়ম ও হিসাব যাচাই", "AI সহায়তা (প্রয়োজন হলে)", "হ্যান্ডওভার ও প্রশিক্ষণ"],
      en: ["Analyzing the task structure", "Building the tool", "Validating rules and calculations", "AI assistance where it helps", "Handover and training"],
    },
    covers: {
      bn: ["Custom business tools", "Personalized business tools"],
      en: ["Custom business tools", "Personalized business tools"],
    },
    related: { solutions: ["custom-technology", "sop-operations"], products: [] },
    engagement: "scoped",
  },
];

/* ─────────────────── declared-capability coverage register ─────────────────── */

/**
 * Every phrase from the owner's declared capability list, mapped to the line that
 * carries it. Nothing is dropped and nothing is claimed twice under two names.
 *
 * A test asserts that every `mappedTo` resolves to a real capability id or to the
 * technology stack, so adding a capability to the business without giving it a home
 * in the data layer fails the build.
 */
export const declaredCapabilities: { phrase: string; mappedTo: string }[] = [
  // Canonical product lines (A–W) — each maps to itself.
  { phrase: "AI Automation", mappedTo: "ai-automation" },
  { phrase: "AI Agents", mappedTo: "ai-agents" },
  { phrase: "AI Chatbots", mappedTo: "ai-chatbots" },
  { phrase: "n8n Automation", mappedTo: "n8n-automation" },
  { phrase: "Make/Zapier Automation", mappedTo: "make-zapier-automation" },
  { phrase: "API Integration", mappedTo: "api-integration" },
  { phrase: "Webhook Integration", mappedTo: "webhook-integration" },
  { phrase: "Custom CRM", mappedTo: "custom-crm" },
  { phrase: "CRM Automation", mappedTo: "crm-automation" },
  { phrase: "Business Dashboard", mappedTo: "business-dashboard" },
  { phrase: "Internal Business Tools", mappedTo: "internal-business-tools" },
  { phrase: "Next.js Website", mappedTo: "nextjs-website" },
  { phrase: "Custom Web Application", mappedTo: "custom-web-application" },
  { phrase: "AI Website", mappedTo: "ai-website" },
  { phrase: "Lead Generation Website", mappedTo: "lead-generation-website" },
  { phrase: "Personal Website", mappedTo: "personal-website" },
  { phrase: "Personal Brand Website", mappedTo: "personal-brand-website" },
  { phrase: "Portfolio Website", mappedTo: "portfolio-website" },
  { phrase: "AI SaaS MVP", mappedTo: "ai-saas-mvp" },
  { phrase: "RAG / Knowledge Assistant", mappedTo: "rag-knowledge-assistant" },
  { phrase: "AI Document Automation", mappedTo: "ai-document-automation" },
  { phrase: "Client Portal", mappedTo: "client-portal" },
  { phrase: "Custom Business Tools", mappedTo: "custom-business-tools" },

  // Additional declared capabilities, merged into the lines above.
  { phrase: "Business AI Automation", mappedTo: "ai-automation" },
  { phrase: "AI Business Assistants", mappedTo: "ai-agents" },
  { phrase: "AI Sales Agents", mappedTo: "ai-agents" },
  { phrase: "AI Customer Support Agents", mappedTo: "ai-agents" },
  { phrase: "AI Lead Generation Systems", mappedTo: "lead-generation-website" },
  { phrase: "AI Lead Qualification", mappedTo: "lead-generation-website" },
  { phrase: "CRM integrations", mappedTo: "api-integration" },
  { phrase: "Lead management systems", mappedTo: "custom-crm" },
  { phrase: "Sales pipeline systems", mappedTo: "custom-crm" },
  { phrase: "Business dashboards", mappedTo: "business-dashboard" },
  { phrase: "Analytics dashboards", mappedTo: "business-dashboard" },
  { phrase: "Admin dashboards", mappedTo: "business-dashboard" },
  { phrase: "Custom web applications", mappedTo: "custom-web-application" },
  { phrase: "AI-powered websites", mappedTo: "ai-website" },
  { phrase: "Lead-generating websites", mappedTo: "lead-generation-website" },
  { phrase: "Custom business websites", mappedTo: "nextjs-website" },
  { phrase: "AI-powered custom tools", mappedTo: "custom-web-application" },
  { phrase: "SaaS MVPs", mappedTo: "ai-saas-mvp" },
  { phrase: "AI SaaS systems", mappedTo: "ai-saas-mvp" },
  { phrase: "Client portals", mappedTo: "client-portal" },
  { phrase: "Employee portals", mappedTo: "client-portal" },
  { phrase: "Knowledge bases", mappedTo: "rag-knowledge-assistant" },
  { phrase: "RAG systems", mappedTo: "rag-knowledge-assistant" },
  { phrase: "AI knowledge assistants", mappedTo: "rag-knowledge-assistant" },
  { phrase: "AI document systems", mappedTo: "ai-document-automation" },
  { phrase: "Personalized business tools", mappedTo: "custom-business-tools" },
  { phrase: "Personal websites", mappedTo: "personal-website" },
  { phrase: "Personal brand websites", mappedTo: "personal-brand-website" },
  { phrase: "Portfolio websites", mappedTo: "portfolio-website" },
  { phrase: "Professional portfolio websites", mappedTo: "portfolio-website" },
  { phrase: "Webhooks", mappedTo: "webhook-integration" },
  { phrase: "API integrations", mappedTo: "api-integration" },
  { phrase: "REST API integrations", mappedTo: "api-integration" },
  { phrase: "Make automation", mappedTo: "make-zapier-automation" },
  { phrase: "Zapier automation", mappedTo: "make-zapier-automation" },

  // Languages and platforms we build with — delivery tooling, not the offer.
  { phrase: "Next.js", mappedTo: "technology-stack" },
  { phrase: "React", mappedTo: "technology-stack" },
  { phrase: "Node.js", mappedTo: "technology-stack" },
  { phrase: "Supabase", mappedTo: "technology-stack" },
  { phrase: "PostgreSQL", mappedTo: "technology-stack" },
];

/* ─────────────────────────── technology stack ─────────────────────────── */

/**
 * Implementation choices. These are NEVER the offer (§ owner directive:
 * "sell outcomes and systems, not technologies"). They are published because buyers
 * and technical stakeholders legitimately ask what the work is built on, and because
 * people search for tools by name. Every entry states what it enables.
 */
export const technologyStack: { id: string; name: string; role: LocalizedText }[] = [
  { id: "n8n", name: "n8n", role: { bn: "অটোমেশন Workflow", en: "Automation workflows" } },
  { id: "make", name: "Make", role: { bn: "ক্লাউড অটোমেশন", en: "Cloud automation" } },
  { id: "zapier", name: "Zapier", role: { bn: "টুল সংযোগ", en: "Tool connections" } },
  { id: "rest", name: "REST APIs & Webhooks", role: { bn: "সিস্টেমের মধ্যে তথ্য আদান-প্রদান", en: "Moving data between systems" } },
  { id: "ai", name: "AI models & agents", role: { bn: "সহকারী, যাচাই ও ডকুমেন্ট বোঝা", en: "Assistants, qualification and document reading" } },
  { id: "nextjs", name: "Next.js", role: { bn: "ওয়েবসাইট ও অ্যাপ্লিকেশন", en: "Websites and applications" } },
  { id: "react", name: "React", role: { bn: "ব্যবহারকারীর Interface", en: "User interfaces" } },
  { id: "node", name: "Node.js", role: { bn: "সার্ভার-সাইড সেবা", en: "Server-side services" } },
  { id: "postgres", name: "PostgreSQL", role: { bn: "কাঠামোবদ্ধ ব্যবসায়িক ডেটা", en: "Structured business data" } },
  { id: "supabase", name: "Supabase", role: { bn: "ডেটাবেস, Auth ও Storage", en: "Database, auth and storage" } },
  { id: "crm", name: "CRM platforms", role: { bn: "কাস্টমার ডেটা ও পাইপলাইন", en: "Customer data and pipelines" } },
  { id: "cloud", name: "Cloud hosting", role: { bn: "সাইট ও সিস্টেম চালু রাখা", en: "Keeping sites and systems online" } },
];

/* ───────────────────────────── positioning ────────────────────────────── */

export const capabilityPositioning = {
  /** What we sell — the outcome framing, stated once. */
  principle: {
    bn: "আমরা প্রযুক্তি বিক্রি করি না — আমরা সিস্টেম ও ফলাফল দিই।",
    en: "We do not sell technology. We deliver systems and outcomes.",
  } as LocalizedText,
  explanation: {
    bn: "কোনো কাজ শুরু হয় সমস্যা দিয়ে, টুল দিয়ে নয়। কোন প্রযুক্তি ব্যবহার হবে তা দ্বিতীয় প্রশ্ন — প্রথম প্রশ্ন হলো ব্যবসার কোন ধাপটি ঠিক করতে হবে।",
    en: "Every engagement starts from a problem, not a tool. Which technology gets used is the second question; the first is which part of the business must work better.",
  } as LocalizedText,
  /**
   * The combined strength statement, in the business's own words.
   * Kept as data so it can be reused on any page or in any assistant prompt.
   */
  combination: [
    { bn: "ব্যবসা বোঝা", en: "Business understanding" },
    { bn: "সিস্টেম ডিজাইন", en: "System design" },
    { bn: "AI", en: "AI" },
    { bn: "অটোমেশন", en: "Automation" },
    { bn: "কাস্টম ওয়েব ডেভেলপমেন্ট", en: "Custom web development" },
    { bn: "CRM", en: "CRM" },
    { bn: "ডেটা", en: "Data" },
    { bn: "ড্যাশবোর্ড", en: "Dashboard" },
  ] as LocalizedText[],
  /** Applied to every capability claim, so nothing reads as a business guarantee. */
  outcomeNote: {
    bn: "প্রতিটি বর্ণনা সিস্টেম কীভাবে কাজ করে তা বোঝায় — কোনো নির্দিষ্ট ফলাফলের নিশ্চয়তা নয়। ফলাফল ব্যবসার অবস্থা, বাজার ও বাস্তবায়নের মান অনুযায়ী ভিন্ন হয়।",
    en: "Each description explains how a system operates, not a guaranteed result. Outcomes differ according to business condition, market and implementation quality.",
  } as LocalizedText,
} as const;

/* ────────────────────────────── helpers ────────────────────────────── */

/** Resolve a capability by its product-line letter ("B") or its id ("ai-agents"). */
export function getCapability(letterOrId: string): Capability | undefined {
  const key = letterOrId.trim().toUpperCase();
  return capabilities.find((item) => item.code === key || item.id === letterOrId);
}

export function getCapabilityFamily(id: string): CapabilityFamily | undefined {
  return capabilityFamilies.find((family) => family.id === id);
}

export function getCapabilitiesByFamily(familyId: string): Capability[] {
  return capabilities.filter((item) => item.family === familyId);
}

export function getCapabilitiesByLayer(layer: LayerId): Capability[] {
  return capabilities.filter((item) => item.layers.includes(layer));
}

/** Every phrase the business can deliver, resolved for display or auditing. */
export function resolveDeclaredCapabilities() {
  return declaredCapabilities.map((entry) => ({
    ...entry,
    target:
      entry.mappedTo === "technology-stack"
        ? null
        : capabilities.find((item) => item.id === entry.mappedTo) ?? null,
  }));
}

/** Honest summary numbers used on the capabilities page. */
export function capabilityStats() {
  const productised = capabilities.filter((item) => item.engagement === "product").length;
  return {
    declared: declaredCapabilities.length,
    lines: capabilities.length,
    families: capabilityFamilies.length,
    productised,
    scoped: capabilities.length - productised,
    technologies: technologyStack.length,
  };
}
