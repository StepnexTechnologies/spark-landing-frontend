"use client";

import { useEffect, useState } from "react";

/**
 * Client component that adds sources-list class to the list following "Sources & References" heading
 * and wraps entire li content with the anchor tag to make the whole item clickable
 */
export default function SourcesListEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Find the Sources & References heading by ID or text content
      const headings = document.querySelectorAll('.wordpress-content h2');

      headings.forEach(heading => {
        const text = heading.textContent?.toLowerCase().trim() || '';

        // Check if this is the Sources & References heading
        if (text.includes('sources') || text.includes('references') || text.includes('reference')) {
          // Find the next sibling that is a list (ol or ul)
          let nextElement = heading.nextElementSibling;

          while (nextElement) {
            if (nextElement.tagName === 'OL' || nextElement.tagName === 'UL') {
              nextElement.classList.add('sources-list');

              // Process each list item to wrap content with anchor
              const listItems = nextElement.querySelectorAll('li');
              listItems.forEach(li => {
                // Find the anchor tag inside the li
                const anchor = li.querySelector('a');
                if (anchor) {
                  const href = anchor.getAttribute('href');
                  if (href) {
                    // Get text content and remove the URL in parentheses
                    let fullText = li.textContent?.trim() || '';
                    // Remove the (url) or (domain.com) part at the end
                    fullText = fullText.replace(/\s*\([^)]*\)\s*$/, '').trim();
                    // Also remove any trailing period after removing parentheses
                    fullText = fullText.replace(/\.\s*$/, '').trim();

                    li.innerHTML = `<a href="${href}" target="_blank" rel="noopener noreferrer">${fullText}</a>`;
                  }
                }
              });

              break;
            }
            // Stop if we hit another heading
            if (nextElement.tagName.match(/^H[1-6]$/)) {
              break;
            }
            nextElement = nextElement.nextElementSibling;
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}
