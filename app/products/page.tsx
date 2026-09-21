import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n/server";
import { products } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ProductGrid } from "@/components/product/ProductCard";
import { PageHero, BreadcrumbJsonLd } from "@/components/ui/Breadcrumb";
import { Alert } from "@/components/ui/StateMessage";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import { absoluteUrl } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products — SOP, CRM, Business OS ও Business Profile প্যাকেজ",
  description:
    "Nexus Lift-এর প্রোডাক্ট ক্যাটালগ: Professional Business Profile (Starter/Growth/Premium), Brand Identity System, SOP & Process System, CRM & Customer System এবং Business OS & CEO Dashboard।",
  alternates: { canonical: "/products" },
};

export default async function ProductsPage() {
  const locale = await getLocale();
  const brandProducts = products.filter((product) => product.id.startsWith("pbp-"));
  const systemProducts = products.filter((product) => !product.id.startsWith("pbp-") && product.category !== "hosting-infrastructure");

  const grouped = solutionCategories
    .map((category) => ({
      category,
      items: systemProducts.filter((product) => product.category === category.id),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHero
        eyebrow={locale === "bn" ? "Products" : "Products"}
        title={locale === "bn" ? "নির্দিষ্ট Scope, নির্দিষ্ট দাম" : "Defined scope, defined price"}
        intro={
          locale === "bn"
            ? "প্রতিটি পণ্যের Scope, Deliverable, Delivery Format এবং Revision নীতি আগেই লেখা থাকে — যাতে কেনার আগে আপনি জানেন ঠিক কী পাচ্ছেন।"
            : "Every product states its scope, deliverables, delivery format and revision policy up front — so you know exactly what you are getting before you buy."
        }
        breadcrumb={[{ href: "/", label: "Home" }, { label: "Products" }]}
      >
        <WhatsAppButton
          locale={locale}
          ctaLocation="products_hero"
          page="/products"
          variant="outline"
          label={locale === "bn" ? "কোনটি আমার জন্য? WhatsApp করুন" : "Not sure which one? Ask on WhatsApp"}
        />
      </PageHero>

      <Section tone="white">
        <SectionHeader
          eyebrow={locale === "bn" ? "Business Profile প্যাকেজ" : "Business profile packages"}
          title={locale === "bn" ? "Professional Business Profile" : "Professional business profile"}
          description={
            locale === "bn"
              ? "চলতি অফারে তিনটি স্তর — Starter, Growth এবং Premium। প্রতিটিতে ২ রাউন্ড Revision এবং Editable ফাইল অন্তর্ভুক্ত।"
              : "Three tiers at current pricing — Starter, Growth and Premium. Every tier includes two revision rounds and editable files."
          }
        />
        <div className="mt-8">
          <ProductGrid products={brandProducts} locale={locale} />
        </div>
      </Section>

      {grouped.map((group) => (
        <Section key={group.category.id} tone="mist">
          <SectionHeader
            eyebrow={group.category.name.en}
            title={group.category.headline[locale]}
            description={group.category.summary[locale]}
            action={
              <Link href={`/solutions/${group.category.slug}`} className="text-sm font-semibold text-nexus hover:underline">
                {locale === "bn" ? "Solution দেখুন" : "See the solution"} →
              </Link>
            }
          />
          <div className="mt-8">
            <ProductGrid products={group.items} locale={locale} />
          </div>
        </Section>
      ))}

      <Section tone="white">
        <Alert tone="info" title={locale === "bn" ? "Order ও Delivery সম্পর্কে" : "How ordering and delivery work"}>
          {locale === "bn"
            ? "Website-এ এখন Direct Checkout নেই। আপনি প্রথমে Messenger অথবা WhatsApp-এ আমাদের সাথে কথা বলেন, Scope নিশ্চিত হয়, তারপর bKash-এ পেমেন্ট নেওয়া হয়। পেমেন্ট যাচাইয়ের পর Production শুরু হয়, ডেলিভারি হয় Print-ready PDF ও Editable Word ফাইলে, এবং ২ রাউন্ড Revision অন্তর্ভুক্ত।"
            : "There is no direct checkout on the website yet. You speak with us on Messenger or WhatsApp first, the scope is confirmed, and payment is taken via bKash. Production begins after payment verification; delivery is a print-ready PDF and an editable Word file, with two revision rounds included."}
        </Alert>
      </Section>

      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: absoluteUrl("/") },
          { name: "Products", url: absoluteUrl("/products") },
        ]}
      />
    </>
  );
}
