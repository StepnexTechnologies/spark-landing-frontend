"use client";

import { useEffect, useState } from "react";

/**
 * ListMergerEnhancer
 *
 * Merges consecutive <ul> or <ol> lists that WordPress incorrectly split.
 * This fixes the issue where each list item becomes its own separate list.
 */
export default function ListMergerEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure WordPress content is rendered
    const timer = setTimeout(() => {
      mergeConsecutiveLists();
    }, 200);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Find and merge consecutive lists of the same type
 */
function mergeConsecutiveLists() {
  const container = document.querySelector(".wordpress-content");
  if (!container) return;

  let merged = true;

  // Keep merging until no more merges are possible
  while (merged) {
    merged = false;

    const lists = container.querySelectorAll("ul.wp-block-list, ol.wp-block-list");

    for (let i = 0; i < lists.length; i++) {
      const currentList = lists[i];
      const nextSibling = currentList.nextElementSibling;

      // Check if next sibling is a list of the same type
      if (
        nextSibling &&
        nextSibling.tagName === currentList.tagName &&
        nextSibling.classList.contains("wp-block-list")
      ) {
        // Move all li elements from the next list to the current list
        const itemsToMove = nextSibling.querySelectorAll(":scope > li");
        itemsToMove.forEach((li) => {
          currentList.appendChild(li);
        });

        // Remove the now-empty list
        nextSibling.remove();
        merged = true;
        break; // Restart the loop since DOM changed
      }
    }
  }
}
