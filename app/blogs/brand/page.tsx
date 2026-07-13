import type { Metadata } from "next";
import { CategoryBlogTemplate, CATEGORY_CONFIGS, parseBlogPage, withPagedListingMetadata } from "@/components/blog/common";

export const revalidate = 300;

const config = CATEGORY_CONFIGS.brand;

interface CategoryPageProps {
  searchParams: Promise<{ page?: string }>;
}

const baseMetadata: Metadata = {
  metadataBase: new URL("https://www.sparkonomy.com/"),
  title: "Brand | Sparkonomy Blog",
  description: "Insights and updates for brands on Sparkonomy",
  alternates: {
    canonical: "https://www.sparkonomy.com/blogs/brand",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    siteName: "Sparkonomy",
    url: "https://www.sparkonomy.com/blogs/brand",
    title: "Brand | Sparkonomy Blog",
    description: "Insights and updates for brands on Sparkonomy",
    images: [
      {
        url: "/sparkonomy.png",
        width: 1200,
        height: 630,
        alt: "Sparkonomy Brand Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand | Sparkonomy Blog",
    description: "Insights and updates for brands on Sparkonomy",
    images: ["/sparkonomy.png"],
    site: "@sparkonomy",
    creator: "@sparkonomy",
  },
};

export async function generateMetadata({ searchParams }: CategoryPageProps): Promise<Metadata> {
  const page = parseBlogPage((await searchParams).page);
  return withPagedListingMetadata(baseMetadata, "https://www.sparkonomy.com/blogs/brand", page);
}

export default async function BrandPage({ searchParams }: CategoryPageProps) {
  const page = parseBlogPage((await searchParams).page);
  return <CategoryBlogTemplate config={config} currentPage={page} />;
}
