"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";

/**
 * Route-level error boundary (Build Spec §57).
 * A friendly, actionable message — never a silent failure or a raw stack trace.
 */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[route-error]", error.message, error.digest ?? "");
  }, [error]);

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow justify-center">Error</p>
        <h1 className="mt-3 text-2xl sm:text-3xl">কিছু একটা ভুল হয়েছে</h1>
        <p className="mt-4 text-slate-600">
          পেজটি লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন — সমস্যা থাকলে WhatsApp-এ জানান, আমাদের টিম
          কর্মঘণ্টায় উত্তর দেবে।
        </p>
        {error.digest ? <p className="mt-3 font-mono text-xs text-slate-400">Ref: {error.digest}</p> : null}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={reset}>
            আবার চেষ্টা করুন
          </Button>
          <ButtonLink href="/" size="lg" variant="outline">
            হোমপেজে ফিরে যান
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
