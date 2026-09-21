import type { CaseStudy } from "@/types";

/**
 * Case studies.
 *
 * IMPORTANT (Build Spec §54): metrics may only be stated where they were supplied by
 * Nexus Lift operations. Each study carries an `evidenceNote` so a reader can see exactly
 * what is a reported client outcome and what is still being evidenced.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "ecommerce-order-error-rate",
    industry: { bn: "E-commerce", en: "E-commerce" },
    title: {
      bn: "কিভাবে একটি E-commerce Business ৩০ দিনে Systematic হয়",
      en: "How an e-commerce business became systematic in 30 days",
    },
    summary: {
      bn: "Order Error Rate ১৫% থেকে ২% — কারণ একটি Order ও Fulfilment SOP এবং Training Checklist।",
      en: "Order error rate went from 15% to 2% — through an order and fulfilment SOP plus a training checklist.",
    },
    context: {
      bn: "একটি বাংলাদেশী E-commerce Business, যেখানে প্রতিদিনের Order Processing সম্পূর্ণভাবে মানুষ-নির্ভর ছিল এবং কোনো লিখিত প্রক্রিয়া ছিল না।",
      en: "A Bangladeshi e-commerce business where daily order processing depended entirely on people and no written process existed.",
    },
    problem: {
      bn: "Order Error Rate ১৫%, নতুন Employee Training-এ ৩ সপ্তাহ এবং মাসে ২০+ Complaint।",
      en: "A 15% order error rate, three weeks of training for a new employee and 20+ complaints per month.",
    },
    diagnosis: {
      bn: "Operations Layer ছিল সবচেয়ে দুর্বল। প্রতিটি Order একই ধাপ অনুসরণ করত না, তাই ভুল ধরার কোনো উপায় ছিল না।",
      en: "The operations layer was the weakest. Orders did not follow the same steps, so there was no way to catch errors.",
    },
    system: {
      bn: "Order Processing SOP, Fulfilment Flowchart, Daily Checklist এবং Role Responsibility Matrix তৈরি করা হয়।",
      en: "We created an order-processing SOP, a fulfilment flowchart, a daily checklist and a role responsibility matrix.",
    },
    implementation: {
      bn: "প্রথমে বর্তমান প্রক্রিয়া ম্যাপ করা হয়, তারপর To-Be Process ডিজাইন, Checklist তৈরি এবং টিমকে Training দেওয়া হয়।",
      en: "The current process was mapped first, then the to-be process was designed, checklists were built and the team was trained.",
    },
    result: {
      bn: "৩০ দিনের মধ্যে Order Error Rate ১৫% → ২% এবং Training সময় ৩ সপ্তাহ → ৩ দিন।",
      en: "Within 30 days the order error rate moved from 15% to 2% and training time fell from three weeks to three days.",
    },
    metrics: [
      { label: { bn: "Order Error Rate", en: "Order error rate" }, before: "15%", after: "2%" },
      { label: { bn: "নতুন Employee Training", en: "New employee training" }, before: "3 weeks", after: "3 days" },
      { label: { bn: "মাসিক Complaint", en: "Monthly complaints" }, before: "20+", after: "3" },
    ],
    evidenceNote: {
      bn: "সংখ্যাগুলো ক্লায়েন্টের নিজের অপারেশনাল রেকর্ড থেকে জানানো হয়েছে (Nexus Lift ডেলিভারি SOP-এর Measure ধাপে সংগৃহীত)। স্বাধীন Third-Party Verification এখনো সম্পন্ন হয়নি।",
      en: "These figures are reported from the client's own operational records, collected during the Measure step of the Nexus Lift delivery SOP. Independent third-party verification has not yet been completed.",
    },
    lesson: {
      bn: "ভুল কমাতে Employee-কে দোষ দেওয়া কাজ করে না — ধাপ কমালে ভুল কমে।",
      en: "Blaming employees does not reduce errors — reducing unstandardised steps does.",
    },
    timeline: { bn: "৩০ দিন", en: "30 days" },
    featured: true,
  },
  {
    slug: "service-agency-follow-up-rate",
    industry: { bn: "Service Agency", en: "Service Agency" },
    title: {
      bn: "২১ দিনে Follow-up Rate ৬০% থেকে ৯৫%",
      en: "Follow-up rate from 60% to 95% in 21 days",
    },
    summary: {
      bn: "প্রতিটি Lead-এর জন্য একটি স্পষ্ট পরবর্তী ধাপ — এটি নিশ্চিত করেছিল CRM Pipeline এবং Follow-up Automation।",
      en: "A clear next step for every lead — delivered by a CRM pipeline and follow-up automation.",
    },
    context: {
      bn: "একটি Service Agency যেখানে Enquiry প্রতি মাসেই বাড়ছিল, কিন্তু Follow-up কোনো নির্দিষ্ট ব্যক্তির মনে রাখার ওপর নির্ভর করত।",
      en: "A service agency where monthly enquiries were rising, but follow-up depended on one person remembering.",
    },
    problem: {
      bn: "Follow-up Rate ছিল ৬০% — অর্থাৎ প্রতি ১০টি Lead-এর ৪টির কোনো পরবর্তী যোগাযোগ হত না।",
      en: "The follow-up rate was 60% — four of every ten leads received no further contact.",
    },
    diagnosis: {
      bn: "Intelligence Layer ছিল দুর্বল: Lead Data Email, WhatsApp এবং Excel-এ ছড়িয়ে ছিল এবং একটি Pipeline View ছিল না।",
      en: "The intelligence layer was weak: lead data was spread across email, WhatsApp and Excel with no pipeline view.",
    },
    system: {
      bn: "Central CRM, Lead → Won Pipeline, Follow-up Automation এবং Retention Alert সেটআপ করা হয়।",
      en: "A central CRM, lead-to-won pipeline, follow-up automation and retention alerts were set up.",
    },
    implementation: {
      bn: "প্রথমে বিদ্যমান Lead Data একত্র করা হয়, তারপর Pipeline Stage নির্ধারণ, Follow-up Sequence তৈরি এবং টিমকে Training দেওয়া হয়।",
      en: "Existing lead data was consolidated first, then pipeline stages were defined, follow-up sequences created and the team trained.",
    },
    result: {
      bn: "২১ দিনে Follow-up Rate ৬০% → ৯৫%।",
      en: "In 21 days the follow-up rate moved from 60% to 95%.",
    },
    metrics: [
      { label: { bn: "Follow-up Rate", en: "Follow-up rate" }, before: "60%", after: "95%" },
      { label: { bn: "Follow-up-এর মালিক", en: "Follow-up owner" }, before: "Memory", after: "System" },
    ],
    evidenceNote: {
      bn: "সংখ্যাগুলো ক্লায়েন্টের CRM Activity Log থেকে জানানো হয়েছে। এটি একটি Reported Outcome, কোনো গ্যারান্টি নয়।",
      en: "These figures are reported from the client's CRM activity log. This is a reported outcome, not a guarantee.",
    },
    lesson: {
      bn: "Follow-up একটি মনোভাব নয়, একটি সিস্টেম — Memory-এর ওপর নির্ভর করলে সেটি মিস হয়।",
      en: "Follow-up is a system, not an attitude — if it depends on memory, it gets missed.",
    },
    timeline: { bn: "২১ দিন", en: "21 days" },
    featured: true,
  },
  {
    slug: "manufacturing-founder-independence",
    industry: { bn: "Manufacturing", en: "Manufacturing" },
    title: {
      bn: "Founder-dependent থেকে Team-independent: ৪৫ দিন",
      en: "From founder-dependent to team-independent: 45 days",
    },
    summary: {
      bn: "Structure ও Operations Layer একসাথে ঠিক করার ফলে সিদ্ধান্ত Owner-নির্ভর থেকে Process-নির্ভর হয়।",
      en: "Fixing the structure and operations layers together moved decisions from owner-dependent to process-dependent.",
    },
    context: {
      bn: "একটি Manufacturing Business যেখানে প্রতিটি অনুমোদন Founder-এর কাছেই আসত, ফলে সিদ্ধান্ত ধীর হত।",
      en: "A manufacturing business where every approval reached the founder, slowing every decision.",
    },
    problem: {
      bn: "Founder-dependent কাজ, বিলম্বিত Approval এবং ভারী Escalation।",
      en: "Founder-dependent work, delayed approvals and heavy escalation.",
    },
    diagnosis: {
      bn: "Structure Layer-এ Authority নির্ধারিত ছিল না, তাই সব সিদ্ধান্ত উপরে উঠত।",
      en: "Authority was undefined in the structure layer, so every decision moved upward.",
    },
    system: {
      bn: "Organogram, Role & Responsibility Matrix, Authority Matrix এবং Approval & Escalation Policy তৈরি করা হয়।",
      en: "An organogram, role & responsibility matrix, authority matrix and approval & escalation policy were created.",
    },
    implementation: {
      bn: "প্রতিটি কাজের Owner নির্ধারণ, Approval Limit নির্ধারণ এবং টিম ব্রিফিং করা হয়।",
      en: "An owner was named for every task, approval limits were defined and the team was briefed.",
    },
    result: {
      bn: "৪৫ দিনে Founders-এর দৈনিক অনুমোদনের চাপ কমে আসে এবং সিদ্ধান্ত Process অনুযায়ী হয়।",
      en: "Within 45 days the founder's daily approval load dropped and decisions followed the process.",
    },
    metrics: [
      { label: { bn: "সিদ্ধান্তের ধরন", en: "Decision pattern" }, before: "Founder-dependent", after: "Process-dependent" },
    ],
    evidenceNote: {
      bn: "এই কেস স্টাডিতে সংখ্যাগত দাবি নেই — শুধু অপারেশনাল পরিবর্তন বর্ণনা করা হয়েছে।",
      en: "This case study makes no numerical claim — it describes only the operational change.",
    },
    lesson: {
      bn: "Authority স্পষ্ট না হলে সব সিদ্ধান্ত Founder-এর টেবিলে এসে পড়ে।",
      en: "If authority is not explicit, every decision lands on the founder's desk.",
    },
    timeline: { bn: "৪৫ দিন", en: "45 days" },
    featured: true,
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
