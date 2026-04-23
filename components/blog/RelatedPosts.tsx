"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card from "./BlogCard";
import { track } from "@/lib/analytics/track";

// Dynamic-import the mobile carousel (embla-carousel-react is ~10 KiB and only
// needed below lg breakpoint).
const RelatedPostsMobileCarousel = dynamic(
  () => import("./RelatedPostsMobileCarousel"),
  {
    ssr: false,
    loading: () => <div className="min-h-[400px]" />,
  }
);

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  date: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  basePath?: "/blogs" | "/preview";
}

export default function RelatedPosts({ posts, basePath = "/blogs" }: RelatedPostsProps) {
  const pathname = usePathname();
  const [viewport, setViewport] = useState<"ssr" | "mobile" | "desktop">("ssr");

  const handleCardClick = (toSlug: string) => {
    const fromSlug = pathname?.split("/").filter(Boolean).pop() ?? null;
    track("blog_related_post_click", {
      from_slug: fromSlug,
      to_slug: toSlug,
    });
  };

  // Use matchMedia (doesn't read layout props, no forced reflow).
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)"); // below Tailwind `lg`
    const update = () => setViewport(mql.matches ? "mobile" : "desktop");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const isMounted = viewport !== "ssr";
  const isCarouselActive = viewport === "mobile";

  if (posts.length === 0) return null;

  // Show nothing during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <section className="">
        <div className="min-h-[400px]" /> {/* Placeholder to prevent layout shift */}
      </section>
    );
  }

  return (
    <section className="">
      {isCarouselActive ? (
        <RelatedPostsMobileCarousel
          posts={posts}
          basePath={basePath}
          onCardClick={handleCardClick}
        />
      ) : (
        /* Desktop: Grid Layout */
        <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.slug}
              onClickCapture={() => handleCardClick(post.slug)}
            >
              <Card
                title={post.title}
                description={post.excerpt}
                imageSrc={post.featuredImage}
                imageAlt={post.title}
                href={`${basePath}/${post.slug}`}
                layout="vertical"
                descriptionPosition="bottom"
                showReadMore={true}
                meta={<span>{post.date}</span>}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
