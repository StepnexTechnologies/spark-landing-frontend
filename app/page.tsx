import type React from "react";
import HeroSection from "@/components/HeroSection";
import {Metadata} from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Sparkonomy",
  description: "Welcome to Sparkonomy - Transforming the creator economy!",
    keywords: [
        "sparkonomy",
        "landing page",
        "innovation",
        "technology",
        "creator",
        "social media",
        "influencer",
        "community",
        "platform",
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
    description: "Welcome to Sparkonomy - Transforming the creator economy!",
    images: [
      {
        url: "/sparkonomy_full.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Thumbnail",
      },
    ],
    locale: "en_IND",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sparkonomy",
    description: "Welcome to Sparkonomy - Transforming the creator economy!",
    images: ["/sparkonomy_full.png"],
  },
};

export default function Home() {
  return (
    <main className="overflow-hidden">
      <div className="">
        <div className="flex-grow">
          <HeroSection />
        </div>
      </div>
    </main>
  );
}
