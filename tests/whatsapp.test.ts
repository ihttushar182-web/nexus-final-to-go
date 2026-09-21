import { describe, expect, it, vi, afterEach } from "vitest";
import { buildMessengerLink, buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/integrations/whatsapp";
import { siteConfig } from "@/config/site";
import { normalizePhone } from "@/lib/utils";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("WhatsApp CTA contract (§25)", () => {
  it("carries the product name and intent through encoded query params", () => {
    const link = buildWhatsAppLink({
      productName: "Professional Business Profile — Starter",
      intent: "I want to start today",
      url: "/products/professional-business-starter",
      locale: "en",
    });

    expect(link.startsWith("https://wa.me/")).toBe(true);
    expect(link).not.toContain(" "); // must be a valid, encodable URL
    const text = decodeURIComponent(link.split("?text=")[1]);
    expect(text).toContain("Professional Business Profile — Starter");
    // Product context wins over the generic intent, so the team always sees the product.
    expect(text).toContain("/products/professional-business-starter");
  });

  it("falls back to the intent, then to a safe default — never an empty message", () => {
    expect(decodeURIComponent(buildWhatsAppLink({ intent: "Help with my site" }).split("?text=")[1])).toBe(
      "Help with my site",
    );
    expect(buildWhatsAppMessage({ locale: "bn" })).toContain("Nexus Lift");
    expect(buildWhatsAppMessage({ locale: "en" })).toContain("Nexus Lift");
  });

  it("writes the message in the visitor's language", () => {
    expect(buildWhatsAppMessage({ productName: "Starter", locale: "bn" })).toContain("সম্পর্কে");
    expect(buildWhatsAppMessage({ productName: "Starter", locale: "en" })).toContain("I would like to know more about");
  });

  it("derives the number from a single configuration point, never a literal", () => {
    // NEXT_PUBLIC_* values are inlined by Next at build time, so the number is read
    // once in /config/site.ts. This asserts the link is built from siteConfig rather
    // than a number repeated somewhere in a component.
    const link = buildWhatsAppLink({ locale: "en" });
    expect(link).toContain(`https://wa.me/${normalizePhone(siteConfig.whatsapp)}`);
    expect(siteConfig.whatsapp).toMatch(/^\+?\d{8,15}$/);
  });

  it("normalises local Bangladeshi formats to an international number", () => {
    expect(normalizePhone("01814716713")).toBe("8801814716713");
    expect(normalizePhone("+880 1814-716713")).toBe("8801814716713");
  });

  it("builds a Messenger link that never dead-ends", () => {
    expect(buildMessengerLink()).toContain("facebook.com");
    expect(buildMessengerLink("pricing question")).toContain("facebook.com");
  });
});
