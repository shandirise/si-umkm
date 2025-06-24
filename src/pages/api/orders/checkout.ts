// src/pages/api/orders/checkout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { Product, CartItem, Order, User, Shop, Review } from '@/lib/types'; // Asumsikan tipe Order ada di types.ts

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  users: User[];
  shops: Shop[];
  products: Product[];
  reviews: Review[];
  orders: Order[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId, items, totalPrice } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const fileData = await fs.readFile(dbPath, 'utf-8');
    let db: Database = JSON.parse(fileData);

    // Proses setiap item dalam pesanan
    for (const item of items) {
      const productIndex = db.products.findIndex(p => p.id === item.id);
      if (productIndex !== -1) {
        // Kurangi stok dan tambah jumlah terjual
        db.products[productIndex].stock -= item.quantity;
        db.products[productIndex].soldCount += item.quantity;
      }
    }

    // Buat data pesanan baru
    const newOrder: Order = {
      id: `order-${Date.now()}-${userId}`,
      userId: userId,
      items: items,
      totalPrice: totalPrice,
      status: 'diproses', // Status awal pesanan
      createdAt: new Date().toISOString(),
    };

    // Tambahkan pesanan baru ke database
    db.orders.push(newOrder);

    // Tulis kembali seluruh database ke file
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json({ message: 'Checkout berhasil', order: newOrder });

  } catch (error) {
    console.error("Checkout API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}