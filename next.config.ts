import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow opening the dev app from your phone via the LAN URL (e.g. http://192.168.1.64:3000).
  allowedDevOrigins: ["192.168.1.64"],
};

export default nextConfig;
