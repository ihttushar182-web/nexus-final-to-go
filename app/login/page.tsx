import type { Metadata } from "next";
import { PortalPlaceholder } from "@/components/portal/PortalPlaceholder";

export const metadata: Metadata = {
  title: "Customer Login — Coming Soon",
  description: "Nexus Lift customer portal — orders, payments, delivery files, revisions এবং support tickets এক জায়গায়।",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <PortalPlaceholder
      slug="login"
      title={{ bn: "Customer Login", en: "Customer login" }}
      intro={{
        bn: "আমাদের Customer Portal এখনো চালু হয়নি। চালু হলে এখান থেকেই আপনি অর্ডার, পেমেন্ট যাচাইয়ের অবস্থা এবং ডেলিভারি ফাইল দেখতে পারবেন।",
        en: "Our customer portal is not live yet. Once enabled you will see orders, payment verification status and delivery files here.",
      }}
    />
  );
}
