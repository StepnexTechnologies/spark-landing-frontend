/**
 * Content processor for WordPress HTML
 * Removes WordPress TOC and extracts headings for custom TOC
 */

/**
 * Extract and remove the first paragraph from content (typically the excerpt/description)
 * since it's displayed separately before the featured image
 * Returns both the first paragraph and the remaining content
 */
export function extractFirstParagraph(html: string): { firstParagraph: string; remainingContent: string } {
  const match = html.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/);
  if (match) {
    const firstParagraph = match[1]; // Content inside <p> tags
    const remainingContent = html.replace(/^\s*<p[^>]*>[\s\S]*?<\/p>\s*/, '');
    return { firstParagraph, remainingContent };
  }
  return { firstParagraph: '', remainingContent: html };
}

/**
 * Remove the first paragraph from content (typically the excerpt/description)
 * since it's displayed separately before the featured image
 */
export function removeFirstParagraph(html: string): string {
  // Remove the first <p> tag and its content
  return html.replace(/^\s*<p[^>]*>[\s\S]*?<\/p>\s*/, '');
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface VideoItem {
  url: string;
  embedUrl: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
}

/**
 * Helper function to extract only H2 headings from HTML (main sections for TOC)
 */
function extractH2Headings(html: string): Array<{ id: string; text: string }> {
  const headings: Array<{ id: string; text: string }> = [];
  const headingRegex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    // Skip TOC and FAQ headings
    const textLower = text.toLowerCase();
    if (textLower === 'table of content' ||
        textLower === 'table of contents' ||
        textLower === 'frequently asked questions' ||
        textLower.includes('sources') ||
        textLower.includes('references')) {
      continue;
    }
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (id) {
      headings.push({ id, text });
    }
  }

  return headings;
}

/**
 * Remove WordPress built-in Table of Contents from HTML
 * Or add toc-list class to the TOC list for styling and add anchor links
 */
export function removeWordPressTOC(html: string): string {
  let cleaned = html;

  // Extract H2 headings first for sequential matching
  const h2Headings = extractH2Headings(html);

  // Find the TOC section and process it
  const tocRegex = /(<h2[^>]*>(?:<[^>]*>)*\s*Table of Contents?\s*(?:<[^>]*>)*<\/h2>\s*)(<ul[^>]*>)([\s\S]*?)(<\/ul>)/gi;

  cleaned = cleaned.replace(tocRegex, (match, heading, ulOpen, listContent, ulClose) => {
    // Add toc-list class to ul
    let newUlOpen = ulOpen;
    if (ulOpen.includes('class="')) {
      newUlOpen = ulOpen.replace('class="', 'class="toc-list ');
    } else {
      newUlOpen = ulOpen.replace('<ul', '<ul class="toc-list"');
    }

    // Extract all TOC items first to match them sequentially with headings
    const tocItems: string[] = [];
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(listContent)) !== null) {
      const text = liMatch[1].replace(/<br\s*\/?>/gi, '').replace(/<[^>]*>/g, '').trim();
      if (text) {
        tocItems.push(text);
      }
    }

    // Build new list content with sequential heading matching
    let newListContent = '';
    tocItems.forEach((text, index) => {
      // Match TOC item to H2 heading by position (index)
      const matchedHeading = h2Headings[index];
      if (matchedHeading) {
        newListContent += `<li><a href="#${matchedHeading.id}" class="toc-link">${text}</a></li>`;
      } else {
        // Fallback to generating ID from text if no heading at this index
        const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        newListContent += `<li><a href="#${headingId}" class="toc-link">${text}</a></li>`;
      }
    });

    return heading + newUlOpen + newListContent + ulClose;
  });

  // Find the Sources and references section and add class to the list
  // Matches: "Sources", "References", "Sources and references", "Sources & References", etc.
  const sourcesRegex = /(<h2[^>]*>(?:<[^>]*>)*\s*(?:Sources(?:\s*(?:and|&amp;|&)\s*References?)?|References?)\s*(?:<[^>]*>)*<\/h2>[\s\S]*?)(<[ou]l[^>]*>)([\s\S]*?)(<\/[ou]l>)/gi;

  cleaned = cleaned.replace(sourcesRegex, (match, beforeList, listOpen, listContent, listClose) => {
    // Add sources-list class to ul/ol
    let newListOpen = listOpen;
    if (listOpen.includes('class="')) {
      newListOpen = listOpen.replace('class="', 'class="sources-list ');
    } else {
      newListOpen = listOpen.replace(/<([ou]l)/, '<$1 class="sources-list"');
    }

    return beforeList + newListOpen + listContent + listClose;
  });

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
 * Generates IDs based on heading text content
 */
