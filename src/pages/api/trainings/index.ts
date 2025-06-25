// src/pages/api/trainings/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs/promises'; // Keep for local dev image handling if not using Storage yet
import path from 'path'; // Keep for local dev image handling if not using Storage yet
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Training } from '@/lib/types';

// For Vercel, this local upload config will not persist images.
// You MUST switch to Firebase Storage for images in production.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const trainingsSnapshot = await adminDb.collection('trainings').orderBy('date').get();
      const trainings: Training[] = [];
      trainingsSnapshot.forEach(doc => {
        trainings.push({ id: doc.id, ...doc.data() } as Training);
      });
      return res.status(200).json(trainings);
    } catch (error) {
      console.error("Failed to fetch training data from Firestore:", error);
      return res.status(500).json({ message: "Failed to fetch training data" });
    }
  }

  if (req.method === 'POST') {
    try {
      // --- IMPORTANT: For production, integrate Firebase Storage for images ---
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'trainings');
      await fs.mkdir(uploadDir, { recursive: true });
      // ---------------------------------------------------------------------

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

      let newImageUrl: string | undefined;
      if (imageUrlFile && imageUrlFile.size > 0) {
        // --- REPLACE THIS WITH FIREBASE STORAGE UPLOAD LOGIC ---
        newImageUrl = `/uploads/trainings/${imageUrlFile.newFilename}`; // Local path
        // --------------------------------------------------------
      }

      const newTrainingRef = adminDb.collection('trainings').doc();
      const newTraining: Training = {
        id: newTrainingRef.id,
        name: name,
        description: description,
        date: date,
        location: location,
        capacity: Number(capacity),
        registeredCount: 0,
        imageUrl: newImageUrl,
      };

      await newTrainingRef.set(newTraining);

      return res.status(201).json({ message: 'Pelatihan berhasil ditambahkan', data: newTraining });

    } catch (error: any) {
      console.error('Failed to create training in Firestore:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menambahkan pelatihan', error: error.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}