import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark" | "success";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[background,color,border-color,box-shadow] duration-150 disabled:cursor-not-allowed disabled:opacity-55 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-nexus text-white shadow-[0_6px_18px_-8px_rgba(0,72,172,0.65)] hover:bg-nexus-600 active:bg-navy",
  secondary: "bg-navy text-white hover:bg-navy-800",
  outline: "border border-line bg-white text-navy hover:border-accent hover:bg-mist",
  ghost: "text-navy hover:bg-mist",
  dark: "bg-charcoal text-white hover:bg-navy",
  success: "bg-success text-white hover:bg-[#0c6c3e]",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-4.5 py-2.5 text-[0.95rem]",
  lg: "px-6 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export interface ButtonProps extends CommonProps, Omit<ComponentProps<"button">, "className" | "children"> {}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends CommonProps {
  href: string;
  external?: boolean;
  prefetch?: boolean;
  "aria-label"?: string;
  onClick?: () => void;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  external,
  prefetch,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} prefetch={prefetch} {...rest}>
      {children}
    </Link>
  );
}
