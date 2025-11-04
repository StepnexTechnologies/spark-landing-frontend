/**
 * WordPress HTML Fetcher
 * Fetches actual HTML content from WordPress pages to preserve exact styling
 */

const WORDPRESS_BASE_URL = "https://blog.sparkonomy.com";

export interface WordPressPageData {
  html: string;
  title: string;
  excerpt: string;
  featuredImage?: string;
  author?: string;
  date?: string;
  categories?: string[];
}

/**
 * Fetch and parse HTML content from a WordPress page
 * @param slug - Post slug
 * @returns Parsed page data with HTML content
 */
export async function fetchWordPressHTML(slug: string): Promise<WordPressPageData | null> {
  try {
    const url = `${WORDPRESS_BASE_URL}/${slug}/`;
    const response = await fetch(url, {
      cache: 'no-store', // Always fetch fresh content
      headers: {
        'User-Agent': 'Sparkonomy-Frontend/1.0',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch WordPress page: ${response.statusText}`);
      return null;
    }

    const html = await response.text();

    // Parse the HTML to extract necessary data
    const data = parseWordPressHTML(html);

    return data;
  } catch (error) {
    console.error("Error fetching WordPress HTML:", error);
    return null;
  }
}

/**
 * Parse WordPress HTML to extract content and metadata
 * @param html - Raw HTML from WordPress
 * @returns Structured page data
 */
function parseWordPressHTML(html: string): WordPressPageData {
  // Extract title from <title> tag
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(' - Sparkonomy Blog', '').trim() : '';

  // Extract meta description
  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
  const excerpt = descMatch ? descMatch[1] : '';

  // Extract Open Graph image
  const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)"/i);
  const featuredImage = ogImageMatch ? ogImageMatch[1] : undefined;

  // Extract author
  const authorMatch = html.match(/<meta name="author" content="(.*?)"/i) ||
                       html.match(/<span class="author.*?>(.*?)<\/span>/i);
  const author = authorMatch ? authorMatch[1] : undefined;

  // Extract publish date
  const dateMatch = html.match(/<time.*?datetime="(.*?)".*?>/i) ||
                     html.match(/<meta property="article:published_time" content="(.*?)"/i);
  const date = dateMatch ? dateMatch[1] : undefined;

  // Extract main content
  // Look for common WordPress content containers
  let content = '';

  // Try different common WordPress content selectors
  const contentPatterns = [
    /<article[^>]*class="[^"]*post[^"]*"[^>]*>(.*?)<\/article>/is,
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>(.*?)<\/div>/is,
    /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>(.*?)<\/div>/is,
    /<main[^>]*>(.*?)<\/main>/is,
  ];

  for (const pattern of contentPatterns) {
    const match = html.match(pattern);
    if (match) {
      content = match[1];
      break;
    }
  }

  // If no content found, try to extract everything between main tags
  if (!content) {
    const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
    content = bodyMatch ? bodyMatch[1] : html;
  }

  // Clean up content - remove unwanted elements
  content = cleanWordPressContent(content);

  return {
    html: content,
    title,
    excerpt,
    featuredImage,
    author,
    date,
  };
}

/**
 * Clean WordPress content HTML
 * Removes navigation, sidebars, footers, and other non-content elements
 */
function cleanWordPressContent(html: string): string {
  let cleaned = html;

  // Remove script tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove style tags (keep inline styles)
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // Remove navigation elements
  cleaned = cleaned.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '');

  // Remove header elements (but keep h1, h2, etc.)
  cleaned = cleaned.replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi, '');

  // Remove footer elements
  cleaned = cleaned.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '');

  // Remove sidebar elements
  cleaned = cleaned.replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*sidebar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Remove WordPress admin bar
  cleaned = cleaned.replace(/<div[^>]*id="wpadminbar"[^>]*>[\s\S]*?<\/div>/gi, '');

  // Fix relative URLs to absolute
  cleaned = cleaned.replace(/src="\/wp-content\//g, 'src="https://blog.sparkonomy.com/wp-content/');
  cleaned = cleaned.replace(/href="\/wp-content\//g, 'href="https://blog.sparkonomy.com/wp-content/');

  // Fix relative image URLs
  cleaned = cleaned.replace(/src="\/uploads\//g, 'src="https://blog.sparkonomy.com/uploads/');

  return cleaned;
}

/**
 * Fetch WordPress blog listing page
 * @returns HTML content of blog listing
 */
export async function fetchWordPressBlogListing(): Promise<string | null> {
  try {
    const response = await fetch(WORDPRESS_BASE_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Sparkonomy-Frontend/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extract just the posts listing
    const contentMatch = html.match(/<main[^>]*>(.*?)<\/main>/is);
    if (!contentMatch) return html;

    let content = contentMatch[1];
    content = cleanWordPressContent(content);

    return content;
  } catch (error) {
    console.error("Error fetching WordPress blog listing:", error);
    return null;
  }
}

/**
 * Fetch WordPress category page
 * @param category - Category slug
 * @returns HTML content of category page
 */
export async function fetchWordPressCategoryPage(category: string): Promise<string | null> {
  try {
    const url = `${WORDPRESS_BASE_URL}/category/${category}/`;
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Sparkonomy-Frontend/1.0',
      },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    const contentMatch = html.match(/<main[^>]*>(.*?)<\/main>/is);
    if (!contentMatch) return html;

    let content = contentMatch[1];
    content = cleanWordPressContent(content);

    return content;
  } catch (error) {
    console.error("Error fetching WordPress category page:", error);
    return null;
  }
}

/**
 * Extract WordPress stylesheet URLs from HTML
 * @param html - WordPress HTML
 * @returns Array of stylesheet URLs
 */
export function extractWordPressStylesheets(html: string): string[] {
  const stylesheets: string[] = [];
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["'](.*?)["']/gi;

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];

    // Convert relative URLs to absolute
    if (href.startsWith('/')) {
      href = `https://blog.sparkonomy.com${href}`;
    }

    // Only include WordPress stylesheets
    if (href.includes('wp-content') || href.includes('wp-includes')) {
      stylesheets.push(href);
    }
  }

  return stylesheets;
}

/**
 * Format date string to readable format
 * @param dateString - ISO date string
 * @returns Formatted date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
