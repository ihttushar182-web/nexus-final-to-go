import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Nexus Lift কী তথ্য সংগ্রহ করে, কীভাবে ব্যবহার করে, কাদের সাথে শেয়ার করে এবং AI ও Automation সম্পর্কে আমাদের অবস্থান।",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return <PolicyPage slug="privacy" />;
}
