import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/urls";

// Root sitemap for the marketing site. Generated dynamically so `lastModified`
// is never stale (the old static public/sitemap.xml was frozen at 2025-08-18).
// Blog posts, category pages, the authors hub, and author profiles all live in
// app/blogs/sitemap.ts — this file owns only the non-blog marketing routes so
// the two sitemaps never overlap. Both are advertised in app/robots.ts.
type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: [string, number, ChangeFreq][] = [
    ["/", 1.0, "weekly"],
    ["/about", 0.8, "monthly"],
    ["/contact", 0.7, "monthly"],
    ["/creator/promo", 0.9, "weekly"],
    ["/legal/terms", 0.5, "yearly"],
    ["/legal/privacy-policy", 0.5, "yearly"],
    ["/legal/refund-policy", 0.5, "yearly"],
    ["/thank-you", 0.3, "monthly"],
  ];

  return routes.map(([path, priority, changeFrequency]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
