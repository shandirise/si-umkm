// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure that Node.js built-in modules are always externalized
      // This custom external function will match modules like 'fs', 'fs/promises', 'path', 'crypto', 'events'
      // and also their 'node:' prefixed versions (e.g., 'node:fs', 'node:crypto')
      config.externals = [
        ...config.externals, // Keep any existing externals
        ({ request }, callback) => {
          // List of Node.js built-in modules commonly used in API routes
          const nodeBuiltIns = ['fs', 'fs/promises', 'path', 'crypto', 'events', 'stream', 'buffer', 'util', 'os', 'http', 'https', 'url'];
          
          if (
            nodeBuiltIns.some(mod => request === mod || request === `node:${mod}`)
          ) {
            // Treat these modules as external CommonJS modules
            return callback(null, `commonjs ${request}`);
          }
          // Continue with default externalization for other modules
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;