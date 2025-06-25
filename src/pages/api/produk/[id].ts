// src/pages/api/produk/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Product } from '@/lib/types';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const productId = id as string;

  try {
    const productRef = adminDb.collection('products').doc(productId);

    // GET: Mengambil satu produk
    if (req.method === 'GET') {
      const productDoc = await productRef.get();
      if (productDoc.exists) {
        return res.status(200).json({ id: productDoc.id, ...productDoc.data() } as Product);
      }
      return res.status(404).json({ message: `Produk tidak ditemukan` });
    }

    // DELETE: Menghapus satu produk
    if (req.method === 'DELETE') {
      const productDoc = await productRef.get();
      if (!productDoc.exists) {
        return res.status(404).json({ message: `Produk tidak ditemukan` });
      }

      // Optional: Delete image from Firebase Storage if you implement it
      // const productData = productDoc.data() as Product;
      // if (productData.imageUrl && productData.imageUrl.startsWith('/uploads/')) {
      //   const fileName = path.basename(productData.imageUrl);
      //   const filePath = `products/${fileName}`; // Adjust path as per your storage structure
      //   await admin.storage().bucket().file(filePath).delete();
      // }

      await productRef.delete();
      return res.status(200).json({ message: 'Produk berhasil dihapus' });
    }

    // PUT: Memperbarui satu produk
    if (req.method === 'PUT') {
      const productDoc = await productRef.get();
      if (!productDoc.exists) {
        return res.status(404).json({ message: `Produk tidak ditemukan` });
      }

      const form = formidable({ uploadDir: path.join(process.cwd(), 'public', 'uploads'), keepExtensions: true, allowEmptyFiles: true });
      const [fields, files] = await form.parse(req);

      const productToUpdate = productDoc.data() as Product;
      
      productToUpdate.name = fields.name?.[0] || productToUpdate.name;
      productToUpdate.price = Number(fields.price?.[0]) || productToUpdate.price;
      productToUpdate.stock = Number(fields.stock?.[0]) || productToUpdate.stock;
      productToUpdate.description = fields.description?.[0] || productToUpdate.description;
      
      const newImageFile = files.newImage?.[0];
      if (newImageFile && newImageFile.size > 0) {
        // --- REPLACE THIS WITH FIREBASE STORAGE UPLOAD LOGIC ---
        // For now, it copies locally for dev, but won't persist on Vercel.
        // You'd upload newImageFile to Storage and update productToUpdate.imageUrl with the new URL.
        const oldLocalPath = path.join(process.cwd(), 'public', productToUpdate.imageUrl);
        if (productToUpdate.imageUrl.startsWith('/uploads/')) {
            try { await fs.unlink(oldLocalPath); } catch (e) { console.log("Gagal hapus gambar lama, mungkin tidak ada.", e)}
        }
        productToUpdate.imageUrl = `/uploads/${newImageFile.newFilename}`;
        // --------------------------------------------------------
      }
      
      await productRef.update(productToUpdate); // Use update for partial updates
      return res.status(200).json({ message: 'Produk berhasil diperbarui', data: productToUpdate });
    }

    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    console.error(`Error pada API /api/produk/[id] (ID: ${productId}):`, error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}