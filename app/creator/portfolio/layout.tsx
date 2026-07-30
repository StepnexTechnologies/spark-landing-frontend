import type { Metadata } from "next";
import { ReactNode } from "react";
import { Solitreo } from "next/font/google";
import MetaPixelScript from "@/components/MetaPixelScript";

// Script font for the hero title's second line (the <1>…</1> portion of
// hero.title). Scoped to /creator/portfolio via a CSS variable so the rest of
// the site keeps shipping just Roboto. Solitreo only ships at weight 400.
const solitreo = Solitreo({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-solitreo",
});

// TODO: tune copy/keywords/OG once the portfolio positioning is finalized.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Claim your Creator portfolio — free on Sparkonomy, the 1st AI for Creators.",
  description:
    "TODO: portfolio meta description. Showcase your work and get discovered — join 100% free.",
  keywords: [
    "creator portfolio",
    "influencer portfolio",
    "creator economy",
    "content creator portfolio",
    "sparkonomy",
  ],
  authors: [{ name: "Team Sparkonomy" }],
  creator: "Sparkonomy",
  publisher: "Sparkonomy",
  icons: {
    icon: [
      { url: "/earn-48x48Px.png", sizes: "48x48", type: "image/png" },
      { url: "/earn-192x192Px.png", sizes: "192x192", type: "image/png" },
      { url: "/earn-512x512Px.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/earn-180x180Px.png", sizes: "180x180", type: "image/png" }],
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
    url: "https://www.sparkonomy.com/creator/portfolio",
    title: "Claim your Creator portfolio — free on Sparkonomy, the 1st AI for Creators.",
    description:
      "TODO: portfolio meta description. Showcase your work and get discovered — join 100% free.",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claim your Creator portfolio — free on Sparkonomy, the 1st AI for Creators.",
    description:
      "TODO: portfolio meta description. Showcase your work and get discovered — join 100% free.",
  },
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  // Roboto is applied globally via <body> in the root layout; here we only add
  // the Solitreo variable used by the hero headline's script tail.
  return (
    <div className={solitreo.variable}>
      <MetaPixelScript />
      {children}
    </div>
  );
}
