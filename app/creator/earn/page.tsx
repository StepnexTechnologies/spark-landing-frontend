import type {Metadata} from "next";
import CreatorEarnPage from "./CreatorEarnPage";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

// Story-image preloads. First-time visitors see the auto-rotating story
// carousel as their LCP. Story 1 is now rendered straight from the server HTML
// (the old client-only "Loading..." gate is gone) with Next/Image `priority`,
// so Next emits a correctly-matched high-priority preload for it automatically.
// We additionally warm stories 2-4 here at LOW priority so the 2s/4s/6s carousel
// swaps are instant without ever competing with the LCP fetch or hydration.
// Skipped when ?ref= is present, since referral visitors bypass the stories.
function nextImageUrl(src: string, width: number, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

// Mirror the srcset Next/Image generates for the carousel's fixed 210px-wide
// <Image> (1x → w=256, 2x → w=640, default q=75). Keeping these byte-identical
// is what lets the browser reuse the preloaded variant instead of refetching.
function storySrcSet(src: string): string {
  return `${nextImageUrl(src, 256)} 1x, ${nextImageUrl(src, 640)} 2x`;
}

// Filenames mirror HeroStoryCarousel's STORY_IMAGES exactly, so the preloads
// line up with what the component actually requests.
const STORY_FILES: Record<"en" | "hi-Latn", readonly string[]> = {
  en: ["story-1.png", "Story2.png", "story-3.png", "story-4.png"],
  "hi-Latn": [
    "story-1-hi-Latn.png",
    "Story2-hi.png",
    "story-3-hi-Latn.png",
    "story-4-hi-Latn.png",
  ],
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;

  const isHindi = lang === "hi-Latn";
  const ogImage = isHindi ? "/og-earn-hi-v2.png" : "/og-earn-en-v2.png";
  const ogAlt = isHindi ? "Sparkonomy AI - Hindi" : "Sparkonomy AI";

  const title = isHindi
    ? "Fast payments paayein — bilkul aapke creator friends ki tarah. Unhe Sparkonomy par join karein — creators ke liye banaya gaya pehla AI. 100% FREE."
    : "Get paid faster — like your friend! Join them for FREE on Sparkonomy, the 1st AI for creators.";

  const description = isHindi
    ? "Messy spreadsheets aur manual invoices ko bolein NO. Apna creator business ek Pro ki tarah run karein. Early access khatam hone se pehle 100% FREE join karein!"
    : "Say NO to messy spreadsheets and manual invoices. Run your creator business like a pro. Join 100% free before early access ends!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { lang, ref } = await searchParams;
  const stories = STORY_FILES[lang === "hi-Latn" ? "hi-Latn" : "en"];
  const base = "/images/creator/earn/";
  const shouldPreloadStories = !ref;

  return (
    <>
      {shouldPreloadStories &&
        // Skip index 0 — Next/Image `priority` already emits a matched
        // high-priority preload for story 1. Warm 2-4 at low priority.
        stories.slice(1).map((file) => (
          <link
            key={file}
            rel="preload"
            as="image"
            href={nextImageUrl(base + file, 640)}
            imageSrcSet={storySrcSet(base + file)}
            fetchPriority="low"
          />
        ))}
      <CreatorEarnPage />
    </>
  );
}
