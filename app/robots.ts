import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/urls'

// Fail-open: only an explicit dev.* SITE_URL is treated as non-prod, so a missing
// or misconfigured value can't accidentally disallow crawling on production.
const isProduction = !process.env.SITE_URL?.startsWith('https://dev.')

const PRIVATE_PATHS = ['/api/', '/admin']

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
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: '/',
      },
    ],
    sitemap: [
      siteUrl('/sitemap.xml'),
      siteUrl('/blogs/sitemap.xml'),
    ],
  }
}
