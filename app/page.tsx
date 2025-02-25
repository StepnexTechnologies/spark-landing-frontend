import type React from "react";
import HeroSection from "@/components/HeroSection";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "Sparkonomy",
  description: "Welcome to Sparkonomy - Let's Build The Future Together!",
  openGraph: {
    title: "Sparkonomy",
    description: "Welcome to Sparkonomy - Let's Build The Future Together!",
    images: [
      {
        url: "/Sparkonomy.jpg",
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
    description: "Welcome to Sparkonomy - Let's Build The Future Together!",
    images: ["/Sparkonomy.jpg"],
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
