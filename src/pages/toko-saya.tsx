// src/pages/toko-saya.tsx
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';

export default function TokoSayaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      // Menambahkan { cache: 'no-store' } untuk memastikan data selalu baru dan mencegah error 304
      const res = await fetch('/api/produk', { cache: 'no-store' });
      
      if (!res.ok) {
        throw new Error('Gagal mengambil data dari server');
      }

      const allProducts: Product[] = await res.json();
      
      // NOTE: Logika ini masih sementara. Nanti kita akan membuat API
      // yang lebih baik untuk mengambil produk berdasarkan user yang login.
      const userShopId = 'toko-1'; 
      
      const filteredProducts = allProducts.filter(p => p.shopId === userShopId);
      setMyProducts(filteredProducts);

    } catch (error) {
      console.error("Gagal mengambil produk:", error);
      setMyProducts([]); // Set ke array kosong jika gagal
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Jika user sudah terdeteksi, panggil fungsi untuk mengambil produk
    if(user) {
      fetchMyProducts();
    }
    
    // Jika setelah 1.5 detik user masih tidak ada (belum login), arahkan ke halaman login
    const timer = setTimeout(() => {
      if (!user) {
        // Cek lagi sebelum redirect, karena user bisa saja baru terdeteksi
        if (!auth.currentUser) {
           router.push('/login');
        }
      }
    }, 1500);

    return () => clearTimeout(timer); // Cleanup timer
  }, [user, router, fetchMyProducts]);
  
  const handleDelete = async (productId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini? Aksi ini tidak bisa dibatalkan.")) {
      return;
    }

    try {
      const res = await fetch(`/api/produk/${productId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert("Produk berhasil dihapus.");
        // Panggil ulang fetchMyProducts untuk memperbarui daftar produk di UI
        fetchMyProducts();
      } else {
        alert("Gagal menghapus produk.");
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // Tampilkan pesan loading saat data sedang diambil
  if (loading) {
    return <div className="text-center p-10">Memuat data toko Anda...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center py-4">
        <h1 className="text-3xl font-bold">Toko Saya</h1>
        <Link href="/produk/baru" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          + Tambah Produk Baru
        </Link>
      </header>
      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nama Produk</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Stok</th>
              <th className="p-2">Terjual</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {myProducts.map(product => (
              <tr key={product.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="p-2 flex items-center gap-2">
                  <img src={product.imageUrl} alt={product.name} className="w-10 h-10 object-cover rounded-md" />
                  {product.name}
                </td>
                <td className="p-2">Rp {product.price.toLocaleString('id-ID')}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">{product.soldCount}</td>
                <td className="p-2 flex gap-2">
                  <Link href={`/produk/edit/${product.id}`} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded no-underline">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(product.id)} className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myProducts.length === 0 && <p className="text-center p-4">Anda belum memiliki produk.</p>}
      </div>
    </div>
  );
}