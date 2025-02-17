// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // Remove optimizeCss experiment
  experimental: {
    // optimizeCss: true, // Remove this line
  },
  output: 'export', // Add this for static export
  // Disable server components for pages using framer-motion
  webpack: (config, { isServer }) => {
    // Add a rule to handle framer-motion
    config.module.rules.push({
      test: /framer-motion/,
      sideEffects: false
    });
    return config;
  }
};

export default nextConfig;