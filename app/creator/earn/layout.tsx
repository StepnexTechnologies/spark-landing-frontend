import type {Metadata} from "next";
import {ReactNode} from "react";
import {Roboto} from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Get paid faster — like your friend! Join them for FREE on Sparkonomy, the 1st AI for creators.",
  description:
    "Say NO to messy spreadsheets and manual invoices. Run your creator business like a pro. Join 100% free before early access ends!",
  keywords: [
    "creator invoicing",
    "influencer invoicing",
    "AI invoicing",
    "creator economy",
    "invoice generator",
    "payment tracking",
    "GST invoicing",
    "creator payments",
    "influencer payments",
    "freelance invoicing",
    "youtuber invoicing",
    "instagrammer invoicing",
    "social media influencer invoicing",
    "content creator payments",
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
    apple: [
      { url: "/earn-180x180Px.png", sizes: "180x180", type: "image/png" },
    ],
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
    url: "https://sparkonomy.com/creator/earn",
    title: "Get paid faster — like your friend! Join them for FREE on Sparkonomy, the 1st AI for creators.",
    description:
      "Say NO to messy spreadsheets and manual invoices. Run your creator business like a pro. Join 100% free before early access ends!",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get paid faster — like your friend! Join them for FREE on Sparkonomy, the 1st AI for creators.",
    description:
      "Say NO to messy spreadsheets and manual invoices. Run your creator business like a pro. Join 100% free before early access ends!",
  },
};

export default function EarnLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className={roboto.className}>{children}</div>;
}
