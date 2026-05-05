import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PROMO_CONFIG, isPromoActiveAt} from "@/lib/promo/config";
import promoCopy from "@/public/locales/hi-Latn/creatorPromo.json";
import CreatorPromoPage from "@/app/creator/promo/CreatorPromoPage";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

const PAGE_URL = "https://www.sparkonomy.com/creator/promo-w";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;

  const isHindi = lang !== "en";
  const ogImage = "/promo/landing-promo/OG_promo_landing.png";
  const ogAlt = "Sparkonomy — Hinglish invoicing for creators";

  const title = isHindi
    ? "Apni Boli, Apna Bill — Hinglish mein invoice banayein. Daily Amazon vouchers jeetein!"
    : "Apni Boli, Apna Bill — Hinglish invoicing for creators. Win Amazon vouchers daily!";

  const description = isHindi
    ? "Hinglish mein baat karein, perfect English invoices paayein. 100% free sign up karein aur har din Amazon vouchers jeetein. T&Cs apply."
    : "Talk in Hinglish, get perfect English invoices. Sign up free and win Amazon vouchers daily. T&Cs apply.";

  return {
    title,
    description,
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
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

interface FaqItem {
  question: string;
  answer: string;
}

function buildFaqJsonLd() {
  const items = (promoCopy as { faq?: { items?: FaqItem[] } }).faq?.items ?? [];
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}

// promo-w is the WhatsApp-ad campaign alias. It mirrors today's static
// /creator/promo render and is intentionally disconnected from
// app/creator/promo/page.tsx so the typewriter restoration there does not
// propagate here.
export default async function Page() {
  if (!PROMO_CONFIG.enabled || !isPromoActiveAt()) {
    notFound();
  }
  const faqJsonLd = buildFaqJsonLd();
  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <CreatorPromoPage variant="w" />
    </>
  );
}
