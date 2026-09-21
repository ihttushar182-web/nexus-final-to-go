import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import {
  capabilities,
  capabilityFamilies,
  capabilityPositioning,
  capabilityStats,
  getCapabilitiesByFamily,
  technologyStack,
} from "@/data/capabilities";
import { businessLayers } from "@/data/layers";
import { t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { CapabilityCard } from "@/components/capabilities/CapabilityCard";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckList } from "@/components/ui/Timeline";
import { Alert } from "@/components/ui/StateMessage";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import { JsonLd } from "@/components/seo/OrganizationSchema";

export const metadata: Metadata = {
  title: "Capabilities — AI Systems, Automation, CRM ও Custom Software",
  description:
    "আমরা প্রযুক্তি বিক্রি করি না — সিস্টেম ও ফলাফল দিই। AI Automation, Agents, n8n Automation, Custom CRM, Dashboard, Website এবং Custom Software — ২৩টি Product Line, ৬টি সিস্টেম ফ্যামিলিতে।",
  alternates: { canonical: "/capabilities" },
  openGraph: {
    title: "Capabilities | Nexus Lift",
    description:
      "AI systems, automation, CRM, dashboards, websites and custom software — delivered as outcomes, not as a technology list.",
    url: "/capabilities",
  },
};

export default async function CapabilitiesPage() {
  const locale = await getLocale();
  const stats = capabilityStats();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Capabilities" : "Capabilities"}
        title={t(capabilityPositioning.principle, locale)}
        intro={t(capabilityPositioning.explanation, locale)}
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Capabilities" }]}
      >
        {/* The combined strength, stated as the business describes it. */}
        <div className="flex flex-wrap gap-2">
          {capabilityPositioning.combination.map((item) => (
            <Badge key={item.en} tone="dark" className="border-white/20 bg-white/10 text-white">
              {t(item, locale)}
            </Badge>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/business-audit" size="lg">
            {locale === "bn" ? "কোন সিস্টেম আগে দরকার জানুন" : "Find out which system you need first"}
          </ButtonLink>
          <WhatsAppButton
            locale={locale}
            ctaLocation="capabilities_hero"
            page="/capabilities"
            variant="outline"
            size="lg"
            intent={
              locale === "bn"
                ? "আমার ব্যবসার জন্য কোন সিস্টেম দরকার জানতে চাই।"
                : "I would like to know which system my business needs."
            }
          />
        </div>
      </PageHero>

      {/* Honest summary numbers — computed from the data, never hand-typed. */}
      <Section tone="white" size="compact">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              value: stats.lines,
              label: { bn: "Product Line", en: "product lines" },
              note: { bn: "২৩টি নির্দিষ্ট সেবা-লাইন", en: "clearly defined service lines" },
            },
            {
              value: stats.families,
              label: { bn: "System Family", en: "system families" },
              note: { bn: "AI · Automation · CRM · Web · Data · Platform", en: "AI · automation · CRM · web · data · platform" },
            },
            {
              value: stats.declared,
              label: { bn: "নির্দিষ্ট সামর্থ্য", en: "specific capabilities" },
              note: { bn: "প্রতিটির নির্দিষ্ট জায়গা আছে", en: "each one mapped to a line" },
            },
            {
              value: stats.technologies,
              label: { bn: "নির্মাণ সরঞ্জাম", en: "build tools" },
              note: { bn: "উপায়, লক্ষ্য নয়", en: "the how, never the goal" },
            },
          ].map((item) => (
            <div key={item.label.en} className="surface p-5">
              <p className="font-display text-3xl font-semibold text-navy tabular-nums">{item.value}</p>
              <p className="mt-1 text-sm font-semibold text-navy">{t(item.label, locale)}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{t(item.note, locale)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Families → capabilities */}
      {capabilityFamilies.map((family, index) => {
        const items = getCapabilitiesByFamily(family.id);
        if (items.length === 0) return null;
        return (
          <Section key={family.id} tone={index % 2 === 0 ? "mist" : "white"} id={family.id}>
            <SectionHeader
              eyebrow={locale === "bn" ? `সিস্টেম ${family.order}` : `System ${family.order}`}
              title={t(family.name, locale)}
              description={t(family.summary, locale)}
            />
            <p className="mt-4 max-w-3xl border-l-2 border-accent pl-4 text-[0.95rem] font-medium leading-relaxed text-navy">
              {t(family.outcome, locale)}
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((capability) => (
                <CapabilityCard key={capability.id} capability={capability} locale={locale} />
              ))}
            </div>
          </Section>
        );
      })}

      {/* How we choose what to build — the framework link that keeps this from being a menu. */}
      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "কীভাবে বেছে নেওয়া হয়" : "How we decide what to build"}
              title={locale === "bn" ? "সেবা নয়, ক্রম" : "A sequence, not a menu"}
              description={
                locale === "bn"
                  ? "২৩টি লাইন মানে এই নয় যে আপনাকে ২৩টি কিনতে হবে। প্রথমে ডায়াগনোসিস — কোন ধাপটি ব্যবসা আটকে রেখেছে, সেটি ঠিক করা হয়। বাকি লাইন তখনই আসে যখন সেগুলো সত্যিই প্রয়োজন।"
                  : "Twenty-three lines do not mean twenty-three purchases. The diagnosis comes first, and the step that is actually holding the business back gets fixed. The rest only appears when it is genuinely needed."
              }
              tone="dark"
            />
            <div className="mt-6">
              <CheckList
                tone="dark"
                columns={1}
                items={[
                  locale === "bn" ? "Free Business Audit — কোন Layer সবচেয়ে দুর্বল তা দেখা হয়" : "Free business audit — find the weakest layer",
                  locale === "bn" ? "প্রথমে সেই ধাপের সিস্টেম, তারপর অন্য কিছু" : "Fix that step first, then look further",
                  locale === "bn" ? "প্রতিটি কাজ একবারে একটি সিস্টেম হিসাবে শেষ হয়" : "Each piece is finished as a complete system",
                  locale === "bn" ? "যেটি এখন প্রয়োজন নেই, সেটি বিক্রি করা হয় না" : "We do not sell what is not needed yet",
                ]}
              />
            </div>
            <div className="mt-7">
              <ButtonLink href="/framework" variant="outline" className="border-white/25 text-white hover:border-white/50">
                {locale === "bn" ? "৬টি Layer দেখুন" : "See the six layers"}
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                {locale === "bn" ? "প্রতিটি লাইন কোন Layer ছোঁয়" : "Which layer each line moves"}
              </p>
              <ul className="mt-4 grid gap-2.5">
                {businessLayers.map((layer) => {
                  const count = capabilities.filter((item) => item.layers.includes(layer.id)).length;
                  return (
                    <li key={layer.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-navy/40 px-3.5 py-2.5">
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">
                          {layer.code} · {t(layer.name, locale)}
                        </span>
                        <span className="block truncate text-xs text-slate-400">{t(layer.question, locale)}</span>
                      </span>
                      <span className="shrink-0 font-display text-sm font-semibold text-accent tabular-nums">
                        {count}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                {locale === "bn"
                  ? "সংখ্যা বোঝায় কোন Layer-এ আমরা কতগুলো সেবা-লাইন দিতে পারি।"
                  : "The number shows how many service lines we can deliver against that layer."}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Technology — explicitly subordinate. */}
      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Construction" : "Under the hood"}
          title={locale === "bn" ? "কী দিয়ে বানানো হয়" : "What it is built with"}
          description={
            locale === "bn"
              ? "এগুলো উপায় — লক্ষ্য নয়। আপনি কোন সরঞ্জাম চান বলে নয়, কোন সমস্যা সমাধান হবে সেটি আগে ঠিক করা হয়। তবে কাজটি কী দিয়ে হচ্ছে তা জানার অধিকার আপনার আছে।"
              : "These are the means, not the goal. What gets decided first is the problem to solve, not the tool to use. You still have every right to know what the work runs on."
          }
        />
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {technologyStack.map((tech) => (
            <div key={tech.id} className="flex items-start gap-3 rounded-lg border border-line bg-mist/50 p-3.5">
              <span className="mt-0.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>
                <span className="block text-sm font-semibold text-navy">{tech.name}</span>
                <span className="block text-xs text-slate-500">{t(tech.role, locale)}</span>
              </span>
            </div>
          ))}
        </div>
        <Alert tone="info" className="mt-6">
          {t(capabilityPositioning.outcomeNote, locale)}
        </Alert>
      </Section>

      {/* CTA */}
      <Section tone="mist">
        <div className="surface p-6 sm:p-8">
          <SectionHeader
            eyebrow={locale === "bn" ? "পরের ধাপ" : "Next step"}
            title={
              locale === "bn"
                ? "কোন সিস্টেম আগে দরকার — ৫ মিনিটে জানুন"
                : "See which system you need first, in five minutes"
            }
            description={
              locale === "bn"
                ? "Free Business Audit আপনার ৬টি Layer-এর অবস্থা দেখায় এবং কোন ধাপটি প্রথমে ঠিক করা উচিত তা বলে দেয়। এরপর আমরা সৎভাবে বলি কোন সেবা-লাইন আপনার জন্য প্রযোজ্য আর কোনটি এখন নয়।"
                : "The free business audit shows where your six layers stand and which step should be fixed first. Then we tell you honestly which service lines apply to you — and which do not, yet."
            }
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/business-audit" size="lg">
              {locale === "bn" ? "Free Business Audit শুরু করুন" : "Start the free business audit"}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              {locale === "bn" ? "কথা বলুন" : "Talk to us"}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Capabilities", url: absoluteUrl("/capabilities") },
        ]}
      />
      <JsonLd
        id="capabilities-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Nexus Lift system capabilities",
          itemListElement: capabilities.map((capability, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Service",
              name: capability.name.en,
              description: capability.outcome.en,
              serviceType: capability.name.en,
              provider: { "@type": "Organization", name: "Nexus Lift" },
              areaServed: "Bangladesh",
            },
          })),
        }}
      />
    </>
  );
}
