/**
 * Content processor for WordPress HTML
 * Removes WordPress TOC and extracts headings for custom TOC
 */

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Remove WordPress built-in Table of Contents from HTML
 */
export function removeWordPressTOC(html: string): string {
  let cleaned = html;

  // Remove Table of Content section
  cleaned = cleaned.replace(
    /Table of Content[\s\S]*?<ul[^>]*>[\s\S]*?<\/ul>/gi,
    ''
  );

  // Remove AAAAAA paragraphs and extra br tags
  cleaned = cleaned.replace(/<p[^>]*>A{5,}[^<]*<\/p>/gi, '');
  cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, '');
  cleaned = cleaned.replace(/<p[^>]*>\s*<\/p>/gi, '');

  return cleaned;
}

/**
 * Remove FAQ section from content as it will be rendered separately
 */
export function removeFAQSection(html: string): string {
  // Don't actually remove it - just return the html as-is
  // We'll hide it with CSS instead
  return html;
}

/**
 * Extract TOC items from WordPress TOC list (before it gets removed)
 * Looks for "Table of Content" heading followed by <ul class="wp-block-list">
 */
export function extractHeadings(html: string): TOCItem[] {
  const headings: TOCItem[] = [];

  // Find "Table of Content" heading followed by the TOC list
  // This ensures we only get the TOC list, not other wp-block-list elements
  const tocSectionRegex = /Table of Content[\s\S]*?<ul\s+class="wp-block-list"[^>]*>([\s\S]*?)<\/ul>/i;
  const tocMatch = html.match(tocSectionRegex);

  if (!tocMatch) {
    return headings;
  }

  const listContent = tocMatch[1];

  // Extract all <li> items from the list
  const liRegex = /<li[^>]*>(.*?)<\/li>/gi;
  let match;
  let index = 0;

  while ((match = liRegex.exec(listContent)) !== null) {
    const content = match[1];
    // Remove <br> tags and all HTML tags, then trim
    const text = content.replace(/<br\s*\/?>/gi, '').replace(/<[^>]*>/g, '').trim();

    if (text) {
      const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `heading-${index}`;

      headings.push({
        id: headingId,
        text,
        level: 2, // Treat all TOC items as h2 level
      });

      index++;
    }
  }

  return headings;
}

/**
 * Add IDs to headings in HTML if they don't have them
 */
export function addHeadingIds(html: string, headings: TOCItem[]): string {
  let processed = html;
  let headingIndex = 0;

  processed = processed.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();

    // Skip TOC headings
    if (text.toLowerCase() === 'table of content' ||
        text.toLowerCase() === 'table of contents' ||
        text.toLowerCase() === 'frequently asked questions') {
      return match;
    }

    const heading = headings[headingIndex];
    if (heading && heading.text === text) {
      // Check if already has an id
      if (!/id=/.test(attrs)) {
        const newAttrs = attrs ? `${attrs} id="${heading.id}"` : ` id="${heading.id}"`;
        headingIndex++;
        return `<${tag}${newAttrs}>${content}</${tag}>`;
      }
      headingIndex++;
    }
    return match;
  });

  return processed;
}
