"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/analytics/track";

// First page_view fires inline from gtag-init pre-hydration; this hook handles SPA navs only.
export function usePageViewTracking(): void {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    const qs = searchParams?.toString();
    const fullPath = qs ? `${pathname}?${qs}` : pathname;
    if (lastPath.current === fullPath) return;
    const isFirst = lastPath.current === null;
    lastPath.current = fullPath;
    if (isFirst) return;
    trackPageView(fullPath);
  }, [pathname, searchParams]);
}

export default function PageViewTracker(): null {
  usePageViewTracking();
  return null;
}
