"use client";

import { useEffect } from "react";

/**
 * CheckmarkEnhancer - Replaces green checkmark emoji (✅) with styled purple checkmark
 * Finds paragraphs starting with ✅ and injects custom checkmark image
 */
export default function CheckmarkEnhancer() {
  useEffect(() => {
    const container = document.querySelector(".wordpress-content");
    if (!container) return;

    // Find all paragraphs that contain the checkmark emoji
    const paragraphs = container.querySelectorAll("p");

    paragraphs.forEach((p) => {
      const text = p.innerHTML;
      // Check if paragraph starts with ✅ emoji (with or without whitespace, possibly inside em/strong/span tags)
      if (text.match(/^(\s*<(em|strong|span|i|b)[^>]*>\s*)*✅/)) {
        // Add the check-highlight class
        p.classList.add("check-highlight");
        // Remove the ✅ emoji from the content (handles ✅ inside em/strong/span tags)
        const newContent = text.replace(/✅\s*/, "");
        // Create image element
        const img = document.createElement("img");
        img.src = "/authors/Logos/BlogTick.png";
        img.alt = "checkmark";
        img.className = "check-highlight-icon";
        // Clear and rebuild content
        p.innerHTML = "";
        p.appendChild(img);
        const textSpan = document.createElement("span");
        textSpan.innerHTML = newContent;
        p.appendChild(textSpan);
      }
    });
  }, []);

  return null;
}
