"use client";

import { useEffect, useState } from "react";

/**
 * Client component that adds smooth scroll functionality to WordPress TOC links
 */
export default function TOCEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Custom smooth scroll function with controlled duration
    const smoothScrollTo = (targetPosition: number, duration: number) => {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime: number | null = null;

      const easeInOutCubic = (t: number): number => {
        return t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startPosition + distance * easedProgress);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Find all links in the WordPress TOC (links inside wp-block-list after "Table of Content" heading)
      const tocLinks = document.querySelectorAll('.wordpress-content a[href^="#"]');

      tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          if (!href) return;

          const targetId = href.substring(1); // Remove the #
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            // Get the sticky header height
            const header = document.querySelector('header.sticky, header[class*="sticky"]');
            const headerHeight = header ? header.getBoundingClientRect().height : 0;

            // Get the heading's absolute position on the page
            const rect = targetElement.getBoundingClientRect();
            const scrollTop = window.scrollY || window.pageYOffset;
            const targetTop = rect.top + scrollTop;

            // Offset = header height + 50px extra to scroll less (show heading higher)
            const offset = headerHeight + 50;
            const targetScrollPosition = targetTop - offset;

            // Smooth scroll with 800ms duration
            smoothScrollTo(Math.max(0, targetScrollPosition), 800);
          }
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}
