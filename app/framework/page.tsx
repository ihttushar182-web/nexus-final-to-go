import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { businessLayers, growthMethodology, maturityLadder } from "@/data/layers";
import { solutionCategories } from "@/data/solutions";
import { t } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { LayerCard, LayerFlow } from "@/components/framework/LayerCard";
import { ProcessTimeline } from "@/components/ui/Timeline";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/StateMessage";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Framework — ৬টি Connected Business Layers",
  description:
    "Identity → Structure → Operations → Growth → Intelligence → Control: Nexus Lift ব্যবসাকে ছয়টি connected layer-এ দেখে এবং Problem → Diagnosis → Strategy → System → Implementation → Growth পদ্ধতিতে কাজ করে।",
  alternates: { canonical: "/framework" },
};

export default async function FrameworkPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Our Framework" : "Our framework"}
        title={
          locale === "bn"
            ? "Business একটি Building-এর মতো — ভিত্তি ছাড়া দাঁড়ায় না"
            : "A business is like a building — it does not stand without foundations"
        }
        intro={
          locale === "bn"
            ? "Nexus Lift business-কে ৬টি connected layer-এ দেখে। একটি Layer ঠিক করলে অন্যগুলোও Improve হয়, কারণ Control Layer শেখাটা সিস্টেমে ফিরিয়ে দেয়।"
            : "Nexus Lift views a business as six connected layers. Fixing one layer improves the others, because the control layer feeds learning back into the system."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Framework" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/business-audit" size="lg">
            {locale === "bn" ? "আপনার Business Audit করুন" : "Audit your business"}
          </ButtonLink>
          <ButtonLink href="/solutions" variant="outline" size="lg">
            {locale === "bn" ? "Solutions দেখুন" : "Explore solutions"}
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white">
        <LayerFlow locale={locale} />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businessLayers.map((layer) => (
            <LayerCard key={layer.id} layer={layer} locale={locale} />
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow="Methodology"
          title={locale === "bn" ? "আমাদের Methodology" : "Our methodology"}
          description={
            locale === "bn"
              ? "আমরা Pre-determined Service বিক্রি করি না। আমরা Bottleneck বুঝে Solution তৈরি করি — তাই প্রতিটি কাজ শুরু হয় Diagnosis দিয়ে।"
              : "We do not sell pre-determined services. We understand the bottleneck and build the solution, so every engagement starts with a diagnosis."
          }
        />
        <ProcessTimeline
          className="mt-8"
          steps={growthMethodology.map((step) => ({
            code: step.step,
            title: t(step.name, locale),
            description: (
              <>
                <span className="block">{t(step.question, locale)}</span>
                <span className="mt-1.5 block text-xs font-medium uppercase tracking-wide text-nexus">{t(step.output, locale)}</span>
              </>
            ),
          }))}
        />
        <Alert tone="info" className="mt-6">
          {locale === "bn"
            ? "Find the bottleneck. Build the system. Make it work. Improve what matters."
            : "Find the bottleneck. Build the system. Make it work. Improve what matters."}
        </Alert>
      </Section>

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Maturity Ladder" : "Maturity ladder"}
          title={locale === "bn" ? "একটি ব্যবসা সাধারণত যে ধাপগুলো পার হয়" : "The stages a business typically moves through"}
          description={
            locale === "bn"
              ? "এটি একটি Commercial Read — প্রতিটি ধাপে সাধারণত যে ধরনের কাজ দরকার সেটি বোঝানোর জন্য। আপনার Business যে ধাপেই থাকুক, একসাথে সব করতে হবে না।"
              : "A commercial read of what each stage usually needs. Wherever your business is, you do not have to do everything at once."
          }
        />
        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {maturityLadder.map((step) => (
            <li key={step.level} className="surface p-4">
              <div className="flex items-center gap-2">
                <Badge tone="brand" size="sm">Level {step.level}</Badge>
                <p className="font-semibold text-navy">{t(step.name, locale)}</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{t(step.focus, locale)}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow={locale === "bn" ? "Layer → Service" : "Layer → service"}
          title={locale === "bn" ? "প্রতিটি Layer-এর জন্য আমাদের সেবা" : "Our services for each layer"}
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {businessLayers.map((layer) => (
            <div key={layer.id} className="surface p-5">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-navy font-display text-xs font-semibold text-white tabular-nums">
                  {layer.code}
                </span>
                <h3 className="text-base">{t(layer.name, locale)}</h3>
              </div>
              <ul className="mt-3.5 grid gap-2">
                {solutionCategories
                  .filter((category) => category.layer === layer.id)
                  .map((category) => (
                    <li key={category.id}>
                      <a href={`/solutions/${category.slug}`} className="text-sm font-medium text-nexus hover:underline">
                        {t(category.name, locale)} →
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Framework", url: absoluteUrl("/framework") },
        ]}
      />
    </>
  );
}
