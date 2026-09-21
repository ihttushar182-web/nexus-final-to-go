import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-slate-500", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-nexus hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-navy" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRight className="size-3.5 text-slate-400" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
  breadcrumb,
  align = "left",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  breadcrumb?: Crumb[];
  align?: "left" | "center";
}) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-gradient-to-b from-mist to-white">
      <div className="grid-backdrop-light absolute inset-0" aria-hidden />
      <div className="container-page relative py-10 sm:py-14 lg:py-16">
        {breadcrumb?.length ? <Breadcrumb items={breadcrumb} className="mb-6" /> : null}
        <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
          <h1 className="text-[1.75rem] leading-[1.25] sm:text-4xl lg:text-[2.6rem]">{title}</h1>
          {intro ? <div className="mt-4 text-[1.02rem] leading-relaxed text-slate-600">{intro}</div> : null}
          {children ? <div className="mt-7">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
