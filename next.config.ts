

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  trailingSlash: false,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
};

module.exports = nextConfig;
