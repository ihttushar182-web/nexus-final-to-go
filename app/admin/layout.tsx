import type { Metadata } from "next";
import { getSession, adminConfigured } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const metadata: Metadata = {
  title: "Admin — Nexus Lift Control",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    const devHint = adminConfigured()
      ? undefined
      : "No admin password is configured. Set ADMIN_PASSWORD (development) or ADMIN_PASSWORD_HASH (production) in your environment, then sign in.";
    return <AdminLogin devHint={devHint} />;
  }

  return (
    <AdminShell email={session.email} role={session.role}>
      {children}
    </AdminShell>
  );
}
