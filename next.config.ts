import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  ...(isDev ? {} : { output: 'export' }), // SSG + CSR only, NO SSR (skip in dev)
  ...(isDev ? {} : { basePath: '/esignature-portal' }),
  ...(isDev ? {} : { assetPrefix: '/esignature-portal/' }),
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
};

export default nextConfig;
