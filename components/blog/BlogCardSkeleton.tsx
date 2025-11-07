interface BlogCardSkeletonProps {
  layout?: "vertical" | "horizontal";
}

export default function BlogCardSkeleton({ layout = "vertical" }: BlogCardSkeletonProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <article className="rounded-2xl bg-white overflow-hidden border border-slate-200">
      <div className={`flex ${isHorizontal ? "flex-row gap-4" : "flex-col"} w-full h-full p-4`}>
        {/* Image Skeleton with shimmer */}
        <div className={`flex-shrink-0 ${isHorizontal ? "w-1/3 md:w-2/5" : "w-full"}`}>
          <div className="relative w-full h-full aspect-[4/3] md:aspect-video overflow-hidden rounded-xl bg-slate-200 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
        </div>

        {/* Content Skeleton */}
        <div className={`flex flex-col ${isHorizontal ? "w-2/3 md:w-3/5 mt-4" : "w-full mt-4"}`}>
          {/* Date Skeleton */}
          <div className="mb-3">
            <div className="h-3 bg-slate-200 rounded w-32 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Title Skeleton */}
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="h-5 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
              <div className="h-5 bg-slate-200 rounded w-3/4 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            </div>
          </div>

          {/* Description Skeleton */}
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-2/3 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Read More Button Skeleton */}
          <div className="mt-auto pt-4">
            <div className="h-9 bg-slate-200 rounded-full w-32 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>
        </div>
      </div>
    </article>
  );
}
