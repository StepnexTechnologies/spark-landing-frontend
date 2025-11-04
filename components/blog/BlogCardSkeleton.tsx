export default function BlogCardSkeleton() {
  return (
    <article className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 via-white/5 to-black/20 border border-white/10 backdrop-blur-sm">
      {/* Image Skeleton */}
      <div className="relative w-full h-[280px] bg-white/5 animate-pulse" />

      {/* Content Skeleton */}
      <div className="p-6 space-y-3">
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-7 bg-white/10 rounded animate-pulse w-full" />
          <div className="h-7 bg-white/10 rounded animate-pulse w-3/4" />
        </div>

        {/* Date Skeleton */}
        <div className="h-4 bg-white/10 rounded animate-pulse w-32" />

        {/* Excerpt Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-full" />
          <div className="h-4 bg-white/10 rounded animate-pulse w-2/3" />
        </div>

        {/* Read More Skeleton */}
        <div className="h-4 bg-white/10 rounded animate-pulse w-24 mt-4" />
      </div>
    </article>
  );
}
