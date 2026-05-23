import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  /* cache invalidation trigger: 1 */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
    ],
    qualities: [75],
  },
};

export default nextConfig;

