// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => { // Pastikan 'webpack' di-destructuring
    if (isServer) {
      // 1. Externalisasi modul bawaan Node.js secara komprehensif.
      // Pola ini menggabungkan dengan eksternal default Next.js
      config.externals = [
        ...config.externals, // Pertahankan eksternal default Next.js
        ({ request }, callback) => {
          // Daftar lengkap modul bawaan Node.js dan versi dengan prefiks 'node:'
          const nodeBuiltIns = [
            'assert', 'async_hooks', 'buffer', 'child_process', 'cluster', 'console', 'constants', 'crypto',
            'dgram', 'dns', 'domain', 'events', 'fs', 'fs/promises', 'http', 'http2', 'https', 'inspector', 'module',
            'net', 'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring', 'readline', 'repl', 'stream',
            'string_decoder', 'timers', 'tls', 'trace_events', 'tty', 'url', 'util', 'v8', 'vm', 'worker_threads',
            'zlib',
            // Sertakan juga versi 'node:' secara eksplisit untuk keandalan maksimal
            'node:assert', 'node:async_hooks', 'node:buffer', 'node:child_process', 'node:cluster', 'node:console',
            'node:constants', 'node:crypto', 'node:dgram', 'node:dns', 'node:domain', 'node:events', 'node:fs',
            'node:fs/promises', 'node:http', 'node:http2', 'node:https', 'node:inspector', 'node:module', 'node:net',
            'node:os', 'node:path', 'node:perf_hooks', 'node:process', 'node:punycode', 'node:querystring', 'node:readline',
            'node:repl', 'node:stream', 'node:string_decoder', 'node:timers', 'node:tls', 'node:trace_events', 'node:tty',
            'node:url', 'node:util', 'node:v8', 'node:vm', 'node:worker_threads', 'node:zlib'
          ];

          if (nodeBuiltIns.includes(request)) {
            return callback(null, `commonjs ${request}`); // Eksternalisasi modul ini
          }
          callback(); // Lanjutkan ke eksternalisasi berikutnya atau default Webpack
        },
      ];

      // 2. Gunakan NormalModuleReplacementPlugin untuk menangani skema 'node:'
      // Ini adalah kunci untuk memperbaiki 'UnhandledSchemeError' pada impor 'node:'.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:(.+)$/, // Cocokkan apapun yang dimulai dengan "node:"
          (resource: { request: string }) => {
            resource.request = resource.request.replace(/^node:/, ''); // Ubah 'node:fs' menjadi 'fs'
          }
        )
      );
      
      // 3. Alias untuk Node.js built-ins (opsional, untuk ketahanan tambahan)
      // Ini memberikan lapisan petunjuk resolusi tambahan.
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