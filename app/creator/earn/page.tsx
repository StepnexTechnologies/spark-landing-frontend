import type {Metadata} from "next";
import CreatorEarnPage from "./CreatorEarnPage";
import {
  STORY_IMAGES,
  nextImageUrl,
  resolveStoryLang,
  storySrcSet,
} from "@/components/creator/earn/storyImages";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;

  const isHindi = lang === "hi-Latn";
  const ogImage = isHindi ? "/og-earn-hi-v2.png" : "/og-earn-en-v2.png";
  const ogAlt = isHindi ? "Sparkonomy AI - Hindi" : "Sparkonomy AI";

  const title = isHindi
    ? "Fast payments paayein — bilkul aapke Creator friends ki tarah. Unhe Sparkonomy par join karein — Creators ke liye banaya gaya pehla AI. 100% FREE."
    : "Get paid faster — like your friend! Join them for FREE on Sparkonomy, the 1st AI for Creators.";

  const description = isHindi
    ? "Messy spreadsheets aur manual invoices ko bolein NO. Apna Creator business ek Pro ki tarah run karein. Early access khatam hone se pehle 100% FREE join karein!"
    : "Say NO to messy spreadsheets and manual invoices. Run your Creator business like a pro. Join 100% free before early access ends!";

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
  const stories = STORY_IMAGES[resolveStoryLang(lang)];
  const hero = stories[0];

  // Story 1 is the LCP element — preload it at high priority from the document
  // head (Next/Image `priority` alone wasn't getting fetchpriority=high onto the
  // actual request). The srcset matches the carousel's <Image> exactly, so this
  // preload IS the request the browser uses.
  //
  // Stories 2-4 used to be preloaded here too, at fetchpriority=low. Even
  // deprioritised, three extra image fetches inside the LCP window still share
  // the connection — and as document resources they gate `window.load`, which is
  // what the carousel waits on before rotating. They now warm from
  // HeroStoryCarousel during idle instead: off the document's critical path, but
  // with the whole hydration→rotation gap to arrive, so swaps stay flash-free.
  //
  // Skipped when ?ref= is present, since referral visitors bypass the stories.
  return (
    <>
      {!ref && (
        <link
          rel="preload"
          as="image"
          href={nextImageUrl(hero, 384)}
          imageSrcSet={storySrcSet(hero)}
          fetchPriority="high"
        />
      )}
      <CreatorEarnPage />
    </>
  );
}
