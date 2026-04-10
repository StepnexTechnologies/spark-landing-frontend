import React, { Suspense } from "react";
import type { Metadata } from "next";
import Card from "@/components/blog/BlogCard";
import FeaturedBlogCard from "@/components/blog/FeaturedBlogCard";
import BlogPostsSkeleton from "@/components/blog/BlogPostsSkeleton";
import MainSection from "@/components/blog/MainSection";
import MainSectionSkeleton from "@/components/blog/MainSectionSkeleton";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { getPosts, getPostTags, decodeHtmlEntities } from "@/lib/wordpress-improved";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Blog | Sparkonomy - Tips for Creators, Influencers, YouTubers & Instagrammers",
  description: "Discover the latest insights, tips, and strategies for creators, influencers, YouTubers & Instagrammers to monetize content, grow their audience, and succeed in the creator economy. Expert guides from Sparkonomy.",
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
    canonical: "https://sparkonomy.com/blogs",
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
    description: "Insights, tips & strategies for creators, influencers, YouTubers & Instagrammers to monetize content and succeed in the creator economy.",
    url: "https://sparkonomy.com/blogs",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://sparkonomy.com/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Sparkonomy - Tips for Creators, Influencers & YouTubers",
    description: "Insights, tips & strategies for creators, influencers, YouTubers & Instagrammers to monetize content and succeed in the creator economy.",
    images: ["https://sparkonomy.com/sparkonomy.png"],
    creator: "@sparkonomy",
    site: "@sparkonomy",
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
      <div className="max-w-7xl mx-auto px-4 ">
        {/* First Row - 3 vertical cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:mb-12">
          {firstRowPosts.map((p) => (
            <Card
              key={p.id}
              title={decodeHtmlEntities(p.title.rendered)}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url}
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
            title={decodeHtmlEntities(p.title.rendered)}
            description={decodeHtmlEntities(p.excerpt.rendered)}
            imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url}
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
              title={decodeHtmlEntities(p.title.rendered)}
              description={decodeHtmlEntities(p.excerpt.rendered)}
              imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url}
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


async function HeroSection() {
  const { data: posts } = await getPosts(1, 1);

  if (posts.length === 0) {
    return null;
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
      buttonLink={`/blogs/${heroPost.slug}`}
      imageSrc={heroPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || heroPost.yoast_head_json?.og_image?.[0]?.url || "/MainImage.svg"}
      hashtags={displayTags.length > 0 ? displayTags : ["MonetizeYourContent", "CreatorEconomy", "PassiveIncome"]}
      textAlign={textAlign}
    />
  );
}

export default function Home() {
  // Blog structured data for listing page
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sparkonomy Blog - For Creators, Influencers, YouTubers & Instagrammers",
    description: "Insights, tips, and strategies for creators, influencers, YouTubers, Instagrammers and social media influencers to monetize content and succeed in the creator economy.",
    url: "https://sparkonomy.com/blogs",
    publisher: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://sparkonomy.com",
      logo: {
        "@type": "ImageObject",
        url: "https://sparkonomy.com/sparkonomy.png",
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
        item: "https://sparkonomy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://sparkonomy.com/blogs",
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
