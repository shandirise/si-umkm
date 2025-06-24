// src/pages/admin/dashboard.tsx
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import type { Training, TrainingRegistration } from '@/lib/types'; // Hapus import Product

// Definisikan tipe untuk props yang diterima oleh halaman ini
type DashboardProps = {
  trainings: Training[];
  fetchDate: string;
};

const AdminDashboard: NextPage<DashboardProps> = ({ trainings, fetchDate }) => {
  const router = useRouter();
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<TrainingRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  // Fungsi untuk menangani proses logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/admin-logout', {
        method: 'POST',
      });

      if (res.ok) {
        window.location.href = '/login-admin';
      } else {
        alert('Gagal untuk logout.');
      }
    } catch (error) {
      console.error("Gagal memanggil API logout:", error);
      alert('Gagal untuk logout.');
    }
  };

  // Logika handleDeleteProduct DIHAPUS

  // Handle Delete Training
  const handleDeleteTraining = async (trainingId: string, trainingName: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus pelatihan "${trainingName}"? Ini juga akan menghapus semua pendaftaran terkait.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/trainings/${trainingId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert(`Pelatihan "${trainingName}" berhasil dihapus.`);
        router.replace(router.asPath);
      } else {
        const errorData = await res.json();
        alert(`Gagal menghapus pelatihan: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saat menghapus pelatihan:", error);
      alert("Terjadi kesalahan koneksi saat menghapus pelatihan.");
    }
  };

  // Fetch Registrations for a Training
  const fetchRegistrations = async (trainingId: string) => {
    setSelectedTrainingId(trainingId);
    setLoadingRegistrations(true);
    try {
      const res = await fetch(`/api/trainings/${trainingId}/registrations`);
      if (!res.ok) throw new Error("Gagal mengambil daftar pendaftar");
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      setRegistrations([]);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', background: '#1a1a1a', color: '#ededed' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard Admin</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}>
          Logout
        </button>
      </header>
      <p style={{ marginBottom: '1rem' }}>Halaman ini di-render di server pada: {fetchDate}</p>
      
      {/* BAGIAN PRODUK DIHAPUS */}
      {/* <hr style={{ margin: '2rem 0', borderColor: '#444' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Daftar Produk Terkini</h2>
        <Link href="/produk/baru">
            <button style={{ padding: '8px 16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                Tambah Produk Baru
            </button>
        </Link>
      </div>
      {products.length > 0 ? (
        <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem', borderColor: '#444' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nama Produk</th>
              <th style={{ padding: '10px' }}>Harga</th>
              <th style={{ padding: '10px' }}>Stok</th>
              <th style={{ padding: '10px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ background: '#2a2a2a' }}>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{product.id}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{product.name}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>Rp {product.price.toLocaleString('id-ID')}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{product.stock}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  <Link href={`/produk/edit/${product.id}`} passHref>
                    <button style={{ background: '#ffc107', color: 'black', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>
                        Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tidak ada produk untuk ditampilkan.</p>
      )} */}

      {/* BAGIAN PELATIHAN */}
      <hr style={{ margin: '2rem 0', borderColor: '#444' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Daftar Pelatihan</h2>
        <Link href="/admin/trainings/new">
          <button style={{ padding: '8px 16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Tambah Pelatihan Baru
          </button>
        </Link>
      </div>
      {trainings.length > 0 ? (
        <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#444' }}>
          <thead>
            <tr style={{ background: '#333', color: 'white' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Nama Pelatihan</th>
              <th style={{ padding: '10px' }}>Tanggal</th>
              <th style={{ padding: '10px' }}>Lokasi</th>
              <th style={{ padding: '10px' }}>Pendaftar</th>
              <th style={{ padding: '10px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((training) => (
              <tr key={training.id} style={{ background: '#2a2a2a' }}>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{training.id}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{training.name}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{new Date(training.date).toLocaleDateString('id-ID')}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{training.location}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{training.registeredCount}/{training.capacity}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  <button
                    onClick={() => fetchRegistrations(training.id)}
                    style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}
                    disabled={loadingRegistrations}
                  >
                    {loadingRegistrations && selectedTrainingId === training.id ? 'Memuat...' : 'Lihat Pendaftar'}
                  </button>
                  <button
                    onClick={() => handleDeleteTraining(training.id, training.name)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Tidak ada pelatihan untuk ditampilkan.</p>
      )}

      {/* DAFTAR PENDAFTAR (MODAL-LIKE SECTION) */}
      {selectedTrainingId && (
        <div style={{ marginTop: '2rem', borderTop: '1px solid #444', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Daftar Pendaftar untuk Pelatihan: {trainings.find(t => t.id === selectedTrainingId)?.name}
          </h3>
          {loadingRegistrations ? (
            <p>Memuat daftar pendaftar...</p>
          ) : registrations.length > 0 ? (
            <table border={1} cellPadding={5} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse', borderColor: '#444' }}>
              <thead>
                <tr style={{ background: '#333', color: 'white' }}>
                  <th style={{ padding: '10px' }}>User ID</th>
                  <th style={{ padding: '10px' }}>Nama Pengguna</th>
                  <th style={{ padding: '10px' }}>Email</th>
                  <th style={{ padding: '10px' }}>Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} style={{ background: '#2a2a2a' }}>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{reg.userId}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{reg.userName}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{reg.userEmail}</td>
                    <td style={{ padding: '10px', border: '1px solid #444' }}>{new Date(reg.registrationDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#aaa' }}>Tidak ada pendaftar untuk pelatihan ini.</p>
          )}
          <button
            onClick={() => setSelectedTrainingId(null)}
            style={{ marginTop: '1rem', padding: '8px 16px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Tutup Daftar Pendaftar
          </button>
        </div>
      )}
    </div>
  );
};

// getServerSideProps updated to fetch trainings ONLY
export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        // Hapus pengambilan data produk
        // const productRes = await fetch('http://localhost:3000/api/produk', { cache: 'no-store' });
        // if (!productRes.ok) throw new Error('Gagal mengambil data produk');
        // const products: Product[] = await productRes.json();

        const trainingRes = await fetch('http://localhost:3000/api/trainings', { cache: 'no-store' });
        if (!trainingRes.ok) throw new Error('Gagal mengambil data pelatihan');
        const trainings: Training[] = await trainingRes.json();

        return {
          props: {
            // products, // Hapus products dari props
            trainings,
            fetchDate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          },
        };
    } catch (error) {
        console.error("Error in getServerSideProps for AdminDashboard:", error);
        return {
          props: {
            // products: [], // Hapus products dari props default
            trainings: [],
            fetchDate: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
          },
        };
    }
};

export default AdminDashboard;