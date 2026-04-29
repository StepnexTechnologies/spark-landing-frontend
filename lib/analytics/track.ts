export type EventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

type GtagFn = (...args: unknown[]) => void;
type ClarityFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: GtagFn;
    clarity?: ClarityFn;
  }
}

function clean(params: EventPayload): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) out[key] = value;
  }
  return out;
}

// Dual-fire so direct GA4 works without a GTM-side GA4 tag. The two
// dataLayer formats (flat vs. arguments) keep GA4 and GTM from double-counting.
export function track(event: string, params: EventPayload = {}): void {
  if (typeof window === "undefined") return;
  const cleaned = clean(params);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...cleaned });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, cleaned);
  }

  if (typeof window.clarity === "function") {
    window.clarity("event", event);
  }
}

// Like track(), plus marks the Clarity session as high-priority so it bypasses
// recording sampling. Use for form submits, CTA clicks, and other conversions.
export function trackConversion(
  event: string,
  params: EventPayload = {},
): void {
  track(event, params);
  if (typeof window === "undefined") return;
  if (typeof window.clarity === "function") {
    window.clarity("upgrade", event);
  }
}

// Set user-level dimensions across all three trackers. GA4 surfaces these as
// user_properties (filterable in reports); GTM tags can read them off dataLayer;
// Clarity exposes them as session tags for filtering replays.
export function setUserProperties(props: Record<string, string>): void {
  if (typeof window === "undefined") return;
  if (Object.keys(props).length === 0) return;

  if (typeof window.gtag === "function") {
    window.gtag("set", "user_properties", props);
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "user_properties_set", ...props });

  if (typeof window.clarity === "function") {
    for (const [key, value] of Object.entries(props)) {
      window.clarity("set", key, value);
    }
  }
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined") return;
  track("page_view", {
    page_path: path,
    page_location: window.location.origin + path,
    page_title: title ?? document.title,
  });
}
