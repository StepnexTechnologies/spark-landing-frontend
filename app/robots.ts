import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/urls'

// Fail-open: only an explicit dev.* SITE_URL is treated as non-prod, so a missing
// or misconfigured value can't accidentally disallow crawling on production.
const isProduction = !process.env.SITE_URL?.startsWith('https://dev.')

const PRIVATE_PATHS = ['/api/', '/admin']

// Unlisted pages: shared directly with the people they are meant for, never
// discovered. They stay crawlable by generic bots ONLY so those bots can read
// the page's own noindex directive — a robots.txt block would hide the very
// tag that keeps them out of the index. Answer engines are blocked outright
// because they do not reliably honour noindex.
const UNLISTED_PATHS = [
  '/legal/trusted-partner-terms',
  '/legal/trusted-partner-program-guide',
]

// Marketing content we are happy to have absorbed into model weights, so that
// assistants know what Sparkonomy is without having to fetch us first. `/$`
// anchors the homepage — a bare `/` would read as "allow the whole site". The
// rest are prefixes: `/blogs` covers every post, category and author page, and
// `/creator/promo` also covers `/creator/promo-f` and `/creator/promo-w`.
// Longest-match wins over the group's `disallow: '/'`, so everything not listed
// here (waitlist funnels, invites, legal, previews, contact) stays blocked.
// Must match the training-allowed sources in next.config.ts and middleware.ts —
// a Content-Signal header that contradicts robots.txt is worse than either rule
// on its own.
const AI_TRAINING_ALLOWED = [
  '/$',
  '/blogs',
  '/creator/earn',
  '/creator/promo',
]

const AI_TRAINING_BOTS = [
  'GPTBot',
  'anthropic-ai',
  'ClaudeBot',
  'Claude-Web',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'Bytespider',
  'cohere-ai',
]

// Search and answer-engine crawlers are explicitly allowed to discover public
// content. They repeat PRIVATE_PATHS because named groups do not inherit the
// wildcard group's rules.
const AI_SEARCH_BOTS = [
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
  'YouBot',
]

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: [
      // Generic search, research, and discovery crawlers may access all public
      // pages. Preview pages stay crawlable so their noindex directive works.
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      {
        userAgent: AI_SEARCH_BOTS,
        allow: '/',
        disallow: [...PRIVATE_PATHS, ...UNLISTED_PATHS],
      },
      // Training crawlers get the marketing surface only.
      {
        userAgent: AI_TRAINING_BOTS,
        allow: AI_TRAINING_ALLOWED,
        disallow: '/',
      },
    ],
    sitemap: [
      siteUrl('/sitemap.xml'),
      siteUrl('/blogs/sitemap.xml'),
    ],
  }
}
