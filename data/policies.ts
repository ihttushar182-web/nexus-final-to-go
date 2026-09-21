import type { Policy } from "@/types";

/**
 * Policies (Build Spec §47).
 * Wording deliberately mirrors the supplied business policy — no absolute legal claims.
 */
export const policies: Policy[] = [
  {
    slug: "privacy",
    title: { bn: "Privacy Policy", en: "Privacy Policy" },
    updatedAt: "2026-10-01",
    intro: {
      bn: "Nexus Lift আপনার দেওয়া তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সংরক্ষণ করা হয় তা এই পলিসিতে ব্যাখ্যা করা হয়েছে।",
      en: "This policy explains how Nexus Lift collects, uses and stores the information you provide.",
    },
    sections: [
      {
        heading: { bn: "১. আমরা কী তথ্য সংগ্রহ করি", en: "1. Information we collect" },
        body: {
          bn: [
            "Business Audit ফর্মে দেওয়া তথ্য: Business Name, Website/Social Link, Business Stage, Team Size, ৬টি Layer-এর উত্তর, সমস্যা, বর্তমান Tools, ৬ মাসের লক্ষ্য, নাম, Email এবং WhatsApp নম্বর।",
            "Contact Form বা WhatsApp/Messenger-এ আপনি যে তথ্য পাঠান।",
            "Website ব্যবহারের সাধারণ টেকনিক্যাল তথ্য (Page View, UTM Parameter)।",
          ],
          en: [
            "Information submitted in the Business Audit form: business name, website/social link, business stage, team size, the six layer answers, current problem, current tools, six-month goal, name, email and WhatsApp number.",
            "Information you send through the contact form or over WhatsApp/Messenger.",
            "General technical usage data (page views, UTM parameters).",
          ],
        },
      },
      {
        heading: { bn: "২. তথ্য কীভাবে ব্যবহার করা হয়", en: "2. How information is used" },
        body: {
          bn: [
            "আপনার Audit Snapshot তৈরি করতে।",
            "আপনার Enquiry-এর উত্তর দিতে এবং Custom Proposal তৈরি করতে।",
            "Service সম্পর্কে প্রয়োজনীয় আপডেট পাঠাতে (আপনি চাইলে বন্ধ করা যাবে)।",
            "Website ও Service-এর মান উন্নত করতে।",
          ],
          en: [
            "To generate your audit snapshot.",
            "To respond to your enquiry and prepare a custom proposal.",
            "To send necessary service updates (you can opt out).",
            "To improve the website and our services.",
          ],
        },
      },
      {
        heading: { bn: "৩. AI ও Automation সম্পর্কে আমাদের অবস্থান", en: "3. Our position on AI and automation" },
        body: {
          bn: [
            "আমরা কখনোই AI-কে একটি ব্র্যান্ডেড ব্যক্তিত্ব বা 'গোপন এজেন্ট' হিসেবে উপস্থাপন করি না। আপনার সাথে যে প্রতিনিধি কথা বলেন তিনি Nexus Lift-এর একজন মানব প্রতিনিধি, অথবা স্পষ্টভাবে চিহ্নিত স্বয়ংক্রিয় সহায়ক।",
            "AI বা Automation কোনো Price, Delivery Date, Payment Confirmation বা Order Status নিজে থেকে তৈরি করতে পারে না।",
            "আপনার গোপন ব্যবসায়িক তথ্য আমাদের AI/KM Configuration-এ শুধুমাত্র প্রয়োজনীয় সীমায় রাখা হয় এবং Configuration ছাড়া বাইরের কোনো মডেলকে দেওয়া হয় না।",
          ],
          en: [
            "We never present AI as a branded personality or a hidden agent. The representative who speaks with you is a human Nexus Lift representative, or a clearly labelled automated assistant.",
            "AI or automation never generates a price, delivery date, payment confirmation or order status on its own.",
            "Your confidential business information is limited to what the configuration requires and is not sent to external models outside that configuration.",
          ],
        },
      },
      {
        heading: { bn: "৪. তথ্য কার সাথে শেয়ার করা হয়", en: "4. Who information is shared with" },
        body: {
          bn: [
            "আমরা আপনার তথ্য বিক্রি করি না।",
            "সেবা প্রদানের জন্য প্রয়োজনীয় ক্ষেত্রে Hosting, CRM বা Email প্রোভাইডারের মতো Processor ব্যবহার করা হয়, যারা চুক্তির অধীনে কাজ করে।",
            "প্রযোজ্য আইন, আদালতের আদেশ বা সরকারি অনুরোধে তথ্য দিতে হতে পারে।",
            "Discovery Call-এর জন্য গোপনীয়তা: আপনার Business Data বাইরে শেয়ার করা হয় না।",
          ],
          en: [
            "We do not sell your information.",
            "Where necessary to deliver a service we use processors such as hosting, CRM or email providers, who operate under agreement.",
            "We may disclose information where required by applicable law, court order or a government request.",
            "Discovery call confidentiality: your business data is not shared externally.",
          ],
        },
      },
      {
        heading: { bn: "৫. সংরক্ষণ ও নিরাপত্তা", en: "5. Storage and security" },
        body: {
          bn: [
            "Audit Submission এবং Lead তথ্য আমাদের CRM/Database-এ সংরক্ষিত হয় এবং শুধুমাত্র অনুমোদিত Team Member অ্যাক্সেস করতে পারেন।",
            "Admin প্যানেল Password-protected এবং Role-based Access Control প্রযোজ্য।",
            "Secure Cookie ব্যবহার করা হয়; Webhook Endpoint-গুলোতে Secret Header যাচাই করা হয়।",
            "আপনি চাইলে আমরা আপনার তথ্য মুছে ফেলতে পারি — nexusliftbd@gmail.com এ লিখুন।",
          ],
          en: [
            "Audit submissions and lead data are stored in our CRM/database and are accessible only to authorised team members.",
            "The admin panel is password protected with role-based access control.",
            "Secure cookies are used, and webhook endpoints verify a secret header.",
            "You can request deletion of your data by writing to nexusliftbd@gmail.com.",
          ],
        },
      },
      {
        heading: { bn: "৬. Cookies ও Analytics", en: "6. Cookies and analytics" },
        body: {
          bn: [
            "Website কার্যকারিতার জন্য প্রয়োজনীয় Cookie ব্যবহার করা হয়।",
            "Analytics Event (যেমন audit_start, whatsapp_click) সংগ্রহ করা হতে পারে, তবে সেখানে কোনো সংবেদনশীল তথ্য রাখা হয় না।",
          ],
          en: [
            "Cookies necessary for website functionality are used.",
            "Analytics events (such as audit_start, whatsapp_click) may be collected, without sensitive information.",
          ],
        },
      },
      {
        heading: { bn: "৭. যোগাযোগ", en: "7. Contact" },
        body: {
          bn: ["Privacy সংক্রান্ত কোনো প্রশ্ন থাকলে: nexusliftbd@gmail.com অথবা WhatsApp 01814716713।"],
          en: ["For privacy questions: nexusliftbd@gmail.com or WhatsApp 01814716713."],
        },
      },
    ],
  },
  {
    slug: "terms",
    title: { bn: "Terms of Service", en: "Terms of Service" },
    updatedAt: "2026-10-01",
    intro: {
      bn: "Nexus Lift-এর সেবা ব্যবহারের শর্তাবলি নিচে দেওয়া হলো। অর্ডার নিশ্চিত করার মাধ্যমে আপনি এই শর্তগুলোর সাথে সম্মত হচ্ছেন।",
      en: "The terms for using Nexus Lift services are set out below. By confirming an order you agree to these terms.",
    },
    sections: [
      {
        heading: { bn: "১. সেবার পরিধি (Scope)", en: "1. Scope of service" },
        body: {
          bn: [
            "প্রতিটি কাজ শুরু হয় একটি লিখিত/লিখিতভাবে নিশ্চিত Scope দিয়ে — Deliverables, Timeline এবং Revision সংখ্যা সেখানে উল্লেখ থাকে।",
            "Scope-এর বাইরের কাজ আলাদা Quote অনুযায়ী হবে।",
            "Website-এ প্রদর্শিত 'Starting from' মূল্য শুধুমাত্র সূচনা বিন্দু; চূড়ান্ত মূল্য Scope ও Deliverables নিশ্চিত হওয়ার পর নির্ধারিত হয়।",
          ],
          en: [
            "Every engagement begins with a confirmed written scope that lists deliverables, timeline and the number of revisions.",
            "Work outside the agreed scope is quoted separately.",
            "A \"starting from\" price on the website is an entry point only; the final price is defined once scope and deliverables are confirmed.",
          ],
        },
      },
      {
        heading: { bn: "২. Revision নীতি", en: "2. Revision policy" },
        body: {
          bn: [
            "বর্তমান ডিজিটাল পণ্যগুলোতে ২ রাউন্ড Revision অন্তর্ভুক্ত।",
            "Revision Request Scope-এর মধ্যেই থাকতে হবে; নতুন Deliverable যোগ করা Revision নয়, তা Change Request।",
          ],
          en: [
            "Current digital products include two rounds of revision.",
            "Revision requests must stay within the agreed scope; adding a new deliverable is a change request, not a revision.",
          ],
        },
      },
      {
        heading: { bn: "৩. পেমেন্ট", en: "3. Payment" },
        body: {
          bn: [
            "বর্তমানে Payment গ্রহণ করা হয় bKash, Nagad, Card অথবা আবেদন সাপেক্ষে Bank Transfer-এ।",
            "Website-এ Direct Checkout নেই — অর্ডার নিশ্চিত হয় WhatsApp/Messenger-এ Scope নিশ্চিত করার পর।",
            "Transaction ID জমা দিলেই পেমেন্ট Verified হয়ে যায় না — মানব যাচাই প্রয়োজন।",
            "যেসব প্রজেক্টে দুটি ধাপে পেমেন্ট প্রযোজ্য, সেখানে ডেলিভারির আগে বাকি অংশ পরিশোধ করতে হবে।",
          ],
          en: [
            "Payment is currently taken via bKash, Nagad, card or bank transfer on request.",
            "There is no direct checkout on the website — orders are confirmed after scope is agreed over WhatsApp/Messenger.",
            "Submitting a transaction ID does not automatically verify a payment; human verification is required.",
            "Where a project is split into two payments, the balance is payable before delivery.",
          ],
        },
      },
      {
        heading: { bn: "৪. Timeline ও Delay", en: "4. Timeline and delay" },
        body: {
          bn: [
            "Timeline শুরু হয় Onboarding Form, প্রয়োজনীয় ডকুমেন্ট এবং পেমেন্ট নিশ্চিত হওয়ার পর।",
            "ক্লায়েন্টের পক্ষ থেকে তথ্য দেরিতে দিলে Timeline সেই অনুপাতে বাড়বে।",
            "যেসব সার্ভিসে Delivery Date Contract-এ উল্লেখ থাকে, সেখানে Delay হলে Contract অনুযায়ী সমাধান হবে।",
          ],
          en: [
            "The timeline begins after the onboarding form, required documents and payment are confirmed.",
            "If information is delayed from the client side, the timeline extends proportionally.",
            "Where a contract states a delivery date, any delay is resolved according to that contract.",
          ],
        },
      },
      {
        heading: { bn: "৫. ক্লায়েন্টের দায়িত্ব", en: "5. Client responsibilities" },
        body: {
          bn: [
            "প্রয়োজনীয় তথ্য, Brand Asset এবং Feedback সময়মতো দেওয়া।",
            "প্রদত্ত তথ্যের সঠিকতা নিশ্চিত করা।",
            "Audit বা System-এর ফলাফল শুধুমাত্র ব্যবসার অপারেশনাল সিদ্ধান্তের সহায়ক, সেগুলো কোনো আর্থিক গ্যারান্টি নয়।",
          ],
          en: [
            "Providing required information, brand assets and feedback on time.",
            "Confirming the accuracy of the information supplied.",
            "Understanding that audit or system outputs support operational decisions and are not financial guarantees.",
          ],
        },
      },
      {
        heading: { bn: "৬. বৌদ্ধিক সম্পদ (Ownership)", en: "6. Ownership" },
        body: {
          bn: [
            "নিশ্চিতকৃত পেমেন্ট ও ডেলিভারির পর ক্লায়েন্ট Drive-এর ফাইল এবং কাস্টম তৈরি ডেলিভারেবলের ব্যবহারের অধিকার ক্লায়েন্টের।",
            "তৃতীয় পক্ষের Tool বা License-এর শর্ত সেখানে প্রযোজ্য থাকবে।",
            "Nexus Lift তার Framework, Template ও Methodology-র মালিকানা ধরে রাখে।",
          ],
          en: [
            "After confirmed payment and delivery, the client receives usage rights over the delivered files and custom-created deliverables.",
            "Terms of any third-party tool or licence continue to apply.",
            "Nexus Lift retains ownership of its own frameworks, templates and methodologies.",
          ],
        },
      },
      {
        heading: { bn: "৭. দাবি ও সীমাবদ্ধতা", en: "7. Claims and limitations" },
        body: {
          bn: [
            "আমরা \"market leader\", \"number one\", \"guaranteed growth\", \"guaranteed revenue\" বা \"guaranteed ROI\" ধরনের কোনো দাবি করি না।",
            "Case Study-তে উল্লেখিত ফলাফল সেই নির্দিষ্ট ক্লায়েন্টের প্রেক্ষাপটে জানানো হয়েছে — সেটি অন্য কোনো ব্যবসার ফলাফলের নিশ্চয়তা নয়।",
          ],
          en: [
            "We do not claim to be a market leader or number one, and we do not guarantee growth, revenue or ROI.",
            "Outcomes described in case studies are reported in that specific client's context and are not a guarantee of results for another business.",
          ],
        },
      },
      {
        heading: { bn: "৮. যোগ্য আইন", en: "8. Governing law" },
        body: {
          bn: ["এই শর্তাবলি বাংলাদেশের প্রযোজ্য আইনের অধীন।"],
          en: ["These terms are subject to the applicable laws of Bangladesh."],
        },
      },
    ],
  },
  {
    slug: "refund-policy",
    title: { bn: "Refund & Revision Policy", en: "Refund & Revision Policy" },
    updatedAt: "2026-10-01",
    intro: {
      bn: "ডিজিটাল প্রোডাক্ট ও সার্ভিসে Refund সংক্রান্ত নীতি নিচে পরিষ্কারভাবে দেওয়া হলো।",
      en: "Our policy on refunds for digital products and services is set out clearly below.",
    },
    sections: [
      {
        heading: { bn: "১. সাধারণ নীতি", en: "1. General policy" },
        body: {
          bn: [
            "ডিজিটাল প্রোডাক্ট/সার্ভিসের ক্ষেত্রে কাজ শুরু হয়ে যাওয়ার বা ডেলিভারি হয়ে যাওয়ার পর সাধারণত Refund প্রযোজ্য হয় না, প্রযোজ্য আইন এবং কেস-ভিত্তিক সাপোর্ট সাপেক্ষে।",
            "কাজ শুরু হওয়ার আগে অর্ডার বাতিল করলে সম্পূর্ণ বা আংশিক Refund সম্ভব হতে পারে — কোনো গেটওয়ে Cost বা Processing Fee কেটে নেওয়া হতে পারে।",
          ],
          en: [
            "For digital products and services, refunds are generally not available once work has begun or has been delivered, subject to applicable law and case-specific support.",
            "If an order is cancelled before work begins, a full or partial refund may be possible, less any gateway or processing cost already incurred.",
          ],
        },
      },
      {
        heading: { bn: "২. Revision কেন বেশি কার্যকর", en: "2. Why revisions are the primary remedy" },
        body: {
          bn: [
            "আমাদের প্রথম পছন্দ হলো সমাধান করা, Refund নয়। নির্ধারিত ২ রাউন্ড Revision Scope-এর মধ্যে সঠিক কাজটি নিশ্চিত করার জন্য ব্যবহার করুন।",
            "Deliverable Scope অনুযায়ী না হলে আমরাScope পূরণ না হওয়া পর্যন্ত কাজ করি।",
          ],
          en: [
            "Our preference is to fix the output rather than refund. Use the two included revision rounds to make sure the deliverable matches the agreed scope.",
            "If a deliverable does not match the agreed scope, we keep working until the scope is met.",
          ],
        },
      },
      {
        heading: { bn: "৩. যেসব ক্ষেত্রে Refund বিবেচনা করা হয়", en: "3. When a refund is considered" },
        body: {
          bn: [
            "পেমেন্ট করার পর আমরা কাজ শুরু করতে না পারলে।",
            "দুই পক্ষের মধ্যে সম্মত Scope পরিবর্তন হলে এবং সেটি আর প্রযোজ্য না হলে।",
            "ডেলিভারি সম্পূর্ণভাবে সম্ভব না হলে এবং বিকল্প সমাধান দুই পক্ষের কাছে গ্রহণযোগ্য না হলে।",
            "কোনো দ্বিগুণ/ভুল পেমেন্ট হলে তা ফেরত দেওয়া হয়।",
          ],
          en: [
            "If payment is made and we are unable to begin work.",
            "If the agreed scope changes materially and no longer applies.",
            "If delivery is impossible and no alternative is acceptable to both parties.",
            "Any duplicate or mistaken payment is returned.",
          ],
        },
      },
      {
        heading: { bn: "৪. Refund চাওয়ার পদ্ধতি", en: "4. How to request a refund" },
        body: {
          bn: [
            "WhatsApp (01814716713) অথবা nexusliftbd@gmail.com এ Order Number সহ লিখুন।",
            "কর্মঘণ্টা: সকাল ১০:০০ – বিকাল ৫:০০ (বাংলাদেশ সময়)।",
            "আমরা বিষয়টি যাচাই করে যুক্তিসঙ্গত সময়ের মধ্যে সিদ্ধান্ত জানাবো।",
          ],
          en: [
            "Write to WhatsApp (01814716713) or nexusliftbd@gmail.com with your order number.",
            "Working hours: 10:00 AM – 5:00 PM Bangladesh time.",
            "We review the matter and respond within a reasonable time.",
          ],
        },
      },
      {
        heading: { bn: "৫. Hosting সার্ভিস", en: "5. Hosting services" },
        body: {
          bn: [
            "Hosting-এর Refund শর্ত Plan-এর শর্তাবলি অনুযায়ী নির্ধারিত হবে। Domain Registration Fee সাধারণত Refund-যোগ্য নয়।",
          ],
          en: [
            "Refunds for hosting are governed by the terms of the relevant plan. Domain registration fees are generally non-refundable.",
          ],
        },
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return policies.find((policy) => policy.slug === slug);
}
