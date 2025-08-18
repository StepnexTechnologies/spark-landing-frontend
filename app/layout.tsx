import "./globals.css";
import {Montserrat} from "next/font/google";
import {Analytics} from "@vercel/analytics/react";
import {SpeedInsights} from "@vercel/speed-insights/next";
import type React from "react";
import {RootLayoutClient} from "./root-layout-client";
import type {Metadata} from "next";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://spark-landing-frontend.vercel.app'),
  title: {
    default: "Spark - Landing Page",
    template: "%s | Spark"
  },
  description: "Welcome to Spark - your gateway to innovation and excellence.",
  keywords: ["spark", "landing page", "innovation", "technology"],
  authors: [{ name: "Spark Team" }],
  creator: "Spark",
  publisher: "Spark",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sparkonomy.com/",
    title: "Spark - Landing Page",
    description: "Welcome to Spark - your gateway to innovation and excellence.",
    siteName: "Spark",
    images: [
      {
        url: "/Sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Spark Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark - Landing Page",
    description: "Welcome to Spark - your gateway to innovation and excellence.",
    images: ["/Sparkonomy.png"],
  },
  alternates: {
    canonical: "https://spark-landing-frontend.vercel.app",
  },
  verification: {
    google: "ptQwDw_lS9CEO3U7kNf5elzz79R6I4dXVLGyP1dfJY0",
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://spark-landing-frontend.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.className} min-h-[100dvh] w-full relative`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
