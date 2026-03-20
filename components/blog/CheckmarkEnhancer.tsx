"use client";

import { useEffect, useState } from "react";

/**
 * CheckmarkEnhancer
 *
 * Adds purple checkmark icon to ALL paragraphs inside trust-para sections.
 * H6 marker identifies the section — no emoji detection needed.
 * If ✅ emoji is present, it gets removed and replaced with the styled icon.
 */
export default function CheckmarkEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const timer = setTimeout(() => {
      enhanceCheckmarks();
    }, 150);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

function enhanceCheckmarks() {
  const sections = document.querySelectorAll(
    '[data-section-type="trust-para"]'
  );

  sections.forEach((section) => {
    if (section.classList.contains("trust-para-enhanced")) return;
    section.classList.add("trust-para-enhanced");

    const paragraphs = section.querySelectorAll("p");

    paragraphs.forEach((p) => {
      // Add the check-highlight class
      p.classList.add("check-highlight");

      // Remove ✅ emoji if present (with or without whitespace, possibly inside inline tags)
      const html = p.innerHTML.replace(/✅\s*/g, "");

      // Create checkmark image
      const img = document.createElement("img");
      img.src = "/authors/Logos/BlogTick.png";
      img.alt = "checkmark";
      img.className = "check-highlight-icon";

      // Rebuild content: icon + text
      p.innerHTML = "";
      p.appendChild(img);
      const textSpan = document.createElement("span");
      textSpan.innerHTML = html;
      p.appendChild(textSpan);
    });
  });
}
