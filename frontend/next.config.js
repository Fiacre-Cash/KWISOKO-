/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'via.placeholder.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'source.unsplash.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
};

module.exports = nextConfig;
