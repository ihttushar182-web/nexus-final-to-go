import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { SearchClient } from "@/components/search/SearchClient";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Search — Products, Solutions, Insights ও FAQ",
  description: "Nexus Lift সাইটে খুঁজুন — Products, Solutions, Insights, Case Studies এবং FAQ একসাথে।",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Search" : "Search"}
        title={locale === "bn" ? "সাইটে খুঁজুন" : "Search the site"}
        intro={
          locale === "bn"
            ? "Products, Solutions, Insights, Case Studies এবং FAQ — সব একসাথে খোঁজা হয়।"
            : "Products, solutions, insights, case studies and FAQs are searched together."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Search" }]}
      />
      <Section tone="white">
        <div className="max-w-3xl">
          <SearchClient locale={locale} />
        </div>
      </Section>
    </>
  );
}
