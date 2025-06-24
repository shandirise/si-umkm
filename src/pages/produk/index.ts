import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import type { Product } from '@/lib/types'; // Impor tipe dari file terpusat

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      const db = JSON.parse(fileData);
      // PERBAIKAN DI SINI: Kirim hanya array db.products, bukan seluruh objek db
      return res.status(200).json(db.products || []); 
    } catch (error) {
      console.error("Gagal membaca db.json:", error);
      return res.status(500).json({ message: "Gagal mengambil data produk" });
    }
  }

  if (req.method === 'POST') {
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      const db: { products: Product[] } = JSON.parse(fileData);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const form = formidable({ uploadDir, keepExtensions: true });
      const [fields, files] = await form.parse(req);

      const nama = fields.nama?.[0];
      const harga = fields.harga?.[0];
      const stok = fields.stok?.[0];
      const deskripsi = fields.deskripsi?.[0];
      const gambarFile = files.gambar?.[0];

      if (!nama || !harga || !stok || !deskripsi || !gambarFile) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
      }

      // Asumsikan shopId 'toko-1' untuk sekarang
      const newProduct: Product = {
        id: (db.products.length + 1).toString(),
        shopId: 'toko-1',
        name: nama,
        price: Number(harga),
        stock: Number(stok),
        description: deskripsi,
        imageUrl: `/uploads/${gambarFile.newFilename}`,
        soldCount: 0,
        isVisible: true
      };

      db.products.push(newProduct);
      
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

      return res.status(201).json({ message: 'Produk berhasil dibuat', data: newProduct });

    } catch (error: any) {
      console.error('Gagal memproses form:', error);
      return res.status(500).json({ message: 'Gagal memproses form', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;