"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Defers Vercel Analytics + SpeedInsights mount until the browser is idle so
// neither of their bundles competes with hydration for main-thread time on
// mobile. Same idle-load shape as ClarityInit — proven safe and analytics-
// complete in this codebase.
export default function DeferredVercelAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cb = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(cb, { timeout: 2500 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const id = window.setTimeout(cb, 1500);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
