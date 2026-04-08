import type { Metadata } from "next";
import CreatorTaxCalculator from "../../creator-tax-calculator/CreatorTaxCalculator";

export const metadata: Metadata = {
  metadataBase: new URL("https://sparkonomy.com"),
  title: "Creator Tax Calculator (Embed) — Sparkonomy",
  description:
    "Embeddable Creator Tax Calculator for Indian content creators. FY 2025-26.",
  alternates: {
    canonical:
      "https://sparkonomy.com/blogs/tools/embed/creator-tax-calculator",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CreatorTaxCalculatorEmbedPage() {
  return <CreatorTaxCalculator />;
}
