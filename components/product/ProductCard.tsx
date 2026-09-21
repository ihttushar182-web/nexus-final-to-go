import Link from "next/link";
import { Clock, Repeat2 } from "lucide-react";
import { getDiscountPercent, getSavings, TBC } from "@/data/products";
import { cn, formatCurrency, t } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { createTranslator } from "@/lib/i18n/dictionaries";
import type { Locale, Product } from "@/types";

/**
 * Product card (Build Spec §23).
 * Shows name, short description, original price, current price, savings, key
 * deliverables, revision and delivery — plus a primary CTA and a secondary WhatsApp CTA.
 */
export function ProductCard({
  product,
  locale,
  className,
  variant = "default",
}: {
  product: Product;
  locale: Locale;
  className?: string;
  variant?: "default" | "featured";
}) {
  const tr = createTranslator(locale);
  const savings = getSavings(product);
  const discount = getDiscountPercent(product);
  const deliverables = t({ bn: product.deliverables.bn.join("|"), en: product.deliverables.en.join("|") }, locale)
    .split("|")
    .slice(0, 4);

  return (
    <article
      className={cn(
        "surface card-hover flex h-full flex-col p-5 sm:p-6",
        variant === "featured" && "border-nexus/35 ring-1 ring-nexus/10",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.05rem] leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-nexus">
            {t(product.name, locale)}
          </Link>
        </h3>
        {product.badge ? <Badge tone="brand" size="sm">{t(product.badge, locale)}</Badge> : null}
      </div>

      <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{t(product.shortDescription, locale)}</p>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        {product.currentPrice != null ? (
          <span className="font-display text-2xl font-semibold text-navy tabular-nums">
            {formatCurrency(product.currentPrice)}
            {product.billing === "monthly" ? <span className="text-sm font-medium text-slate-500">/mo</span> : null}
          </span>
        ) : (
          <span className="font-display text-lg font-semibold text-slate-500">{t(TBC, locale)}</span>
        )}
        {product.originalPrice != null && product.currentPrice != null && savings != null ? (
          <>
            <span className="text-sm text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
            <span className="text-xs font-semibold text-success">
              {tr("product.save")} {formatCurrency(savings)}
              {discount ? ` · ${discount}% off` : ""}
            </span>
          </>
        ) : null}
      </div>

      <ul className="mt-5 grid gap-2 text-sm text-slate-700">
        {deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-nexus">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {t(product.deliveryTime, locale)}
        </span>
        {product.revisionCount != null ? (
          <span className="inline-flex items-center gap-1.5">
            <Repeat2 className="size-3.5" aria-hidden />
            {product.revisionCount} {locale === "bn" ? "রাউন্ড রিভিশন" : "revision rounds"}
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-2 pt-1 sm:flex-row">
        <TrackedLink
          href={`/products/${product.slug}`}
          event="order_intent"
          properties={{ product_id: product.id, product_name: product.name.en, page: `/products/${product.slug}`, cta_location: "product_card" }}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-nexus px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-nexus-600"
        >
          {tr("action.orderNow")}
        </TrackedLink>
        <WhatsAppButton
          productName={t(product.name, locale)}
          locale={locale}
          productId={product.id}
          ctaLocation="product_card"
          page={`/products/${product.slug}`}
          label={locale === "bn" ? "WhatsApp" : "WhatsApp"}
          size="md"
          className="flex-1"
        />
      </div>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-slate-400">{tr("product.orderNote")}</p>
    </article>
  );
}

export function ProductGrid({ products, locale, className }: { products: Product[]; locale: Locale; className?: string }) {
  return (
    <div className={cn("grid gap-5 md:grid-cols-2 xl:grid-cols-3", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} variant={product.featured ? "featured" : "default"} />
      ))}
    </div>
  );
}

export function PriceCard({
  eyebrow,
  name,
  price,
  billingNote,
  features,
  cta,
  badge,
  highlighted,
  locale,
}: {
  eyebrow?: string;
  name: string;
  price: string;
  billingNote?: string;
  features: string[];
  cta: React.ReactNode;
  badge?: string;
  highlighted?: boolean;
  locale: Locale;
}) {
  return (
    <div
      className={cn(
        "surface flex h-full flex-col p-5 sm:p-6",
        highlighted && "border-nexus/40 shadow-lift ring-1 ring-nexus/12",
      )}
    >
      {badge ? <Badge tone="brand" size="sm" className="self-start">{badge}</Badge> : null}
      {eyebrow ? <p className="eyebrow mt-3">{eyebrow}</p> : null}
      <h3 className="mt-2 text-lg">{name}</h3>
      <p className="mt-3 font-display text-3xl font-semibold text-navy">
        {price}
        {billingNote ? <span className="ml-1 text-sm font-medium text-slate-500">{billingNote}</span> : null}
      </p>
      <ul className="mt-5 grid flex-1 gap-2 text-sm text-slate-700">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span aria-hidden className="mt-0.5 text-success">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">{cta}</div>
      <span className="sr-only">{locale}</span>
    </div>
  );
}
