// src/pages/api/orders/riwayat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Order } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID dibutuhkan' });
  }

  try {
    const ordersSnapshot = await adminDb.collection('orders').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
    const userOrders: Order[] = [];
    ordersSnapshot.forEach(doc => {
      userOrders.push({ id: doc.id, ...doc.data() } as Order);
    });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Riwayat API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}