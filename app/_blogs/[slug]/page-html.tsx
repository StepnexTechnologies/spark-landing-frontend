import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchWordPressHTML, extractWordPressStylesheets } from "@/lib/wordpress-html";
import ShareButtons from "@/components/blog/ShareButtons";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await fetchWordPressHTML(slug);

  if (!pageData) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const url = `https://sparkonomy.com/blogs/${slug}`;

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title: pageData.title,
    description: pageData.excerpt,
    authors: pageData.author ? [{ name: pageData.author }] : [],
    creator: pageData.author || "Sparkonomy",
    publisher: "Sparkonomy",
    alternates: {
      canonical: url,
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
      title: pageData.title,
      description: pageData.excerpt,
      type: "article",
      publishedTime: pageData.date,
      authors: pageData.author ? [pageData.author] : [],
      images: pageData.featuredImage
        ? [
            {
              url: pageData.featuredImage,
              width: 1200,
              height: 630,
              alt: pageData.title,
            },
          ]
        : [],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.title,
      description: pageData.excerpt,
      images: pageData.featuredImage ? [pageData.featuredImage] : [],
      creator: "@sparkonomy",
      site: "@sparkonomy",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const pageData = await fetchWordPressHTML(slug);

  if (!pageData) {
    notFound();
  }

  // Fetch the full HTML to extract stylesheets
  const fullHTML = await fetch(`https://blog.sparkonomy.com/${slug}/`).then(res => res.text());
  const stylesheets = extractWordPressStylesheets(fullHTML);

  return (
    <>
      {/* Load WordPress stylesheets */}
      {stylesheets.map((href, index) => (
        <link key={index} rel="stylesheet" href={href} />
      ))}

      <main className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-6 py-8">
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

        {/* WordPress Content - Rendered exactly as it appears on WordPress */}
        <article
          className="wordpress-content max-w-7xl mx-auto px-6 pb-16"
          dangerouslySetInnerHTML={{ __html: pageData.html }}
        />

        {/* Share Section */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <ShareButtons
            title={pageData.title}
            url={`https://sparkonomy.com/blogs/${slug}`}
          />
        </div>
      </main>

      <style jsx global>{`
        /* Ensure WordPress content displays correctly */
        .wordpress-content {
          /* Let WordPress styles take precedence */
          all: initial;
          display: block;
          font-family: inherit;
        }

        .wordpress-content * {
          all: revert;
        }

        /* Fix any layout issues */
        .wordpress-content img {
          max-width: 100%;
          height: auto;
        }

        .wordpress-content iframe,
        .wordpress-content video {
          max-width: 100%;
        }

        /* Ensure links work properly */
        .wordpress-content a {
          color: #2563eb;
          text-decoration: underline;
        }

        .wordpress-content a:hover {
          color: #1d4ed8;
        }
      `}</style>
    </>
  );
}
