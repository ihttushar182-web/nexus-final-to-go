import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { insights, insightCategories } from "@/data/insights";
import { t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { InsightCard } from "@/components/insights/InsightCard";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "Insights — Business Systems, Operations ও Growth",
  description:
    "Business Systems, Brand, Operations, Growth, CRM, Automation, AI, SEO এবং Hosting নিয়ে Nexus Lift-এর লেখা ও গবেষণা।",
  alternates: { canonical: "/insights" },
};

export default async function InsightsPage() {
  const locale = await getLocale();
  const featured = insights.filter((article) => article.featured);
  const rest = insights.filter((article) => !article.featured);

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Content / Insights" : "Content / insights"}
        title={locale === "bn" ? "Business Systems, Operations ও Growth নিয়ে লেখা" : "Writing on business systems, operations and growth"}
        intro={
          locale === "bn"
            ? "আমরা যা শিখি, তা লিখে রাখি — কোনো ফাঁপা দাবি নয়, প্রথম-হাত পর্যবেক্ষণ এবং প্রতিটি সংখ্যার সূত্র উল্লেখ করে।"
            : "We write down what we learn — first-hand observations rather than hollow claims, with the source of every number stated."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Insights" }]}
      />

      <Section tone="white">
        <SectionHeader eyebrow={locale === "bn" ? "Featured" : "Featured"} title={locale === "bn" ? "সাম্প্রতিক লেখা" : "Recent writing"} />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((article) => (
            <InsightCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      </Section>

      {rest.length ? (
        <Section tone="mist">
          <SectionHeader eyebrow={locale === "bn" ? "More" : "More"} title={locale === "bn" ? "আরও লেখা" : "More articles"} />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((article) => (
              <InsightCard key={article.slug} article={article} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Categories" : "Categories"}
          title={locale === "bn" ? "বিষয় অনুযায়ী" : "By topic"}
          description={
            locale === "bn"
              ? "প্রতিটি লেখা একটি নির্দিষ্ট Layer বা সমস্যার সাথে যুক্ত — যাতে আপনি আপনার প্রয়োজন অনুযায়ী পড়তে পারেন।"
              : "Every article maps to a specific layer or problem so you can read what is relevant to you."
          }
        />
        <div className="mt-6 flex flex-wrap gap-2">
          {insightCategories.map((category) => {
            const count = insights.filter((article) => article.category === category.id).length;
            return (
              <Badge key={category.id} tone={count ? "neutral" : "brand"} size="sm">
                {t(category.label, locale)} {count ? `· ${count}` : ""}
              </Badge>
            );
          })}
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Insights", url: absoluteUrl("/insights") },
        ]}
      />
    </>
  );
}
