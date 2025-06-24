// src/components/ProductSearch.tsx
import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';

// Definisikan query yang akan digunakan oleh komponen ini
const SEARCH_PRODUCT_QUERY = gql`
  query SearchProduk($term: String) {
    searchProduk(term: $term) {
      id
      name
      price
    }
  }
`;

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // useLazyQuery adalah hook yang cocok untuk pencarian,
  // karena query hanya dijalankan saat kita memintanya.
  const [search, { loading, error, data }] = useLazyQuery(SEARCH_PRODUCT_QUERY);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search({ variables: { term: searchTerm } });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Pencarian Produk Dinamis (GraphQL) </h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari produk..."
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '8px' }}>
          {loading ? 'Mencari...' : 'Cari'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Terjadi kesalahan: {error.message}</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        {data && data.searchProduk.map((product: any) => (
          <li key={product.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
            <strong>{product.name}</strong> - Rp {product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}