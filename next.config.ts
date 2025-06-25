// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Pastikan modul bawaan Node.js dieksternalisasi saat build sisi server
      // Fungsi eksternal kustom ini akan mencocokkan modul seperti 'fs', 'fs/promises', dll.
      // dan juga versi dengan prefiks 'node:' (misalnya, 'node:fs', 'node:crypto')
      config.externals = [
        ...(config.externals || []), // Pertahankan eksternal yang sudah ada
        (request: string, callback: (err?: Error | null, result?: string) => void) => {
          const nodeBuiltIns = ['fs', 'fs/promises', 'path', 'crypto', 'events', 'stream', 'buffer', 'util', 'os', 'http', 'https', 'url'];
          
          if (nodeBuiltIns.some(mod => request === mod || request === `node:${mod}`)) {
            // Perlakukan modul ini sebagai modul CommonJS eksternal
            return callback(null, `commonjs ${request}`);
          }
          // Lanjutkan dengan eksternalisasi default untuk modul lain
          callback();
        },
      ];

      // Tambahkan alias untuk menangani impor dengan prefiks 'node:'
      // dengan memetakan mereka ke versi non-prefiksnya.
      // Ini membantu Webpack menyelesaikan skema 'node:' sebelum eksternalisasi.
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