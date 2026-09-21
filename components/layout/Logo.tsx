import { cn } from "@/lib/utils";

/**
 * Wordmark lockup.
 *
 * The official logo file is supplied by brand operations (see docs/13_OPEN_QUESTIONS.md).
 * This vector lockup keeps proportions, clear space and the approved palette so the
 * layout is production-ready today and swaps to the official asset with one change.
 */
export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid size-8 shrink-0 place-items-center rounded-lg bg-navy"
        style={{
          background: tone === "light" ? "#FFFFFF" : "linear-gradient(145deg,#1C2F4D 0%,#0048AC 100%)",
        }}
      >
        <svg viewBox="0 0 24 24" className="size-4.5" role="presentation">
          <path
            d="M5 17V7.2c0-.5.62-.72.92-.33L12 14l6.08-7.13c.3-.39.92-.17.92.33V17"
            fill="none"
            stroke={tone === "light" ? "#1C2F4D" : "#FFFFFF"}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="5" cy="19.2" r="1.7" fill={tone === "light" ? "#0048AC" : "#52A1D9"} />
          <circle cx="19" cy="19.2" r="1.7" fill={tone === "light" ? "#0048AC" : "#52A1D9"} />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.05rem] font-semibold tracking-tight",
            tone === "light" ? "text-white" : "text-navy",
          )}
        >
          Nexus<span className="text-nexus" style={tone === "light" ? { color: "#52A1D9" } : undefined}>Lift</span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.58rem] font-medium uppercase tracking-[0.14em]",
            tone === "light" ? "text-slate-300" : "text-slate-500",
          )}
        >
          Connecting Sources
        </span>
      </span>
    </span>
  );
}
