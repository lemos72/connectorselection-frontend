/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export -> produces plain HTML/CSS/JS in the `out/` folder,
  // which you upload to S3 + CloudFront. No Node server needed at runtime.
  output: 'export',

  // Static export can't use the Next.js Image Optimization server,
  // so we serve images as-is (unoptimized). Strapi already generates
  // multiple sizes, so we pick an appropriate size ourselves.
  images: {
    unoptimized: true,
  },

  // Adds a trailing slash to every route (e.g. /articles/ instead of /articles).
  // This makes S3 + CloudFront static hosting resolve folder-style URLs cleanly.
  trailingSlash: true,
};

export default nextConfig;
