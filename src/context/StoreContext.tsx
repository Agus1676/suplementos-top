import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, StoreSettings, Order } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, STORE_SETTINGS as INITIAL_STORE_SETTINGS, INITIAL_ORDERS } from '../lib/mockData';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  settings: StoreSettings;
  updateProductStock: (productId: string, variantId: string, newStock: number) => void;
  createOrder: (newOrder: Order) => void;
  updateOrderStatus: (orderId: string, paymentStatus?: Order['paymentStatus'], fulfillmentStatus?: Order['fulfillmentStatus'], trackingNumber?: string) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ORDERS_KEY = 'suplementos_top_orders_v2';
const PRODUCTS_KEY = 'suplementos_top_products_v3';
const SETTINGS_KEY = 'suplementos_top_settings_v2';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  const updateProductStock = (productId: string, variantId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const updatedVariants = prod.variants.map((v) =>
          v.id === variantId ? { ...v, stock: Math.max(0, newStock) } : v
        );
        return { ...prod, variants: updatedVariants };
      })
    );
  };

  const createOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Descontar stock correspondiente a cada item comprado
    newOrder.items.forEach((item) => {
      setProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== item.productId) return prod;
          const updatedVariants = prod.variants.map((v) => {
            if (v.id === item.variantId) {
              return { ...v, stock: Math.max(0, v.stock - item.quantity) };
            }
            return v;
          });
          return { ...prod, variants: updatedVariants };
        })
      );
    });
  };

  const updateOrderStatus = (
    orderId: string,
    paymentStatus?: Order['paymentStatus'],
    fulfillmentStatus?: Order['fulfillmentStatus'],
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          paymentStatus: paymentStatus ?? order.paymentStatus,
          fulfillmentStatus: fulfillmentStatus ?? order.fulfillmentStatus,
          trackingNumber: trackingNumber ?? order.trackingNumber,
        };
      })
    );
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        settings,
        updateProductStock,
        createOrder,
        updateOrderStatus,
        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
