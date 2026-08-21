"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { Manrope, Roboto } from "next/font/google";

// Lazy-load the heavy audit tool only when an h6 consent-audit marker is present.
const CreatorAIConsentAudit = dynamic(
  () => import("@/app/blogs/tools/creator-ai-consent-audit/CreatorAIConsentAudit"),
  { ssr: false }
);

// The tool styles itself against --font-manrope / --font-roboto-tool, which the
// standalone route's page.tsx provides. Blog posts don't, so the injector loads
// the same faces and puts the variable classes on the portal container.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
  variable: "--font-manrope",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto-tool",
});

/**
 * ConsentAuditInjector
 *
 * Scans .wordpress-content for `<h6 data-section-marker="consent-audit">`
 * markers (set server-side by processH6Markers in lib/content-processor.ts),
 * removes each marker, and mounts <CreatorAIConsentAudit embed /> in its place
 * via a React portal.
 *
 * Authors trigger it by writing `<h6>ai consent audit</h6>` (or "consent
 * audit", "creator ai consent audit", etc.) in WordPress.
 */
export default function ConsentAuditInjector() {
  const [containers, setContainers] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const wpContent = document.querySelector(".wordpress-content");
    if (!wpContent) return;

    const markers = Array.from(
      wpContent.querySelectorAll<HTMLElement>(
        'h6[data-section-marker="consent-audit"]'
      )
    );
    if (markers.length === 0) return;

    const created: HTMLElement[] = [];
    for (const h6 of markers) {
      const container = document.createElement("div");
      // not-prose keeps the article's prose rules (bullets, heading sizes,
      // justified text) out of the tool — see wordpress-content.css.
      container.className = `consent-audit-embed-container not-prose ${manrope.variable} ${roboto.variable}`;
      container.setAttribute("data-section-type", "consent-audit");
      h6.parentNode?.insertBefore(container, h6);
      h6.remove();
      created.push(container);
    }
    setContainers(created);
  }, []);

  return (
    <>
      {containers.map((node, i) =>
        createPortal(<CreatorAIConsentAudit embed />, node, `consent-audit-${i}`)
      )}
    </>
  );
}
