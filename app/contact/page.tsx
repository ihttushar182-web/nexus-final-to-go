import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { siteConfig, getBusinessHoursState } from "@/config/site";
import { buildMessengerLink, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { Alert } from "@/components/ui/StateMessage";
import { JsonLd } from "@/components/seo/OrganizationSchema";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact Nexus Lift — WhatsApp, Messenger ও Email",
  description:
    "Nexus Lift-এর সাথে যোগাযোগ করুন — WhatsApp 01814716713, Email nexusliftbd@gmail.com অথবা Facebook Page Messenger। কর্মঘণ্টা: সকাল ১০:০০–বিকাল ৫:০০।",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const locale = await getLocale();
  const hours = getBusinessHoursState();

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Contact" : "Contact"}
        title={locale === "bn" ? "কথা বলুন Nexus Lift-এর সাথে" : "Talk to Nexus Lift"}
        intro={
          locale === "bn"
            ? "আপনার প্রয়োজন বলুন — আমরা প্রথমে বুঝতে চাই সমস্যাটি কোথায়, তারপর জানাবো এটি সমাধানের সঠিক ধাপ কী।"
            : "Tell us what you need — we want to understand where the problem is before telling you what the next step should be."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="grid gap-4 self-start">
            <a
              href={buildWhatsAppLink({ locale })}
              target="_blank"
              rel="noopener noreferrer"
              className="surface card-hover flex items-start gap-3.5 p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#128C7E]/10 text-[#128C7E]">
                <MessageCircle className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-navy">WhatsApp</span>
                <span className="block text-sm text-slate-600">{siteConfig.phoneDisplay}</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {locale === "bn" ? "দ্রুততম উত্তর পাওয়ার উপায়" : "Fastest way to get a reply"}
                </span>
              </span>
            </a>

            <a
              href={buildMessengerLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="surface card-hover flex items-start gap-3.5 p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#1877F2]/10 text-[#1877F2] font-semibold">
                f
              </span>
              <span>
                <span className="block font-semibold text-navy">Facebook Messenger</span>
                <span className="block text-sm text-slate-600">facebook.com/nexusliftbd</span>
                <span className="mt-1 block text-xs text-slate-500">
                  {locale === "bn" ? "Page-এ Message করুন" : "Message the page directly"}
                </span>
              </span>
            </a>

            <a href={`mailto:${siteConfig.email}`} className="surface card-hover flex items-start gap-3.5 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-nexus-50 text-nexus">
                <Mail className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-semibold text-navy">Email</span>
                <span className="block break-all text-sm text-slate-600">{siteConfig.email}</span>
              </span>
            </a>

            <div className="surface p-4">
              <div className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-navy">
                  <Clock className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-navy">{locale === "bn" ? "কর্মঘণ্টা" : "Working hours"}</p>
                  <p className="text-sm text-slate-600">{t(siteConfig.businessHours.display, locale)}</p>
                  <p className="mt-1 inline-flex items-center gap-2 text-xs">
                    <span aria-hidden className={`size-2 rounded-full ${hours.isOpenNow ? "bg-emerald-500" : "bg-amber-500"}`} />
                    {hours.isOpenNow ? (locale === "bn" ? "এখন খোলা" : "Open now") : locale === "bn" ? "এখন বন্ধ" : "Closed now"}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface p-4">
              <div className="flex items-start gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-mist text-navy">
                  <MapPin className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-navy">{locale === "bn" ? "অবস্থান" : "Location"}</p>
                  <p className="text-sm text-slate-600">Dhaka, Bangladesh</p>
                  <p className="mt-1 text-xs text-slate-500">{siteConfig.timezone}</p>
                </div>
              </div>
            </div>

            <Alert tone="info">
              {locale === "bn"
                ? "কর্মঘণ্টার বাইরে আপনি Message, সার্ভিস, সমস্যা, বুকিং এবং সিডিউল নিয়ে জিজ্ঞাসা করতে পারেন — উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হবে।"
                : "Outside working hours you can still send messages and ask about services, problems, bookings and schedules — replies come during the next working hours."}
            </Alert>

            <div className="surface p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <ShieldCheck className="size-4 text-success" aria-hidden />
                {locale === "bn" ? "গোপনীয়তা" : "Confidentiality"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {locale === "bn"
                  ? "আপনার Business Data বাইরে শেয়ার করা হয় না। আপনার তথ্য কীভাবে ব্যবহৃত হয় তা Privacy Policy-তে লেখা আছে।"
                  : "Your business data is not shared externally. How your data is used is set out in our privacy policy."}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <ButtonLink href="/privacy" variant="ghost" size="sm">
                  {locale === "bn" ? "Privacy Policy" : "Privacy policy"}
                </ButtonLink>
                <ButtonLink href="/book-call" variant="ghost" size="sm">
                  {locale === "bn" ? "Strategy Call বুক করুন" : "Book a strategy call"}
                </ButtonLink>
              </div>
            </div>
          </div>

          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "Message" : "Message"}
              title={locale === "bn" ? "ফর্ম পূরণ করুন" : "Fill in the form"}
              description={
                locale === "bn"
                  ? "ফর্ম Submit করলে এটি আমাদের CRM-এ Lead হিসেবে সংরক্ষিত হয় এবং একটি Support Ticket তৈরি হয় — যাতে কোনো Message হারিয়ে না যায়।"
                  : "Submitting the form stores it as a lead in our CRM and opens a support ticket, so no message is lost."
              }
            />
            <div className="mt-6">
              <ContactForm locale={locale} />
            </div>
          </div>
        </div>
      </Section>

      <JsonLd
        id="contact-schema"
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Nexus Lift",
          url: absoluteUrl("/contact"),
          mainEntity: {
            "@type": "Organization",
            name: "Nexus Lift",
            email: siteConfig.email,
            telephone: siteConfig.whatsapp,
          },
        }}
      />

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Contact", url: absoluteUrl("/contact") },
        ]}
      />
    </>
  );
}
