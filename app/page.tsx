import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { HomePageSections } from "@/components/home/HomePageSections";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { JsonLd } from "@/components/seo/OrganizationSchema";
import { faqItems } from "@/data/faq";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Business Chaos থেকে Systematic Growth | ${siteConfig.brandName}`,
  description:
    "Nexus Lift helps Bangladeshi businesses identify bottlenecks and build connected business systems — brand, structure, operations, growth, intelligence and control. Start with a free business audit.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Business Chaos থেকে Systematic Growth | Nexus Lift",
    description:
      "Free business audit, SOP systems, CRM, Business OS dashboards and automation for Bangladeshi businesses — from diagnosis to a connected operating system.",
    url: "/",
  },
};

export default async function HomePage() {
  const locale = await getLocale();

  const homeFaqs = faqItems.filter((item) =>
    ["target-audience", "audit-free", "payment-methods", "timeline", "profile-self-update", "messenger-order"].includes(item.id),
  );

  return (
    <>
      <AnalyticsProvider />
      <HomePageSections locale={locale} />
      <JsonLd
        id="home-faq-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map((item) => ({
            "@type": "Question",
            name: item.question[locale],
            acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
          })),
        }}
      />
    </>
  );
}
