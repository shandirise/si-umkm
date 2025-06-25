// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add alias to handle 'node:' prefixed imports by mapping them to their non-prefixed versions.
    // This helps Webpack resolve the 'node:' scheme for both server and client contexts.
    config.resolve.alias = {
      ...(config.resolve.alias || {}), // Preserve existing aliases
      'node:fs': 'fs',
      'node:fs/promises': 'fs/promises',
      'node:crypto': 'crypto',
      'node:events': 'events',
      'node:path': 'path',
      'node:stream': 'stream',
      'node:buffer': 'buffer',
      'node:util': 'util',
      'node:os': 'os',
      'node:http': 'http',
      'node:https': 'https',
      'node:url': 'url',
    };

    if (isServer) {
      // Ensure that Node.js built-in modules are always externalized for server builds
      config.externals = [
        ...config.externals, // Keep any existing externals
        (request: string, callback: (err?: Error | null, result?: string) => void) => {
          const nodeBuiltIns = ['fs', 'fs/promises', 'path', 'crypto', 'events', 'stream', 'buffer', 'util', 'os', 'http', 'https', 'url'];
          
          if (nodeBuiltIns.some(mod => request === mod || request === `node:${mod}`)) {
            // Treat these modules as external CommonJS modules for the server
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];
    }
    return config;
  },
};

export default nextConfig;