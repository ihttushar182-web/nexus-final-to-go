import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { businessLayers } from "@/data/layers";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/utils";
import { capabilityPositioning } from "@/data/capabilities";
import { Badge } from "@/components/ui/Badge";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { CheckList } from "@/components/ui/Timeline";
import { ButtonLink } from "@/components/ui/Button";
import { LayerFlow } from "@/components/framework/LayerCard";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Nexus Lift — Connecting Sources, Lifting Business",
  description:
    "Nexus Lift হলো একটি Business Systems & Growth Infrastructure প্রতিষ্ঠান — Brand, Structure, Operations, Growth, Intelligence এবং Control একসাথে যুক্ত করে একটি connected business system তৈরি করা।",
  alternates: { canonical: "/about" },
};

const observations = [
  { bn: "Brand আছে, কিন্তু Positioning নেই।", en: "A brand exists, but without positioning." },
  { bn: "Website আছে, কিন্তু Conversion নেই।", en: "A website exists, but without conversion." },
  { bn: "Team আছে, কিন্তু Structure নেই।", en: "A team exists, but without structure." },
  { bn: "Sales আছে, কিন্তু Process নেই।", en: "Sales exist, but without process." },
  { bn: "Data আছে, কিন্তু Intelligence নেই।", en: "Data exists, but without intelligence." },
];

const comparison = [
  { traditional: { bn: "শুধু Logo/Branding দেয়", en: "Only delivers logo/branding" }, nexus: { bn: "Brand + Positioning + Strategy দেয়", en: "Brand + positioning + strategy" } },
  { traditional: { bn: "শুধু Website বানায়", en: "Only builds a website" }, nexus: { bn: "Website + Conversion + SEO System দেয়", en: "Website + conversion + SEO system" } },
  { traditional: { bn: "শুধু Automation সেটআপ করে", en: "Only sets up automation" }, nexus: { bn: "Process + Automation + Integration দেয়", en: "Process + automation + integration" } },
  { traditional: { bn: "Service বিক্রি করে", en: "Sells services" }, nexus: { bn: "Solution & Infrastructure তৈরি করে", en: "Builds solutions and infrastructure" } },
  { traditional: { bn: "বিচ্ছিন্ন কাজ করে", en: "Works in disconnected pieces" }, nexus: { bn: "Connected Business System তৈরি করে", en: "Builds a connected business system" } },
];

