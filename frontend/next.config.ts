import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    // Watch options
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/.next/**',
      ],
    };

    // Optional: tweak cache to reduce big string warnings
    if (config.cache && config.cache.type === 'filesystem') {
      config.cache.maxMemoryGenerations = 1; // keep fewer in-memory caches
      // config.cache.store = 'pack'; // Next.js already uses pack cache
    }

    return config;
  },
  allowedDevOrigins: [
    "http://192.168.1.98:3000",
    "http://172.20.80.1:3000",
  ],
};

export default withNextIntl(nextConfig);
