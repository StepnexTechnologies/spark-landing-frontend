import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "Trusted Partner Program Terms & Conditions | Sparkonomy";
const description =
  "Read the terms governing participation in the Sparkonomy Trusted Partner Program, including commissions, content standards, and payment terms.";
const canonicalUrl = siteUrl("/legal/trusted-partner-terms");

export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: canonicalUrl},
  openGraph: {title, description, url: canonicalUrl, type: "website"},
};

export default function TrustedPartnerTermsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
