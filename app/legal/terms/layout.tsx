import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "Terms of Service | Sparkonomy";
const description =
  "Read the terms governing access to and use of Sparkonomy services.";
const canonicalUrl = siteUrl("/legal/terms");

export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: canonicalUrl},
  openGraph: {title, description, url: canonicalUrl, type: "website"},
};

export default function TermsLayout({children}: {children: ReactNode}) {
  return children;
}
