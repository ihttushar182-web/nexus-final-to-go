"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track, type AnalyticsProperties } from "@/lib/analytics/track";

/**
 * Analytics bootstrap (Build Spec §48).
 * Records a page_view on every route change and exposes a global hook so any future
 * provider (GA4, Plausible, custom) can subscribe without touching components.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.nlTrack) {
      window.nlTrack = (event: string, properties?: AnalyticsProperties) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[analytics]", event, properties ?? {});
        }
      };
    }
    track("page_view", { page: pathname });
  }, [pathname]);

  return null;
}
