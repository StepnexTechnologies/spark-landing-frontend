import type { Metadata } from "next";
import Script from "next/script";
import CreatorTaxCalculator from "./CreatorTaxCalculator";

export const metadata: Metadata = {
  metadataBase: new URL("https://sparkonomy.com"),
  title: "Creator Tax Calculator — Free Tool by Sparkonomy",
  description:
    "Free tax calculator for Indian content creators. Compare presumptive taxation (44AD/44ADA) vs normal books for FY 2025-26. Find out which route saves you more money in 30 seconds.",
  keywords: [
    "creator tax calculator",
    "44AD calculator",
    "44ADA calculator",
    "presumptive tax India",
    "content creator tax India",
    "influencer tax calculator",
    "FY 2025-26 tax",
  ],
  authors: [{ name: "Sparkonomy" }],
  creator: "Sparkonomy",
  publisher: "Sparkonomy",
  alternates: {
    canonical: "https://sparkonomy.com/blogs/tools/creator-tax-calculator",
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
    url: "https://sparkonomy.com/blogs/tools/creator-tax-calculator",
    title: "Creator Tax Calculator — Free Tool by Sparkonomy",
    description:
      "Should you go presumptive (44AD/44ADA) or normal books? Free tool for Indian creators. Enter your numbers, get your answer in 30 seconds.",
    siteName: "Sparkonomy",
    locale: "en_IN",
    images: [
      {
        url: "https://sparkonomy.com/og-tax-calculator.png",
        alt: "Creator Tax Calculator by Sparkonomy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sparkonomy",
    title: "Creator Tax Calculator — Free Tool by Sparkonomy",
    description:
      "44AD vs 44ADA vs Normal Books — compare all 4 tax routes instantly. Free for Indian creators. FY 2025-26.",
    images: ["https://sparkonomy.com/og-tax-calculator.png"],
  },
};

// SCHEMA.ORG (AEO / GEO — AI search engines read this)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Creator Tax Calculator",
      url: "https://sparkonomy.com/blogs/tools/creator-tax-calculator",
      description:
        "Free tax calculator for Indian content creators comparing presumptive taxation (44AD/44ADA) versus normal books for FY 2025-26. Calculates estimated tax liability under all four routes — presumptive new regime, presumptive old regime, normal books new regime, and normal books old regime — and recommends the lowest-tax option.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "en-IN",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      creator: {
        "@type": "Organization",
        name: "Sparkonomy",
        url: "https://sparkonomy.com",
        description:
          "Financial and business guidance platform for Indian content creators and influencers.",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is 44AD presumptive taxation for creators?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Section 44AD of the Income Tax Act lets small business owners (including content creators) declare a fixed percentage of their receipts as profit — 6% of digital receipts and 8% of cash receipts — without maintaining detailed books of accounts. For FY 2025-26, the turnover limit is ₹3 crore (if cash receipts are under 5% of total) or ₹2 crore otherwise.",
          },
        },
        {
          "@type": "Question",
          name: "What is 44ADA and who qualifies?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Section 44ADA is a presumptive tax scheme for specified professionals — including tech consultants, engineers, architects, doctors, lawyers, and film artists. Profit is deemed to be 50% of gross receipts. The gross receipt limit is ₹75 lakh (or ₹1.5 crore if 95%+ receipts are digital) for FY 2025-26.",
          },
        },
        {
          "@type": "Question",
          name: "Should I use presumptive or normal taxation as a creator?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on your actual expenses. If your real work costs are low (under the presumptive profit percentage), normal books will show higher profit and higher tax. If your expenses are high, normal books may give lower taxable profit and lower tax. Use this calculator to compare all four scenarios with your specific numbers.",
          },
        },
        {
          "@type": "Question",
          name: "What are the new tax regime slabs for FY 2025-26?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Under the new tax regime for FY 2025-26 (Budget 2025): income up to ₹4 lakh — nil; ₹4-8 lakh — 5%; ₹8-12 lakh — 10%; ₹12-16 lakh — 15%; ₹16-20 lakh — 20%; ₹20-24 lakh — 25%; above ₹24 lakh — 30%. Income up to ₹12 lakh attracts zero tax after the Section 87A rebate.",
          },
        },
      ],
    },
  ],
};

export default function CreatorTaxCalculatorPage() {
  return (
    <>
      <Script
        id="creator-tax-calculator-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CreatorTaxCalculator />
    </>
  );
}
