import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { faqItems } from "@/data/faq";
import { siteConfig } from "@/config/site";
import { t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { WhatsAppButton, MessengerButton } from "@/components/integrations/ContactButtons";
import { JsonLd } from "@/components/seo/OrganizationSchema";
import { Alert } from "@/components/ui/StateMessage";

export const metadata: Metadata = {
  title: "FAQ — Free Audit, Order, Payment ও Support নিয়ে প্রশ্ন",
  description:
    "Free Business Audit, Order প্রক্রিয়া, Payment (bKash/Nagad), Timeline, Revision, Refund এবং Support নিয়ে সাধারণ প্রশ্নের উত্তর।",
  alternates: { canonical: "/faq" },
};

const groupLabels: { id: string; label: { bn: string; en: string; }; ids: string[] }[] = [
  {
    id: "general",
    label: { bn: "সাধারণ", en: "General" },
    ids: ["target-audience", "timeline", "call-free", "call-no-pressure"],
  },
  {
    id: "audit",
    label: { bn: "Free Business Audit", en: "Free business audit" },
    ids: ["audit-free"],
  },
  {
    id: "product",
    label: { bn: "পণ্য ও Delivery", en: "Products & delivery" },
    ids: ["profile-industry", "sop-industry", "sop-not-just-docs", "crm-tools", "profile-self-update", "delivery-time", "profile-revision"],
  },
  {
    id: "payment",
    label: { bn: "Order ও Payment", en: "Order & payment" },
    ids: ["payment-methods", "messenger-order", "scope-quote", "refund"],
  },
  {
    id: "support",
    label: { bn: "Support ও নিরাপত্তা", en: "Support & security" },
    ids: ["working-hours", "dashboard-data", "ai-governance"],
  },
];

export default async function FaqPage() {
  const locale = await getLocale();
  const ordered = groupLabels
    .map((group) => ({
      ...group,
      items: group.ids
        .map((id) => faqItems.find((item) => item.id === id))
        .filter((item): item is (typeof faqItems)[number] => Boolean(item))
        .map((item) => ({ id: item.id, question: item.question, answer: item.answer })),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title={locale === "bn" ? "সাধারণ প্রশ্নের উত্তর" : "Answers to common questions"}
        intro={
          locale === "bn"
            ? "এখানে না থাকলে WhatsApp বা Messenger-এ জিজ্ঞেস করুন — কর্মঘণ্টায় (সকাল ১০:০০–বিকাল ৫:০০) উত্তর দেওয়া হয়।"
            : "If your question is not here, ask on WhatsApp or Messenger — replies come during working hours (10:00 AM–5:00 PM)."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "FAQ" }]}
      >
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton
            locale={locale}
            ctaLocation="faq_hero"
            page="/faq"
            intent={locale === "bn" ? "আমার একটি প্রশ্ন আছে।" : "I have a question."}
          />
          <MessengerButton locale={locale} ctaLocation="faq_hero" page="/faq" />
        </div>
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-14">
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {locale === "bn" ? "বিভাগ" : "Sections"}
            </p>
            <ul className="mt-3 grid gap-2 text-sm">
              {ordered.map((group) => (
                <li key={group.id}>
                  <a href={`#${group.id}`} className="text-slate-600 hover:text-nexus hover:underline">
                    {t(group.label, locale)}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-line bg-mist p-4 text-xs leading-relaxed text-slate-600">
              <p className="font-semibold text-navy">{t(siteConfig.businessHours.display, locale)}</p>
              <p className="mt-1">{siteConfig.email}</p>
              <p>{siteConfig.phoneDisplay}</p>
            </div>
          </nav>

          <div className="grid gap-10">
            {ordered.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-24">
                <SectionHeader title={t(group.label, locale)} />
                <div className="mt-5">
                  <FAQAccordion items={group.items} locale={locale} />
                </div>
              </section>
            ))}

            <Alert tone="info" title={locale === "bn" ? "উত্তর না পেলে" : "Still unanswered?"}>
              {locale === "bn"
                ? "WhatsApp-এ লিখুন — কর্মঘণ্টার বাইরে পাঠালে উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হবে। আমরা কখনো এমন কোনো প্রতিশ্রুতি দিই না যা পালন করা সম্ভব নয়।"
                : "Write to us on WhatsApp — messages sent outside working hours are answered during the next working hours. We never make a promise we cannot keep."}
            </Alert>
          </div>
        </div>
      </Section>

      <JsonLd
        id="faq-page-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question[locale],
            acceptedAnswer: { "@type": "Answer", text: item.answer[locale] },
          })),
        }}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "FAQ", url: absoluteUrl("/faq") },
        ]}
      />
    </>
  );
}
