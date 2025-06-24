// src/pages/api/trainings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import formidable from 'formidable'; // Hapus File
import type { Training } from '@/lib/types'; //

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  trainings: Training[];
  [key: string]: any; // Biarkan any jika db bisa memiliki properti lain
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      const db: Database = JSON.parse(fileData);
      return res.status(200).json(db.trainings || []);
    } catch (error) {
      console.error("Failed to read db.json for trainings:", error);
      return res.status(500).json({ message: "Failed to fetch training data" });
    }
  }

  if (req.method === 'POST') {
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'trainings');
      await fs.mkdir(uploadDir, { recursive: true });

      const form = formidable({ uploadDir, keepExtensions: true, allowEmptyFiles: true });
      const [fields, files] = await form.parse(req);

      const name = fields.name?.[0];
      const description = fields.description?.[0];
      const date = fields.date?.[0];
      const location = fields.location?.[0];
      const capacity = fields.capacity?.[0];
      const imageUrlFile = files.imageUrl?.[0];

      if (!name || !description || !date || !location || !capacity) {
        return res.status(400).json({ message: 'Semua field wajib diisi (Nama, Deskripsi, Tanggal, Lokasi, Kapasitas).' });
      }

      const fileData = await fs.readFile(dbPath, 'utf-8');
      const db: Database = JSON.parse(fileData); // Ubah 'let' menjadi 'const'

      let newImageUrl: string | undefined;
      if (imageUrlFile && imageUrlFile.size > 0) {
        newImageUrl = `/uploads/trainings/${imageUrlFile.newFilename}`;
      }

      const newTraining: Training = {
        id: `training-${Date.now()}`,
        name: name,
        description: description,
        date: date,
        location: location,
        capacity: Number(capacity),
        registeredCount: 0,
        imageUrl: newImageUrl,
      };

      db.trainings.push(newTraining);
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

      return res.status(201).json({ message: 'Pelatihan berhasil ditambahkan', data: newTraining });

    } catch (error: any) { // Biarkan any untuk error catch, atau definisikan tipe error
      console.error('Failed to create training:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan pelatihan', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}