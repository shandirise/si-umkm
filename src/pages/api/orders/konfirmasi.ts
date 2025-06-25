// src/pages/api/orders/konfirmasi.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Order } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID dibutuhkan' });
  }

  try {
    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    await orderRef.update({ status: 'selesai' });

    res.status(200).json({ message: 'Pesanan berhasil dikonfirmasi', order: { id: orderDoc.id, ...orderDoc.data() } as Order });
  } catch (error) {
    console.error("Konfirmasi API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}