// src/pages/api/produk/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { Product } from '@/lib/types'; //
import formidable from 'formidable'; // Hapus import { File } jika tidak digunakan secara langsung.ts]

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  products: Product[];
  // Definisikan tipe lain jika diperlukan untuk type safety
  [key: string]: any;
}

// Nonaktifkan bodyParser bawaan karena kita akan menggunakan formidable untuk method PUT
export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const fileData = await fs.readFile(dbPath, 'utf-8');
    const db: Database = JSON.parse(fileData); // Ubah 'let' menjadi 'const'
    
    // GET: Mengambil satu produk
    if (req.method === 'GET') {
      const product = db.products.find((p) => p.id === id);
      if (product) return res.status(200).json(product);
      return res.status(404).json({ message: `Produk tidak ditemukan` });
    }

    // DELETE: Menghapus satu produk
    if (req.method === 'DELETE') {
      const initialLength = db.products.length;
      db.products = db.products.filter((p) => p.id !== id);
      if (db.products.length === initialLength) {
        return res.status(404).json({ message: `Produk tidak ditemukan` });
      }
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
      return res.status(200).json({ message: 'Produk berhasil dihapus' });
    }

    // PUT: Memperbarui satu produk
    if (req.method === 'PUT') {
      const productIndex = db.products.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        return res.status(404).json({ message: `Produk tidak ditemukan` });
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Tambahkan allowEmptyFiles: true untuk form PUT dengan gambar opsional
      const form = formidable({ uploadDir, keepExtensions: true, allowEmptyFiles: true });
      const [fields, files] = await form.parse(req);

      const productToUpdate = db.products[productIndex];
      
      productToUpdate.name = fields.name?.[0] || productToUpdate.name;
      productToUpdate.price = Number(fields.price?.[0]) || productToUpdate.price;
      productToUpdate.stock = Number(fields.stock?.[0]) || productToUpdate.stock;
      productToUpdate.description = fields.description?.[0] || productToUpdate.description;
      
      const newImageFile = files.newImage?.[0];
      if (newImageFile && newImageFile.size > 0) { // Pastikan file ada dan tidak kosong
        const oldImagePath = path.join(process.cwd(), 'public', productToUpdate.imageUrl);
        if (productToUpdate.imageUrl.startsWith('/uploads/')) {
            try { await fs.unlink(oldImagePath); } catch (e) { console.log("Gagal hapus gambar lama, mungkin tidak ada.")} // Hapus 'e' dari parameter unused
        }
        productToUpdate.imageUrl = `/uploads/${newImageFile.newFilename}`;
      }
      
      db.products[productIndex] = productToUpdate;
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
      return res.status(200).json({ message: 'Produk berhasil diperbarui', data: productToUpdate });
    }

    res.setHeader('Allow', ['GET', 'DELETE', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) { // Hapus 'error' dari parameter jika tidak digunakan, atau gunakan
    console.error(`Error pada API /api/produk/[id] (ID: ${id}):`, error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}