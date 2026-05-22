"use client";

import { useCallback, useEffect, useState } from "react";

function isExpandable(img: HTMLImageElement): boolean {
  if (img.closest("[data-lightbox-overlay]")) return false;
  if (
    !img.closest(".wordpress-content") &&
    !img.closest("[data-lightbox-target]")
  ) {
    return false;
  }
  if (img.closest(".rounded-full")) return false;
  if (img.closest("[data-no-lightbox]")) return false;
  if (img.classList.contains("check-highlight-icon")) return false;
  if (/avatar/i.test(img.className)) return false;
  return true;
}

export default function ImageLightboxEnhancer() {
  const [active, setActive] = useState<{ src: string; alt: string } | null>(
    null,
  );
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // Ignore non-primary clicks (middle/right, modifier-clicks)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const path = e.composedPath();
      let img: HTMLImageElement | null = null;
      for (const node of path) {
        if (node instanceof HTMLImageElement) {
          img = node;
          break;
        }
        // Stop searching once we leave the article area
        if (node instanceof HTMLElement && node.tagName === "ARTICLE") break;
      }
      if (!img || !isExpandable(img)) return;
      e.preventDefault();
      e.stopPropagation();
      setActive({ src: img.currentSrc || img.src, alt: img.alt || "" });
    };

    // Capture phase so we beat any wrapping <a target="_blank"> navigation.
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  if (!active) return null;

  return (
    <div
      data-lightbox-overlay
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-zoom-out"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        aria-label="Close image"
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={active.src}
        alt={active.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[95vw] cursor-default rounded-lg object-contain"
      />
    </div>
  );
}
