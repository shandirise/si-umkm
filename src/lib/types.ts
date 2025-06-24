// src/lib/types.ts
// Pastikan definisi User HANYA ADA SATU KALI seperti ini:
export type User = {
  id: string; // Akan diisi dengan UID dari Firebase
  role: 'pembeli' | 'umkm' | 'admin';
  shopId: string | null;
  email?: string; // Tambahkan ini
  name?: string;  // Tambahkan ini
};

export type Product = {
  id: string;
  shopId: string;
  name: string;
  price: number;
  stock: number;
  soldCount: number;
  description: string;
  imageUrl: string;
  isVisible: boolean;
};

export type Shop = {
  id: string;
  ownerId: string;
  name: string;
};

export type Review = {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  imageUrl?: string;
};

export type CartItem = Product & {
  quantity: number;
  selected: boolean;
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  status: 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan';
  createdAt: string;
};

// NEW TYPE: Training Event
export type Training = {
  id: string;
  name: string;
  description: string;
  date: string; // Format YYYY-MM-DD
  location: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string;
};

// NEW TYPE: Training Registration
export type TrainingRegistration = {
  id: string;
  trainingId: string;
  userId: string;
  userName: string; // Untuk memudahkan tampilan di admin
  userEmail: string; // Untuk memudahkan tampilan di admin
  registrationDate: string; // ISO string
};