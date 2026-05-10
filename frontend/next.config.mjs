/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/energy-market',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: false,
};

export default nextConfig;
