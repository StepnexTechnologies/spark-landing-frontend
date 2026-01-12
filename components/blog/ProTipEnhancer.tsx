"use client";

import { useEffect, useState } from "react";

/**
 * ProTipEnhancer
 *
 * This component enhances paragraphs starting with "Pro tip:" by adding
 * a light purple background highlight for better visual distinction.
 */
export default function ProTipEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure WordPress content is rendered
    const timer = setTimeout(() => {
      enhanceProTips();
    }, 300);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Find and enhance paragraphs that start with "Pro tip:"
 */
function enhanceProTips() {
  const paragraphs = document.querySelectorAll(".wordpress-content p");

  paragraphs.forEach((p) => {
    const text = p.textContent || "";

    // Check if paragraph starts with "Pro tip:" (case insensitive)
    if (text.trim().toLowerCase().startsWith("pro tip:")) {
      // Skip if already enhanced
      if (p.classList.contains("pro-tip-box")) return;

      // Add pro-tip class for styling
      p.classList.add("pro-tip-box");

      // Wrap "Pro tip:" text in a span for styling the label
      const html = p.innerHTML;
      const regex = /(Pro\s*tip:)/i;
      if (regex.test(html)) {
        p.innerHTML = html.replace(
          regex,
          '<strong class="pro-tip-label">$1</strong>'
        );
      }
    }
  });
}
