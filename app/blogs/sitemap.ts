import { MetadataRoute } from 'next'
import { getAllPostSlugs, getPostBySlug } from '@/lib/wordpress-improved'
import { authors } from '@/data/authors'
import { SITE_URL, authorUrl } from '@/lib/urls'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL

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

  // Author/profile pages — entity pages for the founders + content team.
  // Indexable (rich expert bios + ProfilePage schema), so include them for
  // discovery. Served at /blogs/author/<slug>.
  const authorPages: MetadataRoute.Sitemap = authors.map((a) => {
    // Use the author's own lastUpdated date so the sitemap reflects real profile
    // freshness instead of stamping "modified now" on every build.
    const parsed = a.lastUpdated ? new Date(`${a.lastUpdated} UTC`) : null
    return {
      url: authorUrl(a.slug),
      lastModified: parsed && !Number.isNaN(parsed.getTime()) ? parsed : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  })

  return [...staticPages, ...authorPages, ...blogPosts]
}
