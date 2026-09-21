import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Refund & Revision Policy",
  description:
    "ডিজিটাল প্রোডাক্ট ও সার্ভিসে Refund নীতি, Revision কীভাবে কাজ করে, এবং Refund কখন বিবেচনা করা হয়।",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <PolicyPage slug="refund-policy" />;
}
