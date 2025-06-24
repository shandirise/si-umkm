// src/pages/ulasan/tambah/[productId].tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; // 'Link' tidak digunakan di sini jika tidak ada navigasi eksplisit.tsx]
import type { GetServerSideProps, NextPage } from 'next';
import type { Product } from '@/lib/types'; //
import { useAuth } from '@/hooks/useAuth';

type BeriUlasanProps = {
  product: Product;
  orderId: string;
};

// Komponen untuk Bintang Interaktif
const StarRatingInput = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((starIndex) => (
        <svg
          key={starIndex}
          className={`w-10 h-10 cursor-pointer ${starIndex <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => setRating(starIndex)}
          onMouseEnter={() => setHover(starIndex)}
          onMouseLeave={() => setHover(0)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
};

const BeriUlasanPage: NextPage<BeriUlasanProps> = ({ product, orderId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Harap berikan rating bintang.");
      return;
    }
    if (!user) {
      alert("Anda harus login untuk memberi ulasan.");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append('productId', product.id);
    formData.append('orderId', orderId);
    formData.append('userId', user.uid);
    formData.append('rating', String(rating));
    formData.append('comment', comment);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Terima kasih atas ulasan Anda!');
        router.push('/pesanan');
      } else {
        alert('Gagal mengirim ulasan.');
      }
    } catch (error) { // 'error' digunakan di console.error
      console.error('Submit review error:', error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold my-6 text-center">Beri Ulasan untuk</h1>
      <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
        <h2 className="text-2xl font-semibold">{product.name}</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label className="block text-lg font-medium">Rating Anda</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium">Komentar (Opsional)</label>
          <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={4} className="mt-1 block w-full p-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium">Unggah Foto (Opsional)</label>
          <input type="file" id="image" onChange={e => setImageFile(e.target.files?.[0] || null)} accept="image/*" className="mt-1 block w-full" />
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
            {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { productId, orderId } = context.query;
  if (!productId || !orderId) { return { notFound: true }; }
  try {
    const res = await fetch(`http://localhost:3000/api/produk/${productId}`);
    if (!res.ok) return { notFound: true };
    const product = await res.json();
    return { props: { product, orderId } };
  } catch (error) { // 'error' digunakan di return, jadi tidak unused
    return { notFound: true };
  }
};

export default BeriUlasanPage;