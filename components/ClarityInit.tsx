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
  }, []);
  return null;
}
