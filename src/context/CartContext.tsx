// src/context/CartContext.tsx
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { CartItem, Product } from '@/lib/types';

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleItemSelected: (productId: string) => void; // Fungsi baru
  totalPrice: number; // Harga total dari item terpilih
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Saat item baru ditambahkan, default-nya langsung terpilih
      return [...prevItems, { ...product, quantity: 1, selected: true }];
    });
  };

  const decreaseQuantity = (productId: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem?.quantity === 1) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Fungsi baru untuk toggle status terpilih
  const toggleItemSelected = (productId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // Hitung total harga hanya dari item yang 'selected'
  const totalPrice = useMemo(() => {
    return items
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, decreaseQuantity, removeFromCart, clearCart, toggleItemSelected, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};