/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@prestili/shared', '@prestili/database', '@prestili/canvas', '@prestili/ai'],
  experimental: {
    optimizePackageImports: ['@prestili/shared'],
  },
};

module.exports = nextConfig;
