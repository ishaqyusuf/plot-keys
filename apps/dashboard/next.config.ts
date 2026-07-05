import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["**.app-plotkeys.localhost", "*.plotkeys.localhost"],
  transpilePackages: [
    "@plotkeys/auth",
    "@plotkeys/ui",
    "@plotkeys/utils",
    "@plotkeys/section-registry",
  ],
  serverExternalPackages: ["better-auth"],
};

export default nextConfig;
