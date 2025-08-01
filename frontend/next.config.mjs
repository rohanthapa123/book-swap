/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Optional: Only needed if using static export or want to disable Image Optimization
    domains: ["localhost", "127.0.0.1", "wsl.rohanthapa.com.np"], // Add all dev/prod domains
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000", // your backend port
        pathname: "/api/uploads/**",
      },
      {
        protocol: "https",
        hostname: "wsl.rohanthapa.com.np",
        pathname: "/api/uploads/**",
      },
    ],
  },
};

export default nextConfig;
