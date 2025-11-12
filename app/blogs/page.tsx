import React, { Suspense } from "react";
import type { Metadata } from "next";
import Card from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import MainSection from "@/components/blog/MainSection";
import { getPosts, getPostTags } from "@/lib/wordpress-improved";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Blog | Sparkonomy",
  description: "Read the latest insights, updates, and stories from Sparkonomy - Transforming the creator economy!",
  alternates: {
    canonical: "https://sparkonomy.com/blogs",
  },
};

async function BlogPosts() {
  const { data: posts } = await getPosts(1, 13);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No blog posts yet</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We're working on bringing you amazing content. Check back soon!
        </p>
      </div>
    );
  }

  const heroPost = posts[0];
  const firstRowPosts = posts.slice(1, 4);
  const secondRowPost = posts.slice(4, 5);
  const remainingPosts = posts.slice(5);

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
              description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              href={`/blogs/${p.slug}`}
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
      <div className="w-full md:mb-12">
        {secondRowPost.map((p) => (
          <FeaturedBlogCard
            key={p.id}
            title={p.title.rendered}
            description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
            imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
            href={`/blogs/${p.slug}`}
            tag="Brand Story"
            imagePriority={true}
            meta={
              <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            }
          />
        ))}
      </div>

      {/* Container for Remaining Rows */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Remaining Rows - 3 vertical cards per row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {remainingPosts.map((p) => (
            <Card
              key={p.id}
              title={p.title.rendered}
              description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
              href={`/blogs/${p.slug}`}
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
  const { data: posts } = await getPosts(1, 1);

  if (posts.length === 0) {
    return (
      <MainSection
        title="How Creators Are Earning Passive Income in 2025"
        subtitle=""
        description="Explore the best ways to make your content work for you, even after you sleep."
        buttonText="Read More"
        buttonLink="#posts"
        imageSrc="/MainImage.svg"
        hashtags={["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"]}
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
      imageSrc={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || "/MainImage.svg"}
      hashtags={tags.length > 0 ? tags : ["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"]}
    />
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Main Section with Background Image */}
      <div className="relative z-10">
        <Suspense fallback={
          <MainSection
            title="How Creators Are Earning Passive Income in 2025"
            subtitle=""
            description="Explore the best ways to make your content work for you, even after you sleep."
            buttonText="Read More"
            buttonLink="#posts"
            imageSrc="/MainImage.svg"
            hashtags={["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"]}
          />
        }>
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
    </main>
  );
}
