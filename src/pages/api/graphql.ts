// src/pages/api/graphql.ts

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import fs from 'fs/promises';
import path from 'path';
import type { Product, Shop, Review } from '@/lib/types';

// 1. Definisikan path ke database file kita
const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

// 2. Definisikan skema GraphQL (cetak biru data)
//    Ini sudah diperbarui dengan stock, Shop, dan ReviewStats
const typeDefs = gql`
  type Shop {
    id: ID!
    name: String
  }

  type ReviewStats {
    average: Float
    count: Int
  }

  type Produk {
    id: ID!
    name: String
    price: Float
    imageUrl: String
    soldCount: Int
    stock: Int
    shop: Shop
    reviewStats: ReviewStats
  }

  type Query {
    searchProduk(term: String): [Produk]
  }
`;

// 3. Definisikan resolver (logika untuk mengambil dan memproses data)
const resolvers = {
  Query: {
    searchProduk: async (_: any, args: { term?: string }) => {
      try {
        const fileData = await fs.readFile(dbPath, 'utf-8');
        const db: { products: Product[], shops: Shop[], reviews: Review[] } = JSON.parse(fileData);
        
        // Ambil hanya produk yang visibilitasnya true
        let filteredProducts = db.products.filter(p => p.isVisible);

        // Jika ada kata kunci pencarian, filter lebih lanjut
        if (args.term && args.term.trim() !== '') {
          const searchTerm = args.term.toLowerCase();
          filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        // Proses setiap produk untuk menambahkan data relasional (toko dan ulasan)
        return filteredProducts.map(product => {
          // Cari data toko yang sesuai
          const shop = db.shops.find(s => s.id === product.shopId);
          
          // Cari semua ulasan untuk produk ini
          const reviewsForProduct = db.reviews.filter(r => r.productId === product.id);
          
          // Hitung rata-rata rating
          const totalRating = reviewsForProduct.reduce((acc, r) => acc + r.rating, 0);
          const averageRating = reviewsForProduct.length > 0 ? totalRating / reviewsForProduct.length : 0;

          // Kembalikan objek produk yang sudah diperkaya dengan data tambahan
          return {
            ...product,
            shop: shop,
            reviewStats: {
              average: averageRating,
              count: reviewsForProduct.length,
            },
          };
        });
      } catch (error) {
        console.error("Gagal memproses query GraphQL:", error);
        // Kembalikan array kosong jika terjadi error
        return [];
      }
    },
  },
};

// 4. Buat dan jalankan server Apollo
const server = new ApolloServer({ typeDefs, resolvers });
export default startServerAndCreateNextHandler(server);