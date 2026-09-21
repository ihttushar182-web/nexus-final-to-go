import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, ShieldCheck } from "lucide-react";
import { getRepository } from "@/lib/db";
import { getLocale } from "@/lib/i18n/server";
import { buildEvidence, priorityPlaybooks } from "@/lib/audit/scoring";
import { bottomProblemLabel, goalLabel } from "@/lib/audit/labels";
import { getLayer } from "@/data/layers";
import { getProduct } from "@/data/products";
import { t } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StepList } from "@/components/ui/Timeline";
import { AuditSnapshotView } from "@/components/audit/AuditSnapshotView";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";

export const metadata: Metadata = {
  title: "Your Business Snapshot",
  description: "Your Nexus Lift business audit snapshot and recommended next priority.",
  // Result URLs are personal and must never be indexed (QA FUN-04).
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AuditResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const locale = await getLocale();
  const repository = getRepository();

  const submission = await repository.getAudit(id).catch(() => null);
  if (!submission) notFound();

  const playbook = priorityPlaybooks[submission.snapshot.priorityLayer];
  const layer = getLayer(submission.snapshot.priorityLayer)!;
  const product = getProduct(playbook.productSlug);
  const evidence = buildEvidence(submission.snapshot, {
    biggestProblemLabel: bottomProblemLabel(submission.biggestProblem, locale),
    goalLabel: goalLabel(submission.goal, locale),
    tools: submission.currentTools,
  });

  return (
    <div className="bg-mist">
      <div className="border-b border-line bg-white">
        <div className="container-page py-10 sm:py-12">
          <Badge tone="success" size="sm">
            {locale === "bn" ? "Audit সম্পন্ন" : "Audit complete"}
          </Badge>
          <h1 className="mt-4 text-[1.7rem] leading-tight sm:text-4xl">
            {locale === "bn" ? "Your Business Snapshot is Ready" : "Your business snapshot is ready"}
          </h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            {locale === "bn"
              ? `Based on your inputs, here is your current system maturity${submission.businessName ? ` — ${submission.businessName}` : ""}।`
              : `Based on your inputs, here is your current system maturity${submission.businessName ? ` — ${submission.businessName}` : ""}.`}
          </p>
        </div>
      </div>

      <Section tone="mist">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="grid gap-8">
            <AuditSnapshotView snapshot={submission.snapshot} locale={locale} />

            <div className="surface p-5 sm:p-6">
              <p className="eyebrow">{locale === "bn" ? "The Diagnosis" : "The diagnosis"}</p>
              <h2 className="mt-2 text-xl">{t(playbook.headline, locale)}</h2>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-slate-600">{t(playbook.body, locale)}</p>

              <div className="mt-5 rounded-xl border border-line bg-mist p-4">
                <p className="text-sm font-semibold text-navy">{locale === "bn" ? "কেন এই সিদ্ধান্ত" : "Why this conclusion"}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(submission.snapshot.priorityReason, locale)}</p>
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-navy">{locale === "bn" ? "Evidence" : "Evidence"}</p>
                <ul className="mt-2.5 grid gap-2">
                  {evidence.map((item) => (
                    <li key={item.en} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span aria-hidden className="mt-0.5 text-accent">
                        ▪
                      </span>
                      {t(item, locale)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            <div className="surface p-5 sm:p-6">
              <p className="eyebrow">{locale === "bn" ? "The Solution Path" : "The solution path"}</p>
              <h2 className="mt-2 text-xl">
                {t(layer.name, locale)} {locale === "bn" ? "Layer থেকে শুরু করুন" : "layer is where to start"}
              </h2>
              <StepList
                className="mt-5"
                steps={playbook.steps.map((step) => ({ title: t(step, locale) }))}
              />

              <div className="mt-6 grid gap-3">
                <ButtonLink href="/book-call" size="lg">
                  <CalendarCheck className="size-4" aria-hidden />
                  {locale === "bn" ? "Book Your Strategy Call" : "Book your strategy call"}
                </ButtonLink>
                <ButtonLink href={`/solutions/${playbook.solutionSlug}`} variant="outline" size="lg">
                  {t(playbook.ctaLabel, locale)}
                  <ArrowRight className="size-4" aria-hidden />
                </ButtonLink>
                <WhatsAppButton
                  locale={locale}
                  ctaLocation="audit_result"
                  page={`/business-audit/result/${id}`}
                  intent={
                    locale === "bn"
                      ? `আমার Audit অনুযায়ী Priorities: ${t(layer.name, "bn")}। আমি এই বিষয়ে কথা বলতে চাই।`
                      : `My audit priority is ${t(layer.name, "en")} — I would like to discuss it.`
                  }
                />
              </div>
            </div>

            {product ? (
              <div className="surface p-5 sm:p-6">
                <p className="eyebrow">{locale === "bn" ? "Suggested next step" : "Suggested next step"}</p>
                <h2 className="mt-2 text-lg">{t(product.name, locale)}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(product.shortDescription, locale)}</p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-700">
                  {(locale === "bn" ? product.deliverables.bn : product.deliverables.en).slice(0, 4).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden className="mt-0.5 text-success">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-nexus hover:underline">
                    {locale === "bn" ? "পণ্যের বিস্তারিত দেখুন" : "View full product details"} →
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="surface p-5 sm:p-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <ShieldCheck className="size-4 text-success" aria-hidden />
                {locale === "bn" ? "কোনো Obligation নেই" : "No obligation"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {locale === "bn"
                  ? "এই Snapshot আপনার জন্য তৈরি করা একটি প্রাথমিক চিত্র। আপনি এটি নিয়ে নিজেই কাজ করতে পারেন, অথবা আমাদের সাথে কথা বলতে পারেন — দুইটিই ঠিক আছে।"
                  : "This snapshot is a preliminary picture made for you. You can act on it yourself or talk to us — both are fine."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/business-audit" variant="ghost" size="sm">
                  {locale === "bn" ? "আবার Audit করুন" : "Run the audit again"}
                </ButtonLink>
                <ButtonLink href="/resources/sme-maturity-report" variant="ghost" size="sm">
                  {locale === "bn" ? "SME Maturity Report" : "SME maturity report"}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
