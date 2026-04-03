import type React from "react";
import {Suspense} from "react";
import HeroSection from "@/components/HeroSection";
import {Metadata} from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Sparkonomy",
  description: "Sparking the creator economy with the world's first AI - made exclusively for creators, influencers, YouTubers & Instagrammers!",
    keywords: [
        "sparkonomy",
        "landing page",
        "innovation",
        "technology",
        "creator",
        "creators",
        "influencer",
        "influencers",
        "social media influencer",
        "social media influencers",
        "instagrammer",
        "instagrammers",
        "youtuber",
        "youtubers",
        "content creator",
        "content creators",
        "social media",
        "community",
        "platform",
        "creator economy",
        "influencer platform",
    ],
    authors: [{ name: "Team Sparkonomy" }],
    creator: "Sparkonomy",
    publisher: "Sparkonomy",
    robots: {
        index: true,
        follow: true,
        googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "standard",
        "max-snippet": -1,
        },
    },
  openGraph: {
      siteName: "Sparkonomy",
      url: "https://sparkonomy.com/",
    title: "Sparkonomy",
    description: "Sparkonomy - The #1 AI platform for creators, influencers, YouTubers & Instagrammers. Transforming the creator economy!",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy - AI Platform for Creators & Influencers",
      },
    ],
    locale: "en_IND",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkonomy - AI for Creators, Influencers, YouTubers & Instagrammers",
    description: "Sparkonomy - The #1 AI platform for creators, influencers, YouTubers & Instagrammers. Transforming the creator economy!",
    images: ["/og-home.png"],
  },
};

export default function Home() {
  return (
    <main className="h-[100dvh] overflow-hidden">
      <Suspense>
        <HeroSection />
      </Suspense>
    </main>
  );
}
