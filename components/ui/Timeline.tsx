import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Horizontal (desktop) / vertical (mobile) process timeline. */
export function ProcessTimeline({
  steps,
  className,
  tone = "light",
}: {
  steps: { code?: string; title: ReactNode; description?: ReactNode }[];
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <ol className={cn("relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {steps.map((step, index) => (
        <li
          key={index}
          className={cn(
            "relative rounded-xl border p-4 sm:p-5",
            tone === "dark" ? "border-white/15 bg-white/5 text-white" : "border-line bg-white",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg font-display text-sm font-semibold tabular-nums",
                tone === "dark" ? "bg-white/10 text-accent" : "bg-nexus-50 text-nexus",
              )}
            >
              {step.code ?? String(index + 1).padStart(2, "0")}
            </span>
            <p className={cn("font-semibold", tone === "dark" ? "text-white" : "text-navy")}>{step.title}</p>
          </div>
          {step.description ? (
            <p className={cn("mt-2.5 text-sm leading-relaxed", tone === "dark" ? "text-slate-300" : "text-slate-600")}>
              {step.description}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** Numbered vertical steps, used inside product pages and frameworks. */
export function StepList({
  steps,
  className,
}: {
  steps: { title: ReactNode; description?: ReactNode }[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-5 border-l border-line pl-6", className)}>
      {steps.map((step, index) => (
        <li key={index} className="relative">
          <span className="absolute -left-[1.9rem] grid size-7 place-items-center rounded-full border border-line bg-white text-xs font-semibold text-nexus tabular-nums">
            {index + 1}
          </span>
          <p className="font-semibold text-navy">{step.title}</p>
          {step.description ? <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/** Check list with brand ticks — used for deliverables and trust points. */
export function CheckList({
  items,
  className,
  tone = "light",
  columns,
}: {
  items: ReactNode[];
  className?: string;
  tone?: "light" | "dark";
  columns?: 1 | 2;
}) {
  return (
    <ul className={cn("grid gap-2.5", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1", className)}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed">
          <span
            aria-hidden
            className={cn(
              "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full text-[0.6rem] font-bold",
              tone === "dark" ? "bg-accent/25 text-accent" : "bg-success-50 text-success",
            )}
          >
            ✓
          </span>
          <span className={tone === "dark" ? "text-slate-200" : "text-slate-700"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
