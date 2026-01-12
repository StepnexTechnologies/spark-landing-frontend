"use client";

import { useEffect, useState } from "react";

/**
 * FAQAccordionEnhancer
 *
 * This component enhances WordPress FAQ accordion blocks in-place with:
 * 1. Interactive expand/collapse functionality
 * 2. Consistent "People Also Ask" styling
 * 3. Support for both traditional H3/H4 FAQ format and WordPress AAB Accordion plugin
 */
export default function FAQAccordionEnhancer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Small delay to ensure WordPress content is rendered
    const timer = setTimeout(() => {
      enhanceWordPressAccordions();
      enhanceTraditionalFAQs();
    }, 300);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Enhance WordPress AAB Accordion plugin blocks
 */
function enhanceWordPressAccordions() {
  const accordionContainers = document.querySelectorAll(
    ".wordpress-content .aab__accordion_container"
  );

  if (accordionContainers.length === 0) return;

  // Find the parent accordion block and add styling class
  const accordionBlocks = document.querySelectorAll(
    ".wordpress-content .wp-block-aab-accordion-block"
  );

  accordionBlocks.forEach((block) => {
    if (block.classList.contains("faq-enhanced")) return;
    block.classList.add("faq-enhanced");
    block.classList.add("faq-accordion-wrapper");
  });

  accordionContainers.forEach((container) => {
    // Check if already enhanced
    if (container.classList.contains("faq-item-enhanced")) return;
    container.classList.add("faq-item-enhanced");

    const headElement = container.querySelector(".aab__accordion_head") as HTMLElement;
    const bodyElement = container.querySelector(".aab__accordion_body") as HTMLElement;

    if (!headElement || !bodyElement) return;

    // Set initial state - collapsed
    bodyElement.style.display = "none";
    container.classList.add("faq-collapsed");

    // Make head element clickable
    headElement.style.cursor = "pointer";
    headElement.classList.add("faq-head-clickable");
    headElement.setAttribute("role", "button");
    headElement.setAttribute("tabindex", "0");

    // Create click handler function
    const handleClick = function(e: Event) {
      e.preventDefault();
      e.stopPropagation();

      const isHidden = bodyElement.style.display === "none";

      if (isHidden) {
        // Expand
        bodyElement.style.display = "block";
        container.classList.remove("faq-collapsed");
        container.classList.add("faq-expanded");
      } else {
        // Collapse
        bodyElement.style.display = "none";
        container.classList.add("faq-collapsed");
        container.classList.remove("faq-expanded");
      }
    };

    // Add click event listener
    headElement.addEventListener("click", handleClick);

    // Also handle keyboard for accessibility
    headElement.addEventListener("keydown", function(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick(e);
      }
    });
  });
}

/**
 * Enhance traditional H3/H4 FAQ format
 */
function enhanceTraditionalFAQs() {
  const allElements = Array.from(
    document.querySelectorAll(".wordpress-content *")
  );

  // Find FAQ section heading
  const faqHeadingIndex = allElements.findIndex(
    (el) =>
      (el.tagName === "H2" || el.tagName === "H3") &&
      el.textContent?.toLowerCase().includes("frequently asked questions")
  );

  if (faqHeadingIndex === -1) return;

  const faqHeading = allElements[faqHeadingIndex];

  // Check if already enhanced
  if (faqHeading.classList.contains("faq-heading-enhanced")) return;
  faqHeading.classList.add("faq-heading-enhanced");

  // Style the FAQ heading
  faqHeading.classList.add("faq-section-heading");

  // Find and enhance Q&A pairs
  for (let i = faqHeadingIndex + 1; i < allElements.length; i++) {
    const element = allElements[i];

    // Stop if we hit another H2 (major section)
    if (element.tagName === "H2" && !element.textContent?.toLowerCase().includes("faq")) {
      break;
    }

    // If it's a question heading (H3/H4)
    if (element.tagName === "H3" || element.tagName === "H4") {
      // Check if already enhanced
      if (element.classList.contains("faq-question-enhanced")) continue;
      element.classList.add("faq-question-enhanced");

      // Collect answer paragraphs
      const answerElements: Element[] = [];
      let j = i + 1;
      while (
        j < allElements.length &&
        allElements[j].tagName === "P" &&
        !allElements[j].classList.contains("faq-question-enhanced")
      ) {
        answerElements.push(allElements[j]);
        j++;
      }

      if (answerElements.length === 0) continue;

      // Create wrapper for the Q&A pair
      const wrapper = document.createElement("div");
      wrapper.className = "faq-qa-wrapper faq-collapsed";

      // Create question button
      const questionButton = document.createElement("button");
      questionButton.className = "faq-question-button";
      questionButton.type = "button";
      questionButton.innerHTML = `
        <span class="faq-question-text">${element.textContent}</span>
        <svg class="faq-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      `;

      // Create answer container
      const answerContainer = document.createElement("div");
      answerContainer.className = "faq-answer-container";
      answerContainer.style.display = "none";

      // Move answer paragraphs into container
      answerElements.forEach((p) => {
        const clone = p.cloneNode(true) as Element;
        clone.classList.add("faq-answer-text");
        answerContainer.appendChild(clone);
        // Hide original
        (p as HTMLElement).style.display = "none";
      });

      // Hide original question heading
      (element as HTMLElement).style.display = "none";

      // Insert wrapper after the original question
      element.parentNode?.insertBefore(wrapper, element.nextSibling);
      wrapper.appendChild(questionButton);
      wrapper.appendChild(answerContainer);

      // Add click handler
      questionButton.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();

        const isHidden = answerContainer.style.display === "none";

        if (isHidden) {
          // Expand
          answerContainer.style.display = "block";
          wrapper.classList.remove("faq-collapsed");
          wrapper.classList.add("faq-expanded");
        } else {
          // Collapse
          answerContainer.style.display = "none";
          wrapper.classList.add("faq-collapsed");
          wrapper.classList.remove("faq-expanded");
        }
      });
    }
  }
}
