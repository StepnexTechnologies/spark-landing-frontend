import type { Metadata } from "next";
import { CategoryBlogTemplate, CATEGORY_CONFIGS } from "@/components/blog/common";

export const revalidate = 300;

const config = CATEGORY_CONFIGS.creators;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Creators & Influencers | Sparkonomy Blog - Tips for YouTubers, Instagrammers & Social Media Influencers",
  description: "Insights, tips and updates for creators, influencers, YouTubers, Instagrammers and social media influencers. Grow your audience and monetize your content with Sparkonomy.",
  keywords: [
    "creators",
    "influencers",
    "social media influencers",
    "instagrammers",
    "youtubers",
    "content creators",
    "creator tips",
    "influencer tips",
    "instagram creator",
    "youtube creator",
    "creator economy blog",
    "influencer marketing tips",
  ],
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
    title: "Creators & Influencers | Sparkonomy Blog - YouTubers, Instagrammers & More",
    description: "Insights, tips and updates for creators, influencers, YouTubers, Instagrammers and social media influencers on Sparkonomy.",
    images: [
      {
        url: "/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Blog for Creators & Influencers",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creators & Influencers | Sparkonomy Blog",
    description: "Tips and insights for creators, influencers, YouTubers & Instagrammers on Sparkonomy.",
    images: ["/sparkonomy.png"],
    site: "@sparkonomy",
    creator: "@sparkonomy",
  },
};

export default function CreatorsPage() {
  return <CategoryBlogTemplate config={config} />;
}
