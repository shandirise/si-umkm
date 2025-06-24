// src/pages/produk/edit/[id].tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { GetServerSideProps, NextPage } from 'next';
import type { Product } from '@/lib/types';

type EditProdukPageProps = {
  product: Product;
};

const EditProdukPage: NextPage<EditProdukPageProps> = ({ product }) => {
  const router = useRouter();
  
  const [nama, setNama] = useState(product.name);
  const [harga, setHarga] = useState(product.price);
  const [stok, setStok] = useState(product.stock);
  const [deskripsi, setDeskripsi] = useState(product.description);
  const [isLoading, setIsLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', nama);
    formData.append('price', String(harga));
    formData.append('stock', String(stok));
    formData.append('description', deskripsi);
    if (newImageFile) {
      formData.append('newImage', newImageFile);
    }

    try {
      const res = await fetch(`/api/produk/${product.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (res.ok) {
        alert('Produk berhasil diperbarui!');
        router.push('/toko-saya');
      } else {
        alert('Gagal memperbarui produk.');
      }
    } catch (error) {
      console.error('Error saat update:', error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-2xl">
        <Link href="/toko-saya" className="text-blue-500 hover:underline">{'< Kembali ke Toko Saya'}</Link>
        <h1 className="text-3xl font-bold my-6 text-center text-gray-800 dark:text-gray-200">Edit Produk</h1>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          
          {/* BAGIAN FORM YANG HILANG SEBELUMNYA */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Produk</label>
            <input type="text" id="nama" value={nama} onChange={e => setNama(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="harga" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Harga (Rp)</label>
              <input type="number" id="harga" value={harga} onChange={e => setHarga(Number(e.target.value))} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
              <label htmlFor="stok" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Stok</label>
              <input type="number" id="stok" value={stok} onChange={e => setStok(Number(e.target.value))} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
          </div>
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea id="deskripsi" value={deskripsi} onChange={e => setDeskripsi(e.target.value)} required rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
          </div>
          {/* ===================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar Saat Ini</label>
            <img src={product.imageUrl} alt={product.name} className="mt-1 w-32 h-32 object-cover rounded-md border" />
          </div>

          <div>
            <label htmlFor="gambar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ubah Gambar (Opsional)</label>
            <input type="file" id="gambar" name="newImage" onChange={handleImageChange} accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          
          <div>
            <button type="submit" disabled={isLoading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Bagian getServerSideProps tidak berubah
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  try {
    const res = await fetch(`http://localhost:3000/api/produk/${id}`);
    if (!res.ok) { return { notFound: true }; }
    const product = await res.json();
    return { props: { product } };
  } catch (error) {
    return { notFound: true };
  }
};

export default EditProdukPage;