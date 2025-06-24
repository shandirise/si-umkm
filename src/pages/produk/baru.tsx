// src/pages/produk/baru.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function TambahProdukPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => router.push('/login'), 1000);
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Gunakan FormData untuk mengirim file dan teks
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/produk', {
        method: 'POST',
        body: formData, // Kirim sebagai FormData, bukan JSON
      });

      if (res.ok) {
        alert('Produk berhasil ditambahkan!');
        router.push('/');
      } else {
        const errorData = await res.json();
        alert(`Gagal menambahkan produk: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div className="text-center p-10">Mengalihkan ke halaman login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-2xl">
        <Link href="/" className="text-blue-500 hover:underline">{'< Kembali ke Beranda'}</Link>
        <h1 className="text-3xl font-bold my-6 text-center text-gray-800 dark:text-gray-200">Publikasikan Produk Baru</h1>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk</label>
            <input name="nama" type="text" id="nama" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          {/* ... input harga, stok, deskripsi ... beri atribut 'name' */}
          <div>
            <label htmlFor="harga" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga (Rp)</label>
            <input name="harga" type="number" id="harga" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div>
            <label htmlFor="stok" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stok</label>
            <input name="stok" type="number" id="stok" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
           <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea name="deskripsi" id="deskripsi" required rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
          </div>
          <div>
            <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar Produk</label>
            <input name="gambar" type="file" id="gambar" accept="image/png, image/jpeg" required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Simpan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}