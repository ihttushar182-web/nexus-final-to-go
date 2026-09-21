/**
 * Analytics abstraction (Build Spec §48 / §49).
 *
 * One function, one event vocabulary. The transport is replaceable: today events are
 * pushed to `dataLayer` (GTM-compatible) and to a `window` hook that any provider can
 * subscribe to. Sensitive data is never included.
 */

export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "audit_start"
  | "audit_step_complete"
  | "audit_complete"
  | "whatsapp_click"
  | "messenger_click"
  | "contact_submit"
  | "lead_created"
  | "order_intent"
  | "payment_submitted"
  | "cta_click";

export interface AnalyticsProperties {
  product_id?: string;
  product_name?: string;
  page?: string;
  source?: string;
  cta_location?: string;
  step?: number;
  business_stage?: string;
  priority_layer?: string;
  layer?: string;
  value?: number;
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    nlTrack?: (event: string, properties?: AnalyticsProperties) => void;
  }
}

export function track(event: AnalyticsEvent, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    ...properties,
    ...(process.env.NEXT_PUBLIC_ANALYTICS_ID ? { analytics_id: process.env.NEXT_PUBLIC_ANALYTICS_ID } : {}),
    ts: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  window.nlTrack?.(event, properties);
}

export function trackPageView(path: string) {
  track("page_view", { page: path });
}
