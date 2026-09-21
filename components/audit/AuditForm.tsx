"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { businessLayers } from "@/data/layers";
import {
  auditSteps,
  biggestProblemOptions,
  businessStages,
  findGoalOption,
  findProblemOption,
  goalOptions,
  layerAnswerOptions,
  teamSizes,
  toolOptions,
} from "@/data/audit-form";
import { t } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics/track";
import { Alert } from "@/components/ui/StateMessage";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { AuditAnswer, LayerId, Locale } from "@/types";

interface FormState {
  businessName: string;
  businessLink: string;
  businessStage: string;
  teamSize: string;
  answers: Record<LayerId, AuditAnswer | "">;
  biggestProblem: string;
  currentTools: string;
  goal: string;
  name: string;
  email: string;
  whatsapp: string;
}

const initialState: FormState = {
  businessName: "",
  businessLink: "",
  businessStage: "",
  teamSize: "",
  answers: {
    identity: "",
    structure: "",
    operations: "",
    growth: "",
    intelligence: "",
    control: "",
  },
  biggestProblem: "",
  currentTools: "",
  goal: "",
  name: "",
  email: "",
  whatsapp: "",
};

/** Prompt shown for each layer inside step 2. */
const layerPrompts: Record<LayerId, { bn: string; en: string }> = {
  identity: {
    bn: "আপনার একটি লিখিত Brand Identity / Business Profile আছে এবং সব জায়গায় একই রকম ব্যবহৃত হয়?",
    en: "Do you have a written brand identity / business profile used consistently everywhere?",
  },
  structure: {
    bn: "আপনার Organogram ও Role Definition লিখিত আছে (কে কী করবে, কে রিপোর্ট করবে)?",
    en: "Is your organogram and role definition written down (who does what, who reports to whom)?",
  },
  operations: {
    bn: "আপনার মূল কাজগুলোর লিখিত SOP / Checklist আছে এবং প্রতিদিন ব্যবহৃত হয়?",
    en: "Do your core processes have written SOPs / checklists that are used every day?",
  },
  growth: {
    bn: "আপনার Website / Marketing থেকে নিয়মিত Lead আসে এবং তা Measure করা হয়?",
    en: "Does your website / marketing bring leads regularly, and is that measured?",
  },
  intelligence: {
    bn: "সব Customer Data একটি Central CRM-এ আছে এবং Follow-up স্বয়ংক্রিয়?",
    en: "Is all customer data in a central CRM with automated follow-up?",
  },
  control: {
    bn: "Management নিয়মিত Dashboard / KPI দেখে সিদ্ধান্ত নেয়?",
    en: "Does management decide from a regular dashboard / KPI view?",
  },
};

