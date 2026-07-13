import React, { Suspense } from "react";
import type { Metadata } from "next";
import Card from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogPostsSkeleton from "@/components/blog/BlogPostsSkeleton";
import BlogPagination from "@/components/blog/BlogPagination";
import MainSection from "@/components/blog/MainSection";
import MainSectionSkeleton from "@/components/blog/MainSectionSkeleton";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { getPosts, getPostsByCategory, getCategoryBySlug, getPostTags, decodeHtmlEntities } from "@/lib/wordpress-improved";

export const revalidate = 300;

// Posts shown in the grid per page. The page-1 hero + featured Company tile are
// rendered on top of this and are not counted toward the per-page grid window.
const POSTS_PER_PAGE = 12;
const BLOG_URL = "https://www.sparkonomy.com/blogs";

interface BlogsPageProps {
  searchParams: Promise<{ page?: string }>;
}

// Parse ?page into a positive integer, defaulting to 1 for missing/garbage input.
function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({ searchParams }: BlogsPageProps): Promise<Metadata> {
  const currentPage = parsePage((await searchParams).page);
  const canonical = currentPage > 1 ? `${BLOG_URL}?page=${currentPage}` : BLOG_URL;
  const titleSuffix = currentPage > 1 ? ` - Page ${currentPage}` : "";

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title: `Blog${titleSuffix} | Sparkonomy - Tips for Creators, Influencers, YouTubers & Instagrammers`,
    description: "Discover the latest insights, tips, and strategies for Creators, influencers, YouTubers & Instagrammers to monetize content, grow their audience, and succeed in the Creator economy. Expert guides from Sparkonomy.",
    keywords: [
      "creator economy",
      "content monetization",
      "creator tips",
      "influencer tips",
      "passive income",
      "influencer marketing",
      "content creation",
      "digital creators",
      "social media influencers",
      "instagrammers",
      "youtubers",
      "instagram influencer tips",
      "youtube creator tips",
      "content creator monetization",
      "influencer platform",
      "Sparkonomy blog",
    ],
    authors: [{ name: "Sparkonomy Team" }],
    creator: "Sparkonomy",
    publisher: "Sparkonomy",
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      siteName: "Sparkonomy",
      title: "Blog | Sparkonomy - Tips for Creators, Influencers & YouTubers",
      description: "Insights, tips & strategies for Creators, influencers, YouTubers & Instagrammers to monetize content and succeed in the Creator economy.",
      url: canonical,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "https://www.sparkonomy.com/sparkonomy.png",
          width: 1200,
          height: 630,
          alt: "Sparkonomy Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog | Sparkonomy - Tips for Creators, Influencers & YouTubers",
      description: "Insights, tips & strategies for Creators, influencers, YouTubers & Instagrammers to monetize content and succeed in the Creator economy.",
      images: ["https://www.sparkonomy.com/sparkonomy.png"],
      creator: "@sparkonomy",
      site: "@sparkonomy",
    },
  };
}

// Latest posts from the Company category (slugs match the /blogs/company page config).
async function getLatestCompanyPosts() {
  const categories = await Promise.all(
    ["company", "company-en"].map((s) => getCategoryBySlug(s))
  );
  const ids = categories.filter((c): c is NonNullable<typeof c> => c !== null).map((c) => c.id);
  if (ids.length === 0) return [];
  const { data } = await getPostsByCategory(ids, 1, 6);
  return data.filter((p) => !p.slug.endsWith("-hi"));
}

async function getEnglishPosts() {
  const { data } = await getPosts(1, 100);
  return data.filter((p) => !p.slug.endsWith("-hi"));
}

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const cardImage = (p: { _embedded?: any; yoast_head_json?: any }) =>
  p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url;

