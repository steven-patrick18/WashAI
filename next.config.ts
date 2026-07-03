import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Anthropic SDK runs only in server routes; keep it out of the client bundle.
  serverExternalPackages: ["@anthropic-ai/sdk"],
};

export default nextConfig;
