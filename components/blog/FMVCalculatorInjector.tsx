"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

// Lazy-load the heavy calculator only when an h6 fmv-calc marker is present.
const FMVCalculator = dynamic(
  () => import("@/app/blogs/tools/fmv-calculator/FMVCalculator"),
  { ssr: false }
);

/**
 * FMVCalculatorInjector
 *
 * Scans .wordpress-content for `<h6 data-section-marker="fmv-calc">` markers
 * (set server-side by processH6Markers in lib/content-processor.ts), removes
 * each marker, and mounts <FMVCalculator embed /> in its place via a React
 * portal.
 *
 * Authors trigger it by writing `<h6>fmv calculator</h6>` (or "fmv", "barter
 * fmv", etc.) in WordPress.
 */
export default function FMVCalculatorInjector() {
  const [containers, setContainers] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const wpContent = document.querySelector(".wordpress-content");
    if (!wpContent) return;

    const markers = Array.from(
      wpContent.querySelectorAll<HTMLElement>(
        'h6[data-section-marker="fmv-calc"]'
      )
    );
    if (markers.length === 0) return;

    const created: HTMLElement[] = [];
    for (const h6 of markers) {
      const container = document.createElement("div");
      container.className = "fmv-calc-embed-container";
      container.setAttribute("data-section-type", "fmv-calc");
      h6.parentNode?.insertBefore(container, h6);
      h6.remove();
      created.push(container);
    }
    setContainers(created);
  }, []);

  return (
    <>
      {containers.map((node, i) =>
        createPortal(<FMVCalculator embed />, node, `fmv-calc-${i}`)
      )}
    </>
  );
}
