import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "@/lib/i18n/server";
import { solutionCategories } from "@/data/solutions";
import { businessLayers } from "@/data/layers";
import { t } from "@/lib/utils";
import { Section, SectionHeader, Grid } from "@/components/ui/Section";
import { SolutionCard } from "@/components/solutions/SolutionCard";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { LayerFlow } from "@/components/framework/LayerCard";
import { Alert } from "@/components/ui/StateMessage";
import { ButtonLink } from "@/components/ui/Button";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Solutions — ১১টি Business Solution Category",
  description:
    "Brand & Identity, Business Structure, SOP & Operations, Website & Conversion, CRM, Marketing Infrastructure, Business OS, AI Agents, Automation, Hosting এবং Custom Technology।",
  alternates: { canonical: "/solutions" },
};

export default async function SolutionsPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Solutions" : "Solutions"}
        title={
          locale === "bn"
            ? "১১টি Solution Category, ৬টি Connected Layer-এ সাজানো"
            : "Eleven solution categories, arranged across six connected layers"
        }
        intro={
          locale === "bn"
            ? "Nexus Lift Service বিক্রি করে না — Bottleneck বুঝে Solution তৈরি করে। তাই প্রতিটি Solution একটি Layer-এর সাথে যুক্ত, এবং কোনটি আগে দরকার তা ঠিক হয় আপনার Audit থেকে।"
            : "Nexus Lift does not sell services — it solves bottlenecks. Every solution maps to a layer, and the order of work is decided by your audit."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Solutions" }]}
      >
        <LayerFlow locale={locale} />
      </PageHero>

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "সব Vulnerability" : "All categories"}
          title={locale === "bn" ? "আপনার প্রয়োজন অনুযায়ী বেছে নিন" : "Choose by what you need"}
          description={
            locale === "bn"
              ? "আমরা সবকিছু একসাথে করার পরামর্শ দিই না। একটি Layer ঠিক করলে অন্যগুলোও improve হয়, তাই ক্রম গুরুত্বপূর্ণ।"
              : "We do not recommend doing everything at once. Fixing one layer improves the others, so sequence matters."
          }
        />
        <Grid cols={3}>
          {solutionCategories.map((category) => (
            <SolutionCard key={category.id} category={category} locale={locale} />
          ))}
        </Grid>
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow="Framework"
          title={locale === "bn" ? "কোন Solution কোন Layer-এ" : "Which solution belongs to which layer"}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {businessLayers.map((layer) => {
            const items = solutionCategories.filter((category) => category.layer === layer.id);
            return (
              <div key={layer.id} id={layer.id} className="surface p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-lg bg-navy font-display text-xs font-semibold text-white tabular-nums">
                    {layer.code}
                  </span>
                  <h3 className="text-base">{t(layer.name, locale)}</h3>
                </div>
                <p className="mt-2.5 text-sm text-slate-600">{t(layer.question, locale)}</p>
                <ul className="mt-3.5 grid gap-2">
                  {items.length ? (
                    items.map((category) => (
                      <li key={category.id}>
                        <Link href={`/solutions/${category.slug}`} className="text-sm font-medium text-nexus hover:underline">
                          {t(category.name, locale)} →
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-500">
                      {locale === "bn"
                        ? "এই Layer-এর জন্য পণ্য প্রস্তুত হচ্ছে — Custom Quote-এর জন্য যোগাযোগ করুন।"
                        : "Products for this layer are being prepared — contact us for a custom quote."}
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="white">
        <Alert tone="info" title={locale === "bn" ? "কোথা থেকে শুরু করবেন?" : "Where to start"}>
          {locale === "bn"
            ? "Free Business Audit করুন — ৬টি Layer-এর মধ্যে কোনটি সবচেয়ে দুর্বল সেটি জানুন, তারপর সেই একটির উপর কাজ করুন।"
            : "Run the free business audit to see which of your six layers is weakest, then work on that one."}
        </Alert>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/business-audit" size="lg">
            {locale === "bn" ? "Free Business Audit" : "Free business audit"}
          </ButtonLink>
          <ButtonLink href="/framework" variant="outline" size="lg">
            {locale === "bn" ? "Framework দেখুন" : "Explore the framework"}
          </ButtonLink>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Solutions", url: absoluteUrl("/solutions") },
        ]}
      />
    </>
  );
}
