// src/lib/firebaseAdmin.ts
import * as admin from 'firebase-admin';

// In production, use environment variable for the service account key
// In development, you might load it from a local file (but don't commit it!)
// For Vercel, you will put the content of your serviceAccountKey.json
// into a single environment variable (e.g., FIREBASE_SERVICE_ACCOUNT_KEY)
// and parse it here.

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com` // Optional, if you use Realtime Database
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();