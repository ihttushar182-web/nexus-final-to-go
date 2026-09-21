import Link from "next/link";
import { cn, t } from "@/lib/utils";
import type { BusinessLayer, Locale } from "@/types";

export function LayerCard({
  layer,
  locale,
  className,
  compact = false,
}: {
  layer: BusinessLayer;
  locale: Locale;
  className?: string;
  compact?: boolean;
}) {
  const includes = (locale === "bn" ? layer.includes.bn : layer.includes.en).slice(0, compact ? 3 : 6);

  return (
    <article id={layer.id} className={cn("surface card-hover flex h-full flex-col p-5", className)}>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-navy font-display text-sm font-semibold text-white tabular-nums">
          {layer.code}
        </span>
        <h3 className="text-[1.02rem]">{t(layer.name, locale)}</h3>
      </div>

      <p className="mt-3 text-sm font-medium text-navy">{t(layer.question, locale)}</p>
      {!compact ? <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{t(layer.summary, locale)}</p> : null}

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {includes.map((item) => (
          <li key={item} className="rounded-full border border-line bg-mist px-2.5 py-1 text-[0.7rem] text-slate-600">
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={`/solutions#${layer.id}`}
        className="mt-5 inline-flex text-xs font-semibold text-nexus hover:underline"
      >
        {locale === "bn" ? "এই Layer-এর সেবা" : "Services for this layer"} →
      </Link>
    </article>
  );
}

/** Identity → Structure → … → Control connector strip. */
export function LayerFlow({ locale, tone = "light" }: { locale: Locale; tone?: "light" | "dark" }) {
  const items = [
    { bn: "Identity", en: "Identity" },
    { bn: "Structure", en: "Structure" },
    { bn: "Operations", en: "Operations" },
    { bn: "Growth", en: "Growth" },
    { bn: "Intelligence", en: "Intelligence" },
    { bn: "Control", en: "Control" },
  ];
  return (
    <ol className="flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, index) => (
        <li key={item.en} className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-lg border px-2.5 py-1.5 font-medium",
              tone === "dark" ? "border-white/20 bg-white/5 text-white" : "border-line bg-white text-navy",
            )}
          >
            {t(item, locale)}
          </span>
          {index < items.length - 1 ? (
            <span aria-hidden className={tone === "dark" ? "text-accent" : "text-accent"}>
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
