import { describe, expect, it } from "vitest";
import {
  auditSubmissionSchema,
  contactSchema,
  leadSchema,
  orderSchema,
  paymentSubmissionSchema,
  fieldErrors,
} from "@/lib/validation/schemas";
import { layerIds } from "@/data/layers";

const validAudit = {
  businessName: "Rahman Traders",
  businessStage: "growing",
  teamSize: "3-5",
  answers: Object.fromEntries(layerIds.map((id) => [id, "partial"])),
  biggestProblem: "visibility",
  goal: "leads",
  name: "Rahman",
  email: "Owner@Example.com ",
  whatsapp: "+8801712345678",
};

describe("server-side validation (§43)", () => {
  it("accepts a complete audit submission and normalises the email", () => {
    const parsed = auditSubmissionSchema.parse(validAudit);
    expect(parsed.email).toBe("owner@example.com");
    expect(Object.keys(parsed.answers)).toHaveLength(6);
  });

  it("requires an answer for every one of the six layers", () => {
    const incomplete = { ...validAudit, answers: { identity: "yes" } };
    expect(auditSubmissionSchema.safeParse(incomplete).success).toBe(false);
  });

  it("rejects an invalid answer value", () => {
    const bad = { ...validAudit, answers: { ...validAudit.answers, control: "maybe" } };
    expect(auditSubmissionSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects a malformed email and a too-short phone number", () => {
    expect(auditSubmissionSchema.safeParse({ ...validAudit, email: "not-an-email" }).success).toBe(false);
    expect(auditSubmissionSchema.safeParse({ ...validAudit, whatsapp: "123" }).success).toBe(false);
  });

  it("returns flat field errors for the client to render", () => {
    const result = auditSubmissionSchema.safeParse({ ...validAudit, businessName: "", email: "nope" });
    expect(result.success).toBe(false);
    if (result.success) return;
    const errors = fieldErrors(result.error);
    expect(Object.keys(errors).length).toBeGreaterThan(0);
    expect(errors.email).toBeTruthy();
  });

  it("keeps the contact form and lead contract aligned", () => {
    const contact = {
      name: "Karim",
      email: "karim@example.com",
      phone: "01712345678",
      subject: "Business profile",
      message: "I need a business profile for my shop.",
    };
    expect(contactSchema.safeParse(contact).success).toBe(true);
    // A contact submission is also a valid lead — one CRM record, one shape.
    expect(leadSchema.safeParse(contact).success).toBe(true);
    expect(leadSchema.safeParse({ ...contact, email: "bad" }).success).toBe(false);
    // A message shorter than ten characters is not an enquiry we can act on.
    expect(contactSchema.safeParse({ ...contact, message: "hi" }).success).toBe(false);
  });

  it("accepts an order by product slug and never trusts a client-supplied price", () => {
    const order = {
      customerName: "Karim",
      customerEmail: "karim@example.com",
      customerPhone: "01712345678",
      productSlug: "professional-business-starter",
      quantity: 1,
    };
    expect(orderSchema.safeParse(order).success).toBe(true);
    expect(orderSchema.safeParse({ ...order, productSlug: "" }).success).toBe(false);
    expect(orderSchema.safeParse({ ...order, quantity: 0 }).success).toBe(false);
    // There is no price field in the public contract at all — /api/orders reads the
    // price from /data/products.ts, so a tampered client cannot change what is charged.
    expect(Object.keys(orderSchema.shape)).not.toContain("unitPrice");
    expect(Object.keys(orderSchema.shape)).not.toContain("total");
    expect(Object.keys(orderSchema.shape)).not.toContain("items");
  });

  it("treats a customer payment message as a reference only, never an approval", () => {
    const submission = { orderId: "o1", reference: "TRX123456", amount: 999, method: "bKash" };
    expect(paymentSubmissionSchema.safeParse(submission).success).toBe(true);
    expect(paymentSubmissionSchema.safeParse({ ...submission, reference: "12" }).success).toBe(false);
    // The customer-facing payload exposes no payment-status field, so a client cannot
    // ask for "verified" — only an authenticated admin action or the n8n webhook can.
    expect(Object.keys(paymentSubmissionSchema.shape)).not.toContain("paymentStatus");
  });
});