const values = [
  {
    title: { bn: "Connection (Nexus)", en: "Connection (Nexus)" },
    body: { bn: "বিচ্ছিন্ন অংশগুলোকে যুক্ত করি — কারণ একটি Layer একা কাজ করলে পুরো সিস্টেম দুর্বল থাকে।", en: "We connect parts that were built separately — a layer working alone leaves the whole system weak." },
  },
  {
    title: { bn: "Clarity (Clear)", en: "Clarity (Clear)" },
    body: { bn: "জটিলতা দূর করে পরিষ্কার করি — Scope, দাম, timeline এবং দায়িত্ব স্পষ্টভাবে লেখা থাকে।", en: "We remove complexity and make things clear — scope, price, timeline and responsibility are all written down." },
  },
  {
    title: { bn: "Control (Measure)", en: "Control (Measure)" },
    body: { bn: "অন্ধকারে না থেকে Data দেখে সিদ্ধান্ত — কারণ অনুমান দিয়ে নেওয়া সিদ্ধান্ত ব্যয়বহুল।", en: "Decide from data instead of the dark — assumptions-based decisions are expensive." },
  },
  {
    title: { bn: "Growth (Lift)", en: "Growth (Lift)" },
    body: { bn: "স্থির অবস্থান থেকে এগিয়ে যাওয়া — তবে আগে ভিত্তি, তারপর গতি।", en: "Move forward from a standing position — foundations first, then speed." },
  },
];

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={siteConfig.tagline.bn}
        title={locale === "bn" ? "আমরা শুধু Service দিই না। আমরা আপনার Business-এর Infrastructure তৈরি করি।" : "We do not only deliver services. We build your business infrastructure."}
        intro={
          locale === "bn"
            ? "Nexus Lift helps businesses identify bottlenecks, build connected business systems and create the digital infrastructure needed to operate, grow and improve."
            : "Nexus Lift helps businesses identify bottlenecks, build connected business systems and create the digital infrastructure needed to operate, grow and improve."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "About" }]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/framework" size="lg">
            {locale === "bn" ? "Our Framework দেখুন" : "Explore our framework"}
          </ButtonLink>
          <ButtonLink href="/business-audit" variant="outline" size="lg">
            {locale === "bn" ? "Free Business Audit" : "Free business audit"}
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "Our Story" : "Our story"}
              title={locale === "bn" ? "কেন Nexus Lift তৈরি হলো?" : "Why Nexus Lift was created"}
            />
            <div className="mt-5 grid gap-3 text-[0.98rem] leading-relaxed text-slate-600">
              <p>
                {locale === "bn"
                  ? "বাংলাদেশে হাজার হাজার Business আছে। কিন্তু অধিকাংশ Business-এর System নেই।"
                  : "Bangladesh has thousands of businesses. But most of them do not have a system."}
              </p>
              <p>{locale === "bn" ? "আমরা দেখেছি:" : "We kept seeing the same pattern:"}</p>
              <ul className="grid gap-2">
                {observations.map((item) => (
                  <li key={item.en} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span aria-hidden className="mt-0.5 text-accent">→</span>
                    {item[locale]}
                  </li>
                ))}
              </ul>
              <p className="font-medium text-navy">
                {locale === "bn" ? "ফলাফল? Business চলছে, কিন্তু Systematically চলছে না।" : "The result? The business runs — but not systematically."}
              </p>
              <p>
                {locale === "bn"
                  ? "Nexus Lift এই Gap টি পূরণ করতে তৈরি হয়েছে — বিচ্ছিন্ন সেবার বদলে একটি connected business system দিতে।"
                  : "Nexus Lift was created to close that gap — replacing disconnected services with one connected business system."}
              </p>
            </div>
          </div>

          <div>
            <SectionHeader eyebrow={locale === "bn" ? "Positioning" : "Positioning"} title={locale === "bn" ? "আমরা কী এবং কী নই" : "What we are and what we are not"} />
            <div className="mt-5 grid gap-3">
              <div className="surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{locale === "bn" ? "আমরা নই" : "We are not"}</p>
                <ul className="mt-2 grid gap-1.5 text-sm text-slate-600">
                  <li>{locale === "bn" ? "শুধু Logo/Branding স্টুডিও" : "Only a logo/branding studio"}</li>
                  <li>{locale === "bn" ? "শুধু Website এজেন্সি" : "Only a website agency"}</li>
                  <li>{locale === "bn" ? "শুধু Automation এজেন্সি" : "Only an automation agency"}</li>
                  <li>{locale === "bn" ? "শুধু AI এজেন্সি" : "Only an AI agency"}</li>
                  <li>{locale === "bn" ? "শুধু Hosting প্রোভাইডার" : "Only a hosting provider"}</li>
                </ul>
              </div>
              <div className="surface border-nexus/35 bg-nexus-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-nexus">{locale === "bn" ? "আমরা আছি" : "We are"}</p>
                <p className="mt-2 text-sm font-medium text-navy">
                  {locale === "bn"
                    ? "একটি business infrastructure and growth solutions ecosystem।"
                    : "A business infrastructure and growth solutions ecosystem."}
                </p>
              </div>

              {/* The combined strength, in the business's own words. This is the difference
                  that a single-service competitor cannot copy — so it is stated plainly. */}
              <div className="surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {locale === "bn" ? "আমাদের আসল শক্তি" : "Where our strength actually comes from"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {locale === "bn"
                    ? "কোড লেখা আমাদের একমাত্র কাজ নয়। আমাদের আসল শক্তি হলো কয়েকটি দক্ষতা একসাথে থাকা:"
                    : "Writing code is not the whole of our work. Our real strength is that several capabilities sit together:"}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {capabilityPositioning.combination.map((item) => (
                    <Badge key={item.en} tone="brand" size="sm">
                      {t(item, locale)}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {locale === "bn"
                    ? "একটি সেবা আলাদাভাবে কেউ দিতে পারে। কিন্তু ব্যবসা বোঝা, সিস্টেম ডিজাইন আর বাস্তবায়ন একই লোকের হাতে থাকলে ফলাফল ভিন্ন হয়।"
                    : "Any single one of these can be bought elsewhere. What changes the outcome is having the business understanding, the system design and the implementation in the same hands."}
                </p>
                <div className="mt-4">
                  <ButtonLink href="/capabilities" variant="outline">
                    {locale === "bn" ? "২৩টি Capability দেখুন" : "See the 23 capabilities"}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow={locale === "bn" ? "Comparison" : "Comparison"}
          title={locale === "bn" ? "Traditional Agency বনাম Nexus Lift" : "Traditional agency versus Nexus Lift"}
        />
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Traditional agency compared with Nexus Lift</caption>
            <thead>
              <tr className="bg-mist text-left text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-4 py-3">Traditional Agencies</th>
                <th scope="col" className="px-4 py-3 text-nexus">Nexus Lift</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.nexus.en} className="border-t border-line">
                  <td className="px-4 py-3 text-slate-600">{row.traditional[locale]}</td>
                  <td className="px-4 py-3 font-medium text-navy">{row.nexus[locale]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Core Values" : "Core values"}
          title={locale === "bn" ? "আমাদের চারটি মূলনীতি" : "Four principles we work by"}
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {values.map((value) => (
            <div key={value.title.en} className="surface p-5">
              <h3 className="text-base">{value.title[locale]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.body[locale]}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Framework" title={locale === "bn" ? "যে ছয়টি Layer আমরা দেখি" : "The six layers we work across"} />
            <div className="mt-5">
              <LayerFlow locale={locale} />
            </div>
            <div className="mt-6">
              <CheckList items={businessLayers.map((layer) => `${layer.code} · ${t(layer.name, locale)}`)} columns={2} />
            </div>
          </div>
          <div className="surface p-6">
            <h3 className="text-base">{locale === "bn" ? "যোগাযোগ" : "Talk to us"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {locale === "bn"
                ? "আমরা কোনো Guaranteed Growth, Revenue বা ROI দাবি করি না। আমরা প্রথমে আপনার অবস্থা বুঝি, তারপর একটি পরিষ্কার পরিকল্পনা দিই।"
                : "We make no guaranteed growth, revenue or ROI claims. We understand your situation first, then give you a clear plan."}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/contact">{locale === "bn" ? "Contact করুন" : "Contact us"}</ButtonLink>
              <ButtonLink href="/case-studies" variant="outline">
                {locale === "bn" ? "Case Studies" : "Case studies"}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "About", url: absoluteUrl("/about") },
        ]}
      />
    </>
  );
}
