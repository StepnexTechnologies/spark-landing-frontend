import React from "react";
import Image from "next/image";
import Link from "next/link";

type Layout = "vertical" | "horizontal";
type DescriptionPosition = "bottom" | "right";

export interface CardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  layout?: Layout;
  descriptionPosition?: DescriptionPosition;
  showDescription?: boolean;
  className?: string;
  tag?: React.ReactNode;
  action?: React.ReactNode;
  /** meta example: date, reading time etc. */
  meta?: React.ReactNode;
  /** allow Image to use priority (for featured cards) */
  imagePriority?: boolean;
  /** show read more button */
  showReadMore?: boolean;
}

export default function Card({
  title,
  description,
  imageSrc,
  imageAlt = "card image",
  href,
  layout = "vertical",
  descriptionPosition = "bottom",
  showDescription = true,
  className = "",
  tag,
  action,
  meta,
  imagePriority = false,
  showReadMore = false,
}: CardProps) {
  const isHorizontal = layout === "horizontal";

  const content = (
    <div
      className={`flex ${isHorizontal ? "flex-row gap-4" : "flex-col"} w-full h-full p-4`}
    >
      {imageSrc && (
        <div
          className={`flex-shrink-0 ${
            isHorizontal ? "w-1/3 md:w-2/5" : "w-full"
          }`}
        >
          {/* Image wrapper: using Next Image with fill for responsive cropping */}
          <div
            className={`relative w-full h-full aspect-[4/3] md:aspect-video overflow-hidden rounded-xl`}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              style={{ objectFit: "cover" }}
              sizes={
                isHorizontal
                  ? "(min-width: 1024px) 40vw, (min-width: 640px) 33vw, 100vw"
                  : "100vw"
              }
              priority={imagePriority}
            />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col ${
          isHorizontal ? "w-2/3 md:w-3/5 mt-4" : "w-full mt-4"
        }`}
      >
        {/* Date */}
        {meta ? (
          <div className="text-xs text-slate-400 mb-3">
            {meta}
          </div>
        ) : (
          <div className="text-xs text-slate-400 mb-3">
            <span>November 4, 2025</span>
          </div>
        )}

        {/* Title */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold leading-tight text-slate-900"
              style={{
                fontSize: "clamp(1rem, calc(0.9rem + 1.2vw), 1.25rem)",
              }}
              title={title}
            >
              {title}
            </h3>

            {tag && <div className="mt-2 text-xs text-slate-500">{tag}</div>}
          </div>

          {action && <div className="flex-shrink-0">{action}</div>}
        </div>

        {/* Description */}
        {showDescription && description && (
          <div
            className={`text-sm text-slate-600 mt-3 ${
              isHorizontal && descriptionPosition === "right" ? "md:block" : ""
            }`}
            style={
              {
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              } as React.CSSProperties
            }
          >
            {description}
          </div>
        )}

        {/* Button */}
        <div className="mt-auto pt-4">
          {showReadMore && href && (
            <div>
              <Link
                href={href}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors"
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
    </div>
  );

  const wrapperClasses = `rounded-2xl overflow-hidden border border-slate-200 ${
    isHorizontal && descriptionPosition === "right" ? "bg-white/50" : "bg-white"
  }`;

  const cardInner = href && !showReadMore ? (
    <Link
      href={href}
      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      aria-label={title}
    >
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  );

  return (
    <article className={`${wrapperClasses} ${className}`} role="article">
      {cardInner}
    </article>
  );
}
