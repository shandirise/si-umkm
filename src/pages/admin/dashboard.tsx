// src/pages/admin/dashboard.tsx
import type { GetServerSideProps, NextPage } from 'next';
// useRouter tidak lagi dibutuhkan untuk logout, tapi mungkin berguna untuk hal lain
import { useRouter } from 'next/router';

// Definisikan tipe data untuk produk
type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

// Definisikan tipe untuk props yang diterima oleh halaman ini
type DashboardProps = {
  products: Product[];
  fetchDate: string;
};

const AdminDashboard: NextPage<DashboardProps> = ({ products, fetchDate }) => {
  // Kita bisa tetap menggunakan router untuk fungsionalitas lain jika perlu
  const router = useRouter(); 

  // Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/admin-logout', {
        method: 'POST',
      });

      if (res.ok) {
        // PERUBAHAN DI SINI:
        // Ganti router.push dengan window.location.href untuk memaksa full reload
        // Ini akan membersihkan cache Next.js di client dan memastikan middleware berjalan
        window.location.href = '/login-admin';
      } else {
        alert('Gagal untuk logout.');
      }
    } catch (error) {
      console.error("Gagal memanggil API logout:", error);
      alert('Gagal untuk logout.');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard Admin</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Logout
        </button>
      </header>
      <p>Halaman ini di-render di server pada: {fetchDate}</p>
      <hr />
      <h2>Daftar Produk Terkini</h2>
      {products.length > 0 ? (
        <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Harga</th>
              <th>Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>Rp {product.price.toLocaleString('id-ID')}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tidak ada produk untuk ditampilkan.</p>
      )}
    </div>
  );
};

// getServerSideProps tetap sama
export const getServerSideProps: GetServerSideProps = async (context) => {
    // ... (kode di sini tidak berubah)
    try {
        const res = await fetch('http://localhost:3000/api/produk');
        if (!res.ok) throw new Error('Gagal mengambil data produk');
        
        const products: Product[] = await res.json();

        return {
          props: {
            products,
            fetchDate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          },
        };
    } catch (error) {
        console.error(error);
        return {
          props: {
            products: [],
            fetchDate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          },
        };
    }
};

export default AdminDashboard;