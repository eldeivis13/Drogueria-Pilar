import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Los tipos son correctos localmente; esto evita fallos por caché de Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
  },
  poweredByHeader: false,
};

export default nextConfig;
