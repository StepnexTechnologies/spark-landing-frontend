/**
 * Section Registry — Single source of truth for H6 tag marker configuration.
 *
 * Each blog section in WordPress is preceded by an <h6> tag with a keyword.
 * The H6SectionParser reads these markers and wraps the following content
 * in a <div> with the configured class and data-section-type attribute.
 */

export interface SectionConfig {
  /** Accepted H6 marker text variations (matched case-insensitively, whitespace/hyphens normalized) */
  markers: string[];
  /** Internal section type identifier, used as data-section-type value */
  type: string;
  /** CSS class applied to the wrapper div */
  wrapperClass: string;
  /** Whether this section can appear multiple times in one post */
  allowMultiple: boolean;
}

export const SECTION_REGISTRY: SectionConfig[] = [
  {
    markers: ["CTA-1", "CTA1", "CTA 1"],
    type: "cta-1",
    wrapperClass: "cta-banner-section",
    allowMultiple: false,
  },
  {
    markers: ["CTA-2", "CTA2", "CTA 2"],
    type: "cta-2",
    wrapperClass: "cta-banner-section",
    allowMultiple: false,
  },
  {
    markers: ["Table of Content", "Table of Contents", "TOC"],
    type: "toc",
    wrapperClass: "toc-section",
    allowMultiple: false,
  },
  {
    markers: ["Key Takeaways", "Key Takeaway"],
    type: "key-takeaways",
    wrapperClass: "key-takeaways-section",
    allowMultiple: false,
  },
  {
    markers: ["Highlight Box"],
    type: "highlight-box",
    wrapperClass: "highlight-box-section",
    allowMultiple: true,
  },
  {
    markers: ["Trust Para", "Trust Paragraph"],
    type: "trust-para",
    wrapperClass: "trust-para-section",
    allowMultiple: true,
  },
  {
    markers: [
      "Sources and References",
      "Sources & References",
      "Sources",
      "References",
    ],
    type: "sources",
    wrapperClass: "sources-section",
    allowMultiple: false,
  },
];

/**
 * Normalize text for matching: trim, lowercase, collapse whitespace, remove hyphens.
 */
export function normalizeMarkerText(text: string): string {
  return text.trim().toLowerCase().replace(/[-]/g, " ").replace(/\s+/g, " ");
}

/**
 * Find a matching section config for the given H6 text.
 * Returns the config if found, or undefined.
 */
export function findSectionConfig(
  h6Text: string
): SectionConfig | undefined {
  const normalized = normalizeMarkerText(h6Text);
  return SECTION_REGISTRY.find((config) =>
    config.markers.some(
      (marker) => normalizeMarkerText(marker) === normalized
    )
  );
}
