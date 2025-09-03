import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/pacientesfenix',
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
