import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/lib/db";
import { bottomProblemLabel, goalLabel, stageLabel, toolLabel } from "@/lib/audit/labels";
import { getLayer } from "@/data/layers";
import { formatDateTime, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { StatList } from "@/components/ui/DataDisplay";
import { LeadEditor } from "@/components/admin/LeadEditor";
import { AuditSnapshotView } from "@/components/audit/AuditSnapshotView";
import { WhatsAppButton } from "@/components/integrations/ContactButtons";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repository = getRepository();

  const lead = await repository.getLead(id);
  if (!lead) notFound();

  const events = await repository.listLeadEvents(id);
  const audit = lead.auditSubmissionId ? await repository.getAudit(lead.auditSubmissionId) : null;

  return (
    <div className="grid gap-6">
      <nav className="text-sm text-slate-500">
        <Link href="/admin/leads" className="hover:text-nexus hover:underline">
          Leads
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <span className="text-navy">{lead.name}</span>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">{lead.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {lead.businessName ?? "—"} · created {formatDateTime(lead.createdAt)}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="brand" size="sm">{lead.status}</Badge>
            <Badge tone="neutral" size="sm">{lead.source} / {lead.channel}</Badge>
            {lead.score ? <Badge tone="accent" size="sm">Audit score {lead.score}%</Badge> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <WhatsAppButton
            intent={`Hello ${lead.name}, this is Nexus Lift following up on your enquiry.`}
            ctaLocation="admin_lead"
            size="sm"
            label={`WhatsApp ${lead.phone}`}
          />
          <a href={`mailto:${lead.email}`} className="inline-flex items-center rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-semibold text-navy hover:border-accent">
            Email
          </a>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-6">
          <section className="surface p-5">
            <h2 className="text-lg">Lead record</h2>
            <div className="mt-4">
              <StatList
                items={[
                  { label: "Email", value: lead.email },
                  { label: "Phone / WhatsApp", value: lead.phone },
                  { label: "Business stage", value: stageLabel(lead.businessStage ?? "", "en") || "—" },
                  { label: "Goal", value: goalLabel(lead.goal ?? "", "en") || "—" },
                  { label: "Stated problem", value: bottomProblemLabel(lead.problem ?? "", "en") || "—" },
                  { label: "Service interest", value: getLayer(lead.serviceInterest ?? "")?.name.en ?? lead.serviceInterest ?? "—" },
                  { label: "Product interest", value: lead.productInterest ?? "—" },
                  { label: "Owner", value: lead.owner ?? "unassigned" },
                  { label: "Last contact", value: lead.lastContactAt ? formatRelative(lead.lastContactAt) : "—" },
                  { label: "Next follow-up", value: lead.nextFollowupAt ? formatDateTime(lead.nextFollowupAt) : "—" },
                ]}
              />
            </div>
            {lead.notes ? (
              <div className="mt-4 rounded-lg border border-line bg-mist p-3.5 text-sm text-slate-700">{toolLabel(lead.notes, "en")}</div>
            ) : null}
          </section>

          {audit ? (
            <section className="grid gap-4">
              <AuditSnapshotView snapshot={audit.snapshot} locale="en" />
              <div className="surface p-5">
                <h2 className="text-lg">Audit inputs</h2>
                <div className="mt-4">
                  <StatList
                    items={[
                      { label: "Business", value: audit.businessName },
                      { label: "Link", value: audit.businessLink ?? "—" },
                      { label: "Team size", value: audit.teamSize },
                      { label: "Tools in use", value: audit.currentTools ?? "—" },
                      { label: "Priority reason", value: audit.snapshot.priorityReason.en },
                      { label: "Submitted", value: formatDateTime(audit.createdAt) },
                    ]}
                  />
                </div>
                <Link href={`/business-audit/result/${audit.id}`} className="mt-4 inline-flex text-sm font-semibold text-nexus hover:underline">
                  Open the customer-facing snapshot →
                </Link>
              </div>
            </section>
          ) : null}
        </div>

        <div className="grid gap-6">
          <LeadEditor lead={lead} />

          <section className="surface p-5">
            <h2 className="text-lg">Timeline</h2>
            <ol className="mt-4 space-y-4 border-l border-line pl-5">
              {events.length === 0 ? (
                <li className="text-sm text-slate-500">No events recorded yet.</li>
              ) : (
                events.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute -left-[1.55rem] top-1.5 size-2.5 rounded-full bg-accent" aria-hidden />
                    <p className="text-sm text-navy">{event.message}</p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(event.createdAt)} · {event.type}
                      {event.actor ? ` · ${event.actor}` : ""}
                    </p>
                  </li>
                ))
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
