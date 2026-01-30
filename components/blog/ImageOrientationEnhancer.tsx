"use client";

import { useEffect } from "react";

/**
 * ImageOrientationEnhancer
 * Detects image orientation (portrait vs landscape) and applies appropriate styles
 * - Landscape images: width 100%, height auto (fills container width)
 * - Portrait images: width auto, max-height capped (prevents being too tall)
 */
export default function ImageOrientationEnhancer() {
  useEffect(() => {
    const applyOrientationStyles = () => {
      const container = document.querySelector(".wordpress-content");
      if (!container) return;

      const images = container.querySelectorAll("figure.wp-block-image img, img:not([class*='avatar']):not(.check-highlight-icon)");

      images.forEach((img) => {
        const imgElement = img as HTMLImageElement;

        const handleLoad = () => {
          const { naturalWidth, naturalHeight } = imgElement;

          // Skip if dimensions not available
          if (!naturalWidth || !naturalHeight) return;

          const aspectRatio = naturalWidth / naturalHeight;

          // Remove any previously applied orientation classes
          imgElement.classList.remove("img-landscape", "img-portrait");

          if (aspectRatio >= 1) {
            // Landscape or square image
            imgElement.classList.add("img-landscape");
          } else {
            // Portrait image
            imgElement.classList.add("img-portrait");
          }
        };

        // If image is already loaded, apply styles immediately
        if (imgElement.complete && imgElement.naturalWidth) {
          handleLoad();
        } else {
          // Otherwise wait for load
          imgElement.addEventListener("load", handleLoad, { once: true });
        }
      });
    };

    // Run on mount
    applyOrientationStyles();

    // Also run after a short delay to catch any dynamically loaded images
    const timeout = setTimeout(applyOrientationStyles, 500);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
