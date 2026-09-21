"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LocalizedText, Locale } from "@/types";
import { t } from "@/lib/utils";

export interface FaqEntry {
  id: string;
  question: LocalizedText;
  answer: LocalizedText;
}

export function FAQAccordion({
  items,
  locale,
  className,
  defaultOpen,
}: {
  items: FaqEntry[];
  locale: Locale;
  className?: string;
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className={cn("divide-y divide-line overflow-hidden rounded-xl border border-line bg-white", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[0.98rem] font-semibold text-navy hover:bg-mist"
              >
                <span>{t(item.question, locale)}</span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border border-line text-nexus transition-colors",
                    isOpen && "bg-nexus text-white",
                  )}
                >
                  {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              hidden={!isOpen}
              className="px-5 pb-5 text-sm leading-relaxed text-slate-600"
            >
              {t(item.answer, locale)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
