const { withContentlayer } = require("next-contentlayer2");
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return [
      {
        source: "/posts",
        destination: "/",
        permanent: true,
      },
      {
        source: "/pipeline",
        destination: "/portfolio#document-preprocessor",
        permanent: true,
      },
    ];
  },
};

module.exports = withContentlayer(nextConfig);
