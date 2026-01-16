import { Suspense } from "react";
import { getCategoryBySlug, getPostsByCategory, getPostTags } from "@/lib/wordpress-improved";
import BlogCard from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import MainSection from "@/components/blog/MainSection";
import NewsletterSection from "@/components/blog/NewsletterSection";
import NoPostsPlaceholder from "./NoPostsPlaceholder";

// Configuration for each category
export interface CategoryConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  defaultHashtags: string[];
  gradient: string;
  noPostsMessage?: string;
}

// Strip HTML helper
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

// Format date helper
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Get featured image helper
function getFeaturedImage(post: any): string | undefined {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
}

// Posts Grid Component
async function CategoryPosts({ config }: { config: CategoryConfig }) {
  const category = await getCategoryBySlug(config.slug);
  const { data: posts } = category
    ? await getPostsByCategory(category.id, 1, 13)
    : { data: [] };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200 mx-4">
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
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          No posts in this category yet
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          {config.noPostsMessage || "We're working on bringing you content. Check back soon!"}
        </p>
        {!category && (
          <div className="mt-6 text-sm text-gray-500">
            <p>Make sure to create a &quot;{config.slug}&quot; category in your WordPress site.</p>
          </div>
        )}
      </div>
    );
  }

  const firstRowPosts = posts.slice(0, 2);
  const secondRowPost = posts.slice(2, 3);
  const remainingPosts = posts.slice(3);

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
              description={stripHtml(p.excerpt.rendered)}
              imageSrc={getFeaturedImage(p)}
              href={`/blogs/${p.slug}`}
              layout="vertical"
              showReadMore={true}
              imagePriority={true}
              meta={<span>{formatDate(p.date)}</span>}
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
              description={stripHtml(p.excerpt.rendered)}
              imageSrc={getFeaturedImage(p)}
              href={`/blogs/${p.slug}`}
              tag="Featured"
              imagePriority={true}
              meta={<span>{formatDate(p.date)}</span>}
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
                description={stripHtml(p.excerpt.rendered)}
                imageSrc={getFeaturedImage(p)}
                href={`/blogs/${p.slug}`}
                layout="vertical"
                showReadMore={true}
                imagePriority={false}
                meta={<span>{formatDate(p.date)}</span>}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Skeleton Loading Component
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

// Hero Section Component
async function HeroSection({ config }: { config: CategoryConfig }) {
  const category = await getCategoryBySlug(config.slug);
  const { data: posts } = category
    ? await getPostsByCategory(category.id, 1, 1)
    : { data: [] };

  // Don't show hero section if no posts - the CategoryPosts component will show "No posts" message
  if (posts.length === 0) {
    return null;
  }

  const heroPost = posts[0];
  const tags = getPostTags(heroPost);
  const featuredImage = getFeaturedImage(heroPost);

  // Only show hero if we have a featured image from WordPress
  if (!featuredImage) {
    return null;
  }

  return (
    <MainSection
      title={heroPost.title.rendered}
      subtitle=""
      description={stripHtml(heroPost.excerpt.rendered)}
      buttonText="Read More"
      buttonLink={`/blogs/${heroPost.slug}`}
      imageSrc={featuredImage}
      hashtags={tags.length > 0 ? tags : config.defaultHashtags}
    />
  );
}

// Hero Fallback Component - returns null while loading, actual content handled by HeroSection
function HeroFallback() {
  return null;
}

// Main Category Blog Page Template
interface CategoryBlogTemplateProps {
  config: CategoryConfig;
}

export default function CategoryBlogTemplate({ config }: CategoryBlogTemplateProps) {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Main Section with Background Image */}
      <div className="relative z-10">
        <Suspense fallback={<HeroFallback />}>
          <HeroSection config={config} />
        </Suspense>
      </div>

      {/* Blog Posts Section with Gradient Background */}
      <section className="relative py-16" id="posts">
        {/* Linear Gradient Background with Blur */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: config.gradient,
            filter: "blur(300px)",
          }}
        />

        <div className="relative z-10">
          <Suspense key={`${config.slug}-posts`} fallback={<BlogPostsSkeleton />}>
            <CategoryPosts config={config} />
          </Suspense>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}

// Pre-defined category configurations
export const CATEGORY_CONFIGS: Record<string, CategoryConfig> = {
  brand: {
    slug: "brand",
    title: "Brand Insights & Marketing Strategies",
    subtitle: "For Brands",
    description: "Discover how top brands leverage creator partnerships to drive growth and engagement.",
    defaultHashtags: ["BrandMarketing", "CreatorPartnerships", "GrowthStrategy"],
    gradient: "linear-gradient(169.7deg, #9747FF 17.1%, #334CCA 88.49%)",
    noPostsMessage: "We're working on bringing you brand-focused content. Check back soon!",
  },
  creators: {
    slug: "creators",
    title: "Creator Tips & Growth Strategies",
    subtitle: "For Creators",
    description: "Unlock your creative potential with tips, tools, and strategies for content creators.",
    defaultHashtags: ["CreatorTips", "ContentStrategy", "CreatorGrowth"],
    gradient: "linear-gradient(169.7deg, #DD2A7B 1.49%, #9747FF 42.07%, #334CCA 99.84%)",
    noPostsMessage: "We're working on bringing you creator-focused content. Check back soon!",
  },
  company: {
    slug: "company",
    title: "Company News & Updates",
    subtitle: "Company",
    description: "Stay updated with the latest news, updates, and announcements from Sparkonomy.",
    defaultHashtags: ["CompanyNews", "Sparkonomy", "Updates"],
    gradient: "linear-gradient(169.7deg, #334CCA 17.1%, #9747FF 88.49%)",
    noPostsMessage: "We're working on bringing you company updates. Check back soon!",
  },
};
