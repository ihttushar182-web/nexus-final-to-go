import type { LocalizedText, Product } from "@/types";

/**
 * PRODUCT DATA — single source of truth (Build Spec §44 / §45).
 *
 * Pricing rules:
 *  - Only prices supplied by Nexus Lift operations appear here.
 *  - Where a specification has not been supplied, the field is explicitly marked
 *    "Details to be confirmed" instead of being invented (Build Spec §09 / §62).
 */
export const TBC: LocalizedText = {
  bn: "Details to be confirmed",
  en: "Details to be confirmed",
};

/** Confirmed fulfilment terms for all current digital products (Build Spec §07 / §10). */
const digitalDeliveryFormat: LocalizedText = {
  bn: "Print-ready PDF + Editable Word ডকুমেন্ট",
  en: "Print-ready PDF + editable Word document",
};

const standardRevisionPolicy: LocalizedText = {
  bn: "২ রাউন্ড রিভিশন অন্তর্ভুক্ত। এর বেশি পরিবর্তনের প্রয়োজন হলে Scope অনুযায়ী আলোচনা করা হবে।",
  en: "Two rounds of revision are included. Further changes are discussed against scope.",
};

const orderViaChannel: LocalizedText = {
  bn: "অর্ডার নিশ্চিত হয় WhatsApp / Messenger-এ কথা বলার পর। পেমেন্ট bKash-এ গ্রহণ করা হয়।",
  en: "Orders are confirmed after a WhatsApp / Messenger conversation. Payment is taken via bKash.",
};

