"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Alert } from "@/components/ui/StateMessage";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";
import { track } from "@/lib/analytics/track";
import { siteConfig } from "@/config/site";
import { createTranslator } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/types";

const subjects: { id: string; bn: string; en: string }[] = [
  { id: "business-audit", bn: "Free Business Audit নিয়ে প্রশ্ন", en: "Question about the free business audit" },
  { id: "product-order", bn: "পণ্য অর্ডার / দাম", en: "Product order / pricing" },
  { id: "sop", bn: "SOP ও Process System", en: "SOP & process system" },
  { id: "crm", bn: "CRM ও Automation", en: "CRM & automation" },
  { id: "website", bn: "Website ও Conversion", en: "Website & conversion" },
  { id: "hosting", bn: "Nexus Host / Hosting", en: "Nexus Host / hosting" },
  { id: "other", bn: "অন্য কিছু", en: "Something else" },
];

export function ContactForm({ locale }: { locale: Locale }) {
  const tr = createTranslator(locale);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    subject: "business-audit",
    message: "",
    company_website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function update(key: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("sending");
    setErrors({});

    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          source: "contact_form",
          channel: "web",
          utm: Object.fromEntries(params.entries()),
        }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string; fieldErrors?: Record<string, string> };

      if (!response.ok || !payload.ok) {
        setErrors(payload.fieldErrors ?? {});
        setState("error");
        return;
      }

      track("contact_submit", { page: "/contact" });
      setState("sent");
      setForm({ name: "", email: "", phone: "", businessName: "", subject: "business-audit", message: "", company_website: "" });
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="surface p-6">
        <Alert tone="success" title={tr("contact.sent")}>
          {tr("contact.sentNote")}
        </Alert>
        <div className="mt-5 flex flex-wrap gap-3">
          <WhatsAppButton
            locale={locale}
            ctaLocation="contact_success"
            page="/contact"
            intent={locale === "bn" ? "আমি Contact Form পূরণ করেছি, দ্রুত উত্তর দরকার।" : "I submitted the contact form and would like a quick reply."}
          />
          <Button variant="outline" onClick={() => setState("idle")}>
            {locale === "bn" ? "আরেকটি Message পাঠান" : "Send another message"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="surface p-5 sm:p-6">
      <h2 className="text-lg">{locale === "bn" ? "আমাদের Message পাঠান" : "Send us a message"}</h2>
      <p className="mt-1.5 text-sm text-slate-600">
        {locale === "bn"
          ? `কর্মঘণ্টা: ${siteConfig.businessHours.display.bn}। এর বাইরে পাঠালে উত্তর পরবর্তী কর্মঘণ্টায়।`
          : `Working hours: ${siteConfig.businessHours.display.en}. Messages sent outside are answered during the next working hours.`}
      </p>

      {state === "error" ? (
        <Alert tone="danger" className="mt-5">
          {locale === "bn" ? "Message পাঠানো যায়নি। WhatsApp-এ চেষ্টা করুন।" : "We could not send your message. Please try WhatsApp."}
        </Alert>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label={locale === "bn" ? "নাম" : "Name"} htmlFor="contact-name" required error={errors.name}>
          <Input id="contact-name" value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" required />
        </Field>

        <Field label={locale === "bn" ? "Business Name" : "Business name"} htmlFor="contact-business">
          <Input
            id="contact-business"
            value={form.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            autoComplete="organization"
          />
        </Field>

        <Field label="Email" htmlFor="contact-email" required error={errors.email}>
          <Input
            id="contact-email"
            type="email"
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            autoComplete="email"
            inputMode="email"
            required
          />
        </Field>

        <Field label={locale === "bn" ? "WhatsApp নম্বর" : "WhatsApp number"} htmlFor="contact-phone" required error={errors.phone}>
          <Input
            id="contact-phone"
            value={form.phone}
            onChange={(event) => update("phone", event.target.value)}
            autoComplete="tel"
            inputMode="tel"
            placeholder="01814716713"
            required
          />
        </Field>

        <Field label={locale === "bn" ? "বিষয়" : "Subject"} htmlFor="contact-subject" className="sm:col-span-2" required>
          <Select id="contact-subject" value={form.subject} onChange={(event) => update("subject", event.target.value)}>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject[locale]}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={locale === "bn" ? "আপনার প্রশ্ন বা প্রয়োজন" : "Your question or requirement"}
          htmlFor="contact-message"
          className="sm:col-span-2"
          required
          error={errors.message}
        >
          <Textarea
            id="contact-message"
            rows={5}
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            required
            placeholder={
              locale === "bn"
                ? "যতটা সম্ভব নির্দিষ্টভাবে লিখুন — তাহলে আমরা সঠিক উত্তর দিতে পারবো।"
                : "Be as specific as you can so we can give you a useful answer."
            }
          />
        </Field>

        {/* Honeypot: hidden from users, catches naive bots. */}
        <div className="hidden" aria-hidden>
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            value={form.company_website}
            onChange={(event) => update("company_website", event.target.value)}
          />
        </div>
      </div>

      <Button type="submit" size="lg" className="mt-5" disabled={state === "sending"}>
        {state === "sending" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        {state === "sending" ? tr("action.sending") : locale === "bn" ? "Message পাঠান" : "Send message"}
      </Button>

      <p className="mt-3 text-xs text-slate-500">
        {locale === "bn"
          ? "Submit করার মাধ্যমে আপনি আমাদের Privacy Policy-তে সম্মত হচ্ছেন।"
          : "By submitting you agree to our privacy policy."}
      </p>
    </form>
  );
}
