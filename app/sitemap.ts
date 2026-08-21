import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/urls";
import { SITE_ROUTES } from "@/lib/site-routes";

// Root sitemap for non-blog marketing routes. The route list lives in lib/site-routes.ts,
// shared with the /llms.txt handler so the two can never disagree about what the site is.
export default function sitemap(): MetadataRoute.Sitemap {
    return SITE_ROUTES.map(({ path, lastModified, priority, changeFrequency }) => ({
        url: siteUrl(path),
        lastModified,
        changeFrequency,
        priority,
    }));
}
