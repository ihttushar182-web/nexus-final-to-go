import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import { getLocale } from "@/lib/i18n/server";
import { localeMeta } from "@/lib/i18n/config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import "./globals.css";

/**
 * Self-hosted fonts (Build Spec §39).
 * Files live in app/fonts and are copied from the official @fontsource packages
 * (see `npm run fonts:sync`), so the production build never depends on an external
 * font request. Latin copy renders in Inter / Space Grotesk, Bengali in Hind Siliguri.
 */
const inter = localFont({
  src: [{ path: "./fonts/inter-latin-variable.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const spaceGrotesk = localFont({
  src: [{ path: "./fonts/space-grotesk-latin-variable.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const hindSiliguri = localFont({
  src: [
    { path: "./fonts/hind-siliguri-bengali-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/hind-siliguri-bengali-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/hind-siliguri-bengali-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-hind-siliguri",
  display: "swap",
  fallback: ["var(--font-inter)", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.brandName} — ${siteConfig.tagline.bn}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "Nexus Lift helps businesses identify bottlenecks, build connected business systems and create the digital infrastructure needed to operate, grow and improve.",
  applicationName: siteConfig.brandName,
  authors: [{ name: siteConfig.brandName, url: siteConfig.siteUrl }],
  creator: siteConfig.brandName,
  publisher: siteConfig.brandName,
  keywords: [
    "Business System",
    "SOP",
    "CRM",
    "Business Dashboard",
    "Automation",
    "Bangladesh SME",
    "Business Audit",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    title: `${siteConfig.brandName} — ${siteConfig.tagline.bn}`,
    description:
      "Connecting Sources, Lifting Business — brand, structure, operations, growth, intelligence and control in one connected system.",
    url: siteConfig.siteUrl,
    locale: "bn_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brandName} — Connecting Sources, Lifting Business`,
    description:
      "Business chaos থেকে systematic growth — free business audit, SOP systems, CRM, dashboards and automation.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "business",
};

export const viewport: Viewport = {
  themeColor: "#1C2F4D",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html
      lang={localeMeta[locale].htmlLang}
      data-locale={locale}
      className={`${inter.variable} ${spaceGrotesk.variable} ${hindSiliguri.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-white antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          মূল কনটেন্টে যান / Skip to main content
        </a>
        <Suspense fallback={null}>
          <Navbar locale={locale} />
        </Suspense>
        <main id="main" className="min-h-[60vh]">
          {children}
        </main>
        <Footer locale={locale} />
        <OrganizationSchema />
      </body>
    </html>
  );
}
