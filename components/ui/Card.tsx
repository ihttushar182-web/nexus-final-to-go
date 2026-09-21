import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Card({
  children,
  className,
  as: Tag = "div",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "section" | "li";
  hover?: boolean;
}) {
  return (
    <Tag className={cn("surface p-5 sm:p-6", hover && "card-hover", className)}>{children}</Tag>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-semibold text-navy", className)}>{children}</h3>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-2 text-sm leading-relaxed text-slate-600", className)}>{children}</div>;
}

export function CardMeta({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500", className)}>{children}</div>;
}