export const products: Product[] = [
  /* ───────────────────────── Business Profile products ───────────────────────── */
  {
    id: "pbp-starter",
    slug: "professional-business-starter",
    name: { bn: "Professional Business Profile — Starter", en: "Professional Business Profile — Starter" },
    category: "brand-identity",
    layer: "identity",
    shortDescription: {
      bn: "যে ব্যবসার একটি পরিষ্কার, পেশাদার পরিচিতি দরকার — শুরু করার জন্য সবচেয়ে সহজ ধাপ।",
      en: "For businesses that need a clear, professional introduction — the simplest first step.",
    },
    description: {
      bn: "Professional Business Profile — Starter হলো একটি প্রস্তুত, পেশাদার Business Profile যা আপনার ব্যবসার পরিচয় কাস্টমার, পার্টনার এবং ইনভেস্টরের সামনে পরিষ্কারভাবে উপস্থাপন করে। আমরা লেখা ও ফরম্যাটিং করি, আপনি পাবেন PDF এবং Editable Word।",
      en: "Professional Business Profile — Starter is a prepared, professional business profile that presents your business clearly to customers, partners and investors. We write it and format it; you receive a PDF and an editable Word file.",
    },
    targetCustomer: {
      bn: "ছোট ব্যবসা, নতুন উদ্যোগ, ফ্রিল্যান্সার-টু-এজেন্সি, যাদের এখনো কোনো লিখিত Business Profile নেই।",
      en: "Small businesses, new ventures and freelancers turning into agencies who do not yet have a written business profile.",
    },
    problem: {
      bn: "কাস্টমার জিজ্ঞেস করলে মুখে মুখে পরিচয় দিতে হয়। কোনো ডকুমেন্ট নেই যা পাঠানো যায়।",
      en: "When a customer asks, the introduction has to be given verbally. There is no document that can simply be sent.",
    },
    outcome: {
      bn: "একটি পেশাদার ডকুমেন্ট যা যেকোনো সময়, যেকোনো চ্যানেলে পাঠানো যায়।",
      en: "A professional document you can send at any time, on any channel.",
    },
    features: {
      bn: [
        "পেশাদার Business Profile লেখা ও ফরম্যাটিং",
        "Print-ready PDF",
        "Editable Word ফাইল",
        "২ রাউন্ড রিভিশন",
      ],
      en: [
        "Professional business profile writing and formatting",
        "Print-ready PDF",
        "Editable Word file",
        "Two rounds of revision",
      ],
    },
    deliverables: {
      bn: ["Print-ready PDF", "Editable Word ডকুমেন্ট"],
      en: ["Print-ready PDF", "Editable Word document"],
    },
    process: [
      {
        step: 1,
        title: { bn: "যোগাযোগ", en: "Get in touch" },
        description: { bn: "WhatsApp বা Messenger-এ আপনার ব্যবসার তথ্য পাঠান।", en: "Send your business information over WhatsApp or Messenger." },
      },
      {
        step: 2,
        title: { bn: "নিশ্চিতকরণ", en: "Confirmation" },
        description: { bn: "Scope ও Delivery নিশ্চিত করা হয়, তারপর bKash পেমেন্ট।", en: "Scope and delivery are confirmed, then bKash payment." },
      },
      {
        step: 3,
        title: { bn: "তৈরি", en: "Production" },
        description: { bn: "আমরা Profile তৈরি করি।", en: "We produce the profile." },
      },
      {
        step: 4,
        title: { bn: "রিভিশন ও ডেলিভারি", en: "Revision & delivery" },
        description: { bn: "২ রাউন্ড রিভিশনের পর PDF ও Word ফাইল ডেলিভারি।", en: "After two revision rounds, PDF and Word files are delivered." },
      },
    ],
    deliveryTime: TBC,
    deliveryFormat: digitalDeliveryFormat,
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Business name ও কার্যক্রমের বিবরণ", "Logo (থাকলে)", "যোগাযোগের তথ্য", "মূল সেবা/পণ্যের তালিকা"],
      en: ["Business name and description of activities", "Logo (if available)", "Contact details", "List of core services/products"],
    },
    originalPrice: 1900,
    currentPrice: 999,
    priceNote: orderViaChannel,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: { bn: "শুরু করার জন্য", en: "Best to start" },
    featured: true,
    faq: ["profile-revision", "profile-industry", "payment-methods", "delivery-time"],
    relatedProducts: ["professional-business-growth", "professional-business-premium"],
    upsell: "professional-business-growth",
    crossSell: ["brand-identity-system"],
    seoTitle: {
      bn: "Professional Business Profile — Starter (৳999) | Nexus Lift",
      en: "Professional Business Profile — Starter (৳999) | Nexus Lift",
    },
    seoDescription: {
      bn: "৳999-এ পেশাদার Business Profile — PDF + Editable Word, ২ রাউন্ড রিভিশন। WhatsApp-এ অর্ডার করুন।",
      en: "A professional business profile for ৳999 — PDF + editable Word, two revisions. Order over WhatsApp.",
    },
  },
  {
    id: "pbp-growth",
    slug: "professional-business-growth",
    name: { bn: "Professional Business Profile — Growth", en: "Professional Business Profile — Growth" },
    category: "brand-identity",
    layer: "identity",
    shortDescription: {
      bn: "যে ব্যবসা কাস্টমার, পার্টনার বা ইনভেস্টরের সামনে আরও গভীরভাবে নিজেকে উপস্থাপন করতে চায়।",
      en: "For businesses that want a deeper presentation in front of customers, partners or investors.",
    },
    description: {
      bn: "Professional Business Profile — Growth হলো Starter-এর চেয়ে সম্পূর্ণ একটি Business Profile, যেখানে ব্যবসার পরিচয় আরও বিস্তারিতভাবে উপস্থাপন করা হয়। ফাইল সম্পূর্ণ Editable, তাই ভবিষ্যতে আপনার টিম নিজেই আপডেট করতে পারবে।",
      en: "Professional Business Profile — Growth is a fuller business profile than Starter, presenting the business in more depth. Files are fully editable, so your team can update them in future.",
    },
    targetCustomer: {
      bn: "বাড়তে থাকা SME, এজেন্সি, সার্ভিস প্রোভাইডার — যাদের Proposal ও Presentation-এ একটি পূর্ণ Profile দরকার।",
      en: "Growing SMEs, agencies and service providers that need a complete profile for proposals and presentations.",
    },
    problem: {
      bn: "একাধিক ক্লায়েন্টের সামনে একই মানের পরিচিতি ধরে রাখা কঠিন, এবং পুরনো ডকুমেন্ট আপডেট করার কেউ নেই।",
      en: "Keeping a consistent introduction across many clients is hard, and nobody owns updating the old document.",
    },
    outcome: {
      bn: "একটি Editable, পুনরায় ব্যবহারযোগ্য Business Profile যা আপনার টিম নিজেই আপডেট করতে পারবে।",
      en: "An editable, reusable business profile your own team can keep up to date.",
    },
    features: {
      bn: [
        "Starter-এর সবকিছু",
        "আরও বিস্তারিত Business Profile কনটেন্ট",
        "সম্পূর্ণ Editable সোর্স ফাইল",
        "২ রাউন্ড রিভিশন",
      ],
      en: [
        "Everything in Starter",
        "More detailed business profile content",
        "Fully editable source file",
        "Two rounds of revision",
      ],
    },
    deliverables: {
      bn: ["Print-ready PDF", "Editable Word ডকুমেন্ট"],
      en: ["Print-ready PDF", "Editable Word document"],
    },
    process: [
      {
        step: 1,
        title: { bn: "যোগাযোগ", en: "Get in touch" },
        description: { bn: "WhatsApp বা Messenger-এ আপনার ব্যবসার তথ্য পাঠান।", en: "Send your business information over WhatsApp or Messenger." },
      },
      {
        step: 2,
        title: { bn: "নিশ্চিতকরণ", en: "Confirmation" },
        description: { bn: "Scope ও Delivery নিশ্চিত করা হয়, তারপর bKash পেমেন্ট।", en: "Scope and delivery are confirmed, then bKash payment." },
      },
      {
        step: 3,
        title: { bn: "তৈরি", en: "Production" },
        description: { bn: "আমরা বিস্তারিত Profile তৈরি করি।", en: "We produce the detailed profile." },
      },
      {
        step: 4,
        title: { bn: "রিভিশন ও ডেলিভারি", en: "Revision & delivery" },
        description: { bn: "২ রাউন্ড রিভিশনের পর PDF ও Word ফাইল ডেলিভারি।", en: "After two revision rounds, PDF and Word files are delivered." },
      },
    ],
    deliveryTime: TBC,
    deliveryFormat: digitalDeliveryFormat,
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Business name ও কার্যক্রমের বিবরণ", "Logo (থাকলে)", "যোগাযোগের তথ্য", "আগের যেকোনো প্রোফাইল/ব্রোশিওর (থাকলে)"],
      en: ["Business name and description of activities", "Logo (if available)", "Contact details", "Any existing profile/brochure (if available)"],
    },
    originalPrice: 2599,
    currentPrice: 1499,
    priceNote: orderViaChannel,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: { bn: "সবচেয়ে জনপ্রিয়", en: "Most popular" },
    featured: true,
    faq: ["profile-revision", "profile-industry", "profile-self-update", "payment-methods"],
    relatedProducts: ["professional-business-starter", "professional-business-premium"],
    upsell: "professional-business-premium",
    crossSell: ["brand-identity-system", "sop-process-system"],
    seoTitle: {
      bn: "Professional Business Profile — Growth (৳1,499) | Nexus Lift",
      en: "Professional Business Profile — Growth (৳1,499) | Nexus Lift",
    },
    seoDescription: {
      bn: "৳1,499-এ বিস্তারিত Business Profile — PDF + Editable Word, ২ রাউন্ড রিভিশন। WhatsApp-এ অর্ডার করুন।",
      en: "A detailed business profile for ৳1,499 — PDF + editable Word, two revisions. Order over WhatsApp.",
    },
  },
  {
    id: "pbp-premium",
    slug: "professional-business-premium",
    name: { bn: "Professional Business Profile — Premium", en: "Professional Business Profile — Premium" },
    category: "brand-identity",
    layer: "identity",
    shortDescription: {
      bn: "সর্বোচ্চ স্তরের Business Profile — যেখানে উপস্থাপনাই একটি সিদ্ধান্ত তৈরি করে।",
      en: "The highest tier — where the presentation itself drives the decision.",
    },
    description: {
      bn: "Professional Business Profile — Premium হলো আমাদের সবচেয়ে সম্পূর্ণ Business Profile প্যাকেজ — গভীর কনটেন্ট, যত্নসহ ফরম্যাটিং এবং সম্পূর্ণ Editable ডেলিভারি, বড় ক্লায়েন্ট ও ইনভেস্টরের সামনে উপস্থাপনের জন্য।",
      en: "Professional Business Profile — Premium is our most complete business profile package: deeper content, careful formatting and a fully editable delivery for meetings with large clients and investors.",
    },
    targetCustomer: {
      bn: "যে ব্যবসা বড় ক্লায়েন্ট, কর্পোরেট টেন্ডার বা ইনভেস্টরের সামনে উপস্থাপন করবে।",
      en: "Businesses presenting to large clients, corporate tenders or investors.",
    },
    problem: {
      bn: "বড় সুযোগ হাতছাড়া হয় যখন উপস্থাপনার মান প্রতিযোগীর চেয়ে দুর্বল থাকে।",
      en: "Large opportunities are lost when the quality of presentation is weaker than a competitor's.",
    },
    outcome: {
      bn: "একটি Premium Business Profile যা আপনার ব্যবসার পেশাদারিত্ব প্রথম দেখাতেই বোঝা যায়।",
      en: "A premium business profile where your professionalism is visible at first glance.",
    },
    features: {
      bn: [
        "Growth-এর সবকিছু",
        "সর্বোচ্চ স্তরের কনটেন্ট ও ফরম্যাটিং",
        "সম্পূর্ণ Editable সোর্স ফাইল",
        "২ রাউন্ড রিভিশন",
      ],
      en: [
        "Everything in Growth",
        "Highest-tier content and formatting",
        "Fully editable source file",
        "Two rounds of revision",
      ],
    },
    deliverables: {
      bn: ["Print-ready PDF", "Editable Word ডকুমেন্ট"],
      en: ["Print-ready PDF", "Editable Word document"],
    },
    process: [
      {
        step: 1,
        title: { bn: "যোগাযোগ", en: "Get in touch" },
        description: { bn: "WhatsApp বা Messenger-এ আপনার ব্যবসার তথ্য পাঠান।", en: "Send your business information over WhatsApp or Messenger." },
      },
      {
        step: 2,
        title: { bn: "নিশ্চিতকরণ", en: "Confirmation" },
        description: { bn: "Scope ও Delivery নিশ্চিত করা হয়, তারপর bKash পেমেন্ট।", en: "Scope and delivery are confirmed, then bKash payment." },
      },
      {
        step: 3,
        title: { bn: "তৈরি", en: "Production" },
        description: { bn: "আমরা সর্বোচ্চ স্তরের Profile তৈরি করি।", en: "We produce the highest-tier profile." },
      },
      {
        step: 4,
        title: { bn: "রিভিশন ও ডেলিভারি", en: "Revision & delivery" },
        description: { bn: "২ রাউন্ড রিভিশনের পর PDF ও Word ফাইল ডেলিভারি।", en: "After two revision rounds, PDF and Word files are delivered." },
      },
    ],
    deliveryTime: TBC,
    deliveryFormat: digitalDeliveryFormat,
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Business name ও কার্যক্রমের বিবরণ", "Logo (থাকলে)", "যোগাযোগের তথ্য", "যে সুযোগের জন্য প্রোফাইল দরকার (টেন্ডার/ইনভেস্টর/ক্লায়েন্ট)"],
      en: ["Business name and description of activities", "Logo (if available)", "Contact details", "The opportunity the profile is for (tender/investor/client)"],
    },
    originalPrice: 4499,
    currentPrice: 2999,
    priceNote: orderViaChannel,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: { bn: "সর্বোচ্চ স্তর", en: "Highest tier" },
    featured: true,
    faq: ["profile-revision", "profile-industry", "profile-self-update", "payment-methods"],
    relatedProducts: ["professional-business-growth"],
    upsell: null,
    crossSell: ["brand-identity-system", "business-structure-setup"],
    seoTitle: {
      bn: "Professional Business Profile — Premium (৳2,999) | Nexus Lift",
      en: "Professional Business Profile — Premium (৳2,999) | Nexus Lift",
    },
    seoDescription: {
      bn: "৳2,999-এ সর্বোচ্চ স্তরের Business Profile — PDF + Editable Word, ২ রাউন্ড রিভিশন। WhatsApp-এ অর্ডার করুন।",
      en: "The highest-tier business profile for ৳2,999 — PDF + editable Word, two revisions. Order over WhatsApp.",
    },
  },

  /* ─────────────────────────── Framework services ───────────────────────────── */
  {
    id: "brand-identity-system",
    slug: "brand-identity-system",
    name: { bn: "Brand Identity System", en: "Brand Identity System" },
    category: "brand-identity",
    layer: "identity",
    shortDescription: {
      bn: "Logo, Visual System এবং Brand Guidelines — যাতে সব জায়গায় আপনার ব্র্যান্ড একই রকম দেখায়।",
      en: "Logo, visual system and brand guidelines so your brand looks the same everywhere.",
    },
    description: {
      bn: "একটি Business-এর Identity Layer ঠিক করা মানে শুধু Logo বানানো নয় — Positioning, Messaging এবং Visual Consistency একসাথে ঠিক করা। আমরা সেটিই করি।",
      en: "Fixing a business's Identity layer is not only making a logo — it is aligning positioning, messaging and visual consistency. That is what we do.",
    },
    targetCustomer: {
      bn: "যে ব্যবসার পরিচয় আছে কিন্তু Consistency নেই — আলাদা আলাদা ডিজাইন, আলাদা আলাদা Message।",
      en: "Businesses that exist but lack consistency — different designs and different messages in different places.",
    },
    problem: {
      bn: "কাস্টমার প্রথম ৩ সেকেন্ডে সিদ্ধান্ত নেয় আপনি Credible কি না — অসামঞ্জস্যপূর্ণ ব্র্যান্ড সেই সিদ্ধান্তকে দুর্বল করে।",
      en: "Customers decide credibility in the first few seconds — an inconsistent brand weakens that decision.",
    },
    outcome: {
      bn: "একটি পূর্ণ Brand System যা Website, Social, Proposal এবং Employee-সব জায়গায় একইভাবে ব্যবহার করা যায়।",
      en: "A complete brand system usable across website, social, proposals and employees.",
    },
    features: {
      bn: ["Brand Strategy ও Positioning", "Logo ও Visual Identity", "Brand Guidelines", "Business Profile ও Messaging Architecture"],
      en: ["Brand strategy and positioning", "Logo and visual identity", "Brand guidelines", "Business profile and messaging architecture"],
    },
    deliverables: {
      bn: ["Logo Package", "Brand Guidelines ডকুমেন্ট", "Messaging Architecture", "Business Profile সোর্স ফাইল"],
      en: ["Logo package", "Brand guidelines document", "Messaging architecture", "Business profile source file"],
    },
    process: [
      { step: 1, title: { bn: "Discovery", en: "Discovery" }, description: { bn: "ব্যবসা, কাস্টমার ও পজিশনিং বোঝা।", en: "Understand the business, customers and positioning." } },
      { step: 2, title: { bn: "Strategy", en: "Strategy" }, description: { bn: "Positioning ও Message নির্ধারণ।", en: "Define positioning and message." } },
      { step: 3, title: { bn: "Design", en: "Design" }, description: { bn: "Logo ও Visual System তৈরি।", en: "Create the logo and visual system." } },
      { step: 4, title: { bn: "Guidelines", en: "Guidelines" }, description: { bn: "কীভাবে ব্যবহার করতে হবে তা লিখিতভাবে দেওয়া।", en: "Written rules for how to use the system." } },
      { step: 5, title: { bn: "Handover", en: "Handover" }, description: { bn: "সোর্স ফাইল ও ট্রেনিংয়ের মাধ্যমে হ্যান্ডওভার।", en: "Handover with source files and training." } },
    ],
    deliveryTime: { bn: "Scope অনুযায়ী নির্ধারিত হয়", en: "Defined against scope" },
    deliveryFormat: { bn: "Design সোর্স ফাইল + PDF Guideline", en: "Design source files + PDF guideline" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Business সম্পর্কে তথ্য", "পছন্দের রেফারেন্স (থাকলে)", "বর্তমান Brand assets (থাকলে)"],
      en: ["Information about the business", "Reference preferences (if any)", "Existing brand assets (if any)"],
    },
    originalPrice: null,
    currentPrice: 25000,
    priceNote: {
      bn: "Starting from ৳25,000। চূড়ান্ত দাম Scope অনুযায়ী নির্ধারিত হয় (আন্তর্জাতিক ক্লায়েন্টের জন্য USD equivalent)।",
      en: "Starting from BDT 25,000. Final price is defined against scope (USD equivalent for international clients).",
    },
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: true,
    faq: ["scope-quote", "profile-industry", "payment-methods"],
    relatedProducts: ["business-structure-setup"],
    upsell: "website-conversion-system",
    crossSell: ["professional-business-premium"],
    seoTitle: { bn: "Brand Identity System — ৳25,000 থেকে | Nexus Lift", en: "Brand Identity System — from BDT 25,000 | Nexus Lift" },
    seoDescription: {
      bn: "Brand Strategy, Logo, Visual Identity ও Guidelines — Starting from BDT 25,000। Scope অনুযায়ী Quote।",
      en: "Brand strategy, logo, visual identity and guidelines — starting from BDT 25,000, quoted against scope.",
    },
  },
  {
    id: "business-structure-setup",
    slug: "business-structure-setup",
    name: { bn: "Business Structure & Management Setup", en: "Business Structure & Management Setup" },
    category: "business-structure",
    layer: "structure",
    shortDescription: {
      bn: "Organogram, Role Matrix এবং Authority Structure — যাতে সবাই জানতে পারে কে কী করবে।",
      en: "Organogram, role matrix and authority structure so everyone knows who does what.",
    },
    description: {
      bn: "Team বাড়লে যদি Structure না বাড়ে, তখন Confusion বাড়ে। আমরা আপনার ব্যবসার জন্য একটি পরিষ্কার Organizational Structure, Role Definition এবং Authority Matrix তৈরি করি।",
      en: "When the team grows without structure, confusion grows instead. We build a clear organisational structure, role definitions and authority matrix for your business.",
    },
    targetCustomer: {
      bn: "৫–৫০ জনের টিম যেখানে কাজের সীমানা অস্পষ্ট এবং সব সিদ্ধান্ত Founder-এর কাছে আসে।",
      en: "Teams of 5–50 where task boundaries are unclear and every decision reaches the founder.",
    },
    problem: {
      bn: "'সবাই সব কাজ করে' — ফলে দায়িত্ব হারিয়ে যায় এবং Escalation বাড়ে।",
      en: "\"Everyone does everything\" — so accountability disappears and escalations increase.",
    },
    outcome: {
      bn: "প্রতিটি Role-এর স্পষ্ট সীমানা, স্পষ্ট Reporting line এবং স্পষ্ট Decision authority।",
      en: "Clear boundaries for every role, a clear reporting line and clear decision authority.",
    },
    features: {
      bn: ["Organogram", "Department Design", "Role & Responsibility Matrix", "Authority Matrix", "Reporting Structure"],
      en: ["Organogram", "Department design", "Role & responsibility matrix", "Authority matrix", "Reporting structure"],
    },
    deliverables: {
      bn: ["Organogram (Editable)", "Role & Responsibility Document", "Authority Matrix", "Reporting Structure Document"],
      en: ["Organogram (editable)", "Role & responsibility document", "Authority matrix", "Reporting structure document"],
    },
    process: [
      { step: 1, title: { bn: "Understand", en: "Understand" }, description: { bn: "বর্তমান টিম ও কাজের ধরণ বোঝা।", en: "Understand the current team and work." } },
      { step: 2, title: { bn: "Map", en: "Map" }, description: { bn: "কাজ ও দায়িত্ব ম্যাপ করা।", en: "Map work and responsibilities." } },
      { step: 3, title: { bn: "Design", en: "Design" }, description: { bn: "Structure ও Authority সাজানো।", en: "Design the structure and authority." } },
      { step: 4, title: { bn: "Review", en: "Review" }, description: { bn: "আপনার টিমের সাথে যাচাই।", en: "Validate with your team." } },
      { step: 5, title: { bn: "Handover", en: "Handover" }, description: { bn: "ডকুমেন্ট ও ব্রিফিং।", en: "Documents and briefing." } },
    ],
    deliveryTime: { bn: "Scope অনুযায়ী নির্ধারিত হয়", en: "Defined against scope" },
    deliveryFormat: { bn: "Editable ডকুমেন্ট + PDF", en: "Editable documents + PDF" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["বর্তমান টিমের তালিকা ও দায়িত্ব", "প্রতিদিনের কাজের ধরন", "Management এর প্রত্যাশা"],
      en: ["Current team list and responsibilities", "Day-to-day work patterns", "Management expectations"],
    },
    originalPrice: null,
    currentPrice: null,
    priceNote: TBC,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: false,
    faq: ["scope-quote", "profile-industry"],
    relatedProducts: ["sop-process-system"],
    upsell: "sop-process-system",
    crossSell: ["brand-identity-system"],
    seoTitle: { bn: "Business Structure & Management Setup | Nexus Lift", en: "Business Structure & Management Setup | Nexus Lift" },
    seoDescription: {
      bn: "Organogram, Role Matrix, Authority Matrix ও Reporting Structure তৈরি — Nexus Lift Business Architecture সেবা।",
      en: "Organogram, role matrix, authority matrix and reporting structure — the Nexus Lift business architecture service.",
    },
  },
  {
    id: "sop-process-system",
    slug: "sop-process-system",
    name: { bn: "Custom SOP & Process System", en: "Custom SOP & Process System" },
    category: "sop-operations",
    layer: "operations",
    shortDescription: {
      bn: "আপনার Business-কে Manual Chaos থেকে Repeatable System-এ রূপান্তর করুন।",
      en: "Turn your business from manual chaos into a repeatable system.",
    },
    description: {
      bn: "কাজ বাড়ছে কিন্তু System বাড়ছে না? প্রতিটি কাজ Founder-এর ওপর নির্ভরশীল? নতুন Employee জয়েন করলে বারবার একই কথা শেখাতে হয়? আমরা আপনার মূল প্রক্রিয়াগুলো লিখিত, ব্যবহারযোগ্য SOP-তে রূপান্তর করি — Flowchart, Checklist, Role Matrix এবং Training সহ।",
      en: "Work is growing but the system is not? Every task depends on the founder? Does every new employee need the same training again? We turn your core processes into written, usable SOPs — with flowcharts, checklists, a role matrix and training.",
    },
    targetCustomer: {
      bn: "৫–১০০ জনের টিম; Sales, Delivery ও Support যেখানে মানুষ-নির্ভর।",
      en: "Teams of 5–100 where sales, delivery and support depend on people rather than process.",
    },
    problem: {
      bn: "Founder ছুটিতে গেলে কাজ থেমে যায়, ভুল হলে কারণ খুঁজে পাওয়া যায় না, এবং নতুন Employee-কে শেখাতে ৩ সপ্তাহ লাগে।",
      en: "Work stops when the founder takes leave, mistakes cannot be traced, and training a new employee takes weeks.",
    },
    outcome: {
      bn: "একটি Living Operations System — যেখানে প্রতিটি গুরুত্বপূর্ণ কাজ Consistent হয়।",
      en: "A living operations system where every important task happens consistently.",
    },
    features: {
      bn: [
        "৫টি Core Department SOP",
        "Process Flowchart (visual workflow map)",
        "Checklist Template (Daily/Weekly)",
        "Role Responsibility Matrix",
        "Approval & Escalation Policy",
        "Digital Documentation (Print-ready PDF + Editable)",
        "Team Training Session",
      ],
      en: [
        "Five core department SOPs",
        "Process flowcharts (visual workflow maps)",
        "Checklist templates (daily/weekly)",
        "Role responsibility matrix",
        "Approval & escalation policy",
        "Digital documentation (print-ready PDF + editable)",
        "Team training session",
      ],
    },
    deliverables: {
      bn: [
        "৫টি Core Department SOPs (Sales, Operations, Support সহ)",
        "Process Flowcharts",
        "Checklist Templates",
        "Role Responsibility Matrix",
        "Approval & Escalation Policy",
        "Print-ready PDF + Editable Word/Notion",
        "Team Training Session",
      ],
      en: [
        "Five core department SOPs (including sales, operations, support)",
        "Process flowcharts",
        "Checklist templates",
        "Role responsibility matrix",
        "Approval & escalation policy",
        "Print-ready PDF + editable Word/Notion",
        "Team training session",
      ],
    },
    process: [
      { step: 1, title: { bn: "Audit", en: "Audit" }, description: { bn: "আমরা আপনার বর্তমান কাজের ধরণ বুঝি।", en: "We understand how your work is done today." } },
      { step: 2, title: { bn: "Map", en: "Map" }, description: { bn: "প্রতিটি প্রক্রিয়াকে ধাপে ধাপে ভাগ করি।", en: "We split each process into clear steps." } },
      { step: 3, title: { bn: "Draft", en: "Draft" }, description: { bn: "SOP এবং Checklist তৈরি করি।", en: "We draft the SOPs and checklists." } },
      { step: 4, title: { bn: "Review", en: "Review" }, description: { bn: "আপনার Team-এর সাথে যাচাই করি।", en: "We validate with your team." } },
      { step: 5, title: { bn: "Handover", en: "Handover" }, description: { bn: "চূড়ান্ত ডকুমেন্ট এবং Training দিয়ে হ্যান্ডওভার।", en: "Final documents and training handover." } },
    ],
    deliveryTime: { bn: "১৪–২১ দিন", en: "14–21 days" },
    deliveryFormat: { bn: "Print-ready PDF + Editable Word/Notion + Training Session", en: "Print-ready PDF + editable Word/Notion + training session" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Team structure ও দায়িত্বের তালিকা", "বর্তমান প্রক্রিয়ার বর্ণনা", "Key Team Member-দের সময় (Interview)"],
      en: ["Team structure and responsibilities", "Description of current processes", "Time from key team members (interviews)"],
    },
    originalPrice: null,
    currentPrice: 45000,
    priceNote: {
      bn: "Starting from BDT 45,000 (আন্তর্জাতিক ক্লায়েন্টের জন্য USD 450)। চূড়ান্ত দাম Scope অনুযায়ী।",
      en: "Starting from BDT 45,000 (USD 450 for international clients). Final price is defined against scope.",
    },
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: { bn: "সবচেয়ে চাহিদাসম্পন্ন", en: "Most requested" },
    featured: true,
    faq: ["sop-industry", "sop-not-just-docs", "profile-self-update", "scope-quote"],
    relatedProducts: ["crm-customer-system", "business-os-dashboard"],
    upsell: "crm-customer-system",
    crossSell: ["business-structure-setup"],
    seoTitle: { bn: "Custom SOP & Process System — ৳45,000 থেকে | Nexus Lift", en: "Custom SOP & Process System — from BDT 45,000 | Nexus Lift" },
    seoDescription: {
      bn: "৫টি Core Department SOP, Flowchart, Checklist, Role Matrix ও Team Training — ১৪–২১ দিনে, Starting BDT 45,000।",
      en: "Five core department SOPs, flowcharts, checklists, role matrix and team training — in 14–21 days, from BDT 45,000.",
    },
  },
  {
    id: "website-conversion-system",
    slug: "website-conversion-system",
    name: { bn: "Website & Conversion System", en: "Website & Conversion System" },
    category: "website-conversion",
    layer: "growth",
    shortDescription: {
      bn: "এমন একটি Website যা শুধু থাকার জন্য নয় — Lead আনার জন্য তৈরি।",
      en: "A website built to generate leads, not just to exist.",
    },
    description: {
      bn: "Website মানে শুধু Presence নয়। আমরা Business Website, Landing Page, Conversion Flow এবং Role-based Portal তৈরি করি — যাতে ভিজিটর শুধু দেখে না, Enquiry করে।",
      en: "A website is not only presence. We build business websites, landing pages, conversion flows and role-based portals so visitors do not just look — they enquire.",
    },
    targetCustomer: {
      bn: "যাদের Website আছে কিন্তু Lead আসে না, অথবা যাদের এখনো কোনো Website নেই।",
      en: "Businesses with a website that generates no leads, or businesses with no website yet.",
    },
    problem: {
      bn: "Website-এ ভিজিটর আসে, কিন্তু Interest থেকে Enquiry হয় না — কারণ Conversion Path নেই।",
      en: "Visitors arrive but interest never becomes an enquiry, because there is no conversion path.",
    },
    outcome: {
      bn: "একটি পরিষ্কার Conversion Flow যেখানে প্রতিটি Page একটি নির্দিষ্ট সিদ্ধান্তের দিকে নিয়ে যায়।",
      en: "A clear conversion flow where every page leads towards a specific decision.",
    },
    features: {
      bn: ["Business / AI Website", "Landing Page", "Conversion Flow Design", "Client/Employee Portal (Role-based Access)"],
      en: ["Business / AI website", "Landing page", "Conversion flow design", "Client/employee portal (role-based access)"],
    },
    deliverables: {
      bn: ["Responsive Website বা Landing Page", "Conversion-oriented Page Structure", "Contact/Lead Capture Flow", "Analytics Setup"],
      en: ["Responsive website or landing page", "Conversion-oriented page structure", "Contact/lead capture flow", "Analytics setup"],
    },
    process: [
      { step: 1, title: { bn: "Discovery", en: "Discovery" }, description: { bn: "কাস্টমার কে এবং কী চায় তা বোঝা।", en: "Understand who the customer is and what they want." } },
      { step: 2, title: { bn: "Structure", en: "Structure" }, description: { bn: "Page ও Conversion Path সাজানো।", en: "Plan pages and the conversion path." } },
      { step: 3, title: { bn: "Build", en: "Build" }, description: { bn: "Design ও Development।", en: "Design and development." } },
      { step: 4, title: { bn: "QA", en: "QA" }, description: { bn: "Mobile, Speed ও Form যাচাই।", en: "Mobile, speed and form checks." } },
      { step: 5, title: { bn: "Launch", en: "Launch" }, description: { bn: "Live করা এবং Measuring শুরু।", en: "Go live and start measuring." } },
    ],
    deliveryTime: { bn: "২৫–৩০ দিন", en: "25–30 days" },
    deliveryFormat: { bn: "Live website + Admin access + Documentation", en: "Live website + admin access + documentation" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Brand assets", "Service/Product তথ্য", "আগের Website access (থাকলে)"],
      en: ["Brand assets", "Service/product information", "Existing website access (if any)"],
    },
    originalPrice: null,
    currentPrice: null,
    priceNote: TBC,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: true,
    faq: ["scope-quote", "payment-methods"],
    relatedProducts: ["crm-customer-system"],
    upsell: "crm-customer-system",
    crossSell: ["brand-identity-system"],
    seoTitle: { bn: "Website & Conversion System | Nexus Lift", en: "Website & Conversion System | Nexus Lift" },
    seoDescription: {
      bn: "Business Website, Landing Page, Conversion Flow এবং Role-based Portal — লিড আনার জন্য তৈরি Website।",
      en: "Business websites, landing pages, conversion flows and role-based portals — websites built to attract leads.",
    },
  },
  {
    id: "crm-customer-system",
    slug: "crm-customer-system",
    name: { bn: "CRM & Customer System", en: "CRM & Customer System" },
    category: "crm-customer-systems",
    layer: "intelligence",
    shortDescription: {
      bn: "আপনার Customer Data এক জায়গায় রাখুন — Excel, WhatsApp আর Memory-তে ছড়িয়ে না রেখে।",
      en: "Keep your customer data in one place instead of spread across Excel, WhatsApp and memory.",
    },
    description: {
      bn: "Customer Data কি Excel, WhatsApp, এবং Memory তে ছড়িয়ে আছে? Lead Follow-up মিস হয়? Sales Pipeline পরিষ্কার না? আমরা একটি Central CRM, Pipeline, Follow-up System এবং Retention Alert তৈরি করি।",
      en: "Is your customer data scattered across Excel, WhatsApp and memory? Are follow-ups missed? Is the sales pipeline unclear? We build a central CRM, pipeline, follow-up system and retention alerts.",
    },
    targetCustomer: {
      bn: "যাদের প্রতিদিন Lead আসে কিন্তু Follow-up Manual।",
      en: "Businesses that receive leads daily but follow up manually.",
    },
    problem: {
      bn: "Data scattered থাকলে Follow-up মিস হয় এবং Sales কমে যায় — যদিও Enquiry কমেনি।",
      en: "When data is scattered, follow-ups are missed and sales drop even though enquiries have not.",
    },
    outcome: {
      bn: "একটি Customer System যেখানে প্রতিটি Lead-এর পরবর্তী ধাপ জানা থাকে।",
      en: "A customer system where the next step for every lead is always known.",
    },
    features: {
      bn: [
        "Custom CRM Setup",
        "Customer Database Migration",
        "Sales Pipeline Configuration (Lead → Won)",
        "Automated Follow-up (Email / WhatsApp / Task)",
        "Customer Segmentation (VIP, New, Churn Risk)",
        "Support Ticket Tracking",
        "Renewal & Retention Alerts",
        "Team Training",
      ],
      en: [
        "Custom CRM setup",
        "Customer database migration",
        "Sales pipeline configuration (lead → won)",
        "Automated follow-up (email / WhatsApp / task)",
        "Customer segmentation (VIP, new, churn risk)",
        "Support ticket tracking",
        "Renewal & retention alerts",
        "Team training",
      ],
    },
    deliverables: {
      bn: [
        "Configured CRM (আপনার ব্যবসার অনুযায়ী)",
        "Existing Customer Data Import",
        "Lead → Won Pipeline",
        "Follow-up Automation",
        "Team Training Session",
      ],
      en: [
        "Configured CRM (matched to your business)",
        "Existing customer data import",
        "Lead → won pipeline",
        "Follow-up automation",
        "Team training session",
      ],
    },
    process: [
      { step: 1, title: { bn: "Audit", en: "Audit" }, description: { bn: "বর্তমান Data ও Sales Flow বোঝা।", en: "Understand current data and sales flow." } },
      { step: 2, title: { bn: "Design", en: "Design" }, description: { bn: "Pipeline ও Field Structure নির্ধারণ।", en: "Define pipeline and field structure." } },
      { step: 3, title: { bn: "Setup", en: "Setup" }, description: { bn: "CRM Configure ও Data Import।", en: "CRM configuration and data import." } },
      { step: 4, title: { bn: "Automate", en: "Automate" }, description: { bn: "Follow-up ও Alert Automation।", en: "Follow-up and alert automation." } },
      { step: 5, title: { bn: "Train", en: "Train" }, description: { bn: "Team-কে ব্যবহার শেখানো।", en: "Train the team to use it." } },
    ],
    deliveryTime: { bn: "Scope অনুযায়ী নির্ধারিত হয়", en: "Defined against scope" },
    deliveryFormat: { bn: "Configured CRM + Documentation + Training", en: "Configured CRM + documentation + training" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["বর্তমান Customer/Lead Data (Excel/CSV)", "Sales Pipeline-এর ধাপ", "টিমের ব্যবহারকারীর তালিকা"],
      en: ["Existing customer/lead data (Excel/CSV)", "Sales pipeline stages", "List of team users"],
    },
    originalPrice: null,
    currentPrice: 60000,
    priceNote: {
      bn: "Starting from BDT 60,000 (আন্তর্জাতিক ক্লায়েন্টের জন্য USD 600)। Tool নির্বাচন ও Scope অনুযায়ী চূড়ান্ত দাম।",
      en: "Starting from BDT 60,000 (USD 600 for international clients). Final price depends on tool selection and scope.",
    },
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: true,
    faq: ["crm-tools", "profile-industry", "scope-quote", "payment-methods"],
    relatedProducts: ["business-os-dashboard", "automation-integration"],
    upsell: "business-os-dashboard",
    crossSell: ["sop-process-system"],
    seoTitle: { bn: "CRM & Customer System — ৳60,000 থেকে | Nexus Lift", en: "CRM & Customer System — from BDT 60,000 | Nexus Lift" },
    seoDescription: {
      bn: "Central CRM, Sales Pipeline, Follow-up Automation, Segmentation ও Team Training — Starting BDT 60,000।",
      en: "Central CRM, sales pipeline, follow-up automation, segmentation and team training — from BDT 60,000.",
    },
  },
  {
    id: "automation-integration",
    slug: "automation-integration",
    name: { bn: "Automation & Integration System", en: "Automation & Integration System" },
    category: "automation-integrations",
    layer: "intelligence",
    shortDescription: {
      bn: "যে কাজগুলো প্রতিদিন হাতে করছেন, সেগুলো সিস্টেমকেই করান।",
      en: "Let the system do the work you are doing by hand every day.",
    },
    description: {
      bn: "Lead, Sales, Support এবং Reporting — প্রতিটি Repeated কাজের জন্য আমরা n8n, Make, Zapier, Webhook এবং REST API ভিত্তিক Automation তৈরি করি।",
      en: "For lead, sales, support and reporting we build automation using n8n, Make, Zapier, webhooks and REST APIs.",
    },
    targetCustomer: {
      bn: "যাদের টিম প্রতিদিন একই Manual কাজ করছে — Data Entry, Report তৈরি, Notifications।",
      en: "Teams doing the same manual work every day — data entry, reporting, notifications.",
    },
    problem: {
      bn: "Manual কাজ মানে সময় নষ্ট এবং ভুলের সম্ভাবনা।",
      en: "Manual work means lost time and a higher chance of error.",
    },
    outcome: {
      bn: "একটি Connected Flow যেখানে একটি Event স্বয়ংক্রিয়ভাবে পরবর্তী ধাপ চালু করে।",
      en: "A connected flow where one event automatically triggers the next step.",
    },
    features: {
      bn: ["n8n / Make / Zapier Workflow", "Webhook ও REST API Integration", "Lead/Sales/Support Automation", "Reporting Automation"],
      en: ["n8n / Make / Zapier workflows", "Webhook and REST API integration", "Lead/sales/support automation", "Reporting automation"],
    },
    deliverables: {
      bn: ["Working Automation Workflows", "Integration Documentation", "Error Alerting", "Handover Session"],
      en: ["Working automation workflows", "Integration documentation", "Error alerting", "Handover session"],
    },
    process: [
      { step: 1, title: { bn: "Map", en: "Map" }, description: { bn: "কোন কাজটি Automate করা যায় তা চিহ্নিত করা।", en: "Identify which work can be automated." } },
      { step: 2, title: { bn: "Prioritize", en: "Prioritize" }, description: { bn: "সবচেয়ে বেশি সময় বাঁচে এমন কাজ আগে।", en: "Start with the work that saves the most time." } },
      { step: 3, title: { bn: "Build", en: "Build" }, description: { bn: "Workflow তৈরি ও পরীক্ষা।", en: "Build and test the workflows." } },
      { step: 4, title: { bn: "Monitor", en: "Monitor" }, description: { bn: "Error Alert সেটআপ।", en: "Set up error alerts." } },
    ],
    deliveryTime: { bn: "Scope অনুযায়ী নির্ধারিত হয়", en: "Defined against scope" },
    deliveryFormat: { bn: "Live workflows + documentation", en: "Live workflows + documentation" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["Automate করার জন্য নির্দিষ্ট কাজের তালিকা", "বর্তমান Tools-এর Access"],
      en: ["List of specific tasks to automate", "Access to current tools"],
    },
    originalPrice: null,
    currentPrice: null,
    priceNote: TBC,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: false,
    faq: ["scope-quote", "crm-tools"],
    relatedProducts: ["crm-customer-system", "ai-assistant-system"],
    upsell: "business-os-dashboard",
    crossSell: ["sop-process-system"],
    seoTitle: { bn: "Automation & Integration System | Nexus Lift", en: "Automation & Integration System | Nexus Lift" },
    seoDescription: {
      bn: "n8n, Make, Zapier, Webhook ও REST API ভিত্তিক Lead, Sales, Support এবং Reporting Automation।",
      en: "Lead, sales, support and reporting automation built on n8n, Make, Zapier, webhooks and REST APIs.",
    },
  },
  {
    id: "ai-assistant-system",
    slug: "ai-assistant-system",
    name: { bn: "AI Agent & Assistant System", en: "AI Agent & Assistant System" },
    category: "ai-agents-assistants",
    layer: "intelligence",
    shortDescription: {
      bn: "AI দিয়ে এমন কাজ করুন যেখানে সত্যিই লাভ আছে — Support, Qualification এবং Knowledge Retrieval।",
      en: "Use AI where it genuinely helps — support, qualification and knowledge retrieval.",
    },
    description: {
      bn: "AI সব কাজের জন্য নয়। আমরা এমন জায়গায় AI বসাই যেখানে বারবার একই প্রশ্ন আসে, Lead Qualification দরকার হয়, বা Knowledge খুঁজতে সময় নষ্ট হয়। AI আপনার Structured Data থেকেই উত্তর দেয় — অনুমান থেকে নয়।",
      en: "AI is not for everything. We place AI where the same questions repeat, where lead qualification is needed, or where finding knowledge wastes time. The assistant answers from your structured data, not from guesswork.",
    },
    targetCustomer: {
      bn: "যেখানে প্রতিদিন একই প্রশ্ন আসে এবং Follow-up Qualification-এ সময় যায়।",
      en: "Teams that answer the same questions daily and lose time to follow-up qualification.",
    },
    problem: {
      bn: "একই প্রশ্নের উত্তর বারবার দিতে হয়, এবং Response দেরি হলে Lead ঠান্ডা হয়ে যায়।",
      en: "The same questions must be answered repeatedly, and slow responses cool leads down.",
    },
    outcome: {
      bn: "একটি AI Assistant যা আপনার নিজের তথ্য থেকে উত্তর দেয় এবং দরকার হলে মানুষকে জানায়।",
      en: "An AI assistant that answers from your own information and hands over to a human when needed.",
    },
    features: {
      bn: ["AI Business Assistant", "AI Chatbot", "AI Sales/Support Assistant", "Knowledge Retrieval (আপনার নিজের ডকুমেন্ট থেকে)"],
      en: ["AI business assistant", "AI chatbot", "AI sales/support assistant", "Knowledge retrieval (from your own documents)"],
    },
    deliverables: {
      bn: ["Configured Assistant", "Knowledge Base Setup", "Escalation Rules", "Documentation ও Handover"],
      en: ["Configured assistant", "Knowledge base setup", "Escalation rules", "Documentation and handover"],
    },
    process: [
      { step: 1, title: { bn: "Use Case", en: "Use case" }, description: { bn: "AI কোথায় সত্যিই দরকার তা নির্ধারণ।", en: "Decide where AI genuinely helps." } },
      { step: 2, title: { bn: "Knowledge", en: "Knowledge" }, description: { bn: "Structured Knowledge Base তৈরি।", en: "Build the structured knowledge base." } },
      { step: 3, title: { bn: "Build", en: "Build" }, description: { bn: "Assistant তৈরি ও পরীক্ষা।", en: "Build and test the assistant." } },
      { step: 4, title: { bn: "Govern", en: "Govern" }, description: { bn: "Escalation ও Privacy নিয়ম সেটআপ।", en: "Set escalation and privacy rules." } },
    ],
    deliveryTime: { bn: "Scope অনুযায়ী নির্ধারিত হয়", en: "Defined against scope" },
    deliveryFormat: { bn: "Live assistant + documentation", en: "Live assistant + documentation" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["FAQ ও পলিসি ডকুমেন্ট", "সাধারণ প্রশ্নের তালিকা", "Escalation কার কাছে যাবে"],
      en: ["FAQ and policy documents", "List of common questions", "Who receives escalations"],
    },
    originalPrice: null,
    currentPrice: null,
    priceNote: TBC,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: false,
    faq: ["ai-governance", "scope-quote"],
    relatedProducts: ["automation-integration", "crm-customer-system"],
    upsell: "business-os-dashboard",
    crossSell: ["sop-process-system"],
    seoTitle: { bn: "AI Agent & Assistant System | Nexus Lift", en: "AI Agent & Assistant System | Nexus Lift" },
    seoDescription: {
      bn: "AI Business Assistant, Chatbot ও Knowledge Retrieval — আপনার নিজের ডকুমেন্ট থেকে উত্তর দেওয়া AI সিস্টেম।",
      en: "AI business assistants, chatbots and knowledge retrieval that answer from your own documents.",
    },
  },
  {
    id: "business-os-dashboard",
    slug: "business-os-dashboard",
    name: { bn: "Business OS & CEO Dashboard", en: "Business OS & CEO Dashboard" },
    category: "business-os-dashboards",
    layer: "control",
    shortDescription: {
      bn: "আপনার Business এর Control Room তৈরি করুন — যেখানে সংখ্যা দেখে সিদ্ধান্ত হয়।",
      en: "Build your business control room, where decisions are made from numbers.",
    },
    description: {
      bn: "আপনার Business কেমন চলছে তা জানতে কি Excel, WhatsApp এবং Memory এর ওপর নির্ভর করতে হয়? আমরা CEO, Sales, Operations, Finance ও Marketing Dashboard তৈরি করি — এক জায়গায়, Real-time।",
      en: "Do you rely on Excel, WhatsApp and memory to know how your business is doing? We build CEO, sales, operations, finance and marketing dashboards — in one place, in real time.",
    },
    targetCustomer: {
      bn: "যাদের Management সিদ্ধান্ত নেয় অনুমানে, কারণ Dashboard নেই।",
      en: "Management that decides from assumption because there is no dashboard.",
    },
    problem: {
      bn: "No Visibility — Business কেমন চলছে তা পরিষ্কার না হলে Decision ভুল হয়।",
      en: "No visibility — when the state of the business is unclear, decisions go wrong.",
    },
    outcome: {
      bn: "একটি Control Room যেখানে সপ্তাহের শুরুতে পুরো ব্যবসার অবস্থা এক নজরে দেখা যায়।",
      en: "A control room where the whole business is visible at a glance at the start of every week.",
    },
    features: {
      bn: [
        "CEO Control Room (MRR, Churn, Cash Flow, Risks)",
        "Sales Dashboard (Leads, Pipeline, Conversion, AOV)",
        "Operations Dashboard (Projects, Delivery Time, Tickets)",
        "Finance Dashboard (Revenue, Expense, Profit Margin)",
        "Marketing Dashboard (Traffic, CAC, ROI, Content Performance)",
        "Custom Metrics",
        "Mobile Access",
        "Team Training",
      ],
      en: [
        "CEO control room (MRR, churn, cash flow, risks)",
        "Sales dashboard (leads, pipeline, conversion, AOV)",
        "Operations dashboard (projects, delivery time, tickets)",
        "Finance dashboard (revenue, expense, profit margin)",
        "Marketing dashboard (traffic, CAC, ROI, content performance)",
        "Custom metrics",
        "Mobile access",
        "Team training",
      ],
    },
    deliverables: {
      bn: [
        "CEO Control Room",
        "Sales, Operations, Finance ও Marketing Dashboard",
        "Custom Metric অনুযায়ী সেটআপ",
        "Mobile Access (Responsive Web / App)",
        "Team Training Session",
      ],
      en: [
        "CEO control room",
        "Sales, operations, finance and marketing dashboards",
        "Setup for your custom metrics",
        "Mobile access (responsive web / app)",
        "Team training session",
      ],
    },
    process: [
      { step: 1, title: { bn: "Metric Definition", en: "Metric definition" }, description: { bn: "কোন সংখ্যা সত্যিই দরকার তা ঠিক করা।", en: "Decide which numbers genuinely matter." } },
      { step: 2, title: { bn: "Data Mapping", en: "Data mapping" }, description: { bn: "DataSource চিহ্নিত করা।", en: "Identify the data sources." } },
      { step: 3, title: { bn: "Build", en: "Build" }, description: { bn: "Dashboard তৈরি।", en: "Build the dashboard." } },
      { step: 4, title: { bn: "Validate", en: "Validate" }, description: { bn: "সংখ্যা যাচাই।", en: "Validate the numbers." } },
      { step: 5, title: { bn: "Train", en: "Train" }, description: { bn: "Management-কে ব্যবহার শেখানো।", en: "Train management to use it." } },
    ],
    deliveryTime: { bn: "৪–৮ সপ্তাহ", en: "4–8 weeks" },
    deliveryFormat: { bn: "Live dashboard + documentation + training", en: "Live dashboard + documentation + training" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["বর্তমান রিপোর্টিং ফরম্যাট", "Data Source-এর তালিকা", "Management-এর KPI তালিকা"],
      en: ["Current reporting format", "List of data sources", "Management KPI list"],
    },
    originalPrice: null,
    currentPrice: 150000,
    priceNote: {
      bn: "Starting from BDT 1,50,000 (আন্তর্জাতিক ক্লায়েন্টের জন্য USD 1,500)। প্রতিটি Business আলাদা — Custom Solution।",
      en: "Starting from BDT 1,50,000 (USD 1,500 for international clients). Every business differs — custom solution.",
    },
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: { bn: "Premium", en: "Premium" },
    featured: true,
    faq: ["scope-quote", "dashboard-data", "payment-methods"],
    relatedProducts: ["crm-customer-system", "automation-integration"],
    upsell: null,
    crossSell: ["sop-process-system"],
    seoTitle: { bn: "Business OS & CEO Dashboard — ৳1,50,000 থেকে | Nexus Lift", en: "Business OS & CEO Dashboard — from BDT 1,50,000 | Nexus Lift" },
    seoDescription: {
      bn: "CEO Control Room, Sales, Operations, Finance এবং Marketing Dashboard — ৪–৮ সপ্তাহে, Starting BDT 1,50,000।",
      en: "CEO control room plus sales, operations, finance and marketing dashboards — in 4–8 weeks, from BDT 1,50,000.",
    },
  },
  {
    id: "custom-portal-app",
    slug: "custom-portal-application",
    name: { bn: "Custom Portal / Business Application", en: "Custom Portal / Business Application" },
    category: "custom-technology",
    layer: "control",
    shortDescription: {
      bn: "যখন Readymade Software আর যথেষ্ট নয় — আপনার নিজের সিস্টেম।",
      en: "When ready-made software is no longer enough — your own system.",
    },
    description: {
      bn: "Client Portal, Employee Portal, Internal Business Tool, SaaS MVP — আপনার প্রক্রিয়া অনুযায়ী তৈরি Custom Software।",
      en: "Client portals, employee portals, internal business tools and SaaS MVPs — custom software built around your process.",
    },
    targetCustomer: {
      bn: "যাদের প্রক্রিয়া এতটাই নির্দিষ্ট যে কোনো Readymade Tool পুরোপুরি মেলে না।",
      en: "Businesses whose process is specific enough that no ready-made tool fits.",
    },
    problem: {
      bn: "একাধিক Tool-এর মাঝখানে কাজ আটকে থাকে এবং Data দুবার লিখতে হয়।",
      en: "Work gets stuck between several tools and data must be entered twice.",
    },
    outcome: {
      bn: "একটি একক সিস্টেম যা আপনার প্রক্রিয়ার সাথে মেলে।",
      en: "A single system that matches your process.",
    },
    features: {
      bn: ["Custom Web Application", "Client/Employee Portal", "Role-based Access", "Internal Business Tool / SaaS MVP"],
      en: ["Custom web application", "Client/employee portal", "Role-based access", "Internal business tool / SaaS MVP"],
    },
    deliverables: {
      bn: ["Custom Application", "Role-based Access Control", "Documentation", "Team Training"],
      en: ["Custom application", "Role-based access control", "Documentation", "Team training"],
    },
    process: [
      { step: 1, title: { bn: "Discovery", en: "Discovery" }, description: { bn: "প্রক্রিয়া ও প্রয়োজন বোঝা।", en: "Understand the process and requirements." } },
      { step: 2, title: { bn: "Architecture", en: "Architecture" }, description: { bn: "System Blueprint তৈরি।", en: "Create the system blueprint." } },
      { step: 3, title: { bn: "Build", en: "Build" }, description: { bn: "Phased development।", en: "Phased development." } },
      { step: 4, title: { bn: "Test", en: "Test" }, description: { bn: "QA ও Acceptance Testing।", en: "QA and acceptance testing." } },
      { step: 5, title: { bn: "Launch", en: "Launch" }, description: { bn: "Deployment ও Training।", en: "Deployment and training." } },
    ],
    deliveryTime: { bn: "Scope অনুযায়ী নির্ধারিত হয়", en: "Defined against scope" },
    deliveryFormat: { bn: "Deployed application + documentation", en: "Deployed application + documentation" },
    revisionCount: 2,
    revisionPolicy: standardRevisionPolicy,
    requirements: {
      bn: ["প্রক্রিয়ার বিস্তারিত বিবরণ", "User Role-এর তালিকা", "Scope নিশ্চিতকরণ"],
      en: ["Detailed description of the process", "List of user roles", "Scope confirmation"],
    },
    originalPrice: null,
    currentPrice: null,
    priceNote: TBC,
    currency: "BDT",
    billing: "one-time",
    status: "active",
    badge: null,
    featured: false,
    faq: ["scope-quote"],
    relatedProducts: ["business-os-dashboard", "automation-integration"],
    upsell: "business-os-dashboard",
    crossSell: ["sop-process-system"],
    seoTitle: { bn: "Custom Portal & Business Application | Nexus Lift", en: "Custom Portal & Business Application | Nexus Lift" },
    seoDescription: {
      bn: "Custom Web Application, Client/Employee Portal, Role-based Access এবং SaaS MVP Development।",
      en: "Custom web applications, client/employee portals, role-based access and SaaS MVP development.",
    },
  },
];

