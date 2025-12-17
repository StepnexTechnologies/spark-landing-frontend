"use client";

import { useEffect, useState } from "react";

/**
 * Client component that adds interactivity to WordPress AAB accordion blocks
 */
export default function FAQAccordion() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const accordionContainers = document.querySelectorAll('.aab__accordion_container');

      accordionContainers.forEach(container => {
        const head = container.querySelector('.aab__accordion_head');
        const body = container.querySelector('.aab__accordion_body') as HTMLElement;
        const icon = container.querySelector('.aab__icon');

        if (head && body) {
          // Initially hide the body
          body.style.display = 'none';

          const handleClick = () => {
            const isCurrentlyHidden = body.style.display === 'none';

            // Toggle body visibility
            body.style.display = isCurrentlyHidden ? 'block' : 'none';

            // Update icon text
            if (icon) {
              icon.textContent = isCurrentlyHidden ? '−' : '+';
            }
          };

          // Remove existing listeners to avoid duplicates
          head.removeEventListener('click', handleClick);
          head.addEventListener('click', handleClick);
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}
