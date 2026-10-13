import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.43.22"],
  images: {
    unoptimized: true,
    remotePatterns: [
      // Cloudinary
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },

      // Pexels
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },

      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // istock

      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
    ],
  },
};

export default nextConfig;
