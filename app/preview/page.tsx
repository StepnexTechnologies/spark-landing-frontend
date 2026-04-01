import { Suspense } from "react";
import type { Metadata } from "next";
import Card from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogPostsSkeleton from "@/components/blog/BlogPostsSkeleton";
import MainSection from "@/components/blog/MainSection";
import MainSectionSkeleton from "@/components/blog/MainSectionSkeleton";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { getDraftPosts, getPostTags, decodeHtmlEntities } from "@/lib/wordpress-improved";

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

async function BlogPosts() {
  const { data: posts } = await getDraftPosts(1, 13);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No draft posts yet</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          There are currently no draft posts to preview. Create a draft in WordPress to see it here.
        </p>
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
              title={decodeHtmlEntities(p.title.rendered)}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url}
              href={`/preview/${p.id}`}
              layout="vertical"
              descriptionPosition="bottom"
              imagePriority={true}
              showReadMore={true}
              meta={
                <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
              title={decodeHtmlEntities(p.title.rendered)}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url}
              href={`/preview/${p.id}`}
              tag="Brand Story"
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
                title={decodeHtmlEntities(p.title.rendered)}
                description={decodeHtmlEntities(p.excerpt.rendered)}
                imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url}
                href={`/preview/${p.id}`}
                layout="vertical"
                descriptionPosition="bottom"
                imagePriority={false}
                showReadMore={true}
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
      buttonLink={`/preview/${heroPost.id}`}
      imageSrc={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || heroPost.yoast_head_json?.og_image?.[0]?.url || "/MainImage.svg"}
      hashtags={displayTags.length > 0 ? displayTags : ["Preview", "DraftPosts", "ContentReview"]}
      textAlign={textAlign}
    />
  );
}

export default function PreviewPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Main Section with Background Image */}
      <div className="relative z-10">
        <Suspense fallback={<MainSectionSkeleton />}>
          <HeroSection />
        </Suspense>
      </div>

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
          <Suspense fallback={<BlogPostsSkeleton />}>
            <BlogPosts />
          </Suspense>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}
