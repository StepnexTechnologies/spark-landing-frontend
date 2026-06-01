import type {Metadata} from "next";
import CreatorEarnPage from "./CreatorEarnPage";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

// Preload hint for the first story's image. First-time visitors see the
// stories overlay as their LCP, and since the <Image> only mounts after the
// client finishes hydrating (behind the Loading... gate), the browser otherwise
// can't begin fetching it until React runs. Emitting a srcset-matching preload
// on the server lets the fetch overlap hydration. Skipped when ?ref= is
// present, since referral visitors bypass the stories entirely.
function nextImageUrl(src: string, width: number, quality = 75): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

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
  const storyImage = lang === "hi-Latn"
    ? "/images/creator/earn/story-1-hi-Latn.png"
    : "/images/creator/earn/story-1.png";
  const shouldPreloadStory = !ref;

  return (
    <>
      {shouldPreloadStory && (
        <link
          rel="preload"
          as="image"
          href={nextImageUrl(storyImage, 828)}
          imageSrcSet={`${nextImageUrl(storyImage, 640)} 640w, ${nextImageUrl(storyImage, 828)} 828w, ${nextImageUrl(storyImage, 1080)} 1080w`}
          imageSizes="(max-width: 640px) 90vw, 362px"
          fetchPriority="high"
        />
      )}
      <CreatorEarnPage />
    </>
  );
}
