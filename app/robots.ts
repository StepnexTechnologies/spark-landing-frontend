import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.SITE_URL === 'https://sparkonomy.com'

  if (!isProduction) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: [
      'https://sparkonomy.com/sitemap.xml',
      'https://sparkonomy.com/blogs/sitemap.xml',
    ],
  }
}
