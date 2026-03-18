import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@plotkeys/auth", "@plotkeys/ui", "@plotkeys/utils"],
  serverExternalPackages: ["better-auth"],
};

export default nextConfig;
