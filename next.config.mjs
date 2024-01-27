/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "cloudflare-ipfs.com",
      "avatars.githubusercontent.com",
    ],
  },
};

export default nextConfig;
