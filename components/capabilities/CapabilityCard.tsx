import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCapabilityFamily, type Capability } from "@/data/capabilities";
import { getLayer } from "@/data/layers";
import { getProduct } from "@/data/products";
import { getSolutionCategoryById } from "@/data/solutions";
import { t } from "@/lib/utils";
import type { Locale } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * Capability card — presentation only (Build Spec §62: no business logic in components).
 *
 * The card leads with the OUTCOME, not the technology (owner directive). The technical
 * product-line name is shown as a quiet label underneath, because that is what a buyer
 * scans for and what they ask about by name.
 */
export function CapabilityCard({
  capability,
  locale,
  className,
}: {
  capability: Capability;
  locale: Locale;
  className?: string;
}) {
  const family = getCapabilityFamily(capability.family);
  const solution = getSolutionCategoryById(capability.related.solutions[0] ?? "");
  const product = getProduct(capability.related.products[0] ?? "");

  return (
    <article className={cn("surface surface-hover flex h-full flex-col p-5 sm:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-7 shrink-0 place-items-center rounded-md bg-mist-200 font-display text-xs font-semibold text-navy tabular-nums"
          >
            {capability.code}
          </span>
          <h3 className="text-[1.02rem] leading-snug">{t(capability.name, locale)}</h3>
        </div>
        {family ? (
          <Badge tone="neutral" size="sm" className="hidden shrink-0 sm:inline-flex">
            {t(family.name, locale)}
          </Badge>
        ) : null}
      </div>

      {/* The selling line: what changes in the business. */}
      <p className="mt-3 text-sm font-medium leading-relaxed text-navy">{t(capability.outcome, locale)}</p>

      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{t(capability.problem, locale)}</p>

      {/* The system — what we actually build. */}
      <div className="mt-4 rounded-lg border border-line bg-mist/60 p-3.5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-500">
          {locale === "bn" ? "যে সিস্টেম বানানো হয়" : "The system we build"}
        </p>
        <p className="mt-1.5 text-[0.85rem] leading-relaxed text-slate-700">{t(capability.system, locale)}</p>
      </div>

      <ul className="mt-4 grid gap-1.5 text-[0.85rem] text-slate-700">
        {capability.includes[locale].slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-nexus">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Which layer this moves — keeps every capability tied to the framework. */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {capability.layers.map((layerId) => {
          const layer = getLayer(layerId);
          if (!layer) return null;
          return (
            <Badge key={layerId} tone="brand" size="sm">
              {locale === "bn" ? `Layer ${layer.code}` : `Layer ${layer.code}`} · {t(layer.metric, locale)}
            </Badge>
          );
        })}
      </div>

      {capability.covers ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          <span className="font-medium text-slate-600">
            {locale === "bn" ? "সাথে পড়ে:" : "Also covers:"}
          </span>{" "}
          {capability.covers.en.join(" · ")}
        </p>
      ) : null}

      {/* Footer: the honest commercial state, plus where to go next. */}
      <div className="mt-auto pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-4 text-xs">
          {product ? (
            <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-1 font-semibold text-nexus hover:underline">
              {locale === "bn" ? "প্যাকেজ দেখুন" : "See the package"}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          ) : (
            <span className="font-medium text-slate-500">
              {locale === "bn" ? "Scope ও খরচ কথা বলে নির্ধারিত হয়" : "Scope and cost confirmed in conversation"}
            </span>
          )}
          {solution ? (
            <Link href={`/solutions/${solution.slug}`} className="text-slate-500 hover:text-nexus hover:underline">
              {t(solution.name, locale)}
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
