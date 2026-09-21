import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/portal/PortalPlaceholder";

export const metadata: Metadata = {
  title: "Account — Coming Soon",
  description: "Nexus Lift account area — profile, invoices এবং service history।",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <PortalPlaceholder
      slug="account"
      title={{ bn: "Account", en: "Account" }}
      intro={{
        bn: "আপনার প্রোফাইল, ইনভয়েস এবং সার্ভিস হিস্ট্রি এখানে থাকবে। এই মুহূর্তে যেকোনো তথ্যের জন্য আমাদের টিমের সাথে যোগাযোগ করুন।",
        en: "Your profile, invoices and service history will live here. For now, contact our team for anything you need.",
      }}
    />
  );
}
