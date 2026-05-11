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
      if (
        !foundTitle &&
        (tagName === "H2" ||
          tagName === "H3" ||
          tagName === "H4" ||
          tagName === "H5")
      ) {
        child.classList.add("cta-banner-title");
        foundTitle = true;
        continue;
      }

      if (tagName !== "P") continue;

      const link = child.querySelector("a");
      const paragraphText = child.textContent?.trim() || "";

      // Pattern: <p><strong>Title</strong> <a>Download</a></p>
      // Split the paragraph: bold text becomes the CTA title, link becomes the button.
      if (link && !foundLink) {
        const strongEl = child.querySelector("strong, b");
        const linkText = link.textContent?.trim() || "";
        const restText = paragraphText.replace(linkText, "").trim();

        if (strongEl && restText.length > 0) {
          if (!foundTitle) {
            const titleEl = document.createElement("p");
            titleEl.className = "cta-banner-title";
            titleEl.innerHTML = strongEl.innerHTML;
            child.parentNode?.insertBefore(titleEl, child);
            foundTitle = true;
          }
          child.innerHTML = "";
          child.appendChild(link);
          child.classList.add("cta-banner-button");
          link.classList.add("cta-banner-link");
          replaceArrowWithImage(link as HTMLAnchorElement);
          foundLink = true;
          continue;
        }
      }

      // Pattern: <p><strong>Title</strong></p> (with the link in a sibling P)
      // Treat a bold-only paragraph as the CTA title.
      if (!foundTitle && !link) {
        const strongEl = child.querySelector("strong, b");
        if (strongEl && strongEl.textContent?.trim() === paragraphText) {
          child.classList.add("cta-banner-title");
          foundTitle = true;
          continue;
        }
      }

      // Check if this is a CTA button paragraph
      const isCTAButton =
        link &&
        (paragraphText.includes("→") ||
          paragraphText.toLowerCase().includes("get started") ||
          paragraphText.toLowerCase().includes("try free") ||
          paragraphText.toLowerCase().includes("talk to") ||
          paragraphText.toLowerCase().includes("download"));

      if (isCTAButton && !foundLink) {
        child.classList.add("cta-banner-button");
        if (link) {
          link.classList.add("cta-banner-link");
          // Replace → text with Arrow_navigate.png image
          replaceArrowWithImage(link as HTMLAnchorElement);
        }
        foundLink = true;
      } else if (!foundSubtitle && foundTitle) {
        child.classList.add("cta-banner-subtitle");
        foundSubtitle = true;
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
