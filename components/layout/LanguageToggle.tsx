"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOCALE_COOKIE, localeMeta } from "@/lib/i18n/config";
import type { Locale } from "@/types";

/**
 * Language switch (Build Spec §56).
 * The choice is stored in a cookie and the server re-renders the same route in the
 * other language — one route tree, one set of components, no duplicated pages.
 */
export function LanguageToggle({ locale, tone = "light" }: { locale: Locale; tone?: "light" | "dark" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Locale = locale === "bn" ? "en" : "bn";

  function switchLocale() {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.lang = localeMeta[next].htmlLang;
    document.documentElement.dataset.locale = next;
    startTransition(() => router.refresh());
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      aria-label={`Switch language to ${localeMeta[next].label}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors",
        tone === "dark"
          ? "border-white/20 text-white hover:bg-white/10"
          : "border-line text-navy hover:border-accent hover:bg-mist",
        pending && "opacity-60",
      )}
    >
      <Languages className="size-3.5" aria-hidden />
      {localeMeta[next].native}
    </button>
  );
}
