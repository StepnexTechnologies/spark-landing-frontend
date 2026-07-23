// Single source of truth for the hero carousel's story images.
//
// app/creator/earn/page.tsx builds the <link rel="preload"> for story 1 from
// these helpers and HeroStoryCarousel renders + warms the rest from the same
// list, so the preloaded URL is always byte-identical to the one the browser
// actually requests (a mismatch silently doubles the LCP fetch).

export type StoryLang = "en" | "hi-Latn";

export const STORY_IMAGES: Record<StoryLang, readonly string[]> = {
  en: [
    "/images/creator/earn/story-1.png",
    "/images/creator/earn/Story2.png",
    "/images/creator/earn/story-3.png",
    "/images/creator/earn/story-4.png",
  ],
  "hi-Latn": [
    "/images/creator/earn/story-1-hi-Latn.png",
    "/images/creator/earn/Story2-hi.png",
    "/images/creator/earn/story-3-hi-Latn.png",
    "/images/creator/earn/story-4-hi-Latn.png",
  ],
};

export function resolveStoryLang(lang: string | undefined): StoryLang {
  return lang === "hi-Latn" ? "hi-Latn" : "en";
}

export function nextImageUrl(src: string, width: number, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

// Mirrors the srcset next/image emits for the carousel's <Image width={192}>
// (1x → w=256, 2x → w=384, default q=75). Keeping these identical is what lets
// the browser reuse the preloaded variant instead of refetching.
export function storySrcSet(src: string): string {
  return `${nextImageUrl(src, 256)} 1x, ${nextImageUrl(src, 384)} 2x`;
}
