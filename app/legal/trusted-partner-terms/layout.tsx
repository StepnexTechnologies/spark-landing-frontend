import type {Metadata} from "next";
import type {ReactNode} from "react";
import {siteUrl} from "@/lib/urls";

const title = "Trusted Partner Program Terms & Conditions | Sparkonomy";
const description =
  "Terms governing participation in the Sparkonomy Trusted Partner Program. Shared privately with invited partners.";
const url = siteUrl("/legal/trusted-partner-terms");

// Shared directly with invited partners, not discovered. Kept out of search
// engines, AI answer engines, the sitemap and llms.txt — same treatment as the
// Program Guide it links to. See next.config.ts for the matching X-Robots-Tag /
// Content-Signal headers and robots.ts for the crawler rules.
//
// No `alternates.canonical` here on purpose: a canonical asks a crawler to index
// this URL, which contradicts the noindex directly below. OpenGraph stays so the
// link still previews nicely when it is sent to a partner directly.
export const metadata: Metadata = {
  title,
  description,
  openGraph: {title, description, url, type: "website"},
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": 0,
    },
  },
  other: {
    // Honoured by a growing set of AI crawlers/answer engines that ignore the
    // robots meta tag but read these.
    robots: "noai, noimageai",
  },
};

export default function TrustedPartnerTermsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
