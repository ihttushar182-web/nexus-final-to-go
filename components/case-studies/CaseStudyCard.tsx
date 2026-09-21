import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn, t } from "@/lib/utils";
import type { CaseStudy, Locale } from "@/types";

export function CaseStudyCard({
  study,
  locale,
  className,
  detailed = false,
}: {
  study: CaseStudy;
  locale: Locale;
  className?: string;
  detailed?: boolean;
}) {
  return (
    <article className={cn("surface card-hover flex h-full flex-col p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone="accent" size="sm">{t(study.industry, locale)}</Badge>
        <span className="text-xs text-slate-500">{t(study.timeline, locale)}</span>
      </div>

      <h3 className="mt-3.5 text-[1.05rem] leading-snug">
        {detailed ? t(study.title, locale) : (
          <Link href={`/case-studies#${study.slug}`} className="hover:text-nexus">
            {t(study.title, locale)}
          </Link>
        )}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(study.summary, locale)}</p>

      <dl className="mt-5 grid gap-2.5 sm:grid-cols-1">
        {study.metrics.map((metric) => (
          <div key={metric.label.en} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-mist/70 px-3.5 py-2.5">
            <dt className="text-xs font-medium text-slate-600">{t(metric.label, locale)}</dt>
            <dd className="text-sm font-semibold tabular-nums text-navy">
              <span className="text-slate-400 line-through">{metric.before}</span>
              <span className="mx-1.5 text-slate-300">→</span>
              {metric.after}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-[0.7rem] leading-relaxed text-slate-400">{t(study.evidenceNote, locale)}</p>
    </article>
  );
}
