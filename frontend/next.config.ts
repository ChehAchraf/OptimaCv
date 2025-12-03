import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  webpack: (config) => {
    config.watchOptions = {
      poll: 500,
      aggregateTimeout: 100,
    };
    return config;
  },

  allowedDevOrigins: [
    "http://192.168.1.98:3000",
    "http://172.20.80.1:3000",
  ],
};

export default withNextIntl(nextConfig);