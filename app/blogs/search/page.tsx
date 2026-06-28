import { Suspense } from "react";
import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogSearchBar from "@/components/blog/BlogSearchBar";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { searchPosts, decodeHtmlEntities } from "@/lib/wordpress-improved";

export const revalidate = 300;

const POSTS_PER_PAGE = 12;

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

function parsePage(raw: string | undefined): number {
  const n = parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

// Search results are query-dependent and ephemeral — keep them out of the index.
export const metadata: Metadata = {
  title: "Search | Sparkonomy Blog",
  description: "Search articles, tips and strategies across the Sparkonomy blog.",
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const cardImage = (p: { _embedded?: any; yoast_head_json?: any }) =>
  p._embedded?.["wp:featuredmedia"]?.[0]?.source_url || p.yoast_head_json?.og_image?.[0]?.url;

async function SearchResults({ query, currentPage }: { query: string; currentPage: number }) {
  const { data, totalPages } = await searchPosts(query, currentPage, POSTS_PER_PAGE);
  const posts = data.filter((p) => !p.slug.endsWith("-hi"));

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            No results for &ldquo;{query}&rdquo;
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Try a different keyword or browse our latest articles.
          </p>
        </div>
      </div>
    );
  }

  const basePath = `/blogs/search?q=${encodeURIComponent(query)}`;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <BlogCard
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

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <BlogPagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
      </div>
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <BlogCardSkeleton key={i} layout="vertical" />
        ))}
      </div>
    </div>
  );
}

export default async function BlogSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const currentPage = parsePage(params.page);

  return (
    <main className="relative overflow-hidden">
      {/* Search header */}
      <section className="relative pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-center text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
            {query ? (
              <>
                Search results for{" "}
                <span className="bg-gradient-to-r from-[#DD2A7B] to-[#9747FF] bg-clip-text text-transparent">
                  &ldquo;{query}&rdquo;
                </span>
              </>
            ) : (
              "Search the blog"
            )}
          </h1>
          <BlogSearchBar defaultValue={query} autoFocus />
        </div>
      </section>

      {/* Results with gradient background */}
      <div className="relative pb-12" id="posts">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: "linear-gradient(169.7deg, #DD2A7B 1.49%, #9747FF 42.07%, #334CCA 99.84%)",
            filter: "blur(300px)",
          }}
        />

        <div className="relative z-10">
          {query ? (
            <Suspense key={`${query}-${currentPage}`} fallback={<ResultsSkeleton />}>
              <SearchResults query={query} currentPage={currentPage} />
            </Suspense>
          ) : (
            <div className="max-w-7xl mx-auto px-4">
              <p className="text-center text-gray-600 py-12">
                Enter a keyword above to search articles across the Sparkonomy blog.
              </p>
            </div>
          )}
        </div>
      </div>

      <NewsletterSection />
    </main>
  );
}
