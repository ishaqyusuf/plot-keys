import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["**.sandbox-plotkeys.localhost", "*.plotkeys.localhost"],
  serverExternalPackages: ["better-auth"],
  transpilePackages: [
    "@plotkeys/api",
    "@plotkeys/auth",
    "@plotkeys/section-registry",
    "@plotkeys/ui",
    "@plotkeys/utils",
    "@plotkeys/website-builder",
  ],
};

export default nextConfig;
