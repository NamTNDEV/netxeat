import createNextIntlPlugin from 'next-intl/plugin';
import NextBundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-bigboy.duthanhduoc.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },
};

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});
export default withBundleAnalyzer(withNextIntl(nextConfig));
