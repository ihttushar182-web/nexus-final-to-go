import type { Metadata } from "next";
import { CalendarCheck, Mail, MessageCircle, ShieldCheck, X } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { siteConfig } from "@/config/site";
import { getFaqs } from "@/data/faq";
import { buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { StepList, CheckList } from "@/components/ui/Timeline";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { Alert } from "@/components/ui/StateMessage";
import { ButtonLink } from "@/components/ui/Button";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Book a Free Strategy Call — ১৫ মিনিটে Business Roadmap",
  description:
    "১৫ মিনিটের Free Strategy Call-এ আপনার Business-এর Exact Bottleneck এবং একটি Clear Action Plan পান। 100% Free, No Obligation, Confidential।",
  alternates: { canonical: "/book-call" },
};

const whatYouGet = [
  {
    title: { bn: "Clear Clarity", en: "Clear clarity" },
    body: { bn: "আপনার Business-এর Exact Bottleneck জানতে পারবেন।", en: "You will know the exact bottleneck in your business." },
  },
  {
    title: { bn: "Custom Roadmap", en: "Custom roadmap" },
    body: { bn: "Priority ঠিক করে দেবো — SOP, CRM, Dashboard বা অন্য কিছু।", en: "We set the priority — SOP, CRM, dashboard or something else." },
  },
  {
    title: { bn: "No Sales Pressure", en: "No sales pressure" },
    body: { bn: "আমরা Service ঠেলে দিই না। আমরা Solution দিই।", en: "We do not push a service. We give you a solution direction." },
  },
];

const goodFit = [
  { bn: "আপনি একটি Serious Business Owner", en: "You are a serious business owner" },
  { bn: "আপনার Business-এ Growth আটকে আছে", en: "Growth in your business is stuck" },
  { bn: "আপনি System বানাতে Ready (ভবিষ্যতে)", en: "You are prepared to build a system (in future)" },
  { bn: "আপনি Actionable Advice চান", en: "You want actionable advice" },
];

const notFit = [
  { bn: "আপনি শুধু Free Advice চান, Action নেবেন না", en: "You only want free advice and will not act" },
  { bn: "আপনার Business একদম নতুন (Idea Stage)", en: "Your business is at idea stage" },
  { bn: "আপনি Budget ছাড়া System চান", en: "You want a system without any budget" },
  { bn: "আপনি শুধু Price শুনতে চান, Scope না বুঝে", en: "You only want a price without understanding scope" },
];

