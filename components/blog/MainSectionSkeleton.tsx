export default function MainSectionSkeleton() {
  return (
    <section className="relative w-full h-[460px] md:h-[500px] lg:h-[690px] overflow-hidden rounded-b-[40px] md:rounded-b-[60px] bg-slate-200 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]">
      <div className="relative h-full max-w-7xl px-[24px] lg:px-[84px] flex items-end pb-10 lg:pb-20">
        <div className="w-full max-w-[320px] md:max-w-[512px] lg:max-w-[672px]">
          {/* Title Skeleton - 3 lines to match actual title */}
          <div className="space-y-3 mb-4 md:mb-6">
            <div className="h-8 md:h-10 lg:h-[52px] xl:h-[60px] bg-slate-300/50 rounded w-full animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
            <div className="h-8 md:h-10 lg:h-[52px] xl:h-[60px] bg-slate-300/50 rounded w-[90%] animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
            <div className="h-8 md:h-10 lg:h-[52px] xl:h-[60px] bg-slate-300/50 rounded w-[70%] animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2 mb-6 md:mb-8 max-w-lg">
            <div className="h-4 md:h-5 lg:h-6 bg-slate-300/50 rounded w-full animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
            <div className="h-4 md:h-5 lg:h-6 bg-slate-300/50 rounded w-full animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
            <div className="h-4 md:h-5 lg:h-6 bg-slate-300/50 rounded w-[80%] animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
          </div>

          {/* Button Skeleton */}
          <div className="h-11 bg-slate-300/50 rounded-full w-36 animate-shimmer bg-gradient-to-r from-slate-300/50 via-slate-200/50 to-slate-300/50 bg-[length:200%_100%]" />
        </div>
      </div>
    </section>
  );
}
