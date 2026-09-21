import Link from "next/link";
import { cn, t } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { Locale, SolutionCategory } from "@/types";

export function SolutionCard({ category, locale, className }: { category: SolutionCategory; locale: Locale; className?: string }) {
  const capabilities = (locale === "bn" ? category.capabilities.bn : category.capabilities.en).slice(0, 4);

  return (
    <article className={cn("surface card-hover flex h-full flex-col p-5", className)}>
      <span className="grid size-10 place-items-center rounded-lg bg-nexus-50 text-nexus">
        <Icon name={category.icon} className="size-5" />
      </span>
      <h3 className="mt-4 text-[1.02rem] leading-snug">
        <Link href={`/solutions/${category.slug}`} className="hover:text-nexus">
          {t(category.name, locale)}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(category.headline, locale)}</p>
      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {capabilities.map((item) => (
          <li key={item} className="rounded-full border border-line bg-mist px-2.5 py-1 text-[0.7rem] text-slate-600">
            {item}
          </li>
        ))}
      </ul>
      <Link
        href={`/solutions/${category.slug}`}
        className="mt-5 inline-flex text-sm font-semibold text-nexus hover:underline"
      >
        {locale === "bn" ? "বিস্তারিত দেখুন" : "See details"} →
      </Link>
    </article>
  );
}
