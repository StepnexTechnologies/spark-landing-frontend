import React from "react";
import Image from "next/image";
import Link from "next/link";
import ReadMoreButton from "./ReadMoreButton";

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
      className={`flex ${isHorizontal ? "flex-row" : "flex-col"}`}
      style={{
        gap: '10px',
        paddingTop: '8px',
        paddingRight: '8px',
        paddingBottom: '32px',
        paddingLeft: '8px'
      }}
    >
      {imageSrc && (
        <div
          className={`flex-shrink-0 ${
            isHorizontal ? "w-1/3 md:w-2/5" : "w-full"
          }`}
        >
          {/* Image wrapper: 398px × 284px with 30px border radius */}
          <div
            className={`relative overflow-hidden w-full`}
            style={{
              aspectRatio: '398 / 284',
              borderRadius: '30px'
            }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              style={{ objectFit: "cover" }}
              sizes={
                isHorizontal
                  ? "(min-width: 1024px) 40vw, (min-width: 640px) 33vw, 100vw"
                  : "398px"
              }
              priority={imagePriority}
            />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col px-4 py-4 ${
          isHorizontal ? "w-2/3 md:w-3/5" : "w-full"
        }`}
      >
        
          <div className="text-sm text-[#999999] mb-3 font-normal">
            {meta}
          </div>
        

        {/* Title */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold leading-tight text-2xl text-[#212529]"
              title={title}
            >
              {title}
            </h3>

            {/* {tag && <div className="mt-2 text-xs text-slate-500">{tag}</div>} */}
          </div>

          {/* {action && <div className="flex-shrink-0">{action}</div>} */}
        </div>

        {/* Description */}
        {showDescription && description && (
          <div
            className={`text-sm font-normal text-[#999999] mt-3 ${
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
        <div className="flex justify-end pt-4">
          {showReadMore && href && (
            <div>
              <ReadMoreButton href={href} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const wrapperClasses = `overflow-hidden border bg-white ${
    isHorizontal && descriptionPosition === "right" ? "bg-white/50" : ""
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
    <article
      className={`${wrapperClasses} ${className} w-full`}
      role="article"
      style={{
        borderRadius: '34px',
        borderColor: '#F2F2F2',
        borderWidth: '1px'
      }}
    >
      {cardInner}
    </article>
  );
}
