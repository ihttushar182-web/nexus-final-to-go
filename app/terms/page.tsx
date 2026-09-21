import type { Metadata } from "next";
import { PolicyPage } from "@/components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Nexus Lift সেবা ব্যবহারের শর্তাবলি — Scope, Revision, Payment, Timeline, ক্লায়েন্টের দায়িত্ব, মালিকানা এবং দাবির সীমাবদ্ধতা।",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PolicyPage slug="terms" />;
}
