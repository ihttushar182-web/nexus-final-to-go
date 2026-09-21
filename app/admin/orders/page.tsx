import { getRepository } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { DashboardCard, DataTable, type Column } from "@/components/ui/DataDisplay";
import { EmptyState, Alert } from "@/components/ui/StateMessage";
import { OrderEditor } from "@/components/admin/OrderEditor";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

const paymentTone: Record<string, "neutral" | "brand" | "success" | "warning" | "danger"> = {
  pending: "neutral",
  submitted: "warning",
  verified: "success",
  rejected: "danger",
  adjustment_required: "warning",
};

export default async function AdminOrdersPage() {
  const repository = getRepository();
  const orders = await repository.listOrders(300);

  const awaiting = orders.filter((order) => order.paymentStatus === "submitted");
  const revenue = orders
    .filter((order) => order.paymentStatus === "verified" && order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);

  const columns: Column<Order>[] = [
    { key: "number", header: "Order", render: (order) => <span className="font-medium text-navy">{order.orderNumber}</span> },
    {
      key: "customer",
      header: "Customer",
      render: (order) => (
        <span>
          {order.customerName}
          <span className="block text-xs text-slate-500">
            {order.customerEmail} · {order.customerPhone}
          </span>
        </span>
      ),
    },
    {
      key: "product",
      header: "Product",
      render: (order) => <span className="text-xs text-slate-600">{order.items.map((item) => item.productName).join(", ") || "—"}</span>,
    },
    { key: "total", header: "Total", render: (order) => <span className="tabular-nums">{formatCurrency(order.total)}</span> },
    { key: "status", header: "Status", render: (order) => <Badge tone="neutral" size="sm">{order.status.replace(/_/g, " ")}</Badge> },
    {
      key: "payment",
      header: "Payment",
      render: (order) => <Badge tone={paymentTone[order.paymentStatus] ?? "neutral"} size="sm">{order.paymentStatus.replace(/_/g, " ")}</Badge>,
    },
    {
      key: "reference",
      header: "Reference",
      render: (order) => <span className="font-mono text-xs text-slate-600">{order.paymentReference ?? "—"}</span>,
    },
    { key: "created", header: "Created", render: (order) => <span className="text-xs text-slate-500">{formatDateTime(order.createdAt)}</span> },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <p className="eyebrow">Operations</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Orders & payment verification</h1>
        <p className="mt-1 text-sm text-slate-600">
          Orders arrive as <strong>awaiting payment</strong> and only move forward after a human verifies the payment.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Orders" value={orders.length} />
        <DashboardCard label="Awaiting verification" value={awaiting.length} tone={awaiting.length ? "warning" : "default"} />
        <DashboardCard label="Verified revenue" value={formatCurrency(revenue)} hint="verified payments only" />
        <DashboardCard
          label="In production"
          value={orders.filter((order) => ["confirmed", "in_production", "revision_1", "revision_2", "final_review"].includes(order.status)).length}
        />
      </section>

      {awaiting.length ? (
        <Alert tone="warning" title={`${awaiting.length} payment${awaiting.length === 1 ? "" : "s"} waiting for verification`}>
          Check each transaction reference against the bKash merchant statement, then mark it verified below. Submitting a
          transaction ID alone never verifies a payment.
        </Alert>
      ) : null}

      <DataTable
        columns={columns}
        rows={orders}
        rowKey={(order) => order.id}
        empty={<EmptyState title="No orders yet" description="Order intent created from product pages will appear here." />}
      />

      {orders.length ? (
        <section className="grid gap-5">
          <h2 className="text-lg">Update an order</h2>
          {orders.slice(0, 3).map((order) => (
            <OrderEditor key={order.id} order={order} />
          ))}
          {orders.length > 3 ? (
            <p className="text-xs text-slate-500">
              Showing the three most recent orders for update. Older orders remain in the table above and in the database.
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
