import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/Resume",
        destination: "/resume.pdf",
      },
      {
        source: "/resume",
        destination: "/resume.pdf",
      },
      ...(process.env.NODE_ENV === "development"
        ? [
            {
              source: "/api/:path*",
              destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/:path*`,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
