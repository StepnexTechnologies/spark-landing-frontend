import { MetadataRoute } from 'next'
import { getAllPostSlugs, getPostBySlug } from '@/lib/wordpress-improved'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sparkonomy.com'

  // Fetch all blog posts
  let blogPosts: MetadataRoute.Sitemap = []

  try {
    const slugs = await getAllPostSlugs()

    // Generate sitemap entries for blog posts
    const postPromises = slugs.map(async (slug) => {
      const post = await getPostBySlug(slug)
      if (!post) return null

      return {
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(post.modified),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })

    const posts = await Promise.all(postPromises)
    blogPosts = posts.filter((post): post is NonNullable<typeof post> => post !== null)
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  // Static blog pages
  const staticPages = [
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blogs/company`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs/creators`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs/brand`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]

  return [...staticPages, ...blogPosts]
}
