// src/pages/api/graphql.ts

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import * as admin from 'firebase-admin'; // <--- TAMBAHKAN INI UNTUK NAMESPACE 'admin'
import type { Product, Shop, Review } from '@/lib/types';

// ... (typeDefs tetap sama)
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

const resolvers = {
  Query: {
    searchProduk: async (_: any, args: { term?: string }) => {
      try {
        // Gunakan `admin.firestore.Query` untuk tipe productsQuery
        let productsQuery: admin.firestore.Query = adminDb.collection('products').where('isVisible', '==', true);

        if (args.term && args.term.trim() !== '') {
          // Implementasi client-side filter setelah fetch karena Firestore tidak mendukung 'contains' case-insensitive secara native.
          // Query tetap fetch semua produk visible, filtering akan dilakukan di bawah.
        }

        const productsSnapshot = await productsQuery.get();
        let products: Product[] = [];
        // Beri tipe eksplisit untuk 'doc' sebagai admin.firestore.QueryDocumentSnapshot
        productsSnapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => { // <--- PERBAIKI BARIS INI
          products.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (args.term && args.term.trim() !== '') {
            const searchTerm = args.term.toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        // Fetch all shops and reviews once for efficiency
        const shopsSnapshot = await adminDb.collection('shops').get();
        const shops: Shop[] = [];
        shopsSnapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => { // <--- PERBAIKI BARIS INI
            shops.push({ id: doc.id, ...doc.data() } as Shop);
        });

        const reviewsSnapshot = await adminDb.collection('reviews').get();
        const allReviews: Review[] = [];
        reviewsSnapshot.forEach((doc: admin.firestore.QueryDocumentSnapshot) => { // <--- PERBAIKI BARIS INI
            allReviews.push({ id: doc.id, ...doc.data() } as Review);
        });
        
        return products.map(product => {
          const shop = shops.find(s => s.id === product.shopId);
          const reviewsForProduct = allReviews.filter(r => r.productId === product.id);
          
          const totalRating = reviewsForProduct.reduce((acc, r) => acc + r.rating, 0);
          const averageRating = reviewsForProduct.length > 0 ? totalRating / reviewsForProduct.length : 0;

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
        return [];
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
export default startServerAndCreateNextHandler(server);