import Link from "next/link";
import { AlertTriangle, ArrowUpRight, ClipboardList, Package, Users } from "lucide-react";
import { getRepository } from "@/lib/db";
import { getLayer } from "@/data/layers";
import { getProduct } from "@/data/products";
import { formatCurrency, formatRelative } from "@/lib/utils";
import { DashboardCard, DataTable } from "@/components/ui/DataDisplay";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/StateMessage";
import type { Column } from "@/components/ui/DataDisplay";
import type { Lead } from "@/types";

export const dynamic = "force-dynamic";

const statusTone: Record<string, "neutral" | "brand" | "success" | "warning" | "danger"> = {
  new: "brand",
  qualified: "brand",
  contacted: "neutral",
  interested: "warning",
  proposal: "warning",
  won: "success",
  lost: "danger",
  nurture: "neutral",
};

export default async function AdminDashboardPage() {
  const repository = getRepository();
  const [stats, leads, orders, audits] = await Promise.all([
    repository.stats(),
    repository.listLeads({ limit: 8 }),
    repository.listOrders(8),
    repository.listAudits(6),
  ]);

  const leadColumns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead",
      render: (lead) => (
        <Link href={`/admin/leads/${lead.id}`} className="font-medium text-navy hover:underline">
          {lead.name}
          <span className="block text-xs font-normal text-slate-500">{lead.businessName ?? lead.email}</span>
        </Link>
      ),
    },
    { key: "status", header: "Status", render: (lead) => <Badge tone={statusTone[lead.status] ?? "neutral"} size="sm">{lead.status}</Badge> },
    { key: "source", header: "Source", render: (lead) => <span className="text-xs text-slate-500">{lead.source}</span> },
    { key: "score", header: "Audit score", render: (lead) => <span className="tabular-nums">{lead.score}%</span> },
    { key: "created", header: "Created", render: (lead) => <span className="text-xs text-slate-500">{formatRelative(lead.createdAt)}</span> },
  ];


  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">CEO Control Room</p>
          <h1 className="mt-2 text-2xl sm:text-3xl">Nexus Lift — Operations Overview</h1>
          <p className="mt-1 text-sm text-slate-600">
            Numbers below come from stored leads, orders and audit submissions — nothing is estimated.
          </p>
        </div>
        <Badge tone="neutral" size="sm">Live data</Badge>
      </header>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Total leads" value={stats.totalLeads} hint={`${stats.newLeads} new`} icon={<Users className="size-4" />} />
        <DashboardCard label="Qualified pipeline" value={stats.qualifiedLeads} hint="qualified / interested / proposal" tone="brand" />
        <DashboardCard
          label="Orders"
          value={stats.orders}
          hint={`${stats.activeOrders} active · ${stats.deliveredOrders} delivered`}
          icon={<Package className="size-4" />}
        />
        <DashboardCard
          label="Pending payments"
          value={stats.pendingPayments}
          hint="awaiting human verification"
          tone={stats.pendingPayments > 0 ? "warning" : "default"}
          icon={<AlertTriangle className="size-4" />}
        />
        <DashboardCard label="Verified revenue" value={formatCurrency(stats.revenue)} hint="only verified payments" />
        <DashboardCard label="Audit submissions" value={stats.audits} icon={<ClipboardList className="size-4" />} />
        <DashboardCard
          label="Active products"
          value={9}
          hint="catalogue items with a defined price"
        />
        <DashboardCard label="Risk flags" value={stats.pendingPayments > 2 ? "Review" : "Clear"} tone={stats.pendingPayments > 2 ? "danger" : "default"} hint="payment queue depth" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg">Newest leads</h2>
            <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm font-semibold text-nexus hover:underline">
              Open CRM <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <DataTable
            columns={leadColumns}
            rows={leads}
            rowKey={(lead) => lead.id}
            empty={<EmptyState title="No leads yet" description="Audit submissions and product enquiries appear here." />}
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg">Recent audit submissions</h2>
            <Link href="/admin/audits" className="inline-flex items-center gap-1 text-sm font-semibold text-nexus hover:underline">
              All audits <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-3">
            {audits.length === 0 ? (
              <EmptyState title="No audits yet" description="Run the funnel at /business-audit to see submissions here." />
            ) : (
              audits.map((audit) => (
                <article key={audit.id} className="surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-navy">{audit.businessName}</p>
                      <p className="text-xs text-slate-500">
                        {audit.name} · {audit.whatsapp}
                      </p>
                    </div>
                    <Badge tone="brand" size="sm">
                      {getLayer(audit.snapshot.priorityLayer)?.name.en}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {audit.snapshot.total}/60 · {audit.snapshot.percent}% · {formatRelative(audit.createdAt)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link href={`/business-audit/result/${audit.id}`} className="text-xs font-semibold text-nexus hover:underline">
                      View snapshot →
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg">Recent orders</h2>
        <DataTable
          columns={[
            { key: "number", header: "Order", render: (order) => <span className="font-medium text-navy">{order.orderNumber}</span> },
            {
              key: "customer",
              header: "Customer",
              render: (order) => (
                <span>
                  {order.customerName}
                  <span className="block text-xs text-slate-500">{order.customerPhone}</span>
                </span>
              ),
            },
            {
              key: "items",
              header: "Product",
              render: (order) => <span className="text-xs text-slate-600">{order.items.map((item) => item.productName).join(", ") || "—"}</span>,
            },
            { key: "total", header: "Total", render: (order) => <span className="tabular-nums">{formatCurrency(order.total)}</span> },
            { key: "status", header: "Status", render: (order) => <Badge tone="neutral" size="sm">{order.status}</Badge> },
            {
              key: "payment",
              header: "Payment",
              render: (order) => (
                <Badge tone={order.paymentStatus === "verified" ? "success" : order.paymentStatus === "submitted" ? "warning" : "neutral"} size="sm">
                  {order.paymentStatus}
                </Badge>
              ),
            },
          ]}
          rows={orders}
          rowKey={(order) => order.id}
          empty={<EmptyState title="No orders yet" description="Order intent recorded from product pages appears here." />}
        />
      </section>

      <section className="surface p-5">
        <h2 className="text-lg">Catalogue reference</h2>
        <p className="mt-1 text-sm text-slate-600">
          Prices are read from the central product data layer, so a price change updates the website, the admin and the
          automation payloads at once.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["professional-business-starter", "professional-business-growth", "professional-business-premium", "sop-process-system", "crm-customer-system", "business-os-dashboard"].map((slug) => {
            const product = getProduct(slug);
            if (!product) return null;
            return (
              <Badge key={slug} tone="neutral" size="sm">
                {product.name.en} · {product.currentPrice != null ? formatCurrency(product.currentPrice) : "TBC"}
              </Badge>
            );
          })}
        </div>
      </section>
    </div>
  );
}