export function addHeadingIds(html: string, headings: TOCItem[]): string {
  let processed = html;

  // Add IDs to all h2, h3, h4 headings based on their text content
  processed = processed.replace(/<(h[234])([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();

    // Skip TOC and FAQ headings
    if (text.toLowerCase() === 'table of content' ||
        text.toLowerCase() === 'table of contents' ||
        text.toLowerCase() === 'frequently asked questions') {
      return match;
    }

    // Check if already has an id
    if (/id=/.test(attrs)) {
      return match;
    }

    // Generate ID from text content (same logic as TOC link generation)
    const headingId = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    if (headingId) {
      const newAttrs = attrs ? `${attrs} id="${headingId}"` : ` id="${headingId}"`;
      return `<${tag}${newAttrs}>${content}</${tag}>`;
    }

    return match;
  });

  return processed;
}

/**
 * Extract FAQ items from HTML content for structured data
 */
export function extractFAQs(html: string): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Try extracting from Gutenberg core/accordion blocks first
  const gutenbergFaqs = extractGutenbergAccordionFAQs(html);
  if (gutenbergFaqs.length > 0) {
    return gutenbergFaqs;
  }

  // Find FAQ section heading
  const faqHeadingRegex = /<(h[23])[^>]*>(?:<[^>]*>)*\s*Frequently Asked Questions?\s*(?:<[^>]*>)*<\/\1>/gi;
  const faqMatch = faqHeadingRegex.exec(html);

  if (!faqMatch) {
    return faqs;
  }

  const faqStartIndex = faqMatch.index + faqMatch[0].length;
  const remainingHtml = html.substring(faqStartIndex);

  // Find next major section (h2) to determine where FAQs end
  const nextSectionMatch = remainingHtml.match(/<h2[^>]*>/i);
  const faqSectionHtml = nextSectionMatch
    ? remainingHtml.substring(0, nextSectionMatch.index)
    : remainingHtml;

  // Extract Q&A pairs (h3/h4 as questions, following p tags as answers)
  const headingRegex = /<(h[34])[^>]*>(.*?)<\/\1>/gi;
  let questionMatch;

  while ((questionMatch = headingRegex.exec(faqSectionHtml)) !== null) {
    const question = questionMatch[2].replace(/<[^>]*>/g, '').trim();

    // Find the answer (paragraph(s) following the question)
    const afterQuestion = faqSectionHtml.substring(questionMatch.index + questionMatch[0].length);
    const paragraphRegex = /<p[^>]*>(.*?)<\/p>/gi;
    let answerParts: string[] = [];
    let pMatch;
    let lastIndex = 0;

    while ((pMatch = paragraphRegex.exec(afterQuestion)) !== null) {
      // Stop if we hit another heading
      const textBefore = afterQuestion.substring(lastIndex, pMatch.index);
      if (/<h[23456]/i.test(textBefore)) {
        break;
      }

      const answerText = pMatch[1].replace(/<[^>]*>/g, '').trim();
      if (answerText) {
        answerParts.push(answerText);
      }
      lastIndex = pMatch.index + pMatch[0].length;

      // Stop after collecting answer paragraphs if we hit another heading
      const remaining = afterQuestion.substring(lastIndex);
      if (/<h[23456]/i.test(remaining.substring(0, 100))) {
        break;
      }
    }

    const answer = answerParts.join(' ');

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

/**
 * Extract FAQ items from Gutenberg core/accordion blocks
 */
function extractGutenbergAccordionFAQs(html: string): FAQItem[] {
  const faqs: FAQItem[] = [];

  // Match accordion items: extract toggle title and content panel
  const itemRegex = /<div[^>]*class="[^"]*wp-block-accordion-item[^"]*"[^>]*>[\s\S]*?<span[^>]*class="[^"]*wp-block-accordion-heading__toggle-title[^"]*"[^>]*>([\s\S]*?)<\/span>[\s\S]*?<div[^>]*(?:role="region"|class="[^"]*wp-block-accordion-item__content[^"]*")[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;

  let match;
  while ((match = itemRegex.exec(html)) !== null) {
    const question = match[1].replace(/<[^>]*>/g, '').trim();
    const answer = match[2].replace(/<[^>]*>/g, '').trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

/**
 * Extract video information from HTML content for structured data
 */
export function extractVideos(html: string, postTitle: string, postDate: string): VideoItem[] {
  const videos: VideoItem[] = [];

  // Extract YouTube videos from iframes
  const youtubeRegex = /<iframe[^>]*src=["'](?:https?:)?\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi;
  let match;

  while ((match = youtubeRegex.exec(html)) !== null) {
    const videoId = match[1];
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    videos.push({
      url,
      embedUrl,
      name: postTitle,
      description: `Video embedded in ${postTitle}`,
      thumbnailUrl,
      uploadDate: postDate,
    });
  }

  // Extract Vimeo videos
  const vimeoRegex = /<iframe[^>]*src=["'](?:https?:)?\/\/(?:www\.)?player\.vimeo\.com\/video\/([0-9]+)[^"']*["'][^>]*>[\s\S]*?<\/iframe>/gi;

  while ((match = vimeoRegex.exec(html)) !== null) {
    const videoId = match[1];
    const url = `https://vimeo.com/${videoId}`;
    const embedUrl = `https://player.vimeo.com/video/${videoId}`;

    videos.push({
      url,
      embedUrl,
      name: postTitle,
      description: `Video embedded in ${postTitle}`,
      thumbnailUrl: '', // Vimeo thumbnails require API call
      uploadDate: postDate,
    });
  }

  return videos;
}
