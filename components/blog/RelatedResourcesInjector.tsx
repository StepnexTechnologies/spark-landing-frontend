"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import RelatedResources, { RelatedResource } from "./RelatedResources";

interface RelatedResourcesInjectorProps {
  posts: RelatedResource[];
  basePath?: "/blogs" | "/preview";
}

/**
 * RelatedResourcesInjector
 *
 * Injects the Related Resources section after the first CTA banner
 * and before the FAQ section in blog content.
 */
export default function RelatedResourcesInjector({
  posts,
  basePath = "/blogs",
}: RelatedResourcesInjectorProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const findAndCreateContainer = useCallback(() => {
    const wordpressContent = document.querySelector(".wordpress-content");
    if (!wordpressContent) {
      // Retry if content not found yet
      if (retryCountRef.current < 5) {
        retryCountRef.current++;
        setTimeout(findAndCreateContainer, 200);
      }
      return;
    }

    // Check if container already exists
    const existingContainer = document.getElementById("related-resources-container");
    if (existingContainer) {
      setContainer(existingContainer);
      return;
    }

    // Strategy 1: Find the first CTA banner section (wrapped by PromoBannerInjector)
    const firstCTA = wordpressContent.querySelector(".cta-banner-section");
    if (firstCTA) {
      const containerDiv = document.createElement("div");
      containerDiv.id = "related-resources-container";
      containerDiv.className = "related-resources-wrapper";
      firstCTA.parentNode?.insertBefore(containerDiv, firstCTA.nextSibling);
      containerRef.current = containerDiv;
      setContainer(containerDiv);
      return;
    }

    // Strategy 2: Find H3 with CTA title pattern (if PromoBannerInjector hasn't run yet)
    const h3Elements = wordpressContent.querySelectorAll("h3");
    for (const h3 of Array.from(h3Elements)) {
      const text = h3.textContent?.toLowerCase() || "";
      // Look for CTA titles like "Ready to..." or similar patterns
      if (text.includes("ready to") || text.includes("get started") || text.includes("try sparkonomy")) {
        // Find the CTA button after this heading
        let insertPoint: Element | null = h3;
        let current = h3.nextElementSibling;

        while (current) {
          const tagName = current.tagName.toUpperCase();
          if (tagName === "H2" || tagName === "H3") break;

          // Check if this paragraph has a CTA link
          if (tagName === "P") {
            const link = current.querySelector("a");
            if (link && (current.textContent?.includes("→") || link.textContent?.toLowerCase().includes("get started"))) {
              insertPoint = current;
              break;
            }
          }
          insertPoint = current;
          current = current.nextElementSibling;
        }

        const containerDiv = document.createElement("div");
        containerDiv.id = "related-resources-container";
        containerDiv.className = "related-resources-wrapper";
        insertPoint?.parentNode?.insertBefore(containerDiv, insertPoint.nextSibling);
        containerRef.current = containerDiv;
        setContainer(containerDiv);
        return;
      }
    }

    // Strategy 3: Find H6 with CTA-1 text
    const h6Elements = wordpressContent.querySelectorAll("h6");
    for (const h6 of Array.from(h6Elements)) {
      const text = h6.textContent?.trim().toUpperCase().replace(/[-\s]/g, "") || "";
      if (text === "CTA1") {
        let insertPoint: Element | null = h6;
        let current = h6.nextElementSibling;

        while (current) {
          const tagName = current.tagName.toUpperCase();
          if (tagName === "H6" || tagName === "H2") break;

          if (tagName === "P") {
            const hasArrow = current.textContent?.includes("→");
            if (hasArrow) {
              insertPoint = current;
              break;
            }
          }
          insertPoint = current;
          current = current.nextElementSibling;
        }

        const containerDiv = document.createElement("div");
        containerDiv.id = "related-resources-container";
        containerDiv.className = "related-resources-wrapper";
        insertPoint?.parentNode?.insertBefore(containerDiv, insertPoint.nextSibling);
        containerRef.current = containerDiv;
        setContainer(containerDiv);
        return;
      }
    }

    // Strategy 4: Insert before FAQ section
    const faqHeading = Array.from(wordpressContent.querySelectorAll("h2, h3")).find(
      (heading) => {
        const text = heading.textContent?.toLowerCase() || "";
        return (
          text.includes("faq") ||
          text.includes("frequently asked") ||
          text.includes("people also ask")
        );
      }
    );

    if (faqHeading) {
      const containerDiv = document.createElement("div");
      containerDiv.id = "related-resources-container";
      containerDiv.className = "related-resources-wrapper";
      faqHeading.parentNode?.insertBefore(containerDiv, faqHeading);
      containerRef.current = containerDiv;
      setContainer(containerDiv);
      return;
    }

    // Strategy 5: Insert before the last H2 (usually sources/references)
    const allH2s = wordpressContent.querySelectorAll("h2");
    if (allH2s.length > 2) {
      const targetH2 = allH2s[allH2s.length - 2];
      const containerDiv = document.createElement("div");
      containerDiv.id = "related-resources-container";
      containerDiv.className = "related-resources-wrapper";
      targetH2.parentNode?.insertBefore(containerDiv, targetH2);
      containerRef.current = containerDiv;
      setContainer(containerDiv);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || posts.length === 0) return;

    // Wait for PromoBannerInjector to process CTA sections first (runs at 100ms)
    const timer = setTimeout(() => {
      findAndCreateContainer();
    }, 300);

    return () => clearTimeout(timer);
  }, [isMounted, posts, findAndCreateContainer]);

  // Clean up container on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, []);

  if (!container || posts.length === 0) return null;

  return createPortal(
    <RelatedResources posts={posts} basePath={basePath} />,
    container
  );
}
