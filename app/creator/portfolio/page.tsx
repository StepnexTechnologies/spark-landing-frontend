import type { Metadata } from "next";
import CreatorPortfolioPage from "./PortfolioPage";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;
  const isHindi = lang === "hi-Latn";

  // TODO: supply portfolio OG images (fall back to the earn assets for now).
  const ogImage = isHindi ? "/og-earn-hi-v2.png" : "/og-earn-en-v2.png";
  const ogAlt = isHindi ? "Sparkonomy AI - Hindi" : "Sparkonomy AI";

  return {
    openGraph: {
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
    },
  };
}

export default function Page() {
  return <CreatorPortfolioPage />;
}
