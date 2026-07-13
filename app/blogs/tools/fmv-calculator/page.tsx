import type { Metadata } from "next";
import Script from "next/script";
import FMVCalculator from "./FMVCalculator";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com"),
  title: "Creator Barter FMV Calculator — Free Tool by Sparkonomy",
  description:
    "Free fair market value (FMV) calculator for Indian creators. Got a product, stay, voucher, or gifting deal for content? Work out the FMV to record as income, the GST service value, and a Section 194R alert in 30 seconds.",
  keywords: [
    "barter FMV calculator",
    "fair market value creator",
    "gifting deal tax India",
    "creator barter tax",
    "194R calculator",
    "influencer gifting GST",
    "non cash benefit income creator",
    "PR package tax India",
  ],
  authors: [{ name: "Sparkonomy" }],
  creator: "Sparkonomy",
  publisher: "Sparkonomy",
  alternates: {
    canonical: "https://www.sparkonomy.com/blogs/tools/fmv-calculator",
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
    url: "https://www.sparkonomy.com/blogs/tools/fmv-calculator",
    title: "Creator Barter FMV Calculator — Free Tool by Sparkonomy",
    description:
      "Brand gave you a product, stay, or voucher for content? Find the fair market value to record as income, GST value, and 194R alert. Free for Indian creators.",
    siteName: "Sparkonomy",
    locale: "en_IN",
    images: [
      {
        url: "https://www.sparkonomy.com/og-fmv-calculator.png",
        alt: "Creator Barter FMV Calculator by Sparkonomy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sparkonomy",
    title: "Creator Barter FMV Calculator — Free Tool by Sparkonomy",
    description:
      "Work out the fair market value of a barter/gifting deal, its GST value, and a 194R alert. Free for Indian creators.",
    images: ["https://www.sparkonomy.com/og-fmv-calculator.png"],
  },
};

// SCHEMA.ORG (AEO / GEO — AI search engines read this)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Creator Barter FMV Calculator",
      url: "https://www.sparkonomy.com/blogs/tools/fmv-calculator",
      description:
        "Free fair market value (FMV) calculator for Indian content creators who receive products, stays, vouchers, or other non-cash benefits from brands in exchange for content. Suggests a simple FMV to record as income, calculates the GST service value for GST-registered creators, and flags whether Section 194R TDS on benefits may apply.",
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
          name: "What is fair market value (FMV) for a barter or gifting deal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fair market value is the price the product, stay, voucher, or perk would sell for in the open market on the date you received it. When a brand gives you a non-cash benefit for content, that FMV generally has to be recorded as income. This calculator suggests a simple, defensible FMV using the lowest reliable current value you can prove — the market price when received, the brand-confirmed value, or the current marketplace price.",
          },
        },
        {
          "@type": "Question",
          name: "How should I value a free product a brand sent me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use the lowest reliable current price you can genuinely prove — for example the price on the brand's website, an invoice, or the same product on a marketplace like Amazon or Nykaa. Printed MRP is used only as a fallback when no current price source is available, because MRP is often higher than the real selling price. Keep at least one screenshot, link, or email as proof, and subtract anything you paid from your own pocket.",
          },
        },
        {
          "@type": "Question",
          name: "When does Section 194R TDS apply to creator gifting?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Section 194R requires a business to deduct 10% TDS on benefits or perquisites provided to a resident, where the aggregate value of such benefits to that person exceeds ₹20,000 in a financial year. For creators, this typically covers products, gifts, and non-cash perks from a brand. This tool flags when your total barter value from a single brand crosses ₹20,000 for the year so you can confirm the brand-side TDS with them.",
          },
        },
        {
          "@type": "Question",
          name: "Do I have to pay GST on barter deals?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "If you are GST registered, a barter or gifting deal can still create a taxable service value. As a simple caution check, this calculator uses the higher of your usual cash fee and the total deal value as the GST service value, then applies your GST rate (default 18%). Whether it is CGST+SGST or IGST depends on the place of supply — same state means CGST+SGST, different state means IGST. Confirm the exact treatment with your CA.",
          },
        },
      ],
    },
  ],
};

export default function FMVCalculatorPage() {
  return (
    <>
      <Script
        id="fmv-calculator-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FMVCalculator />
    </>
  );
}
