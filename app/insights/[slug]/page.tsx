import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInsight, insights, insightCategories } from "@/data/insights";
import { getLocale } from "@/lib/i18n/server";
import { formatDate, t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import { InsightCard } from "@/components/insights/InsightCard";
import { JsonLd } from "@/components/seo/OrganizationSchema";

export function generateStaticParams() {
  return insights.map((article) => ({ slug: article.slug }));
}

/**
 * Only the published insights exist — any other slug is a real 404.
 * Returning a real 404 status matters for SEO: a soft 404 (200 + "not found" body)
 * would let crawlers index non-existent catalogue URLs.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.seoTitle.bn,
    description: article.seoDescription.bn,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.seoTitle.bn,
      description: article.seoDescription.bn,
      url: `/insights/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
  };
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const locale = await getLocale();
  const category = insightCategories.find((item) => item.id === article.category);
  const related = insights.filter((item) => item.slug !== article.slug).slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": article.schemaType,
    headline: article.title[locale],
    description: article.excerpt[locale],
    inLanguage: locale === "bn" ? "bn-BD" : "en",
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.author, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "Nexus Lift", url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    articleSection: category?.label.en,
    wordCount: article.body.reduce(
      (sum, sectionSection) => sum + sectionSection.paragraphs[locale].join(" ").split(/\s+/).length,
      0,
    ),
  };

  return (
    <>
      <article>
        <header className="border-b border-line bg-gradient-to-b from-mist to-white">
          <div className="container-page py-10 sm:py-12">
            <Breadcrumb
              className="mb-6"
              items={[
                { href: "/", label: "Home" },
                { href: "/insights", label: "Insights" },
                { label: article.title[locale] },
              ]}
            />
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {category ? <Badge tone="brand" size="sm">{t(category.label, locale)}</Badge> : null}
                <time dateTime={article.publishedAt}>{formatDate(article.publishedAt, locale)}</time>
                <span aria-hidden>·</span>
                <span>{article.readingMinutes} min read</span>
                <span aria-hidden>·</span>
                <span>{article.author}</span>
              </div>
              <h1 className="mt-4 text-[1.7rem] leading-[1.28] sm:text-4xl">{article.title[locale]}</h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{article.excerpt[locale]}</p>
              {article.updatedAt !== article.publishedAt ? (
                <p className="mt-3 text-xs text-slate-500">
                  Updated {formatDate(article.updatedAt, locale)}
                </p>
              ) : null}
            </div>
          </div>
        </header>

        <Section tone="white">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16">
            <div className="prose-nl max-w-3xl">
              {article.body.map((section, index) => (
                <section key={index} id={`section-${index + 1}`}>
                  <h2>{t(section.heading, locale)}</h2>
                  {section.paragraphs[locale].map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex}>{paragraph}</p>
                  ))}

                  {section.bullets?.[locale]?.length ? (
                    <ul>
                      {section.bullets[locale].map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}

                  {section.callout ? (
                    <blockquote className="my-6 rounded-xl border-l-4 border-nexus bg-mist p-4 text-[0.95rem] font-medium leading-relaxed text-navy">
                      {t(section.callout, locale)}
                    </blockquote>
                  ) : null}

                  {section.source ? (
                    <p className="mt-2 text-xs text-slate-500">
                      <span className="font-semibold">{locale === "bn" ? "সূত্র" : "Source"}:</span> {section.source}
                    </p>
                  ) : null}
                </section>
              ))}

              <div className="mt-12 rounded-xl border border-line bg-mist p-5">
                <p className="font-semibold text-navy">
                  {locale === "bn" ? "আপনার Business-এর অবস্থা জানতে চান?" : "Want to see where your business stands?"}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {locale === "bn"
                    ? "৫ মিনিটের Free Business Audit দিয়ে আপনার ছয়টি Layer-এর অবস্থা জানুন — কোনো খরচ নেই, কোনো obligation নেই।"
                    : "Use the five-minute free business audit to see the state of your six layers — no cost, no obligation."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <ButtonLink href="/business-audit">{locale === "bn" ? "Free Business Audit" : "Free business audit"}</ButtonLink>
                  <WhatsAppButton
                    locale={locale}
                    ctaLocation="insight_footer"
                    page={`/insights/${article.slug}`}
                    variant="outline"
                    intent={locale === "bn" ? "এই লেখাটির বিষয়ে আমার কিছু প্রশ্ন আছে।" : "I have a question about this article."}
                  />
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="surface p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {locale === "bn" ? "এই লেখায়" : "In this article"}
                </p>
                <ol className="mt-3 grid gap-2 text-sm">
                  {article.body.map((section, index) => (
                    <li key={index}>
                      <a href={`#section-${index + 1}`} className="text-slate-600 hover:text-nexus hover:underline">
                        {t(section.heading, locale)}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="surface mt-4 p-5">
                <p className="text-sm font-semibold text-navy">{locale === "bn" ? "কেস স্টাডি" : "Case studies"}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {locale === "bn"
                    ? "সংখ্যাগুলো কোথা থেকে এসেছে তা দেখুন আমাদের কেস স্টাডিতে।"
                    : "See where our numbers come from in the case studies."}
                </p>
                <Link href="/case-studies" className="mt-3 inline-flex text-sm font-semibold text-nexus hover:underline">
                  {locale === "bn" ? "Case Studies দেখুন" : "View case studies"} →
                </Link>
              </div>
            </aside>
          </div>
        </Section>
      </article>

      <Section tone="mist">
        <SectionHeader eyebrow={locale === "bn" ? "Continue reading" : "Continue reading"} title={locale === "bn" ? "সম্পর্কিত লেখা" : "Related articles"} />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <InsightCard key={item.slug} article={item} locale={locale} />
          ))}
        </div>
      </Section>

      <JsonLd id={`article-schema-${article.slug}`} data={structuredData} />
    </>
  );
}
