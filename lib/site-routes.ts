// The one list of non-blog marketing routes. app/sitemap.ts and the /llms.txt handler both
// render from it, so a page added in one place cannot silently go missing from the other.
//
// Dates reflect the latest meaningful content or metadata update instead of changing on
// every build. Unlisted routes (the Trusted Partner Program terms and guide) are
// deliberately absent — they are noindex and shared directly with invited partners; keep
// this in sync with UNLISTED_PATHS in app/robots.ts.

import { MetadataRoute } from "next";

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

export interface SiteRoute {
    path: string;
    lastModified: string;
    priority: number;
    changeFrequency: ChangeFreq;
    // Present only for routes the llms.txt "Key Pages" section should describe to AI
    // readers. Legal pages stay in the sitemap but carry no llms entry.
    llms?: { title: string; description: string };
}

export const SITE_ROUTES: SiteRoute[] = [
    {
        path: "/",
        lastModified: "2026-06-10",
        priority: 1.0,
        changeFrequency: "weekly",
        llms: {
            title: "Home & Waitlist",
            description:
                "Join the movement. Our main site where creators, influencers, YouTubers, Instagrammers and brands sign up for early access to our AI-powered intelligence infrastructure.",
        },
    },
    {
        path: "/about",
        lastModified: "2026-06-11",
        priority: 0.8,
        changeFrequency: "monthly",
        llms: {
            title: "About",
            description:
                "Details on our vision to unlock economic success for 250M+ creators and influencers globally using our proprietary Creator Genome & AI Agent technology.",
        },
    },
    {
        path: "/contact",
        lastModified: "2026-06-11",
        priority: 0.7,
        changeFrequency: "monthly",
        llms: {
            title: "Contact",
            description:
                "Reach our founding team which has experts who are ex-Google, Meta, YouTube and Paypal.",
        },
    },
    {
        path: "/creator/earn",
        lastModified: "2026-06-10",
        priority: 0.9,
        changeFrequency: "weekly",
        llms: {
            title: "Creator Earn",
            description:
                "AI-powered invoicing and payment tracking for creators, influencers, YouTubers and Instagrammers. Get paid faster with GST-compliant invoicing, no messy spreadsheets.",
        },
    },
    {
        path: "/creator/earn/faqs",
        lastModified: "2026-06-11",
        priority: 0.8,
        changeFrequency: "monthly",
        llms: {
            title: "Creator Earn FAQs",
            description:
                "Answers to common questions about AI invoicing, payments and getting started with Creator Earn.",
        },
    },
    {
        path: "/creator/promo",
        lastModified: "2026-06-10",
        priority: 0.9,
        changeFrequency: "weekly",
        llms: {
            title: "Creator Promo",
            description:
                "Promotional tools for creators and influencers to grow their business with Sparkonomy.",
        },
    },
    { path: "/legal/terms", lastModified: "2026-06-11", priority: 0.5, changeFrequency: "yearly" },
    {
        path: "/legal/privacy-policy",
        lastModified: "2026-06-11",
        priority: 0.5,
        changeFrequency: "yearly",
    },
    {
        path: "/legal/refund-policy",
        lastModified: "2026-06-11",
        priority: 0.5,
        changeFrequency: "yearly",
    },
];
