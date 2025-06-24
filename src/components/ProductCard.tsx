// src/components/ProductCard.tsx
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';

// Definisikan tipe data yang diterima komponen ini, sesuai data dari GraphQL
type ProductCardProps = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    soldCount: number;
    stock: number; // Tambahan stok
    shop?: {
      name: string;
    };
    reviewStats?: {
      average: number;
      count: number;
    };
  };
};

// Komponen kecil untuk menampilkan bintang rating
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`w-4 h-4 ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 overflow-hidden">
        <img 
          src={product.imageUrl || 'https://via.placeholder.com/300x200.png?text=No+Image'} 
          alt={`Gambar untuk ${product.name}`}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x200.png?text=Error'; }}
        />
      </div>
      
      <div className="flex-grow">
        <span className="text-xs text-gray-500 dark:text-gray-400">{product.shop?.name || 'Toko tidak diketahui'}</span>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate" title={product.name}>
          {product.name}
        </h3>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        {product.reviewStats && product.reviewStats.count > 0 ? (
          <div className="flex items-center gap-1">
            <StarRating rating={product.reviewStats.average} />
            <span className="dark:text-gray-300">({product.reviewStats.count})</span>
          </div>
        ) : (
          <span>Belum ada ulasan</span>
        )}
        <span className="text-xs text-gray-500">{product.soldCount || 0} terjual</span>
      </div>

      {/* Tampilkan Stok */}
      <div className="text-sm mt-2 text-gray-600 dark:text-gray-400">
        Stok: <span className="font-semibold">{product.stock}</span>
      </div>

      <p className="text-xl font-semibold text-green-600 dark:text-green-400 mt-1">
        Rp {product.price.toLocaleString('id-ID')}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link 
          href={`/produk/${product.id}`} 
          className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Lihat Detail
        </Link>
        <button
          onClick={() => addToCart(product as unknown as Product)}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Keranjang
        </button>
      </div>
    </div>
  );
}