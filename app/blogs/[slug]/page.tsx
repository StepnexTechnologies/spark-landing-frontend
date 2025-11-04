import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getFeaturedImageUrl, getAuthorName, formatDate, stripHtml, getReadingTime } from "@/lib/wordpress-improved";
import ShareButtons from "@/components/blog/ShareButtons";
import "../wordpress-content.css";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).substring(0, 160);
  const featuredImage = getFeaturedImageUrl(post, "large");
  const author = getAuthorName(post);
  const publishedTime = post.date;
  const modifiedTime = post.modified;
  const url = `https://sparkonomy.com/blogs/${post.slug}`;

  // Use Yoast SEO data if available, otherwise fall back to defaults
  const seoTitle = post.yoast_head_json?.title || title;
  const seoDescription = post.yoast_head_json?.description || description;
  const canonical = post.yoast_head_json?.canonical || url;
  const ogImage = post.yoast_head_json?.og_image?.[0]?.url || featuredImage || "https://sparkonomy.com/sparkonomy.png";

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title: seoTitle,
    description: seoDescription,
    keywords: post._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [],
    authors: [{ name: author }],
    creator: author,
    publisher: "Sparkonomy",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      siteName: "Sparkonomy",
      url: url,
      title: post.yoast_head_json?.og_title || seoTitle,
      description: post.yoast_head_json?.og_description || seoDescription,
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: [author],
      images: [
        {
          url: ogImage,
          width: post.yoast_head_json?.og_image?.[0]?.width || 1200,
          height: post.yoast_head_json?.og_image?.[0]?.height || 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: (post.yoast_head_json?.twitter_card as "summary_large_image" | "summary") || "summary_large_image",
      title: post.yoast_head_json?.twitter_title || seoTitle,
      description: post.yoast_head_json?.twitter_description || seoDescription,
      images: [post.yoast_head_json?.twitter_image || ogImage],
      creator: post.yoast_head_json?.twitter_creator || "@sparkonomy",
      site: post.yoast_head_json?.twitter_site || "@sparkonomy",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImageUrl(post, "large");
  const author = getAuthorName(post);
  const publishDate = formatDate(post.date);
  const readingTime = getReadingTime(post);

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    image: featuredImage || "https://sparkonomy.com/sparkonomy.png",
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: author,
      url: post._embedded?.author?.[0]?.link,
    },
    publisher: {
      "@type": "Organization",
      name: "Sparkonomy",
      logo: {
        "@type": "ImageObject",
        url: "https://sparkonomy.com/sparkonomy.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sparkonomy.com/blogs/${post.slug}`,
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Load WordPress Block Styles */}
      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/style.min.css"
      />
      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/theme.min.css"
      />

      <main className="min-h-screen bg-white">
        <article className="py-12">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto px-6 mb-8">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blog
            </Link>
          </div>

          {/* Title */}
          <div className="max-w-4xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </div>

          {/* Meta Information */}
          <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {post._embedded?.author?.[0]?.avatar_urls?.["96"] && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={post._embedded.author[0].avatar_urls["96"]}
                    alt={author}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-black font-medium">{author}</p>
                <p className="text-gray-600 text-sm">{publishDate} · {readingTime} min read</p>
              </div>
            </div>

            {/* Categories */}
            {post._embedded?.["wp:term"]?.[0] && post._embedded["wp:term"][0].length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post._embedded["wp:term"][0].map((category) => (
                  <span
                    key={category.id}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          {featuredImage && (
            <div className="max-w-4xl mx-auto px-6 mb-12">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={stripHtml(post.title.rendered)}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Article Content - Rendered with WordPress styling preserved */}
          <div className="max-w-4xl mx-auto px-6">
            <div
              className="wordpress-content"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </div>

          {/* Share Section */}
          <div className="max-w-4xl mx-auto px-6">
            <ShareButtons
              title={stripHtml(post.title.rendered)}
              url={`https://sparkonomy.com/blogs/${post.slug}`}
            />
          </div>
        </article>
      </main>
    </>
  );
}
