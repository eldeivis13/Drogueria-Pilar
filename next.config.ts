import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Imágenes subidas por el admin (ej: CDN propio, Cloudinary, S3, etc.)
      // Añade aquí los dominios que uses en producción:
      // { protocol: "https", hostname: "res.cloudinary.com" },
      // { protocol: "https", hostname: "**.amazonaws.com" },
    ],
  },
  // Elimina cabeceras x-powered-by
  poweredByHeader: false,
};

export default nextConfig;
