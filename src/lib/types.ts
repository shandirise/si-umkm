export type User = {
  id: string; // Akan diisi dengan UID dari Firebase
  role: 'pembeli' | 'umkm' | 'admin';
  shopId: string | null;
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