import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@plotkeys/section-registry",
    "@plotkeys/ui",
    "@plotkeys/utils",
  ],
};

export default nextConfig;
