import React, { Suspense } from "react";
import type { Metadata } from "next";
import Card from "@/components/blog/BlogCard";
import { getPosts } from "@/lib/wordpress-improved";

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
  const { data: posts } = await getPosts(1, 12);

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

  const firstRowPosts = posts.slice(0, 2);
  const secondRowPost = posts.slice(2, 3);
  const remainingPosts = posts.slice(3);

  return (
    <>
      {/* First Row - 2 vertical cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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

      {/* Second Row - 1 horizontal card */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {secondRowPost.map((p) => (
          <Card
            key={p.id}
            title={p.title.rendered}
            description={p.excerpt.rendered.replace(/<[^>]*>/g, '')}
            imageSrc={p._embedded?.['wp:featuredmedia']?.[0]?.source_url}
            href={`/blogs/${p.slug}`}
            layout="horizontal"
            descriptionPosition="right"
            imagePriority={true}
            showReadMore={true}
            meta={
              <span>{new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            }
          />
        ))}
      </div>

      {/* Remaining Rows - 3 vertical cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen relative p-6 overflow-hidden bg-white">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: 'radial-gradient(ellipse 1500px 1500px at center, rgba(221, 42, 123, 0.15) 0%, rgba(151, 71, 255, 0.1) 35%, rgba(51, 76, 202, 0.05) 60%, transparent 100%)'
           }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <Suspense fallback={<div className="text-center py-20">Loading posts...</div>}>
          <BlogPosts />
        </Suspense>
      </div>
    </main>
  );
}
