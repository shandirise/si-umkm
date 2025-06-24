// src/pages/api/trainings/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { Training, TrainingRegistration } from '@/lib/types';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  trainings: Training[];
  trainingRegistrations: TrainingRegistration[];
  [key: string]: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // trainingId

  if (req.method === 'DELETE') {
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      let db: Database = JSON.parse(fileData);

      const initialTrainingsLength = db.trainings.length;
      db.trainings = db.trainings.filter((t) => t.id !== id);

      if (db.trainings.length === initialTrainingsLength) {
        return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
      }

      // Hapus juga semua pendaftaran terkait pelatihan ini
      db.trainingRegistrations = db.trainingRegistrations.filter(
        (reg) => reg.trainingId !== id
      );

      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
      return res.status(200).json({ message: 'Pelatihan dan pendaftaran terkait berhasil dihapus.' });

    } catch (error) {
      console.error(`Error deleting training (ID: ${id}):`, error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server saat menghapus pelatihan.' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}