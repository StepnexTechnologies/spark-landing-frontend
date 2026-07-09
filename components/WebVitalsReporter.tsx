"use client";

import { useEffect } from "react";
import type { Metric } from "web-vitals";

function sendToGA(metric: Metric) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag;

  gtag("event", metric.name, {
    value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_rating: metric.rating,
    metric_delta: Math.round(metric.name === "CLS" ? metric.delta * 1000 : metric.delta),
    // Attribution: element selector for LCP/INP, interaction type for INP
    metric_attribution: JSON.stringify(
      (metric as Metric & { attribution?: Record<string, unknown> }).attribution ?? {}
    ).slice(0, 200),
    non_interaction: true,
  });
}

export default function WebVitalsReporter() {
  useEffect(() => {
    import("web-vitals/attribution").then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
      onLCP(sendToGA);
      onINP(sendToGA);
      onCLS(sendToGA);
      onFCP(sendToGA);
      onTTFB(sendToGA);
    });
  }, []);

  return null;
}
