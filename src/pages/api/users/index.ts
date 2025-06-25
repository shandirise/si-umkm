import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      const db = JSON.parse(fileData);

      const { id, email, name, role, shopId } = req.body;

      // Cek jika user sudah ada
      if (db.users.find((u: any) => u.id === id)) {
        return res.status(400).json({ message: 'User sudah terdaftar.' });
      }

      db.users.push({ id, email, name, role, shopId });
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

      res.status(201).json({ message: 'User berhasil didaftarkan.' });
    } catch (error) {
      console.error('API USERS ERROR:', error);
      res.status(500).json({ message: 'Gagal menyimpan user.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}