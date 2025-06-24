// src/pages/api/trainings/[id]/registrations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { TrainingRegistration } from '@/lib/types'; //

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  trainingRegistrations: TrainingRegistration[];
  [key: string]: any; // Biarkan any jika db bisa memiliki properti lain/registrations.ts]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query; // id pelatihan

  if (!id) {
    return res.status(400).json({ message: 'Training ID dibutuhkan.' });
  }

  try {
    const fileData = await fs.readFile(dbPath, 'utf-8');
    const db: Database = JSON.parse(fileData); // Ubah 'let' menjadi 'const'

    const registrations = db.trainingRegistrations.filter(reg => reg.trainingId === id);

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Fetch Training Registrations API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}