import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Fotos de productos del marketplace (Pexels).
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      // Portadas subidas desde el panel (van a S3 con la forma
      // `<bucket>.s3.<region>.amazonaws.com/...`).
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
