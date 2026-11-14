import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
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
