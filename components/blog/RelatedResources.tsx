"use client";

import Image from "next/image";
import Link from "next/link";

export interface RelatedResource {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
}

interface RelatedResourcesProps {
  posts: RelatedResource[];
  basePath?: "/blogs" | "/preview";
}

export default function RelatedResources({ posts, basePath = "/blogs" }: RelatedResourcesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="related-resources-section mb-8">
      <h3 className="text-xl md:text-2xl font-medium text-[#6B7280] mb-4 md:mb-6">
        Related Resources
      </h3>

      {/* Mobile: Vertical List */}
      <div className="flex flex-col gap-4 md:hidden">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`${basePath}/${post.slug}`}
            className="flex items-center gap-4 group"
          >
            {/* Image */}
            <div className="relative w-[84px] h-[84px] flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title Only */}
            <h4 className="flex-1 text-base md:text-lg font-semibold text-[#6B7280] group-hover:text-[#5B21B6] transition-colors line-clamp-2 m-0">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>

      {/* Desktop: Horizontal Cards */}
      <div className="hidden md:grid md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`${basePath}/${post.slug}`}
            className="group flex items-center gap-3 p-2 transition-all"
          >
            {/* Image */}
            <div className="relative w-[84px] h-[84px] flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title Only */}
            <h4 className="flex-1 text-base md:text-lg font-semibold text-[#6B7280] underline group-hover:text-[#5B21B6] transition-colors line-clamp-3 m-0">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
