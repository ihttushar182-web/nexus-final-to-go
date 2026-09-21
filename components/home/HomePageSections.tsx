import { ArrowRight, CircleCheck, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { siteConfig, getBusinessHoursState } from "@/config/site";
import { businessLayers } from "@/data/layers";
import { growthMethodology } from "@/data/layers";
import { solutionCategories } from "@/data/solutions";
import { getProduct, hostingPlans } from "@/data/products";
import { caseStudies } from "@/data/case-studies";
import { insights } from "@/data/insights";
import { faqItems } from "@/data/faq";
import { t, formatCurrency } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n/dictionaries";
import { Section, SectionHeader, Grid } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ProcessTimeline, CheckList } from "@/components/ui/Timeline";
import { LayerCard, LayerFlow } from "@/components/framework/LayerCard";
import { ProductCard } from "@/components/product/ProductCard";
import { SolutionCard } from "@/components/solutions/SolutionCard";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { InsightCard } from "@/components/insights/InsightCard";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import type { Locale } from "@/types";

/* ────────────────────────────────── hero ─────────────────────────────────── */
function Hero({ locale, tr }: { locale: Locale; tr: ReturnType<typeof createTranslator> }) {
  const hours = getBusinessHoursState();

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="grid-backdrop absolute inset-0" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_120%_at_50%_-10%,rgba(82,161,217,0.28),transparent_65%)]"
        aria-hidden
      />
      <div className="container-page relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-accent">
              <Sparkles className="size-3.5" aria-hidden />
              {siteConfig.tagline.bn}
            </p>

            <h1 className="mt-5 text-[1.9rem] leading-[1.2] text-white sm:text-[2.6rem] lg:text-[3.05rem]">
              Business Chaos থেকে Systematic Growth
            </h1>

            <p className="mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-slate-200 sm:text-[1.08rem]">
              আপনার Business-এর প্রয়োজন অনুযায়ী Brand, Structure, Operations, Growth, AI এবং Management System তৈরি করে
              Nexus Lift — যাতে বিচ্ছিন্ন কাজগুলো একটি connected business system-এ রূপ নেয়।
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/business-audit" size="lg" className="w-full sm:w-auto">
                {tr("action.diagnose")}
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/solutions"
                size="lg"
                className="w-full border border-white/25 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
                variant="ghost"
              >
                {tr("action.exploreSolutions")}
              </ButtonLink>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
              <li className="inline-flex items-center gap-2">
                <CircleCheck className="size-4 text-accent" aria-hidden /> {tr("trust.freeAudit")}
              </li>
              <li className="inline-flex items-center gap-2">
                <CircleCheck className="size-4 text-accent" aria-hidden /> {tr("trust.noObligation")}
              </li>
              <li className="inline-flex items-center gap-2">
                <CircleCheck className="size-4 text-accent" aria-hidden /> {tr("trust.instantSnapshot")}
              </li>
            </ul>

            <p className="mt-6 inline-flex items-center gap-2 text-xs text-slate-400">
              <span
                aria-hidden
                className={`size-2 rounded-full ${hours.isOpenNow ? "bg-emerald-400" : "bg-amber-400"}`}
              />
              {hours.isOpenNow ? tr("contact.openNow") : tr("contact.closedNow")} ·{" "}
              {t(siteConfig.businessHours.display, locale)}
            </p>
          </div>

          {/* Framework preview — reinforces the six-layer model without extra JS */}
          <div className="relative">
            <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4 backdrop-blur-sm sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  6 Connected Layers
                </p>
                <Badge tone="dark" size="sm" className="border-white/20 bg-white/10 text-white">
                  Framework
                </Badge>
              </div>
              <ul className="mt-4 grid gap-2.5">
                {businessLayers.map((layer) => (
                  <li
                    key={layer.id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-navy/40 px-3.5 py-3"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/10 font-display text-xs font-semibold text-accent tabular-nums">
                      {layer.code}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{t(layer.name, locale)}</span>
                      <span className="block truncate text-xs text-slate-400">{t(layer.question, locale)}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                {locale === "bn"
                  ? "একটি Layer ঠিক করলে অন্যগুলোও Improve হয়।"
                  : "Fixing one layer improves the others."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────── problem ──────────────────────────────── */
function ProblemSection({ locale }: { locale: Locale }) {
  const pains = [
    locale === "bn" ? "Founder-dependent কাজ" : "Founder-dependent work",
    locale === "bn" ? "Repeatable process নেই" : "No repeatable process",
    locale === "bn" ? "Data scattered এবং অগোছালো" : "Scattered, disorganised data",
    locale === "bn" ? "Growth বন্ধ হয়ে যাচ্ছে" : "Growth has stalled",
  ];

  return (
    <Section tone="white">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <SectionHeader
            eyebrow={locale === "bn" ? "Business Problem" : "Business problem"}
            title={locale === "bn" ? "আপনার Business আছে। কিন্তু Business System আছে কি?" : "You have a business. But do you have a business system?"}
            description={
              locale === "bn"
                ? "একটি business-এ Brand, Website, Employees, Customers, Sales, Marketing, Software এবং AI থাকতে পারে। তবুও যদি কাজগুলো মানুষ, memory আর manual effort-এর ওপর অতিরিক্ত নির্ভর করে, তাহলে business-এর system maturity এখনও কম হতে পারে।"
                : "A business can have a brand, a website, employees, customers, sales, marketing, software and AI. Yet if the work depends too heavily on people, memory and manual effort, system maturity is still low."
            }
          />
          <div className="mt-7">
            <ButtonLink href="/business-audit" variant="outline">
              {locale === "bn" ? "আমার অবস্থা জানুন" : "Check where I stand"}
              <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-3 self-center">
          {pains.map((pain) => (
            <li key={pain} className="flex items-start gap-3 rounded-xl border border-line bg-mist p-4">
              <span aria-hidden className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-warning-50 text-[0.65rem] font-bold text-warning">
                !
              </span>
              <span className="text-sm font-medium text-navy">{pain}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ──────────────────────────────── framework ─────────────────────────────── */
function FrameworkSection({ locale, tr }: { locale: Locale; tr: ReturnType<typeof createTranslator> }) {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Framework"
        title={locale === "bn" ? "৬টি Connected Business Layers" : "Six connected business layers"}
        description={
          locale === "bn"
            ? "Nexus Lift business-কে ৬টি connected layer-এ দেখে। একটি Layer ঠিক করলে অন্যগুলোও Improve হয়।"
            : "Nexus Lift views a business as six connected layers. Fixing one layer improves the others."
        }
        action={
          <ButtonLink href="/framework" variant="outline">
            {tr("action.exploreFramework")}
          </ButtonLink>
        }
      />
      <div className="mt-6">
        <LayerFlow locale={locale} />
      </div>
      <Grid cols={3}>
        {businessLayers.map((layer) => (
          <LayerCard key={layer.id} layer={layer} locale={locale} />
        ))}
      </Grid>
    </Section>
  );
}

/* ─────────────────────────────── methodology ────────────────────────────── */
function MethodologySection({ locale }: { locale: Locale }) {
  return (
    <Section tone="white">
      <SectionHeader
        eyebrow="Methodology"
        title={locale === "bn" ? "Problem থেকে Growth — একটি Clear Journey" : "Problem to growth — one clear journey"}
        description={
          locale === "bn"
            ? "আমরা Service বিক্রি করি না, Solution দিই। Evidence-based Approach, Measurable Outcomes, No Unnecessary Work।"
            : "We do not sell services, we solve bottlenecks: evidence-based approach, measurable outcomes, no unnecessary work."
        }
      />
      <ProcessTimeline
        className="mt-8"
        steps={growthMethodology.map((step) => ({
          code: step.step,
          title: t(step.name, locale),
          description: (
            <>
              <span className="block">{t(step.question, locale)}</span>
              <span className="mt-1.5 block text-xs font-medium uppercase tracking-wide text-nexus">
                {t(step.output, locale)}
              </span>
            </>
          ),
        }))}
      />
    </Section>
  );
}

/* ──────────────────────────────── solutions ─────────────────────────────── */
function SolutionsSection({ locale }: { locale: Locale }) {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Solutions"
        title={locale === "bn" ? "যে কাজটি এখন দরকার, সেটিই আগে" : "The work you need next, first"}
        description={
          locale === "bn"
            ? "১১টি solution category — Identity থেকে Custom Technology পর্যন্ত। আমরা সব একসাথে করি না, bottleneck অনুযায়ী ক্রম ঠিক করি।"
            : "Eleven solution categories, from identity to custom technology. We do not do everything at once — the order follows the bottleneck."
        }
        action={
          <ButtonLink href="/solutions" variant="outline">
            {locale === "bn" ? "সব Solutions দেখুন" : "All solutions"}
          </ButtonLink>
        }
      />
      <Grid cols={3}>
        {solutionCategories.slice(0, 6).map((category) => (
          <SolutionCard key={category.id} category={category} locale={locale} />
        ))}
      </Grid>
    </Section>
  );
}

/* ───────────────────────────── featured products ────────────────────────── */
function FeaturedProducts({ locale }: { locale: Locale }) {
  const featured = ["professional-business-starter", "professional-business-growth", "professional-business-premium"]
    .map((slug) => getProduct(slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  return (
    <Section tone="white">
      <SectionHeader
        eyebrow={locale === "bn" ? "Featured Products" : "Featured products"}
        title={locale === "bn" ? "আজই শুরু করা যায় এমন পণ্য" : "Products you can start today"}
        description={
          locale === "bn"
            ? "নির্দিষ্ট scope, নির্দিষ্ট দাম, নির্দিষ্ট delivery format। অর্ডার নিশ্চিত হয় WhatsApp বা Messenger-এ কথা বলার পর।"
            : "Defined scope, defined price, defined delivery format. Orders are confirmed after a WhatsApp or Messenger conversation."
        }
        action={
          <ButtonLink href="/products" variant="outline">
            {locale === "bn" ? "সব পণ্য" : "All products"}
          </ButtonLink>
        }
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} variant="featured" />
        ))}
      </div>
    </Section>
  );
}

/* ─────────────────────────────── why us / how ───────────────────────────── */
function WhyAndHow({ locale }: { locale: Locale }) {
  const comparisons = [
    { traditional: locale === "bn" ? "শুধু Logo/Branding দেয়" : "Only delivers logo/branding", nexus: locale === "bn" ? "Brand + Positioning + Strategy" : "Brand + positioning + strategy" },
    { traditional: locale === "bn" ? "শুধু Website বানায়" : "Only builds a website", nexus: locale === "bn" ? "Website + Conversion + SEO System" : "Website + conversion + SEO system" },
    { traditional: locale === "bn" ? "শুধু Automation সেটআপ করে" : "Only sets up automation", nexus: locale === "bn" ? "Process + Automation + Integration" : "Process + automation + integration" },
    { traditional: locale === "bn" ? "Service বিক্রি করে" : "Sells services", nexus: locale === "bn" ? "Solution & Infrastructure তৈরি করে" : "Builds solutions and infrastructure" },
    { traditional: locale === "bn" ? "বিচ্ছিন্ন কাজ করে" : "Works in disconnected pieces", nexus: locale === "bn" ? "Connected Business System তৈরি করে" : "Builds a connected business system" },
  ];

  const principles = [
    locale === "bn" ? "Clarity — জটিলতা দূর করে পরিষ্কার করা" : "Clarity — remove complexity, keep what is clear",
    locale === "bn" ? "Specificity — সংখ্যা ও দায়িত্ব নির্দিষ্ট করা" : "Specificity — explicit numbers and owners",
    locale === "bn" ? "Proof — যাচাইযোগ্য ফলাফল দেখানো" : "Proof — show verifiable outcomes",
    locale === "bn" ? "Risk reduction — সিদ্ধান্ত সহজ করা" : "Risk reduction — make the decision easier",
  ];

  return (
    <Section tone="navy">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            tone="dark"
            eyebrow={locale === "bn" ? "Why Nexus Lift" : "Why Nexus Lift"}
            title={locale === "bn" ? "Traditional Agency বনাম Nexus Lift" : "Traditional agency versus Nexus Lift"}
            description={
              locale === "bn"
                ? "Nexus Lift কোনো একটি Service দেয় না — পুরো সিস্টেম একসাথে দেখে।"
                : "Nexus Lift is not a single-service vendor — it looks at the whole system together."
            }
          />
          <div className="mt-7 overflow-hidden rounded-xl border border-white/12">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">Traditional agency compared with Nexus Lift</caption>
              <thead>
                <tr className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
                  <th scope="col" className="px-4 py-3">{locale === "bn" ? "Traditional Agencies" : "Traditional agencies"}</th>
                  <th scope="col" className="px-4 py-3 text-accent">Nexus Lift</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.nexus} className="border-t border-white/10">
                    <td className="px-4 py-3 text-slate-300">{row.traditional}</td>
                    <td className="px-4 py-3 font-medium text-white">{row.nexus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <SectionHeader
            tone="dark"
            eyebrow={locale === "bn" ? "How It Works" : "How it works"}
            title={locale === "bn" ? "৪টি ধাপে আমরা কাজ করি" : "Four steps, one process"}
          />
          <div className="mt-7">
            <ProcessTimeline
              tone="dark"
              steps={[
                { code: "01", title: locale === "bn" ? "Diagnose" : "Diagnose", description: locale === "bn" ? "Free Business Audit-এ আপনার ৬টি Layer-এর বর্তমান অবস্থা বোঝা।" : "The free business audit establishes the current state of your six layers." },
                { code: "02", title: locale === "bn" ? "Prioritise" : "Prioritise", description: locale === "bn" ? "সবচেয়ে দুর্বল Layer এবং আপনার লক্ষ্য অনুযায়ী প্রথম Priorities ঠিক করা।" : "The weakest layer and your stated goal decide the first priority." },
                { code: "03", title: locale === "bn" ? "Build" : "Build", description: locale === "bn" ? "নির্দিষ্ট Scope, Timeline এবং Revision নীতি নিয়ে সিস্টেম তৈরি।" : "The system is built against a defined scope, timeline and revision policy." },
                { code: "04", title: locale === "bn" ? "Handover & Support" : "Handover & support", description: locale === "bn" ? "Editable ফাইল, Training এবং ৩০ দিনের Support সহ হ্যান্ডওভার।" : "Handover with editable files, training and 30 days of support." },
              ]}
            />
          </div>

          <ul className="mt-8 space-y-3 border-t border-white/10 pt-7">
            {principles.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-slate-200">
                <Lock className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ──────────────────────────────── audit CTA ─────────────────────────────── */
function AuditCtaSection({ locale, tr }: { locale: Locale; tr: ReturnType<typeof createTranslator> }) {
  const whatYouGet = [
    locale === "bn" ? "Business Stage & Goal Snapshot" : "Business stage & goal snapshot",
    locale === "bn" ? "Main Bottleneck Identification" : "Main bottleneck identification",
    locale === "bn" ? "Current System Maturity Snapshot" : "Current system maturity snapshot",
    locale === "bn" ? "Recommended Next Step (Priority)" : "Recommended next step (priority)",
  ];

  return (
    <Section tone="white">
      <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-mist to-white">
        <div className="grid gap-10 p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow">{tr("audit.title")}</p>
            <h2 className="mt-3 text-[1.6rem] leading-tight sm:text-3xl">
              {locale === "bn" ? "আপনার Business-এর Next Priority কী?" : "What is your business's next priority?"}
            </h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-slate-600">
              {locale === "bn"
                ? "৫ মিনিটের একটি ফর্ম পূরণ করে জানুন আপনার ৬টি Layer-এর মধ্যে কোনটি সবচেয়ে দুর্বল, এবং সেখান থেকে প্রথম কাজটি কী হওয়া উচিত।"
                : "Complete a five-minute form to see which of your six layers is weakest and what the first piece of work should be."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/business-audit" size="lg">
                {tr("audit.start")}
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <WhatsAppButton locale={locale} ctaLocation="home_audit" page="/" label={locale === "bn" ? "প্রশ্ন আছে? WhatsApp" : "Questions? WhatsApp"} size="lg" variant="outline" />
            </div>
            <p className="mt-4 text-xs text-slate-500">{tr("audit.scoreNote")}</p>
          </div>

          <div className="surface p-5 sm:p-6">
            <p className="text-sm font-semibold text-navy">{locale === "bn" ? "আপনি যা পাবেন" : "What you get"}</p>
            <CheckList className="mt-4" items={whatYouGet} />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────── nexus host ─────────────────────────────── */
function HostSection({ locale }: { locale: Locale }) {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow="Nexus Host"
        title={locale === "bn" ? "Nexus Host — Your Digital Base" : "Nexus Host — your digital base"}
        description={
          locale === "bn"
            ? "Hosting এর পরে কী? Website → SEO → CRM → Automation → AI → Dashboard। আপনার Business যখন Grow করবে, আমরা পাশে আছি।"
            : "What comes after hosting? Website → SEO → CRM → automation → AI → dashboard. As your business grows, we stay beside it."
        }
        action={
          <ButtonLink href="/nexus-host" variant="outline">
            {locale === "bn" ? "Nexus Host দেখুন" : "Explore Nexus Host"}
          </ButtonLink>
        }
      />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {hostingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`surface flex h-full flex-col p-5 ${plan.badge ? "border-nexus/40 ring-1 ring-nexus/12" : ""}`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base">{t(plan.name, locale)}</h3>
              {plan.badge ? <Badge tone="brand" size="sm">{t(plan.badge, locale)}</Badge> : null}
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-navy tabular-nums">
              {formatCurrency(plan.price)}
              <span className="text-sm font-medium text-slate-500">/{locale === "bn" ? "মাস" : "mo"}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(plan.summary, locale)}</p>
            <CheckList className="mt-4 flex-1" items={locale === "bn" ? plan.features.bn : plan.features.en} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
        <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-success" aria-hidden /> Free SSL</span>
        <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-success" aria-hidden /> Free Migration</span>
        <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-success" aria-hidden /> 24/7 Business Support</span>
        <span className="inline-flex items-center gap-2"><Zap className="size-4 text-success" aria-hidden /> 99.9% Uptime</span>
      </div>
    </Section>
  );
}

/* ──────────────────────────────── case studies ──────────────────────────── */
function ProofSection({ locale }: { locale: Locale }) {
  return (
    <Section tone="white">
      <SectionHeader
        eyebrow={locale === "bn" ? "Proof" : "Proof"}
        title={locale === "bn" ? "Real Results from Real Businesses" : "Real results from real businesses"}
        description={
          locale === "bn"
            ? "No Fabricated Claims. প্রতিটি কেস স্টাডিতে বলা আছে কোন সংখ্যাটি ক্লায়েন্টের রেকর্ড থেকে জানানো হয়েছে।"
            : "No fabricated claims. Every case study states which figure came from the client's own records."
        }
        action={
          <ButtonLink href="/case-studies" variant="outline">
            {locale === "bn" ? "সব Case Study" : "All case studies"}
          </ButtonLink>
        }
      />
      <Grid cols={3}>
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.slug} study={study} locale={locale} />
        ))}
      </Grid>
    </Section>
  );
}

/* ───────────────────────────────── insights ─────────────────────────────── */
function InsightsSection({ locale }: { locale: Locale }) {
  return (
    <Section tone="mist">
      <SectionHeader
        eyebrow={locale === "bn" ? "Content / Insights" : "Content / insights"}
        title={locale === "bn" ? "Business Systems, Operations ও Growth নিয়ে লেখা" : "Writing on business systems, operations and growth"}
        action={
          <ButtonLink href="/insights" variant="outline">
            {locale === "bn" ? "সব লেখা" : "All insights"}
          </ButtonLink>
        }
      />
      <Grid cols={3}>
        {insights.slice(0, 3).map((article) => (
          <InsightCard key={article.slug} article={article} locale={locale} />
        ))}
      </Grid>
    </Section>
  );
}

/* ──────────────────────────────────── faq ───────────────────────────────── */
function FaqSection({ locale }: { locale: Locale }) {
  const items = faqItems
    .filter((item) => ["target-audience", "audit-free", "payment-methods", "timeline", "profile-self-update", "messenger-order"].includes(item.id))
    .map((item) => ({ id: item.id, question: item.question, answer: item.answer }));

  return (
    <Section tone="white">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        <SectionHeader
          eyebrow="FAQ"
          title={locale === "bn" ? "সাধারণ প্রশ্নের উত্তর" : "Answers to common questions"}
          description={
            locale === "bn"
              ? "উত্তর না পেলে WhatsApp-এ জিজ্ঞেস করুন — কর্মঘণ্টায় উত্তর দেওয়া হয়।"
              : "If your question is not answered here, ask on WhatsApp — replies come during working hours."
          }
          action={
            <ButtonLink href="/faq" variant="outline">
              {locale === "bn" ? "সব প্রশ্ন" : "All questions"}
            </ButtonLink>
          }
        />
        <FAQAccordion items={items} locale={locale} />
      </div>
    </Section>
  );
}

/* ──────────────────────────────── final CTA ─────────────────────────────── */
function FinalCta({ locale, tr }: { locale: Locale; tr: ReturnType<typeof createTranslator> }) {
  return (
    <Section tone="navy">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <h2 className="text-[1.7rem] leading-tight text-white sm:text-[2.1rem]">
            {locale === "bn"
              ? "আপনার Business চলছে। আমরা সেই সিস্টেমটি বানাই যা এটিকে আরও ভালোভাবে চালায়।"
              : "Your business may be working. We help build the system that helps it work better."}
          </h2>
          <p className="mt-4 max-w-2xl text-slate-300">
            {locale === "bn"
              ? "শুরু করুন একটি Free Business Audit দিয়ে — কোনো খরচ নেই, কোনো obligation নেই।"
              : "Start with a free business audit — no cost, no obligation."}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/business-audit" size="lg">{tr("action.diagnose")}</ButtonLink>
            <ButtonLink
              href="/book-call"
              size="lg"
              variant="ghost"
              className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
            >
              {tr("action.talkToUs")}
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[tr("trust.secure"), tr("trust.fastDelivery"), tr("trust.support30")].map((item) => (
            <li key={item} className="flex items-center gap-2.5 rounded-lg border border-white/12 bg-white/5 px-4 py-3 text-sm text-slate-200">
              <Lock className="size-4 text-accent" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function HomePageSections({ locale }: { locale: Locale }) {
  const tr = createTranslator(locale);
  return (
    <>
      <Hero locale={locale} tr={tr} />
      <ProblemSection locale={locale} />
      <FrameworkSection locale={locale} tr={tr} />
      <MethodologySection locale={locale} />
      <SolutionsSection locale={locale} />
      <FeaturedProducts locale={locale} />
      <WhyAndHow locale={locale} />
      <AuditCtaSection locale={locale} tr={tr} />
      <HostSection locale={locale} />
      <ProofSection locale={locale} />
      <InsightsSection locale={locale} />
      <FaqSection locale={locale} />
      <FinalCta locale={locale} tr={tr} />
    </>
  );
}
