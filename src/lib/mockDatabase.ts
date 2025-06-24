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
  export let products: Product[] = [
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