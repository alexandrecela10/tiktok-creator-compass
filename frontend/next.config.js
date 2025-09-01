/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  // Enable static export for deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  // Skip build-time API routes for static export
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
