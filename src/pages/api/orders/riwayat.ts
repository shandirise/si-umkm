// src/pages/api/orders/riwayat.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { Order } from '@/lib/types';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID dibutuhkan' });
  }

  try {
    const fileData = await fs.readFile(dbPath, 'utf-8');
    const db: { orders: Order[] } = JSON.parse(fileData);

    const userOrders = db.orders.filter(order => order.userId === userId);

    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Riwayat API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}