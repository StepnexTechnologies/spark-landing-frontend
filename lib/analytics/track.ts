import { trackEvent as orTrack } from "@/lib/openreplay";

export type EventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: string, params: EventPayload = {}): void {
  if (typeof window === "undefined") return;
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) cleaned[key] = value;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...cleaned });
  orTrack(event, cleaned);
}

export function trackPageView(path: string, title?: string): void {
  track("page_view", {
    page_path: path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : ""),
  });
}
