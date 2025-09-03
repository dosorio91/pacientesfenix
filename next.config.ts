import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/pacientesfenix',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  typescript: {
    // !! WARN !!
    // Solo en desarrollo, esto hace el build más rápido
    ignoreBuildErrors: true,
  },
  eslint: {
    // Solo en desarrollo, esto hace el build más rápido
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
