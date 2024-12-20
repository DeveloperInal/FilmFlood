import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'film-flood-bucket.s3.ru-1.storage.selcloud.ru'
      },
    ],
  },
};

export default nextConfig;
