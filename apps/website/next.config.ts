import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.plotkeys.localhost"],
  transpilePackages: ["@plotkeys/ui", "@plotkeys/utils"],
};

export default nextConfig;
