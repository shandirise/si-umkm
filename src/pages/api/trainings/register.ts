// src/pages/api/trainings/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import type { Training, TrainingRegistration, User } from '@/lib/types'; // Import User type

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

type Database = {
  trainings: Training[];
  trainingRegistrations: TrainingRegistration[];
  users: User[]; // Pastikan User ada di sini
  [key: string]: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { trainingId, userId } = req.body;

  if (!trainingId || !userId) {
    return res.status(400).json({ message: 'Training ID dan User ID dibutuhkan.' });
  }

  try {
    const fileData = await fs.readFile(dbPath, 'utf-8');
    let db: Database = JSON.parse(fileData);

    const trainingIndex = db.trainings.findIndex(t => t.id === trainingId);
    if (trainingIndex === -1) {
      return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
    }

    const training = db.trainings[trainingIndex];
    if (training.registeredCount >= training.capacity) {
      return res.status(400).json({ message: 'Kapasitas pelatihan sudah penuh.' });
    }

    // Cek apakah user sudah terdaftar
    const existingRegistration = db.trainingRegistrations.find(
      reg => reg.trainingId === trainingId && reg.userId === userId
    );
    if (existingRegistration) {
      return res.status(400).json({ message: 'Anda sudah terdaftar di pelatihan ini.' });
    }

    // Cari user di database JSON berdasarkan userId (UID Firebase)
    const user = db.users.find(u => u.id === userId);
    if (!user) {
        // Ini seharusnya tidak terpanggil lagi jika sinkronisasi berhasil saat register/login
        return res.status(404).json({ message: 'Data pengguna tidak ditemukan di database. Mohon login ulang atau daftar.' });
    }

    const newRegistration: TrainingRegistration = {
      id: `reg-${Date.now()}-${userId}-${trainingId}`,
      trainingId: trainingId,
      userId: userId,
      userName: user.name || user.email || 'Pengguna Tidak Dikenal', // Menggunakan user.name jika ada, fallback ke user.email atau 'Pengguna Tidak Dikenal'
      userEmail: user.email || 'Email Tidak Dikenal', // Menggunakan user.email jika ada, fallback ke 'Email Tidak Dikenal'
      registrationDate: new Date().toISOString(),
    };

    db.trainingRegistrations.push(newRegistration);
    db.trainings[trainingIndex].registeredCount++;

    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    res.status(200).json({ message: 'Pendaftaran pelatihan berhasil!', registration: newRegistration });
  } catch (error) {
    console.error("Training Registration API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}