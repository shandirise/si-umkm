// src/pages/api/reviews/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
// You'll remove fs and path imports for image saving if you use Firebase Storage
import fs from 'fs/promises'; // Keep if still using local temporary files before uploading
import path from 'path'; // Keep if still using local temporary files before uploading
import { adminDb } from '@/lib/firebaseAdmin'; // Import adminDb
import type { Review } from '@/lib/types'; //

// You'll likely need to use Firebase Storage for image uploads
// For simplicity, we'll keep local uploads for now, but in Vercel
// this won't persist. You'd integrate Firebase Storage here.
// const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // --- IMPORTANT: For production, integrate Firebase Storage for images ---
    // This local file upload will NOT work on Vercel after build.
    // You need to upload to Firebase Storage and get a public URL.
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'reviews'); // Placeholder for local dev
    await fs.mkdir(uploadDir, { recursive: true }); // Placeholder for local dev
    // ---------------------------------------------------------------------

    const form = formidable({ uploadDir, keepExtensions: true, allowEmptyFiles: true });
    const [fields, files] = await form.parse(req);

    const { productId, userId, rating, comment, orderId } = fields;
    const imageFile = files.image?.[0];

    if (!productId || !userId || !rating || !orderId) {
      return res.status(400).json({ message: 'Data tidak lengkap.' });
    }

    let reviewImageUrl: string | undefined;
    if (imageFile && imageFile.size > 0) {
      // --- REPLACE THIS WITH FIREBASE STORAGE UPLOAD LOGIC ---
      reviewImageUrl = `/uploads/reviews/${imageFile.newFilename}`; // This is a local path.
      // --------------------------------------------------------
    }

    const newReviewRef = adminDb.collection('reviews').doc();
    const newReview: Review = {
      id: newReviewRef.id,
      productId: productId[0],
      userId: userId[0],
      rating: Number(rating[0]),
      comment: comment?.[0] || '',
      imageUrl: reviewImageUrl,
    };

    await newReviewRef.set(newReview);

    // Optional: Update average rating on product or shop if needed (more complex with Firestore)
    // You might also use a Cloud Function for this.

    return res.status(201).json({ message: 'Ulasan berhasil dikirim', review: newReview });

  } catch (error: any) {
    console.error("Review API Error:", error);
    return res.status(500).json({ message: 'Gagal mengirim ulasan', error: error.message });
  }
}