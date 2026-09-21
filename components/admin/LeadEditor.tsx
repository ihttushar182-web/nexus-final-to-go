"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { Alert } from "@/components/ui/StateMessage";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { Lead, LeadStatus } from "@/types";

const statuses: LeadStatus[] = ["new", "qualified", "contacted", "interested", "proposal", "won", "lost", "nurture"];

/** CRM lead editor — the only path that mutates lead state. */
export function LeadEditor({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [owner, setOwner] = useState(lead.owner ?? "");
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [nextFollowupAt, setNextFollowupAt] = useState(lead.nextFollowupAt?.slice(0, 10) ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setError(null);

    try {
      const response = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          status,
          owner: owner || undefined,
          notes: notes || undefined,
          nextFollowupAt: nextFollowupAt ? new Date(nextFollowupAt).toISOString() : null,
        }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        setError(payload.error ?? "Update failed");
        setState("error");
        return;
      }
      setState("saved");
      router.refresh();
    } catch {
      setError("Update failed");
      setState("error");
    }
  }

  return (
    <form onSubmit={save} className="surface p-5">
      <h2 className="text-lg">Update this lead</h2>

      {state === "saved" ? (
        <Alert tone="success" className="mt-4">
          Lead updated. Status changes are recorded in the lead timeline.
        </Alert>
      ) : null}
      {error ? (
        <Alert tone="danger" className="mt-4">
          {error}
        </Alert>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="lead-status">
          <select
            id="lead-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
            className="w-full appearance-none rounded-lg border border-line bg-white px-3.5 py-2.5 text-[16px]"
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Owner" htmlFor="lead-owner" hint="Who is responsible for the next step">
          <Input id="lead-owner" value={owner} onChange={(event) => setOwner(event.target.value)} placeholder="e.g. sales-1" />
        </Field>

        <Field label="Next follow-up" htmlFor="lead-followup">
          <Input id="lead-followup" type="date" value={nextFollowupAt} onChange={(event) => setNextFollowupAt(event.target.value)} />
        </Field>

        <Field label="Notes" htmlFor="lead-notes" className="sm:col-span-2" hint="Saved to the timeline as a note entry">
          <Textarea id="lead-notes" rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>
      </div>

      <Button type="submit" className="mt-5" disabled={state === "saving"}>
        {state === "saving" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
        {state === "saving" ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
