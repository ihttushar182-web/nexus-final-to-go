import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Section shell — the single place that controls vertical rhythm and background tone,
 * so page files only describe content.
 */
export function Section({
  children,
  className,
  tone = "white",
  id,
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "white" | "mist" | "navy" | "gradient" | "none";
  id?: string;
  size?: "default" | "compact" | "tall";
}) {
  const tones: Record<string, string> = {
    white: "bg-white",
    mist: "bg-mist",
    navy: "bg-navy text-white",
    gradient: "bg-gradient-to-b from-white via-mist to-white",
    none: "",
  };
  const sizes: Record<string, string> = {
    compact: "py-10 sm:py-12",
    default: "section",
    tall: "py-14 sm:py-20 lg:py-24",
  };
  return (
    <section id={id} className={cn(tones[tone], sizes[size], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
  tone = "light",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("eyebrow mb-3", tone === "dark" && "text-accent")}>{eyebrow}</p>
        ) : null}
        <h2
          className={cn(
            "text-[1.6rem] leading-tight sm:text-3xl lg:text-[2.15rem]",
            tone === "dark" && "text-white",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className={cn("mt-3 text-[0.975rem] leading-relaxed text-slate-600 sm:text-base", tone === "dark" && "text-slate-300")}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Grid({
  children,
  cols = 3,
  className,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const map = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  } as const;
  return <div className={cn("mt-8 grid gap-5", map[cols], className)}>{children}</div>;
}
