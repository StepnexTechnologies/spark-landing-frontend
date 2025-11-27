import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  getAuthorBySlug,
  getPostsByAuthor,
  getAllAuthorSlugs,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
  getReadingTime,
} from "@/lib/wordpress-improved";
import Card from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import Breadcrumb from "@/components/blog/Breadcrumb";
import NewsletterSection from "@/components/blog/NewsletterSection";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all authors
export async function generateStaticParams() {
  const slugs = await getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: "Author Not Found",
      description: "The requested author could not be found.",
    };
  }

  const title = `${author.name} - Author at Sparkonomy`;
  const description = author.description || `Read articles by ${author.name} on Sparkonomy. Expert insights on creator economy, content monetization, and digital marketing.`;
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
    ],
    authors: [{ name: author.name, url: author.url }],
    creator: author.name,
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
      title,
      description,
      type: "profile",
      images: [
        {
          url: author.avatar_urls?.["96"] || "https://sparkonomy.com/sparkonomy.png",
          width: 96,
          height: 96,
          alt: author.name,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [author.avatar_urls?.["96"] || "https://sparkonomy.com/sparkonomy.png"],
      creator: "@sparkonomy",
      site: "@sparkonomy",
    },
  };
}

// Author Profile Card Component
function AuthorProfileCard({
  name,
  description,
  avatarUrl,
  postCount,
}: {
  name: string;
  description: string;
  avatarUrl: string;
  postCount: number;
}) {
  return (
    <div className="bg-white rounded-3xl border border-[#F2F2F2] p-6 md:p-8 lg:p-10">
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        {avatarUrl && (
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 ring-4 ring-purple-100">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Name */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#212529] mb-2">
          {name}
        </h1>

        {/* Role */}
        <p className="text-sm md:text-base text-[#9747FF] font-medium mb-4">
          Technical Writer | Sparkonomy
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-[#212529]">{postCount}</p>
            <p className="text-sm text-[#6B7280]">Articles</p>
          </div>
        </div>

        {/* Bio */}
        {description && (
          <div className="border-l-4 border-purple-600 pl-4 text-left max-w-2xl">
            <p className="text-sm md:text-base text-[#6B7280] leading-relaxed">
              {description}
            </p>
          </div>
        )}

        {/* Social Links */}
        <div className="flex items-center gap-4 mt-6">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-purple-100 hover:text-purple-600 transition-colors"
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-purple-100 hover:text-purple-600 transition-colors"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-purple-100 hover:text-purple-600 transition-colors"
            aria-label="YouTube"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F2F2F2] text-[#6B7280] hover:bg-purple-100 hover:text-purple-600 transition-colors"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Author Posts List Component
async function AuthorPostsList({ authorId, authorSlug }: { authorId: number; authorSlug: string }) {
  const { data: posts, total } = await getPostsByAuthor(authorId, 1, 20);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No articles yet</h2>
        <p className="text-gray-600">
          This author hasn't published any articles yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <Card
          key={post.id}
          title={stripHtml(post.title.rendered)}
          description={stripHtml(post.excerpt.rendered)}
          imageSrc={getFeaturedImageUrl(post) || undefined}
          href={`/blogs/${post.slug}`}
          layout="vertical"
          descriptionPosition="bottom"
          imagePriority={false}
          showReadMore={true}
          meta={
            <span className="flex items-center gap-2">
              <span>{formatDate(post.date)}</span>
              <span>·</span>
              <span>{getReadingTime(post)} min read</span>
            </span>
          }
        />
      ))}
    </div>
  );
}

// Loading skeleton for posts
function AuthorPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <BlogCardSkeleton key={i} layout="vertical" />
      ))}
    </div>
  );
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Get total post count
  const { total: postCount } = await getPostsByAuthor(author.id, 1, 1);

  // Structured data for the author page
  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `https://sparkonomy.com/blogs/author/${author.slug}`,
    image: author.avatar_urls?.["96"] || "",
    description: author.description || `${author.name} is a writer at Sparkonomy`,
    jobTitle: "Technical Writer",
    worksFor: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://sparkonomy.com",
    },
    sameAs: [
      "https://www.linkedin.com",
      "https://www.instagram.com",
      "https://www.youtube.com",
      "https://twitter.com",
    ],
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

      <main className="min-h-screen bg-white">
        {/* Header Section with Gradient Background */}
        <div className="relative">
          {/* Gradient Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'linear-gradient(169.7deg, #DD2A7B 1.49%, #9747FF 42.07%, #334CCA 99.84%)',
              filter: 'blur(300px)',
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Breadcrumb
                items={[
                  { label: "Blog", href: "/blogs" },
                  { label: author.name },
                ]}
              />
            </div>

            {/* Author Profile Card */}
            <AuthorProfileCard
              name={author.name}
              description={author.description || "Passionate about the creator economy and helping creators monetize their content effectively."}
              avatarUrl={author.avatar_urls?.["96"] || ""}
              postCount={postCount}
            />
          </div>
        </div>

        {/* Articles Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#212529]">
              Articles by {author.name}
            </h2>
            <p className="text-[#6B7280] mt-2">
              {postCount} {postCount === 1 ? "article" : "articles"} published
            </p>
          </div>

          <Suspense fallback={<AuthorPostsSkeleton />}>
            <AuthorPostsList authorId={author.id} authorSlug={author.slug} />
          </Suspense>
        </div>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>
    </>
  );
}
