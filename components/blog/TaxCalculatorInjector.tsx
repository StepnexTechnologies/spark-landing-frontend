"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

// Lazy-load the heavy calculator only when an h6 tax-calc marker is present.
const CreatorTaxCalculator = dynamic(
  () => import("@/app/blogs/tools/creator-tax-calculator/CreatorTaxCalculator"),
  { ssr: false }
);

/**
 * TaxCalculatorInjector
 *
 * Scans .wordpress-content for `<h6 data-section-marker="tax-calc">` markers
 * (set server-side by processH6Markers in lib/content-processor.ts), removes
 * each marker, and mounts <CreatorTaxCalculator embed /> in its place via a
 * React portal.
 *
 * Authors trigger it by writing `<h6>tax-calc</h6>` (or "tax calculator", etc.)
 * in WordPress.
 */
export default function TaxCalculatorInjector() {
  const [containers, setContainers] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const wpContent = document.querySelector(".wordpress-content");
    if (!wpContent) return;

    const markers = Array.from(
      wpContent.querySelectorAll<HTMLElement>(
        'h6[data-section-marker="tax-calc"]'
      )
    );
    if (markers.length === 0) return;

    const created: HTMLElement[] = [];
    for (const h6 of markers) {
      const container = document.createElement("div");
      container.className = "tax-calc-embed-container";
      container.setAttribute("data-section-type", "tax-calc");
      h6.parentNode?.insertBefore(container, h6);
      h6.remove();
      created.push(container);
    }
    setContainers(created);
  }, []);

  return (
    <>
      {containers.map((node, i) =>
        createPortal(<CreatorTaxCalculator embed />, node, `tax-calc-${i}`)
      )}
    </>
  );
}
