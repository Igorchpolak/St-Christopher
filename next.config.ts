import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  // Panel Keystatic w dev działa na 127.0.0.1 (RedirectToLoopback w Keystatic),
  // a Next 16 blokuje zasoby deweloperskie dla „obcych" originów.
  allowedDevOrigins: ["127.0.0.1"],
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Lokalne placeholdery SVG (wygenerowane przez npm run generate:placeholders).
    // Wybrano dangerouslyAllowSVG + contentSecurityPolicy: SVG pozostaje zoptymalizowany
    // przez next/image (onload/size), ale izolowany sandboxem i bez skryptów.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
