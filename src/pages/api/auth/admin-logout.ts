// src/pages/api/auth/admin-logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Pastikan hanya method POST yang diizinkan untuk keamanan
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Menghapus cookie dengan cara mengaturnya kembali
  // dengan 'maxAge' bernilai negatif.
  const cookie = serialize('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, // Langsung kadaluarsa
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  res.status(200).json({ message: 'Logout berhasil' });
}