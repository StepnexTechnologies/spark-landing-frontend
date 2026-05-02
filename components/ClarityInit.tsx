"use client";

import { useEffect } from "react";
import { setUserProperties } from "@/lib/analytics/track";

const PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "dwiqlxestpk";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

function computePageType(path: string): string {
  if (path === "/") return "home";
  if (path.startsWith("/blogs") || path.startsWith("/blog")) return "blog";
  if (path.startsWith("/creator")) return "creator";
  if (path.startsWith("/legal")) return "legal";
  if (path === "/contact") return "contact";
  if (path === "/thank-you") return "thank-you";
  if (path === "/about") return "about";
  return "other";
}

function gatherTags(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const tags: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) tags[key] = value;
  }
  if (params.get("fbclid")) tags.traffic_type = "meta_paid";
  else if (params.get("gclid")) tags.traffic_type = "google_paid";
  tags.page_type = computePageType(window.location.pathname);
  return tags;
}

export default function ClarityInit() {
  useEffect(() => {
    const tags = gatherTags();

    // Defer Clarity's bundle download + init until the browser is idle so
    // it doesn't compete with hydration for main-thread time. Clarity
    // captures session activity from the moment it initializes; a 1-3s
    // delay just trims the very start of the recording (which is rarely
    // useful anyway).
    const loadClarity = () => {
      import("@microsoft/clarity")
        .then(({ default: Clarity }) => {
          Clarity.init(PROJECT_ID);
          Clarity.consentV2({
            ad_Storage: "granted",
            analytics_Storage: "granted",
          });
        })
        .finally(() => {
          setUserProperties(tags);
        });
    };

    if (typeof window === "undefined") return;

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(loadClarity, { timeout: 3000 });
      return () => window.cancelIdleCallback?.(handle);
    }

    // Safari/older browsers: setTimeout fallback. 1500ms is past the typical
    // hydration finish on slow 4G.
    const id = window.setTimeout(loadClarity, 1500);
    return () => window.clearTimeout(id);
  }, []);
  return null;
}
