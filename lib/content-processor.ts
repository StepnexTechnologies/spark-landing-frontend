/**
 * Content processor for WordPress HTML
 * Removes WordPress TOC and extracts headings for custom TOC
 */

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
 * Remove WordPress built-in Table of Contents from HTML
 */
export function removeWordPressTOC(html: string): string {
  let cleaned = html;

  // Remove Table of Contents heading and its immediately following list
  // Match: <h2>Table of Contents</h2> followed by whitespace and <ul>...</ul>
  cleaned = cleaned.replace(
    /<h2[^>]*>(?:<[^>]*>)*\s*Table of Contents?\s*(?:<[^>]*>)*<\/h2>\s*<ul[^>]*class="wp-block-list"[^>]*>[\s\S]*?<\/ul>/gi,
    ''
  );

  // Also try without the class restriction (backup)
  cleaned = cleaned.replace(
    /<h2[^>]*>(?:<[^>]*>)*\s*Table of Contents?\s*(?:<[^>]*>)*<\/h2>\s*<ul[^>]*>(?:<li[^>]*>[\s\S]*?<\/li>\s*)*<\/ul>/gi,
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

/**
 * Extract FAQ items from HTML content for structured data
 */
export function extractFAQs(html: string): FAQItem[] {
  const faqs: FAQItem[] = [];

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
