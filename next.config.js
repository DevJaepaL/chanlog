const { withContentlayer } = require("next-contentlayer2");
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
};

module.exports = withContentlayer(nextConfig);
