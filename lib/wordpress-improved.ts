/**
 * Improved WordPress REST API Library
 * Based on next-wp template with better error handling and caching
 */

import type { WordPressPost, WordPressCategory, WordPressTag, WordPressAuthor } from "@/types/wordpress";

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://blog.sparkonomy.com/wp-json/wp/v2";

if (!WORDPRESS_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not defined in environment variables");
}

/**
 * Custom error class for WordPress API errors
 */
export class WordPressAPIError extends Error {
  status: number;
  endpoint: string;

  constructor(message: string, status: number, endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

/**
 * Response interface with pagination data
 */
export interface WordPressResponse<T> {
  data: T;
  total: number;
  totalPages: number;
}

/**
 * Generic WordPress fetch function with error handling and caching
 */
async function wordpressFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${WORDPRESS_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 300, tags: ['wp'] },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API error: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      throw error;
    }
    console.error(`Error fetching from WordPress API (${endpoint}):`, error);
    throw new Error(`Failed to fetch data from WordPress: ${endpoint}`);
  }
}

/**
 * Fetch with pagination information
 */
async function wordpressFetchWithPagination<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<WordPressResponse<T>> {
  const url = `${WORDPRESS_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      next: { revalidate: 300, tags: ['wp'] },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API error: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    const data = await response.json();
    const total = parseInt(response.headers.get("X-WP-Total") || "0");
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");

    return { data, total, totalPages };
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      throw error;
    }
    console.error(`Error fetching from WordPress API (${endpoint}):`, error);
    return { data: [] as unknown as T, total: 0, totalPages: 0 };
  }
}

/**
 * Get all posts with pagination
 */
export async function getPosts(
  page: number = 1,
  perPage: number = 10
): Promise<WordPressResponse<WordPressPost[]>> {
  return wordpressFetchWithPagination<WordPressPost[]>(
    `/posts?_embed&page=${page}&per_page=${perPage}`
  );
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const posts = await wordpressFetch<WordPressPost[]>(
      `/posts?slug=${slug}&_embed`
    );
    return posts[0] || null;
  } catch (error) {
    console.error(`Error fetching post by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Get post by ID
 */
export async function getPostById(id: number): Promise<WordPressPost | null> {
  try {
    return await wordpressFetch<WordPressPost>(
      `/posts/${id}?_embed`
    );
  } catch (error) {
    console.error(`Error fetching post by ID (${id}):`, error);
    return null;
  }
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    return await wordpressFetch<WordPressCategory[]>(
      '/categories?per_page=100'
    );
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<WordPressCategory | null> {
  try {
    const categories = await wordpressFetch<WordPressCategory[]>(
      `/categories?slug=${slug}`
    );
    return categories[0] || null;
  } catch (error) {
    console.error(`Error fetching category by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Get posts by category with pagination
 */
export async function getPostsByCategory(
  categoryId: number,
  page: number = 1,
  perPage: number = 10
): Promise<WordPressResponse<WordPressPost[]>> {
  return wordpressFetchWithPagination<WordPressPost[]>(
    `/posts?categories=${categoryId}&_embed&page=${page}&per_page=${perPage}`
  );
}

/**
 * Get all tags
 */
export async function getTags(): Promise<WordPressTag[]> {
  try {
    return await wordpressFetch<WordPressTag[]>(
      '/tags?per_page=100'
    );
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Search posts
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<WordPressResponse<WordPressPost[]>> {
  return wordpressFetchWithPagination<WordPressPost[]>(
    `/posts?search=${encodeURIComponent(query)}&_embed&page=${page}&per_page=${perPage}`
  );
}

/**
 * Get all post slugs (useful for static generation)
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    let page = 1;
    let hasMore = true;
    const slugs: string[] = [];

    while (hasMore) {
      const response = await wordpressFetchWithPagination<WordPressPost[]>(
        `/posts?page=${page}&per_page=100&_fields=slug`
      );

      slugs.push(...response.data.map(post => post.slug));

      if (page >= response.totalPages) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return slugs;
  } catch (error) {
    console.error('Error fetching all post slugs:', error);
    return [];
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Strip HTML tags and decode HTML entities from text.
 * Handles all numeric/hex entities generically, plus common named entities.
 */
export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    // Generic numeric & hex entities (catches ALL numeric codes)
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    // Named entities
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&copy;/g, '©')
    .replace(/&reg;/g, '®')
    .replace(/&euro;/g, '€')
    .replace(/&deg;/g, '°')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/\[…\]/g, '…')
    .replace(/\[\.\.\.\]/g, '…')
    .trim();
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get media by ID
 */
export async function getMediaById(mediaId: number): Promise<{ source_url: string } | null> {
  if (!mediaId || mediaId === 0) {
    return null;
  }

  try {
    const media = await wordpressFetch<{ source_url: string }>(
      `/media/${mediaId}`
    );
    return media;
  } catch (error) {
    console.error(`Error fetching media by ID (${mediaId}):`, error);
    return null;
  }
}

/**
 * Get featured image URL from post (with fallback to direct media fetch)
 */
export async function getFeaturedImageUrlAsync(
  post: WordPressPost,
  size: "thumbnail" | "medium" | "large" | "full" = "full"
): Promise<string | null> {
  // First try _embedded (faster, no additional request)
  const embeddedMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  if (embeddedMedia?.source_url) {
    if (size === "full") {
      return embeddedMedia.source_url;
    }
    return embeddedMedia.media_details?.sizes?.[size]?.source_url || embeddedMedia.source_url;
  }

  // Fallback: fetch media directly using featured_media ID
  if (post.featured_media && post.featured_media > 0) {
    const media = await getMediaById(post.featured_media);
    if (media?.source_url) {
      return media.source_url;
    }
  }

  return null;
}

/**
 * Get featured image URL from post (sync version - uses only _embed data)
 */
export function getFeaturedImageUrl(
  post: WordPressPost,
  size: "thumbnail" | "medium" | "large" | "full" = "medium"
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  // If wp:featuredmedia is available and has source_url, use it
  if (media?.source_url) {
    if (size === "full") {
      return media.source_url;
    }
    return media.media_details?.sizes?.[size]?.source_url || media.source_url;
  }

  // Fallback to Yoast SEO og:image if wp:featuredmedia is not accessible
  if (post.yoast_head_json?.og_image?.[0]?.url) {
    return post.yoast_head_json.og_image[0].url;
  }

  return null;
}

/**
 * Get author name from post (returns first author for backward compatibility)
 */
export function getAuthorName(post: WordPressPost): string {
  return post._embedded?.author?.[0]?.name || "Unknown";
}

/**
 * Get all author names from post as a formatted string
 */
export function getAuthorNames(post: WordPressPost): string {
  const authors = post._embedded?.author;
  if (!authors || authors.length === 0) return "Unknown";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} and ${authors[1].name}`;
  return authors.slice(0, -1).map(a => a.name).join(", ") + ", and " + authors[authors.length - 1].name;
}

/**
 * Get all authors from post (sync - only returns _embedded authors)
 */
export function getPostAuthors(post: WordPressPost): WordPressAuthor[] {
  return post._embedded?.author || [];
}

/**
 * Fetch a Co-Authors Plus guest author by ID
 */
export async function getCoAuthorById(id: number): Promise<WordPressAuthor | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_URL}/coauthors/${id}`,
      { next: { revalidate: 300, tags: ['wp'] } }
    );

    if (!response.ok) {
      console.error(`Failed to fetch coauthor ${id}: ${response.status}`);
      return null;
    }

    const coauthor = await response.json();

    // Map Co-Authors Plus guest author to WordPressAuthor format
    return {
      id: coauthor.id,
      name: coauthor.name || coauthor.display_name || coauthor.title?.rendered || 'Unknown',
      url: coauthor.url || '',
      slug: coauthor.slug || '',
      description: coauthor.description || '',
      link: coauthor.link || '',
      avatar_urls: coauthor.avatar_urls || {},
    };
  } catch (error) {
    console.error(`Error fetching coauthor ${id}:`, error);
    return null;
  }
}

/**
 * Get all authors from post including Co-Authors Plus guest authors (async)
 * This fetches the full author data for all co-authors
 */
export async function getPostAuthorsAsync(post: WordPressPost): Promise<WordPressAuthor[]> {
  // Check if post has coauthors array (Co-Authors Plus)
  const coauthorIds = (post as any).coauthors as number[] | undefined;

  if (coauthorIds && coauthorIds.length > 0) {
    // Fetch all co-authors in parallel
    const coauthorPromises = coauthorIds.map(id => getCoAuthorById(id));
    const coauthors = await Promise.all(coauthorPromises);

    // Filter out any null results and return
    const validCoauthors = coauthors.filter((a): a is WordPressAuthor => a !== null);

    if (validCoauthors.length > 0) {
      return validCoauthors;
    }
  }

  // Fallback to _embedded authors
  return post._embedded?.author || [];
}

/**
 * Get excerpt text from post
 */
export function getExcerpt(post: WordPressPost, maxLength: number = 160): string {
  const excerpt = stripHtml(post.excerpt.rendered);
  if (excerpt.length <= maxLength) {
    return excerpt;
  }
  return excerpt.substring(0, maxLength).trim() + "...";
}

/**
 * Get reading time estimate.
 * Counts only body prose (no FAQs, TOC, captions, code, author boxes) at 250 wpm.
 */
export function getReadingTime(post: WordPressPost): number {
  const wordsPerMinute = 250;
  return Math.max(1, Math.ceil(countWords(post.content.rendered) / wordsPerMinute));
}

/**
 * Strip a tag and its content (whole element), e.g. <script>...</script>.
 * Safe for tags that don't typically nest inside themselves.
 */
function stripTagWithContent(html: string, tag: string): string {
  const re = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
  return html.replace(re, '');
}

/**
 * Strip elements (with nested children) whose class attribute matches any of the
 * given names. Uses a depth counter so nested same-tag elements are handled.
 */
function stripElementsByClass(html: string, classNames: string[]): string {
  if (!classNames.length) return html;
  const classPattern = classNames
    .map(c => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const startRegex = new RegExp(
    `<(\\w+)\\b[^>]*\\bclass\\s*=\\s*["'][^"']*\\b(?:${classPattern})\\b[^"']*["'][^>]*>`,
    'i'
  );

  let result = html;
  for (let safety = 0; safety < 200; safety++) {
    const match = startRegex.exec(result);
    if (!match) break;

    const tag = match[1].toLowerCase();
    const startIdx = match.index;
    let pos = startIdx + match[0].length;
    let depth = 1;

    const openRe = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    const closeRe = new RegExp(`<\\/${tag}\\s*>`, 'gi');

    while (depth > 0 && pos < result.length) {
      openRe.lastIndex = pos;
      closeRe.lastIndex = pos;
      const next = openRe.exec(result);
      const close = closeRe.exec(result);
      if (!close) {
        pos = result.length;
        break;
      }
      if (next && next.index < close.index) {
        depth++;
        pos = next.index + next[0].length;
      } else {
        depth--;
        pos = close.index + close[0].length;
      }
    }

    result = result.slice(0, startIdx) + result.slice(pos);
  }
  return result;
}

/**
 * Count words in an HTML string for reading-time purposes.
 *
 * Excludes content the reader skims or skips: FAQ accordions, table of
 * contents, image captions/figcaptions, code/pre blocks, scripts/styles, and
 * inline author boxes. Decodes HTML entities and matches Unicode word tokens
 * so non-English content is handled correctly.
 */
export function countWords(html: string): number {
  let cleaned = html;

  // Whole-element strips for tags that don't nest themselves
  for (const tag of ['script', 'style', 'noscript', 'pre', 'code', 'figcaption']) {
    cleaned = stripTagWithContent(cleaned, tag);
  }

  // Heading-based strip: "Frequently Asked Questions" section through the next <h2>
  cleaned = cleaned.replace(
    /<h2\b[^>]*>(?:<[^>]*>)*\s*Frequently\s+Asked\s+Questions?\s*(?:<[^>]*>)*<\/h2>[\s\S]*?(?=<h2\b|$)/gi,
    ''
  );

  // Heading-based strip: "Table of Content(s)" heading + its following list
  cleaned = cleaned.replace(
    /<h2\b[^>]*>(?:<[^>]*>)*\s*Table\s+of\s+Contents?\s*(?:<[^>]*>)*<\/h2>\s*<ul\b[^>]*>[\s\S]*?<\/ul>/gi,
    ''
  );

  // Class-based strips for blocks with nested children
  cleaned = stripElementsByClass(cleaned, [
    // Gutenberg accordion (this site's FAQ pattern) — strip whole accordion + items
    'wp-block-accordion', 'wp-block-accordion-item',
    // Other FAQ block conventions (defensive)
    'wp-block-faq', 'faq-section', 'faq-block', 'schema-faq', 'rank-math-faq',
    // Table of contents wrappers (defensive — heading-based regex above handles the common case)
    'wp-block-table-of-contents', 'table-of-contents', 'toc-list', 'toc-container', 'ez-toc',
    // Author/bio cards inside post content
    'author-box', 'author-bio', 'author-card', 'wp-author-box',
  ]);

  const text = decodeHtmlEntities(cleaned);
  const words = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return words ? words.length : 0;
}

/**
 * Get categories from post
 */
export function getPostCategories(post: WordPressPost): string[] {
  if (!post._embedded?.["wp:term"]?.[0]) {
    return [];
  }
  return post._embedded["wp:term"][0].map(term => term.name);
}

/**
 * Get tags from post
 */
export function getPostTags(post: WordPressPost): string[] {
  if (!post._embedded?.["wp:term"]?.[1]) {
    return [];
  }
  return post._embedded["wp:term"][1].map(term => term.name);
}

// ============================================================================
// AUTHOR FUNCTIONS
// ============================================================================

/**
 * Get author by ID
 */
export async function getAuthorById(id: number): Promise<WordPressAuthor | null> {
  try {
    return await wordpressFetch<WordPressAuthor>(
      `/users/${id}`
    );
  } catch (error) {
    console.error(`Error fetching author by ID (${id}):`, error);
    return null;
  }
}

/**
 * Get author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<WordPressAuthor | null> {
  try {
    const authors = await wordpressFetch<WordPressAuthor[]>(
      `/users?slug=${slug}`
    );
    return authors[0] || null;
  } catch (error) {
    console.error(`Error fetching author by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Get all authors
 */
export async function getAuthors(): Promise<WordPressAuthor[]> {
  try {
    return await wordpressFetch<WordPressAuthor[]>(
      '/users?per_page=100'
    );
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

/**
 * Get posts by author with pagination
 */
export async function getPostsByAuthor(
  authorId: number,
  page: number = 1,
  perPage: number = 10
): Promise<WordPressResponse<WordPressPost[]>> {
  return wordpressFetchWithPagination<WordPressPost[]>(
    `/posts?author=${authorId}&_embed&page=${page}&per_page=${perPage}`
  );
}

/**
 * Get posts by author slug. Works for both regular WordPress users and
 * Co-Authors Plus guest authors (slugs prefixed "cap-").
 *
 * For regular users, resolves the slug via /users?slug=... and uses
 * getPostsByAuthor. For CAP guests (no WP user), falls back to fetching
 * the most recent posts and filtering by matching coauthor slug.
 */
export async function getPostsByAuthorSlug(
  slug: string,
  perPage: number = 10
): Promise<WordPressPost[]> {
  // Regular WordPress user path
  const user = await getAuthorBySlug(slug);
  if (user?.id) {
    const { data } = await getPostsByAuthor(user.id, 1, perPage);
    if (data.length > 0) return data;
  }

  // Fallback: fetch a batch of recent posts and filter by CAP coauthor slug
  const { data: recent } = await getPosts(1, 30);
  if (recent.length === 0) return [];

  const matched: WordPressPost[] = [];
  for (const post of recent) {
    if (matched.length >= perPage) break;
    const postAuthors = await getPostAuthorsAsync(post);
    if (postAuthors.some((a) => a.slug === slug)) {
      matched.push(post);
    }
  }
  return matched;
}

/**
 * Get all author slugs (useful for static generation)
 */
export async function getAllAuthorSlugs(): Promise<string[]> {
  try {
    const authors = await wordpressFetch<WordPressAuthor[]>(
      '/users?per_page=100&_fields=slug'
    );
    return authors.map(author => author.slug);
  } catch (error) {
    console.error('Error fetching all author slugs:', error);
    return [];
  }
}

// ============================================================================
// DRAFT POSTS FUNCTIONS (For Preview Page)
// ============================================================================

/**
 * Get draft posts (requires authentication)
 * Note: This requires WordPress application password or JWT token
 */
export async function getDraftPosts(
  page: number = 1,
  perPage: number = 10
): Promise<WordPressResponse<WordPressPost[]>> {
  const username = process.env.WORDPRESS_USERNAME;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;

  if (!username || !appPassword) {
    console.error('WordPress credentials not configured for draft posts');
    return { data: [], total: 0, totalPages: 0 };
  }

  const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');
  const url = `${WORDPRESS_URL}/posts?_embed&page=${page}&per_page=${perPage}&status=draft`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API error: ${response.statusText}`,
        response.status,
        '/posts?status=draft'
      );
    }

    const data = await response.json();
    const total = parseInt(response.headers.get("X-WP-Total") || "0");
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");

    console.log('getDraftPosts response:', { data, total, totalPages, url });

    return { data, total, totalPages };
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      throw error;
    }
    console.error('Error fetching draft posts:', error);
    return { data: [], total: 0, totalPages: 0 };
  }
}

/**
 * Get draft post by slug (requires authentication)
 */
export async function getDraftPostBySlug(slug: string): Promise<WordPressPost | null> {
  const username = process.env.WORDPRESS_USERNAME;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;

  if (!username || !appPassword) {
    console.error('WordPress credentials not configured for draft posts');
    return null;
  }

  const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');
  const url = `${WORDPRESS_URL}/posts?slug=${slug}&_embed&status=draft`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API error: ${response.statusText}`,
        response.status,
        `/posts?slug=${slug}&status=draft`
      );
    }

    const posts = await response.json();
    console.log('getDraftPostBySlug response:', { slug, posts, url });
    return posts[0] || null;
  } catch (error) {
    console.error(`Error fetching draft post by slug (${slug}):`, error);
    return null;
  }
}

/**
 * Get draft post by ID (requires authentication)
 */
export async function getDraftPostById(id: number): Promise<WordPressPost | null> {
  const username = process.env.WORDPRESS_USERNAME;
  const appPassword = process.env.WORDPRESS_APP_PASSWORD;

  if (!username || !appPassword) {
    console.error('WordPress credentials not configured for draft posts');
    return null;
  }

  const credentials = Buffer.from(`${username}:${appPassword}`).toString('base64');
  const url = `${WORDPRESS_URL}/posts/${id}?_embed&status=draft`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API error: ${response.statusText}`,
        response.status,
        `/posts/${id}?status=draft`
      );
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error(`Error fetching draft post by ID (${id}):`, error);
    return null;
  }
}
