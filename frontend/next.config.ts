import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },

  allowedDevOrigins: [
    "http://192.168.1.98:3000",
    "http://172.20.80.1:3000",
  ],
};

export default nextConfig;