// LOKASI: src/pages/produk/[id].tsx
// INI ADALAH KODE UNTUK TAMPILAN HALAMAN (FRONTEND)

import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import type { Product } from '@/lib/types';

type Props = {
  product: Product;
};

const ProductDetailPage: NextPage<Props> = ({ product }) => {
  const [sanitizedDescription, setSanitizedDescription] = useState('');

  useEffect(() => {
    if (product?.description) {
      setSanitizedDescription(DOMPurify.sanitize(product.description));
    }
  }, [product]);

  if (!product) {
    return <div>Produk tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">{'< Kembali ke Beranda'}</Link>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl text-green-600 font-semibold my-2">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="text-md text-gray-500">Stok: {product.stock}</p>
        <hr className="my-4"/>
        <h3 className="text-xl font-semibold">Deskripsi Produk:</h3>
        <div className="prose dark:prose-invert mt-2" dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/produk');
    const products: Product[] = await res.json();
    const paths = products.map((product) => ({
      params: { id: product.id },
    }));
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error("Gagal membuat static paths:", error);
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params!;
  try {
    const res = await fetch(`http://localhost:3000/api/produk/${id}`);
    if (!res.ok) return { notFound: true };
    const product = await res.json();
    return { props: { product }, revalidate: 10 };
  } catch (error) {
    return { notFound: true };
  }
};

export default ProductDetailPage;