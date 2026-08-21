import type {NextConfig} from "next";

const SECURITY_HEADERS = [
    { key: "Vary", value: "Accept" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Unlisted pages — kept out of search results and AI answer engines. Must match
// UNLISTED_PATHS in app/robots.ts. Excluded from the site-wide header rule below
// so their Content-Signal is not emitted twice with conflicting values.
const UNLISTED_PATHS = [
    "/legal/trusted-partner-terms",
    "/legal/trusted-partner-program-guide",
];

// Marketing surface AI models may train on. Must match AI_TRAINING_ALLOWED in
// app/robots.ts and AI_TRAINING_PREFIXES in middleware.ts. Path segments are
// written without the leading slash so they can be reused in the negative
// lookahead that keeps the site-wide rule below mutually exclusive with this
// one — every request must match exactly one Content-Signal rule.
const AI_TRAINING_PREFIXES = ["blogs", "creator/earn", "creator/promo"];

// The homepage is an exact source; a prefix would cover the whole site.
const AI_TRAINING_ALLOWED_SOURCES = [
    "/",
    `/((?:${AI_TRAINING_PREFIXES.join("|")}).*)`,
];

// "$" excludes the homepage, which is handled by the rule above.
const AI_TRAINING_EXCLUDED = [
    "$",
    "api/",
    ...AI_TRAINING_PREFIXES,
    ...UNLISTED_PATHS.map((p) => p.slice(1)),
];

const nextConfig: NextConfig = {
    output: "standalone",
    experimental: {
        // NOTE: experimental.optimizeCss is intentionally NOT set here.
        // In Next 16 it is wired only into the Pages Router post-process
        // pipeline (node_modules/next/dist/server/post-process.js); the App
        // Router (which this entire site uses) never invokes it, so flipping
        // it on with critters/beasties installed is a silent no-op. Verified
        // 2026-05: prerendered HTML in .next/server/app/* contained zero
        // inline <style> blocks regardless of the flag. Re-evaluate when
        // Next ships App-Router support for inline critical CSS.
        optimizePackageImports: [
            "framer-motion",
            "lucide-react",
            "embla-carousel-react",
            "react-phone-number-input",
        ],
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        // Optimized variants were being served with Next's 4h default
        // (`max-age=14400, must-revalidate`), so repeat visitors re-fetched the
        // hero story images and logo within the same day. These sources are
        // versioned by filename in practice, so a 30-day TTL is safe — replace a
        // source image by giving it a new filename to bust the cache.
        minimumCacheTTL: 2592000,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.figma.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'blog.sparkonomy.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.sparkonomy.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'secure.gravatar.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/**',
            },
        ],
    },
    async headers() {
        return [
            ...UNLISTED_PATHS.map((source) => ({
                source,
                headers: [
                    ...SECURITY_HEADERS,
                    { key: "Content-Signal", value: "ai-train=no, ai-search=no" },
                    {
                        key: "X-Robots-Tag",
                        value: "noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai",
                    },
                ],
            })),
            ...AI_TRAINING_ALLOWED_SOURCES.map((source) => ({
                source,
                headers: [
                    ...SECURITY_HEADERS,
                    { key: "Content-Signal", value: "ai-train=yes, ai-search=yes" },
                ],
            })),
            {
                source: `/((?!${AI_TRAINING_EXCLUDED.join("|")}).*)`,
                headers: [
                    ...SECURITY_HEADERS,
                    { key: "Content-Signal", value: "ai-train=no, ai-search=yes" },
                ],
            },
        ];
    },
    async rewrites() {
        return [
            { source: "/blogs/:slug.md", destination: "/api/blog-md/:slug" },
            // Serves the site-level llms.txt dynamically (the static public/ file is gone —
            // public files win over rewrites, so it had to be removed for this to fire).
            { source: "/llms.txt", destination: "/api/llms-txt" },
        ];
    },
};

export default nextConfig;
