import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "About Sparkonomy | AI Infrastructure for the Creator Economy";
const description =
  "Learn why Sparkonomy is building AI-powered intelligence infrastructure to help creators build sustainable businesses.";
const canonicalUrl = siteUrl("/about");

export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: canonicalUrl},
  openGraph: {title, description, url: canonicalUrl, type: "website"},
};

export default function AboutLayout({children}: {children: ReactNode}) {
  return children;
}
