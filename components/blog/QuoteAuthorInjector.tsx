"use client";

import { useEffect } from "react";
import Image from "next/image";

interface QuoteAuthorInjectorProps {
  authorName: string;
  authorRole: string;
  authorAvatar: string;
}

export default function QuoteAuthorInjector({
  authorName,
  authorRole,
  authorAvatar,
}: QuoteAuthorInjectorProps) {
  useEffect(() => {
    // Find all quote blocks in WordPress content
    const quotes = document.querySelectorAll(
      ".wordpress-content .wp-block-quote, .wordpress-content .wp-block-pullquote"
    );

    quotes.forEach((quote) => {
      // Check if author info is already added
      if (quote.querySelector(".quote-author-info")) {
        return;
      }

      // Check if quote already has a cite element with content
      const existingCite = quote.querySelector("cite");
      if (existingCite && existingCite.textContent?.trim()) {
        return; // Skip if quote already has citation
      }

      // Create author info HTML
      const authorInfoDiv = document.createElement("div");
      authorInfoDiv.className = "quote-author-info";
      authorInfoDiv.innerHTML = `
        <div class="author-avatar-wrapper">
          <img src="${authorAvatar}" alt="${authorName}" class="author-avatar-img" />
        </div>
        <div class="author-text-wrapper">
          <div class="author-name">${authorName}</div>
          <div class="author-role">${authorRole}</div>
        </div>
      `;

      // Append to quote
      quote.appendChild(authorInfoDiv);
    });
  }, [authorName, authorRole, authorAvatar]);

  return null;
}
