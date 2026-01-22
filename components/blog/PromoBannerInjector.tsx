"use client";

import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import PromoBanner from "./PromoBanner";

interface PromoBannerConfig {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

// Banner variations to show randomly
const BANNER_VARIATIONS: PromoBannerConfig[] = [
  {
    title: "While you're chasing payments, other creators are getting paid on autopilot.",
    subtitle: "Join 10,000+ creators who stopped begging and started billing.",
    ctaText: "Try Free",
    ctaLink: "https://sparkonomy.com",
  },
  {
    title: "You're Not \"Just An Influencer.\"",
    subtitle: "You're a one-person media company. Start acting like it.",
    ctaText: "Build Your Invoice",
    ctaLink: "https://sparkonomy.com",
  },
  {
    title: "Free invoicing. Auto-reminders. GST sorted. TDS tracked.",
    subtitle: "And yes, it's actually free.",
    ctaText: "See For Yourself",
    ctaLink: "https://sparkonomy.com",
  },
];

/**
 * PromoBannerInjector
 *
 * Injects promotional banners into blog content:
 * - If FAQ section exists: 1 banner before FAQ, 1 banner after FAQ (2 different variations)
 * - If no FAQ section: 1 banner at the end of the content
 */
export default function PromoBannerInjector() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Delay to ensure WordPress content and FAQ enhancement is complete
    const timer = setTimeout(() => {
      injectPromoBanners();
    }, 500);

    return () => clearTimeout(timer);
  }, [isMounted]);

  return null;
}

/**
 * Get two random unique banner configs
 */
function getRandomBannerConfigs(): [PromoBannerConfig, PromoBannerConfig] {
  const shuffled = [...BANNER_VARIATIONS].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

/**
 * Get a single random banner config
 */
function getRandomBannerConfig(): PromoBannerConfig {
  const randomIndex = Math.floor(Math.random() * BANNER_VARIATIONS.length);
  return BANNER_VARIATIONS[randomIndex];
}

function createBannerElement(config: PromoBannerConfig): HTMLDivElement {
  const bannerContainer = document.createElement("div");
  bannerContainer.className = "promo-banner-wrapper";

  const root = createRoot(bannerContainer);
  root.render(
    <PromoBanner
      title={config.title}
      subtitle={config.subtitle}
      ctaText={config.ctaText}
      ctaLink={config.ctaLink}
    />
  );

  return bannerContainer;
}

function injectPromoBanners() {
  const wordpressContent = document.querySelector(".wordpress-content");
  if (!wordpressContent) return;

  // Check if banners already injected
  if (wordpressContent.querySelector(".promo-banner-wrapper")) return;

  // Find FAQ section - check for multiple patterns
  let faqSection: Element | null = null;

  // Pattern 1: WordPress AAB Accordion plugin
  const accordionBlock = wordpressContent.querySelector(".wp-block-aab-accordion-block");

  // Pattern 2: Traditional FAQ heading (H2 or H3 containing "Frequently Asked Questions")
  const allHeadings = wordpressContent.querySelectorAll("h2, h3");
  let faqHeading: Element | null = null;
  let sourcesHeading: Element | null = null;

  allHeadings.forEach((heading) => {
    const headingText = heading.textContent?.toLowerCase() || "";
    if (headingText.includes("frequently asked questions")) {
      faqHeading = heading;
    }
    if (headingText.includes("sources") || headingText.includes("references")) {
      sourcesHeading = heading;
    }
  });

  // Pattern 3: FAQ section wrapper with class
  const faqWrapper = wordpressContent.querySelector(".faq-section, .faq-accordion-wrapper");

  // Determine the FAQ section element
  faqSection = accordionBlock || faqWrapper || faqHeading;

  // Determine the first special section (FAQ or Sources & References)
  const firstSection = faqSection || sourcesHeading;

  if (firstSection) {
    // FAQ or Sources & References section found - inject 1 before, 1 after (with different variations)
    const [firstConfig, secondConfig] = getRandomBannerConfigs();

    // Determine which section comes first in the DOM
    let insertBeforeElement = firstSection;
    if (faqSection && sourcesHeading) {
      // Both exist - find which comes first
      const faqPosition = faqSection.compareDocumentPosition(sourcesHeading);
      if (faqPosition & Node.DOCUMENT_POSITION_FOLLOWING) {
        // FAQ comes before Sources
        insertBeforeElement = faqSection;
      } else {
        // Sources comes before FAQ
        insertBeforeElement = sourcesHeading;
      }
    }

    // Insert banner BEFORE the first special section
    const beforeBanner = createBannerElement(firstConfig);
    insertBeforeElement.parentNode?.insertBefore(beforeBanner, insertBeforeElement);

    // Find the end element (last of FAQ or Sources & References)
    let endElement: Element | null = null;

    if (sourcesHeading && (!faqSection || sourcesHeading.compareDocumentPosition(faqSection) & Node.DOCUMENT_POSITION_PRECEDING)) {
      // Sources & References is the last section
      let current = sourcesHeading.nextElementSibling;
      let lastElement: Element = sourcesHeading;

      while (current) {
        if (current.tagName === "H2" && !current.textContent?.toLowerCase().includes("sources") && !current.textContent?.toLowerCase().includes("references")) {
          break;
        }
        lastElement = current;
        current = current.nextElementSibling;
      }
      endElement = lastElement;
    } else if (accordionBlock) {
      // For accordion blocks, insert after the last accordion block
      const allAccordionBlocks = wordpressContent.querySelectorAll(".wp-block-aab-accordion-block");
      endElement = allAccordionBlocks[allAccordionBlocks.length - 1];
    } else if (faqHeading) {
      // For traditional FAQ, find the next major heading or end of content
      const heading = faqHeading as Element;
      let current = heading.nextElementSibling;
      let lastFaqElement: Element = heading;

      while (current) {
        // Stop at next H2 that's not FAQ-related
        if (current.tagName === "H2" && !current.textContent?.toLowerCase().includes("faq")) {
          break;
        }
        lastFaqElement = current;
        current = current.nextElementSibling;
      }
      endElement = lastFaqElement;
    } else if (faqWrapper) {
      endElement = faqWrapper;
    }

    // Insert banner AFTER the last special section (different variation)
    if (endElement) {
      const afterBanner = createBannerElement(secondConfig);

      // Insert after the end element
      if (endElement.nextSibling) {
        endElement.parentNode?.insertBefore(afterBanner, endElement.nextSibling);
      } else {
        endElement.parentNode?.appendChild(afterBanner);
      }
    }
  } else {
    // No FAQ or Sources & References section - inject 1 banner at the end
    const endBanner = createBannerElement(getRandomBannerConfig());
    wordpressContent.appendChild(endBanner);
  }
}
