import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSolutionCategory, solutionCategories } from "@/data/solutions";
import { getProductsByCategory } from "@/data/products";
import { getLayer } from "@/data/layers";
import { getLocale } from "@/lib/i18n/server";
import { absoluteUrl, t } from "@/lib/utils";
import { Section, SectionHeader, Grid } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Icon } from "@/components/ui/Icon";
import { CheckList } from "@/components/ui/Timeline";
import { ProductCard } from "@/components/product/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";

export function generateStaticParams() {
  return solutionCategories.map((category) => ({ slug: category.slug }));
}

/**
 * Only the solution categories in /data/solutions.ts exist — any other slug is a real 404.
 * Returning a real 404 status matters for SEO: a soft 404 (200 + "not found" body)
 * would let crawlers index non-existent catalogue URLs.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getSolutionCategory(slug);
  if (!category) return { title: "Solution not found" };
  return {
    title: category.seoTitle.bn,
    description: category.seoDescription.bn,
    alternates: { canonical: `/solutions/${category.slug}` },
    openGraph: { title: category.seoTitle.bn, description: category.seoDescription.bn, url: `/solutions/${category.slug}` },
  };
}

export default async function SolutionCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getSolutionCategory(slug);
  if (!category) notFound();

  const locale = await getLocale();
  const layer = getLayer(category.layer);
  const items = getProductsByCategory(category.id);
  const siblings = solutionCategories.filter((item) => item.id !== category.id).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Icon name={category.icon} className="size-4" />
            {layer ? `${t(layer.name, locale)} Layer` : "Platform"}
          </span>
        }
        title={t(category.headline, locale)}
        intro={t(category.summary, locale)}
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/solutions", label: "Solutions" },
          { label: t(category.name, locale) },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/business-audit" size="lg">
            {locale === "bn" ? "এই Layer-এর অবস্থা জানুন" : "Check this layer"}
          </ButtonLink>
          <WhatsAppButton
            locale={locale}
            ctaLocation={`solution_${category.slug}`}
            page={`/solutions/${category.slug}`}
            intent={
              locale === "bn"
                ? `আমি ${t(category.name, "bn")} সম্পর্কে জানতে চাই।`
                : `I would like to know more about ${t(category.name, "en")}.`
            }
            size="lg"
          />
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeader eyebrow={locale === "bn" ? "Capabilities" : "Capabilities"} title={locale === "bn" ? "এই Solution-এ যা থাকে" : "What this solution includes"} />
            <div className="mt-6">
              <CheckList columns={2} items={category.capabilities[locale]} />
            </div>
          </div>
          <div>
            <SectionHeader eyebrow={locale === "bn" ? "Deliverables" : "Deliverables"} title={locale === "bn" ? "আপনি যা পাবেন" : "What you receive"} />
            <div className="mt-6">
              <CheckList items={category.deliverables[locale]} />
            </div>
            <div className="surface mt-8 p-5">
              <p className="text-sm font-semibold text-navy">{locale === "bn" ? "কার জন্য" : "Best for"}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(category.bestFor, locale)}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow={locale === "bn" ? "Outcomes" : "Outcomes"}
          title={locale === "bn" ? "এই Layer ঠিক হলে কী বদলায়" : "What changes when this layer is fixed"}
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {category.outcomes[locale].map((outcome) => (
            <div key={outcome} className="surface p-5 text-sm leading-relaxed text-slate-700">
              {outcome}
            </div>
          ))}
        </div>
      </Section>

      {items.length ? (
        <Section tone="white">
          <SectionHeader
            eyebrow={locale === "bn" ? "Products" : "Products"}
            title={locale === "bn" ? "এই Solution-এর পণ্য" : "Products in this category"}
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </Section>
      ) : null}

      {layer ? (
        <Section tone="mist">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeader
                eyebrow={t(layer.name, locale)}
                title={t(layer.question, locale)}
                description={t(layer.summary, locale)}
              />
            </div>
            <div className="grid gap-3">
              {layer.examples[locale].map((example) => (
                <p key={example} className="surface p-4 text-sm leading-relaxed text-slate-700">
                  {example}
                </p>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Continue" : "Continue"}
          title={locale === "bn" ? "অন্যান্য Solution" : "Other solutions"}
          action={
            <ButtonLink href="/solutions" variant="outline">
              {locale === "bn" ? "সব Solutions" : "All solutions"}
            </ButtonLink>
          }
        />
        <Grid cols={3}>
          {siblings.map((item) => (
            <div key={item.id} className="surface card-hover p-5">
              <span className="grid size-9 place-items-center rounded-lg bg-nexus-50 text-nexus">
                <Icon name={item.icon} className="size-4.5" />
              </span>
              <h3 className="mt-3.5 text-base">
                <a href={`/solutions/${item.slug}`} className="hover:text-nexus">
                  {t(item.name, locale)}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(item.headline, locale)}</p>
            </div>
          ))}
        </Grid>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Solutions", url: absoluteUrl("/solutions") },
          { name: category.name.en, url: absoluteUrl(`/solutions/${category.slug}`) },
        ]}
      />
    </>
  );
}
