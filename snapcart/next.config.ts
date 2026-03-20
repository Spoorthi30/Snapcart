import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns:[
      {hostname : "avatars.githubusercontent.com"},
      {hostname : "plus.unsplash.com"},
      {hostname : "images.unsplash.com"},
      {hostname : "res.cloudinary.com"},
    ],
  }
};

export default nextConfig;
