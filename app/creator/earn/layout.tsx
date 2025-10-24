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
  title: "Earn More with Sparkonomy | India's 1st Invoicing AI for Creators",
  description:
    "Get paid faster with India's first invoicing AI built exclusively for creators. Send invoices, track payments, and manage taxes effortlessly. Now in Private Beta!",
  keywords: [
    "creator invoicing",
    "AI invoicing",
    "creator economy",
    "invoice generator",
    "payment tracking",
    "GST invoicing",
    "creator payments",
    "freelance invoicing",
    "influencer invoicing",
    "sparkonomy",
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
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "Sparkonomy",
    url: "https://sparkonomy.com/creator/earn",
    title: "Earn More with Sparkonomy | India's 1st Invoicing AI for Creators",
    description:
      "Get paid faster with India's first invoicing AI built exclusively for creators. Send invoices, track payments, and manage taxes effortlessly.",
    images: [
      {
        url: "/sparkonomy-earn.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Invoicing AI for Creators",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Earn More with Sparkonomy | India's 1st Invoicing AI for Creators",
    description:
      "Get paid faster with India's first invoicing AI built exclusively for creators. Send invoices, track payments, and manage taxes effortlessly.",
    images: ["/sparkonomy-earn.png"],
  },
};

export default function EarnLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className={roboto.className}>{children}</div>;
}
