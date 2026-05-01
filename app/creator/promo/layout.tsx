import type {Metadata} from "next";
import {ReactNode} from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Apni Boli, Apna Bill — Hinglish invoicing for creators | Sparkonomy",
  description:
    "Talk in Hinglish, get perfect English invoices. Sign up free and win Amazon vouchers daily. T&Cs apply.",
  keywords: [
    "creator invoicing",
    "hinglish invoicing",
    "AI invoicing",
    "creator economy",
    "invoice generator",
    "GST invoicing",
    "creator payments",
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
    index: false,
    follow: true,
  },
  openGraph: {
    siteName: "Sparkonomy",
    url: "https://sparkonomy.com/creator/promo",
    title: "Apni Boli, Apna Bill — Hinglish invoicing for creators | Sparkonomy",
    description:
      "Talk in Hinglish, get perfect English invoices. Sign up free and win Amazon vouchers daily. T&Cs apply.",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/promo/landing-promo/OG_promo_landing.png",
        alt: "Sparkonomy — Hinglish invoicing for creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apni Boli, Apna Bill — Hinglish invoicing for creators | Sparkonomy",
    description:
      "Talk in Hinglish, get perfect English invoices. Sign up free and win Amazon vouchers daily. T&Cs apply.",
    images: ["/promo/landing-promo/OG_promo_landing.png"],
  },
};

export default function PromoLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
