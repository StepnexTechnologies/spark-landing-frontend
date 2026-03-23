"use client";

import { useEffect, useState } from "react";

/**
 * PromoBannerInjector
 *
 * Applies CTA banner styling classes to children within H6-parsed
 * CTA sections (data-section-type="cta-1" / "cta-2").
 * Detects button paragraph by looking for links with arrow or CTA keywords.
 */
export default function PromoBannerInjector() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      styleCTASections();
    }, 150);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

function styleCTASections() {
  const ctaSections = document.querySelectorAll(
    '[data-section-type="cta-1"], [data-section-type="cta-2"]'
  );

  ctaSections.forEach((section) => {
    if (section.querySelector(".cta-banner-title")) return;

    const children = Array.from(section.children);
    let foundTitle = false;
    let foundSubtitle = false;
    let foundLink = false;

    for (const child of children) {
      const tagName = child.tagName.toUpperCase();

      // Skip the hidden H6 marker
      if (tagName === "H6") continue;

      // First heading of any type → title
      if (!foundTitle && (tagName === "H2" || tagName === "H3" || tagName === "H4" || tagName === "H5")) {
        child.classList.add("cta-banner-title");
        foundTitle = true;
      } else if (tagName === "P") {
        const link = child.querySelector("a");
        const paragraphText = child.textContent?.trim() || "";

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
              // Replace → text with Arrow_navigate.png image
              replaceArrowWithImage(link);
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

function replaceArrowWithImage(link: HTMLAnchorElement) {
  // Remove → character from text nodes
  const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }
  textNodes.forEach((textNode) => {
    if (textNode.textContent?.includes("→")) {
      textNode.textContent = textNode.textContent.replace(/\s*→\s*/g, " ");
    }
  });

  // Append arrow image if not already present
  if (!link.querySelector('img[alt="arrow"]')) {
    const img = document.createElement("img");
    img.src = "/Arrow_navigate.png";
    img.alt = "arrow";
    img.className = "cta-arrow-icon";
    link.appendChild(img);
  }
}
