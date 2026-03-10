// next.config.js, next reads this file first when we run npm start or npm run buiuld 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
  },
  // Output standalone for Docker optimization
  output: 'standalone',
  // Environment variables to expose to the browser
  env: {
    APP_NAME: process.env.APP_NAME,
  },
}

module.exports = nextConfig