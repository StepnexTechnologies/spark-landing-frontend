import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        unoptimized: true,
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
