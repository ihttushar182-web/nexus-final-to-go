/**
 * Single source of truth for site-wide configuration.
 *
 * RULE (Master Build Specification §45 / §46):
 * Product names, prices, contact data, business hours and policies must never be
 * duplicated manually across components. Everything reads from here or from /data.
 *
 * Contact values are configurable through environment variables so the same
 * codebase can run for staging, production or a white-label deployment.
 */

const raw = {
  brandName: "Nexus Lift",
  tagline: {
    bn: "Connecting Sources, Lifting Business",
    en: "Connecting Sources, Lifting Business",
  },
  positioning: {
    bn: "Business Systems & Growth Infrastructure",
    en: "Business Systems & Growth Infrastructure",
  },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "nexusliftbd@gmail.com",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "+8801814716713",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "01814716713",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/nexusliftbd",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexuslift.com",
  businessHours: {
    start: "10:00",
    end: "17:00",
    days: { bn: "প্রতিদিন (শুক্রবার ব্যতীত)", en: "Every day except Friday" },
    timezone: "Asia/Dhaka",
    display: { bn: "সকাল ১০:০০ – বিকাল ৫:০০ (বাংলাদেশ সময়)", en: "10:00 AM – 5:00 PM (Bangladesh time)" },
    note: {
      bn: "নির্ধারিত সময়ের বাইরেও আপনি মেসেজ, সার্ভিস, সমস্যা, বুকিং এবং সিডিউল সম্পর্কে জিজ্ঞাসা করতে পারেন। উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হবে।",
      en: "Outside these hours you can still send messages and ask about services, problems, booking and schedules. Replies are given during the next working hours.",
    },
  },
  timezone: "Asia/Dhaka",
  currency: "BDT",
  currencySymbol: "৳",
  localeDefault: "bn" as const,
  locales: ["bn", "en"] as const,
  payment: {
    methods: {
      bn: ["bKash", "Nagad", "ব্যাংক ট্রান্সফার (আবেদন সাপেক্ষে)"],
      en: ["bKash", "Nagad", "Bank transfer (on request)"],
    },
    note: {
      bn: "পেমেন্ট নিশ্চিতকরণের আগে অর্ডার প্রোডাকশনে যায় না। bKash ট্রানজেকশন আইডি যাচাই করা হয়।",
      en: "Orders do not enter production before payment verification. bKash transaction IDs are verified.",
    },
  },
  socialLinks: [
    { label: "Facebook", href: "https://www.facebook.com/nexusliftbd" },
  ],
  /** Public-facing service identity. Never expose the internal implementation (§13). */
  servicePersona: {
    name: "NL Value Service",
    altName: "NL Customer Service Associate",
  },
} as const;

export type SiteConfig = typeof raw;
export const siteConfig = raw;

/** Hours helper — used by the availability badge. Never implies a human is online outside hours. */
export function getBusinessHoursState(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: siteConfig.timezone,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const weekday = get("weekday");
  const minutes = hour * 60 + minute;
  const [startH, startM] = siteConfig.businessHours.start.split(":").map(Number);
  const [endH, endM] = siteConfig.businessHours.end.split(":").map(Number);
  const open = minutes >= startH * 60 + startM && minutes < endH * 60 + endM;
  return {
    isOpenNow: open,
    weekday,
    localTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  };
}
