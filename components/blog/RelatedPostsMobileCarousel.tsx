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

interface RelatedPostsMobileCarouselProps {
  posts: RelatedPost[];
  basePath: "/blogs" | "/preview";
  onCardClick: (slug: string) => void;
}

export default function RelatedPostsMobileCarousel({
  posts,
  basePath,
  onCardClick,
}: RelatedPostsMobileCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    loop: false,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState<number>(1);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.scrollTo(1, true);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  return (
    <div className="relative">
      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div
          className="flex items-center gap-4 will-change-transform box-content"
          style={{
            paddingInline: "calc((100% - 85vw) / 2)",
          }}
        >
          {posts.map((post) => (
            <div
              key={post.slug}
              onClickCapture={() => onCardClick(post.slug)}
              className="flex-shrink-0 w-[85vw] max-w-[358px] flex justify-center transition-transform duration-300"
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
      </div>

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
  );
}
