/**
 * Section Parser for WordPress Content
 * Automatically detects and wraps different section types for consistent styling
 */

export type SectionType =
  | 'heading-para'      // H2 + paragraphs
  | 'heading-para-list' // H2 + paragraphs + list
  | 'heading-list'      // H2 + list only
  | 'table'             // Table section
  | 'faq'               // FAQ/Accordion section
  | 'list'              // Standalone list
  | 'quote'             // Blockquote/pullquote
  | 'image'             // Image/figure
  | 'intro'             // First section (special styling)
  | 'sources'           // Sources/References section
  | 'other';            // Other content

export interface ParsedSection {
  type: SectionType;
  html: string;
  heading?: string;
}

/**
 * Parse WordPress HTML content into structured sections
 */
export function parseContentIntoSections(html: string): ParsedSection[] {
  const sections: ParsedSection[] = [];

  // Clean up the HTML first
  let cleanedHtml = html
    .replace(/\n\s*\n/g, '\n')
    .trim();

  // Split content by H2 headings while keeping the headings
  const h2Regex = /(<h2[^>]*>[\s\S]*?<\/h2>)/gi;
  const parts = cleanedHtml.split(h2Regex).filter(part => part.trim());

  let isFirstSection = true;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    // Check if this part is an H2 heading
    if (/<h2[^>]*>/i.test(part)) {
      // This is a heading, combine with next part(s) until next H2
      const headingMatch = part.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
      const headingText = headingMatch
        ? headingMatch[1].replace(/<[^>]*>/g, '').trim()
        : '';

      // Get the content after this heading (next part if it's not an H2)
      let sectionContent = part;
      if (i + 1 < parts.length && !/<h2[^>]*>/i.test(parts[i + 1])) {
        sectionContent += parts[i + 1];
        i++; // Skip the next part since we've included it
      }

      const section = categorizeSection(sectionContent, headingText, isFirstSection);
      sections.push(section);
      isFirstSection = false;
    } else {
      // Content without H2 heading (could be intro, standalone elements, etc.)
      const section = categorizeSection(part, '', isFirstSection);
      if (section.html.trim()) {
        sections.push(section);
      }
      isFirstSection = false;
    }
  }

  return sections;
}

/**
 * Categorize a section based on its content
 */
function categorizeSection(html: string, heading: string, isFirst: boolean): ParsedSection {
  const lowerHeading = heading.toLowerCase();

  // Check for FAQ section
  if (lowerHeading.includes('frequently asked') ||
      lowerHeading.includes('faq') ||
      /wp-block-aab-accordion-block/i.test(html) ||
      /wp-block-accordion/i.test(html)) {
    return { type: 'faq', html, heading };
  }

  // Check for Sources/References section
  if (lowerHeading.includes('sources') ||
      lowerHeading.includes('references') ||
      lowerHeading.includes('external sources')) {
    return { type: 'sources', html, heading };
  }

  // Check for Table of Contents (skip it as we have custom TOC)
  if (lowerHeading.includes('table of content')) {
    return { type: 'other', html: '', heading }; // Return empty to skip
  }

  // Check for table
  if (/wp-block-table|<table/i.test(html)) {
    return { type: 'table', html, heading };
  }

  // Check for quote
  if (/wp-block-quote|wp-block-pullquote|<blockquote/i.test(html)) {
    return { type: 'quote', html, heading };
  }

  // Check for image/figure without heading
  if (!heading && /wp-block-image|<figure/i.test(html) && !/<p[^>]*>/i.test(html)) {
    return { type: 'image', html, heading };
  }

  // Check content structure for heading sections
  const hasList = /<ul|<ol/i.test(html);
  const hasParagraph = /<p[^>]*>/i.test(html);

  if (heading) {
    if (hasList && hasParagraph) {
      return { type: 'heading-para-list', html, heading };
    } else if (hasList) {
      return { type: 'heading-list', html, heading };
    } else if (hasParagraph) {
      return { type: isFirst ? 'intro' : 'heading-para', html, heading };
    }
  }

  // Standalone list
  if (hasList && !heading) {
    return { type: 'list', html, heading };
  }

  return { type: 'other', html, heading };
}

/**
 * Wrap sections with appropriate CSS classes
 */
export function wrapSectionsWithClasses(sections: ParsedSection[]): string {
  return sections
    .filter(section => section.html.trim())
    .map((section, index) => {
      const sectionClass = `blog-section blog-section--${section.type}`;
      const dataAttr = `data-section-type="${section.type}"`;
      const indexAttr = `data-section-index="${index}"`;

      return `<div class="${sectionClass}" ${dataAttr} ${indexAttr}>${section.html}</div>`;
    })
    .join('\n');
}

/**
 * Process FAQ accordion blocks to make them interactive
 * Converts WordPress AAB accordion blocks to a simpler, interactive format
 */
export function processFAQBlocks(html: string): string {
  // Find all AAB accordion blocks and convert them
  const accordionRegex = /<div[^>]*class="[^"]*wp-block-aab-accordion-block[^"]*"[^>]*>[\s\S]*?<h5[^>]*class="[^"]*aab__accordion_title[^"]*"[^>]*>([\s\S]*?)<\/h5>[\s\S]*?<div[^>]*class="[^"]*aab__accordion_body[^"]*"[^>]*>[\s\S]*?<div[^>]*class="[^"]*aab__accordion_component[^"]*"[^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/gi;

  let processed = html;
  let match;

  while ((match = accordionRegex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]*>/g, '').trim();
    const answer = match[2].trim();

    const newAccordion = `
      <details class="faq-item">
        <summary class="faq-question">
          <span class="faq-question-text">${question}</span>
          <span class="faq-icon">+</span>
        </summary>
        <div class="faq-answer">${answer}</div>
      </details>
    `;

    processed = processed.replace(match[0], newAccordion);
  }

  // Also handle the custom-css-block divs that come before accordions
  processed = processed.replace(/<div[^>]*class="custom-css-block"[^>]*>[\s\S]*?<\/div>/gi, '');

  return processed;
}

/**
 * Main function to process WordPress content
 */
export function processWordPressContent(html: string): string {
  // Step 1: Process FAQ blocks first
  let processed = processFAQBlocks(html);

  // Step 2: Parse into sections
  const sections = parseContentIntoSections(processed);

  // Step 3: Wrap sections with classes
  const wrappedContent = wrapSectionsWithClasses(sections);

  return wrappedContent;
}
