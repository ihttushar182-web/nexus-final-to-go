import { siteConfig } from "@/config/site";
import { getRepository } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/StateMessage";
import { StatList } from "@/components/ui/DataDisplay";

export const dynamic = "force-dynamic";

/**
 * Settings (Build Spec §31).
 * Shows configuration *state* only — never a secret value, not even partially masked.
 */
export default async function AdminSettingsPage() {
  const repository = getRepository();
  const flags = [
    { key: "NEXT_PUBLIC_ENABLE_CHECKOUT", label: "Direct checkout", enabled: process.env.NEXT_PUBLIC_ENABLE_CHECKOUT === "true" },
    { key: "NEXT_PUBLIC_ENABLE_PORTAL", label: "Customer portal", enabled: process.env.NEXT_PUBLIC_ENABLE_PORTAL === "true" },
    { key: "NEXT_PUBLIC_ENABLE_AI_ASSISTANT", label: "AI assistant", enabled: process.env.NEXT_PUBLIC_ENABLE_AI_ASSISTANT === "true" },
  ];

  const integrations = [
    { label: "Database driver", value: repository.driver, ok: true },
    { label: "Supabase credentials", value: process.env.SUPABASE_URL ? "configured" : "not configured", ok: Boolean(process.env.SUPABASE_URL) },
    { label: "n8n outbound webhook", value: process.env.N8N_WEBHOOK_URL ? "configured" : "not configured", ok: Boolean(process.env.N8N_WEBHOOK_URL) },
    { label: "n8n inbound secret", value: process.env.N8N_WEBHOOK_SECRET ? "configured" : "missing", ok: Boolean(process.env.N8N_WEBHOOK_SECRET) },
    { label: "Email provider", value: process.env.EMAIL_PROVIDER ?? "console", ok: (process.env.EMAIL_PROVIDER ?? "console") !== "console" },
    { label: "Meta page credentials", value: process.env.META_ACCESS_TOKEN ? "configured" : "not configured", ok: Boolean(process.env.META_ACCESS_TOKEN) },
    { label: "Analytics id", value: process.env.NEXT_PUBLIC_ANALYTICS_ID ? "configured" : "not configured", ok: Boolean(process.env.NEXT_PUBLIC_ANALYTICS_ID) },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <p className="eyebrow">Configuration</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Environment-driven configuration. Secret values are never displayed — only whether they are present.
        </p>
      </header>

      <section className="surface p-5">
        <h2 className="text-lg">Business identity</h2>
        <div className="mt-4">
          <StatList
            items={[
              { label: "Brand", value: `${siteConfig.brandName} — ${siteConfig.tagline.en}` },
              { label: "Public email", value: siteConfig.email },
              { label: "WhatsApp", value: siteConfig.phoneDisplay },
              { label: "Facebook page", value: siteConfig.facebook },
              { label: "Working hours", value: siteConfig.businessHours.display.en },
              { label: "Timezone", value: siteConfig.timezone },
              { label: "Currency", value: siteConfig.currency },
              { label: "Site URL", value: siteConfig.siteUrl },
            ]}
          />
        </div>
      </section>

      <section className="surface p-5">
        <h2 className="text-lg">Feature flags</h2>
        <ul className="mt-4 grid gap-3">
          {flags.map((flag) => (
            <li key={flag.key} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5">
              <div>
                <p className="text-sm font-medium text-navy">{flag.label}</p>
                <p className="font-mono text-xs text-slate-500">{flag.key}</p>
              </div>
              <Badge tone={flag.enabled ? "success" : "neutral"} size="sm">
                {flag.enabled ? "enabled" : "disabled"}
              </Badge>
            </li>
          ))}
        </ul>
        <Alert tone="info" className="mt-4">
          Direct checkout is intentionally disabled: the current sales model completes on WhatsApp or Messenger and is
          recorded here as order intent (Build Spec §07).
        </Alert>
      </section>

      <section className="surface p-5">
        <h2 className="text-lg">Integration status</h2>
        <ul className="mt-4 grid gap-3">
          {integrations.map((integration) => (
            <li key={integration.label} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5">
              <p className="text-sm font-medium text-navy">{integration.label}</p>
              <Badge tone={integration.ok ? "success" : "warning"} size="sm">
                {integration.value}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-slate-500">
          Inbound automation endpoints: <code className="rounded bg-mist px-1.5 py-0.5">/api/webhooks/n8n/lead</code>,{" "}
          <code className="rounded bg-mist px-1.5 py-0.5">/order</code>, <code className="rounded bg-mist px-1.5 py-0.5">/payment</code>,{" "}
          <code className="rounded bg-mist px-1.5 py-0.5">/message</code>, <code className="rounded bg-mist px-1.5 py-0.5">/audit</code> — all require the
          shared secret header.
        </p>
      </section>

      <section className="surface p-5">
        <h2 className="text-lg">Admin security</h2>
        <ul className="mt-4 grid gap-3">
          <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5">
            <p className="text-sm font-medium text-navy">Password hash (scrypt)</p>
            <Badge tone={process.env.ADMIN_PASSWORD_HASH ? "success" : "warning"} size="sm">
              {process.env.ADMIN_PASSWORD_HASH ? "configured" : "using fallback password"}
            </Badge>
          </li>
          <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line p-3.5">
            <p className="text-sm font-medium text-navy">Session secret</p>
            <Badge tone={process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16 ? "success" : "danger"} size="sm">
              {process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16 ? "configured" : "missing or too short"}
            </Badge>
          </li>
        </ul>
        <Alert tone="warning" className="mt-4">
          Before going live set <code className="rounded bg-mist px-1 py-0.5">ADMIN_PASSWORD_HASH</code> (run{" "}
          <code className="rounded bg-mist px-1 py-0.5">npm run hash-password &quot;…&quot;</code>) and a long random{" "}
          <code className="rounded bg-mist px-1 py-0.5">AUTH_SECRET</code>.
        </Alert>
      </section>
    </div>
  );
}
