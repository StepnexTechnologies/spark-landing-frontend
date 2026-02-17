import type {Metadata} from "next";
import CreatorEarnPage from "./CreatorEarnPage";

type Props = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;

  const isHindi = lang === "hi-Latn";
  const ogImage = isHindi ? "/og-earn-hi.png" : "/og-earn-en.png";
  const ogAlt = isHindi ? "Sparkonomy AI - Hindi" : "Sparkonomy AI";

  return {
    openGraph: {
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
      images: [ogImage],
    },
  };
}

export default function Page() {
  return <CreatorEarnPage />;
}
