import Link from "next/link";
import { insights } from "@/data/insights";
import { caseStudies } from "@/data/case-studies";
import { faqItems } from "@/data/faq";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { DashboardCard } from "@/components/ui/DataDisplay";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  return (
    <div className="grid gap-8">
      <header>
        <p className="eyebrow">Content</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Insights, case studies & FAQ</h1>
        <p className="mt-1 text-sm text-slate-600">
          Article and case-study content is prepared in the data layer so it can move to the CMS (<code className="rounded bg-mist px-1.5 py-0.5 text-xs">content</code> table)
          without changing a single component.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Published articles" value={insights.length} />
        <DashboardCard label="Case studies" value={caseStudies.length} />
        <DashboardCard label="FAQ entries" value={faqItems.length} />
        <DashboardCard label="Featured articles" value={insights.filter((article) => article.featured).length} tone="brand" />
      </section>

      <section>
        <h2 className="mb-3 text-lg">Articles</h2>
        <ul className="grid gap-3">
          {insights.map((article) => (
            <li key={article.slug} className="surface flex flex-wrap items-start justify-between gap-4 p-4">
              <div className="min-w-0">
                <Link href={`/insights/${article.slug}`} className="font-medium text-navy hover:underline">
                  {article.title.en}
                </Link>
                <p className="mt-1 text-xs text-slate-500">
                  {article.category} · {formatDate(article.publishedAt, "en")} · {article.readingMinutes} min · schema: {article.schemaType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {article.featured ? <Badge tone="brand" size="sm">featured</Badge> : null}
                <Badge tone="neutral" size="sm">{article.slug}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg">Case studies</h2>
        <ul className="grid gap-3">
          {caseStudies.map((study) => (
            <li key={study.slug} className="surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-navy">{study.title.en}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {study.industry.en} · {study.timeline.en}
                  </p>
                </div>
                <Badge tone="neutral" size="sm">{study.metrics.length} metric{study.metrics.length === 1 ? "" : "s"}</Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500">{study.evidenceNote.en}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-lg">FAQ</h2>
        <ul className="grid gap-2">
          {faqItems.map((item) => (
            <li key={item.id} className="surface p-4">
              <p className="text-sm font-medium text-navy">{item.question.en}</p>
              <p className="mt-1 text-xs text-slate-600">{item.answer.en}</p>
              {item.source ? <p className="mt-2 text-[0.7rem] text-slate-400">Source: {item.source}</p> : null}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
