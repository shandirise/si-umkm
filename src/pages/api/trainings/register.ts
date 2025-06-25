// src/pages/api/trainings/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// import path from 'path'; // REMOVE THIS LINE
import { adminDb } from '@/lib/firebaseAdmin';
import * as admin from 'firebase-admin'; // Added for FieldValue.increment
import type { Training, TrainingRegistration, User } from '@/lib/types';

// const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json'); // REMOVE OR COMMENT OUT THIS LINE

// Remove or update this type if it's no longer relevant after removing db.json
// type Database = {
//   trainings: Training[];
//   trainingRegistrations: TrainingRegistration[];
//   users: User[];
//   [key: string]: any;
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { trainingId, userId } = req.body;

  if (!trainingId || !userId) {
    return res.status(400).json({ message: 'Training ID dan User ID dibutuhkan.' });
  }

  try {
    const trainingRef = adminDb.collection('trainings').doc(trainingId);
    const trainingDoc = await trainingRef.get();

    if (!trainingDoc.exists) {
      return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
    }

    const training = trainingDoc.data() as Training;

    if (training.registeredCount >= training.capacity) {
      return res.status(400).json({ message: 'Kapasitas pelatihan sudah penuh.' });
    }

    // Cek apakah user sudah terdaftar
    const existingRegistrationSnapshot = await adminDb.collection('trainingRegistrations')
      .where('trainingId', '==', trainingId)
      .where('userId', '==', userId)
      .limit(1)
      .get();

    if (!existingRegistrationSnapshot.empty) {
      return res.status(400).json({ message: 'Anda sudah terdaftar di pelatihan ini.' });
    }

    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists) {
        return res.status(404).json({ message: 'Data pengguna tidak ditemukan di database. Mohon login ulang atau daftar.' });
    }
    const user = userDoc.data() as User;

    const newRegistrationRef = adminDb.collection('trainingRegistrations').doc();
    const newRegistration: TrainingRegistration = {
      id: newRegistrationRef.id,
      trainingId: trainingId,
      userId: userId,
      userName: user.name || user.email || 'Pengguna Tidak Dikenal',
      userEmail: user.email || 'Email Tidak Dikenal',
      registrationDate: new Date().toISOString(),
    };

    const batch = adminDb.batch();
    batch.set(newRegistrationRef, newRegistration);
    batch.update(trainingRef, { registeredCount: admin.firestore.FieldValue.increment(1) });
    await batch.commit();

    res.status(200).json({ message: 'Pendaftaran pelatihan berhasil!', registration: newRegistration });
  } catch (error) {
    console.error("Training Registration API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}