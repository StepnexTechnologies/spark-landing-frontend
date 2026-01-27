"use client";

import { useEffect, useState } from "react";

/**
 * KeyTakeawaysEnhancer
 *
 * This component enhances h2 headings containing "takeaway" (case insensitive)
 * by wrapping them and their following content (until the next h2) in a
 * styled section with the key-takeaways-section class.
 */
export default function KeyTakeawaysEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure WordPress content is rendered
    const timer = setTimeout(() => {
      enhanceKeyTakeaways();
    }, 300);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Find h2 headings containing "takeaway" and wrap them with their content
 */
function enhanceKeyTakeaways() {
  const container = document.querySelector(".wordpress-content");
  if (!container) return;

  const h2s = container.querySelectorAll("h2");

  h2s.forEach((h2) => {
    const text = h2.textContent || "";

    // Check if h2 contains "takeaway" (case insensitive)
    if (text.toLowerCase().includes("takeaway")) {
      // Skip if already enhanced
      if (h2.closest(".key-takeaways-section")) return;

      // Collect h2 and only immediately following list elements (ul/ol)
      // Stop at any other element type to avoid wrapping unrelated content
      const elementsToWrap: Element[] = [h2];
      let sibling = h2.nextElementSibling;

      while (sibling) {
        const tagName = sibling.tagName.toUpperCase();

        // Only include lists (ul, ol) as part of key takeaways
        if (tagName === "UL" || tagName === "OL") {
          elementsToWrap.push(sibling);
          sibling = sibling.nextElementSibling;
        } else {
          // Stop at any other element type
          break;
        }
      }

      // Create wrapper div
      const wrapper = document.createElement("div");
      wrapper.className = "key-takeaways-section";

      // Insert wrapper before the h2
      h2.parentNode?.insertBefore(wrapper, h2);

      // Move all collected elements into the wrapper
      elementsToWrap.forEach((el) => {
        wrapper.appendChild(el);
      });
    }
  });
}
