"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { track, type EventPayload } from "@/lib/analytics/track";

interface Options {
  event?: string;
  threshold?: number;
  rootMargin?: string;
  extraParams?: EventPayload;
}

export function useSectionViewTracking(
  ref: RefObject<HTMLElement | null>,
  sectionName: string,
  options: Options = {},
): void {
  const fired = useRef(false);
  const {
    event = "earn_section_view",
    threshold = 0.35,
    rootMargin = "0px",
    extraParams,
  } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node || fired.current) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            track(event, { section: sectionName, ...(extraParams ?? {}) });
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, sectionName, event, threshold, rootMargin, extraParams]);
}
