// src/pages/login.tsx
import { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  // Semua hook (useState, useRouter) dipanggil di dalam komponen
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login berhasil!');
      router.push('/');
    } catch (error: any) {
      alert(`Email atau password salah.`);
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        alert('Login dengan Google berhasil!');
        router.push('/');
    } catch (error: any) {
        alert(`Error: ${error.message}`);
        console.error(error);
    }
  };

  return (
    <div>
      <h1>Login Akun UMKM</h1>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <br />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <br /><br />
        <button type="submit">Login</button>
      </form>
      <hr />
      <p>Atau</p>
      <button onClick={handleGoogleLogin}>Masuk dengan Google</button>
      <br /><br />
      <Link href="/register">Belum punya akun? Daftar di sini</Link>
    </div>
  );
}