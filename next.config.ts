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
            {
                source: `/((?!api/|${UNLISTED_PATHS.map((p) => p.slice(1)).join("|")}).*)`,
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
        ];
    },
};

export default nextConfig;
