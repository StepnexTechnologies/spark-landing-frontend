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
      cache: 'no-store',
      next: { revalidate: 0 },
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
      cache: 'no-store',
      next: { revalidate: 0 },
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
    console.log('getDraftPostById response:', { id, post, url });
    return post;
  } catch (error) {
    console.error(`Error fetching draft post by ID (${id}):`, error);
    return null;
  }
}
