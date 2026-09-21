import { siteConfig } from "@/config/site";
import { normalizePhone } from "@/lib/utils";
import type { Locale } from "@/types";

/**
 * WhatsApp CTA utility (Build Spec §25).
 * Every WhatsApp action in the product goes through this helper so the phone number
 * stays configurable and the pre-filled message always carries product context.
 */

export interface WhatsAppContext {
  productName?: string;
  intent?: string;
  url?: string;
  locale?: Locale;
}

export function buildWhatsAppMessage(context: WhatsAppContext = {}): string {
  const { productName, intent, url, locale = "bn" } = context;

  if (productName) {
    if (locale === "bn") {
      const base = `আমি ${productName} সম্পর্কে জানতে চাই।`;
      return url ? `${base}\nProduct link: ${url}` : base;
    }
    const base = `I would like to know more about ${productName}.`;
    return url ? `${base}\nProduct link: ${url}` : base;
  }

  if (intent) return intent;

  return locale === "bn"
    ? "আমি Nexus Lift এর সেবা সম্পর্কে জানতে চাই।"
    : "I would like to know more about Nexus Lift services.";
}

export function buildWhatsAppLink(context: WhatsAppContext = {}): string {
  const number = normalizePhone(siteConfig.whatsapp);
  const text = encodeURIComponent(buildWhatsAppMessage(context));
  return `https://wa.me/${number}?text=${text}`;
}

export function whatsAppLinkForProduct(productName: string, url?: string, locale: Locale = "bn") {
  return buildWhatsAppLink({ productName, url, locale });
}

/** Messenger deep link. Falls back to the page URL when no direct link is configured. */
export function buildMessengerLink(intent?: string): string {
  const configured = process.env.NEXT_PUBLIC_MESSENGER_URL;
  if (configured) return configured;
  const page = siteConfig.facebook;
  return intent ? `${page}?ref=${encodeURIComponent(intent)}` : page;
}
