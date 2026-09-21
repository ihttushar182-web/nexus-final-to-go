import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { caseStudies } from "@/data/case-studies";
import { t, absoluteUrl } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/StateMessage";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Case Studies — Real Results, Documented Sources",
  description:
    "E-commerce, Service Agency এবং Manufacturing — তিনটি বাস্তব প্রজেক্ট, তাদের Diagnosi, System এবং Reported Result, প্রতিটির Evidence Note সহ।",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Proof" : "Proof"}
        title={locale === "bn" ? "Real Results from Real Businesses" : "Real results from real businesses"}
        intro={
          locale === "bn"
            ? "No Fabricated Claims। প্রতিটি সংখ্যার পাশে বলা আছে সেটি কোথা থেকে জানানো হয়েছে এবং কোনটি এখনো তৃতীয় পক্ষ দ্বারা যাচাই হয়নি।"
            : "No fabricated claims. Every figure states where it came from and which claims have not yet been independently verified."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Case Studies" }]}
      >
        <Alert tone="warning" className="max-w-3xl">
          {locale === "bn"
            ? "আমরা কোনো Guaranteed Growth, Revenue বা ROI দাবি করি না। নিচের ফলাফল সেই নির্দিষ্ট ক্লায়েন্টের প্রেক্ষাপটে জানানো হয়েছে — অন্য কোনো ব্যবসার ফলাফলের নিশ্চয়তা নয়।"
            : "We make no guaranteed growth, revenue or ROI claims. The outcomes below are reported in that specific client's context and are not a guarantee for another business."}
        </Alert>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-8">
          {caseStudies.map((study) => (
            <article key={study.slug} id={study.slug} className="surface scroll-mt-24 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="accent" size="sm">{t(study.industry, locale)}</Badge>
                <Badge tone="neutral" size="sm">{t(study.timeline, locale)}</Badge>
              </div>
              <h2 className="mt-4 text-xl sm:text-2xl">{t(study.title, locale)}</h2>
              <p className="mt-3 max-w-3xl text-[0.98rem] leading-relaxed text-slate-600">{t(study.summary, locale)}</p>

              <dl className="mt-6 grid gap-3 sm:grid-cols-3">
                {study.metrics.map((metric) => (
                  <div key={metric.label.en} className="rounded-xl border border-line bg-mist p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t(metric.label, locale)}</dt>
                    <dd className="mt-1.5 text-lg font-semibold text-navy tabular-nums">
                      <span className="text-slate-400 line-through">{metric.before}</span>
                      <span className="mx-2 text-slate-300">→</span>
                      {metric.after}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 grid gap-6 lg:grid-cols-2">
                <div className="grid gap-5">
                  <Detail title={locale === "bn" ? "Context" : "Context"} body={t(study.context, locale)} />
                  <Detail title={locale === "bn" ? "Problem" : "Problem"} body={t(study.problem, locale)} />
                  <Detail title={locale === "bn" ? "Diagnosis" : "Diagnosis"} body={t(study.diagnosis, locale)} />
                </div>
                <div className="grid gap-5">
                  <Detail title={locale === "bn" ? "System" : "System"} body={t(study.system, locale)} />
                  <Detail title={locale === "bn" ? "Implementation" : "Implementation"} body={t(study.implementation, locale)} />
                  <Detail title={locale === "bn" ? "Result" : "Result"} body={t(study.result, locale)} />
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-warning/30 bg-warning-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-warning">
                  {locale === "bn" ? "Evidence note" : "Evidence note"}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{t(study.evidenceNote, locale)}</p>
              </div>

              <p className="mt-5 text-sm font-medium text-navy">
                <span className="text-slate-500">{locale === "bn" ? "শিক্ষা:" : "Lesson:"}</span> {t(study.lesson, locale)}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="mist" size="compact">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            {locale === "bn"
              ? "আপনার Business-এর Bottleneck কোনটি জানতে চান?"
              : "Would you like to know your own business's bottleneck?"}
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/business-audit">{locale === "bn" ? "Free Business Audit" : "Free business audit"}</ButtonLink>
            <ButtonLink href="/products" variant="outline">
              {locale === "bn" ? "Products দেখুন" : "Browse products"}
            </ButtonLink>
          </div>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Case Studies", url: absoluteUrl("/case-studies") },
        ]}
      />
    </>
  );
}

function Detail({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-nexus">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
