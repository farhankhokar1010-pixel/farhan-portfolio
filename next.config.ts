import type { NextConfig } from "next";

// Safe, site-wide hardening. (A strict Content-Security-Policy is deliberately left out: the inline theme script,
// JSON-LD and the 3D decoder would each need exceptions, and a wrong CSP would silently break the hero.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

// Files in /public keep their names, so cache them for a week (then revalidate in the background) instead of re-checking on every visit.
const assetCache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  experimental: { optimizePackageImports: ["@react-three/drei"] },
  // Every image is already a small WebP in /public: serve it straight from the CDN instead of through the on-demand optimiser
  // (its first request per size is slow, and it asked for 3840px-wide versions on phones).
  images: { unoptimized: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/models/:path*", headers: assetCache },
      { source: "/images/:path*", headers: assetCache },
      { source: "/Muhammad_Farhan_Resume.pdf", headers: assetCache },
    ];
  },
};

export default nextConfig;
