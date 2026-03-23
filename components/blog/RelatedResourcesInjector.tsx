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

    // Strategy 1: Find the first CTA-1 section (wrapped by H6SectionParser)
    const firstCTA = wordpressContent.querySelector('[data-section-type="cta-1"]');
    if (firstCTA) {
      const containerDiv = document.createElement("div");
      containerDiv.id = "related-resources-container";
      containerDiv.className = "related-resources-wrapper";
      firstCTA.parentNode?.insertBefore(containerDiv, firstCTA.nextSibling);
      containerRef.current = containerDiv;
      setContainer(containerDiv);
      return;
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
