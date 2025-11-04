/**
 * Improved WordPress REST API Library
 * Based on next-wp template with better error handling and caching
 */

import type { WordPressPost, WordPressCategory, WordPressTag } from "@/types/wordpress";

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
  options: RequestInit = {},
  cacheTags: string[] = ['wordpress']
): Promise<T> {
  const url = `${WORDPRESS_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      next: {
        revalidate: 3600, // 1 hour cache
        tags: cacheTags,
      },
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
  options: RequestInit = {},
  cacheTags: string[] = ['wordpress']
): Promise<WordPressResponse<T>> {
  const url = `${WORDPRESS_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      next: {
        revalidate: 3600,
        tags: cacheTags,
      },
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
    `/posts?_embed&page=${page}&per_page=${perPage}`,
    {},
    ['wordpress', 'posts']
  );
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const posts = await wordpressFetch<WordPressPost[]>(
      `/posts?slug=${slug}&_embed`,
      {},
      ['wordpress', 'posts', `post-${slug}`]
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
      `/posts/${id}?_embed`,
      {},
      ['wordpress', 'posts', `post-${id}`]
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
      '/categories?per_page=100',
      {},
      ['wordpress', 'categories']
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
      `/categories?slug=${slug}`,
      {},
      ['wordpress', 'categories', `category-${slug}`]
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
    `/posts?categories=${categoryId}&_embed&page=${page}&per_page=${perPage}`,
    {},
    ['wordpress', 'posts', `category-${categoryId}`]
  );
}

/**
 * Get all tags
 */
export async function getTags(): Promise<WordPressTag[]> {
  try {
    return await wordpressFetch<WordPressTag[]>(
      '/tags?per_page=100',
      {},
      ['wordpress', 'tags']
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
    `/posts?search=${encodeURIComponent(query)}&_embed&page=${page}&per_page=${perPage}`,
    {},
    ['wordpress', 'posts', 'search']
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
        `/posts?page=${page}&per_page=100&_fields=slug`,
        {},
        ['wordpress', 'posts']
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
 * Get featured image URL from post
 */
export function getFeaturedImageUrl(
  post: WordPressPost,
  size: "thumbnail" | "medium" | "large" | "full" = "medium"
): string | null {
  if (!post._embedded?.["wp:featuredmedia"]?.[0]) {
    return null;
  }

  const media = post._embedded["wp:featuredmedia"][0];

  if (size === "full") {
    return media.source_url;
  }

  return media.media_details?.sizes?.[size]?.source_url || media.source_url;
}

/**
 * Get author name from post
 */
export function getAuthorName(post: WordPressPost): string {
  return post._embedded?.author?.[0]?.name || "Unknown";
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
 * Get reading time estimate
 */
export function getReadingTime(post: WordPressPost): number {
  const text = stripHtml(post.content.rendered);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
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
