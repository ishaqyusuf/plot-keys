import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@plotkeys/auth", "@plotkeys/ui", "@plotkeys/utils"],
};

export default nextConfig;
