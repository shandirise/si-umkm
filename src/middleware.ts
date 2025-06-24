// Lokasi file: src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Coba ambil token dari cookies
  const token = request.cookies.get('admin_token')?.value;

  // Jika tidak ada token dan pengguna mencoba akses halaman admin,
  // alihkan (redirect) ke halaman login admin.
  if (!token) {
    console.log('Middleware: Token tidak ditemukan, mengalihkan ke /login-admin');
    return NextResponse.redirect(new URL('/login-admin', request.url));
  }

  // Jika token ada, izinkan pengguna melanjutkan.
  // Verifikasi JWT yang sebenarnya bisa ditambahkan di sini nanti untuk keamanan lebih.
  console.log('Middleware: Token ditemukan, akses diizinkan.');
  return NextResponse.next();
}

// Konfigurasi ini memberitahu middleware untuk HANYA berjalan
// pada rute yang diawali dengan /admin (dan semua sub-halamannya).
export const config = {
  matcher: '/admin/:path*',
};