import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Se cambia temporalmente a true para permitir el despliegue
    // mientras se resuelve la compatibilidad de ESLint 9 con Flat Config
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
