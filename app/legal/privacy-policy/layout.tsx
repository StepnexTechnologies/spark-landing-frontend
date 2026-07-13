import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "Privacy Policy | Sparkonomy";
const description =
  "Learn how Sparkonomy collects, uses, protects, and manages personal information.";
const canonicalUrl = siteUrl("/legal/privacy-policy");

export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: canonicalUrl},
  openGraph: {title, description, url: canonicalUrl, type: "website"},
};

export default function PrivacyPolicyLayout({children}: {children: ReactNode}) {
  return children;
}
