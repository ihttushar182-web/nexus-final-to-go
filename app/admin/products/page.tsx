import Link from "next/link";
import { products, getSavings, TBC } from "@/data/products";
import { solutionCategories } from "@/data/solutions";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataDisplay";
import { Alert } from "@/components/ui/StateMessage";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

const categoryName = (id: string) => solutionCategories.find((category) => category.id === id)?.name.en ?? id;

export default async function AdminProductsPage() {
  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (product) => (
        <span>
          <Link href={`/products/${product.slug}`} className="font-medium text-navy hover:underline">
            {product.name.en}
          </Link>
          <span className="block text-xs text-slate-500">{product.slug}</span>
        </span>
      ),
    },
    { key: "category", header: "Category", render: (product) => <span className="text-xs">{categoryName(product.category)}</span> },
    { key: "layer", header: "Layer", render: (product) => <Badge tone="neutral" size="sm">{product.layer}</Badge> },
    {
      key: "price",
      header: "Price",
      render: (product) =>
        product.currentPrice != null ? (
          <span className="tabular-nums">
            {formatCurrency(product.currentPrice)}
            {product.originalPrice ? <span className="ml-2 text-xs text-slate-400 line-through">{formatCurrency(product.originalPrice)}</span> : null}
            {getSavings(product) ? <span className="ml-2 text-xs text-success">save {formatCurrency(getSavings(product)!)}</span> : null}
          </span>
        ) : (
          <span className="text-xs text-slate-500">{TBC.en}</span>
        ),
    },
    { key: "delivery", header: "Delivery", render: (product) => <span className="text-xs text-slate-600">{product.deliveryTime.en}</span> },
    { key: "revision", header: "Revisions", render: (product) => <span className="tabular-nums text-xs">{product.revisionCount ?? "—"}</span> },
    { key: "status", header: "Status", render: (product) => <Badge tone={product.status === "active" ? "success" : "neutral"} size="sm">{product.status}</Badge> },
  ];

  return (
    <div className="grid gap-6">
      <header>
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Products</h1>
        <p className="mt-1 text-sm text-slate-600">
          Read-only view of the central product data layer. Editing happens in <code className="rounded bg-mist px-1.5 py-0.5 text-xs">/data/products.ts</code> or in
          the <code className="rounded bg-mist px-1.5 py-0.5 text-xs">products</code> table once the Supabase driver is enabled — a single change
          propagates to the website, product pages, WhatsApp messages and automation payloads.
        </p>
      </header>

      <Alert tone="info" title="Pricing rule">
        Only prices supplied by Nexus Lift operations are published. Where a specification is not confirmed, the field
        reads “Details to be confirmed” rather than an invented value.
      </Alert>

      <DataTable columns={columns} rows={products} rowKey={(product) => product.id} caption="Product catalogue" />

      <section className="surface p-5">
        <h2 className="text-lg">Catalogue summary</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line p-3.5">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Active products</dt>
            <dd className="mt-1 font-display text-xl text-navy">{products.filter((product) => product.status === "active").length}</dd>
          </div>
          <div className="rounded-lg border border-line p-3.5">
            <dt className="text-xs uppercase tracking-wide text-slate-500">With a published price</dt>
            <dd className="mt-1 font-display text-xl text-navy">{products.filter((product) => product.currentPrice != null).length}</dd>
          </div>
          <div className="rounded-lg border border-line p-3.5">
            <dt className="text-xs uppercase tracking-wide text-slate-500">Awaiting specification</dt>
            <dd className="mt-1 font-display text-xl text-navy">{products.filter((product) => product.currentPrice == null).length}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
