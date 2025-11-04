import type { WordPressPost, WordPressCategory, WordPressTag } from "@/types/wordpress";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

if (!WORDPRESS_API_URL) {
  throw new Error("NEXT_PUBLIC_WORDPRESS_API_URL is not defined in environment variables");
}

/**
 * Fetch all blog posts from WordPress
 * @param page - Page number for pagination
 * @param perPage - Number of posts per page
 * @returns Array of WordPress posts
 */
export async function getPosts(
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: WordPressPost[]; totalPages: number; total: number }> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?_embed&page=${page}&per_page=${perPage}`,
      {
        cache: 'no-store', // Disable caching to always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts: WordPressPost[] = await response.json();
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
    const total = parseInt(response.headers.get("X-WP-Total") || "0");

    return { posts, totalPages, total };
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    return { posts: [], totalPages: 0, total: 0 };
  }
}

/**
 * Fetch a single blog post by slug
 * @param slug - Post slug
 * @returns WordPress post or null
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
      {
        cache: 'no-store', // Disable caching to always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const posts: WordPressPost[] = await response.json();
    return posts[0] || null;
  } catch (error) {
    console.error("Error fetching WordPress post:", error);
    return null;
  }
}

/**
 * Fetch a single blog post by ID
 * @param id - Post ID
 * @returns WordPress post or null
 */
export async function getPostById(id: number): Promise<WordPressPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts/${id}?_embed`,
      {
        cache: 'no-store', // Disable caching to always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const post: WordPressPost = await response.json();
    return post;
  } catch (error) {
    console.error("Error fetching WordPress post:", error);
    return null;
  }
}

/**
 * Fetch all categories
 * @returns Array of WordPress categories
 */
export async function getCategories(): Promise<WordPressCategory[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const categories: WordPressCategory[] = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching WordPress categories:", error);
    return [];
  }
}

/**
 * Get category by slug
 * @param slug - Category slug
 * @returns WordPress category or null
 */
export async function getCategoryBySlug(slug: string): Promise<WordPressCategory | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/categories?slug=${slug}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    const categories: WordPressCategory[] = await response.json();
    return categories[0] || null;
  } catch (error) {
    console.error("Error fetching WordPress category:", error);
    return null;
  }
}

/**
 * Fetch posts by category
 * @param categoryId - Category ID
 * @param page - Page number
 * @param perPage - Number of posts per page
 * @returns Array of WordPress posts
 */
export async function getPostsByCategory(
  categoryId: number,
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: WordPressPost[]; totalPages: number; total: number }> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?categories=${categoryId}&_embed&page=${page}&per_page=${perPage}`,
      {
        cache: 'no-store', // Disable caching to always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const posts: WordPressPost[] = await response.json();
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
    const total = parseInt(response.headers.get("X-WP-Total") || "0");

    return { posts, totalPages, total };
  } catch (error) {
    console.error("Error fetching WordPress posts by category:", error);
    return { posts: [], totalPages: 0, total: 0 };
  }
}

/**
 * Fetch all tags
 * @returns Array of WordPress tags
 */
export async function getTags(): Promise<WordPressTag[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/tags?per_page=100`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    const tags: WordPressTag[] = await response.json();
    return tags;
  } catch (error) {
    console.error("Error fetching WordPress tags:", error);
    return [];
  }
}

/**
 * Search posts
 * @param query - Search query
 * @param page - Page number
 * @param perPage - Number of posts per page
 * @returns Array of WordPress posts
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: WordPressPost[]; totalPages: number; total: number }> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?search=${encodeURIComponent(query)}&_embed&page=${page}&per_page=${perPage}`,
      {
        cache: 'no-store', // Disable caching to always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to search posts: ${response.statusText}`);
    }

    const posts: WordPressPost[] = await response.json();
    const totalPages = parseInt(response.headers.get("X-WP-TotalPages") || "1");
    const total = parseInt(response.headers.get("X-WP-Total") || "0");

    return { posts, totalPages, total };
  } catch (error) {
    console.error("Error searching WordPress posts:", error);
    return { posts: [], totalPages: 0, total: 0 };
  }
}

/**
 * Strip HTML tags from content
 * @param html - HTML string
 * @returns Plain text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Format date to readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
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
 * @param post - WordPress post
 * @param size - Image size (thumbnail, medium, large, full)
 * @returns Image URL or null
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
 * @param post - WordPress post
 * @returns Author name or "Unknown"
 */
export function getAuthorName(post: WordPressPost): string {
  return post._embedded?.author?.[0]?.name || "Unknown";
}

/**
 * Get excerpt text from post
 * @param post - WordPress post
 * @param maxLength - Maximum length of excerpt
 * @returns Excerpt text
 */
export function getExcerpt(post: WordPressPost, maxLength: number = 160): string {
  const excerpt = stripHtml(post.excerpt.rendered);
  if (excerpt.length <= maxLength) {
    return excerpt;
  }
  return excerpt.substring(0, maxLength).trim() + "...";
}
