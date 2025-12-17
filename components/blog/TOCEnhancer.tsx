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
            const offset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        });
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}
