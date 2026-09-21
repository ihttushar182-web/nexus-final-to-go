"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/ui/StateMessage";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Field";
import type { Locale } from "@/types";

interface SearchResult {
  type: "product" | "solution" | "insight" | "faq" | "case-study";
  title: string;
  description: string;
  href: string;
}

const typeLabels: Record<SearchResult["type"], { bn: string; en: string }> = {
  product: { bn: "পণ্য", en: "Product" },
  solution: { bn: "Solution", en: "Solution" },
  insight: { bn: "Insight", en: "Insight" },
  faq: { bn: "প্রশ্ন", en: "FAQ" },
  "case-study": { bn: "Case Study", en: "Case study" },
};

export function SearchClient({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const placeholder = useMemo(
    () => (locale === "bn" ? "যেমন: SOP, CRM, Dashboard, Hosting" : "e.g. SOP, CRM, dashboard, hosting"),
    [locale],
  );

  // A query shorter than two characters is a render-time decision, not an effect:
  // deriving it here removes a cascading render and keeps the effect purely external.
  const trimmed = query.trim();
  const tooShort = trimmed.length < 2;
  const viewState = tooShort ? "idle" : state;
  const viewResults = tooShort ? [] : results;

  useEffect(() => {
    if (trimmed.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setState("loading");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("search failed");
        const payload = (await response.json()) as { results: SearchResult[] };
        setResults(payload.results ?? []);
        setState("ready");
      } catch (error) {
        if ((error as Error).name !== "AbortError") setState("error");
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [trimmed, locale]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={locale === "bn" ? "সাইটে খুঁজুন" : "Search the site"}
          className="pl-10"
        />
      </div>

      <div className="mt-6" aria-live="polite">
        {viewState === "loading" ? <LoadingState label={locale === "bn" ? "খোঁজা হচ্ছে…" : "Searching…"} /> : null}

        {viewState === "error" ? (
          <EmptyState
            title={locale === "bn" ? "খোঁজা যায়নি" : "Search unavailable"}
            description={locale === "bn" ? "আবার চেষ্টা করুন অথবা WhatsApp-এ জিজ্ঞাসা করুন।" : "Please try again or ask on WhatsApp."}
          />
        ) : null}

        {viewState === "ready" && viewResults.length === 0 ? (
          <EmptyState
            title={locale === "bn" ? "কিছু পাওয়া যায়নি" : "No results"}
            description={
              locale === "bn"
                ? "অন্য শব্দে খুঁজুন — যেমন SOP, CRM, Dashboard অথবা Audit।"
                : "Try another term — for example SOP, CRM, dashboard or audit."
            }
          />
        ) : null}

        {viewResults.length > 0 ? (
          <ul className="grid gap-3">
            {viewResults.map((result) => (
              <li key={`${result.type}-${result.href}-${result.title}`}>
                <Link
                  href={result.href}
                  className="surface card-hover block p-4 sm:p-5"
                >
                  <span className="flex items-center gap-2">
                    <Badge tone="neutral" size="sm">{typeLabels[result.type][locale]}</Badge>
                    <span className="text-[0.95rem] font-semibold text-navy">{result.title}</span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-slate-600">{result.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {viewState === "idle" ? (
          <p className="text-sm text-slate-500">
            {locale === "bn"
              ? "কমপক্ষে ২টি অক্ষর লিখুন। Products, Solutions, Insights এবং FAQ — সব একসাথে খোঁজা হয়।"
              : "Type at least two characters — products, solutions, insights and FAQs are searched together."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
