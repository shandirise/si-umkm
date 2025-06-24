// Lokasi file: src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Ambil secret key dari environment variable
const secretKey = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Implementasi untuk poin 2: Logging permintaan API 
  if (pathname.startsWith('/api/')) {
    const now = new Date();
    // Format log: [Timestamp] METHOD /path
    console.log(`[${now.toISOString()}] API Request: ${request.method} ${pathname}`);
    // Setelah logging, biarkan request API berjalan seperti biasa
  }

  // Implementasi untuk poin 1: Validasi token JWT saat mengakses halaman admin 
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    // Redirect jika tidak ada token atau secret key tidak di-set
    if (!token || !secretKey) {
      return NextResponse.redirect(new URL('/login-admin', request.url));
    }

    try {
      const secret = new TextEncoder().encode(secretKey);
      // 'await jwtVerify' akan melempar error jika token tidak valid
      await jwtVerify(token, secret);
      
      // Jika verifikasi berhasil, izinkan akses
      return NextResponse.next();

    } catch (err) {
      // Jika token tidak valid (kedaluwarsa, signature salah, dll.),
      // redirect ke halaman login
      console.error('Middleware: Verifikasi JWT Gagal', err);
      return NextResponse.redirect(new URL('/login-admin', request.url));
    }
  }

  // Lanjutkan request lainnya yang tidak cocok dengan kondisi di atas
  return NextResponse.next();
}

// Konfigurasi matcher untuk menjalankan middleware di rute admin DAN api
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};