import { describe, expect, it } from "vitest";
import { resolvePaymentTransition } from "@/lib/orders/payment";

/**
 * Guards the money rules in Build Spec §30:
 * automated and customer events may only move an order *towards* verification.
 */
describe("payment transition rules", () => {
  it("moves a fresh order into verification", () => {
    const result = resolvePaymentTransition({ paymentStatus: "pending", status: "awaiting_payment" });
    expect(result.changed).toBe(true);
    expect(result.paymentStatus).toBe("submitted");
    expect(result.status).toBe("payment_verification");
  });

  it("lets a customer resubmit after a rejection or an adjustment request", () => {
    for (const paymentStatus of ["rejected", "adjustment_required"] as const) {
      const result = resolvePaymentTransition({ paymentStatus, status: "pending_information" });
      expect(result.changed, paymentStatus).toBe(true);
      expect(result.paymentStatus).toBe("submitted");
    }
  });

  it("never pushes a verified payment backwards", () => {
    const result = resolvePaymentTransition({ paymentStatus: "verified", status: "confirmed" });
    expect(result.changed).toBe(false);
    expect(result.paymentStatus).toBe("verified");
    expect(result.status).toBe("confirmed");
  });

  it("never pulls an order out of production or delivery", () => {
    for (const status of ["in_production", "revision_1", "revision_2", "final_review", "delivered", "completed"] as const) {
      const result = resolvePaymentTransition({ paymentStatus: "verified", status });
      expect(result.changed, status).toBe(false);
      expect(result.status).toBe(status);
    }
  });

  it("does not revive a cancelled order", () => {
    const result = resolvePaymentTransition({ paymentStatus: "submitted", status: "cancelled" });
    expect(result.changed).toBe(false);
    expect(result.status).toBe("cancelled");
  });

  it("only an explicit verification marks the payment verified", () => {
    const verified = resolvePaymentTransition({ paymentStatus: "submitted", status: "payment_verification" }, { verified: true });
    expect(verified.paymentStatus).toBe("verified");
    expect(verified.status).toBe("confirmed");

    // Submitting a reference is never enough on its own.
    expect(resolvePaymentTransition({ paymentStatus: "pending", status: "awaiting_payment" }).paymentStatus).not.toBe("verified");
  });

  it("applies the same rule to an automated notification and to a customer message", () => {
    const order = { paymentStatus: "verified" as const, status: "confirmed" as const };
    expect(resolvePaymentTransition(order, { verified: false }).changed).toBe(false);
    expect(resolvePaymentTransition(order).changed).toBe(false);
    // ...but a human/system verification is always allowed to confirm.
    expect(resolvePaymentTransition(order, { verified: true }).paymentStatus).toBe("verified");
  });
});
