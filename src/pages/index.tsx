// src/pages/index.tsx
import Link from 'next/link';
import ProductSearch from '@/components/ProductSearch';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/context/CartContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function Home() {
  const { user } = useAuth();
  const { items } = useCart();
  const router = useRouter();

  const totalItemsInCart = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert('Anda berhasil logout!');
      router.push('/');
    } catch (error) {
      console.error('Gagal logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto p-4">
        
        <header className="flex justify-between items-center py-4 border-b border-gray-300 dark:border-gray-700">
          <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Si-UMKM
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/keranjang" className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {totalItemsInCart > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{totalItemsInCart}</span>
              )}
            </Link>

            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <span>Halo,</span>
                  <span className="font-semibold">{user.email?.split('@')[0]}</span>
                </div>
                
                {/* Link ke Riwayat Pesanan */}
                <Link href="/pesanan" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">
                  Riwayat Pesanan
                </Link>

                <Link href="/toko-saya" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:underline">
                  Toko Saya
                </Link>
                
                <Link href="/produk/baru" className="text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded transition-colors duration-200">
                  + Produk
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                  Login
                </Link>
                <Link href="/register" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                  Register
                </Link>
              </div>
            )}
            <Link href="/login-admin" className="text-sm text-gray-600 dark:text-gray-400 hover:underline">
              Admin
            </Link>
          </nav>
        </header>
        
        <main className="mt-8">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-4xl font-extrabold mb-2">Selamat Datang di Si-UMKM</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">Platform untuk memajukan dan menemukan produk UMKM lokal terbaik.</p>
          </div>

          {user && (
            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
               <ProductSearch />
            </div>
           )}
        </main>
      </div>
    </div>
  );
}