import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@plotkeys/chat-bot",
    "@plotkeys/section-registry",
    "@plotkeys/ui",
    "@plotkeys/utils",
  ],
};

export default nextConfig;
