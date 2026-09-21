import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/portal/PortalPlaceholder";

export const metadata: Metadata = {
  title: "Customer Dashboard — Coming Soon",
  description: "Nexus Lift customer dashboard — order status, payment verification, revisions এবং delivery tracking।",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return (
    <PortalPlaceholder
      slug="dashboard"
      title={{ bn: "Customer Dashboard", en: "Customer dashboard" }}
      intro={{
        bn: "এখানে আপনার প্রজেক্টের অবস্থা, Revision সংখ্যা এবং ডেলিভারি ফাইল দেখা যাবে। Portal চালু হওয়ার আগে এই তথ্য WhatsApp-এ জানানো হয়।",
        en: "This is where project status, revision rounds and delivery files will appear. Until it is enabled, we share this over WhatsApp.",
      }}
    />
  );
}
