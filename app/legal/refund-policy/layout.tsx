import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "Refund and Cancellation Policy | Sparkonomy";
const description =
  "Read Sparkonomy's refund and cancellation policy for paid services.";
const canonicalUrl = siteUrl("/legal/refund-policy");

export const metadata: Metadata = {
  title,
  description,
  alternates: {canonical: canonicalUrl},
  openGraph: {title, description, url: canonicalUrl, type: "website"},
};

export default function RefundPolicyLayout({children}: {children: ReactNode}) {
  return children;
}
