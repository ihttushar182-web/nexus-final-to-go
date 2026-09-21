import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { smeReport } from "@/data/report";
import { getLayer } from "@/data/layers";
import { t, absoluteUrl } from "@/lib/utils";
import { getMaturityBand } from "@/lib/audit/scoring";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { ScoreBar } from "@/components/ui/StateMessage";
import { Alert } from "@/components/ui/StateMessage";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CheckList } from "@/components/ui/Timeline";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";

export const metadata: Metadata = {
  title: "Bangladesh SME System Maturity Report 2026 — Free Download",
  description:
    "১০০+ বাংলাদেশী SME Business Audit থেকে প্রাপ্ত ফলাফল: ৯২% Founder-dependent, ৮৫% Manual Process, ৭৮% No Dashboard। Free Report।",
  alternates: { canonical: "/resources/sme-maturity-report" },
};

export default async function SmeReportPage() {
  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Free Resource" : "Free resource"}
        title={t(smeReport.title, locale)}
        intro={t(smeReport.subtitle, locale)}
        breadcrumb={[
          { href: "/", label: "Home" },
          { label: "Resources" },
          { label: "SME Maturity Report" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/business-audit" size="lg">
            <Download className="size-4" aria-hidden />
            {locale === "bn" ? "আমার Business-এর Maturity জানুন" : "See my business maturity"}
          </ButtonLink>
          <ButtonLink href="/business-audit" variant="outline" size="lg">
            <FileText className="size-4" aria-hidden />
            {locale === "bn" ? "Report-এর Data দিয়ে Audit করুন" : "Audit with this data"}
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "Executive Summary" : "Executive summary"}
              title={locale === "bn" ? "মূল বিষয়" : "Key findings"}
            />
            <div className="mt-5 grid gap-3 text-[0.98rem] leading-relaxed text-slate-600">
              {smeReport.executiveSummary[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-base">{locale === "bn" ? "শীর্ষ ৩টি Bottleneck" : "Top three bottlenecks"}</h3>
              <div className="mt-4 grid gap-4">
                {smeReport.topBottlenecks.map((item) => (
                  <ScoreBar key={item.label.en} label={t(item.label, locale)} score={item.percent} max={100} caption="% of audited businesses" />
                ))}
              </div>
            </div>

            <Alert tone="warning" className="mt-8">
              {t(smeReport.sampleNote, locale)}
            </Alert>
          </div>

          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "Layer Maturity" : "Layer maturity"}
              title={locale === "bn" ? "৬টি Layer-এর গড় অবস্থা" : "Average state of the six layers"}
            />
            <div className="surface mt-6 grid gap-4 p-5">
              {smeReport.layerScores.map((entry) => {
                const layer = getLayer(entry.layer)!;
                const band = getMaturityBand(Math.round(entry.percent / 10));
                return (
                  <div key={entry.layer}>
                    <ScoreBar label={t(layer.metric, locale)} score={entry.percent} max={100} highlight={entry.percent <= 38} />
                    <p className="mt-1 text-xs text-slate-500">
                      {t(band.label, locale)}
                      {entry.percent <= 38 ? ` · ${locale === "bn" ? "critical" : "critical"}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="surface mt-5 p-5">
              <p className="text-sm font-semibold text-navy">{locale === "bn" ? "সমাধান কী?" : "What is the solution?"}</p>
              <div className="mt-3">
                <CheckList items={smeReport.solutions.map((item) => item[locale])} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="surface p-6 sm:p-8">
          <SectionHeader
            eyebrow={locale === "bn" ? "Next Step" : "Next step"}
            title={t(smeReport.cta, locale)}
            description={t(smeReport.ctaBody, locale)}
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { bn: "৫ মিনিটের Form", en: "A five-minute form" },
              { bn: "Instant Snapshot", en: "Instant snapshot" },
              { bn: "No Cost | No Obligation", en: "No cost, no obligation" },
            ].map((item) => (
              <li key={item.en} className="flex items-center gap-2 rounded-lg border border-line bg-white p-3.5 text-sm text-navy">
                <Badge tone="brand" size="sm">✓</Badge>
                {item[locale]}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/business-audit" size="lg">
              {locale === "bn" ? "Start My Diagnosis" : "Start my diagnosis"}
            </ButtonLink>
            <WhatsAppButton
              locale={locale}
              ctaLocation="report_footer"
              page="/resources/sme-maturity-report"
              variant="outline"
              size="lg"
              intent={locale === "bn" ? "SME Maturity Report নিয়ে আমার প্রশ্ন আছে।" : "I have a question about the SME maturity report."}
            />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">
            {locale === "bn"
              ? "নোট: এই পেজের সংখ্যাগুলো আমাদের নিজস্ব Audit Sample থেকে। আমরা এটিকে কোনো Industry Standard বা Third-Party Research হিসেবে উপস্থাপন করি না, এবং এই সংখ্যা কোনো ব্যবসার ভবিষ্যৎ ফলাফলের নিশ্চয়তা নয়।"
              : "Note: the figures on this page come from our own audit sample. We do not present them as an industry standard or third-party research, and they are not a guarantee of any business's future outcome."}
          </p>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "SME Maturity Report", url: absoluteUrl("/resources/sme-maturity-report") },
        ]}
      />
    </>
  );
}
