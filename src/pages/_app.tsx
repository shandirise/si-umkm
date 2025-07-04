// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apolloClient';
import { CartProvider } from '@/context/CartContext'; // <-- Impor CartProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <CartProvider> {/* <-- Bungkus dengan CartProvider */}
        <Component {...pageProps} />
      </CartProvider>
    </ApolloProvider>
  );
}