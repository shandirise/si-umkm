// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.externals = [
        // Pertahankan eksternal yang sudah ada
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        // Beri tipe eksplisit untuk 'request'
        ({ request }: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
          const nodeBuiltIns = ['fs', 'fs/promises', 'path', 'crypto', 'events', 'stream', 'buffer', 'util', 'os', 'http', 'https', 'url'];
          
          if (
            request &&
            nodeBuiltIns.some(mod => request === mod || request.startsWith(`node:${mod}`))
          ) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
      ];

      config.plugins.push(
        // Beri tipe eksplisit untuk 'resource'
        new webpack.NormalModuleReplacementPlugin(
          /^node:(.*)/,
          (resource: { request: string }) => { // 'resource' adalah objek dengan properti 'request'
            resource.request = resource.request.replace(/^node:/, '');
          }
        )
      );

      // Bagian alias yang sudah ada (jangan dihapus)
      config.resolve.alias = {
        ...(config.resolve.alias || {}), // Pertahankan alias yang sudah ada
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