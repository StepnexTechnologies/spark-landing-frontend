import type { Metadata } from "next";
import { CategoryBlogTemplate, CATEGORY_CONFIGS } from "@/components/blog/common";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const config = CATEGORY_CONFIGS.company;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Company | Sparkonomy Blog",
  description: "Company news and updates from Sparkonomy",
  alternates: {
    canonical: "https://sparkonomy.com/blogs/company",
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
    url: "https://sparkonomy.com/blogs/company",
    title: "Company | Sparkonomy Blog",
    description: "Company news and updates from Sparkonomy",
    images: [
      {
        url: "/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Company Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Company | Sparkonomy Blog",
    description: "Company news and updates from Sparkonomy",
    images: ["/sparkonomy.png"],
    site: "@sparkonomy",
    creator: "@sparkonomy",
  },
};

export default function CompanyPage() {
  return <CategoryBlogTemplate config={config} />;
}
