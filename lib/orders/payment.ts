import type { Order, OrderStatus, PaymentStatus } from "@/types";

/**
 * Payment state machine (Build Spec §30).
 *
 * The rule that matters: **a verified payment is only changeable by a human.**
 * A customer resubmitting their transaction ID, or an automation replaying an old
 * "payment submitted" notification, must never push an order backwards out of
 * `verified` / confirmed / production. Without this guard a duplicate message can
 * silently un-verify money that finance already reconciled.
 *
 * Both the customer endpoint and the n8n webhook go through here, so the rule exists
 * once (Build Spec §62 — reusable abstractions, no duplicated business logic).
 */

const ADVANCED_STATUSES: OrderStatus[] = [
  "confirmed",
  "in_production",
  "revision_1",
  "revision_2",
  "final_review",
  "delivered",
  "after_sales",
  "completed",
];

export interface PaymentTransitionInput {
  /** True only when a trusted system or a human has confirmed the money arrived. */
  verified?: boolean;
}

export interface PaymentTransition {
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  /** False when the order has already moved past this point and must not regress. */
  changed: boolean;
}

export function resolvePaymentTransition(
  order: Pick<Order, "paymentStatus" | "status">,
  input: PaymentTransitionInput = {},
): PaymentTransition {
  if (input.verified) {
    return { paymentStatus: "verified", status: "confirmed", changed: true };
  }

  const alreadyVerified = order.paymentStatus === "verified";
  const alreadyAdvanced = ADVANCED_STATUSES.includes(order.status);
  const alreadyClosed = order.status === "cancelled";

  if (alreadyVerified || alreadyAdvanced || alreadyClosed) {
    return { paymentStatus: order.paymentStatus, status: order.status, changed: false };
  }

  // Pending, submitted, rejected or adjustment-required: a fresh reference is welcome.
  return { paymentStatus: "submitted", status: "payment_verification", changed: true };
}
