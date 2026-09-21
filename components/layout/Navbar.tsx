"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { primaryNav } from "@/data/navigation";
import { cn, t } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n/dictionaries";
import { ButtonLink } from "@/components/ui/Button";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import type { Locale } from "@/types";

export function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const tr = createTranslator(locale);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer whenever the route changes. Adjusting state during render is the
  // documented pattern for this (react.dev: you might not need an effect) and avoids a
  // cascading render after paint.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors",
        scrolled ? "border-line bg-white/95 backdrop-blur" : "border-transparent bg-white",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteConfig.brandName} — home`}>
          <Logo className="h-8 w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href) ? "bg-mist text-navy" : "text-slate-600 hover:bg-mist hover:text-navy",
              )}
            >
              {t(item.label, locale)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle locale={locale} />
          <ButtonLink href="/contact" variant="outline" size="sm">
            {locale === "bn" ? "Contact" : "Contact"}
          </ButtonLink>
          <ButtonLink href="/business-audit" size="sm">
            {tr("nav.auditCta")}
          </ButtonLink>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageToggle locale={locale} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? tr("nav.close") : tr("nav.menu")}
            className="grid size-10 place-items-center rounded-lg border border-line text-navy"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-white lg:hidden">
          <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-3 text-[0.98rem] font-medium",
                  isActive(item.href) ? "bg-mist text-navy" : "text-slate-700 hover:bg-mist",
                )}
              >
                <span className="block">{t(item.label, locale)}</span>
                {item.description ? (
                  <span className="mt-0.5 block text-xs font-normal text-slate-500">{t(item.description, locale)}</span>
                ) : null}
              </Link>
            ))}
            <div className="mt-3 grid gap-2">
              <ButtonLink href="/business-audit" size="lg" fullWidth>
                {tr("nav.auditCta")}
              </ButtonLink>
              <ButtonLink href="/book-call" variant="outline" size="lg" fullWidth>
                {tr("nav.bookCall")}
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
