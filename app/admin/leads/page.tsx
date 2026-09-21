import Link from "next/link";
import { getRepository } from "@/lib/db";
import { formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/StateMessage";
import { DataTable, type Column } from "@/components/ui/DataDisplay";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { leadStatusSchema } from "@/lib/validation/schemas";
import type { Lead, LeadStatus } from "@/types";

export const dynamic = "force-dynamic";

const tone: Record<LeadStatus, "neutral" | "brand" | "success" | "warning" | "danger"> = {
  new: "brand",
  qualified: "brand",
  contacted: "neutral",
  interested: "warning",
  proposal: "warning",
  won: "success",
  lost: "danger",
  nurture: "neutral",
};

const statuses = leadStatusSchema.options;

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; product?: string }>;
}) {
  const params = await searchParams;
  const status = params.status && statuses.includes(params.status as LeadStatus) ? (params.status as LeadStatus) : "all";

  const repository = getRepository();
  const leads = await repository.listLeads({ status, search: params.q, productInterest: params.product, limit: 300 });

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead",
      render: (lead) => (
        <Link href={`/admin/leads/${lead.id}`} className="font-medium text-navy hover:underline">
          {lead.name}
          <span className="block text-xs font-normal text-slate-500">{lead.email}</span>
        </Link>
      ),
    },
    { key: "phone", header: "WhatsApp", render: (lead) => <span className="text-xs">{lead.phone}</span> },
    {
      key: "business",
      header: "Business",
      render: (lead) => (
        <span className="text-xs text-slate-600">
          {lead.businessName ?? "—"}
          {lead.businessStage ? <span className="block text-slate-400">{lead.businessStage}</span> : null}
        </span>
      ),
    },
    {
      key: "interest",
      header: "Interest",
      render: (lead) => (
        <span className="text-xs">
          {lead.productInterest ? (
            <Link href={`/products/${lead.productInterest}`} className="text-nexus hover:underline">
              {lead.productInterest}
            </Link>
          ) : (
            lead.serviceInterest ?? "—"
          )}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (lead) => <Badge tone={tone[lead.status]} size="sm">{lead.status}</Badge> },
    { key: "score", header: "Score", render: (lead) => <span className="tabular-nums">{lead.score}%</span> },
    { key: "created", header: "Created", render: (lead) => <span className="text-xs text-slate-500">{formatRelative(lead.createdAt)}</span> },
    {
      key: "followup",
      header: "Next follow-up",
      render: (lead) => <span className="text-xs text-slate-500">{lead.nextFollowupAt ? formatRelative(lead.nextFollowupAt) : "—"}</span>,
    },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <p className="eyebrow">CRM</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Leads</h1>
        <p className="mt-1 text-sm text-slate-600">
          {leads.length} record{leads.length === 1 ? "" : "s"} shown. Status, owner and notes are stored with the lead so
          follow-up is never dependent on memory.
        </p>
      </header>

      <form className="surface grid gap-3 p-4 sm:grid-cols-[1.4fr_0.8fr_auto] sm:items-end" method="get">
        <div>
          <label htmlFor="q" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Search
          </label>
          <Input id="q" name="q" defaultValue={params.q ?? ""} placeholder="Name, email, phone, business" className="mt-1.5" />
        </div>
        <div>
          <label htmlFor="status" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status}
            className="mt-1.5 w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-[16px] text-charcoal"
          >
            <option value="all">All statuses</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" className="h-[46px]">
          Apply
        </Button>
      </form>

      <DataTable
        columns={columns}
        rows={leads}
        rowKey={(lead) => lead.id}
        empty={<EmptyState title="No leads match this filter" description="Try clearing the search term or switching status back to 'all'." />}
      />
    </div>
  );
}
