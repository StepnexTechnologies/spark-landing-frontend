import React, { Suspense } from "react";
import type { Metadata } from "next";
import Card from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import MainSection from "@/components/blog/MainSection";
import { getDraftPosts, getPostTags } from "@/lib/wordpress-improved";

// Helper function to decode HTML entities and strip tags
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/&hellip;/g, '...')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '--')
    .replace(/\[...\]/g, '...')
    .replace(/\[\.\.\.\]/g, '...')
    .trim();
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// No indexing for preview page
export const metadata: Metadata = {
  title: "Preview | Draft Posts - Sparkonomy",
  description: "Preview draft blog posts before publishing.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

async function DraftBlogPosts() {
  const { data: posts } = await getDraftPosts(1, 13);

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">No draft posts</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            There are currently no draft posts to preview. Create a draft in WordPress to see it here.
          </p>
        </div>
      </div>
    );
  }

  const firstRowPosts = posts.slice(0, 3);
  const secondRowPost = posts.slice(3, 4);
  const remainingPosts = posts.slice(4);

  return (
    <>
      {/* Container for First Row */}
      <div className="max-w-7xl mx-auto px-4">
        {/* First Row - 3 vertical cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:mb-12">
          {firstRowPosts.map((p) => (
            <Card
              key={p.id}
              title={p.title.rendered}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              href={`/preview/${p.slug}`}
              layout="vertical"
              descriptionPosition="bottom"
              imagePriority={true}
              showReadMore={true}
              meta={
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    DRAFT
                  </span>
                  {new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              }
            />
          ))}
        </div>
      </div>

      {/* Second Row - 1 featured horizontal card (full width, no container) */}
      {secondRowPost.length > 0 && (
        <div className="w-full md:mb-12">
          {secondRowPost.map((p) => (
            <FeaturedBlogCard
              key={p.id}
              title={p.title.rendered}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              href={`/preview/${p.slug}`}
              tag="DRAFT"
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
              <Card
                key={p.id}
                title={p.title.rendered}
                description={decodeHtmlEntities(p.excerpt.rendered)}
                imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                href={`/preview/${p.slug}`}
                layout="vertical"
                descriptionPosition="bottom"
                imagePriority={false}
                showReadMore={true}
                meta={
                  <span className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      DRAFT
                    </span>
                    {new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
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
        {/* First Row - 3 vertical skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:mb-12">
          <BlogCardSkeleton layout="vertical" />
          <BlogCardSkeleton layout="vertical" />
          <BlogCardSkeleton layout="vertical" />
        </div>
      </div>

      {/* Second Row - 1 horizontal skeleton (full width, no container) */}
      <div className="w-full md:mb-12">
        <BlogCardSkeleton layout="horizontal" />
      </div>

      {/* Container for Remaining Rows */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Remaining Rows - 6 vertical skeletons (showing 2 rows of 3) */}
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
  const { data: posts } = await getDraftPosts(1, 1);

  if (posts.length === 0) {
    return (
      <MainSection
        title="Draft Posts Preview"
        subtitle=""
        description="Preview your draft blog posts before publishing them to the world."
        buttonText="View Drafts"
        buttonLink="#posts"
        imageSrc="/MainImage.svg"
        hashtags={["Preview", "DraftPosts", "ContentReview"]}
      />
    );
  }

  const heroPost = posts[0];
  const tags = getPostTags(heroPost);

  return (
    <MainSection
      title={heroPost.title.rendered}
      subtitle="DRAFT PREVIEW"
      description={decodeHtmlEntities(heroPost.excerpt.rendered)}
      buttonText="Preview Post"
      buttonLink={`/preview/${heroPost.slug}`}
      imageSrc={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/MainImage.svg"}
      hashtags={tags.length > 0 ? tags : ["Preview", "DraftPosts", "ContentReview"]}
    />
  );
}

export default function PreviewPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-yellow-900 py-2 px-4 text-center font-medium">
        Preview Mode - These are draft posts not yet published
      </div>

      {/* Main Section with Background Image */}
      <div className="relative z-10">
        <Suspense fallback={
          <MainSection
            title="Draft Posts Preview"
            subtitle=""
            description="Preview your draft blog posts before publishing them to the world."
            buttonText="View Drafts"
            buttonLink="#posts"
            imageSrc="/MainImage.svg"
            hashtags={["Preview", "DraftPosts", "ContentReview"]}
          />
        }>
          <HeroSection />
        </Suspense>
      </div>

      {/* Draft Posts Section with Gradient Background */}
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
          <Suspense fallback={<BlogPostsSkeleton />}>
            <DraftBlogPosts />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
