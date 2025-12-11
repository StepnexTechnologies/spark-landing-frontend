"use client";

import { useEffect, useState } from "react";

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  // If headings are provided, use them directly; otherwise extract from DOM
  headings?: TOCItem[];
  // CSS selector for content container (used for DOM extraction)
  contentSelector?: string;
  // Title displayed above TOC
  title?: string;
  // Style variant
  variant?: "default" | "minimal" | "boxed";
  // Show bullet points
  showBullets?: boolean;
  // Custom className
  className?: string;
}

// Helper to scroll to section
function scrollToSection(id: string) {
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
}

export default function TableOfContents({
  headings: providedHeadings,
  contentSelector = ".wordpress-content",
  title = "Table of Content",
  variant = "default",
  showBullets = false,
  className = "",
}: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>(providedHeadings || []);
  const [activeId, setActiveId] = useState<string>("");

  // Extract headings from DOM if not provided
  useEffect(() => {
    if (providedHeadings) {
      setToc(providedHeadings);
      return;
    }

    // Extract headings from the content
    const allHeadings = Array.from(
      document.querySelectorAll(`${contentSelector} h2, ${contentSelector} h3`)
    );

    // Filter out the "Table of Content" heading itself
    const headings = allHeadings.filter((heading) => {
      const text = heading.textContent?.trim().toLowerCase() || "";
      return text !== "table of content" && text !== "table of contents";
    });

    const tocItems: TOCItem[] = headings.map((heading, index) => {
      const generatedId =
        heading.textContent?.toLowerCase().replace(/\s+/g, "-") || `heading-${index}`;
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
  }, [providedHeadings, contentSelector]);

  // Track active section on scroll
  useEffect(() => {
    if (toc.length === 0) return;

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
    toc.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  // Variant styles
  const variantStyles = {
    default: {
      container: "mb-8",
      title: "text-xl md:text-2xl font-semibold text-gray-800 mb-4",
      list: "space-y-2",
      item: "text-gray-500",
      activeItem: "text-purple-600",
      button: "text-left transition-colors hover:text-purple-600 italic",
    },
    minimal: {
      container: "",
      title: "text-xl md:text-2xl font-normal text-gray-600",
      list: "space-y-2 list-disc pl-10",
      item: "text-gray-600",
      activeItem: "text-purple-600",
      button: "text-left transition-colors hover:text-purple-600 italic underline",
    },
    boxed: {
      container: "bg-gray-50 rounded-xl p-6 mb-8",
      title: "text-lg font-semibold text-gray-800 mb-4",
      list: "space-y-2",
      item: "text-gray-600",
      activeItem: "text-purple-600",
      button: "text-left transition-colors hover:text-purple-600",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={`${styles.list} ${showBullets ? "list-disc pl-6" : ""}`}>
        {toc.map((item) => (
          <li
            key={item.id}
            className={`${item.level === 3 ? "ml-6" : ""} ${styles.item}`}
          >
            <button
              onClick={() => scrollToSection(item.id)}
              className={`${styles.button} ${
                activeId === item.id ? styles.activeItem : ""
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