export function AuditForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const tr = createTranslator(locale);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const progress = useMemo(() => Math.round(((step - 1) / auditSteps.length) * 100), [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      if (!previous[key as string]) return previous;
      const next = { ...previous };
      delete next[key as string];
      return next;
    });
  }

  function setAnswer(layer: LayerId, answer: AuditAnswer) {
    setForm((previous) => ({ ...previous, answers: { ...previous.answers, [layer]: answer } }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[`answers.${layer}`];
      return next;
    });
  }

  function validateStep(target: number) {
    const next: Record<string, string> = {};
    if (target >= 1) {
      if (form.businessName.trim().length < 2) next.businessName = locale === "bn" ? "Business name লিখুন" : "Enter your business name";
      if (!form.businessStage) next.businessStage = locale === "bn" ? "একটি নির্বাচন করুন" : "Select an option";
      if (!form.teamSize) next.teamSize = locale === "bn" ? "একটি নির্বাচন করুন" : "Select an option";
    }
    if (target >= 2) {
      for (const layer of businessLayers) {
        if (!form.answers[layer.id]) next[`answers.${layer.id}`] = tr("audit.required");
      }
    }
    if (target >= 3) {
      if (!form.biggestProblem) next.biggestProblem = locale === "bn" ? "সবচেয়ে বড় সমস্যাটি বেছে নিন" : "Choose your biggest problem";
      if (!form.goal) next.goal = locale === "bn" ? "৬ মাসের লক্ষ্য বেছে নিন" : "Choose your six-month goal";
    }
    if (target >= 4) {
      if (form.name.trim().length < 2) next.name = locale === "bn" ? "আপনার নাম লিখুন" : "Enter your name";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        next.email = locale === "bn" ? "সঠিক Email দিন" : "Enter a valid email";
      }
      if (!/^(\+?880|0)1[3-9]\d{8}$/.test(form.whatsapp.replace(/[\s-]/g, ""))) {
        next.whatsapp = locale === "bn" ? "সঠিক WhatsApp নম্বর দিন (যেমন 01814716713)" : "Enter a valid WhatsApp number";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    const next = Math.min(step + 1, auditSteps.length);
    track("audit_step_complete", { step, business_stage: form.businessStage });
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((value) => Math.max(1, value - 1));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setServerError(null);
    track("audit_complete", { business_stage: form.businessStage, source: "website" });

    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: params.get("utm_source") ? "campaign" : "website",
          utm: Object.fromEntries(params.entries()),
          locale,
        }),
      });

      const payload = (await response.json()) as { ok: boolean; id?: string; error?: string; fieldErrors?: Record<string, string> };

      if (!response.ok || !payload.ok) {
        if (payload.fieldErrors) setErrors(payload.fieldErrors);
        setServerError(payload.error ?? tr("audit.errorGeneric"));
        setSubmitting(false);
        return;
      }

      router.push(`/business-audit/result/${payload.id}`);
    } catch {
      setServerError(tr("audit.errorGeneric"));
      setSubmitting(false);
    }
  }

  const currentStep = auditSteps[step - 1];

  return (
    <form onSubmit={handleSubmit} noValidate className="surface p-5 sm:p-7">
      {/* progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <span className="uppercase tracking-wide">{tr("audit.stepOf", { step, total: auditSteps.length })}</span>
          <span>{currentStep ? t(currentStep.title, locale) : ""}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-mist-200">
          <div className="h-full rounded-full bg-nexus transition-[width] duration-500" style={{ width: `${Math.max(progress, 6)}%` }} />
        </div>
      </div>

      {serverError ? (
        <Alert tone="danger" title={tr("state.error")} className="mb-5">
          {serverError}
        </Alert>
      ) : null}

      {/* step 1 — business profile */}
      {step === 1 ? (
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">{t(auditSteps[0].title, locale)}</legend>
          <Field label={locale === "bn" ? "Business Name" : "Business name"} htmlFor="businessName" required error={errors.businessName} className="sm:col-span-2">
            <Input
              id="businessName"
              name="businessName"
              value={form.businessName}
              onChange={(event) => update("businessName", event.target.value)}
              autoComplete="organization"
              placeholder={locale === "bn" ? "যেমন: Rahim Traders" : "e.g. Rahim Traders"}
              aria-invalid={Boolean(errors.businessName)}
            />
          </Field>

          <Field
            label={locale === "bn" ? "Website / Social Link" : "Website / social link"}
            htmlFor="businessLink"
            hint={locale === "bn" ? "না থাকলে খালি রাখুন" : "Leave empty if you do not have one"}
            className="sm:col-span-2"
          >
            <Input
              id="businessLink"
              name="businessLink"
              value={form.businessLink}
              onChange={(event) => update("businessLink", event.target.value)}
              placeholder="https://"
              inputMode="url"
            />
          </Field>

          <Field label={locale === "bn" ? "Business Stage" : "Business stage"} htmlFor="businessStage" required error={errors.businessStage}>
            <Select
              id="businessStage"
              name="businessStage"
              value={form.businessStage}
              onChange={(event) => update("businessStage", event.target.value)}
            >
              <option value="">{locale === "bn" ? "নির্বাচন করুন" : "Select"}</option>
              {businessStages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {t(stage.label, locale)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label={locale === "bn" ? "Team Size" : "Team size"} htmlFor="teamSize" required error={errors.teamSize}>
            <Select id="teamSize" name="teamSize" value={form.teamSize} onChange={(event) => update("teamSize", event.target.value)}>
              <option value="">{locale === "bn" ? "নির্বাচন করুন" : "Select"}</option>
              {teamSizes.map((size) => (
                <option key={size.id} value={size.id}>
                  {t(size.label, locale)}
                </option>
              ))}
            </Select>
          </Field>
        </fieldset>
      ) : null}

      {/* step 2 — six layers */}
      {step === 2 ? (
        <fieldset className="grid gap-4">
          <legend className="sr-only">Current systems</legend>
          {businessLayers.map((layer) => (
            <div key={layer.id} className="rounded-xl border border-line bg-mist/60 p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-md bg-navy font-display text-xs font-semibold text-white tabular-nums">
                  {layer.code}
                </span>
                <div>
                  <p className="text-sm font-semibold text-navy">{t(layer.name, locale)}</p>
                  <p className="mt-1 text-sm text-slate-600">{t(layerPrompts[layer.id], locale)}</p>
                </div>
              </div>
              <div role="radiogroup" aria-label={t(layer.name, locale)} className="mt-3 grid grid-cols-3 gap-2">
                {layerAnswerOptions.map((option) => {
                  const selected = form.answers[layer.id] === option.id;
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                        selected ? "border-nexus bg-white text-navy ring-1 ring-nexus/25" : "border-line bg-white text-slate-600 hover:border-accent",
                      )}
                    >
                      <input
                        type="radio"
                        name={`answer-${layer.id}`}
                        value={option.id}
                        checked={selected}
                        onChange={() => setAnswer(layer.id, option.id)}
                        className="size-4 accent-[#0048AC]"
                      />
                      {t(option.label, locale)}
                    </label>
                  );
                })}
              </div>
              {errors[`answers.${layer.id}`] ? (
                <p role="alert" className="mt-2 text-xs font-medium text-danger">
                  {errors[`answers.${layer.id}`]}
                </p>
              ) : null}
            </div>
          ))}
          <p className="text-xs text-slate-500">{tr("audit.scoreNote")}</p>
        </fieldset>
      ) : null}

      {/* step 3 — bottleneck */}
      {step === 3 ? (
        <fieldset className="grid gap-5">
          <legend className="sr-only">The bottleneck</legend>
          <Field label={locale === "bn" ? "আপনার সবচেয়ে বড় সমস্যা কোনটি?" : "What is your biggest problem right now?"} required error={errors.biggestProblem}>
            <div className="grid gap-2">
              {biggestProblemOptions.map((option) => {
                const selected = form.biggestProblem === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition-colors",
                      selected ? "border-nexus bg-nexus-50 text-navy ring-1 ring-nexus/20" : "border-line bg-white text-slate-700 hover:border-accent",
                    )}
                  >
                    <input
                      type="radio"
                      name="biggestProblem"
                      value={option.id}
                      checked={selected}
                      onChange={() => update("biggestProblem", option.id)}
                      className="size-4 accent-[#0048AC]"
                    />
                    {t(option.label, locale)}
                  </label>
                );
              })}
            </div>
          </Field>

          <Field
            label={locale === "bn" ? "আপনার ৬ মাসের লক্ষ্য কী?" : "What is your goal for the next six months?"}
            required
            error={errors.goal}
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {goalOptions.map((option) => {
                const selected = form.goal === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 text-sm transition-colors",
                      selected ? "border-nexus bg-nexus-50 text-navy ring-1 ring-nexus/20" : "border-line bg-white text-slate-700 hover:border-accent",
                    )}
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={option.id}
                      checked={selected}
                      onChange={() => update("goal", option.id)}
                      className="size-4 accent-[#0048AC]"
                    />
                    {t(option.label, locale)}
                  </label>
                );
              })}
            </div>
          </Field>

          <Field
            label={locale === "bn" ? "বর্তমানে কী Tools ব্যবহার করেন?" : "Which tools do you use today?"}
            htmlFor="currentTools"
            hint={locale === "bn" ? "একাধিক হলে কমা দিয়ে লিখুন" : "Separate multiple tools with a comma"}
          >
            <Textarea
              id="currentTools"
              name="currentTools"
              value={form.currentTools}
              onChange={(event) => update("currentTools", event.target.value)}
              rows={3}
              placeholder={toolOptions.map((tool) => t(tool.label, locale)).join(", ")}
            />
          </Field>
        </fieldset>
      ) : null}

      {/* step 4 — contact */}
      {step === 4 ? (
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">Contact</legend>
          <Field label={locale === "bn" ? "আপনার নাম" : "Your name"} htmlFor="name" required error={errors.name} className="sm:col-span-2">
            <Input id="name" name="name" value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor="email" required error={errors.email}>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              autoComplete="email"
              inputMode="email"
            />
          </Field>
          <Field
            label={locale === "bn" ? "WhatsApp নম্বর" : "WhatsApp number"}
            htmlFor="whatsapp"
            required
            error={errors.whatsapp}
            hint={locale === "bn" ? "যেমন: 01814716713" : "e.g. 01814716713"}
          >
            <Input
              id="whatsapp"
              name="whatsapp"
              value={form.whatsapp}
              onChange={(event) => update("whatsapp", event.target.value)}
              autoComplete="tel"
              inputMode="tel"
            />
          </Field>

          <div className="sm:col-span-2">
            <Alert tone="info">
              {locale === "bn"
                ? "Snapshot পাওয়ার পর আমাদের টিম কর্মঘণ্টায় (সকাল ১০:০০–বিকাল ৫:০০) যোগাযোগ করতে পারে। আপনার তথ্য বাইরে শেয়ার করা হয় না।"
                : "After your snapshot, our team may contact you during working hours (10:00 AM–5:00 PM). Your information is not shared externally."}
            </Alert>
          </div>
        </fieldset>
      ) : null}

      {/* navigation */}
      <div className="mt-7 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={goBack}
          disabled={step === 1 || submitting}
          className={cn(step === 1 && "invisible")}
        >
          <ArrowLeft className="size-4" aria-hidden />
          {tr("action.back")}
        </Button>

        {step < auditSteps.length ? (
          <Button type="button" onClick={goNext} size="lg" className="sm:w-auto">
            {tr("action.next")}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={submitting} className="sm:w-auto">
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                {tr("action.sending")}
              </>
            ) : (
              <>
                <Check className="size-4" aria-hidden />
                {locale === "bn" ? "Snapshot দেখুন" : "See my snapshot"}
              </>
            )}
          </Button>
        )}
      </div>

      {/* Summary of what the answer mapping means, keeps the logic transparent */}
      {step === 3 && form.biggestProblem && form.goal ? (
        <p className="mt-4 text-xs text-slate-500">
          {locale === "bn"
            ? `আপনার উত্তর অনুযায়ী প্রাথমিক Priorities হবে: ${
                t(findProblemOption(form.biggestProblem)?.label ?? { bn: "", en: "" }, locale) ||
                t(findGoalOption(form.goal)?.label ?? { bn: "", en: "" }, locale)
              }`
            : `Based on your answers the first priority will focus on: ${
                t(findProblemOption(form.biggestProblem)?.label ?? { bn: "", en: "" }, locale) ||
                t(findGoalOption(form.goal)?.label ?? { bn: "", en: "" }, locale)
              }`}
        </p>
      ) : null}
    </form>
  );
}
