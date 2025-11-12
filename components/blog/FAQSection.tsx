"use client";

import { useEffect, useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    // Find all elements in wordpress content
    const allElements = Array.from(document.querySelectorAll(".wordpress-content *"));

    // Find the FAQ heading index
    const faqHeadingIndex = allElements.findIndex((el) =>
      (el.tagName === "H2" || el.tagName === "H3") &&
      el.textContent?.toLowerCase().includes("frequently asked questions")
    );

    if (faqHeadingIndex === -1) return;

    const faqItems: FAQItem[] = [];
    const elementsToHide: Element[] = [];

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
        while (j < allElements.length &&
               allElements[j].tagName === "P") {
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

    // Hide all FAQ elements
    elementsToHide.forEach((el) => {
      el.classList.add("faq-section-hidden");
    });

    setFaqs(faqItems);
  }, []);

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
