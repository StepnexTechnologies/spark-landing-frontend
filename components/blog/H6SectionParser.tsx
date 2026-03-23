"use client";

import { useEffect, useState } from "react";
import {
  SECTION_REGISTRY,
  normalizeMarkerText,
  findSectionConfig,
} from "./section-registry";

/**
 * H6SectionParser
 *
 * Centralized parser that runs FIRST (before all other enhancers).
 * Scans all <h6> tags in .wordpress-content, matches them against the
 * section registry, and wraps each section's content in a <div> with
 * data-section-type and the configured CSS class.
 */
export default function H6SectionParser() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      parseH6Sections();
    }, 50);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

function parseH6Sections() {
  const wordpressContent = document.querySelector(".wordpress-content");
  if (!wordpressContent) return;

  // Track how many times each type has been found (for allowMultiple check)
  const typeCounts = new Map<string, number>();

  // Get all H6 elements — snapshot into array since we'll be modifying DOM
  const h6Elements = Array.from(wordpressContent.querySelectorAll("h6"));

  for (const h6 of h6Elements) {
    // Skip if already processed by this parser
    if (h6.classList.contains("h6-section-parsed")) continue;

    // Try to get section type from server-side data attribute first
    let config;
    const serverMarker = h6.getAttribute("data-section-marker");
    if (serverMarker) {
      config = SECTION_REGISTRY.find((c) => c.type === serverMarker);
    }

    // Fallback: parse the text content
    if (!config) {
      const rawText = h6.textContent?.trim() || "";
      config = findSectionConfig(rawText);
    }

    if (!config) continue;

    // Check allowMultiple
    const count = typeCounts.get(config.type) || 0;
    if (!config.allowMultiple && count > 0) {
      // Still hide the duplicate marker
      h6.classList.add("h6-section-marker-hidden");
      h6.classList.add("h6-section-parsed");
      continue;
    }
    typeCounts.set(config.type, count + 1);

    // Collect following sibling elements.
    // The first heading (H1-H5) after the H6 is the section title — include it.
    // Stop at any subsequent heading (H1-H6) or block-level div (WordPress block container).
    const elementsToWrap: Element[] = [h6];
    let currentElement = h6.nextElementSibling;
    let includedSectionTitle = false;
    const isCTASection = config.type.startsWith("cta-");

    while (currentElement) {
      const tagName = currentElement.tagName.toUpperCase();
      const isHeading = /^H[1-6]$/.test(tagName);

      if (tagName === "H6") {
        // Always stop at another H6 marker
        break;
      }

      if (isHeading) {
        if (!includedSectionTitle) {
          // First heading after H6 is the section title — include it
          includedSectionTitle = true;
          elementsToWrap.push(currentElement);
          currentElement = currentElement.nextElementSibling;
          continue;
        }
        // Any subsequent heading — stop here
        break;
      }

      // For CTA sections, only collect <p> elements after the title.
      // Stop at any div/block container to avoid swallowing following sections.
      if (isCTASection && includedSectionTitle && tagName !== "P") {
        break;
      }

      elementsToWrap.push(currentElement);
      currentElement = currentElement.nextElementSibling;
    }

    // Only wrap if there's content after the H6
    if (elementsToWrap.length > 1) {
      // Create wrapper div
      const wrapper = document.createElement("div");
      wrapper.className = config.wrapperClass;
      wrapper.setAttribute("data-section-type", config.type);

      // Insert wrapper before the H6
      h6.parentNode?.insertBefore(wrapper, h6);

      // Move all elements into wrapper
      for (const el of elementsToWrap) {
        wrapper.appendChild(el);
      }
    }

    // Mark as parsed and hide the H6 marker
    h6.classList.add("h6-section-parsed");
    h6.classList.add("h6-section-marker-hidden");
  }
}
