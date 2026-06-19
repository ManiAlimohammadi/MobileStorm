import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "staticcontent.eways.co",
        pathname: "/upload/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
