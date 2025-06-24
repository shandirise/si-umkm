// src/pages/login-admin.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert('Login admin berhasil!');
      router.push('/admin/dashboard'); // Arahkan ke dashboard admin
    } else {
      alert('Username atau password salah!');
    }
  };

  return (
    <div>
      <h1>Login Admin</h1>
      <form onSubmit={handleAdminLogin}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}