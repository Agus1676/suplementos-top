import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariant } from '../types';
import { STORE_SETTINGS } from '../lib/mockData';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotalInCents: number;
  shippingFeeInCents: number;
  totalInCents: number;
  isFreeShippingEligible: boolean;
  freeShippingProgress: number; // 0 to 100
  centsRemainingForFreeShipping: number;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'suplementos_top_cart_v1';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    const compositeId = `${product.id}-${variant.id}`;
    
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === compositeId);
      if (existing) {
        const nextQty = Math.min(existing.quantity + quantity, variant.stock);
        return prevItems.map((item) =>
          item.id === compositeId ? { ...item, quantity: nextQty } : item
        );
      }

      const newItem: CartItem = {
        id: compositeId,
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        variantId: variant.id,
        variantTitle: variant.title,
        flavor: variant.flavor,
        size: variant.size,
        priceInCents: variant.priceInCents,
        compareAtPriceInCents: variant.compareAtPriceInCents,
        imageUrl: product.images[0]?.url || 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=400&q=80',
        quantity: Math.min(quantity, variant.stock),
        maxStock: variant.stock,
      };

      return [...prevItems, newItem];
    });

    setIsCartDrawerOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: Math.min(newQty, item.maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalInCents = items.reduce((acc, item) => acc + item.priceInCents * item.quantity, 0);

  const isFreeShippingEligible = STORE_SETTINGS.freeShippingThresholdInCents > 0 && subtotalInCents >= STORE_SETTINGS.freeShippingThresholdInCents;
  const centsRemainingForFreeShipping = 0;
  const freeShippingProgress = 0;

  const shippingFeeInCents = subtotalInCents === 0 ? 0 : STORE_SETTINGS.flatShippingRateInCents;
  const totalInCents = subtotalInCents + shippingFeeInCents;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotalInCents,
        shippingFeeInCents,
        totalInCents,
        isFreeShippingEligible,
        freeShippingProgress,
        centsRemainingForFreeShipping,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
