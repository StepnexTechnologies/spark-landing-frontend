import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategoryBySlug, getPostsByCategory, getPostTags } from "@/lib/wordpress-improved";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import MainSection from "@/components/blog/MainSection";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Creators | Sparkonomy Blog",
  description: "Insights and updates for creators on Sparkonomy",
  alternates: {
    canonical: "https://sparkonomy.com/blogs/creators",
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
    url: "https://sparkonomy.com/blogs/creators",
    title: "Creators | Sparkonomy Blog",
    description: "Insights and updates for creators on Sparkonomy",
    images: [
      {
        url: "/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Creators Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creators | Sparkonomy Blog",
    description: "Insights and updates for creators on Sparkonomy",
    images: ["/sparkonomy.png"],
    site: "@sparkonomy",
    creator: "@sparkonomy",
  },
};

async function CreatorsPosts() {
  const category = await getCategoryBySlug("creators");
  const { data: posts } = category
    ? await getPostsByCategory(category.id, 1, 13)
    : { data: [] };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No posts in this category yet</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We're working on bringing you creator-focused content. Check back soon!
        </p>
        {!category && (
          <div className="mt-6 text-sm text-gray-500">
            <p>Make sure to create a &quot;creators&quot; category in your WordPress site.</p>
          </div>
        )}
      </div>
    );
  }

  const firstRowPosts = posts.slice(1, 3);
  const secondRowPost = posts.slice(3, 4);
  const remainingPosts = posts.slice(4);

  return (
    <>
      {/* Container for First Row */}
      <div className="max-w-7xl mx-auto px-4">
        {/* First Row - 2 vertical cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:mb-12">
          {firstRowPosts.map((p) => (
            <BlogCard
              key={p.id}
              title={p.title.rendered}
              description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              href={`/blogs/${p.slug}`}
              layout="vertical"
              showReadMore={true}
              imagePriority={true}
              meta={
                <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              }
            />
          ))}
        </div>
      </div>

      {/* Second Row - 1 horizontal featured card (full width) */}
      {secondRowPost.length > 0 && (
        <div className="w-full md:mb-12">
          {secondRowPost.map((p) => (
            <FeaturedBlogCard
              key={p.id}
              title={p.title.rendered}
              description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              href={`/blogs/${p.slug}`}
              tag="Featured"
              imagePriority={true}
              meta={
                <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              }
            />
          ))}
        </div>
      )}

      {/* Container for Remaining Rows */}
      {remainingPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4">
          {/* Remaining Rows - 3 vertical cards per row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {remainingPosts.map((p) => (
              <BlogCard
                key={p.id}
                title={p.title.rendered}
                description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
                imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                href={`/blogs/${p.slug}`}
                layout="vertical"
                showReadMore={true}
                imagePriority={false}
                meta={
                  <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                }
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BlogPostsSkeleton() {
  return (
    <>
      {/* Container for First Row */}
      <div className="max-w-7xl mx-auto px-4">
        {/* First Row - 2 vertical skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:mb-12">
          <BlogCardSkeleton layout="vertical" />
          <BlogCardSkeleton layout="vertical" />
        </div>
      </div>

      {/* Second Row - 1 horizontal skeleton (full width) */}
      <div className="w-full md:mb-12">
        <BlogCardSkeleton layout="horizontal" />
      </div>

      {/* Container for Remaining Rows */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Remaining Rows - 3 vertical skeletons per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <BlogCardSkeleton key={i} layout="vertical" />
          ))}
        </div>
      </div>
    </>
  );
}

async function HeroSection() {
  const category = await getCategoryBySlug("creators");
  const { data: posts } = category
    ? await getPostsByCategory(category.id, 1, 1)
    : { data: [] };

  if (posts.length === 0) {
    return (
      <MainSection
        title="Creator Tips & Growth Strategies"
        subtitle="For Creators"
        description="Learn how successful creators build their audience, monetize content, and grow their brand."
        buttonText="Explore"
        buttonLink="#posts"
        imageSrc="/BlogsMainImage.png"
        hashtags={["CreatorTips", "ContentStrategy", "MonetizeContent"]}
      />
    );
  }

  const heroPost = posts[0];
  const tags = getPostTags(heroPost);

  return (
    <MainSection
      title={heroPost.title.rendered}
      subtitle=""
      description={heroPost.excerpt.rendered.replace(/<[^>]*>/g, '')}
      buttonText="Read More"
      buttonLink={`/blogs/${heroPost.slug}`}
      imageSrc={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/BlogsMainImage.png"}
      hashtags={tags.length > 0 ? tags : ["CreatorTips", "ContentStrategy", "MonetizeContent"]}
    />
  );
}

export default function CreatorsPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Main Section with Background Image */}
      <div className="relative z-10">
        <Suspense fallback={
          <MainSection
            title="Creator Tips & Growth Strategies"
            subtitle="For Creators"
            description="Learn how successful creators build their audience, monetize content, and grow their brand."
            buttonText="Explore"
            buttonLink="#posts"
            imageSrc="/BlogsMainImage.png"
            hashtags={["CreatorTips", "ContentStrategy", "MonetizeContent"]}
          />
        }>
          <HeroSection />
        </Suspense>
      </div>

      {/* Blog Posts Section with Gradient Background */}
      <section className="relative py-16" id="posts">
        {/* Linear Gradient Background with Blur - Creators gradient */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(162.34deg, #DD2A7B 4.78%, #9747FF 89.95%)',
            filter: 'blur(300px)'
          }}
        />

        <div className="relative z-10">
          <Suspense key="creators-posts" fallback={<BlogPostsSkeleton />}>
            <CreatorsPosts />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
