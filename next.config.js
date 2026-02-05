const { withContentlayer } = require("next-contentlayer2");
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = withContentlayer(nextConfig);