export const hostingPlans = [
  {
    id: "host-starter",
    slug: "nexus-host-starter",
    name: { bn: "Nexus Host — Starter", en: "Nexus Host — Starter" },
    price: 250,
    billing: "monthly" as const,
    badge: null,
    summary: {
      bn: "প্রথম Website বা একটি ছোট Business Site-এর জন্য।",
      en: "For a first website or a small business site.",
    },
    features: {
      bn: ["NVMe Storage", "Free SSL", "Daily Backup", "24/7 Business Support", "৯৯.৯% Uptime"],
      en: ["NVMe storage", "Free SSL", "Daily backup", "24/7 business support", "99.9% uptime"],
    },
  },
  {
    id: "host-business",
    slug: "nexus-host-business",
    name: { bn: "Nexus Host — Business", en: "Nexus Host — Business" },
    price: 450,
    billing: "monthly" as const,
    badge: { bn: "সবচেয়ে জনপ্রিয়", en: "Most popular" },
    summary: {
      bn: "Growth-এ থাকা Business-এর জন্য — Business Email ও Migration সহ।",
      en: "For businesses already growing — with business email and migration.",
    },
    features: {
      bn: ["NVMe Storage", "Free SSL", "Daily Backup", "Free Migration", "Business Email", "24/7 Business Support", "৯৯.৯% Uptime"],
      en: ["NVMe storage", "Free SSL", "Daily backup", "Free migration", "Business email", "24/7 business support", "99.9% uptime"],
    },
  },
  {
    id: "host-growth",
    slug: "nexus-host-growth",
    name: { bn: "Nexus Host — Growth", en: "Nexus Host — Growth" },
    price: 850,
    billing: "monthly" as const,
    badge: null,
    summary: {
      bn: "একাধিক Site, বেশি Traffic এবং Priority Support-এর জন্য।",
      en: "For multiple sites, higher traffic and priority support.",
    },
    features: {
      bn: ["NVMe Storage", "Free SSL", "Daily Backup", "Free Migration", "Business Email", "Priority Support", "৯৯.৯% Uptime"],
      en: ["NVMe storage", "Free SSL", "Daily backup", "Free migration", "Business email", "Priority support", "99.9% uptime"],
    },
  },
];

/** Product helpers — always go through these instead of indexing internal structures. */
export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedProducts
    .map((slug) => getProduct(slug))
    .filter((item): item is Product => Boolean(item));
}

export function getSavings(product: Product): number | null {
  if (product.originalPrice == null || product.currentPrice == null) return null;
  const saving = product.originalPrice - product.currentPrice;
  return saving > 0 ? saving : null;
}

export function getDiscountPercent(product: Product): number | null {
  if (product.originalPrice == null || product.currentPrice == null || product.originalPrice <= 0) return null;
  return Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
}
