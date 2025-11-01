import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  allowedDevOrigins: [
    "http://192.168.1.98:3000",
    "http://172.20.80.1:3000",
  ],
};

export default nextConfig;