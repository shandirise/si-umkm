// src/pages/api/auth/admin-login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  // VALIDASI ADMIN: Di aplikasi nyata, ini akan memeriksa database.
  // Untuk contoh ini, kita hardcode.
  if (username === 'admin' && password === 'password123') {

    // Buat token JWT dengan role 'admin' 
    const token = jwt.sign(
      { username: 'admin', role: 'admin' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' } // Token berlaku selama 1 jam
    );

    // Atur token di dalam HttpOnly cookie
    const cookie = serialize('admin_token', token, {
      httpOnly: true,       // Mencegah akses dari JavaScript di client
      secure: process.env.NODE_ENV !== 'development', // Gunakan 'secure' di production (HTTPS)
      sameSite: 'strict',   // Mencegah serangan CSRF
      maxAge: 3600,         // Cookie berlaku selama 1 jam (dalam detik)
      path: '/',            // Cookie berlaku di seluruh situs
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: 'Login admin berhasil' });

  } else {
    return res.status(401).json({ message: 'Username atau password salah' });
  }
}