"use client";

import { MessageCircle, Phone } from "lucide-react";
import { FacebookIcon } from "@/components/ui/BrandIcons";
import { cn } from "@/lib/utils";
import { buildMessengerLink, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import { track } from "@/lib/analytics/track";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/types";

type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-[0.95rem]",
};

const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors";

/**
 * WhatsApp CTA (Build Spec §25).
 * The message always carries the product name so the team knows the intent before
 * the conversation starts, and every click is tracked with a consistent event name.
 */
export function WhatsAppButton({
  productName,
  intent,
  locale = "bn",
  ctaLocation,
  productId,
  size = "md",
  className,
  label,
  variant = "solid",
  page,
}: {
  productName?: string;
  intent?: string;
  locale?: Locale;
  ctaLocation?: string;
  productId?: string;
  size?: Size;
  className?: string;
  label?: string;
  variant?: "solid" | "outline";
  page?: string;
}) {
  const href = buildWhatsAppLink({ productName, intent, locale, url: page });
  const text = label ?? (locale === "bn" ? "WhatsApp-এ কথা বলুন" : "Talk on WhatsApp");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        track("whatsapp_click", {
          product_id: productId,
          product_name: productName,
          cta_location: ctaLocation,
          page,
        })
      }
      className={cn(
        base,
        sizes[size],
        variant === "solid"
          ? "bg-[#128C7E] text-white hover:bg-[#0f7a6d]"
          : "border border-line bg-white text-navy hover:border-[#128C7E] hover:text-[#128C7E]",
        className,
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {text}
    </a>
  );
}

export function MessengerButton({
  productName,
  locale = "bn",
  ctaLocation,
  productId,
  size = "md",
  className,
  label,
  variant = "outline",
  page,
}: {
  productName?: string;
  locale?: Locale;
  ctaLocation?: string;
  productId?: string;
  size?: Size;
  className?: string;
  label?: string;
  variant?: "solid" | "outline";
  page?: string;
}) {
  const href = buildMessengerLink(productName ? `product:${productName}` : undefined);
  const text = label ?? (locale === "bn" ? "Messenger-এ Message করুন" : "Message on Messenger");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("messenger_click", { product_id: productId, product_name: productName, cta_location: ctaLocation, page })}
      className={cn(
        base,
        sizes[size],
        variant === "solid"
          ? "bg-[#1877F2] text-white hover:bg-[#1466d4]"
          : "border border-line bg-white text-navy hover:border-[#1877F2] hover:text-[#1877F2]",
        className,
      )}
    >
      <FacebookIcon className="size-4" />
      {text}
    </a>
  );
}

export function CallButton({ className }: { className?: string; locale?: Locale }) {
  return (
    <a
      href={`tel:${siteConfig.whatsapp}`}
      className={cn(base, sizes.md, "border border-line bg-white text-navy hover:border-accent", className)}
    >
      <Phone className="size-4" aria-hidden />
      {siteConfig.phoneDisplay}
    </a>
  );
}
