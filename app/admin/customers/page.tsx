import { getRepository } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { DataTable, type Column } from "@/components/ui/DataDisplay";
import { EmptyState } from "@/components/ui/StateMessage";
import type { Customer } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const repository = getRepository();
  const customers = await repository.listCustomers(300);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      render: (customer) => (
        <span>
          <span className="font-medium text-navy">{customer.name}</span>
          {customer.businessName ? <span className="block text-xs text-slate-500">{customer.businessName}</span> : null}
        </span>
      ),
    },
    { key: "email", header: "Email", render: (customer) => <span className="text-xs">{customer.email}</span> },
    { key: "phone", header: "Phone", render: (customer) => <span className="text-xs">{customer.phone}</span> },
    { key: "orders", header: "Orders", render: (customer) => <span className="tabular-nums">{customer.orders.length}</span> },
    { key: "created", header: "Since", render: (customer) => <span className="text-xs text-slate-500">{formatDateTime(customer.createdAt)}</span> },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <p className="eyebrow">Accounts</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-slate-600">
          A customer record is created when an order is recorded. Lead records (before an order) live in the CRM.
        </p>
      </header>

      <DataTable
        columns={columns}
        rows={customers}
        rowKey={(customer) => customer.id}
        empty={<EmptyState title="No customers yet" description="Customers appear once an order is created for them." />}
      />
    </div>
  );
}
