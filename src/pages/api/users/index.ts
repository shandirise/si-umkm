// src/pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { User } from '@/lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, email, name, role, shopId } = req.body;

      // Check if user already exists
      const userRef = adminDb.collection('users').doc(id);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        return res.status(400).json({ message: 'User sudah terdaftar.' });
      }

      const newUser: User = { id, email, name, role, shopId };
      await userRef.set(newUser);

      res.status(201).json({ message: 'User berhasil didaftarkan.', user: newUser });
    } catch (error) {
      console.error('API USERS ERROR:', error);
      res.status(500).json({ message: 'Gagal menyimpan user.' });
    }
  } else if (req.method === 'GET') { // You might also need a GET for users to check existence
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: 'User ID is required for GET.' });
    }
    try {
        const userDoc = await adminDb.collection('users').doc(id as string).get();
        if (userDoc.exists) {
            return res.status(200).json(userDoc.data());
        } else {
            return res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        console.error('API GET USER ERROR:', error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
  }
  else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}