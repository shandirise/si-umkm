// src/pages/api/produk/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Product } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs if not using Firestore's auto-ID

// You'll likely need to use Firebase Storage for image uploads
// For simplicity, we'll keep local uploads for now, but in Vercel
// this won't persist. You'd integrate Firebase Storage here.
// const uploadDir = path.join(process.cwd(), 'public', 'uploads');

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const productsSnapshot = await adminDb.collection('products').where('isVisible', '==', true).get();
      const products: Product[] = [];
      productsSnapshot.forEach(doc => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      return res.status(200).json(products);
    } catch (error) {
      console.error("Gagal mengambil data produk dari Firestore:", error);
      return res.status(500).json({ message: "Gagal mengambil data produk" });
    }
  }

  if (req.method === 'POST') {
    try {
      // --- IMPORTANT: For production, integrate Firebase Storage for images ---
      // This local file upload will NOT work on Vercel after build.
      // You need to upload to Firebase Storage and get a public URL.
      const uploadDir = path.join(process.cwd(), 'public', 'uploads'); // Placeholder for local dev
      await fs.mkdir(uploadDir, { recursive: true }); // Placeholder for local dev
      // ---------------------------------------------------------------------

      const form = formidable({ uploadDir, keepExtensions: true, allowEmptyFiles: true });
      const [fields, files] = await form.parse(req);

      const name = fields.nama?.[0];
      const harga = fields.harga?.[0];
      const stok = fields.stok?.[0];
      const description = fields.deskripsi?.[0];
      const gambarFile = files.gambar?.[0];

      if (!name || !harga || !stok || !description || !gambarFile || gambarFile.size === 0) {
        return res.status(400).json({ message: 'Semua field wajib diisi, termasuk gambar produk.' });
      }

      // --- REPLACE THIS WITH FIREBASE STORAGE UPLOAD LOGIC ---
      const imageUrl = `/uploads/${gambarFile.newFilename}`; // This is a local path.
      // Example for Firebase Storage (pseudo-code):
      // const storageRef = admin.storage().bucket().file(`products/${gambarFile.newFilename}`);
      // await storageRef.upload(gambarFile.filepath);
      // const imageUrl = await storageRef.getSignedUrl({ action: 'read', expires: '03-09-2491' }); // Or get public URL directly
      // --------------------------------------------------------

      const newProductRef = adminDb.collection('products').doc(); // Firestore auto-generates ID
      const newProduct: Product = {
        id: newProductRef.id,
        shopId: 'toko-1', // Still hardcoded, consider dynamic shopId from user auth
        name: name,
        price: Number(harga),
        stock: Number(stok),
        description: description,
        imageUrl: imageUrl, // Will be Firebase Storage URL
        soldCount: 0,
        isVisible: true
      };

      await newProductRef.set(newProduct);

      return res.status(201).json({ message: 'Produk berhasil dibuat', data: newProduct });
    } catch (error: any) {
      console.error('Gagal memproses form atau menyimpan produk ke Firestore:', error);
      return res.status(500).json({ message: 'Gagal memproses form', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;