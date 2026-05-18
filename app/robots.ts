import type { MetadataRoute } from 'next'

// Fail-open: only an explicit dev.* SITE_URL is treated as non-prod, so a missing
// or misconfigured value can't accidentally disallow crawling on production.
const isProduction = !process.env.SITE_URL?.startsWith('https://dev.')

const AI_BOTS = [
  // AI training crawlers
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
  // AI search / answer engines (user-initiated fetches)
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'YouBot',
]

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'DuckDuckBot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: [
      'https://www.sparkonomy.com/sitemap.xml',
      'https://www.sparkonomy.com/blogs/sitemap.xml',
    ],
  }
}
