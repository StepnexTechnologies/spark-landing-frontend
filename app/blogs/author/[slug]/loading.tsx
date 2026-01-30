export default function Loading() {
  const shimmerClass = "animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]";

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="max-w-4xl mx-auto px-4 pt-[16px]">
        <div className="flex items-center gap-2">
          <div className={`h-4 w-12 bg-slate-200 rounded ${shimmerClass}`} />
          <span className="text-slate-300">/</span>
          <div className={`h-4 w-16 bg-slate-200 rounded ${shimmerClass}`} />
          <span className="text-slate-300">/</span>
          <div className={`h-4 w-24 bg-slate-200 rounded ${shimmerClass}`} />
        </div>
      </div>

      {/* Hero Section - Author Profile Skeleton */}
      <section className="max-w-4xl mx-auto px-4 py-[16px] text-center">
        {/* Avatar Skeleton */}
        <div className={`w-[200px] h-[200px] mx-auto mb-[16px] md:mb-[20px] rounded-full bg-slate-200 ${shimmerClass}`} />

        {/* Author Info Card Skeleton */}
        <div className="px-[22px] md:px-0">
          {/* Author Label, Name, Role */}
          <div className="flex flex-col items-center gap-2 mb-3 md:mb-4">
            <div className={`h-4 w-32 bg-slate-200 rounded ${shimmerClass}`} />
            <div className={`h-8 w-48 bg-slate-200 rounded ${shimmerClass}`} />
            <div className={`h-5 w-36 bg-slate-200 rounded ${shimmerClass}`} />
          </div>

          {/* Short Bio Quote Skeleton */}
          <div className="max-w-2xl mx-auto mb-3 md:mb-4 space-y-2">
            <div className={`h-5 w-full bg-slate-200 rounded ${shimmerClass}`} />
            <div className={`h-5 w-4/5 mx-auto bg-slate-200 rounded ${shimmerClass}`} />
          </div>

          {/* Social Links Skeleton */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`w-6 h-6 bg-slate-200 rounded ${shimmerClass}`} />
            <div className={`w-6 h-6 bg-slate-200 rounded ${shimmerClass}`} />
            <div className={`w-6 h-6 bg-slate-200 rounded ${shimmerClass}`} />
          </div>
        </div>

        {/* Previous Companies Skeleton */}
        <div className="bg-[#F8F8F8] rounded-[12px] p-4">
          <div className={`h-5 w-32 mx-auto mb-4 bg-slate-200 rounded ${shimmerClass}`} />
          <div className="grid grid-cols-3 gap-4 md:gap-6 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`h-7 w-24 bg-slate-200 rounded ${shimmerClass}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Story Section Skeleton */}
      <section className="max-w-4xl mx-auto px-[38px] md:px-4 py-[16px]">
        <div className={`h-8 w-64 mx-auto mb-6 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 w-full bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 w-full bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 w-3/4 bg-slate-200 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>

        {/* Highlight Quote Skeleton */}
        <div className="my-8 px-4 space-y-2">
          <div className={`h-6 w-full bg-slate-200 rounded ${shimmerClass}`} />
          <div className={`h-6 w-3/4 mx-auto bg-slate-200 rounded ${shimmerClass}`} />
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 w-full bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 w-5/6 bg-slate-200 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>

        {/* Signature Skeleton */}
        <div className="mt-8">
          <div className={`h-12 w-48 bg-slate-200 rounded ${shimmerClass}`} />
          <div className={`h-4 w-32 mt-2 bg-slate-200 rounded ${shimmerClass}`} />
        </div>
      </section>

      {/* About Section Skeleton */}
      <section className="max-w-4xl mx-auto px-[38px] md:px-4 py-[16px]">
        <div className={`h-8 w-48 mb-4 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className={`h-4 w-full bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 w-full bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 w-4/5 bg-slate-200 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Career Highlights Skeleton */}
      <section className="max-w-4xl mx-auto px-[38px] md:px-4 pb-[12px]">
        <div className={`h-6 w-64 mb-4 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={`w-4 h-4 mt-1 bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 flex-1 bg-slate-200 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Authority Skeleton */}
      <section className="max-w-4xl mx-auto px-[29px] md:px-4 pt-[12px]">
        <div className={`h-6 w-40 mb-4 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="grid grid-cols-3 gap-[12px] md:gap-[14px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-[12px] border border-[#F2F2F2]">
              <div className={`w-8 h-8 mb-2 bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-3 w-16 mb-1 bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-5 w-12 bg-slate-200 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </section>

      {/* As Seen In Skeleton */}
      <section className="bg-[#F8F8F8] py-[16px] my-[16px]">
        <div className="max-w-4xl mx-auto px-[29px]">
          <div className={`h-7 w-32 mb-4 bg-slate-200 rounded ${shimmerClass}`} />
          <div className="flex flex-col">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-[12px]">
                <div className="flex items-center gap-3">
                  <div className={`w-[40px] h-[40px] rounded-full bg-slate-200 ${shimmerClass}`} />
                  <div>
                    <div className={`h-4 w-48 mb-1 bg-slate-200 rounded ${shimmerClass}`} />
                    <div className={`h-3 w-32 bg-slate-200 rounded ${shimmerClass}`} />
                  </div>
                </div>
                <div className={`w-5 h-5 bg-slate-200 rounded ${shimmerClass}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Skeleton */}
      <section className="max-w-6xl mx-auto px-0 py-[16px]">
        <div className={`h-7 w-44 mb-4 px-[29px] md:px-4 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="flex gap-4 overflow-hidden px-[29px] md:px-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[280px]">
              <div className={`w-full h-[160px] mb-3 bg-slate-200 rounded-lg ${shimmerClass}`} />
              <div className={`h-5 w-full mb-2 bg-slate-200 rounded ${shimmerClass}`} />
              <div className={`h-4 w-3/4 bg-slate-200 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Articles Skeleton */}
      <section className="max-w-4xl mx-auto px-[29px] py-[16px]">
        <div className={`h-7 w-40 mb-4 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="flex flex-col gap-[12px]">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 pb-[12px] border-b border-[#F2F2F2]">
              <div className={`w-[80px] h-[80px] flex-shrink-0 bg-slate-200 rounded ${shimmerClass}`} />
              <div className="flex-1 flex flex-col gap-[12px]">
                <div className={`h-5 w-full bg-slate-200 rounded ${shimmerClass}`} />
                <div className={`h-4 w-24 bg-slate-200 rounded ${shimmerClass}`} />
              </div>
            </div>
          ))}
        </div>
        <div className={`h-5 w-36 mt-6 bg-slate-200 rounded ${shimmerClass}`} />
      </section>

      {/* Areas of Expertise Skeleton */}
      <section className="max-w-4xl mx-auto px-[29px] py-[16px]">
        <div className={`h-7 w-44 mb-4 bg-slate-200 rounded ${shimmerClass}`} />
        <div className="flex flex-wrap gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-10 w-32 bg-slate-200 rounded-full ${shimmerClass}`} />
          ))}
        </div>
      </section>

      {/* Let's Connect CTA Skeleton */}
      <section className="max-w-4xl mx-auto px-[14px] py-[16px]">
        <div className="bg-gray-50 rounded-3xl p-8 text-center">
          <div className={`h-8 w-40 mx-auto mb-4 bg-slate-200 rounded ${shimmerClass}`} />
          <div className="max-w-md mx-auto mb-6 space-y-2">
            <div className={`h-5 w-full bg-slate-200 rounded ${shimmerClass}`} />
            <div className={`h-5 w-4/5 mx-auto bg-slate-200 rounded ${shimmerClass}`} />
          </div>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <div className={`h-12 w-full bg-slate-200 rounded-full ${shimmerClass}`} />
            <div className={`h-12 w-full bg-slate-200 rounded-full ${shimmerClass}`} />
          </div>
        </div>
      </section>
    </main>
  );
}
