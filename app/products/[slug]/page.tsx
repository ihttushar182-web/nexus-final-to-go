import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, FileText, Repeat2 } from "lucide-react";
import { getProduct, getRelatedProducts, getSavings, getDiscountPercent, TBC, products } from "@/data/products";
import { getSolutionCategoryById } from "@/data/solutions";
import { getFaqs } from "@/data/faq";
import { getLayer } from "@/data/layers";
import { getLocale } from "@/lib/i18n/server";
import { createTranslator } from "@/lib/i18n/dictionaries";
import { formatCurrency, t, absoluteUrl, cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StepList, CheckList } from "@/components/ui/Timeline";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Alert } from "@/components/ui/StateMessage";
import { ProductCard } from "@/components/product/ProductCard";
import { WhatsAppButton, MessengerButton } from "@/components/integrations/ContactButtons";
import { ViewTracker } from "@/components/analytics/TrackedLink";
import { JsonLd } from "@/components/seo/OrganizationSchema";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/**
 * Only the products in /data/products.ts exist — any other slug is a real 404.
 * Returning a real 404 status matters for SEO: a soft 404 (200 + "not found" body)
 * would let crawlers index non-existent catalogue URLs.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  // Deciding here matters: metadata resolves before the response is committed, so an
  // unknown slug returns a real 404 status instead of a soft 404 (200 + "not found").
  if (!product) notFound();

  return {
    title: product.seoTitle.bn,
    description: product.seoDescription.bn,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.seoTitle.bn,
      description: product.seoDescription.bn,
      url: `/products/${product.slug}`,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const locale = await getLocale();
  const tr = createTranslator(locale);
  const category = getSolutionCategoryById(product.category);
  const related = getRelatedProducts(product);
  const upsell = product.upsell ? getProduct(product.upsell) : undefined;
  const faqs = getFaqs(product.faq).map((item) => ({ id: item.id, question: item.question, answer: item.answer }));
  const savings = getSavings(product);
  const discount = getDiscountPercent(product);
  const layer = getLayer(product.layer);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name.en,
    description: product.seoDescription.en,
    category: category?.name.en,
    brand: { "@type": "Brand", name: "Nexus Lift" },
    ...(product.currentPrice != null
      ? {
          offers: {
            "@type": "Offer",
            price: product.currentPrice,
            priceCurrency: product.currency,
            availability: product.status === "active" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
            url: absoluteUrl(`/products/${product.slug}`),
            seller: { "@type": "Organization", name: "Nexus Lift" },
          },
        }
      : {}),
    ...(faqs.length
      ? {
          mainEntity: faqs.map((item) => ({
            "@type": "Question",
            name: item.question[locale],
            acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
          })),
        }
      : {}),
  };

  return (
    <>
      <ViewTracker
        event="product_view"
        properties={{ product_id: product.id, product_name: product.name.en, page: `/products/${product.slug}` }}
      />

      <div className="border-b border-line bg-gradient-to-b from-mist to-white">
        <div className="container-page py-10 sm:py-12">
          <Breadcrumb
            className="mb-6"
            items={[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { label: product.name[locale] },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {product.badge ? <Badge tone="brand" size="sm">{t(product.badge, locale)}</Badge> : null}
                {category ? <Badge tone="neutral" size="sm">{t(category.name, locale)}</Badge> : null}
                {layer ? <Badge tone="accent" size="sm">{t(layer.name, locale)} Layer</Badge> : null}
              </div>

              <h1 className="mt-4 text-[1.7rem] leading-[1.25] sm:text-4xl">{t(product.name, locale)}</h1>
              <p className="mt-3 text-lg font-medium text-navy">{t(product.shortDescription, locale)}</p>
              <p className="mt-4 text-[0.98rem] leading-relaxed text-slate-600">{t(product.description, locale)}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/book-call" size="lg">
                  {locale === "bn" ? "কথা বলুন ও অর্ডার করুন" : "Talk and place an order"}
                </ButtonLink>
                <WhatsAppButton
                  productName={t(product.name, locale)}
                  locale={locale}
                  productId={product.id}
                  ctaLocation="product_hero"
                  page={`/products/${product.slug}`}
                  size="lg"
                />
                <MessengerButton
                  productName={t(product.name, locale)}
                  locale={locale}
                  ctaLocation="product_hero"
                  page={`/products/${product.slug}`}
                  size="lg"
                />
              </div>
            </div>

            {/* Price panel */}
            <aside className="surface h-fit p-5 sm:p-6">
              <p className="eyebrow">{tr("product.price")}</p>

              {product.currentPrice != null ? (
                <>
                  <p className="mt-2 font-display text-3xl font-semibold text-navy tabular-nums">
                    {formatCurrency(product.currentPrice)}
                    {product.billing === "monthly" ? <span className="text-base font-medium text-slate-500">/mo</span> : null}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    {product.originalPrice ? (
                      <span className="text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span>
                    ) : null}
                    {savings ? (
                      <span className="font-semibold text-success">
                        {tr("product.save")} {formatCurrency(savings)}
                        {discount ? ` (${discount}%)` : ""}
                      </span>
                    ) : null}
                  </div>
                </>
              ) : (
                <p className="mt-2 font-display text-xl font-semibold text-slate-500">{t(TBC, locale)}</p>
              )}

              {product.priceNote ? (
                <p className="mt-3 text-xs leading-relaxed text-slate-500">{t(product.priceNote, locale)}</p>
              ) : null}

              <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm">
                <div className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0 text-nexus" aria-hidden />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">{tr("product.deliveryTime")}</dt>
                    <dd className="text-navy">{t(product.deliveryTime, locale)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <FileText className="mt-0.5 size-4 shrink-0 text-nexus" aria-hidden />
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">{tr("product.deliveryFormat")}</dt>
                    <dd className="text-navy">{t(product.deliveryFormat, locale)}</dd>
                  </div>
                </div>
                {product.revisionCount != null ? (
                  <div className="flex items-start gap-2.5">
                    <Repeat2 className="mt-0.5 size-4 shrink-0 text-nexus" aria-hidden />
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">{tr("product.revisions")}</dt>
                      <dd className="text-navy">
                        {product.revisionCount} {locale === "bn" ? "রাউন্ড" : "rounds"}
                      </dd>
                    </div>
                  </div>
                ) : null}
              </dl>

              <Alert tone="info" className="mt-5">
                {tr("product.orderNote")}
              </Alert>
            </aside>
          </div>
        </div>
      </div>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <h2 className="text-lg">{tr("product.bestFor")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(product.targetCustomer, locale)}</p>
          </div>
          <div>
            <h2 className="text-lg">{tr("product.problem")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(product.problem, locale)}</p>
          </div>
          <div>
            <h2 className="text-lg">{tr("product.outcome")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(product.outcome, locale)}</p>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <SectionHeader eyebrow={tr("product.whatYouGet")} title={locale === "bn" ? "Deliverables" : "Deliverables"} />
            <div className="mt-6">
              <CheckList items={t({ bn: product.deliverables.bn.join("|"), en: product.deliverables.en.join("|") }, locale).split("|")} />
            </div>

            <h3 className="mt-8 text-base">{tr("product.features")}</h3>
            <div className="mt-4">
              <CheckList items={t({ bn: product.features.bn.join("|"), en: product.features.en.join("|") }, locale).split("|")} />
            </div>
          </div>

          <div>
            <SectionHeader eyebrow={tr("product.process")} title={locale === "bn" ? "কাজটি যেভাবে এগোবে" : "How the work progresses"} />
            <StepList
              className="mt-6"
              steps={product.process.map((step) => ({
                title: `${step.step}. ${t(step.title, locale)}`,
                description: t(step.description, locale),
              }))}
            />

            <h3 className="mt-8 text-base">{tr("product.requirements")}</h3>
            <div className="mt-4">
              <CheckList items={t({ bn: product.requirements.bn.join("|"), en: product.requirements.en.join("|") }, locale).split("|")} />
            </div>

            <h3 className="mt-8 text-base">{tr("product.revisions")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(product.revisionPolicy, locale)}</p>
          </div>
        </div>
      </Section>

      {faqs.length ? (
        <Section tone="white">
          <SectionHeader eyebrow="FAQ" title={tr("product.faq")} />
          <div className="mt-6 max-w-3xl">
            <FAQAccordion items={faqs} locale={locale} />
          </div>
        </Section>
      ) : null}

      {upsell || related.length ? (
        <Section tone="mist">
          <SectionHeader
            eyebrow={locale === "bn" ? "পরবর্তী ধাপ" : "Next step"}
            title={locale === "bn" ? "সম্পর্কিত পণ্য" : "Related products"}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[upsell, ...related].filter(Boolean).slice(0, 3).map((item) => (
              <ProductCard key={item!.id} product={item!} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="white" size="compact">
        <div className={cn("flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-mist p-5")}>
          <div>
            <p className="font-semibold text-navy">
              {locale === "bn" ? "এই পণ্য নিয়ে প্রশ্ন আছে?" : "Questions about this product?"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {locale === "bn"
                ? "কর্মঘণ্টায় (সকাল ১০:০০–বিকাল ৫:০০) WhatsApp বা Messenger-এ উত্তর দেওয়া হয়।"
                : "We reply on WhatsApp or Messenger during working hours (10:00 AM–5:00 PM)."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <WhatsAppButton
              productName={t(product.name, locale)}
              locale={locale}
              ctaLocation="product_footer"
              page={`/products/${product.slug}`}
            />
            <ButtonLink href="/products" variant="outline">
              <ArrowLeft className="size-4" aria-hidden />
              {locale === "bn" ? "সব পণ্য" : "All products"}
            </ButtonLink>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/refund-policy" className="hover:text-nexus hover:underline">
            {locale === "bn" ? "Refund ও Revision নীতি পড়ুন" : "Read the refund & revision policy"}
          </Link>
        </p>
      </Section>

      <JsonLd id={`product-schema-${product.slug}`} data={structuredData} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products") },
          { name: product.name.en, url: absoluteUrl(`/products/${product.slug}`) },
        ]}
      />
    </>
  );
}
