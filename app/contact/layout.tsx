import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "Contact Sparkonomy";
const description =
  "Contact Sparkonomy for creator economy partnerships, general inquiries, and support.";
const canonicalUrl = siteUrl("/contact");

export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: canonicalUrl},
  openGraph: {title, description, url: canonicalUrl, type: "website"},
};

export default function ContactLayout({children}: {children: ReactNode}) {
  return children;
}
