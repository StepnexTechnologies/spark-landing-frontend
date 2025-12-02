import type { Metadata } from "next";
import { CategoryBlogTemplate, CATEGORY_CONFIGS } from "@/components/blog/common";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const config = CATEGORY_CONFIGS.brand;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Brand | Sparkonomy Blog",
  description: "Insights and updates for brands on Sparkonomy",
  alternates: {
    canonical: "https://sparkonomy.com/blogs/brand",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "Sparkonomy",
    url: "https://sparkonomy.com/blogs/brand",
    title: "Brand | Sparkonomy Blog",
    description: "Insights and updates for brands on Sparkonomy",
    images: [
      {
        url: "/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Brand Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand | Sparkonomy Blog",
    description: "Insights and updates for brands on Sparkonomy",
    images: ["/sparkonomy.png"],
    site: "@sparkonomy",
    creator: "@sparkonomy",
  },
};

export default function BrandPage() {
  return <CategoryBlogTemplate config={config} />;
}
