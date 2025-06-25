// src/pages/register.tsx
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Tambahkan Link untuk navigasi kembali

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userEmail = user.email || '';
      const userName = user.displayName || user.email?.split('@')[0] || 'Pengguna Baru';

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.uid,
          email: userEmail,
          name: userName,
          role: 'pembeli',
          shopId: null,
        }),
      });

      if (!res.ok) {
        console.error('Failed to save user to db.json:', await res.json());
        alert('Pendaftaran berhasil, tetapi terjadi masalah saat menyimpan profil.');
      } else {
        alert('Pendaftaran berhasil!');
      }

      router.push('/');
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Daftar Akun UMKM</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Daftar
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}