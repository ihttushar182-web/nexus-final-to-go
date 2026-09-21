import { getRepository } from "@/lib/db";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataDisplay";
import { EmptyState } from "@/components/ui/StateMessage";
import type { SupportTicket, WebhookLogEntry } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const repository = getRepository();
  const [tickets, webhooks] = await Promise.all([repository.listTickets(200), repository.listWebhookLogs(50)]);

  const ticketColumns: Column<SupportTicket>[] = [
    {
      key: "subject",
      header: "Subject",
      render: (ticket) => (
        <span>
          <span className="font-medium text-navy">{ticket.subject}</span>
          <span className="mt-0.5 block max-w-md text-xs text-slate-500">{ticket.message}</span>
        </span>
      ),
    },
    { key: "channel", header: "Channel", render: (ticket) => <Badge tone="neutral" size="sm">{ticket.channel}</Badge> },
    {
      key: "status",
      header: "Status",
      render: (ticket) => <Badge tone={ticket.status === "open" ? "warning" : ticket.status === "resolved" ? "success" : "neutral"} size="sm">{ticket.status}</Badge>,
    },
    { key: "created", header: "Received", render: (ticket) => <span className="text-xs text-slate-500">{formatDateTime(ticket.createdAt)}</span> },
  ];

  const webhookColumns: Column<WebhookLogEntry>[] = [
    { key: "endpoint", header: "Endpoint", render: (entry) => <span className="font-mono text-xs">{entry.endpoint}</span> },
    { key: "event", header: "Event", render: (entry) => <span className="text-xs">{entry.event}</span> },
    {
      key: "status",
      header: "Result",
      render: (entry) => (
        <Badge tone={entry.status === "accepted" ? "success" : entry.status === "rejected" ? "danger" : "warning"} size="sm">
          {entry.status}
        </Badge>
      ),
    },
    { key: "detail", header: "Detail", render: (entry) => <span className="text-xs text-slate-500">{entry.detail ?? "—"}</span> },
    { key: "created", header: "Time", render: (entry) => <span className="text-xs text-slate-500">{formatDateTime(entry.createdAt)}</span> },
  ];

  return (
    <div className="grid gap-8">
      <header>
        <p className="eyebrow">Inbox</p>
        <h1 className="mt-2 text-2xl sm:text-3xl">Messages & automation log</h1>
        <p className="mt-1 text-sm text-slate-600">
          Contact form submissions become support tickets here. The automation log shows every inbound n8n webhook and
          whether it was accepted or rejected.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg">Support tickets</h2>
        <DataTable
          columns={ticketColumns}
          rows={tickets}
          rowKey={(ticket) => ticket.id}
          empty={<EmptyState title="No tickets" description="Contact form enquiries appear here as tickets." />}
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg">Webhook log</h2>
        <DataTable
          columns={webhookColumns}
          rows={webhooks}
          rowKey={(entry) => entry.id}
          empty={<EmptyState title="No webhook activity" description="Inbound automation calls are logged here for 30 days (configurable)." />}
        />
      </section>
    </div>
  );
}
