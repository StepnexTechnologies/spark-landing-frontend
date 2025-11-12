"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Card from "./BlogCard";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  date: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Track window width client-side (SSR-safe)
  useEffect(() => {
    const setWidth = () => setWindowWidth(window.innerWidth);
    setWidth();
    window.addEventListener("resize", setWidth);
    return () => window.removeEventListener("resize", setWidth);
  }, []);

  // Only active carousel on mobile and tablet
  const isCarouselActive = windowWidth > 0 && windowWidth < 1024; // Tailwind `lg`

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
    draggable: true,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(1); // Start with middle card

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    // Scroll to middle card (index 1) on init
    emblaApi.scrollTo(1, true);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  if (posts.length === 0) return null;

  return (
    <section className="">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Also Read
      </h2>

      {/* Mobile & Tablet: Carousel */}
      {isCarouselActive ? (
        <div className="relative">
          <div className="w-full overflow-hidden" ref={emblaRef}>
            <div
              className="flex items-center gap-4 will-change-transform box-content"
              style={{
                paddingInline: 'calc((100% - 85vw) / 2)',
              }}
            >
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="flex-shrink-0 w-[85vw] max-w-[358px] flex justify-center transition-transform duration-300"
                >
                  <Card
                    title={post.title}
                    description={post.excerpt}
                    imageSrc={post.featuredImage}
                    imageAlt={post.title}
                    href={`/blogs/${post.slug}`}
                    layout="vertical"
                    descriptionPosition="bottom"
                    showReadMore={true}
                    meta={<span>{post.date}</span>}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {posts.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Go to post ${index + 1}`}
                className={`h-2.5 rounded-full border-none cursor-pointer transition-all duration-200 ${
                  selectedIndex === index
                    ? "w-7 bg-gray-900"
                    : "w-2.5 bg-gray-900/35"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Desktop: Grid Layout */
        <div className="hidden lg:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              title={post.title}
              description={post.excerpt}
              imageSrc={post.featuredImage}
              imageAlt={post.title}
              href={`/blogs/${post.slug}`}
              layout="vertical"
              descriptionPosition="bottom"
              showReadMore={true}
              meta={<span>{post.date}</span>}
            />
          ))}
        </div>
      )}
    </section>
  );
}
