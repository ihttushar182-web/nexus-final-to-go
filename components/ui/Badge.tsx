import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "accent" | "dark";

const tones: Record<Tone, string> = {
  neutral: "bg-mist text-navy border-line",
  brand: "bg-nexus-50 text-nexus border-[#cfe0ff]",
  accent: "bg-accent-100 text-navy border-[#cbe4f6]",
  success: "bg-success-50 text-success border-[#bfe5cd]",
  warning: "bg-warning-50 text-warning border-[#f2ddb8]",
  danger: "bg-danger-50 text-danger border-[#f6cfcb]",
  dark: "bg-navy text-white border-navy",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  size = "md",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[0.7rem]" : "px-2.5 py-1 text-xs",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
