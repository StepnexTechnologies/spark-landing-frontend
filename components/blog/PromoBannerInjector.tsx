"use client";

import { useEffect, useState } from "react";

/**
 * PromoBannerInjector
 *
 * Finds CTA-1 and CTA-2 sections in WordPress content and wraps them
 * with styling classes. CSS handles the visual transformation.
 */
export default function PromoBannerInjector() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      wrapCTASections();
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

function wrapCTASections() {
  const wordpressContent = document.querySelector(".wordpress-content");
  if (!wordpressContent) return;

  // Find all H6 elements
  const h6Elements = wordpressContent.querySelectorAll("h6");

  h6Elements.forEach((h6) => {
    // Skip if already processed (has the hidden class)
    if (h6.classList.contains("cta-banner-hidden")) return;

    const text = h6.textContent?.trim().toUpperCase().replace(/[-\s]/g, "") || "";

    // Check if this is CTA1 or CTA2
    if (text === "CTA1" || text === "CTA2") {
      // Create wrapper div
      const wrapper = document.createElement("div");
      wrapper.className = "cta-banner-section";

      // Collect elements to wrap: H6, H3, P (subtitle), P (with link)
      const elementsToWrap: Element[] = [h6];
      let currentElement = h6.nextElementSibling;
      let foundH3 = false;
      let foundSubtitle = false;
      let foundLink = false;

      while (currentElement && (!foundH3 || !foundSubtitle || !foundLink)) {
        const tagName = currentElement.tagName.toUpperCase();

        // Stop at another CTA section or major heading
        if (tagName === "H6" || tagName === "H2") {
          break;
        }

        if (tagName === "H3" && !foundH3) {
          currentElement.classList.add("cta-banner-title");
          elementsToWrap.push(currentElement);
          foundH3 = true;
        } else if (tagName === "P") {
          const link = currentElement.querySelector("a");
          const paragraphText = currentElement.textContent?.trim() || "";

          // Check if this is a CTA button paragraph
          const isCTAButton =
            link &&
            (paragraphText.includes("→") ||
              paragraphText.toLowerCase().includes("get started") ||
              paragraphText.toLowerCase().includes("try free") ||
              paragraphText.toLowerCase().includes("talk to"));

          if (isCTAButton && !foundLink) {
            currentElement.classList.add("cta-banner-button");
            if (link) {
              link.classList.add("cta-banner-link");
            }
            elementsToWrap.push(currentElement);
            foundLink = true;
          } else if (!foundSubtitle && foundH3) {
            currentElement.classList.add("cta-banner-subtitle");
            elementsToWrap.push(currentElement);
            foundSubtitle = true;
          }
        }

        currentElement = currentElement.nextElementSibling;
      }

      // Only wrap if we found at least H3
      if (foundH3 && elementsToWrap.length > 1) {
        // Insert wrapper before the first element
        h6.parentNode?.insertBefore(wrapper, h6);

        // Move all elements into wrapper
        elementsToWrap.forEach((el) => {
          wrapper.appendChild(el);
        });

        // Hide the H6 identifier
        h6.classList.add("cta-banner-hidden");
      }
    }
  });
}
