"use client";

import { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Extract headings from the content
    const headings = Array.from(
      document.querySelectorAll(".wordpress-content h2, .wordpress-content h3")
    );

    const tocItems: TOCItem[] = headings.map((heading, index) => {
      const generatedId = heading.textContent?.toLowerCase().replace(/\s+/g, "-") || `heading-${index}`;
      return {
        id: heading.id || `${generatedId}-${index}`,
        text: heading.textContent || "",
        level: parseInt(heading.tagName.charAt(1)),
      };
    });

    // Add IDs to headings if they don't have one
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = tocItems[index].id;
      }
    });

    setToc(tocItems);

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

    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (toc.length === 0) return null;

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
    <div className="bg-gray-50 rounded-2xl p-6 mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Content</h2>
      <ul className="space-y-3">
        {toc.map((item) => (
          <li
            key={item.id}
            className={`${item.level === 3 ? "ml-4" : ""}`}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`text-left transition-colors hover:text-purple-600 ${
                activeId === item.id
                  ? "text-purple-600 font-medium"
                  : "text-gray-700"
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
