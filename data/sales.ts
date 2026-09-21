import type { LocalizedText } from "@/types";
import { products, getProduct } from "@/data/products";
import { siteConfig } from "@/config/site";

/**
 * Sales knowledge base (Build Spec §07 / §08 / §25 / §30).
 *
 * This is the operational definition of how Nexus Lift sells today:
 * Messenger / WhatsApp first, bKash payment, human verification, no website checkout.
 *
 * Prices are never repeated here — they are read from /data/products.ts so there is
 * exactly one place to change a price.
 */

export const salesChannels = [
  {
    id: "whatsapp",
    label: { bn: "WhatsApp", en: "WhatsApp" } as LocalizedText,
    purpose: {
      bn: "প্রধান অর্ডার ও Support চ্যানেল। Intent এবং Product নাম স্বয়ংক্রিয়ভাবে মেসেজে যুক্ত হয়।",
      en: "Primary ordering and support channel. Intent and product name are added to the message automatically.",
    },
    hrefTemplate: "https://wa.me/{number}",
  },
  {
    id: "messenger",
    label: { bn: "Messenger", en: "Messenger" } as LocalizedText,
    purpose: {
      bn: "প্রধান যোগাযোগ চ্যানেল — যেখানে গ্রাহক আগে থেকেই আছেন।",
      en: "Primary contact channel — where the customer already is.",
    },
    hrefTemplate: siteConfig.facebook,
  },
  {
    id: "web_form",
    label: { bn: "ওয়েবসাইট Form", en: "Website form" } as LocalizedText,
    purpose: {
      bn: "Contact ও Business Audit Submission; অর্ডার নয়। Form তথ্য সিস্টেমে সংরক্ষিত হয়।",
      en: "Contact and business-audit submissions; not orders. Submissions are stored in the system.",
    },
    hrefTemplate: "/contact",
  },
] as const;

/** The canonical order lifecycle. Mirrors the database enum in db/schema.sql. */
export const salesOrderFlow = [
  {
    step: 1,
    id: "inquiry",
    name: { bn: "অনুসন্ধান", en: "Inquiry" } as LocalizedText,
    detail: {
      bn: "গ্রাহক WhatsApp/Messenger-এ যোগাযোগ করেন। অথবা Contact Form/Business Audit Submit করেন।",
      en: "The customer reaches out on WhatsApp/Messenger, or submits the contact form / business audit.",
    },
    system: { bn: "Lead তৈরি হয় (status: New)", en: "A lead is created (status: new)" } as LocalizedText,
  },
  {
    step: 2,
    id: "requirement",
    name: { bn: "প্রয়োজন নির্ধারণ", en: "Requirement" } as LocalizedText,
    detail: {
      bn: "আমরা ব্যবসার ধরন, প্রয়োজন এবং কোন প্যাকেজ উপযুক্ত তা নিশ্চিত করি।",
      en: "We confirm the business type, the need, and which package fits.",
    },
    system: { bn: "Lead status: Qualified", en: "Lead status: qualified" } as LocalizedText,
  },
  {
    step: 3,
    id: "payment",
    name: { bn: "পেমেন্ট", en: "Payment" } as LocalizedText,
    detail: {
      bn: "গ্রাহক bKash-এ পেমেন্ট করেন এবং Transaction ID পাঠান।",
      en: "The customer pays via bKash and sends the transaction ID.",
    },
    system: { bn: "Order তৈরি হয়, payment status: submitted", en: "Order created, payment status: submitted" } as LocalizedText,
  },
  {
    step: 4,
    id: "verification",
    name: { bn: "মানব যাচাই", en: "Human verification" } as LocalizedText,
    detail: {
      bn: "আমাদের টিম Transaction যাচাই করে। যাচাই ছাড়া প্রোডাকশন শুরু হয় না।",
      en: "Our team verifies the transaction. Production never starts before verification.",
    },
    system: { bn: "payment status: verified (শুধু Admin/Webhook)", en: "payment status: verified (admin/webhook only)" } as LocalizedText,
  },
  {
    step: 5,
    id: "delivery",
    name: { bn: "তৈরি ও ডেলিভারি", en: "Build and delivery" } as LocalizedText,
    detail: {
      bn: "নির্ধারিত সময়ের মধ্যে ফাইল/সেটআপ ডেলিভার করা হয়, প্রয়োজনীয় তথ্য যাচাই করে।",
      en: "Files or setup are delivered within the stated timeline and checked against the requirement.",
    },
    system: { bn: "Order status: delivered", en: "Order status: delivered" } as LocalizedText,
  },
  {
    step: 6,
    id: "revision",
    name: { bn: "রিভিশন", en: "Revision" } as LocalizedText,
    detail: {
      bn: "দ্রুত সংশোধনের জন্য 24 ঘণ্টার মধ্যে জানান।",
      en: "Report anything that needs correcting within 24 hours for the fastest turnaround.",
    },
    system: { bn: "Revision event যুক্ত হয়", en: "A revision event is attached" } as LocalizedText,
  },
] as const;

/**
 * The exact structure sent to the customer at each stage.
 * Keeping this structured means an assistant never invents payment details (§62).
 */
