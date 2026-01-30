export default function Loading() {
  return (
    <main className="min-h-screen px-0 md:px-10 lg:px-[90px] py-5 lg:py-6 bg-white">
      <article className="flex flex-col gap-4 md:gap-6 lg:gap-10">
        {/* Breadcrumb Skeleton */}
        <div className="px-4 md:px-0">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <span className="text-slate-300">/</span>
            <div className="h-4 w-24 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="px-4 md:px-[50px] lg:px-[130px] space-y-3">
          <div className="h-8 md:h-10 lg:h-12 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          <div className="h-8 md:h-10 lg:h-12 bg-slate-200 rounded w-3/4 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
        </div>

        {/* Meta Information Skeleton */}
        <div className="px-4 md:px-[30px] xl:px-[130px]">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-5 w-32 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <span className="text-slate-300">·</span>
            <div className="h-5 w-24 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Author Section Skeleton */}
          <div className="border-t border-b border-gray-200 py-2 md:py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-200 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
                  <div className="h-4 w-48 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
                <div className="w-6 h-6 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
                <div className="w-6 h-6 bg-slate-200 rounded animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Skeleton */}
        <div className="px-4 md:px-0">
          <div className="relative w-full aspect-video rounded-2xl bg-slate-200 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
        </div>

        {/* Content Skeleton */}
        <div className="px-4 md:px-[50px] lg:px-[130px] space-y-4">
          {/* Paragraph 1 */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-5/6 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Heading */}
          <div className="h-7 bg-slate-200 rounded w-1/2 mt-6 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />

          {/* Paragraph 2 */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-4/5 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Paragraph 3 */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-3/4 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>

          {/* Heading 2 */}
          <div className="h-7 bg-slate-200 rounded w-2/5 mt-6 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />

          {/* Paragraph 4 */}
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-full animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
            <div className="h-4 bg-slate-200 rounded w-2/3 animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]" />
          </div>
        </div>
      </article>
    </main>
  );
}
