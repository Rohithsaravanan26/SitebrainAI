/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sitebrain/ui', '@sitebrain/types'],
  output: 'standalone',
};

export default nextConfig;
