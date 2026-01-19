export default function FeaturedBlogCardSkeleton() {
  return (
    <article className="w-full my-12 bg-white overflow-hidden">
      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Image Skeleton - Top on mobile, Left on desktop */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative w-full h-[276px] md:h-full md:min-h-[460px] bg-slate-200 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
        </div>

        {/* Content Skeleton - Bottom on mobile, Right on desktop */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center my-6 md:px-16 md:my-0 bg-white">
          {/* Tag Skeleton */}
          <div className="mb-4">
            <div className="h-4 bg-slate-200 rounded w-24 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Title Skeleton */}
          <div className="w-full space-y-3 mb-6">
            <div className="h-9 md:h-10 lg:h-12 bg-slate-200 rounded w-full mx-auto animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-9 md:h-10 lg:h-12 bg-slate-200 rounded w-4/5 mx-auto animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Description Skeleton */}
          <div className="w-full space-y-2 mb-8 px-4 md:px-0">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Button Skeleton */}
          <div className="h-11 bg-slate-200 rounded-full w-36 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
        </div>
      </div>
    </article>
  );
}
