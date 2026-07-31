import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The MongoDB driver must stay external (not bundled) so its optional
  // native deps don't crash the server at runtime.
  serverExternalPackages: ["mongodb"],
  // Pin the workspace root so Next doesn't infer it from a parent lockfile.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
