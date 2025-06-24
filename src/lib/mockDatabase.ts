// src/lib/mockDatabase.ts

// Definisikan tipe data Product di sini sebagai sumber utama
export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
};

// Definisikan data awal produk dan 'export' agar bisa diimpor
// Ubah 'let' menjadi 'const' karena array ini akan di-reassign melalui API,
// tapi ESLint menganggap variabel yang tidak di-reassign di scope ini sebagai 'const'
// Karena db.json di-read dan di-write, variabel 'products' ini sendiri tidak langsung di-reassign
export const products: Product[] = [
  { 
    id: '1', 
    name: 'Kopi Robusta Lokal', 
    price: 50000, 
    stock: 100, 
    description: 'Biji kopi <b>robusta</b> asli dari petani lokal.',
    imageUrl: '/placeholder.jpg' // Placeholder awal
  },
  { 
    id: '2', 
    name: 'Keripik Singkong Pedas', 
    price: 15000, 
    stock: 200, 
    description: 'Camilan renyah dengan <i>bumbu pedas manis</i>.',
    imageUrl: '/placeholder.jpg' 
  },
];