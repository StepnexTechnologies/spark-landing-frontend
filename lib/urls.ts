// Single source of truth for site URLs.
//
// The host and each route's path live here ONCE so that canonicals, JSON-LD,
// the sitemap, and internal links all derive from the same place and cannot
// drift apart. (A hand-typed per-author `canonicalPath` once pointed authors at
// a non-existent `/authors/<slug>` URL — deriving from `slug` makes that class
// of bug unrepresentable.)
//
// SITE_URL is for navigable URLs (canonical, OG, sitemap) and schema IDs.

const configuredSiteUrl = (
  process.env.SITE_URL ?? "https://www.sparkonomy.com"
).replace(/\/+$/, "");
const legacySiteUrl = "https://" + "sparkonomy.com";

// Preserve the canonical www origin even if the production secret still has
// the legacy non-www value during rollout. Dev/staging origins remain unchanged.
export const SITE_URL =
  configuredSiteUrl === legacySiteUrl
    ? "https://www.sparkonomy.com"
    : configuredSiteUrl;

/** Build an absolute URL on the configured canonical origin. */
export const siteUrl = (path = ""): string => {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

export const ORGANIZATION_ID = siteUrl("/#organization");
export const WEBSITE_ID = siteUrl("/#website");
export const ORGANIZATION_SOCIAL_URLS = [
  "https://x.com/SparkonomySays",
  "https://www.linkedin.com/company/sparkonomy/",
  "https://www.instagram.com/sparkonomy.official/",
  "https://www.youtube.com/@Sparkonomy.official",
  "https://www.reddit.com/user/Sparkonomy/",
] as const;

/** Relative path to an author page — use for canonicals (resolved by metadataBase). */
export const authorPath = (slug: string): string => `/blogs/author/${slug}`;

/** Absolute URL to an author page — use where an absolute URL is required (JSON-LD, sitemap). */
export const authorUrl = (slug: string): string => siteUrl(authorPath(slug));

/**
 * Extract an `@handle` from a twitter.com / x.com profile URL, ignoring any
 * trailing path or query string (e.g. `?s=21`). Returns undefined when no
 * handle can be parsed — callers fall back to the brand handle.
 */
export const twitterHandle = (url?: string): string | undefined => {
  const m = url?.match(/(?:twitter\.com|x\.com)\/@?([A-Za-z0-9_]{1,15})/i);
  return m ? `@${m[1]}` : undefined;
};
