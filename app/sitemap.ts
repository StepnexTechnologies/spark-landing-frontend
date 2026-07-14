import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/urls";

// Root sitemap for non-blog marketing routes. Dates reflect the latest
// meaningful content or metadata update instead of changing on every build.
//
// Unlisted routes (the Trusted Partner Program terms and guide) are deliberately
// absent — they are noindex and shared directly with invited partners, so listing
// them here would advertise the URLs to exactly the crawlers they exclude. Keep
// this list in sync with UNLISTED_PATHS in app/robots.ts.
type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: [string, string, number, ChangeFreq][] = [
    ["/", "2026-06-10", 1.0, "weekly"],
    ["/about", "2026-06-11", 0.8, "monthly"],
    ["/contact", "2026-06-11", 0.7, "monthly"],
    ["/creator/earn", "2026-06-10", 0.9, "weekly"],
    ["/creator/earn/faqs", "2026-06-11", 0.8, "monthly"],
    ["/creator/promo", "2026-06-10", 0.9, "weekly"],
    ["/legal/terms", "2026-06-11", 0.5, "yearly"],
    ["/legal/privacy-policy", "2026-06-11", 0.5, "yearly"],
    ["/legal/refund-policy", "2026-06-11", 0.5, "yearly"],
  ];

  return routes.map(([path, lastModified, priority, changeFrequency]) => ({
    url: siteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
