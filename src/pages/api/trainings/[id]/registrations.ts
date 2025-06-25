// src/pages/api/trainings/[id]/registrations.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { TrainingRegistration } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query; // trainingId
  const trainingId = id as string;

  if (!trainingId) {
    return res.status(400).json({ message: 'Training ID dibutuhkan.' });
  }

  try {
    const registrationsSnapshot = await adminDb.collection('trainingRegistrations')
      .where('trainingId', '==', trainingId)
      .get();

    const registrations: TrainingRegistration[] = [];
    registrationsSnapshot.forEach(doc => {
      registrations.push({ id: doc.id, ...doc.data() } as TrainingRegistration);
    });

    res.status(200).json(registrations);
  } catch (error) {
    console.error("Fetch Training Registrations API Error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
}