import type { FaqItem } from "@/types";

/**
 * FAQ — single source of truth.
 * Every entry comes from the Nexus Lift Master Business System v2.0 question sets.
 * Nothing is invented; `source` records where the answer came from.
 */
export const faqItems: FaqItem[] = [
  {
    id: "target-audience",
    question: { bn: "Nexus Lift কি শুধু বড় Company-এর জন্য?", en: "Is Nexus Lift only for large companies?" },
    answer: {
      bn: "না। ৫ জনের Team-এও Business System দরকার। আমরা business-এর আকার নয়, bottleneck দেখি।",
      en: "No. A five-person team still needs a business system. We look at the bottleneck, not company size.",
    },
    category: "general",
    source: "Homepage FAQ — Master System v2.0",
  },
  {
    id: "audit-free",
    question: { bn: "Free Business Audit আসলে কি Free?", en: "Is the Free Business Audit genuinely free?" },
    answer: {
      bn: "হ্যাঁ, ১০০% Free। কোনো Cost নেই, কোনো Obligation নেই। Audit হলো একটি Diagnostic Aid — আমরা এটিকে বৈজ্ঞানিকভাবে যাচাইকৃত স্কোর বলে দাবি করি না।",
      en: "Yes, 100% free. No cost, no obligation. The audit is a diagnostic aid — we do not present it as a scientifically validated score.",
    },
    category: "audit",
    source: "Homepage FAQ + Build Spec §21",
  },
  {
    id: "payment-methods",
    question: { bn: "Payment কীভাবে করবো?", en: "How do I pay?" },
    answer: {
      bn: "bKash, Nagad, Credit/Debit Card এবং আবেদন সাপেক্ষে Bank Transfer — সব Method Available। পেমেন্ট নিশ্চিতকরণের পর Production শুরু হয়।",
      en: "bKash, Nagad, credit/debit card and bank transfer on request. Production starts after payment verification.",
    },
    category: "payment",
    source: "Homepage FAQ + Build Spec §07",
  },
  {
    id: "timeline",
    question: { bn: "Timeline কত দিন?", en: "What is the timeline?" },
    answer: {
      bn: "SOP System: ১৪–২১ দিন, Website: ২৫–৩০ দিন, Business OS: ৪–৮ সপ্তাহ। Business Profile পণ্যের Timeline এখনো নিশ্চিত করা হয়নি — WhatsApp-এ জেনে নিন।",
      en: "SOP system: 14–21 days, website: 25–30 days, business OS: 4–8 weeks. The timeline for business profile products is not yet confirmed — ask on WhatsApp.",
    },
    category: "general",
    source: "Homepage FAQ + product scope data",
  },
  {
    id: "profile-self-update",
    question: { bn: "কি আমরা পরে নিজে Update করতে পারবো?", en: "Can we update it ourselves later?" },
    answer: {
      bn: "হ্যাঁ, সকল ফাইল Editable দেওয়া হয় এবং Training দেওয়া হয়।",
      en: "Yes. All files are handed over in editable form and training is provided.",
    },
    category: "product",
    source: "Homepage FAQ + Product FAQ",
  },
  {
    id: "profile-industry",
    question: { bn: "Industry না বুঝলে কি System হবে?", en: "Can you build a system without knowing our industry?" },
    answer: {
      bn: "আমরা Process দেখি, Industry না। Sales বা Operations এর Logic সব জায়গায় Similar — তবে Discovery ধাপে আমরা আপনার Workflow বুঝে নিই।",
      en: "We study process, not industry jargon. The logic of sales and operations is similar everywhere, and the discovery phase is where we confirm your workflow.",
    },
    category: "product",
    source: "Product FAQ — Master System v2.0",
  },
  {
    id: "sop-industry",
    question: { bn: "কি আপনি আমাদের Industry বুঝবেন?", en: "Will you understand our industry?" },
    answer: {
      bn: "আমরা Process দেখি, Industry না। Sales বা Operations এর Logic সব জায়গায় Similar।",
      en: "We study process, not industry. The logic of sales and operations is similar everywhere.",
    },
    category: "product",
    source: "SOP product FAQ — Master System v2.0",
  },
  {
    id: "sop-not-just-docs",
    question: { bn: "কি এটি শুধু ডকুমেন্ট হবে?", en: "Is this only a document?" },
    answer: {
      bn: "না, আমরা Training এবং Implementation Supportও দিই — SOP একটি Living System হিসেবে ব্যবহার করা হয়।",
      en: "No. We also provide training and implementation support so the SOP is used as a living system.",
    },
    category: "product",
    source: "SOP product FAQ — Master System v2.0",
  },
  {
    id: "crm-tools",
    question: { bn: "CRM-এর জন্য কোন Tool ব্যবহার করবেন?", en: "Which tool do you use for the CRM?" },
    answer: {
      bn: "HubSpot, GoHighLevel অথবা Custom — আপনার Scope, Budget এবং টিমের সুবিধা অনুযায়ী Tool নির্বাচন করা হয়।",
      en: "HubSpot, GoHighLevel or a custom build — the tool is selected against your scope, budget and team.",
    },
    category: "product",
    source: "CRM product scope — Master System v2.0",
  },
  {
    id: "call-free",
    question: { bn: "Call টি কি সত্যিই Free?", en: "Is the strategy call really free?" },
    answer: {
      bn: "হ্যাঁ, ১০০% Free। কোনো Hidden Cost নেই।",
      en: "Yes, 100% free. There is no hidden cost.",
    },
    category: "general",
    source: "Book Strategy Call page — Master System v2.0",
  },
  {
    id: "call-no-pressure",
    question: { bn: "Call এর পরে কাজ না করলে কি সমস্যা আছে?", en: "Is there a problem if I do not work with you after the call?" },
    answer: {
      bn: "না, কোনো Obligation নেই। আপনি Roadmap টি নিজেও Implement করতে পারেন।",
      en: "No, there is no obligation. You can implement the roadmap yourself.",
    },
    category: "general",
    source: "Book Strategy Call page — Master System v2.0",
  },
  {
    id: "scope-quote",
    question: { bn: "Custom Scope-এর দাম কীভাবে ঠিক হয়?", en: "How is pricing decided for custom scope?" },
    answer: {
      bn: "প্রতিটি Business আলাদা, তাই Custom Scope-এর চূড়ান্ত দাম Discovery-এর পরে Scope ও Deliverables নির্ধারিত হওয়ার পর জানানো হয়। যেসব পণ্যের দাম এখনো নিশ্চিত নয়, সেখানে স্পষ্টভাবে \"Details to be confirmed\" লেখা থাকে।",
      en: "Every business differs, so a custom quote is given after discovery defines scope and deliverables. Where a price is not confirmed yet, it is clearly marked \"Details to be confirmed\".",
    },
    category: "payment",
    source: "Build Spec §09",
  },
  {
    id: "delivery-time",
    question: { bn: "Business Profile পণ্যের Delivery কত দিনে?", en: "What is the delivery time for business profile products?" },
    answer: {
      bn: "এই Timeline এখনো অফিসিয়ালি নিশ্চিত করা হয়নি, তাই আমরা কোনো তারিখ দাবি করি না। WhatsApp-এ আপনার Scope জানালে আমরা নির্দিষ্ট সময় জানিয়ে দেবো।",
      en: "This timeline has not been officially confirmed, so we do not claim a date. Share your scope on WhatsApp and we will confirm a specific time.",
    },
    category: "product",
    source: "Open question — see docs/13_OPEN_QUESTIONS.md",
  },
  {
    id: "profile-revision",
    question: { bn: "Revision কতবার পাবো?", en: "How many revisions do I get?" },
    answer: {
      bn: "Business Profile পণ্যসহ বর্তমান ডিজিটাল পণ্যে ২ রাউন্ড রিভিশন অন্তর্ভুক্ত। এর বেশি পরিবর্তন প্রযোজ্য হলে Scope অনুযায়ী আলোচনা করা হয়।",
      en: "Two rounds of revision are included across current digital products, including business profile products. Further changes are discussed against scope.",
    },
    category: "product",
    source: "Build Spec §07 / §10",
  },
  {
    id: "working-hours",
    question: { bn: "আপনাদের কর্মঘণ্টা কখন?", en: "What are your working hours?" },
    answer: {
      bn: "সকাল ১০:০০ – বিকাল ৫:০০ (বাংলাদেশ সময়)। নির্ধারিত সময়ের বাইরেও আপনি Message পাঠাতে পারেন — উত্তর পরবর্তী কর্মঘণ্টায় দেওয়া হবে।",
      en: "10:00 AM – 5:00 PM Bangladesh time. Outside these hours you can still send messages; replies come during the next working hours.",
    },
    category: "support",
    source: "Build Spec §11",
  },
  {
    id: "ai-governance",
    question: { bn: "AI ব্যবহারে আমাদের গোপন তথ্য কি নিরাপদ?", en: "Is our confidential data safe when AI is used?" },
    answer: {
      bn: "আমরা AI-কে কোনো ব্র্যান্ডেড ব্যক্তিত্ব হিসেবে উপস্থাপন করি না এবং ইন্টারনাল সিস্টেম বা প্রম্পট কখনো প্রকাশ করা হয় না। ব্যক্তিগত তথ্য Configuration অনুযায়ী সীমিত রাখা হয়। AI কোনো Price, Delivery Date বা Payment Confirmation তৈরি করে না।",
      en: "We do not present AI as a branded personality, and internal systems or prompts are never disclosed. Personal data is limited according to configuration. AI never invents prices, delivery dates or payment confirmations.",
    },
    category: "support",
    source: "Build Spec §13 / §14 / SEC-05",
  },
  {
    id: "dashboard-data",
    question: { bn: "Dashboard-এ সংখ্যা কোথা থেকে আসে?", en: "Where do the dashboard numbers come from?" },
    answer: {
      bn: "Your existing data sources — CRM, Project Management, Support এবং Finance — থেকে। আমরা সংখ্যা অনুমান করি না; Data Mapping ধাপে Source নির্ধারণ করা হয়।",
      en: "From your existing data sources — CRM, project management, support and finance. We never estimate numbers; sources are defined during the data-mapping step.",
    },
    category: "support",
    source: "Business OS scope — Master System v2.0",
  },
  {
    id: "refund",
    question: { bn: "Refund Policy কী?", en: "What is the refund policy?" },
    answer: {
      bn: "ডিজিটাল প্রোডাক্ট/সার্ভিসের ক্ষেত্রে কাজ শুরু বা ডেলিভারি হয়ে যাওয়ার পর সাধারণত Refund প্রযোজ্য হয় না, প্রযোজ্য আইন এবং কেস-ভিত্তিক সাপোর্ট সাপেক্ষে। বিস্তারিত আমাদের Refund & Revision Policy পেজে দেওয়া আছে।",
      en: "For digital products and services, refunds are generally not available once work has begun or been delivered, subject to applicable law and case-specific support. Full details are on our Refund & Revision Policy page.",
    },
    category: "payment",
    source: "Build Spec §47",
  },
  {
    id: "messenger-order",
    question: { bn: "অর্ডার কীভাবে করবো?", en: "How do I place an order?" },
    answer: {
      bn: "Facebook Page Messenger অথবা WhatsApp-এ আমাদের সাথে কথা বলে Scope নিশ্চিত করুন, তারপর bKash পেমেন্ট করুন। Website-এ এখনো Direct Checkout নেই।",
      en: "Confirm scope with us on Facebook Page Messenger or WhatsApp, then pay via bKash. There is no direct checkout on the website yet.",
    },
    category: "payment",
    source: "Build Spec §07",
  },
];

export function getFaq(id: string): FaqItem | undefined {
  return faqItems.find((item) => item.id === id);
}

export function getFaqs(ids: string[]): FaqItem[] {
  return ids.map((id) => getFaq(id)).filter((item): item is FaqItem => Boolean(item));
}

export function getFaqsByCategory(category: FaqItem["category"]): FaqItem[] {
  return faqItems.filter((item) => item.category === category);
}
