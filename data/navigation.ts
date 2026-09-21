import type { LocalizedText } from "@/types";

export interface NavItem {
  href: string;
  label: LocalizedText;
  description?: LocalizedText;
  children?: NavItem[];
}

/**
 * Primary navigation.
 * Kept intentionally short (Build Spec §20: "Do not create dozens of unnecessary pages initially").
 */
export const primaryNav: NavItem[] = [
  {
    href: "/capabilities",
    label: { bn: "Capabilities", en: "Capabilities" },
    description: {
      bn: "আমরা কী কী সিস্টেম বানাতে পারি — ফলাফল দিয়ে সাজানো",
      en: "Every system we can build, organised by the outcome it produces",
    },
  },
  {
    href: "/solutions",
    label: { bn: "Solutions", en: "Solutions" },
    description: {
      bn: "১১টি solution category — Identity থেকে Custom Technology",
      en: "Eleven solution categories from Identity to Custom Technology",
    },
  },
  {
    href: "/products",
    label: { bn: "Products", en: "Products" },
    description: {
      bn: "নির্দিষ্ট scope, নির্দিষ্ট দাম — অর্ডার করার জন্য প্রস্তুত",
      en: "Defined scope, defined price — ready to order",
    },
  },
  {
    href: "/framework",
    label: { bn: "Framework", en: "Framework" },
    description: {
      bn: "৬টি Connected Business Layers এবং আমাদের Methodology",
      en: "The 6 Connected Business Layers and our methodology",
    },
  },
  {
    href: "/nexus-host",
    label: { bn: "Nexus Host", en: "Nexus Host" },
    description: {
      bn: "Domain, Hosting, Business Email ও Digital Infrastructure",
      en: "Domain, hosting, business email and digital infrastructure",
    },
  },
  {
    href: "/insights",
    label: { bn: "Insights", en: "Insights" },
    description: {
      bn: "Business Systems, Operations এবং Growth নিয়ে লেখা",
      en: "Writing on business systems, operations and growth",
    },
  },
];

export const footerNav: { title: LocalizedText; items: NavItem[] }[] = [
  {
    title: { bn: "Company", en: "Company" },
    items: [
      { href: "/about", label: { bn: "About Us", en: "About Us" } },
      { href: "/framework", label: { bn: "Our Framework", en: "Our Framework" } },
      { href: "/case-studies", label: { bn: "Case Studies", en: "Case Studies" } },
      { href: "/contact", label: { bn: "Contact", en: "Contact" } },
    ],
  },
  {
    title: { bn: "Capabilities", en: "Capabilities" },
    items: [
      { href: "/capabilities", label: { bn: "All Capabilities", en: "All Capabilities" } },
      { href: "/capabilities#ai-systems", label: { bn: "AI Systems", en: "AI Systems" } },
      { href: "/capabilities#automation-integration", label: { bn: "Automation & Integration", en: "Automation & Integration" } },
      { href: "/capabilities#customer-revenue", label: { bn: "Customer & Revenue Systems", en: "Customer & Revenue Systems" } },
      { href: "/capabilities#data-control", label: { bn: "Dashboards & Control", en: "Dashboards & Control" } },
      { href: "/capabilities#platforms", label: { bn: "Platforms & Portals", en: "Platforms & Portals" } },
    ],
  },
  {
    title: { bn: "Solutions", en: "Solutions" },
    items: [
      { href: "/solutions/sop-operations", label: { bn: "SOP & Operations", en: "SOP & Operations" } },
      { href: "/solutions/crm-customer-systems", label: { bn: "CRM & Customer Systems", en: "CRM & Customer Systems" } },
      { href: "/solutions/business-os-dashboards", label: { bn: "Business OS & Dashboards", en: "Business OS & Dashboards" } },
      { href: "/solutions/ai-agents-assistants", label: { bn: "AI Agents & Assistants", en: "AI Agents & Assistants" } },
      { href: "/solutions/automation-integrations", label: { bn: "Automation & Integrations", en: "Automation & Integrations" } },
    ],
  },
  {
    title: { bn: "Products", en: "Products" },
    items: [
      { href: "/products", label: { bn: "All Products", en: "All Products" } },
      { href: "/products/professional-business-starter", label: { bn: "Business Profile — Starter", en: "Business Profile — Starter" } },
      { href: "/products/professional-business-growth", label: { bn: "Business Profile — Growth", en: "Business Profile — Growth" } },
      { href: "/products/professional-business-premium", label: { bn: "Business Profile — Premium", en: "Business Profile — Premium" } },
      { href: "/nexus-host", label: { bn: "Nexus Host", en: "Nexus Host" } },
    ],
  },
  {
    title: { bn: "Resources", en: "Resources" },
    items: [
      { href: "/business-audit", label: { bn: "Free Business Audit", en: "Free Business Audit" } },
      { href: "/book-call", label: { bn: "Book Strategy Call", en: "Book Strategy Call" } },
      { href: "/resources/sme-maturity-report", label: { bn: "SME Maturity Report 2026", en: "SME Maturity Report 2026" } },
      { href: "/insights", label: { bn: "Insights", en: "Insights" } },
      { href: "/faq", label: { bn: "FAQ", en: "FAQ" } },
    ],
  },
];

export const legalNav: NavItem[] = [
  { href: "/privacy", label: { bn: "Privacy Policy", en: "Privacy Policy" } },
  { href: "/terms", label: { bn: "Terms of Service", en: "Terms of Service" } },
  { href: "/refund-policy", label: { bn: "Refund & Revision Policy", en: "Refund & Revision Policy" } },
];

/** Routes intentionally reserved for the future customer portal (Build Spec §51). */
export const futureRoutes = [
  { href: "/login", label: { bn: "Customer Login", en: "Customer Login" } },
  { href: "/dashboard", label: { bn: "Dashboard", en: "Dashboard" } },
  { href: "/account", label: { bn: "Account", en: "Account" } },
];
