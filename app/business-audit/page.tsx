import type { Metadata } from "next";
import { CheckList, ProcessTimeline } from "@/components/ui/Timeline";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Section } from "@/components/ui/Section";
import { Alert } from "@/components/ui/StateMessage";
import { AuditForm } from "@/components/audit/AuditForm";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { getLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/dictionaries";
import { absoluteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Business Audit — আপনার Business-এর Next Priority জানুন",
  description:
    "৫ মিনিটের Free Business Audit — Identity, Structure, Operations, Growth, Intelligence এবং Control Layer-এর বর্তমান অবস্থা জানুন এবং প্রথম Priorities ঠিক করুন।",
  alternates: { canonical: "/business-audit" },
  openGraph: {
    title: "Free Business Audit | Nexus Lift",
    description: "Diagnose your business against the six connected layers and get a prioritised next step.",
    url: "/business-audit",
  },
};

const painPoints = [
  { bn: "Founder-dependent কাজ", en: "Founder-dependent work" },
  { bn: "Repeatable process নেই", en: "No repeatable process" },
  { bn: "Data scattered এবং অগোছালো", en: "Scattered, disorganised data" },
  { bn: "Growth বন্ধ হয়ে যাচ্ছে", en: "Growth has stalled" },
];

export default async function BusinessAuditPage() {
  const locale = await getLocale();
  const tr = createTranslator(locale);

  const steps = [
    {
      code: "01",
      title: locale === "bn" ? "Share Details" : "Share details",
      description: locale === "bn" ? "আপনার Business সম্পর্কে কিছু মৌলিক তথ্য দিন।" : "Give us some basic information about your business.",
    },
    {
      code: "02",
      title: locale === "bn" ? "Get Snapshot" : "Get snapshot",
      description: locale === "bn" ? "আপনার Business-এর ৬টি Layer-এর maturity snapshot দেখুন।" : "See the maturity snapshot of your six layers.",
    },
    {
      code: "03",
      title: locale === "bn" ? "Next Priority" : "Next priority",
      description: locale === "bn" ? "কোন কাজটি এখন সবচেয়ে জরুরি তা জানুন।" : "Learn which piece of work matters most right now.",
    },
  ];

  return (
    <>
      <AnalyticsProvider />
      <PageHero
        eyebrow="Free Business Audit"
        title={locale === "bn" ? "Business Chaos থেকে Systematic Growth" : "From business chaos to systematic growth"}
        intro={
          locale === "bn"
            ? "আপনার Business-এর সব সমস্যা একসাথে solve করতে হয় না। সঠিক সময়ে সঠিক priority ঠিক করাই প্রথম কাজ। Nexus Lift framework অনুযায়ী আমরা আপনার Business-এর ৬টি মূল Dimension বিশ্লেষণ করি।"
            : "You do not have to solve every problem at once. Choosing the right priority at the right time is the first job. We analyse your business against all six dimensions of the Nexus Lift framework."
        }
        breadcrumb={[
          { href: "/", label: "Home" },
          { label: "Business Audit" },
        ]}
      >
        <CheckList
          columns={2}
          items={[tr("trust.freeAudit"), tr("trust.noObligation"), tr("trust.instantSnapshot"), tr("trust.confidential")]}
        />
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <h2 className="text-2xl">{locale === "bn" ? "আপনার Business আছে। কিন্তু Business System আছে কি?" : "You have a business. Do you have a business system?"}</h2>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-slate-600">
              {locale === "bn"
                ? "একটি business-এ Brand, Website, Employees, Customers, Sales, Marketing, Software এবং AI থাকতে পারে। তবুও যদি কাজগুলো মানুষ, memory আর manual effort-এর ওপর অতিরিক্ত নির্ভর করে, তাহলে business-এর system maturity এখনও কম হতে পারে।"
                : "A business can have a brand, website, employees, customers, sales, marketing, software and AI — yet if the work depends too heavily on people, memory and manual effort, system maturity is still low."}
            </p>

            <ul className="mt-6 grid gap-3">
              {painPoints.map((pain) => (
                <li key={pain.en} className="flex items-start gap-3 rounded-xl border border-line bg-mist p-4 text-sm font-medium text-navy">
                  <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-warning-50 text-[0.65rem] font-bold text-warning">
                    !
                  </span>
                  {pain[locale]}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <h3 className="text-base">{locale === "bn" ? "মাত্র ৩টি ধাপে আপনার Business Priority জানুন" : "Learn your business priority in three steps"}</h3>
              <ProcessTimeline className="mt-4" steps={steps} />
            </div>

            <Alert tone="info" className="mt-7">
              {tr("audit.scoreNote")}
            </Alert>

            <div className="mt-6">
              <p className="text-sm text-slate-600">
                {locale === "bn"
                  ? "Audit না করে সরাসরি কথা বলতে চান?"
                  : "Prefer to talk before filling the form?"}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <WhatsAppButton locale={locale} ctaLocation="audit_page" page="/business-audit" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="sr-only">{tr("audit.formTitle")}</h2>
            <AuditForm locale={locale} />
          </div>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Business Audit", url: absoluteUrl("/business-audit") },
        ]}
      />
    </>
  );
}
