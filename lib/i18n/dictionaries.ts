import type { Locale, LocalizedText } from "@/types";
import { defaultLocale } from "./config";

/**
 * UI translation dictionary (Build Spec §56).
 *
 * Content that belongs to the business (products, policies, articles) lives in /data.
 * This file holds only interface strings, so components are written once and never
 * duplicated per language.
 */
export const messages = {
  /* navigation */
  "nav.auditCta": { bn: "Free Business Audit", en: "Free Business Audit" },
  "nav.bookCall": { bn: "Book Strategy Call", en: "Book Strategy Call" },
  "nav.menu": { bn: "মেনু", en: "Menu" },
  "nav.close": { bn: "বন্ধ করুন", en: "Close" },
  "nav.language": { bn: "ভাষা", en: "Language" },
  "nav.skipToContent": { bn: "মূল কনটেন্টে যান", en: "Skip to main content" },

  /* common actions */
  "action.diagnose": { bn: "আমার Business Diagnose করুন", en: "Diagnose my business" },
  "action.exploreSolutions": { bn: "Explore Solutions", en: "Explore solutions" },
  "action.exploreFramework": { bn: "Explore Our Framework", en: "Explore our framework" },
  "action.getStarted": { bn: "Get Started", en: "Get started" },
  "action.orderNow": { bn: "Order Now", en: "Order now" },
  "action.whatsapp": { bn: "WhatsApp-এ কথা বলুন", en: "Talk on WhatsApp" },
  "action.messenger": { bn: "Messenger-এ Message করুন", en: "Message on Messenger" },
  "action.askAboutProduct": { bn: "এই পণ্য সম্পর্কে জিজ্ঞাসা করুন", en: "Ask about this product" },
  "action.bookCall": { bn: "Book Your Strategy Call", en: "Book your strategy call" },
  "action.viewAll": { bn: "সব দেখুন", en: "View all" },
  "action.readMore": { bn: "পড়ুন", en: "Read more" },
  "action.back": { bn: "পেছনে", en: "Back" },
  "action.next": { bn: "পরবর্তী", en: "Next" },
  "action.submit": { bn: "Submit", en: "Submit" },
  "action.sending": { bn: "পাঠানো হচ্ছে…", en: "Sending…" },
  "action.talkToUs": { bn: "Talk to Nexus Lift", en: "Talk to Nexus Lift" },
  "action.downloadReport": { bn: "Free Report ডাউনলোড করুন", en: "Download the free report" },

  /* trust strips */
  "trust.freeAudit": { bn: "Free Business Audit", en: "Free business audit" },
  "trust.noObligation": { bn: "No Obligation", en: "No obligation" },
  "trust.instantSnapshot": { bn: "Instant Snapshot", en: "Instant snapshot" },
  "trust.secure": { bn: "Secure Payment", en: "Secure payment" },
  "trust.fastDelivery": { bn: "Fast Delivery", en: "Fast delivery" },
  "trust.support30": { bn: "30-Day Support", en: "30-day support" },
  "trust.confidential": { bn: "Confidential", en: "Confidential" },
  "trust.expertAdvice": { bn: "Expert Advice", en: "Expert advice" },

  /* product page */
  "product.bestFor": { bn: "কার জন্য", en: "Best for" },
  "product.problem": { bn: "সমস্যা", en: "The problem" },
  "product.outcome": { bn: "ফলাফল", en: "The outcome" },
  "product.whatYouGet": { bn: "আপনি যা পাবেন", en: "What you get" },
  "product.features": { bn: "Features", en: "Features" },
  "product.process": { bn: "কীভাবে কাজ করে", en: "How it works" },
  "product.delivery": { bn: "Delivery", en: "Delivery" },
  "product.deliveryTime": { bn: "Timeline", en: "Timeline" },
  "product.deliveryFormat": { bn: "Format", en: "Format" },
  "product.revisions": { bn: "Revision ও Support", en: "Revisions & support" },
  "product.requirements": { bn: "আপনার কাছ থেকে যা দরকার", en: "What we need from you" },
  "product.price": { bn: "মূল্য", en: "Price" },
  "product.startingFrom": { bn: "শুরু", en: "Starting from" },
  "product.originalPrice": { bn: "পূর্বের মূল্য", en: "Original price" },
  "product.save": { bn: "সাশ্রয়", en: "You save" },
  "product.faq": { bn: "সাধারণ প্রশ্ন", en: "FAQ" },
  "product.related": { bn: "সম্পর্কিত পণ্য", en: "Related products" },
  "product.tbc": { bn: "Details to be confirmed", en: "Details to be confirmed" },
  "product.orderNote": {
    bn: "অর্ডার নিশ্চিত হয় WhatsApp/Messenger-এ কথা বলার পর। পেমেন্ট bKash-এ।",
    en: "Orders are confirmed after a WhatsApp/Messenger conversation. Payment via bKash.",
  },
  "product.notFound": { bn: "পণ্যটি খুঁজে পাওয়া যায়নি", en: "Product not found" },

  /* audit */
  "audit.title": { bn: "Free Business Audit", en: "Free Business Audit" },
  "audit.start": { bn: "Start My Diagnosis", en: "Start my diagnosis" },
  "audit.formTitle": { bn: "আপনার Business Audit শুরু করুন", en: "Start your business audit" },
  "audit.stepOf": { bn: "ধাপ {step} / {total}", en: "Step {step} of {total}" },
  "audit.progress": { bn: "অগ্রগতি", en: "Progress" },
  "audit.answerYes": { bn: "হ্যাঁ", en: "Yes" },
  "audit.answerPartial": { bn: "আংশিক", en: "Partial" },
  "audit.answerNo": { bn: "না", en: "No" },
  "audit.required": { bn: "এই তথ্যটি প্রয়োজন", en: "This field is required" },
  "audit.errorGeneric": { bn: "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।", en: "Something went wrong. Please try again." },
  "audit.resultTitle": { bn: "Your Business Snapshot is Ready", en: "Your business snapshot is ready" },
  "audit.snapshot": { bn: "The Snapshot", en: "The snapshot" },
  "audit.diagnosis": { bn: "The Diagnosis", en: "The diagnosis" },
  "audit.evidence": { bn: "Evidence", en: "Evidence" },
  "audit.solutionPath": { bn: "The Solution Path", en: "The solution path" },
  "audit.lowest": { bn: "সবচেয়ে দুর্বল", en: "Lowest" },
  "audit.scoreNote": {
    bn: "স্কোর Yes=10, Partial=5, No=0 হিসেবে হিসাব করা হয়। এটি একটি Diagnostic Aid — বৈজ্ঞানিকভাবে যাচাইকৃত স্কোর নয়।",
    en: "Scores use Yes=10, Partial=5, No=0. This is a diagnostic aid, not a scientifically validated score.",
  },
  "audit.notFound": {
    bn: "এই Audit রিপোর্টটি পাওয়া যায়নি। অনুগ্রহ করে আবার Audit করুন।",
    en: "This audit report could not be found. Please run the audit again.",
  },

  /* book call */
  "call.empty": {
    bn: "সব Slot এই মুহূর্তে আমাদের টিম হাতে হাতে নিশ্চিত করে — নিচের ফর্মটি পূরণ করুন অথবা সরাসরি WhatsApp করুন।",
    en: "Slots are confirmed individually by our team — fill in the form below or message us directly on WhatsApp.",
  },

  /* contact */
  "contact.title": { bn: "Contact Nexus Lift", en: "Contact Nexus Lift" },
  "contact.hours": { bn: "কর্মঘণ্টা", en: "Working hours" },
  "contact.outsideHours": {
    bn: "কর্মঘণ্টার বাইরে Message করলে উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হবে।",
    en: "Messages sent outside working hours are answered during the next working hours.",
  },
  "contact.openNow": { bn: "এখন কর্মঘণ্টা চলছে", en: "Currently within working hours" },
  "contact.closedNow": { bn: "এখন কর্মঘণ্টার বাইরে", en: "Currently outside working hours" },
  "contact.sent": { bn: "আপনার Message পৌঁছেছে ✅", en: "Your message has been received ✅" },
  "contact.sentNote": {
    bn: "আমাদের টিম কর্মঘণ্টায় যোগাযোগ করবে। জরুরি হলে WhatsApp করুন।",
    en: "Our team will respond during working hours. For anything urgent, use WhatsApp.",
  },

  /* admin */
  "admin.title": { bn: "Admin", en: "Admin" },
  "admin.signIn": { bn: "Sign in", en: "Sign in" },
  "admin.signOut": { bn: "Sign out", en: "Sign out" },
  "admin.invalidCredentials": { bn: "Email বা password সঠিক নয়।", en: "Email or password is incorrect." },

  /* footer */
  "footer.rights": { bn: "সর্বস্বত্ব সংরক্ষিত", en: "All rights reserved" },
  "footer.builtNote": {
    bn: "আমরা কোনো Guaranteed Growth, Revenue বা ROI দাবি করি না। ফলাফল ক্লায়েন্টের প্রেক্ষাপট অনুযায়ী ভিন্ন হয়।",
    en: "We make no guaranteed growth, revenue or ROI claims. Outcomes vary with each client's context.",
  },
  "footer.futureNote": {
    bn: "Customer portal শীঘ্রই আসছে",
    en: "Customer portal coming soon",
  },

  /* states */
  "state.loading": { bn: "লোড হচ্ছে…", en: "Loading…" },
  "state.empty": { bn: "এখনো কোনো তথ্য নেই।", en: "Nothing here yet." },
  "state.error": { bn: "তথ্য লোড করা যায়নি।", en: "We could not load this data." },
  "state.retry": { bn: "আবার চেষ্টা করুন", en: "Try again" },
  "state.notFound": { bn: "পেজটি খুঁজে পাওয়া যায়নি", en: "Page not found" },
  "state.notFoundNote": {
    bn: "লিংকটি হয়তো পরিবর্তিত হয়েছে। নিচের পথগুলো ব্যবহার করে চালিয়ে যান।",
    en: "The link may have changed. Continue using one of the paths below.",
  },
} satisfies Record<string, LocalizedText>;

export type MessageKey = keyof typeof messages;

export function translate(key: MessageKey, locale: Locale = defaultLocale): string {
  const entry = messages[key];
  return entry?.[locale] ?? entry?.[defaultLocale] ?? String(key);
}

/** Tiny interpolation helper: format("a {x}", { x: 1 }) */
export function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, token) => String(values[token] ?? `{${token}}`));
}

export function createTranslator(locale: Locale) {
  return (key: MessageKey, values?: Record<string, string | number>) => {
    const base = translate(key, locale);
    return values ? interpolate(base, values) : base;
  };
}