async function BlogPosts({ currentPage }: { currentPage: number }) {
  const [englishPosts, companyPosts] = await Promise.all([
    getEnglishPosts(),
    getLatestCompanyPosts(),
  ]);

  if (englishPosts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No blog posts yet</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We're working on bringing you amazing content. Check back soon!
        </p>
      </div>
    );
  }


  const heroPost = englishPosts[0];
  const companyPost = companyPosts.find((p) => p.id !== heroPost.id) ?? null;
  const gridPool = englishPosts.filter(
    (p) => p.id !== heroPost.id && p.id !== companyPost?.id
  );

  const totalPages = Math.max(1, Math.ceil(gridPool.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const isFirstPage = safePage === 1;
  const start = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = gridPool.slice(start, start + POSTS_PER_PAGE);

  // Page 1 keeps the editorial layout (3-card row → featured Company tile →
  // remaining grid). Later pages render a plain grid of the page's posts.
  const firstRowPosts = isFirstPage ? pagePosts.slice(0, 3) : [];
  const remainingPosts = isFirstPage ? pagePosts.slice(3) : pagePosts;

  return (
    <>
      {isFirstPage && (
        <>
          {/* First Row - 3 vertical cards */}
          <div className="max-w-7xl mx-auto px-4 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:mb-12">
              {firstRowPosts.map((p) => (
                <Card
                  key={p.id}
                  title={decodeHtmlEntities(p.title.rendered)}
                  description={decodeHtmlEntities(p.excerpt.rendered)}
                  imageSrc={cardImage(p)}
                  href={`/blogs/${p.slug}`}
                  layout="vertical"
                  descriptionPosition="bottom"
                  imagePriority={true}
                  showReadMore={true}
                  meta={<span>{dateLabel(p.date)}</span>}
                />
              ))}
            </div>
          </div>

          {/* Second Row - 1 featured horizontal card (full width, no container) */}
          {companyPost && (
            <div className="w-full md:mb-12">
              <FeaturedBlogCard
                key={companyPost.id}
                title={decodeHtmlEntities(companyPost.title.rendered)}
                description={decodeHtmlEntities(companyPost.excerpt.rendered)}
                imageSrc={cardImage(companyPost)}
                href={`/blogs/${companyPost.slug}`}
                tag="Company"
                imagePriority={true}
                meta={<span>{dateLabel(companyPost.date)}</span>}
              />
            </div>
          )}
        </>
      )}

      {/* Grid of posts for this page */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {remainingPosts.map((p) => (
            <Card
              key={p.id}
              title={decodeHtmlEntities(p.title.rendered)}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={cardImage(p)}
              href={`/blogs/${p.slug}`}
              layout="vertical"
              descriptionPosition="bottom"
              imagePriority={false}
              showReadMore={true}
              meta={<span>{dateLabel(p.date)}</span>}
            />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <BlogPagination currentPage={safePage} totalPages={totalPages} />
      </div>
    </>
  );
}


async function HeroSection() {
  const { data: posts } = await getPosts(1, 5);
  const englishPosts = posts.filter((p) => !p.slug.endsWith("-hi"));

  if (englishPosts.length === 0) {
    return null;
  }

  const heroPost = englishPosts[0];
  const allTags = getPostTags(heroPost);

  // Check for alignment tag (#left/#right or left/right), default to left
  const alignmentTag = allTags.find(tag => {
    const normalized = tag.toLowerCase().replace("#", "");
    return normalized === "left" || normalized === "right";
  });
  const textAlign: "left" | "right" = alignmentTag?.toLowerCase().replace("#", "") === "right" ? "right" : "left";

  // Filter out alignment tags from display tags
  const displayTags = allTags.filter(tag => {
    const normalized = tag.toLowerCase().replace("#", "");
    return normalized !== "left" && normalized !== "right";
  });

  return (
    <MainSection
      title={decodeHtmlEntities(heroPost.title.rendered)}
      subtitle=""
      description={decodeHtmlEntities(heroPost.excerpt.rendered)}
      buttonText="Read More"
      buttonLink={`/blogs/${heroPost.slug}`}
      imageSrc={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || heroPost.yoast_head_json?.og_image?.[0]?.url || "/MainImage.svg"}
      hashtags={displayTags.length > 0 ? displayTags : ["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"]}
      textAlign={textAlign}
    />
  );
}

export default async function Home({ searchParams }: BlogsPageProps) {
  const currentPage = parsePage((await searchParams).page);

  // Blog structured data for listing page
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sparkonomy Blog - For Creators, Influencers, YouTubers & Instagrammers",
    description: "Insights, tips, and strategies for Creators, influencers, YouTubers, Instagrammers and social media influencers to monetize content and succeed in the creator economy.",
    url: "https://www.sparkonomy.com/blogs",
    publisher: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://www.sparkonomy.com",
      logo: {
        "@type": "ImageObject",
        url: "https://www.sparkonomy.com/sparkonomy.png",
      },
    },
    inLanguage: "en-US",
  };

  // Breadcrumb for blog listing
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.sparkonomy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.sparkonomy.com/blogs",
      },
    ],
  };

  return (
    <main className="relative overflow-hidden">
      {/* Blog Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Main Section with Background Image — hero only leads the first page */}
      {currentPage === 1 && (
        <div className="relative z-10">
          <Suspense fallback={<MainSectionSkeleton />}>
            <HeroSection />
          </Suspense>
        </div>
      )}

      {/* Blog Posts Section with Gradient Background */}
      <div className="relative py-12" id="posts">
        {/* Linear Gradient Background with Blur - only for posts section */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(169.7deg, #DD2A7B 1.49%, #9747FF 42.07%, #334CCA 99.84%)',
            filter: 'blur(300px)'
          }}
        />

        <div className="relative z-10">
          <Suspense key={currentPage} fallback={<BlogPostsSkeleton />}>
            <BlogPosts currentPage={currentPage} />
          </Suspense>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}
