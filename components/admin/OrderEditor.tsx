"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Alert } from "@/components/ui/StateMessage";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { orderStatusSchema, paymentStatusSchema } from "@/lib/validation/schemas";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

/**
 * Order + payment control.
 * Payment verification is a deliberate, human action here — the customer-facing API can
 * never set `verified` (Build Spec §30).
 */
export function OrderEditor({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [notes, setNotes] = useState(order.notes ?? "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status, paymentStatus, notes }),
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
      <h2 className="flex items-center gap-2 text-lg">
        <ShieldCheck className="size-4 text-nexus" aria-hidden />
        Order & payment control
      </h2>

      {state === "saved" ? (
        <Alert tone="success" className="mt-4">
          Order updated. A payment event was recorded with your staff identity.
        </Alert>
      ) : null}
      {error ? (
        <Alert tone="danger" className="mt-4">
          {error}
        </Alert>
      ) : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Order status" htmlFor="order-status">
          <Select id="order-status" value={status} onChange={(event) => setStatus(event.target.value as OrderStatus)}>
            {orderStatusSchema.options.map((item) => (
              <option key={item} value={item}>
                {item.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="Payment status"
          htmlFor="order-payment"
          hint="Only verify after confirming the bKash transaction in the merchant statement."
        >
          <Select
            id="order-payment"
            value={paymentStatus}
            onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus)}
          >
            {paymentStatusSchema.options.map((item) => (
              <option key={item} value={item}>
                {item.replace(/_/g, " ")}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Internal notes" htmlFor="order-notes" className="sm:col-span-2">
          <Input id="order-notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>
      </div>

      {paymentStatus === "verified" && order.paymentStatus !== "verified" ? (
        <Alert tone="warning" className="mt-4">
          You are marking this payment as verified. This is a human decision — confirm the transaction reference{" "}
          <strong>{order.paymentReference ?? "—"}</strong> against the merchant statement first.
        </Alert>
      ) : null}

      <Button type="submit" className="mt-5" disabled={state === "saving"}>
        {state === "saving" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
        {state === "saving" ? "Saving…" : "Save order"}
      </Button>
    </form>
  );
}
