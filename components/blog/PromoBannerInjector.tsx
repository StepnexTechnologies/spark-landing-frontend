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

  allHeadings.forEach((heading) => {
    if (heading.textContent?.toLowerCase().includes("frequently asked questions")) {
      faqHeading = heading;
    }
  });

  // Pattern 3: FAQ section wrapper with class
  const faqWrapper = wordpressContent.querySelector(".faq-section, .faq-accordion-wrapper");

  // Determine the FAQ section element
  faqSection = accordionBlock || faqWrapper || faqHeading;

  if (faqSection) {
    // FAQ section found - inject 1 before, 1 after (with different variations)
    const [firstConfig, secondConfig] = getRandomBannerConfigs();

    // Find the parent container of the FAQ section for proper insertion
    let faqContainer = faqSection;

    // If it's a heading, we need to find the FAQ section boundary
    if (faqHeading && faqSection === faqHeading) {
      faqContainer = faqHeading;
    }

    // Insert banner BEFORE FAQ section
    const beforeBanner = createBannerElement(firstConfig);
    faqContainer.parentNode?.insertBefore(beforeBanner, faqContainer);

    // Find the end of FAQ section
    let faqEndElement: Element | null = null;

    if (accordionBlock) {
      // For accordion blocks, insert after the last accordion block
      const allAccordionBlocks = wordpressContent.querySelectorAll(".wp-block-aab-accordion-block");
      faqEndElement = allAccordionBlocks[allAccordionBlocks.length - 1];
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
      faqEndElement = lastFaqElement;
    } else if (faqWrapper) {
      faqEndElement = faqWrapper;
    }

    // Insert banner AFTER FAQ section (different variation)
    if (faqEndElement) {
      const afterBanner = createBannerElement(secondConfig);

      // Insert after the FAQ end element
      if (faqEndElement.nextSibling) {
        faqEndElement.parentNode?.insertBefore(afterBanner, faqEndElement.nextSibling);
      } else {
        faqEndElement.parentNode?.appendChild(afterBanner);
      }
    }
  } else {
    // No FAQ section - inject 1 banner at the end
    const endBanner = createBannerElement(getRandomBannerConfig());
    wordpressContent.appendChild(endBanner);
  }
}
