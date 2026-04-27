import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
        optimizePackageImports: [
            "framer-motion",
            "lucide-react",
            "embla-carousel-react",
            "react-phone-number-input",
        ],
        // Inlines critical CSS and defers the rest via `critters`. /creator/earn
        // was losing ~344ms of mobile FCP/LCP to a render-blocking 15.5KB CSS
        // chunk that was 90%+ unused on first paint.
        optimizeCss: true,
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
