import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@plotkeys/ui", "@plotkeys/utils"],
};

export default nextConfig;
