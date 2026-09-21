import type { SolutionCategory } from "@/types";

/**
 * Solution categories — Build Spec §20 / Master System v2.0 "Service Categories".
 * Categories group the work; products carry the commercial scope.
 */
export const solutionCategories: SolutionCategory[] = [
  {
    id: "brand-identity",
    order: 1,
    slug: "brand-identity",
    name: { bn: "Brand & Business Identity", en: "Brand & Business Identity" },
    headline: {
      bn: "আপনার Business কে — সেটি স্পষ্ট করুন",
      en: "Make clear who your business is",
    },
    summary: {
      bn: "Brand Strategy, Positioning, Logo, Brand Identity, Brand Guidelines, Business Profile, Company Story এবং Messaging Architecture।",
      en: "Brand strategy, positioning, logo, brand identity, brand guidelines, business profile, company story and messaging architecture.",
    },
    layer: "identity",
    icon: "fingerprint",
    capabilities: {
      bn: ["Brand Strategy", "Positioning", "Logo", "Brand Identity", "Brand Guidelines", "Business Profile", "Company Story", "Messaging Architecture"],
      en: ["Brand strategy", "Positioning", "Logo", "Brand identity", "Brand guidelines", "Business profile", "Company story", "Messaging architecture"],
    },
    deliverables: {
      bn: ["Brand Guidelines", "Logo Package", "Business Profile", "Messaging Framework"],
      en: ["Brand guidelines", "Logo package", "Business profile", "Messaging framework"],
    },
    bestFor: {
      bn: "যে ব্যবসার পরিচয় আছে কিন্তু কনসিস্টেন্সি নেই।",
      en: "Businesses that exist but lack consistency.",
    },
    outcomes: {
      bn: ["প্রথম দেখাতেই পেশাদারিত্ব বোঝা যায়", "সব চ্যানেলে একই Message", "কাস্টমার দ্রুত বিশ্বাস করে"],
      en: ["Professionalism visible at first glance", "One message across every channel", "Customers reach trust faster"],
    },
    productSlugs: ["professional-business-starter", "professional-business-growth", "professional-business-premium", "brand-identity-system"],
    seoTitle: { bn: "Brand & Business Identity Services | Nexus Lift", en: "Brand & Business Identity Services | Nexus Lift" },
    seoDescription: {
      bn: "Brand Strategy, Positioning, Logo, Guidelines ও Business Profile — Identity Layer ঠিক করার জন্য Nexus Lift সেবা।",
      en: "Brand strategy, positioning, logo, guidelines and business profile — Nexus Lift services for fixing the Identity layer.",
    },
  },
  {
    id: "business-structure",
    order: 2,
    slug: "business-structure",
    name: { bn: "Business Structure", en: "Business Structure" },
    headline: { bn: "কে কী করবে — সেটি নির্দিষ্ট করুন", en: "Define who does what" },
    summary: {
      bn: "Business Structure, Organogram, Department Design, Role & Responsibility এবং Authority Matrix।",
      en: "Business structure, organogram, department design, role & responsibility and authority matrix.",
    },
    layer: "structure",
    icon: "network",
    capabilities: {
      bn: ["Business Structure", "Organogram", "Department Design", "Role & Responsibility", "Authority Matrix", "Reporting Structure"],
      en: ["Business structure", "Organogram", "Department design", "Role & responsibility", "Authority matrix", "Reporting structure"],
    },
    deliverables: {
      bn: ["Organogram", "Role & Responsibility Matrix", "Authority Matrix", "Reporting Structure"],
      en: ["Organogram", "Role & responsibility matrix", "Authority matrix", "Reporting structure"],
    },
    bestFor: { bn: "৫–৫০ জনের টিম, যেখানে কাজের সীমানা অস্পষ্ট।", en: "Teams of 5–50 where task boundaries are unclear." },
    outcomes: {
      bn: ["দায়িত্ব পরিষ্কার", "Founder-এর ওপর নির্ভরতা কমে", "Escalation কমে"],
      en: ["Clear accountability", "Less founder dependency", "Fewer escalations"],
    },
    productSlugs: ["business-structure-setup"],
    seoTitle: { bn: "Business Structure & Organogram Services | Nexus Lift", en: "Business Structure & Organogram Services | Nexus Lift" },
    seoDescription: {
      bn: "Organogram, Role Matrix এবং Authority Matrix তৈরি — Structure Layer ঠিক করার জন্য Nexus Lift সেবা।",
      en: "Organogram, role matrix and authority matrix — Nexus Lift services for fixing the Structure layer.",
    },
  },
  {
    id: "sop-operations",
    order: 3,
    slug: "sop-operations",
    name: { bn: "SOP & Operations", en: "SOP & Operations" },
    headline: { bn: "Manual Chaos থেকে Repeatable System", en: "From manual chaos to a repeatable system" },
    summary: {
      bn: "Custom SOP, Department SOP, Sales/Operations/Support SOP, Process Mapping এবং Documentation।",
      en: "Custom SOP, department SOP, sales/operations/support SOP, process mapping and documentation.",
    },
    layer: "operations",
    icon: "list-checks",
    capabilities: {
      bn: ["Custom SOP", "Department SOP", "Sales SOP", "Operations SOP", "Support SOP", "Process Mapping", "Workflow Design", "Documentation"],
      en: ["Custom SOP", "Department SOP", "Sales SOP", "Operations SOP", "Support SOP", "Process mapping", "Workflow design", "Documentation"],
    },
    deliverables: {
      bn: ["৫টি Core SOP", "Flowchart", "Checklist", "Role Matrix", "Approval & Escalation Policy", "Team Training"],
      en: ["Five core SOPs", "Flowcharts", "Checklists", "Role matrix", "Approval & escalation policy", "Team training"],
    },
    bestFor: { bn: "যেখানে কাজ মানুষ ও Memory-এর ওপর নির্ভরশীল।", en: "Where work depends on people and memory." },
    outcomes: {
      bn: ["Consistent কাজ", "নতুন Employee দ্রুত শেখে", "Founder ছুটি নিতে পারে"],
      en: ["Consistent work", "New employees learn faster", "The founder can take leave"],
    },
    productSlugs: ["sop-process-system"],
    seoTitle: { bn: "SOP & Process System Services | Nexus Lift", en: "SOP & Process System Services | Nexus Lift" },
    seoDescription: {
      bn: "Custom SOP, Process Mapping, Workflow, Checklist ও Training — Operations Layer ঠিক করার জন্য Nexus Lift সেবা।",
      en: "Custom SOP, process mapping, workflow, checklists and training — Nexus Lift services for fixing the Operations layer.",
    },
  },
  {
    id: "website-conversion",
    order: 4,
    slug: "website-conversion",
    name: { bn: "Website & Conversion", en: "Website & Conversion" },
    headline: { bn: "ভিজিটর নয়, Enquiry চাই", en: "Not visitors — enquiries" },
    summary: {
      bn: "Business Website, AI Website, Landing Page, Conversion Flow এবং Role-based Client/Employee Portal।",
      en: "Business website, AI website, landing page, conversion flow and role-based client/employee portals.",
    },
    layer: "growth",
    icon: "monitor-smartphone",
    capabilities: {
      bn: ["Business Website", "AI Website", "Landing Page", "Conversion Flow", "Client Portal", "Employee Portal", "Role-based Access"],
      en: ["Business website", "AI website", "Landing page", "Conversion flow", "Client portal", "Employee portal", "Role-based access"],
    },
    deliverables: {
      bn: ["Responsive Website", "Conversion Path", "Lead Capture Flow", "Analytics Setup"],
      en: ["Responsive website", "Conversion path", "Lead capture flow", "Analytics setup"],
    },
    bestFor: { bn: "যাদের Website আছে কিন্তু Lead আসে না।", en: "Businesses with a website that produces no leads." },
    outcomes: {
      bn: ["প্রতিটি Page একটি সিদ্ধান্তের দিকে নিয়ে যায়", "Lead Capture স্বয়ংক্রিয়", "Mobile-এ সম্পূর্ণ কাজ করে"],
      en: ["Every page leads towards a decision", "Automated lead capture", "Fully functional on mobile"],
    },
    productSlugs: ["website-conversion-system"],
    seoTitle: { bn: "Website & Conversion Services | Nexus Lift", en: "Website & Conversion Services | Nexus Lift" },
    seoDescription: {
      bn: "Business Website, Landing Page, Conversion Flow ও Portal Development — Growth Layer ঠিক করার Nexus Lift সেবা।",
      en: "Business websites, landing pages, conversion flows and portal development — Nexus Lift services for the Growth layer.",
    },
  },
  {
    id: "crm-customer-systems",
    order: 5,
    slug: "crm-customer-systems",
    name: { bn: "CRM & Customer Systems", en: "CRM & Customer Systems" },
    headline: { bn: "Customer Data এক জায়গায়", en: "Customer data in one place" },
    summary: {
      bn: "Custom CRM, Customer Database, Lead Management, Sales Pipeline, Follow-up System এবং Retention System।",
      en: "Custom CRM, customer database, lead management, sales pipeline, follow-up system and retention system.",
    },
    layer: "intelligence",
    icon: "users",
    capabilities: {
      bn: ["Custom CRM", "Customer Database", "Lead Management", "Sales Pipeline", "Follow-up System", "Retention System"],
      en: ["Custom CRM", "Customer database", "Lead management", "Sales pipeline", "Follow-up system", "Retention system"],
    },
    deliverables: {
      bn: ["Configured CRM", "Data Import", "Pipeline Setup", "Follow-up Automation", "Team Training"],
      en: ["Configured CRM", "Data import", "Pipeline setup", "Follow-up automation", "Team training"],
    },
    bestFor: { bn: "যাদের প্রতিদিন Lead আসে কিন্তু Follow-up Manual।", en: "Businesses receiving daily leads with manual follow-up." },
    outcomes: {
      bn: ["কোনো Lead হারায় না", "Pipeline পরিষ্কার দেখা যায়", "Retention Alert চলে"],
      en: ["No lead is lost", "A clear pipeline view", "Retention alerts fire on time"],
    },
    productSlugs: ["crm-customer-system"],
    seoTitle: { bn: "CRM & Customer System Services | Nexus Lift", en: "CRM & Customer System Services | Nexus Lift" },
    seoDescription: {
      bn: "Custom CRM, Lead Management, Sales Pipeline, Follow-up Automation ও Retention System — Nexus Lift Intelligence Layer সেবা।",
      en: "Custom CRM, lead management, sales pipeline, follow-up automation and retention systems — Nexus Lift Intelligence layer services.",
    },
  },
  {
    id: "marketing-infrastructure",
    order: 6,
    slug: "marketing-infrastructure",
    name: { bn: "Marketing Infrastructure", en: "Marketing Infrastructure" },
    headline: { bn: "Presence নয়, Infrastructure", en: "Infrastructure, not just presence" },
    summary: {
      bn: "SEO Setup, Keyword Research, Content Architecture, 5-Article SEO Content Module, Analytics এবং Conversion Tracking।",
      en: "SEO setup, keyword research, content architecture, a five-article SEO content module, analytics and conversion tracking.",
    },
    layer: "growth",
    icon: "search",
    capabilities: {
      bn: ["SEO Setup", "Keyword Research", "Content Architecture", "SEO Content Module", "Analytics", "Conversion Tracking"],
      en: ["SEO setup", "Keyword research", "Content architecture", "SEO content module", "Analytics", "Conversion tracking"],
    },
    deliverables: {
      bn: ["SEO Setup", "Keyword Map", "Content Structure", "Analytics ও Conversion Tracking"],
      en: ["SEO setup", "Keyword map", "Content structure", "Analytics and conversion tracking"],
    },
    bestFor: { bn: "যে ব্যবসা Organic-ভাবে কাস্টমার খুঁজে পেতে চায়।", en: "Businesses that want customers to find them organically." },
    outcomes: {
      bn: ["সঠিক Keyword-এ দৃশ্যমানতা", "Content একটি স্ট্রাকচার অনুসরণ করে", "কোন CTA কাজ করছে তা Measurable"],
      en: ["Visibility on the right keywords", "Content that follows a structure", "Measurable knowledge of which CTA works"],
    },
    productSlugs: ["website-conversion-system"],
    seoTitle: { bn: "Marketing Infrastructure & SEO Services | Nexus Lift", en: "Marketing Infrastructure & SEO Services | Nexus Lift" },
    seoDescription: {
      bn: "SEO Setup, Keyword Research, Content Architecture এবং Analytics — Marketing Infrastructure তৈরি করার Nexus Lift সেবা।",
      en: "SEO setup, keyword research, content architecture and analytics — Nexus Lift services for building marketing infrastructure.",
    },
  },
  {
    id: "business-os-dashboards",
    order: 7,
    slug: "business-os-dashboards",
    name: { bn: "Business OS & Dashboards", en: "Business OS & Dashboards" },
    headline: { bn: "Business Control Room", en: "The business control room" },
    summary: {
      bn: "Business OS, CEO/Management/Sales/Finance Dashboard, KPI Monitoring এবং Executive Control Room।",
      en: "Business OS, CEO/management/sales/finance dashboards, KPI monitoring and an executive control room.",
    },
    layer: "control",
    icon: "layout-dashboard",
    capabilities: {
      bn: ["Business OS", "CEO Dashboard", "Management Dashboard", "Sales Dashboard", "Finance Dashboard", "KPI Monitoring"],
      en: ["Business OS", "CEO dashboard", "Management dashboard", "Sales dashboard", "Finance dashboard", "KPI monitoring"],
    },
    deliverables: {
      bn: ["CEO Control Room", "Dashboard Suite", "KPI Setup", "Mobile Access", "Team Training"],
      en: ["CEO control room", "Dashboard suite", "KPI setup", "Mobile access", "Team training"],
    },
    bestFor: { bn: "যাদের Management সিদ্ধান্ত নেয় অনুমানে, কারণ Data নেই।", en: "Management deciding from assumption because data is missing." },
    outcomes: {
      bn: ["সপ্তাহের শুরুতে পুরো অবস্থা এক নজরে", "Data দেখে সিদ্ধান্ত", "সমস্যা আগেই ধরা পড়ে"],
      en: ["The whole picture visible at the start of each week", "Decisions made from data", "Problems caught early"],
    },
    productSlugs: ["business-os-dashboard"],
    seoTitle: { bn: "Business OS & Dashboard Services | Nexus Lift", en: "Business OS & Dashboard Services | Nexus Lift" },
    seoDescription: {
      bn: "CEO Dashboard, Sales/Finance/Operations Dashboard এবং KPI Monitoring — Control Layer তৈরি করার Nexus Lift সেবা।",
      en: "CEO dashboard, sales/finance/operations dashboards and KPI monitoring — Nexus Lift services for building the Control layer.",
    },
  },
  {
    id: "ai-agents-assistants",
    order: 8,
    slug: "ai-agents-assistants",
    name: { bn: "AI Agents & Assistants", en: "AI Agents & Assistants" },
    headline: { bn: "AI যেখানে সত্যিই কাজে লাগে", en: "AI where it genuinely helps" },
    summary: {
      bn: "AI Agents, AI Business Assistants, AI Chatbot, AI Sales/Support/Executive Assistant এবং Knowledge Retrieval।",
      en: "AI agents, AI business assistants, AI chatbots, AI sales/support/executive assistants and knowledge retrieval.",
    },
    layer: "intelligence",
    icon: "bot",
    capabilities: {
      bn: ["AI Agents", "AI Business Assistant", "AI Chatbot", "AI Sales Assistant", "AI Support Assistant", "Knowledge Retrieval"],
      en: ["AI agents", "AI business assistant", "AI chatbot", "AI sales assistant", "AI support assistant", "Knowledge retrieval"],
    },
    deliverables: {
      bn: ["Configured Assistant", "Knowledge Base", "Escalation Rules", "Documentation"],
      en: ["Configured assistant", "Knowledge base", "Escalation rules", "Documentation"],
    },
    bestFor: { bn: "যেখানে প্রতিদিন একই প্রশ্ন আসে।", en: "Teams fielding the same questions every day." },
    outcomes: {
      bn: ["দ্রুত Response", "রুটিন প্রশ্ন স্বয়ংক্রিয়", "দরকার হলে মানুষ সম্পৃক্ত হয়"],
      en: ["Faster responses", "Routine questions handled automatically", "Humans involved when needed"],
    },
    productSlugs: ["ai-assistant-system"],
    seoTitle: { bn: "AI Agents & Business Assistants | Nexus Lift", en: "AI Agents & Business Assistants | Nexus Lift" },
    seoDescription: {
      bn: "AI Business Assistant, Chatbot এবং Knowledge Retrieval — আপনার নিজের তথ্য থেকে উত্তর দেওয়া AI সিস্টেম।",
      en: "AI business assistants, chatbots and knowledge retrieval — AI systems that answer from your own information.",
    },
  },
  {
    id: "automation-integrations",
    order: 9,
    slug: "automation-integrations",
    name: { bn: "Automation & Integrations", en: "Automation & Integrations" },
    headline: { bn: "Manual কাজ কমান", en: "Reduce manual work" },
    summary: {
      bn: "n8n, Make, Zapier, Webhook, REST API Integration এবং Lead/Sales/Support/Reporting Automation।",
      en: "n8n, Make, Zapier, webhooks, REST API integration and lead/sales/support/reporting automation.",
    },
    layer: "intelligence",
    icon: "workflow",
    capabilities: {
      bn: ["n8n", "Make", "Zapier", "Webhook", "REST API Integration", "Lead Automation", "Reporting Automation"],
      en: ["n8n", "Make", "Zapier", "Webhooks", "REST API integration", "Lead automation", "Reporting automation"],
    },
    deliverables: {
      bn: ["Working Workflows", "Integration Docs", "Error Alert", "Handover"],
      en: ["Working workflows", "Integration docs", "Error alerts", "Handover"],
    },
    bestFor: { bn: "যাদের টিম প্রতিদিন Data Entry করছে।", en: "Teams doing manual data entry every day." },
    outcomes: {
      bn: ["সময় বাঁচে", "ভুল কমে", "Reporting স্বয়ংক্রিয়"],
      en: ["Time saved", "Fewer errors", "Automated reporting"],
    },
    productSlugs: ["automation-integration"],
    seoTitle: { bn: "Automation & Integration Services | Nexus Lift", en: "Automation & Integration Services | Nexus Lift" },
    seoDescription: {
      bn: "n8n, Make, Zapier, Webhook এবং REST API Automation — Lead, Sales, Support ও Reporting স্বয়ংক্রিয়করণ।",
      en: "n8n, Make, Zapier, webhook and REST API automation for lead, sales, support and reporting.",
    },
  },
  {
    id: "hosting-infrastructure",
    order: 10,
    slug: "hosting-infrastructure",
    name: { bn: "Hosting & Digital Infrastructure", en: "Hosting & Digital Infrastructure" },
    headline: { bn: "Nexus Host — Your Digital Base", en: "Nexus Host — your digital base" },
    summary: {
      bn: "Domain, Shared/Business/Reseller/White-label/Managed Hosting, WordPress Hosting, Business Email, Migration, Backup ও Security।",
      en: "Domain, shared/business/reseller/white-label/managed hosting, WordPress hosting, business email, migration, backup and security.",
    },
    layer: "growth",
    icon: "server",
    capabilities: {
      bn: ["Domain", "Shared Hosting", "Business Hosting", "Reseller Hosting", "White Label", "Managed Hosting", "Business Email", "Migration", "Backup & Security"],
      en: ["Domain", "Shared hosting", "Business hosting", "Reseller hosting", "White label", "Managed hosting", "Business email", "Migration", "Backup & security"],
    },
    deliverables: {
      bn: ["Live Hosting", "SSL", "Backup Setup", "Migration (প্রযোজ্য হলে)"],
      en: ["Live hosting", "SSL", "Backup setup", "Migration (where applicable)"],
    },
    bestFor: { bn: "যে ব্যবসা Website থেকে শুরু করে পুরো Digital Base চায়।", en: "Businesses that want a complete digital base starting from the website." },
    outcomes: {
      bn: ["একজায়গায় Hosting ও Support", "Free SSL ও Backup", "Growth-এর সাথে Plan বদলানো সহজ"],
      en: ["Hosting and support in one place", "Free SSL and backup", "Easy plan changes as you grow"],
    },
    productSlugs: [],
    seoTitle: { bn: "Nexus Host — Hosting & Digital Infrastructure | Nexus Lift", en: "Nexus Host — Hosting & Digital Infrastructure | Nexus Lift" },
    seoDescription: {
      bn: "Domain, Shared/Business/Reseller/Managed Hosting, Business Email, Migration এবং Backup — Nexus Host।",
      en: "Domain, shared/business/reseller/managed hosting, business email, migration and backup — Nexus Host.",
    },
  },
  {
    id: "custom-technology",
    order: 11,
    slug: "custom-technology",
    name: { bn: "Custom Technology", en: "Custom Technology" },
    headline: { bn: "যখন Readymade যথেষ্ট নয়", en: "When ready-made is not enough" },
    summary: {
      bn: "Custom Web Application, Internal Business Tool, Client/Employee Portal, SaaS MVP এবং AI SaaS System।",
      en: "Custom web applications, internal business tools, client/employee portals, SaaS MVPs and AI SaaS systems.",
    },
    layer: "control",
    icon: "code",
    capabilities: {
      bn: ["Custom Web Application", "Internal Business Tool", "Client Portal", "Employee Portal", "SaaS MVP", "AI SaaS"],
      en: ["Custom web application", "Internal business tool", "Client portal", "Employee portal", "SaaS MVP", "AI SaaS"],
    },
    deliverables: {
      bn: ["Custom Application", "Role-based Access", "Documentation", "Training"],
      en: ["Custom application", "Role-based access", "Documentation", "Training"],
    },
    bestFor: { bn: "যাদের প্রক্রিয়া কোনো Readymade Tool-এ মেলে না।", en: "Businesses whose process fits no ready-made tool." },
    outcomes: {
      bn: ["প্রক্রিয়ার সাথে মেলে এমন সিস্টেম", "একাধিক Tool-এর ঝামেলা কমে", "Scale করার ভিত্তি তৈরি হয়"],
      en: ["A system that matches the process", "Less tool sprawl", "A foundation for scale"],
    },
    productSlugs: ["custom-portal-application"],
    seoTitle: { bn: "Custom Technology & Software Development | Nexus Lift", en: "Custom Technology & Software Development | Nexus Lift" },
    seoDescription: {
      bn: "Custom Web Application, Internal Business Tool, Portal এবং SaaS MVP Development — Nexus Lift Custom Technology সেবা।",
      en: "Custom web applications, internal business tools, portals and SaaS MVP development — Nexus Lift custom technology services.",
    },
  },
];

export function getSolutionCategory(slug: string): SolutionCategory | undefined {
  return solutionCategories.find((category) => category.slug === slug);
}

export function getSolutionCategoryById(id: string): SolutionCategory | undefined {
  return solutionCategories.find((category) => category.id === id);
}
