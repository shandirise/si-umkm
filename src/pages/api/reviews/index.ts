// src/pages/api/reviews/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import type { Product, Review, User, Shop, Order } from '@/lib/types';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  users: User[];
  shops: Shop[];
  products: Product[];
  reviews: Review[];
  orders: Order[];
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
    await fs.mkdir(uploadDir, { recursive: true });

    const form = formidable({ uploadDir, keepExtensions: true });
    const [fields, files] = await form.parse(req);

    const { productId, userId, rating, comment, orderId } = fields;
    const imageFile = files.image?.[0];

    if (!productId || !userId || !rating || !orderId) {
      return res.status(400).json({ message: 'Data tidak lengkap.' });
    }

    const fileData = await fs.readFile(dbPath, 'utf-8');
    let db: Database = JSON.parse(fileData);

    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: productId[0],
      userId: userId[0],
      rating: Number(rating[0]),
      comment: comment?.[0] || '',
      imageUrl: imageFile ? `/uploads/reviews/${imageFile.newFilename}` : undefined,
    };

    db.reviews.push(newReview);

    // Optional: Tandai bahwa item di pesanan ini sudah di-review
    const order = db.orders.find(o => o.id === orderId[0]);
    if (order) {
      const itemInOrder = order.items.find(item => item.id === productId[0]);
      if (itemInOrder) {
        // Kita bisa tambahkan properti isReviewed jika ada di tipe CartItem
        // Untuk sekarang, kita lewati langkah ini agar sederhana
      }
    }

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    return res.status(201).json({ message: 'Ulasan berhasil dikirim', review: newReview });

  } catch (error: any) {
    console.error("Review API Error:", error);
    return res.status(500).json({ message: 'Gagal mengirim ulasan', error: error.message });
  }
}