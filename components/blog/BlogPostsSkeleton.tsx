import BlogCardSkeleton from "./BlogCardSkeleton";
import FeaturedBlogCardSkeleton from "./FeaturedBlogCardSkeleton";

export default function BlogPostsSkeleton() {
  return (
    <>
      {/* Second Row - 1 horizontal skeleton (full width, no container) */}
      <div className="w-full md:mb-12">
        <BlogCardSkeleton layout="horizontal" />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:mb-12">
          <BlogCardSkeleton layout="vertical" />
          <BlogCardSkeleton layout="vertical" />
          <BlogCardSkeleton layout="vertical" />
        </div>
      </div>

      {/* Second Row - 1 featured horizontal skeleton (full width, no container) */}
      <div className="w-full md:mb-12">
        <FeaturedBlogCardSkeleton />
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
