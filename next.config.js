const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {}, // Corrected from 'true' to an empty object
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
