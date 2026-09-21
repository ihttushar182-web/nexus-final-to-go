"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track, type AnalyticsEvent, type AnalyticsProperties } from "@/lib/analytics/track";
import type { ReactNode } from "react";

/** A next/link that also emits an analytics event — keeps pages free of click handlers. */
export function TrackedLink({
  href,
  event,
  properties,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  event: AnalyticsEvent;
  properties?: AnalyticsProperties;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={() => track(event, properties)}>
      {children}
    </Link>
  );
}

/** Fires a single event when mounted — used for product_view. */
export function ViewTracker({ event, properties }: { event: AnalyticsEvent; properties?: AnalyticsProperties }) {
  useEffect(() => {
    track(event, properties);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
  return null;
}
