// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },

  // Output standalone for Docker optimization
  output: "standalone",

  // Environment variables exposed to browser
  env: {
    APP_NAME: process.env.APP_NAME,
  },
};

export default nextConfig;