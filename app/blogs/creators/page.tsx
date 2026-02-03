import type { Metadata } from "next";
import { CategoryBlogTemplate, CATEGORY_CONFIGS } from "@/components/blog/common";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const config = CATEGORY_CONFIGS.creators;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Creators | Sparkonomy Blog",
  description: "Insights and updates for creators on Sparkonomy",
  alternates: {
    canonical: "https://sparkonomy.com/blogs/creators",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    siteName: "Sparkonomy",
    url: "https://sparkonomy.com/blogs/creators",
    title: "Creators | Sparkonomy Blog",
    description: "Insights and updates for creators on Sparkonomy",
    images: [
      {
        url: "/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Creators Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creators | Sparkonomy Blog",
    description: "Insights and updates for creators on Sparkonomy",
    images: ["/sparkonomy.png"],
    site: "@sparkonomy",
    creator: "@sparkonomy",
  },
};

export default function CreatorsPage() {
  return <CategoryBlogTemplate config={config} />;
}
