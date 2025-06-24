// src/pages/login.tsx
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { User as UserType } from '@/lib/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleUserLoginSuccess = async (user: any) => {
    const userEmail = user.email || '';
    const userName = user.displayName || user.email?.split('@')[0] || 'Pengguna';

    try {
      // Check if user exists in db.json, if not, add them
      const checkRes = await fetch(`/api/users?id=${user.uid}`);
      if (!checkRes.ok) { // User not found, create new entry
        const createRes = await fetch('/api/users', {
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
        if (!createRes.ok) {
          console.error('Failed to create user in db.json after login:', await createRes.json());
        }
      }
    } catch (error) {
      console.error('Error syncing user with db.json:', error);
    }
    alert('Login berhasil!');
    router.push('/');
  };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleUserLoginSuccess(userCredential.user);
    } catch (error: any) {
      alert(`Email atau password salah.`);
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const userCredential = await signInWithPopup(auth, provider);
        await handleUserLoginSuccess(userCredential.user);
    } catch (error: any) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Login Akun UMKM</h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="my-6 text-center text-gray-600 dark:text-gray-400">
          <p>Atau</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.24 10.23c-.23-.84-.52-1.85-.52-2.82 0-2.87 2.05-5.18 4.88-5.18 2.37 0 3.73.97 4.54 1.77l-1.97 1.95c-.56-.54-1.4-.95-2.57-.95-1.95 0-3.35 1.5-3.35 3.54 0 2.22 1.63 3.63 3.39 3.63.93 0 1.63-.35 2.15-.8l-.07-.07c-.4-.4-1.04-.6-1.57-.6-1.28 0-2.22.84-2.22 1.9 0 1.12.94 1.83 2.05 1.83.69 0 1.25-.26 1.7-.63l.07.07c.4.4.6.93.6 1.48 0 .54-.25 1.05-.63 1.43-.37.38-.88.63-1.43.63-1.08 0-2.1-.55-2.67-1.12l-1.78 1.77c.84.85 2.05 1.35 3.35 1.35 2.65 0 4.8-1.77 4.8-4.9 0-.9-.16-1.7-.44-2.45h-9.35zM0 12l.14-.11C1.86 10.45 2.5 9.17 2.5 7.55 2.5 4.3 0 2.1 0 2.1V0c2.1.28 4.38.97 5.75 2.45 1.7 1.84 2.6 4.3 2.6 6.84 0 2.54-.9 5-2.6 6.84-1.37 1.48-3.65 2.17-5.75 2.45V18c2.5-.28 5.1-.97 6.47-2.45 1.6-1.63 2.5-3.7 2.5-5.8V9.12H0z"/>
          </svg>
          Masuk dengan Google
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}