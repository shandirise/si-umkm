// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // onAuthStateChanged adalah listener dari Firebase.
    // Ia akan berjalan setiap kali status login/logout berubah.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Pengguna sedang login
        setUser(user);
      } else {
        // Pengguna sudah logout
        setUser(null);
      }
    });

    // Cleanup subscription saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  return { user };
}