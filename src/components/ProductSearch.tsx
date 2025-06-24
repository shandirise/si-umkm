// src/components/ProductSearch.tsx
import React, { useState, useEffect } from 'react'; // <-- Impor useEffect
import { gql, useLazyQuery } from '@apollo/client';
import ProductCard from './ProductCard';

// 1. Tambahkan 'stock' ke dalam daftar field yang diminta
const SEARCH_PRODUCT_QUERY = gql`
  query SearchProduk($term: String) {
    searchProduk(term: $term) {
      id
      name
      price
      imageUrl
      soldCount
      stock # <-- TAMBAHKAN INI
      shop {
        name
      }
      reviewStats {
        average
        count
      }
    }
  }
`;

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [search, { loading, error, data }] = useLazyQuery(SEARCH_PRODUCT_QUERY);

  // 2. Tambahkan useEffect untuk memuat semua produk saat komponen pertama kali tampil
  useEffect(() => {
    // Panggil fungsi 'search' tanpa variabel untuk mengambil semua produk
    search();
  }, [search]); // Dependency array ini memastikan efek hanya berjalan sekali

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({ variables: { term: searchTerm } });
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">Cari Produk UMKM</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-lg mx-auto">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ketik nama produk..."
          className="flex-grow p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center">Terjadi kesalahan: {error.message}</p>}
      
      {loading && <p className="text-center">Memuat produk...</p>}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.searchProduk.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {data && data.searchProduk.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-8">Produk tidak ditemukan.</p>
      )}
    </div>
  );
}