export const salesMessageTemplates = {
  paymentInstructions: {
    bn: "পেমেন্ট নম্বর এবং অ্যামাউন্ট আমাদের অফিসিয়াল WhatsApp থেকে নিশ্চিত করুন। পেমেন্টের পর Transaction ID পাঠান — যাচাইয়ের পর আমরা প্রোডাকশন শুরু করি।",
    en: "Confirm the payment number and amount from our official WhatsApp. Send the transaction ID after payment — we start production once it is verified.",
  } as LocalizedText,
  verificationPending: {
    bn: "আপনার পেমেন্ট যাচাই করা হচ্ছে। যাচাই সম্পন্ন হলে আমরা নিশ্চিত করব।",
    en: "Your payment is being verified. We will confirm as soon as verification is complete.",
  } as LocalizedText,
  noAutoVerify: {
    bn: "শুধু Transaction ID পাঠানো মানেই পেমেন্ট নিশ্চিত নয় — আমাদের টিম যাচাই করে।",
    en: "Sending a transaction ID does not confirm payment by itself — our team verifies it.",
  } as LocalizedText,
} as const;

/** Qualification questions used by the sales team (not the public form). */
export const qualificationQuestions = [
  { bn: "ব্যবসার ধরন এবং বর্তমানে কতজন কাজ করেন?", en: "What type of business is it, and how many people work in it today?" },
  { bn: "সবচেয়ে বড় Bottleneck কোনটি?", en: "Which bottleneck hurts the most?" },
  { bn: "SEO Ready বা Social Ready Profile দরকার?", en: "Do you need a SEO-ready or a social-ready profile?" },
  { bn: "৬ মাসে কী অর্জন করতে চান?", en: "What do you want to achieve in six months?" },
  { bn: "সিদ্ধান্ত কে নেবেন এবং কখন?", en: "Who makes the decision, and by when?" },
] as LocalizedText[];

/** Objection handling — answers are grounded in real policies, never in pressure. */
export const objectionHandling = [
  {
    objection: { bn: "এত টাকায় কেন?", en: "Why this price?" },
    response: {
      bn: "প্রতিটি প্যাকেজে কী কী অন্তর্ভুক্ত তা অফলাইন না রেখে পেজেই স্পষ্ট লেখা আছে। আপনি শুধু সেই প্যাকেজ নেবেন যেটি আপনার প্রয়োজন পূরণ করে।",
      en: "Exactly what each package includes is written on the page, not withheld. You only take the package that actually fits your need.",
    },
  },
  {
    objection: { bn: "পরে পেমেন্ট দিতে পারি?", en: "Can I pay later?" },
    response: {
      bn: "আমাদের প্রক্রিয়া সরল: যাচাইকৃত পেমেন্টের পরেই প্রোডাকশন শুরু হয়। এটি আপনার এবং আমাদের দুজনের জন্যই স্পষ্টতা তৈরি করে।",
      en: "Our process is simple: production starts only after verified payment. That keeps things clear for both sides.",
    },
  },
  {
    objection: { bn: "আমার ব্যবসার জন্য কাজ করবে কি?", en: "Will this work for my business?" },
    response: {
      bn: "আমরা গ্যারান্টি দিই না। First step হলো Free Business Audit — সেখানে আপনার অবস্থা দেখে আমরা সৎভাবে বলি কোথায় শুরু করা উচিত।",
      en: "We do not give guarantees. The first step is the free business audit — we read your situation and tell you honestly where to start.",
    },
  },
  {
    objection: { bn: "এখন সময় নেই।", en: "I do not have time right now." },
    response: {
      bn: "সমস্যা নেই — মেসেজ পাঠিয়ে রাখুন। কর্মঘণ্টায় (১০:০০–৫:০০) আমরা উত্তর দেব।",
      en: "That is fine — leave a message. We reply during working hours (10:00 AM–5:00 PM).",
    },
  },
] as const;

/** Cross-sell rules — the next honest step, never an upsell script. */
export const crossSellRules = [
  {
    from: "brand-profile",
    suggest: { bn: "আপনার Structure বা Operations-এ Bottleneck থাকলে প্রথমে Free Business Audit করুন।", en: "If structure or operations is the real bottleneck, start with the free business audit." },
  },
  {
    from: "growth-systems",
    suggest: { bn: "Dashboard ও কন্ট্রোল দরকার হলে Business OS বা Automation Service দেখুন।", en: "If you need dashboards and control, look at Business OS or the automation service." },
  },
] as const;

/**
 * The complete price catalogue, generated from the product data so sales copy can
 * never drift from the product pages.
 */
export function getSalesPriceSheet() {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    currentPrice: product.currentPrice,
    originalPrice: product.originalPrice,
    deliveryTime: product.deliveryTime,
    revisionCount: product.revisionCount,
  }));
}

/** Helper used by assistants: resolve a package by its public name before quoting. */
export function findProductForQuote(query: string) {
  const needle = query.trim().toLowerCase();
  return products.find(
    (product) =>
      product.slug === needle ||
      product.name.en.toLowerCase() === needle ||
      product.name.en.toLowerCase().includes(needle) ||
      product.name.bn.includes(query.trim()),
  );
}

/** Safety rail: only products that exist may ever be quoted. */
export const quotableProductSlugs = products.map((product) => product.slug);
export const isQuotable = (slug: string) => quotableProductSlugs.includes(slug);
export const starterProduct = getProduct("professional-business-starter");
