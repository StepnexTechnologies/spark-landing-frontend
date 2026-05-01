import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PROMO_CONFIG, isPromoActiveAt} from "@/lib/promo/config";
import CreatorPromoPage from "./CreatorPromoPage";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;

  const isHindi = lang !== "en";
  const ogImage = isHindi ? "/og-earn-hi-v2.png" : "/og-earn-en-v2.png";
  const ogAlt = isHindi ? "Sparkonomy Promo - Hinglish" : "Sparkonomy Promo";

  const title = isHindi
    ? "Apni Boli, Apna Bill — Hinglish mein invoice banayein. Daily Amazon vouchers jeetein!"
    : "Apni Boli, Apna Bill — Hinglish invoicing for creators. Win Amazon vouchers daily!";

  const description = isHindi
    ? "Hinglish mein baat karein, perfect English invoices paayein. 100% free sign up karein aur har din Amazon vouchers jeetein. T&Cs apply."
    : "Talk in Hinglish, get perfect English invoices. Sign up free and win Amazon vouchers daily. T&Cs apply.";

  return {
    title,
    description,
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page() {
  // Route-level kill switch: take the page down when the promo is disabled or
  // outside its active window. Paid traffic landing on an ended-promo URL gets
  // a 404 rather than a hero advertising a stale offer.
  if (!PROMO_CONFIG.enabled || !isPromoActiveAt()) {
    notFound();
  }
  return <CreatorPromoPage />;
}
