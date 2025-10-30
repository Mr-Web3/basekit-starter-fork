import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok origins in development
  allowedDevOrigins: ["dbro.ngrok.dev", "localhost:3000", "localhost:3001"],

  // Silence warnings
  // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tba-mobile.mypinata.cloud",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.mypinata.cloud",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
