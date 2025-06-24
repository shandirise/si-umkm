import Link from 'next/link';
import ProductSearch from '@/components/ProductSearch';
import { useAuth } from '@/hooks/useAuth'; // Hook kustom untuk status autentikasi
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

// Objek style untuk menata tampilan halaman, termasuk perbaikan untuk tombol
const styles = {
  container: { padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' },
  nav: { display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' },
  main: { borderTop: '1px solid #eee', paddingTop: '2rem' },
  welcome: { marginBottom: '2rem' },
  button: {
    cursor: 'pointer',
    padding: '8px 12px',
    border: '1px solid #ccc',
    background: '#f0f0f0',
    borderRadius: '4px',
    color: '#333', // Warna teks gelap agar terlihat di background terang
    textDecoration: 'none', // Menghilangkan garis bawah dari tag Link
  },
};

export default function Home() {
  // Mengambil status login pengguna secara real-time menggunakan hook
  const { user } = useAuth();
  const router = useRouter();

  // Fungsi untuk menangani proses logout pengguna
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Anda berhasil logout!');
      router.push('/'); // Kembali ke halaman utama setelah logout
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  return (
    <div style={styles.container}>
      <header>
        <nav style={styles.nav}>
          {/* Tampilan kondisional: tergantung apakah pengguna sudah login atau belum */}
          {user ? (
            <>
              <span>Halo, {user.email}</span>
              <button onClick={handleLogout} style={styles.button}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" style={styles.button}>Login</Link>
              <Link href="/register" style={styles.button}>Register</Link>
            </>
          )}

          {/* Link ke halaman login admin selalu tersedia */}
          <div style={{ marginLeft: 'auto' }}>
             <Link href="/login-admin" style={{color: '#888', fontSize: '0.9rem'}}>Admin</Link>
          </div>
        </nav>
      </header>
      
      <main style={styles.main}>
        <div style={styles.welcome}>
            <h1>Selamat Datang di Si-UMKM</h1>
            <p>Platform untuk memajukan UMKM lokal.</p>
        </div>

        {/* Komponen pencarian produk dengan GraphQL hanya ditampilkan jika pengguna sudah login */}
        {user && <ProductSearch />}
      </main>
    </div>
  );
}