export default async function BookCallPage() {
  const locale = await getLocale();
  const faqs = getFaqs(["call-free", "call-no-pressure", "profile-industry", "working-hours"]).map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }));

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Free Strategy Call" : "Free strategy call"}
        title={locale === "bn" ? "১৫ মিনিটের Call-এ আপনার Business Roadmap" : "Your business roadmap in a 15-minute call"}
        intro={
          locale === "bn"
            ? "আপনি হয়তো Audit করেছেন কিন্তু এখনও Confused — আপনার Exact Bottleneck কোনটি, আর Systematic Growth-এ যাওয়ার প্রথম ধাপ কী? এই Call-এ আমরা Sales Pitch করবো না; আমরা আপনার সমস্যা বুঝবো এবং একটি Clear Action Plan দেবো।"
            : "You may have completed the audit and still feel unsure — what is the exact bottleneck, and what is the first step towards systematic growth? There is no sales pitch in this call; we understand the problem and give you a clear action plan."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Book Strategy Call" }]}
      >
        <CheckList
          columns={2}
          items={[locale === "bn" ? "100% Free" : "100% free", locale === "bn" ? "No Obligation" : "No obligation", locale === "bn" ? "Confidential" : "Confidential", locale === "bn" ? "Expert Advice" : "Expert advice"]}
        />
      </PageHero>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "What You Get" : "What you get"}
              title={locale === "bn" ? "এই Call-এ আপনি যা পাবেন" : "What you will get from this call"}
            />
            <div className="mt-6 grid gap-4">
              {whatYouGet.map((item) => (
                <div key={item.title.en} className="surface p-4">
                  <p className="font-semibold text-navy">{t(item.title, locale)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(item.body, locale)}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              <div className="surface border-success/30 bg-success-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-success">
                  <ShieldCheck className="size-4" aria-hidden />
                  {locale === "bn" ? "হ্যাঁ, যদি" : "Yes, if"}
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                  {goodFit.map((item) => (
                    <li key={item.en} className="flex items-start gap-2">
                      <span aria-hidden className="mt-0.5 text-success">✓</span>
                      {item[locale]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface border-danger/25 bg-danger-50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                  <X className="size-4" aria-hidden />
                  {locale === "bn" ? "না, যদি" : "No, if"}
                </p>
                <ul className="mt-3 grid gap-2 text-sm text-slate-700">
                  {notFit.map((item) => (
                    <li key={item.en} className="flex items-start gap-2">
                      <span aria-hidden className="mt-0.5 text-danger">✕</span>
                      {item[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "The Process" : "The process"}
              title={locale === "bn" ? "Call টি কেমন হবে?" : "How the call works"}
            />
            <StepList
              className="mt-6"
              steps={[
                {
                  title: locale === "bn" ? "Before Call" : "Before the call",
                  description:
                    locale === "bn"
                      ? "আপনি সময় জানিয়ে ফর্মটি পূরণ করবেন — আমরা আপনার Audit Report (থাকলে) আগেই দেখে নেবো।"
                      : "You submit the form with your availability — we review your audit report (if you have one) beforehand.",
                },
                {
                  title: locale === "bn" ? "During Call (১৫ মিনিট)" : "During the call (15 minutes)",
                  description:
                    locale === "bn"
                      ? "আমরা আপনার Goal এবং Bottleneck নিয়ে কথা বলবো এবং একটি Custom Roadmap দেবো।"
                      : "We discuss your goal and bottleneck and give you a custom roadmap.",
                },
                {
                  title: locale === "bn" ? "After Call" : "After the call",
                  description:
                    locale === "bn"
                      ? "আপনি সিদ্ধান্ত নেবেন — একসাথে কাজ করবেন কি না। কোনো Pressure নেই, এবং আমরা একটি Summary Email পাঠাবো।"
                      : "You decide whether to work together. There is no pressure, and we send a short summary email.",
                },
              ]}
            />

            <Alert tone="info" className="mt-6">
              {locale === "bn"
                ? "Slot আলাদাভাবে নিশ্চিত করা হয়, তাই আমরা এখন কোনো নির্দিষ্ট সময় নিশ্চিত দেখাই না। ফর্ম পাঠানোর পর আমাদের টিম কর্মঘণ্টায় (সকাল ১০:০০–বিকাল ৫:০০) সময় জানাবে।"
                : "Slots are confirmed individually, so we do not show fixed times. After you submit the form our team confirms a time during working hours (10:00 AM–5:00 PM)."}
            </Alert>

            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink
                href={buildWhatsAppLink({
                  locale,
                  intent: locale === "bn" ? "আমি Strategy Call বুক করতে চাই।" : "I would like to book a strategy call.",
                })}
                external
                variant="success"
              >
                <MessageCircle className="size-4" aria-hidden />
                {locale === "bn" ? "সরাসরি WhatsApp-এ বুক করুন" : "Book directly on WhatsApp"}
              </ButtonLink>
              <ButtonLink href={`mailto:${siteConfig.email}`} external variant="outline">
                <Mail className="size-4" aria-hidden />
                {siteConfig.email}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "Request a slot" : "Request a slot"}
              title={locale === "bn" ? "বুকিং Request পাঠান" : "Send a booking request"}
              description={
                locale === "bn"
                  ? "নিচের ফর্মে আপনার Business-এর সমস্যাটি লিখুন এবং পছন্দের সময় জানান।"
                  : "Describe your business problem in the form and tell us your preferred time."
              }
            />
            <div className="surface mt-6 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <CalendarCheck className="size-4 text-nexus" aria-hidden />
                {locale === "bn" ? "আমাদের কর্মঘণ্টা" : "Our working hours"}
              </p>
              <p className="mt-1.5 text-sm text-slate-600">{t(siteConfig.businessHours.display, locale)}</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{t(siteConfig.businessHours.note, locale)}</p>
            </div>
          </div>
          <div>
            <ContactForm locale={locale} />
          </div>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeader eyebrow="FAQ" title={locale === "bn" ? "Call নিয়ে প্রশ্ন" : "Questions about the call"} />
        <div className="mt-6 max-w-3xl">
          <FAQAccordion items={faqs} locale={locale} />
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Book Strategy Call", url: absoluteUrl("/book-call") },
        ]}
      />
    </>
  );
}
