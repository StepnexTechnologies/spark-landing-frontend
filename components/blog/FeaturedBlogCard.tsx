import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface FeaturedBlogCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  className?: string;
  tag?: string;
  /** meta example: date, reading time etc. */
  meta?: React.ReactNode;
  /** allow Image to use priority (for featured cards) */
  imagePriority?: boolean;
}

export default function FeaturedBlogCard({
  title,
  description,
  imageSrc,
  imageAlt = "featured blog image",
  href,
  className = "",
  tag = "Brand Story",
  meta,
  imagePriority = false,
}: FeaturedBlogCardProps) {
  const content = (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Image Section - Top on mobile, Left on desktop */}
      {imageSrc && (
        <div className="w-full md:w-1/2 relative">
          <div
            className="relative w-full h-[276px] md:h-full md:min-h-[460px]"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              style={{ objectFit: "cover" }}
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={imagePriority}
            />
          </div>
        </div>
      )}

      {/* Content Section - Bottom on mobile, Right on desktop */}
      <div className="w-full md:w-1/2 flex flex-col text-center justify-center  my-6 md:px-16 md:my-0 bg-white">
        {/* Tag */}
        {tag && (
          <div className="text-sm text-[#999999] mb-4 font-normal uppercase tracking-wide">
            {tag}
          </div>
        )}

        {/* Title */}
        <h2
          className="font-bold text-3xl md:text-4xl lg:text-[40px] text-[#212529] leading-tight mb-6"
        >
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm text-[#999999] font-normal mb-8 leading-relaxed">
            {description}
          </p>
        )}

        {/* Button */}
        {href && (
          <div className="flex justify-center">
            <Link
              href={href}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-full hover:opacity-90 transition-opacity"
              style={{
                background: 'linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)'
              }}
            >
              Read More
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7M17 7H7M17 7V17"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const cardInner = href ? (
    <div>{content}</div>
  ) : (
    <div>{content}</div>
  );

  return (
    <article
      className={`w-full my-12 bg-white overflow-hidden ${className}`}
      role="article"
      
    >
      {cardInner}
    </article>
  );
}
