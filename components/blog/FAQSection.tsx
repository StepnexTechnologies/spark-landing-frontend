"use client";

import { useEffect, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const faqItems: FAQItem[] = [];
    const elementsToHide: Element[] = [];

    // Method 1: Find FAQ section with H3/H4 headings (traditional format)
    const allElements = Array.from(document.querySelectorAll(".wordpress-content *"));
    const faqHeadingIndex = allElements.findIndex((el) =>
      (el.tagName === "H2" || el.tagName === "H3") &&
      el.textContent?.toLowerCase().includes("frequently asked questions")
    );

    if (faqHeadingIndex !== -1) {
      // Hide the FAQ heading itself
      elementsToHide.push(allElements[faqHeadingIndex]);

      // Start from the element after FAQ heading
      for (let i = faqHeadingIndex + 1; i < allElements.length; i++) {
        const element = allElements[i];

        // Stop if we hit another H2 (major section)
        if (element.tagName === "H2") break;

        // Mark element to be hidden
        elementsToHide.push(element);

        // If it's a heading (h3, h4), treat it as a question
        if (element.tagName === "H3" || element.tagName === "H4") {
          const question = element.textContent?.trim() || "";
          let answer = "";

          // Collect all paragraphs that follow until the next heading
          let j = i + 1;
          while (j < allElements.length && allElements[j].tagName === "P") {
            answer += allElements[j].textContent + " ";
            j++;
          }

          if (question && answer.trim()) {
            faqItems.push({
              question,
              answer: answer.trim()
            });
          }
        }
      }
    }

    // Method 2: Find WordPress AAB Accordion blocks (plugin format)
    const accordionContainers = document.querySelectorAll(".wordpress-content .aab__accordion_container");

    if (accordionContainers.length > 0) {
      // Find and hide the parent accordion block and FAQ heading
      const accordionBlocks = document.querySelectorAll(".wordpress-content .wp-block-aab-accordion-block");
      accordionBlocks.forEach(block => {
        elementsToHide.push(block);
      });

      // Also hide the FAQ heading if it exists (check all h2/h3 for FAQ-related text)
      const headings = document.querySelectorAll(".wordpress-content h2, .wordpress-content h3");
      headings.forEach(heading => {
        const text = heading.textContent?.toLowerCase() || "";
        if (text.includes("frequently asked questions") || text.includes("faq")) {
          elementsToHide.push(heading);
        }
      });

      accordionContainers.forEach(container => {
        const headElement = container.querySelector(".aab__accordion_head");
        const bodyElement = container.querySelector(".aab__accordion_body");

        if (headElement && bodyElement) {
          // Get question text - remove the +/- icon text
          let question = headElement.textContent?.trim() || "";
          // Clean up: remove leading/trailing + or - symbols
          question = question.replace(/^[+−-]\s*|\s*[+−-]$/g, "").trim();

          const answer = bodyElement.textContent?.trim() || "";

          if (question && answer) {
            faqItems.push({ question, answer });
          }
        }

        // Hide the accordion container
        elementsToHide.push(container);
      });
    }

    // Hide all FAQ elements
    elementsToHide.forEach((el) => {
      el.classList.add("faq-section-hidden");
    });

    setFaqs(faqItems);
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  if (faqs.length === 0) return null;

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-5 md:px-[50px] lg:px-[130px] ">
      <h2 className="text-2xl md:text-3xl font-normal text-[#6B7280] ">
        People Also Ask
      </h2>
      <div>
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-200"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-base md:text-lg font-normal text-[#6B7280] pr-4">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 flex-shrink-0 text-gray-400 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === index && (
              <div className="pb-4 bg-white">
                <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
