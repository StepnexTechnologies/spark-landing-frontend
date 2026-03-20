"use client";

import { useEffect, useState } from "react";

/**
 * SourcesListEnhancer
 *
 * Enhances links within the sources section (data-section-type="sources").
 * Wraps li content with anchor tag to make the whole item clickable.
 * Section identification and base styling are handled by H6SectionParser + CSS.
 */
export default function SourcesListEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      enhanceSourcesLinks();
    }, 150);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

function enhanceSourcesLinks() {
  const sections = document.querySelectorAll(
    '[data-section-type="sources"]'
  );

  sections.forEach((section) => {
    if (section.classList.contains("sources-enhanced")) return;
    section.classList.add("sources-enhanced");

    // Process each list item to make entire item clickable
    const listItems = section.querySelectorAll("li");
    listItems.forEach((li) => {
      const anchor = li.querySelector("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href) {
          let fullText = li.textContent?.trim() || "";
          fullText = fullText.replace(/\s*\([^)]*\)\s*$/, "").trim();
          fullText = fullText.replace(/\.\s*$/, "").trim();
          li.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer">${fullText}</a>`;
        }
      }
    });
  });
}
