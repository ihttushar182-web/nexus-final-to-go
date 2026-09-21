import { getLocale } from "@/lib/i18n/server";
import { siteConfig } from "@/config/site";
import { t } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/Breadcrumb";
import { CheckList } from "@/components/ui/Timeline";
import { Alert } from "@/components/ui/StateMessage";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";

/**
 * Future-ready routes (Build Spec §15 / §51).
 * These pages exist so the URL structure and navigation are already correct; the
 * authenticated portal itself is intentionally not built for the MVP.
 */
export async function PortalPlaceholder({
  slug,
  title,
  intro,
}: {
  slug: string;
  title: { bn: string; en: string };
  intro: { bn: string; en: string };
}) {
  const locale = await getLocale();

  const capabilities = [
    { bn: "Orders ও Order History", en: "Orders and order history" },
    { bn: "Payment Status (যাচাইকৃত)", en: "Payment status (verified)" },
    { bn: "Delivery Files ডাউনলোড", en: "Delivery file downloads" },
    { bn: "Revision Request", en: "Revision requests" },
    { bn: "Support Tickets", en: "Support tickets" },
    { bn: "Profile ও Invoice", en: "Profile and invoices" },
  ];

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "শীঘ্রই আসছে" : "Coming soon"}
        title={t(title, locale)}
        intro={t(intro, locale)}
        breadcrumb={[{ href: "/", label: "Home" }, { label: t(title, locale) }]}
      />

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeader
              eyebrow={locale === "bn" ? "Portal Architecture" : "Portal architecture"}
              title={locale === "bn" ? "Portal-এ যা থাকবে" : "What the portal will include"}
              description={
                locale === "bn"
                  ? "আমাদের ডেটাবেসে ইতিমধ্যেই Order, Payment Event, Delivery এবং Revision টেবিল প্রস্তুত — তাই Portal চালু করা নতুন করে সিস্টেম বানানোর কাজ নয়।"
                  : "The database already has orders, payment events, deliveries and revisions modelled, so enabling the portal is not a rebuild."
              }
            />
            <div className="mt-6">
              <CheckList columns={2} items={capabilities.map((item) => item[locale])} />
            </div>
          </div>

          <div>
            <Alert tone="info" title={locale === "bn" ? "এখন কী করবেন?" : "What to do right now"}>
              {locale === "bn"
                ? "Portal চালু হওয়ার আগে অর্ডার, পেমেন্ট যাচাই এবং ডেলিভারি নিশ্চিত করা হয় WhatsApp/Messenger-এ আমাদের টিমের মাধ্যমে — কর্মঘণ্টায় (সকাল ১০:০০–বিকাল ৫:০০)।"
                : "Until the portal is enabled, orders, payment verification and delivery are confirmed with our team over WhatsApp/Messenger during working hours (10:00 AM–5:00 PM)."}
            </Alert>

            <div className="mt-5 flex flex-wrap gap-3">
              <WhatsAppButton
                locale={locale}
                ctaLocation={`portal_${slug}`}
                page={`/${slug}`}
                intent={locale === "bn" ? "আমার অর্ডার / পেমেন্ট নিয়ে জানতে চাই।" : "I would like to check my order or payment."}
              />
              <ButtonLink href="/business-audit" variant="outline">
                {locale === "bn" ? "Free Business Audit" : "Free business audit"}
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost">
                {locale === "bn" ? "Contact" : "Contact"}
              </ButtonLink>
            </div>

            <div className="surface mt-6 p-5">
              <p className="text-sm font-semibold text-navy">{locale === "bn" ? "Support" : "Support"}</p>
              <p className="mt-2 text-sm text-slate-600">
                {siteConfig.email} · {siteConfig.phoneDisplay}
              </p>
              <p className="mt-1 text-xs text-slate-500">{t(siteConfig.businessHours.display, locale)}</p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
