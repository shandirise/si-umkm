// src/pages/register.tsx
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase'; // Impor dari file inisialisasi
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Pendaftaran berhasil!');
      router.push('/'); // Arahkan ke halaman utama setelah berhasil
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Daftar Akun UMKM</h1>
      <form onSubmit={handleRegister}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Daftar</button>
      </form>
    </div>
  );
}