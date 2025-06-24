// Lokasi: src/pages/api/graphql.ts

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';

// Data mock, dalam aplikasi nyata ini akan terhubung ke database.
const products = [
  { id: '1', name: 'Kopi Robusta Lokal', description: 'Biji kopi robusta asli dari petani lokal.', price: 50000 },
  { id: '2', name: 'Keripik Singkong Pedas', description: 'Camilan renyah dengan bumbu pedas manis.', price: 15000 },
  { id: '3', name: 'Madu Hutan Murni', description: 'Madu asli dari lebah di hutan Sumatera.', price: 120000 },
];

// Definisikan Skema GraphQL (Struktur Data)
const typeDefs = gql`
  type Produk {
    id: ID!
    name: String
    description: String
    price: Int
  }

  type Query {
    """
    Fitur pencarian dinamis produk UMKM
    """
    searchProduk(term: String): [Produk]
  }
`;

// Definisikan Resolver (Logika untuk mengambil data)
const resolvers = {
  Query: {
    // Perubahan ada di baris ini: 'parent' kini memiliki tipe 'any'
    searchProduk: (parent: any, args: { term?: string }) => {
      // Jika tidak ada kata kunci pencarian, kembalikan semua produk.
      if (!args.term || args.term.trim() === '') {
        return products;
      }
      
      // Lakukan filter pada data 'products' berdasarkan kata kunci pencarian.
      // Pencarian ini tidak case-sensitive (tidak membedakan huruf besar/kecil).
      const searchTerm = args.term.toLowerCase();
      return products.filter(
        p => p.name.toLowerCase().includes(searchTerm) || 
             p.description.toLowerCase().includes(searchTerm)
      );
    },
  },
};

// Buat dan konfigurasikan server Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Integrasikan server Apollo dengan Next.js
export default startServerAndCreateNextHandler(server);