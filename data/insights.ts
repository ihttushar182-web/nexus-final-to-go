import type { InsightArticle } from "@/types";

/**
 * Insights (Build Spec §53).
 * Articles are written from the Nexus Lift content calendar outlines.
 * Numbers are only used where Nexus Lift operations supplied them, and they are
 * always attributed to their source. Nothing is fabricated.
 */
export const insights: InsightArticle[] = [
  {
    slug: "why-your-team-repeats-the-same-mistakes",
    title: {
      bn: "কেন আপনার Team বারবার একই ভুল করে? (SOP ছাড়া Business চলে না)",
      en: "Why does your team keep making the same mistakes? (No business runs without SOPs)",
    },
    excerpt: {
      bn: "ভুলের কারণ মানুষ নয় — কারণ প্রক্রিয়া নেই। Operations Layer দুর্বল হলে প্রতিটি কাজ ব্যক্তির উপর নির্ভর করে।",
      en: "Mistakes do not come from people — they come from missing process. When the operations layer is weak, every task depends on an individual.",
    },
    category: "operations",
    author: "Nexus Lift",
    publishedAt: "2026-10-07",
    updatedAt: "2026-10-07",
    readingMinutes: 6,
    featured: true,
    schemaType: "BlogPosting",
    seoTitle: {
      bn: "কেন আপনার Team বারবার একই ভুল করে? | Nexus Lift",
      en: "Why does your team keep making the same mistakes? | Nexus Lift",
    },
    seoDescription: {
      bn: "Operations Layer দুর্বল হলে ভুল কেন হয়, এবং একটি Custom SOP System সেটিকে কীভাবে ঠিক করে — বাস্তব উদাহরণসহ।",
      en: "Why errors happen when the operations layer is weak, and how a custom SOP system fixes it — with practical examples.",
    },
    body: [
      {
        heading: { bn: "প্রতিদিনের লক্ষণগুলো", en: "The everyday symptoms" },
        paragraphs: {
          bn: [
            "আপনার Business-এ কি এই সমস্যাগুলো হয়? নতুন Employee জয়েন করলে বারবার একই কথা শেখাতে হয়। আপনি ছুটিতে গেলে কাজ বন্ধ হয়ে যায়। ভুল হলে কারণ খুঁজে পাওয়া যায় না।",
            "এই তিনটি লক্ষণ আলাদা সমস্যা মনে হলেও আসলে একটি — Operations Layer স্পষ্ট নয়।",
          ],
          en: [
            "Do these problems happen in your business? A new employee needs the same training again and again. Work stops when you take leave. When something goes wrong, the reason cannot be traced.",
            "These look like three separate problems but are one: the operations layer is not explicit.",
          ],
        },
      },
      {
        heading: { bn: "কেন ভুল হয়: কারণটি মানুষের নয়", en: "Why errors happen: the cause is not people" },
        paragraphs: {
          bn: [
            "ভুলের সবচেয়ে সাধারণ কারণ হলো একটি কাজ একাধিক উপায়ে সম্পন্ন হওয়া। যদি প্রতিটি Order ভিন্নভাবে Process হয়, তবে ভুল ধরার কোনো উপায় থাকে না — কারণ 'সঠিক' ধাপটি কী ছিল সেটিই স্পষ্ট নয়।",
            "SOP ঠিক করে ভুলের সম্ভাবনা বলে দেয় না, কিন্তু ভুল কোথায় হয়েছে সেটি দেখানো সম্ভব করে। এটিই আসল পার্থক্য।",
          ],
          en: [
            "The most common cause of error is one task being completed in several different ways. If every order is processed differently, there is no way to catch an error — because it is unclear which step was 'correct'.",
            "An SOP does not remove the possibility of error, but it makes it possible to see where the error happened. That is the real difference.",
          ],
        },
        callout: {
          bn: "SOP মানে একটি মোটা ফাইল নয়। SOP মানে একটি Living System — যা প্রতিদিন ব্যবহার হয়।",
          en: "An SOP is not a thick file. An SOP is a living system that gets used every day.",
        },
      },
      {
        heading: { bn: "Operations Layer-এর পাঁচটি উপাদান", en: "The five components of the operations layer" },
        paragraphs: {
          bn: ["Nexus Lift Operations Layer-কে পাঁচটি বাস্তব উপাদানে ভাগ করে:"],
          en: ["Nexus Lift breaks the operations layer into five practical components:"],
        },
        bullets: {
          bn: [
            "Process Map — কাজটি আসলে কোন ধাপে হয়",
            "SOP — প্রতিটি ধাপ লিখিতভাবে",
            "Checklist — প্রতিদিন/প্রতি সপ্তাহে ব্যবহারযোগ্য তালিকা",
            "Role Matrix — কোন ধাপের Owner কে",
            "Approval & Escalation — কোন সিদ্ধান্ত কে নেবে",
          ],
          en: [
            "Process map — which steps the work actually goes through",
            "SOP — each step written down",
            "Checklist — a list usable daily/weekly",
            "Role matrix — who owns each step",
            "Approval & escalation — who decides what",
          ],
        },
      },
      {
        heading: { bn: "একটি বাস্তব উদাহরণ", en: "A practical example" },
        paragraphs: {
          bn: [
            "একটি E-commerce Business-এ Order Error Rate ছিল ১৫%, নতুন Employee Training-এ লাগত ৩ সপ্তাহ এবং মাসে Complaint ছিল ২০+।",
            "Order Processing SOP, Fulfilment Flowchart, Daily Checklist এবং Role Matrix তৈরি করার পর ৩০ দিনে Error Rate ১৫% থেকে ২% এবং Training সময় ৩ সপ্তাহ থেকে ৩ দিনে নামে।",
            "লক্ষ্য করুন: টিম বদলায়নি, মানুষের দক্ষতা বদলায়নি। শুধু ধাপগুলো একই করা হয়েছে।",
          ],
          en: [
            "In one e-commerce business the order error rate was 15%, new employee training took three weeks and monthly complaints were 20+.",
            "After creating an order-processing SOP, a fulfilment flowchart, a daily checklist and a role matrix, within 30 days the error rate moved from 15% to 2% and training time from three weeks to three days.",
            "Note what changed: not the team, not the people's skill. Only the steps were made the same every time.",
          ],
        },
        source: "Nexus Lift case study — ecommerce-order-error-rate (client-reported operational records)",
      },
      {
        heading: { bn: "কোথা থেকে শুরু করবেন", en: "Where to start" },
        paragraphs: {
          bn: [
            "সব প্রক্রিয়ার SOP একসাথে তৈরি করতে গেলে কখনো শেষ হয় না। সবচেয়ে বেশি ভুল হয় যে পাঁচটি কাজে — সেগুলো দিয়ে শুরু করুন।",
            "আপনার Business-এর সবচেয়ে দুর্বল Layer কোনটি তা জানতে Free Business Audit করুন। Operations যদি সবচেয়ে দুর্বল হয়, তবে সেটিই আপনার প্রথম Priorities।",
          ],
          en: [
            "Trying to write an SOP for every process at once never finishes. Start with the five tasks where errors cost the most.",
            "Use the free business audit to see which layer is weakest. If operations is the weakest, it becomes your first priority.",
          ],
        },
      },
    ],
  },
  {
    slug: "where-does-your-customer-data-live",
    title: {
      bn: "CRM ছাড়া Customer Data কোথায় রাখেন?",
      en: "Where does your customer data live without a CRM?",
    },
    excerpt: {
      bn: "Excel, WhatsApp, Notebook আর মানুষের Memory — এই চারটি জায়গায় ছড়িয়ে থাকা Data Follow-up মিস করায়।",
      en: "Excel, WhatsApp, a notebook and human memory — data spread across four places is how follow-ups get missed.",
    },
    category: "crm",
    author: "Nexus Lift",
    publishedAt: "2026-10-14",
    updatedAt: "2026-10-14",
    readingMinutes: 6,
    featured: true,
    schemaType: "BlogPosting",
    seoTitle: {
      bn: "CRM ছাড়া Customer Data কোথায় রাখেন? | Nexus Lift",
      en: "Where does your customer data live without a CRM? | Nexus Lift",
    },
    seoDescription: {
      bn: "Customer Data Excel, WhatsApp ও Memory-তে ছড়িয়ে থাকলে কী হয়, এবং একটি Central CRM কীভাবে Follow-up নিশ্চিত করে।",
      en: "What happens when customer data is spread across Excel, WhatsApp and memory, and how a central CRM makes follow-up reliable.",
    },
    body: [
      {
        heading: { bn: "চারটি প্রশ্ন নিজেকেই করুন", en: "Ask yourself four questions" },
        paragraphs: {
          bn: ["আপনার Customer Data কোথায় থাকে?"],
          en: ["Where does your customer data actually live?"],
        },
        bullets: {
          bn: [
            "Excel Sheet — কিন্তু কোন ফাইলটি সর্বশেষ?",
            "WhatsApp Chat — কিন্তু কোন Chat-এ কী প্রতিশ্রুতি দেওয়া হয়েছিল?",
            "Notebook — কিন্তু কে সেটি পড়ে?",
            "কোনো Employee-এর Memory — কিন্তু তিনি ছুটিতে গেলে?",
          ],
          en: [
            "An Excel sheet — but which file is the latest?",
            "WhatsApp chats — but which chat recorded which promise?",
            "A notebook — but who else reads it?",
            "An employee's memory — but what happens when they are on leave?",
          ],
        },
      },
      {
        heading: { bn: "Data Scattered থাকলে Lead হারায়", en: "When data is scattered, leads are lost" },
        paragraphs: {
          bn: [
            "একটি Service Agency-তে Follow-up Rate ছিল ৬০% — অর্থাৎ প্রতি ১০টি Lead-এর ৪টির কোনো পরবর্তী যোগাযোগ হত না। কারণটি ছিল Technical নয়, ছিল Organizational: Data কোথায় থাকবে তার একটি নির্দিষ্ট জায়গা ছিল না।",
            "Central CRM, Lead → Won Pipeline এবং Follow-up Automation সেটআপ করার পর ২১ দিনে Follow-up Rate ৬০% থেকে ৯৫%-এ পৌঁছায়।",
          ],
          en: [
            "In one service agency the follow-up rate was 60% — four of every ten leads received no further contact. The cause was not technical but organisational: there was no single defined place for the data.",
            "After setting up a central CRM, a lead-to-won pipeline and follow-up automation, the follow-up rate reached 95% from 60% within 21 days.",
          ],
        },
        source: "Nexus Lift case study — service-agency-follow-up-rate (client CRM activity log)",
      },
      {
        heading: { bn: "একটি CRM আসলে কী করে", en: "What a CRM actually does" },
        paragraphs: {
          bn: ["Nexus Lift একটি CRM-কে চারটি কাজের জন্য সেটআপ করে:"],
          en: ["Nexus Lift configures a CRM for four jobs:"],
        },
        bullets: {
          bn: [
            "সব Lead একটি জায়গায় — প্রতিটি Enquiry একটি Record",
            "প্রতিটি Lead-এর একটি স্পষ্ট পরবর্তী ধাপ ও তারিখ",
            "Follow-up স্বয়ংক্রিয় — মনে রাখার দরকার নেই",
            "Retention Alert — পুরনো Customer যাতে হারিয়ে না যায়",
          ],
          en: [
            "Every lead in one place — each enquiry becomes a record",
            "A clear next step and date for every lead",
            "Follow-up handled automatically — nothing to remember",
            "Retention alerts so old customers do not fade away",
          ],
        },
        callout: {
          bn: "Follow-up একটি মনোভাব নয়, একটি সিস্টেম। Memory-এর ওপর নির্ভর করলে সেটি মিস হয়।",
          en: "Follow-up is a system, not an attitude. If it depends on memory, it gets missed.",
        },
      },
      {
        heading: { bn: "কোন Tool দিয়ে শুরু করবেন", en: "Which tool to start with" },
        paragraphs: {
          bn: [
            "HubSpot, GoHighLevel অথবা Custom — সবচেয়ে গুরুত্বপূর্ণ প্রশ্নটি Tool নয়, Structure: আপনার Sales Pipeline আসলে কোন ধাপগুলোতে চলে?",
            "প্রথমে ধাপগুলো লিখুন, তারপর Tool বাছুন। উল্টো করলে দামি Software-ও অব্যবহৃত থেকে যাবে।",
          ],
          en: [
            "HubSpot, GoHighLevel or a custom build — the important question is not the tool but the structure: which stages does your sales pipeline actually go through?",
            "Write the stages first, then choose the tool. Do it the other way and even expensive software goes unused.",
          ],
        },
      },
    ],
  },
  {
    slug: "three-businesses-three-systems-three-results",
    title: {
      bn: "৩টি Business, ৩টি System, ৩টি Result",
      en: "Three businesses, three systems, three results",
    },
    excerpt: {
      bn: "Theory ভালো, কিন্তু Result কথা বলে। তিনটি বাস্তব প্রজেক্ট থেকে কী শেখা যায়।",
      en: "Theory is good, but results speak. What three real projects actually teach.",
    },
    category: "case-studies",
    author: "Nexus Lift",
    publishedAt: "2026-10-21",
    updatedAt: "2026-10-21",
    readingMinutes: 7,
    featured: true,
    schemaType: "BlogPosting",
    seoTitle: { bn: "৩টি Business, ৩টি System, ৩টি Result | Nexus Lift", en: "Three businesses, three systems, three results | Nexus Lift" },
    seoDescription: {
      bn: "E-commerce, Service Agency এবং Manufacturing — তিনটি বাস্তব কেস স্টাডি এবং তাদের System সমাধান।",
      en: "E-commerce, service agency and manufacturing — three real case studies and the systems that solved them.",
    },
    body: [
      {
        heading: { bn: "কেস ১ — E-commerce: Order Error Rate", en: "Case 1 — E-commerce: order error rate" },
        paragraphs: {
          bn: [
            "সমস্যা: Order Error Rate ১৫%, Training ৩ সপ্তাহ, মাসে ২০+ Complaint।",
            "Diagnosis: Operations Layer সবচেয়ে দুর্বল — প্রতিটি Order একই ধাপ অনুসরণ করত না।",
            "System: Order Processing SOP, Fulfilment Flowchart, Daily Checklist, Role Matrix।",
            "Result: ৩০ দিনে Error Rate ২%, Training ৩ দিন, Complaint ৩/মাস।",
          ],
          en: [
            "Problem: a 15% order error rate, three-week training, 20+ complaints per month.",
            "Diagnosis: the operations layer was weakest — orders did not follow the same steps.",
            "System: an order-processing SOP, fulfilment flowchart, daily checklist and role matrix.",
            "Result: within 30 days a 2% error rate, three-day training and three complaints per month.",
          ],
        },
        source: "Client-reported operational records",
      },
      {
        heading: { bn: "কেস ২ — Service Agency: Follow-up Rate", en: "Case 2 — Service agency: follow-up rate" },
        paragraphs: {
          bn: [
            "সমস্যা: Follow-up Rate ৬০% — অর্থাৎ ৪০% Lead-এ কোনো পরবর্তী যোগাযোগ ছিল না।",
            "Diagnosis: Intelligence Layer — Data Email, WhatsApp ও Excel-এ ছড়িয়ে ছিল, Pipeline View ছিল না।",
            "System: Central CRM, Lead → Won Pipeline, Follow-up Automation, Retention Alert।",
            "Result: ২১ দিনে Follow-up Rate ৯৫%।",
          ],
          en: [
            "Problem: a 60% follow-up rate — 40% of leads received no further contact.",
            "Diagnosis: the intelligence layer — data spread across email, WhatsApp and Excel with no pipeline view.",
            "System: a central CRM, lead-to-won pipeline, follow-up automation and retention alerts.",
            "Result: a 95% follow-up rate within 21 days.",
          ],
        },
        source: "Client CRM activity log",
      },
      {
        heading: { bn: "কেস ৩ — Manufacturing: Founder Dependency", en: "Case 3 — Manufacturing: founder dependency" },
        paragraphs: {
          bn: [
            "সমস্যা: প্রতিটি অনুমোদন Founder-এর কাছে আসত, ফলে সিদ্ধান্ত ধীর হত।",
            "Diagnosis: Structure Layer — Authority নির্ধারিত ছিল না।",
            "System: Organogram, Role & Responsibility Matrix, Authority Matrix, Approval & Escalation Policy।",
            "Result: ৪৫ দিনে সিদ্ধান্ত Process-নির্ভর হয়, Founder-এর দৈনিক অনুমোদনের চাপ কমে।",
          ],
          en: [
            "Problem: every approval reached the founder, so decisions were slow.",
            "Diagnosis: the structure layer — authority was undefined.",
            "System: an organogram, role & responsibility matrix, authority matrix and approval & escalation policy.",
            "Result: within 45 days decisions followed process and the founder's daily approval load dropped.",
          ],
        },
        source: "Client-reported operational change (no numerical claim)",
      },
      {
        heading: { bn: "তিনটি কেস থেকে তিনটি শিক্ষা", en: "Three lessons from three cases" },
        paragraphs: { bn: [], en: [] },
        bullets: {
          bn: [
            "ভুল কমাতে Employee-কে দোষ দেওয়া কাজ করে না — ধাপ কমালে ভুল কমে।",
            "Follow-up Memory-এর ওপর নির্ভর করলে মিস হয় — System-এর ওপর দিলে হয় না।",
            "Authority স্পষ্ট না হলে সব সিদ্ধান্ত Founder-এর টেবিলে এসে পড়ে।",
          ],
          en: [
            "Blaming employees does not reduce errors — standardising steps does.",
            "Follow-up based on memory gets missed; follow-up owned by a system does not.",
            "If authority is not explicit, every decision lands on the founder's desk.",
          ],
        },
        callout: {
          bn: "প্রতিটি কেসে একটি সতর্কতা প্রযোজ্য: ফলাফল সেই ক্লায়েন্টের প্রেক্ষাপটে জানানো হয়েছে, কোনো গ্যারান্টি নয়।",
          en: "One caveat applies to every case: outcomes are reported in that client's context and are not a guarantee.",
        },
      },
    ],
  },
  {
    slug: "why-most-smes-cannot-scale",
    title: {
      bn: "কেন অধিকাংশ SME Scale করতে পারে না?",
      en: "Why do most SMEs fail to scale?",
    },
    excerpt: {
      bn: "Scale আটকে যায় একই জায়গায় — System ছাড়া Growth। এই লেখায় কারণ ও সমাধানের কাঠামো।",
      en: "Scaling stalls in the same place: growth without a system. Here is the cause and the structure of the fix.",
    },
    category: "business-systems",
    author: "Nexus Lift",
    publishedAt: "2026-10-28",
    updatedAt: "2026-10-28",
    readingMinutes: 7,
    featured: false,
    schemaType: "BlogPosting",
    seoTitle: { bn: "কেন অধিকাংশ SME Scale করতে পারে না? | Nexus Lift", en: "Why do most SMEs fail to scale? | Nexus Lift" },
    seoDescription: {
      bn: "System ছাড়া Growth কেন Scale-এ বাধা হয়, এবং ৬টি Connected Business Layers কীভাবে সেটি ঠিক করে।",
      en: "Why growth without a system blocks scale, and how the six connected business layers fix it.",
    },
    body: [
      {
        heading: { bn: "একটি পরিচিত চিত্র", en: "A familiar picture" },
        paragraphs: {
          bn: [
            "আমরা দেখেছি: Brand আছে, কিন্তু Positioning নেই। Website আছে, কিন্তু Conversion নেই। Team আছে, কিন্তু Structure নেই। Sales আছে, কিন্তু Process নেই। Data আছে, কিন্তু Intelligence নেই।",
            "ফলাফল? Business চলছে, কিন্তু Systematically চলছে না।",
          ],
          en: [
            "We have seen it repeatedly: a brand exists but without positioning. A website exists but without conversion. A team exists but without structure. Sales exist but without process. Data exists but without intelligence.",
            "The result? The business runs — but not systematically.",
          ],
        },
      },
      {
        heading: { bn: "Nexus Lift-এর নিজস্ব Audit ডেটা", en: "Nexus Lift's own audit data" },
        paragraphs: {
          bn: [
            "আমরা ১০০+ বাংলাদেশী SME Business Audit করেছি। সেই ইন্টারনাল ডেটা থেকে সবচেয়ে বেশি দেখা যায়:",
          ],
          en: ["We have audited 100+ Bangladeshi SME businesses. From that internal data the most common findings were:"],
        },
        bullets: {
          bn: [
            "৯২% Business Founder-dependent — অর্থাৎ কাজ মানুষ-নির্ভর",
            "৮৫% Process Manual — লিখিত প্রক্রিয়া নেই",
            "৭৮% কোনো Dashboard নেই — Visibility সীমিত",
          ],
          en: [
            "92% of businesses were founder-dependent — work relied on people",
            "85% operated on manual process with no written procedure",
            "78% had no dashboard, so visibility was limited",
          ],
        },
        callout: {
          bn: "এই সংখ্যাগুলো Nexus Lift-এর নিজস্ব Audit Sample থেকে — কোনো তৃতীয় পক্ষের Research নয়। আমরা এটিকে Industry Statistic হিসেবে দাবি করি না।",
          en: "These figures come from Nexus Lift's own audit sample — not third-party research. We do not present them as an industry statistic.",
        },
        // Machine-readable attribution: any figure above must carry its origin so no
        // renderer can print the number without the source (§02 / §03 claim rules).
        source: "Nexus Lift internal audit sample — 100+ Bangladeshi SME business audits (not third-party research)",
      },
      {
        heading: { bn: "Scale মানে বেশি কাজ নয়", en: "Scale is not more work" },
        paragraphs: {
          bn: [
            "Scale করার একটি ভুল ধারণা হলো 'আরও মানুষ যোগ করা'। কিন্তু Structure ছাড়া মানুষ যোগ করলে Escalation বাড়ে, দায়িত্ব হারায়, আর Founder-এর কাজ কমে না।",
            "যে ব্যবসা Scale করে, তারা আগে Operations Layer ঠিক করে — কারণ সিস্টেম একই ধাপে কাজ করলে মানুষ যোগ করা সহজ হয়।",
          ],
          en: [
            "A common misconception is that scaling means adding more people. But adding people without structure increases escalation, blurs accountability, and does not reduce the founder's load.",
            "Businesses that scale fix the operations layer first — because when the system works in the same steps every time, adding people becomes simple.",
          ],
        },
      },
      {
        heading: { bn: "কোন Layer আগে ঠিক করবেন", en: "Which layer to fix first" },
        paragraphs: {
          bn: [
            "এই প্রশ্নের উত্তর প্রতিটি ব্যবসার জন্য আলাদা — কারণ bottleneck আলাদা। এজন্যই Nexus Lift কোনো নির্দিষ্ট Service বিক্রি করে না, বরং Diagnostic দিয়ে শুরু করে: একটিই Priorities, বাকিগুলো পরে।",
            "Free Business Audit করুন — ৬টি Layer-এর মধ্যে কোনটি আপনার Business-এ সবচেয়ে দুর্বল, সেটি জানুন। তারপর সেই একটির উপর কাজ করুন।",
          ],
          en: [
            "The answer differs for every business, because the bottleneck differs. That is why Nexus Lift does not sell a fixed service; it begins with a diagnosis: one priority first, the rest later.",
            "Take the free business audit to see which of the six layers is weakest in your business. Then work on that one.",
          ],
        },
      },
    ],
  },
  {
    slug: "six-layers-that-run-your-business",
    title: {
      bn: "৬টি Layer যেগুলো আপনার Business চালায়",
      en: "The six layers that run your business",
    },
    excerpt: {
      bn: "Identity → Structure → Operations → Growth → Intelligence → Control — একটি Connected Business System-এর কাঠামো।",
      en: "Identity → Structure → Operations → Growth → Intelligence → Control — the structure of a connected business system.",
    },
    category: "business-systems",
    author: "Nexus Lift",
    publishedAt: "2026-10-02",
    updatedAt: "2026-10-02",
    readingMinutes: 5,
    featured: false,
    schemaType: "Article",
    seoTitle: { bn: "৬টি Connected Business Layers | Nexus Lift Framework", en: "The six connected business layers | Nexus Lift framework" },
    seoDescription: {
      bn: "Nexus Lift কীভাবে একটি Business-কে ৬টি Connected Layer-এ দেখে — Identity থেকে Control পর্যন্ত।",
      en: "How Nexus Lift views a business as six connected layers, from Identity to Control.",
    },
    body: [
      {
        heading: { bn: "কেন একটি Layer-ভিত্তিক দৃষ্টিভঙ্গি", en: "Why a layer-based view" },
        paragraphs: {
          bn: [
            "একটি business-এ Brand, Website, Employees, Customers, Sales, Marketing, Software এবং AI থাকতে পারে। তবুও যদি কাজগুলো মানুষ, memory আর manual effort-এর ওপর অতিরিক্ত নির্ভর করে, তাহলে business-এর system maturity এখনও কম হতে পারে।",
            "Layer-ভিত্তিক দৃষ্টিভঙ্গি সমস্যাটিকে ছোট ছোট পরিষ্কার অংশে ভাগ করে, যাতে জানা যায় ঠিক কোথায় কাজ করতে হবে।",
          ],
          en: [
            "A business can have a brand, a website, employees, customers, sales, marketing, software and AI. Yet if the work depends too heavily on people, memory and manual effort, the system maturity is still low.",
            "A layer-based view splits the problem into clear parts so it becomes obvious exactly where to work.",
          ],
        },
      },
      {
        heading: { bn: "ছয়টি Layer এবং তাদের প্রশ্ন", en: "The six layers and their questions" },
        paragraphs: { bn: [], en: [] },
        bullets: {
          bn: [
            "01 Identity — ব্যবসাটি কী এবং মানুষ একে কীভাবে দেখে?",
            "02 Structure — কে কী কাজ করবে এবং authority কীভাবে সাজানো?",
            "03 Operations — কাজগুলো কীভাবে consistently হবে?",
            "04 Growth — ব্যবসা কীভাবে Customer আকর্ষণ ও Convert করবে?",
            "05 Intelligence — Data, AI এবং Automation কীভাবে যুক্ত?",
            "06 Control — Management কীভাবে Business দেখবে ও মাপবে?",
          ],
          en: [
            "01 Identity — what is the business and how is it perceived?",
            "02 Structure — who does what and how is authority organised?",
            "03 Operations — how does repeated work happen consistently?",
            "04 Growth — how does the business attract and convert?",
            "05 Intelligence — how are data, AI and automation connected?",
            "06 Control — how does management see and measure the business?",
          ],
        },
        callout: {
          bn: "একটি Layer ঠিক করলে অন্যগুলোও Improve হয়। Control Layer শেখাটা সিস্টেমে ফিরিয়ে দেয়, তাই উন্নতি চলতে থাকে।",
          en: "Fixing one layer improves the others. The control layer feeds learning back into the system, so improvement continues.",
        },
      },
      {
        heading: { bn: "Layer-ভিত্তিক কাজ কীভাবে শুরু হয়", en: "How layer-based work begins" },
        paragraphs: {
          bn: [
            "Nexus Lift সবসময় একটি Diagnostic দিয়ে শুরু করে: ৬টি Layer-এর প্রতিটির অবস্থা বোঝা, তারপর সবচেয়ে দুর্বল Layer-টিকে প্রথম Priorities হিসেবে নেওয়া।",
            "অর্থাৎ আমরা Service বিক্রি করি না, Solution দিই — এবং Solution-টির ক্রমনির্ধারণ হয় আপনার Business-এর বাস্তব অবস্থা থেকে।",
          ],
          en: [
            "Nexus Lift always starts with a diagnosis: understanding the state of each of the six layers, then taking the weakest layer as the first priority.",
            "In other words, we do not sell a service — we solve a bottleneck, and the order is decided by the real state of your business.",
          ],
        },
      },
    ],
  },
  {
    slug: "website-has-traffic-but-no-leads",
    title: {
      bn: "Website আছে, কিন্তু Lead আসে না কেন?",
      en: "You have a website — so why no leads?",
    },
    excerpt: {
      bn: "Website মানে শুধু Presence নয়। Lead আসতে হলে দরকার Conversion System।",
      en: "A website is not just presence. Leads require a conversion system.",
    },
    category: "growth",
    author: "Nexus Lift",
    publishedAt: "2026-10-09",
    updatedAt: "2026-10-09",
    readingMinutes: 5,
    featured: false,
    schemaType: "BlogPosting",
    seoTitle: { bn: "Website আছে, কিন্তু Lead আসে না কেন? | Nexus Lift", en: "You have a website — so why no leads? | Nexus Lift" },
    seoDescription: {
      bn: "Presence এবং Conversion-এর পার্থক্য, এবং Growth Layer কীভাবে Lead তৈরি করে — Nexus Lift ব্যাখ্যা।",
      en: "The difference between presence and conversion, and how the growth layer creates leads — explained by Nexus Lift.",
    },
    body: [
      {
        heading: { bn: "Presence বনাম Conversion", en: "Presence versus conversion" },
        paragraphs: {
          bn: [
            "Website মানে শুধু Presence। Lead আসতে হলে দরকার Conversion System।",
            "Presence একটি তথ্যপূর্ণ সাইট — যেখানে সব কিছু আছে, কিন্তু কোথাও যাওয়ার পথ নেই। Conversion একটি পথ — যেখানে প্রতিটি Page ভিজিটরকে একটি নির্দিষ্ট সিদ্ধান্তের দিকে নিয়ে যায়।",
          ],
          en: [
            "A website means presence. Leads require a conversion system.",
            "Presence is an informational site where everything exists but nothing leads anywhere. Conversion is a path where each page moves the visitor towards one specific decision.",
          ],
        },
      },
      {
        heading: { bn: "Conversion Path-এর চারটি অংশ", en: "The four parts of a conversion path" },
        paragraphs: { bn: [], en: [] },
        bullets: {
          bn: [
            "একটি স্পষ্ট Offer — কে কী পাবে",
            "একটি Low-risk Step — যেমন একটি Free Audit বা ১৫ মিনিটের Call",
            "একটি নির্দিষ্ট CTA — সব Page-এ একই মূল Action",
            "একটি Measurable Flow — কোন CTA কাজ করছে তা জানার উপায়",
          ],
          en: [
            "One clear offer — who gets what",
            "One low-risk step — such as a free audit or a 15-minute call",
            "One primary CTA — the same main action on every page",
            "One measurable flow — a way to know which CTA works",
          ],
        },
      },
      {
        heading: { bn: "একটি Soil-পরীক্ষা", en: "A quick self-test" },
        paragraphs: {
          bn: [
            "আপনার Website খুলুন এবং নিজেকে জিজ্ঞেস করুন: প্রথম ৫ সেকেন্ডে বোঝা যাচ্ছে কী Offer? পরের ধাপটি স্পষ্ট? মোবাইলে Form পূরণ করা সহজ?",
            "এই তিনটি প্রশ্নের উত্তর 'না' হলে সমস্যাটি ডিজাইনের নয় — Conversion Path-এর।",
          ],
          en: [
            "Open your own website and ask: is the offer clear in the first five seconds? Is the next step obvious? Is the form easy to complete on mobile?",
            "If the answer to any of these is no, the problem is not design — it is the conversion path.",
          ],
        },
        callout: {
          bn: "আমরা কোনো AI Overview Ranking বা Search-এ নিশ্চিত জায়গার গ্যারান্টি দিই না। আমরা Conversion Structure তৈরি করি এবং সেটি Measurable করি।",
          en: "We do not guarantee AI Overview placement or a fixed search position. We build the conversion structure and make it measurable.",
        },
      },
    ],
  },
];

export function getInsight(slug: string): InsightArticle | undefined {
  return insights.find((article) => article.slug === slug);
}

export const insightCategories: { id: string; label: { bn: string; en: string } }[] = [
  { id: "business-systems", label: { bn: "Business Systems", en: "Business Systems" } },
  { id: "brand", label: { bn: "Brand", en: "Brand" } },
  { id: "operations", label: { bn: "Operations", en: "Operations" } },
  { id: "growth", label: { bn: "Growth", en: "Growth" } },
  { id: "crm", label: { bn: "CRM", en: "CRM" } },
  { id: "automation", label: { bn: "Automation", en: "Automation" } },
  { id: "ai", label: { bn: "AI", en: "AI" } },
  { id: "seo", label: { bn: "SEO", en: "SEO" } },
  { id: "hosting", label: { bn: "Hosting", en: "Hosting" } },
  { id: "research", label: { bn: "Research", en: "Research" } },
  { id: "case-studies", label: { bn: "Case Studies", en: "Case Studies" } },
];
