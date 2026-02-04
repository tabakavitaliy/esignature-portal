import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // SSG + CSR only, NO SSR
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
