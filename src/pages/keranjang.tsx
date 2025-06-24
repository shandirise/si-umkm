// src/pages/keranjang.tsx
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { Product } from '@/lib/types';

export default function KeranjangPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    items, 
    addToCart, 
    decreaseQuantity, 
    removeFromCart, 
    clearCart, 
    toggleItemSelected, 
    totalPrice 
  } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Ambil hanya item yang terpilih (checked)
  const selectedItems = items.filter(item => item.selected);

  const handleCheckout = async () => {
    if (!user) {
      alert("Anda harus login untuk melanjutkan checkout.");
      router.push('/login');
      return;
    }
    if (selectedItems.length === 0) {
      alert("Silakan pilih minimal satu item untuk di-checkout.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          items: selectedItems,
          totalPrice: totalPrice,
        }),
      });

      if (res.ok) {
        alert('Checkout berhasil! Pesanan Anda sedang diproses.');
        // Kosongkan keranjang dari item yang sudah di-checkout
        selectedItems.forEach(item => removeFromCart(item.id));
        router.push('/'); // Atau ke halaman riwayat pesanan
      } else {
        const errorData = await res.json();
        alert(`Checkout gagal: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Terjadi kesalahan koneksi saat checkout.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Keranjang Belanja</h1>

        {items.length === 0 ? (
          <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-lg shadow-md">
            <p className="text-xl text-gray-500">Keranjang Anda kosong.</p>
            <Link href="/" className="mt-4 inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded hover:bg-blue-700">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Daftar Item Keranjang */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-2xl font-semibold">Produk Anda ({items.length} item)</h2>
                <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Kosongkan Keranjang</button>
              </div>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b dark:border-gray-700 py-4">
                    <div className="flex items-center gap-4 flex-grow">
                      <input 
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={!!item.selected} // Gunakan '!!' untuk memastikan nilainya boolean
                        onChange={() => toggleItemSelected(item.id)}
                      />
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded">
                        <button onClick={() => decreaseQuantity(item.id)} className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700">-</button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button onClick={() => addToCart(item as unknown as Product)} className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700">+</button>
                      </div>
                      <p className="font-semibold w-24 text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Ringkasan Pesanan */}
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-semibold border-b pb-4 mb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-2 mb-4 border-b pb-4 min-h-[40px]">
                {selectedItems.length > 0 ? selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="pr-2">{item.name} ({item.quantity}x)</span>
                    <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                )) : <p className="text-sm text-gray-500">Pilih item untuk di-checkout.</p>}
              </div>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span>Ongkos Kirim</span>
                <span>Rp 0</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button 
                onClick={handleCheckout} 
                disabled={selectedItems.length === 0 || isLoading} 
                className="mt-6 w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-transform active:scale-95"
              >
                {isLoading ? 'Memproses...' : `Lanjutkan ke Pembayaran (${selectedItems.length} item)`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}