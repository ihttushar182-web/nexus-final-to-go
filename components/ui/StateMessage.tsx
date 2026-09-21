import { AlertTriangle, Info, Inbox, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { wrap: string; icon: ReactNode }> = {
  info: { wrap: "border-[#cfe0ff] bg-nexus-50 text-navy", icon: <Info className="size-4 shrink-0" /> },
  success: { wrap: "border-[#bfe5cd] bg-success-50 text-success", icon: <CheckCircle2 className="size-4 shrink-0" /> },
  warning: { wrap: "border-[#f2ddb8] bg-warning-50 text-warning", icon: <AlertTriangle className="size-4 shrink-0" /> },
  danger: { wrap: "border-[#f6cfcb] bg-danger-50 text-danger", icon: <ShieldAlert className="size-4 shrink-0" /> },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div role="status" className={cn("flex gap-3 rounded-lg border p-3.5 text-sm", tones[tone].wrap, className)}>
      {tones[tone].icon}
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn(title && "mt-0.5", "text-[0.9rem] leading-relaxed")}>{children}</div> : null}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      <span className="grid size-11 place-items-center rounded-full bg-mist text-slate-400">
        <Inbox className="size-5" />
      </span>
      <p className="font-semibold text-navy">{title}</p>
      {description ? <p className="max-w-md text-sm text-slate-500">{description}</p> : null}
      {action}
    </div>
  );
}

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500" role="status" aria-live="polite">
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-mist-200", className)} aria-hidden />;
}

/** Inline labelled progress used by the audit snapshot bars. */
export function ScoreBar({
  label,
  score,
  max = 10,
  highlight,
  caption,
}: {
  label: string;
  score: number;
  max?: number;
  highlight?: boolean;
  caption?: string;
}) {
  const percent = Math.max(4, Math.round((score / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className={cn("font-medium", highlight ? "text-nexus" : "text-navy")}>{label}</span>
        <span className="tabular-nums text-xs text-slate-500">
          {score}/{max}
          {caption ? <span className="ml-2 hidden sm:inline text-slate-400">{caption}</span> : null}
        </span>
      </div>
      <div
        className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-mist-200"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            highlight ? "bg-nexus" : "bg-accent",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
