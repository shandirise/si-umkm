// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // === NEW: Webpack configuration for Node.js modules ===
  webpack: (config, { isServer }) => {
    // Konfigurasi ini hanya berlaku untuk build sisi server (API Routes)
    if (isServer) {
      config.externals = config.externals || [];
      // Tambahkan modul inti Node.js yang digunakan oleh formidable dan fs.promises
      // untuk memastikan Webpack tidak mencoba membundelnya.
      config.externals.push(
        'fs',
        'fs/promises', // Penting untuk 'fs/promises'
        'path',
        'crypto',
        'events',
        // Anda bisa menambahkan modul Node.js inti lainnya di sini jika diperlukan
        // Contoh: 'stream', 'buffer', 'util', 'os', 'http', 'https', 'url', etc.
      );
    }
    return config;
  },
  // ====================================================
};

export default nextConfig;