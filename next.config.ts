import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "cdn2.thecatapi.com",
        protocol: "https",
        search: "",
        port: "",
      },
      {
        hostname: "28.media.tumblr.com",
        protocol: "https",
        search: "",
        port: "",
      },
    ],
  },
};

export default nextConfig;
