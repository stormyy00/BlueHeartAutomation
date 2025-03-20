/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    loader: "akamai",
    path: "",
    unoptimized: true,
  },
  basePath: "",
  assetPrefix: "",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
