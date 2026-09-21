import { ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Small KPI card used by the admin dashboard and the CEO control-room mock. */
export function DashboardCard({
  label,
  value,
  hint,
  trend,
  tone = "default",
  icon,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  trend?: { direction: "up" | "down" | "flat"; label: string; good?: boolean };
  tone?: "default" | "brand" | "warning" | "danger";
  icon?: ReactNode;
  className?: string;
}) {
  const tones = {
    default: "border-line bg-white",
    brand: "border-[#cfe0ff] bg-nexus-50",
    warning: "border-[#f2ddb8] bg-warning-50",
    danger: "border-[#f6cfcb] bg-danger-50",
  } as const;

  const TrendIcon =
    trend?.direction === "up" ? TrendingUp : trend?.direction === "down" ? TrendingDown : Minus;

  return (
    <div className={cn("rounded-xl border p-4 sm:p-5", tones[tone], className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        {icon ? <span className="text-slate-400">{icon}</span> : null}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums text-navy">{value}</p>
      <div className="mt-1.5 flex items-center gap-2 text-xs">
        {trend ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              trend.good === false ? "text-danger" : "text-success",
            )}
          >
            <TrendIcon className="size-3.5" aria-hidden />
            {trend.label}
          </span>
        ) : null}
        {hint ? <span className="text-slate-500">{hint}</span> : null}
      </div>
    </div>
  );
}

export interface Column<T> {
  key: string;
  header: ReactNode;
  className?: string;
  render: (row: T) => ReactNode;
}

/** Mobile-friendly table: real table on ≥768px, stacked cards below. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  empty?: ReactNode;
  caption?: string;
}) {
  if (!rows.length) {
    return <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-sm text-slate-500">{empty ?? "—"}</div>;
  }

  return (
    <div className="rounded-xl border border-line bg-white">
      <div className="scroll-x hidden md:block">
        <table className="w-full min-w-[46rem] border-collapse text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-line bg-mist text-left">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-line/70 last:border-0 hover:bg-mist/60">
                {columns.map((column) => (
                  <td key={column.key} className={cn("px-4 py-3 align-top text-slate-700", column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-line md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="p-4">
            <dl className="grid gap-2.5">
              {columns.map((column) => (
                <div key={column.key} className="flex items-start justify-between gap-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{column.header}</dt>
                  <dd className="text-right text-sm text-slate-700">{column.render(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StatList({ items }: { items: { label: ReactNode; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-line bg-white p-3.5">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</dt>
          <dd className="mt-1 text-sm font-medium text-navy">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 font-semibold text-nexus hover:underline">
      {children}
      <ArrowUpRight className="size-3.5" aria-hidden />
    </Link>
  );
}
