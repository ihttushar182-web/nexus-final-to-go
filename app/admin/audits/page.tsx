import Link from "next/link";
import { getRepository } from "@/lib/db";
import { businessLayers } from "@/data/layers";
import { bottomProblemLabel, goalLabel, stageLabel, teamSizeLabel } from "@/lib/audit/labels";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/StateMessage";
import { DashboardCard } from "@/components/ui/DataDisplay";

export const dynamic = "force-dynamic";

/** Admin audit view (Build Spec §50). */
export default async function AdminAuditsPage() {
  const repository = getRepository();
  const audits = await repository.listAudits(300);

  const priorityCounts = audits.reduce<Record<string, number>>((accumulator, audit) => {
    accumulator[audit.snapshot.priorityLayer] = (accumulator[audit.snapshot.priorityLayer] ?? 0) + 1;
    return accumulator;
  }, {});

  const topPriority = Object.entries(priorityCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="grid gap-6">
      <header>
        <p className="eyebrow">Diagnostics</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Audit submissions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every entry shows the six layer responses, the calculated snapshot and the priority the engine selected.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <DashboardCard label="Submissions" value={audits.length} />
        <DashboardCard
          label="Most common priority"
          value={topPriority ? topPriority[0] : "—"}
          hint={topPriority ? `${topPriority[1]} submission${topPriority[1] === 1 ? "" : "s"}` : undefined}
          tone="brand"
        />
        <DashboardCard
          label="Average score"
          value={audits.length ? `${Math.round(audits.reduce((sum, audit) => sum + audit.snapshot.percent, 0) / audits.length)}%` : "—"}
        />
      </section>

      {audits.length === 0 ? (
        <EmptyState
          title="No audit submissions yet"
          description="Submissions from /business-audit are stored here with their scores and priority."
        />
      ) : (
        <ul className="grid gap-4">
          {audits.map((audit) => (
            <li key={audit.id}>
              <article className="surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg">{audit.businessName}</h2>
                    <p className="mt-0.5 text-sm text-slate-600">
                      {audit.name} · {audit.email} · {audit.whatsapp}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Submitted {formatDateTime(audit.createdAt)} · {audit.source}
                      {audit.businessLink ? ` · ${audit.businessLink}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="brand" size="sm">Priority: {audit.snapshot.priorityLayer}</Badge>
                    <Badge tone="neutral" size="sm">
                      {audit.snapshot.total}/{audit.snapshot.maxTotal} · {audit.snapshot.percent}%
                    </Badge>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {businessLayers.map((layer) => {
                    const entry = audit.snapshot.layerScores.find((item) => item.layer === layer.id);
                    const isWeakest = audit.snapshot.weakestLayer === layer.id;
                    return (
                      <div
                        key={layer.id}
                        className={`rounded-lg border p-3 ${isWeakest ? "border-warning/40 bg-warning-50" : "border-line bg-white"}`}
                      >
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{layer.name.en}</dt>
                        <dd className="mt-1 flex items-center gap-2 text-sm">
                          <span className="tabular-nums font-medium text-navy">{entry?.score ?? 0}/10</span>
                          <span className="text-slate-500">({entry?.answer ?? "no"})</span>
                        </dd>
                      </div>
                    );
                  })}
                </dl>

                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="text-slate-500">Stage:</dt>
                    <dd className="text-slate-700">{stageLabel(audit.businessStage, "en")}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-slate-500">Team:</dt>
                    <dd className="text-slate-700">{teamSizeLabel(audit.teamSize, "en")}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-slate-500">Biggest problem:</dt>
                    <dd className="text-slate-700">{bottomProblemLabel(audit.biggestProblem, "en")}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-slate-500">Six-month goal:</dt>
                    <dd className="text-slate-700">{goalLabel(audit.goal, "en")}</dd>
                  </div>
                </dl>

                <p className="mt-3 text-sm text-slate-600">
                  <span className="font-medium text-navy">Priority reason: </span>
                  {audit.snapshot.priorityReason.en}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link href={`/business-audit/result/${audit.id}`} className="text-sm font-semibold text-nexus hover:underline">
                    Open customer snapshot →
                  </Link>
                  <a
                    href={`https://wa.me/${audit.whatsapp.replace(/[^\d]/g, "").replace(/^0/, "880")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-nexus hover:underline"
                  >
                    WhatsApp this lead →
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
