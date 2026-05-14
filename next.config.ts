import type {NextConfig} from "next";

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
            {
                source: "/((?!api/).*)",
                headers: [
                    { key: "Vary", value: "Accept" },
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
