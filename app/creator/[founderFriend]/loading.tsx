// Skeleton mirrors the FounderInviteHero layout: friend avatar, divider,
// headline, founder quote card, "WHAT IS SPARKONOMY?" intro, signup card.
// Tone-matched to the black backdrop (subtle white shimmer instead of the
// slate shimmer used on the blog skeleton).
export default function Loading() {
  const shimmer =
    "animate-shimmer bg-gradient-to-r from-white/5 via-white/15 to-white/5 bg-[length:200%_100%]";

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <div className="relative z-10 max-w-[440px] mx-auto px-5 pt-10 pb-16 space-y-6">
        {/* friend avatar pill */}
        <div className="flex flex-col items-center gap-3">
          <div className={`w-[72px] h-[72px] rounded-full ${shimmer}`} />
          <div className={`h-6 w-44 rounded-full ${shimmer}`} />
        </div>
        {/* divider */}
        <div className={`h-3 w-56 mx-auto rounded ${shimmer}`} />
        {/* headline */}
        <div className="space-y-2">
          <div className={`h-7 w-full rounded ${shimmer}`} />
          <div className={`h-7 w-5/6 mx-auto rounded ${shimmer}`} />
          <div className={`h-7 w-2/3 mx-auto rounded ${shimmer}`} />
        </div>
        {/* quote card */}
        <div className={`h-[112px] w-full rounded-[20px] ${shimmer}`} />
        {/* what-is heading + body */}
        <div className="space-y-2">
          <div className={`h-3 w-44 rounded ${shimmer}`} />
          <div className={`h-6 w-2/3 rounded ${shimmer}`} />
          <div className={`h-4 w-full rounded ${shimmer}`} />
          <div className={`h-4 w-full rounded ${shimmer}`} />
          <div className={`h-4 w-3/4 rounded ${shimmer}`} />
        </div>
        {/* signup card */}
        <div className={`h-[420px] w-full rounded-[24px] ${shimmer}`} />
      </div>
    </main>
  );
}
