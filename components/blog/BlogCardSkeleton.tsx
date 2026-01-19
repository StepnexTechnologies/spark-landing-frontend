interface BlogCardSkeletonProps {
  layout?: "vertical" | "horizontal";
}

export default function BlogCardSkeleton({ layout = "vertical" }: BlogCardSkeletonProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <article
      className="overflow-hidden border bg-white w-full"
      style={{
        borderRadius: '34px',
        borderColor: '#F2F2F2',
        borderWidth: '1px'
      }}
    >
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
        {/* Image Skeleton */}
        <div className={`flex-shrink-0 ${isHorizontal ? "w-1/3 md:w-2/5" : "w-full"}`}>
          <div
            className="relative overflow-hidden w-full bg-slate-200 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
            style={{
              aspectRatio: '398 / 284',
              borderRadius: '30px'
            }}
          />
        </div>

        {/* Content Skeleton */}
        <div className={`flex flex-col px-4 py-4 ${isHorizontal ? "w-2/3 md:w-3/5" : "w-full"}`}>
          {/* Date Skeleton */}
          <div className="mb-3">
            <div className="h-4 bg-slate-200 rounded w-36 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Title Skeleton */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-7 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
              <div className="h-7 bg-slate-200 rounded w-3/4 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-2/3 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Read More Button Skeleton - aligned to right */}
          <div className="flex justify-end pt-4">
            <div className="h-11 bg-slate-200 rounded-full w-32 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>
        </div>
      </div>
    </article>
  );
}
