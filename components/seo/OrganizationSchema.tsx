import { siteConfig } from "@/config/site";

/**
 * Organization + WebSite structured data.
 * Only facts that appear on the page itself are included (Build Spec §35 — no fake schema).
 */
export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.siteUrl}/#organization`,
        name: siteConfig.brandName,
        url: siteConfig.siteUrl,
        email: siteConfig.email,
        telephone: siteConfig.whatsapp,
        slogan: siteConfig.tagline.en,
        description:
          "Nexus Lift helps businesses identify bottlenecks, build connected business systems and create the digital infrastructure needed to operate, grow and improve.",
        areaServed: "BD",
        address: {
          "@type": "PostalAddress",
          addressCountry: "BD",
          addressLocality: "Dhaka",
        },
        sameAs: [siteConfig.facebook],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer service",
            telephone: siteConfig.whatsapp,
            email: siteConfig.email,
            availableLanguage: ["Bengali", "English"],
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
              opens: siteConfig.businessHours.start,
              closes: siteConfig.businessHours.end,
            },
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.siteUrl}/#website`,
        url: siteConfig.siteUrl,
        name: siteConfig.brandName,
        publisher: { "@id": `${siteConfig.siteUrl}/#organization` },
        inLanguage: ["bn-BD", "en"],
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function JsonLd({ data, id }: { data: Record<string, unknown>; id?: string }) {
  return <script id={id} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
