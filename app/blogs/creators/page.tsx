import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategoryBySlug, getPostsByCategory } from "@/lib/wordpress-improved";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";

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
    ? await getPostsByCategory(category.id, 1, 12)
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

function BlogPostsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {[...Array(6)].map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function CreatorsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Blog Posts Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Suspense key="creators-posts" fallback={<BlogPostsSkeleton />}>
            <CreatorsPosts />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
