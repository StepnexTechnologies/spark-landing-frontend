"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface CustomTableOfContentsProps {
  headings: TOCItem[];
}

export default function CustomTableOfContents({ headings }: CustomTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    // Track active section on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66%" }
    );

    // Observe all heading elements
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-normal text-gray-600 mb-4">
        Table of Content
      </h2>
      <ul className="space-y-2 list-disc pl-10">
        {headings.map((item) => (
          <li
            key={item.id}
            className={`${item.level === 3 ? "ml-6" : ""} text-gray-600`}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left transition-colors hover:text-purple-600 italic underline ${
                activeId === item.id
                  ? "text-purple-600"
                  : "text-gray-600"
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
