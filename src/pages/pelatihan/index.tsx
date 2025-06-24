// src/pages/pelatihan/index.tsx
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { Training } from '@/lib/types';

export default function TrainingsPage() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trainings');
      if (!res.ok) throw new Error("Gagal mengambil data pelatihan");
      const data = await res.json();
      setTrainings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const handleRegister = async (trainingId: string, trainingName: string) => {
    if (!user) {
      alert("Anda harus login untuk mendaftar pelatihan.");
      return;
    }
    
    if (confirm(`Apakah Anda yakin ingin mendaftar pelatihan "${trainingName}"?`)) {
      try {
        const res = await fetch('/api/trainings/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trainingId, userId: user.uid }),
        });

        if (res.ok) {
          alert('Pendaftaran berhasil! Silakan cek email Anda untuk detail lebih lanjut.');
          fetchTrainings(); // Refresh list to update registered count
        } else {
          const errorData = await res.json();
          alert(`Pendaftaran gagal: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Failed to register for training:", error);
        alert('Terjadi kesalahan koneksi saat mendaftar.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Memuat daftar pelatihan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto p-4 md:p-8">
        <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">{'< Kembali ke Beranda'}</Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Pelatihan UMKM Tersedia</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.length > 0 ? (
            trainings.map(training => (
              <div key={training.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
                {training.imageUrl && (
                  <img src={training.imageUrl} alt={training.name} className="w-full h-48 object-cover rounded-md mb-4" />
                )}
                <h2 className="text-xl font-bold mb-2">{training.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Tanggal: {new Date(training.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Lokasi: {training.location}
                </p>
                <p className="text-gray-700 dark:text-gray-300 flex-grow mb-4">{training.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Kapasitas: {training.registeredCount}/{training.capacity}
                  </span>
                  <button 
                    onClick={() => handleRegister(training.id, training.name)}
                    disabled={!user || training.registeredCount >= training.capacity}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {user ? (training.registeredCount >= training.capacity ? 'Penuh' : 'Daftar') : 'Login untuk Daftar'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-xl text-gray-500">Belum ada pelatihan yang tersedia saat ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}