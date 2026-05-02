import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        // Inlines critical above-the-fold CSS (via Critters/Beasties at build
        // time) and defers the rest, removing the render-blocking CSS chain
        // flagged by Lighthouse (~1.25s LCP/FCP saving on slow 4G mobile).
        // Build-time only — no runtime/UI impact. If `next build` complains
        // about a missing peer, install it: `yarn add -D critters` (older
        // Next) or `yarn add -D beasties` (newer Next).
        optimizeCss: true,
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
};

export default nextConfig;
