// src/pages/api/orders/checkout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin'; // Tambahkan ini
import { adminDb } from '@/lib/firebaseAdmin'; // Tetap import adminDb untuk koleksi
import type { Product, CartItem, Order, User, Shop, Review } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { userId, items, totalPrice } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Data tidak lengkap' });
    }

    const batch = adminDb.batch();

    for (const item of items) {
      const productRef = adminDb.collection('products').doc(item.id);
      batch.update(productRef, {
        // Ganti adminDb.firestore.FieldValue menjadi admin.firestore.FieldValue
        stock: admin.firestore.FieldValue.increment(-item.quantity),
        soldCount: admin.firestore.FieldValue.increment(item.quantity)
      });
    }

    const orderRef = adminDb.collection('orders').doc();
    const newOrder: Order = {
      id: orderRef.id,
      userId: userId,
      items: items,
      totalPrice: totalPrice,
      status: 'diproses',
      createdAt: new Date().toISOString(),
    };
    batch.set(orderRef, newOrder);

    await batch.commit();

    res.status(200).json({ message: 'Checkout berhasil', order: newOrder });

  } catch (error) {
    console.error("Checkout API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}