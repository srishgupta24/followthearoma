/**
 * ESM Next.js config equivalent to next.config.ts
 * Next.js does not load `next.config.ts` directly — use .js or .mjs
 */

const nextConfig = {
  images: {
    // Allow Next.js to optimise images from Sanity's CDN
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  reactStrictMode: true,
}

export default nextConfig
