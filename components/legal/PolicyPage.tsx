import { notFound } from "next/navigation";
import { getPolicy } from "@/data/policies";
import { getLocale } from "@/lib/i18n/server";
import { formatDate, t, absoluteUrl } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Alert } from "@/components/ui/StateMessage";

/** Shared renderer for the policy routes so wording lives in one place. */
export async function PolicyPage({ slug }: { slug: string }) {
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const locale = await getLocale();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Legal" : "Legal"}
        title={t(policy.title, locale)}
        intro={t(policy.intro, locale)}
        breadcrumb={[{ href: "/", label: "Home" }, { label: t(policy.title, locale) }]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="Policy sections" className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {locale === "bn" ? "বিভাগ" : "Sections"}
            </p>
            <ul className="mt-3 grid gap-2 text-sm">
              {policy.sections.map((section, index) => (
                <li key={index}>
                  <a href={`#section-${index + 1}`} className="text-slate-600 hover:text-nexus hover:underline">
                    {t(section.heading, locale)}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-slate-500">
              {locale === "bn" ? "সর্বশেষ আপডেট" : "Last updated"}: {formatDate(policy.updatedAt, locale)}
            </p>
          </nav>

          <div className="max-w-3xl">
            <Alert tone="info">
              {locale === "bn"
                ? "এই নীতিটি সাধারণ তথ্যের জন্য এবং প্রযোজ্য আইনের অধীন। এটি কোনো আইনি পরামর্শ নয়।"
                : "This policy is provided for general information and is subject to applicable law. It is not legal advice."}
            </Alert>

            <div className="mt-8 grid gap-9">
              {policy.sections.map((section, index) => (
                <section key={index} id={`section-${index + 1}`} className="scroll-mt-24">
                  <h2 className="text-lg">{t(section.heading, locale)}</h2>
                  <ul className="mt-3 grid gap-2.5">
                    {section.body[locale].map((paragraph) => (
                      <li key={paragraph} className="flex items-start gap-2.5 text-[0.95rem] leading-relaxed text-slate-600">
                        <span aria-hidden className="mt-0.5 text-accent">
                          ▪
                        </span>
                        {paragraph}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: t(policy.title, "en"), url: absoluteUrl(`/${policy.slug}`) },
        ]}
      />
    </>
  );
}
