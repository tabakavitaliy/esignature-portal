import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  output: isDev ? undefined : 'export', // SSG + CSR only, NO SSR (skip in dev)
  basePath: isDev ? undefined : '/esignature-portal',
  assetPrefix: isDev ? undefined : '/esignature-portal/',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
