"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

// Lazy-load the heavy checker only when an h6 barter-check marker is present.
const BarterDealChecker = dynamic(
  () => import("@/app/blogs/tools/barter-deal-checker/BarterDealChecker"),
  { ssr: false }
);

/**
 * BarterDealCheckerInjector
 *
 * Scans .wordpress-content for `<h6 data-section-marker="barter-check">` markers
 * (set server-side by processH6Markers in lib/content-processor.ts), removes
 * each marker, and mounts <BarterDealChecker embed /> in its place via a React
 * portal.
 *
 * Authors trigger it by writing `<h6>barter deal checker</h6>` (or "barter
 * check", "barter deal calculator", etc.) in WordPress.
 */
export default function BarterDealCheckerInjector() {
  const [containers, setContainers] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const wpContent = document.querySelector(".wordpress-content");
    if (!wpContent) return;

    const markers = Array.from(
      wpContent.querySelectorAll<HTMLElement>(
        'h6[data-section-marker="barter-check"]'
      )
    );
    if (markers.length === 0) return;

    const created: HTMLElement[] = [];
    for (const h6 of markers) {
      const container = document.createElement("div");
      // not-prose keeps the article's prose rules (bullets, heading sizes,
      // justified text) out of the tool — see wordpress-content.css.
      container.className = "barter-check-embed-container not-prose";
      container.setAttribute("data-section-type", "barter-check");
      h6.parentNode?.insertBefore(container, h6);
      h6.remove();
      created.push(container);
    }
    setContainers(created);
  }, []);

  return (
    <>
      {containers.map((node, i) =>
        createPortal(<BarterDealChecker embed />, node, `barter-check-${i}`)
      )}
    </>
  );
}
