// src/pages/pesanan/index.tsx
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/lib/types';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase'; // <--- TAMBAHKAN BARIS INI

export default function RiwayatPesananPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/riwayat?userId=${user.uid}`);
      if (!res.ok) throw new Error("Gagal mengambil data pesanan");
      const data = await res.json();
      // Urutkan pesanan dari yang paling baru
      data.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Beri waktu sejenak untuk hook useAuth mendapatkan data user
    const timer = setTimeout(() => {
      if (user) {
        fetchOrders();
      } else {
        // Cek lagi sekali sebelum redirect, untuk memastikan user benar-benar tidak ada
        if (!auth.currentUser) {
          alert("Anda harus login untuk melihat riwayat pesanan.");
          router.push('/login');
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, router, fetchOrders]);
  
  const handleConfirmReceipt = async (orderId: string) => {
    if (!window.confirm("Apakah Anda yakin sudah menerima semua item dalam pesanan ini?")) return;
    
    try {
      const res = await fetch('/api/orders/konfirmasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        alert("Pesanan berhasil dikonfirmasi! Terima kasih.");
        fetchOrders(); // Muat ulang data pesanan untuk update status di UI
      } else {
        alert("Gagal mengkonfirmasi pesanan.");
      }
    } catch (error) {
      console.error("Gagal konfirmasi:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Memuat riwayat pesanan...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
       <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">{'< Kembali ke Beranda'}</Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Riwayat Pesanan Saya</h1>
      <div className="space-y-6 max-w-4xl mx-auto">
        {orders.length > 0 ? orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start border-b dark:border-gray-700 pb-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Nomor Pesanan</p>
                <p className="font-mono text-xs md:text-sm">{order.id}</p>
                <p className="text-sm text-gray-500 mt-2">Tanggal Pesanan</p>
                <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="text-left md:text-right mt-4 md:mt-0">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                <span className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded-full ${order.status === 'selesai' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Item yang dipesan:</h4>
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md"/>
                    <div className="flex-grow">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                   {/* Tombol ulasan hanya muncul jika pesanan selesai */}
                  {order.status === 'selesai' && (
                    <Link href={`/ulasan/tambah/${item.id}?orderId=${order.id}`} className="text-sm bg-green-500 text-white font-bold py-1 px-3 rounded hover:bg-green-600 no-underline whitespace-nowrap">
                      Beri Ulasan
                    </Link>
                  )}
                </div>
              ))}
            </div>
            {order.status === 'diproses' && (
              <div className="text-right mt-4 border-t dark:border-gray-700 pt-4">
                <button onClick={() => handleConfirmReceipt(order.id)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
                  Konfirmasi Pesanan Diterima
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500">Anda belum memiliki riwayat pesanan.</p>
          </div>
        )}
      </div>
    </div>
  );
}