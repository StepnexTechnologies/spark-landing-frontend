import type {Metadata} from "next";
import CreatorEarnPage from "./CreatorEarnPage";

type Props = {
  searchParams: Promise<{ lang?: string }>;
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

export default function Page() {
  return <CreatorEarnPage />;
}
