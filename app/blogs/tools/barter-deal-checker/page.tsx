import type { Metadata } from "next";
import Script from "next/script";
import BarterDealChecker from "./BarterDealChecker";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com"),
  title: "Barter Deal Checker — Should I Accept This Barter Deal? | Sparkonomy",
  description:
    "Free barter deal calculator for Indian creators. Enter 9 simple details and find out if a barter or gifting deal is worth accepting — with FMV, GST and Section 194R TDS estimates.",
  keywords: [
    "barter deal checker",
    "should I accept this barter deal",
    "barter deal calculator India",
    "creator gifting deal worth it",
    "influencer barter tax",
    "194R barter creator",
    "GST on barter collaboration",
    "creator negotiation calculator",
  ],
  authors: [{ name: "Sparkonomy" }],
  creator: "Sparkonomy",
  publisher: "Sparkonomy",
  alternates: {
    canonical: "https://www.sparkonomy.com/blogs/tools/barter-deal-checker",
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
    type: "website",
    url: "https://www.sparkonomy.com/blogs/tools/barter-deal-checker",
    title: "Should I accept this barter deal? — Free Creator Calculator",
    description:
      "Estimate the real value of a barter deal in under 60 seconds. Built for Indian creators by Sparkonomy.",
    siteName: "Sparkonomy",
    locale: "en_IN",
    images: [
      {
        url: "https://www.sparkonomy.com/og-barter-deal-checker.png",
        alt: "Barter Deal Checker by Sparkonomy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sparkonomy",
    title: "Should I accept this barter deal? — Free Creator Calculator",
    description:
      "Nine questions, one clear verdict. See what a barter or gifting deal is really worth after expenses, GST and 194R TDS.",
    images: ["https://www.sparkonomy.com/og-barter-deal-checker.png"],
  },
};

// SCHEMA.ORG (AEO / GEO — AI search engines read this)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Barter Deal Checker",
      url: "https://www.sparkonomy.com/blogs/tools/barter-deal-checker",
      description:
        "Free barter deal calculator for Indian content creators. Takes nine simple inputs about a barter, gifting or product collaboration and returns a plain-language Yes, Maybe or No verdict — estimating the fair market value of the product, the creator's out-of-pocket cash, a flat 18% GST planning figure, and Section 194R TDS at 10% where the ₹20,000 annual benefit threshold is crossed.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "en-IN",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      creator: {
        "@type": "Organization",
        name: "Sparkonomy",
        url: "https://www.sparkonomy.com",
        description:
          "Financial and business guidance platform for Indian content creators and influencers.",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is a barter deal taxable in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A product or perk you keep in exchange for professional work may form part of your business or professional income. Returned review units are treated differently. Consult a CA for your specific facts.",
          },
        },
        {
          "@type": "Question",
          name: "Does GST apply to a barter collaboration?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "If you hold a GSTIN, your content service is a taxable supply even when paid in product rather than cash. A common planning estimate is 18% on the value of the deal. Ask the brand to pay GST on top in cash, since barter provides no cash to fund the liability.",
          },
        },
        {
          "@type": "Question",
          name: "When does Section 194R TDS apply to creators?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Section 194R requires 10% TDS when the value of benefits or perquisites from one provider crosses ₹20,000 in a financial year. It is creditable against your final income tax, so it is a cash-flow cost rather than a permanent loss.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate the fair market value of a barter product?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the retail market price on the date you received the product. If unavailable, use the lower of the brand's MRP and the value stated in the brand's email.",
          },
        },
      ],
    },
  ],
};

export default function BarterDealCheckerPage() {
  return (
    <>
      <Script
        id="barter-deal-checker-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BarterDealChecker />
    </>
  );
}
