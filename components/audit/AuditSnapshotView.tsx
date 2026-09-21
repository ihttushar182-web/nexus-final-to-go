import { businessLayers } from "@/data/layers";
import { getMaturityBand } from "@/lib/audit/scoring";
import { ScoreBar } from "@/components/ui/StateMessage";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/utils";
import type { AuditSnapshot, Locale } from "@/types";

/**
 * The Snapshot block (Master System v2.0 — Audit Result Page).
 * Bars are driven by the stored per-layer scores; the weakest layer is highlighted
 * and labelled, and the maturity band is stated in words rather than only as a number.
 */
export function AuditSnapshotView({ snapshot, locale }: { snapshot: AuditSnapshot; locale: Locale }) {
  const priority = snapshot.priorityLayer;
  const byLayer = new Map(snapshot.layerScores.map((item) => [item.layer, item]));

  return (
    <div className="surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{locale === "bn" ? "The Snapshot" : "The snapshot"}</p>
          <h2 className="mt-2 text-xl">
            {locale === "bn" ? "আপনার ছয়টি Layer-এর বর্তমান অবস্থা" : "The current state of your six layers"}
          </h2>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-semibold text-navy tabular-nums">
            {snapshot.total}
            <span className="text-sm font-medium text-slate-500">/{snapshot.maxTotal}</span>
          </p>
          <p className="text-xs text-slate-500">{snapshot.percent}% overall</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {businessLayers.map((layer) => {
          const entry = byLayer.get(layer.id);
          const score = entry?.score ?? 0;
          const band = getMaturityBand(score);
          const isWeakest = layer.id === snapshot.weakestLayer;
          return (
            <div key={layer.id}>
              <ScoreBar
                label={t(layer.metric, locale)}
                score={score}
                max={10}
                highlight={isWeakest}
              />
              <div className="mt-1.5 flex items-center gap-2">
                <Badge tone={isWeakest ? "warning" : "neutral"} size="sm">
                  {t(band.label, locale)}
                </Badge>
                {isWeakest ? (
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-warning">
                    {locale === "bn" ? "সবচেয়ে দুর্বল" : "Lowest"}
                  </span>
                ) : null}
                {layer.id === priority ? (
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wide text-nexus">
                    {locale === "bn" ? "Priorities" : "Priority"}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-slate-500">
        {locale === "bn"
          ? "স্কোর হিসাব: Yes = 10, Partial = 5, No = 0। এটি একটি Diagnostic Aid — কোনো বৈজ্ঞানিকভাবে যাচাইকৃত স্কোর নয়, এবং এটি আপনার ব্যবসার সামগ্রিক মূল্যায়ন নয়।"
          : "Scoring: Yes = 10, Partial = 5, No = 0. This is a diagnostic aid, not a scientifically validated score, and it is not a valuation of your business."}
      </p>
    </div>
  );
}
