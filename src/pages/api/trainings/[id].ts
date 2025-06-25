// src/pages/api/trainings/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Training } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // trainingId
  const trainingId = id as string;

  if (req.method === 'DELETE') {
    try {
      const trainingRef = adminDb.collection('trainings').doc(trainingId);
      const trainingDoc = await trainingRef.get();

      if (!trainingDoc.exists) {
        return res.status(404).json({ message: 'Pelatihan tidak ditemukan.' });
      }

      // Start a batch write to delete training and its registrations atomically
      const batch = adminDb.batch();
      batch.delete(trainingRef); // Delete the training

      // Find and delete all registrations associated with this training
      const registrationsSnapshot = await adminDb.collection('trainingRegistrations')
        .where('trainingId', '==', trainingId)
        .get();
      registrationsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      return res.status(200).json({ message: 'Pelatihan dan pendaftaran terkait berhasil dihapus.' });

    } catch (error) {
      console.error(`Error deleting training (ID: ${trainingId}):`, error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server saat menghapus pelatihan.' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}