"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import type { ReactNode } from "react";

const sections = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads (CRM)", icon: Users },
  { href: "/admin/audits", label: "Audits", icon: ClipboardList },
  { href: "/admin/orders", label: "Orders & Payment", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Building2 },
  { href: "/admin/messages", label: "Messages & Webhooks", icon: MessageSquare },
  { href: "/admin/products", label: "Products", icon: BarChart3 },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  email,
  role,
}: {
  children: ReactNode;
  email: string;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  const nav = (
    <nav aria-label="Admin sections" className="grid gap-1">
      {sections.map((section) => {
        const active = section.href === "/admin" ? pathname === "/admin" : pathname.startsWith(section.href);
        const Icon = section.icon;
        return (
          <Link
            key={section.href}
            href={section.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-nexus text-white" : "text-slate-300 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {section.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-mist lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-navy p-4 lg:flex">
        <Link href="/" className="mb-6 block">
          <Logo tone="light" />
        </Link>
        {nav}
        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="truncate text-xs text-slate-400">{email}</p>
          <p className="text-[0.7rem] uppercase tracking-wide text-slate-500">{role}</p>
          <button
            type="button"
            onClick={signOut}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
          >
            <LogOut className="size-3.5" aria-hidden /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
          <Link href="/admin">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="admin-nav"
            className="grid size-10 place-items-center rounded-lg border border-line text-navy"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open ? (
          <div id="admin-nav" className="border-b border-white/10 bg-navy p-4 lg:hidden">
            {nav}
            <button
              type="button"
              onClick={signOut}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </button>
          </div>
        ) : null}

        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
