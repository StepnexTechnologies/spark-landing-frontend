import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {PROMO_CONFIG, isPromoActiveAt} from "@/lib/promo/config";
import promoCopy from "@/public/locales/hi-Latn/creatorPromo.json";
import CreatorPromoPage from "./CreatorPromoPage";

type Props = {
  searchParams: Promise<{ lang?: string; ref?: string }>;
};

const PAGE_URL = "https://www.sparkonomy.com/creator/promo";

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { lang } = await searchParams;

  const isHindi = lang !== "en";
  const ogImage = "/promo/landing-promo/OG_promo_landing.png";
  const ogAlt = "Sparkonomy — Hinglish invoicing for Creators";

  const title = isHindi
    ? "Apni Boli, Apna Bill — Hinglish mein invoice banayein. Daily Amazon vouchers jeetein!"
    : "Apni Boli, Apna Bill — Hinglish invoicing for Creators. Win Amazon vouchers daily!";

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

// Shared by /promo (no variant, typewriter on) and /promo-f (variant="f",
// typewriter off). /promo-f imports this so the kill-switch + JSON-LD wiring
// stays in one place. /promo-w is intentionally NOT routed through here — it
// has its own page entry so changes to the typewriter flag don't propagate.
export async function renderPromoPage(variant?: "f", enableTypewriter = false) {
  // Route-level kill switch: take the page down when the promo is disabled or
  // outside its active window. Paid traffic landing on an ended-promo URL gets
  // a 404 rather than a hero advertising a stale offer.
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
      <CreatorPromoPage variant={variant} enableTypewriter={enableTypewriter} />
    </>
  );
}

export default async function Page() {
  return renderPromoPage(undefined, true);
}
