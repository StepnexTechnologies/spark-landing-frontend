"use client";

import { useEffect, useState } from "react";

/**
 * QuoteCleanerEnhancer
 *
 * This component cleans up broken quote characters (like "" which render as empty boxes)
 * from WordPress quote blocks. These are typically curly quotes that don't render
 * properly due to font or encoding issues.
 */
export default function QuoteCleanerEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure WordPress content is rendered
    const timer = setTimeout(() => {
      cleanQuoteMarks();
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Find and clean up broken quote marks in quote blocks
 * CSS will add proper quote marks via ::before and ::after pseudo-elements
 */
function cleanQuoteMarks() {
  const quoteBlocks = document.querySelectorAll(
    ".wordpress-content .wp-block-quote, .wordpress-content .wp-block-pullquote"
  );

  quoteBlocks.forEach((quote) => {
    const paragraphs = quote.querySelectorAll("p");

    paragraphs.forEach((p) => {
      // Skip if already cleaned
      if (p.dataset.quoteCleaned === "true") return;
      p.dataset.quoteCleaned = "true";

      let html = p.innerHTML;

      // Remove ALL quote characters from start and end
      // CSS will add proper ones via ::before and ::after
      // This includes: curly quotes, straight quotes, broken/placeholder characters

      // Remove from start: any combination of quotes, spaces, or broken chars
      html = html.replace(/^[\s\u201C\u201D\u201E\u201F\u2033\u2036\uFFFD""„‟″‴"'`]+/, "");

      // Remove from end: any combination of quotes, spaces, or broken chars
      html = html.replace(/[\s\u201C\u201D\u201E\u201F\u2033\u2036\uFFFD""„‟″‴"'`]+$/, "");

      // Also clean up any quote characters after <br> at start or before <br> at end
      html = html
        .replace(/^(<br\s*\/?>)+\s*[\u201C\u201D""„‟"'`]+\s*/gi, "")
        .replace(/\s*[\u201C\u201D""„‟"'`]+\s*(<br\s*\/?>)+$/gi, "");

      p.innerHTML = html.trim();
    });
  });
}
