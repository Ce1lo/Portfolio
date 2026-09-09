import type { NextConfig } from "next";

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // 'unsafe-inline' for script/style is required by Next.js hydration data and by
  // Tailwind's runtime style injection. This is a baseline policy, not a hardened one.
  "img-src 'self' data: blob: https://picsum.photos https://fastly.picsum.photos",
  "font-src 'self'",
  "connect-src 'self' https: wss:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // The portfolio images are pre-optimised to AVIF + WebP at sync time by
  // scripts/sync-drive.mjs, with real pixel dimensions recorded in the manifest.
  // next/image would re-encode already-compressed assets at request time and burn
  // Vercel function CPU for no gain, so the gallery uses plain <img> inside <picture>.
  // If you later serve images from an external bucket, remove this comment block and
  // configure images.remotePatterns instead.

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
      {
        // Generated assets are content-hashed by the sync script, so they are immutable.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
