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
        (request: string, callback: (err?: Error | null, result?: string) => void) => {
          const nodeBuiltIns = ['fs', 'fs/promises', 'path', 'crypto', 'events', 'stream', 'buffer', 'util', 'os', 'http', 'https', 'url'];
          
          if (nodeBuiltIns.some(mod => request === mod || request === `node:${mod}`)) {
            // Treat these modules as external CommonJS modules
            return callback(null, `commonjs ${request}`);
          }
          // Continue with default externalization for other modules
          callback();
        },
      ];

      // Add alias to handle 'node:' prefixed imports by mapping them to their non-prefixed versions.
      // This helps Webpack resolve the 'node:' scheme before externalization.
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
    }
    return config;
  },
};

export default nextConfig;