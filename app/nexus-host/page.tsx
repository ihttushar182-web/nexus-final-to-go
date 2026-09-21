import type { Metadata } from "next";
import { ShieldCheck, Zap, RefreshCw, Headphones } from "lucide-react";
import { getLocale } from "@/lib/i18n/server";
import { hostingPlans } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { formatCurrency, t, absoluteUrl } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { CheckList, ProcessTimeline } from "@/components/ui/Timeline";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/StateMessage";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";

export const metadata: Metadata = {
  title: "Nexus Host — Domain, Hosting ও Digital Infrastructure",
  description:
    "Nexus Host: Starter ৳250/mo, Business ৳450/mo এবং Growth ৳850/mo — Free SSL, Free Migration, Daily Backup, 24/7 Business Support এবং 99.9% Uptime।",
  alternates: { canonical: "/nexus-host" },
};

const trustPoints = [
  { icon: ShieldCheck, label: { bn: "Free SSL", en: "Free SSL" } },
  { icon: RefreshCw, label: { bn: "Free Migration", en: "Free migration" } },
  { icon: Headphones, label: { bn: "24/7 Business Support", en: "24/7 business support" } },
  { icon: Zap, label: { bn: "99.9% Uptime", en: "99.9% uptime" } },
];

export default async function NexusHostPage() {
  const locale = await getLocale();
  const hostingCategory = solutionCategories.find((category) => category.id === "hosting-infrastructure")!;

  return (
    <>
      <PageHero
        eyebrow="Nexus Host"
        title={locale === "bn" ? "Nexus Host — Your Digital Base" : "Nexus Host — your digital base"}
        intro={
          locale === "bn"
            ? "Hosting এর পরে কী? Website → SEO → CRM → Automation → AI → Dashboard। আপনার Business যখন Grow করবে, আমরা পাশে আছি — একই জায়গায় Hosting আর Business System।"
            : "What comes after hosting? Website → SEO → CRM → automation → AI → dashboard. As your business grows we stay beside it — hosting and business systems in one place."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Nexus Host" }]}
      >
        <div className="flex flex-wrap gap-3">
          <WhatsAppButton
            locale={locale}
            ctaLocation="nexus_host_hero"
            page="/nexus-host"
            intent={locale === "bn" ? "আমি Nexus Host সম্পর্কে জানতে চাই।" : "I would like to know more about Nexus Host."}
            size="lg"
          />
          <ButtonLink href="/contact" variant="outline" size="lg">
            {locale === "bn" ? "Plan নিয়ে কথা বলুন" : "Talk about a plan"}
          </ButtonLink>
        </div>
      </PageHero>

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Plans" : "Plans"}
          title={locale === "bn" ? "Hosting Plans" : "Hosting plans"}
          description={
            locale === "bn"
              ? "প্রতিটি Plan-এ NVMe Storage, Free SSL, Daily Backup এবং 24/7 Business Support অন্তর্ভুক্ত। Migration প্রয়োজন হলে Free Migration পাবেন।"
              : "Every plan includes NVMe storage, free SSL, daily backup and 24/7 business support. Where migration is needed, it is included."
          }
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {hostingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`surface flex h-full flex-col p-5 sm:p-6 ${plan.badge ? "border-nexus/40 shadow-lift ring-1 ring-nexus/12" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base">{t(plan.name, locale)}</h3>
                {plan.badge ? <Badge tone="brand" size="sm">{t(plan.badge, locale)}</Badge> : null}
              </div>
              <p className="mt-3 font-display text-3xl font-semibold text-navy tabular-nums">
                {formatCurrency(plan.price)}
                <span className="text-sm font-medium text-slate-500">/{locale === "bn" ? "মাস" : "mo"}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(plan.summary, locale)}</p>
              <CheckList className="mt-4 flex-1" items={locale === "bn" ? plan.features.bn : plan.features.en} />
              <div className="mt-6 grid gap-2">
                <WhatsAppButton
                  locale={locale}
                  ctaLocation={`host_${plan.slug}`}
                  page="/nexus-host"
                  productName={t(plan.name, locale)}
                  size="md"
                  className="w-full"
                />
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.label.en} className="inline-flex items-center gap-2 text-sm text-slate-600">
                <Icon className="size-4 text-success" aria-hidden />
                {point.label[locale]}
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="mist">
        <SectionHeader
          eyebrow={locale === "bn" ? "Roadmap" : "Roadmap"}
          title={locale === "bn" ? "Nexus Host যেভাবে প্রস্তুত হচ্ছে" : "How Nexus Host will expand"}
          description={
            locale === "bn"
              ? "বর্তমানে Domain ও Shared/Business Hosting সক্রিয়। Reseller, White Label এবং Managed Hosting-এর দাম এখনো নিশ্চিত করা হয়নি — তাই আমরা কোনো মূল্য ঘোষণা করছি না।"
              : "Domain and shared/business hosting are active today. Pricing for reseller, white label and managed hosting is not yet confirmed, so we are not publishing a price for them."
          }
        />
        <div className="mt-8">
          <ProcessTimeline
            steps={[
              { code: "01", title: locale === "bn" ? "Domain" : "Domain", description: ".com, .net, .shop এবং ভবিষ্যতে আরও TLD।" },
              { code: "02", title: locale === "bn" ? "Shared Hosting" : "Shared hosting", description: "Starter, Basic, Business, Growth, Pro — বর্তমানে Starter/Business/Growth সক্রিয়।" },
              { code: "03", title: locale === "bn" ? "Business Hosting" : "Business hosting", description: "Business Email, Priority Support এবং Migration সহ।" },
              { code: "04", title: locale === "bn" ? "Reseller & White Label" : "Reseller & white label", description: "এজেন্সি ও হোস্টিং সেলারদের জন্য — মূল্য নির্ধারণাধীন।" },
              { code: "05", title: locale === "bn" ? "Managed Hosting" : "Managed hosting", description: "Setup, Migration, Security এবং Maintenance সহ সম্পূর্ণ ব্যবস্থাপনা — মূল্য নির্ধারণাধীন।" },
              { code: "06", title: locale === "bn" ? "WordPress Hosting" : "WordPress hosting", description: "WordPress-নির্দিষ্ট পরিবেশ এবং সুরক্ষা।" },
            ]}
          />
        </div>
        <Alert tone="warning" className="mt-6">
          {locale === "bn"
            ? "Reseller, White Label, Managed এবং WordPress Hosting-এর দাম এখনো অফিসিয়ালি নির্ধারিত হয়নি। তাই এই পেজে সেগুলোর কোনো মূল্য দেখানো হয়নি — Scope নির্ধারিত হলে আমরা জানাবো।"
            : "Pricing for reseller, white label, managed and WordPress hosting has not been officially set. No price is shown for them here — we will publish one once the scope is confirmed."}
        </Alert>
      </Section>

      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <SectionHeader eyebrow={t(hostingCategory.name, locale)} title={locale === "bn" ? "Hosting Layer-এ যা যা থাকবে" : "What the hosting layer covers"} />
            <div className="mt-6">
              <CheckList columns={2} items={hostingCategory.capabilities[locale]} />
            </div>
          </div>
          <div className="surface p-6">
            <h3 className="text-base">{locale === "bn" ? "কেন Hosting আমাদের কাছে?" : "Why hosting from us?"}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {locale === "bn"
                ? "কারণ Hosting আলাদা কোনো পণ্য নয় — এটি আপনার Digital Base। একই জায়গায় Hosting, Website, SEO, CRM এবং Dashboard হলে Support দ্রুত হয় এবং দায় কারও উপর ছাড়ার প্রশ্ন আসে না।"
                : "Because hosting is not a separate product — it is your digital base. When hosting, website, SEO, CRM and dashboards live in one place, support is faster and nothing falls between vendors."}
            </p>
            <div className="mt-5 grid gap-2">
              <WhatsAppButton
                locale={locale}
                ctaLocation="nexus_host_footer"
                page="/nexus-host"
                intent={locale === "bn" ? "আমার Hosting প্রয়োজন নিয়ে কথা বলতে চাই।" : "I would like to discuss my hosting requirement."}
              />
              <ButtonLink href="/solutions/hosting-infrastructure" variant="outline">
                {locale === "bn" ? "Hosting Solution দেখুন" : "See the hosting solution"}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Nexus Host", url: absoluteUrl("/nexus-host") },
        ]}
      />
    </>
  );
}
