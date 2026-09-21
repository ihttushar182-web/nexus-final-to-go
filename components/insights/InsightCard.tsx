import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate, t } from "@/lib/utils";
import { insightCategories } from "@/data/insights";
import type { InsightArticle, Locale } from "@/types";

export function InsightCard({ article, locale, className }: { article: InsightArticle; locale: Locale; className?: string }) {
  const category = insightCategories.find((item) => item.id === article.category);

  return (
    <article className={cn("surface card-hover flex h-full flex-col p-5 sm:p-6", className)}>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        {category ? <Badge tone="neutral" size="sm">{t(category.label, locale)}</Badge> : null}
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
        <span aria-hidden>·</span>
        <span>{article.readingMinutes} min</span>
      </div>

      <h3 className="mt-3.5 text-[1.03rem] leading-snug">
        <Link href={`/insights/${article.slug}`} className="hover:text-nexus">
          {t(article.title, locale)}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(article.excerpt, locale)}</p>

      <Link href={`/insights/${article.slug}`} className="mt-4 inline-flex text-sm font-semibold text-nexus hover:underline">
        {locale === "bn" ? "পড়ুন" : "Read more"} →
      </Link>
    </article>
  );
}
