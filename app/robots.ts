import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
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
