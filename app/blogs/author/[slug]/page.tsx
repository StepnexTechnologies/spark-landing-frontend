import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthorPageTemplate from "@/components/blog/AuthorPageTemplate";
import {
  getAuthorBySlug,
  getAllAuthorSlugs,
  FeaturedArticle,
  RecentArticle,
} from "@/data/authors";
import {
  getPosts,
  getPostsByAuthor,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
  getReadingTime,
} from "@/lib/wordpress-improved";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all authors
export function generateStaticParams() {
  const slugs = getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found",
      description: "The requested author could not be found.",
    };
  }

  const title = `${author.name} - Author at Sparkonomy`;
  const description = author.shortBio || `Read articles by ${author.name} on Sparkonomy. Expert insights on creator economy, content monetization, and digital marketing.`;
  const url = `https://sparkonomy.com/blogs/author/${author.slug}`;

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title,
    description,
    keywords: [
      author.name,
      "Sparkonomy author",
      "creator economy",
      "content monetization",
      "digital marketing",
      "influencer marketing",
      ...author.areasOfExpertise,
    ],
    authors: [{ name: author.name }],
    creator: author.name,
    publisher: "Sparkonomy",
    alternates: {
      canonical: url,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      siteName: "Sparkonomy",
      url: url,
      title,
      description,
      type: "profile",
      images: [
        {
          url: author.avatarUrl || "https://sparkonomy.com/sparkonomy.png",
          width: 400,
          height: 400,
          alt: author.name,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [author.avatarUrl || "https://sparkonomy.com/sparkonomy.png"],
      creator: "@sparkonomy",
      site: "@sparkonomy",
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Fetch articles from WordPress if wordpressAuthorId is set
  let featuredArticles: FeaturedArticle[] | undefined;
  let recentArticles: RecentArticle[] | undefined;

  if (author.wordpressAuthorId) {
    try {
      const { data: posts } = await getPostsByAuthor(author.wordpressAuthorId, 1, 10);

      if (posts.length > 0) {
        // First 2-3 posts as featured articles
        featuredArticles = posts.slice(0, 3).map((post) => ({
          id: String(post.id),
          title: stripHtml(post.title.rendered),
          description: stripHtml(post.excerpt.rendered).slice(0, 100) + "...",
          imageSrc: getFeaturedImageUrl(post) || "/blog/default-thumbnail.jpg",
          date: formatDate(post.date),
          readingTime: `${getReadingTime(post)} min read`,
          href: `/blogs/${post.slug}`,
        }));

        // Remaining posts as recent articles
        recentArticles = posts.slice(3).map((post) => ({
          id: String(post.id),
          title: stripHtml(post.title.rendered),
          date: formatDate(post.date),
          imageSrc: getFeaturedImageUrl(post) || "/blog/default-thumbnail.jpg",
          href: `/blogs/${post.slug}`,
        }));
      }
    } catch (error) {
      console.error("Error fetching WordPress posts for author:", error);
      // Fall back to hardcoded articles if fetch fails
    }
  }

  // Fetch latest 3 posts from WordPress for Recent Articles section (for all authors)
  try {
    const { data: latestPosts } = await getPosts(1, 3);

    if (latestPosts.length > 0) {
      recentArticles = latestPosts.map((post) => ({
        id: String(post.id),
        title: stripHtml(post.title.rendered),
        date: formatDate(post.date),
        imageSrc: getFeaturedImageUrl(post) || "/blog/default-thumbnail.jpg",
        href: `/blogs/${post.slug}`,
      }));
    }
  } catch (error) {
    console.error("Error fetching latest WordPress posts:", error);
    // Fall back to hardcoded articles if fetch fails
  }

  // Build social links array for structured data
  const sameAsLinks: string[] = [];
  if (author.socialLinks?.linkedin) sameAsLinks.push(author.socialLinks.linkedin);
  if (author.socialLinks?.twitter) sameAsLinks.push(author.socialLinks.twitter);

  // Structured data for the author page
  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `https://sparkonomy.com/blogs/author/${author.slug}`,
    image: author.avatarUrl || "",
    description: author.shortBio || `${author.name} is a writer at Sparkonomy`,
    jobTitle: author.role,
    worksFor: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://sparkonomy.com",
    },
    sameAs: sameAsLinks,
    knowsAbout: author.areasOfExpertise,
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sparkonomy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://sparkonomy.com/blogs",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: author.name,
        item: `https://sparkonomy.com/blogs/author/${author.slug}`,
      },
    ],
  };

  return (
    <>
      {/* Author Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <AuthorPageTemplate
        author={author}
        featuredArticles={featuredArticles}
        recentArticles={recentArticles}
      />
    </>
  );
}
