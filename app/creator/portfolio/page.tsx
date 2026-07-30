import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IS_DEV_ENVIRONMENT } from "@/lib/urls";
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

// Work in progress: the portfolio page is only reachable on the dev origin. On
// beta/production SITE_URL is not `https://dev.*`, so this 404s — which also
// keeps it out of the index without relying on a noindex tag.
export default function Page() {
  if (!IS_DEV_ENVIRONMENT) notFound();

  return <CreatorPortfolioPage />;
}
