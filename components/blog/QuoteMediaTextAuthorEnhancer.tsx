"use client";

import { useEffect, useState } from "react";

/**
 * QuoteMediaTextAuthorEnhancer
 *
 * This component transforms WordPress media-text blocks that follow quote blocks
 * into styled quote author displays with small circular avatar and author name.
 */
export default function QuoteMediaTextAuthorEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Run transformation after content is rendered
    const timer = setTimeout(() => {
      transformMediaTextToQuoteAuthor();
    }, 300);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Check if element is a quote block (pullquote or quote)
 */
function isQuoteElement(el: Element | null): boolean {
  if (!el) return false;
  return (
    el.classList.contains("wp-block-pullquote") ||
    el.classList.contains("wp-block-quote")
  );
}

/**
 * Find the parent wp-block-group of an element
 */
function findParentGroup(el: Element): Element | null {
  let current: Element | null = el.parentElement;
  while (current) {
    if (current.classList.contains("wp-block-group")) {
      return current;
    }
    if (current.classList.contains("wordpress-content")) {
      break;
    }
    current = current.parentElement;
  }
  return null;
}

/**
 * Find media-text blocks and transform them into author displays
 */
function transformMediaTextToQuoteAuthor() {
  // Find all media-text blocks with the specific class
  const mediaTextBlocks = document.querySelectorAll(
    ".wordpress-content .wp-block-media-text.is-stacked-on-mobile"
  );

  mediaTextBlocks.forEach((mediaBlock) => {
    // Skip if already processed
    if (mediaBlock.classList.contains("quote-author-processed")) {
      return;
    }

    // Mark as processed immediately
    mediaBlock.classList.add("quote-author-processed");

    // Find the parent group wrapper
    const groupWrapper = findParentGroup(mediaBlock);

    // Find the quote block
    let quoteBlock: Element | null = null;

    // Strategy 1: If inside a group, check group's previous sibling
    if (groupWrapper) {
      const groupPrev = groupWrapper.previousElementSibling;
      if (isQuoteElement(groupPrev)) {
        quoteBlock = groupPrev;
      } else if (groupPrev) {
        // Check inside the previous sibling
        const innerQuote = groupPrev.querySelector(".wp-block-pullquote, .wp-block-quote");
        if (innerQuote) {
          quoteBlock = innerQuote;
        }
      }
    }

    // Strategy 2: Check direct parent's previous sibling
    if (!quoteBlock && mediaBlock.parentElement) {
      const parentPrev = mediaBlock.parentElement.previousElementSibling;
      if (isQuoteElement(parentPrev)) {
        quoteBlock = parentPrev;
      }
    }

    // Strategy 3: Check media-text's direct previous sibling
    if (!quoteBlock) {
      const directPrev = mediaBlock.previousElementSibling;
      if (isQuoteElement(directPrev)) {
        quoteBlock = directPrev;
      }
    }

    // If no quote found, skip transformation
    if (!quoteBlock) {
      return;
    }

    // Extract the image from media-text
    const img = mediaBlock.querySelector("img");
    const imageUrl = img?.getAttribute("src") || "";
    const imageAlt = img?.getAttribute("alt") || "Author";

    // Extract the author name from content
    const contentDiv = mediaBlock.querySelector(".wp-block-media-text__content");
    let authorName = "";
    let authorLink = "";

    if (contentDiv) {
      // Look for a link first
      const link = contentDiv.querySelector("a");
      if (link) {
        authorName = link.textContent?.trim() || "";
        authorLink = link.getAttribute("href") || "";
      } else {
        // Get text content from paragraphs or direct text
        const paragraphs = contentDiv.querySelectorAll("p");
        if (paragraphs.length > 0) {
          paragraphs.forEach((p) => {
            const text = p.textContent?.trim();
            if (text && !authorName) {
              authorName = text;
            }
          });
        } else {
          authorName = contentDiv.textContent?.trim() || "";
        }
      }
      // Clean up - remove leading dash/hyphen
      authorName = authorName.replace(/^[-–—]\s*/, "").trim();
    }

    if (!authorName && !imageUrl) {
      return;
    }

    // HIDE the cite element in the quote block (removes "- BEAUTY CREATOR" etc.)
    const cite = quoteBlock.querySelector("cite");
    if (cite) {
      (cite as HTMLElement).style.display = "none";
    }

    // Add class to quote block to remove padding-bottom
    quoteBlock.classList.add("has-author-below");

    // Add styling classes
    mediaBlock.classList.add("quote-author-display");

    if (groupWrapper) {
      groupWrapper.classList.add("quote-author-group-wrapper");
    }

    // Clear and rebuild with new structure
    mediaBlock.innerHTML = `
      <div class="quote-author-container">
        ${imageUrl ? `
          <div class="quote-author-avatar">
            <img src="${imageUrl}" alt="${imageAlt}" loading="lazy" />
          </div>
        ` : ''}
        ${authorName ? `
          <div class="quote-author-name-wrapper">
            ${authorLink
              ? `<a href="${authorLink}" class="quote-author-name quote-author-link" target="_blank" rel="noopener noreferrer">${authorName}</a>`
              : `<span class="quote-author-name">${authorName}</span>`
            }
          </div>
        ` : ''}
      </div>
    `;
  });
}
