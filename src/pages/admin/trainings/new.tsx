// src/pages/admin/trainings/new.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AddTrainingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // Add dummy image if no image is selected, to avoid API error for now.
    // In a real app, you'd handle this more gracefully (e.g., allow no image, or provide default).
    if (!formData.get('imageUrl')?.name) {
      // Simulate adding a dummy file if no image is uploaded
      // This part might need adjustment if your backend strictly requires a file
      // For simplicity, let's just make imageUrl optional in the backend type
      // And frontend doesn't need to append if not chosen.
    }


    try {
      const res = await fetch('/api/trainings', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Pelatihan berhasil ditambahkan!');
        router.push('/admin/dashboard'); // Redirect back to admin dashboard
      } else {
        const errorData = await res.json();
        alert(`Gagal menambahkan pelatihan: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to add training:', error);
      alert('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4 max-w-2xl">
        <Link href="/admin/dashboard" className="text-blue-500 hover:underline">{'< Kembali ke Dashboard Admin'}</Link>
        <h1 className="text-3xl font-bold my-6 text-center text-gray-800 dark:text-gray-200">Tambah Pelatihan Baru</h1>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Pelatihan</label>
            <input name="name" type="text" id="name" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea name="description" id="description" required rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal</label>
              <input name="date" type="date" id="date" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lokasi</label>
              <input name="location" type="text" id="location" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kapasitas Peserta</label>
            <input name="capacity" type="number" id="capacity" required min="1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"/>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gambar Pelatihan (Opsional)</label>
            <input name="imageUrl" type="file" id="imageUrl" accept="image/png, image/jpeg" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
          <div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-400 transition-colors">
              {isLoading ? 'Menyimpan...' : 'Simpan Pelatihan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}