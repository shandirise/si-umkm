// src/pages/api/orders/konfirmasi.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { Order } from '@/lib/types';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = { orders: Order[]; [key: string]: any; };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Order ID dibutuhkan' });
  }

  try {
    const fileData = await fs.readFile(dbPath, 'utf-8');
    let db: Database = JSON.parse(fileData);

    const orderIndex = db.orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
    }

    // Ubah status pesanan menjadi 'selesai'
    db.orders[orderIndex].status = 'selesai';

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json({ message: 'Pesanan berhasil dikonfirmasi', order: db.orders[orderIndex] });
  } catch (error) {
    console.error("Konfirmasi API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}