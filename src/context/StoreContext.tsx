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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  applyBulkPriceAdjustment: (params: {
    targetCategory?: string;
    targetBrand?: string;
    direction: 'increase' | 'decrease';
    type: 'percent' | 'fixed';
    amount: number;
    roundHundreds: boolean;
  }) => void;
  resetToFactoryProducts: () => void;
  theme: 'neon' | 'light';
  toggleTheme: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const ORDERS_KEY = 'suplementos_top_orders_v2';
const PRODUCTS_KEY = 'suplementos_top_products_v4';
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

  // Tema único: diseño claro (blanco) profesional. Se eliminó el modo neón.
  const theme: 'neon' | 'light' = 'light';

  useEffect(() => {
    try {
      localStorage.removeItem('suplementos_top_theme');
      document.documentElement.removeAttribute('data-theme');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleTheme = () => {};

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

    // Descontar stock atómicamente de cada producto y variante comprada
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const boughtItems = newOrder.items.filter((item) => item.productId === prod.id);
        if (boughtItems.length === 0) return prod;

        const updatedVariants = prod.variants.map((v) => {
          const matchedItem = boughtItems.find((item) => item.variantId === v.id);
          if (matchedItem) {
            return { ...v, stock: Math.max(0, v.stock - matchedItem.quantity) };
          }
          return v;
        });

        return { ...prod, variants: updatedVariants };
      })
    );
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

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const applyBulkPriceAdjustment = ({
    targetCategory = 'all',
    targetBrand = 'all',
    direction,
    type,
    amount,
    roundHundreds,
  }: {
    targetCategory?: string;
    targetBrand?: string;
    direction: 'increase' | 'decrease';
    type: 'percent' | 'fixed';
    amount: number;
    roundHundreds: boolean;
  }) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (targetCategory !== 'all' && prod.category.slug !== targetCategory && prod.category.id !== targetCategory) {
          return prod;
        }
        if (targetBrand !== 'all' && prod.brand.toLowerCase() !== targetBrand.toLowerCase()) {
          return prod;
        }

        const updatedVariants = prod.variants.map((v) => {
          let price = v.priceInCents;
          if (type === 'percent') {
            const factor = direction === 'increase' ? 1 + amount / 100 : Math.max(0.1, 1 - amount / 100);
            price = Math.round(price * factor);
          } else {
            const deltaCents = amount * 100;
            price = direction === 'increase' ? price + deltaCents : Math.max(10000, price - deltaCents);
          }

          if (roundHundreds) {
            // Round to nearest 100 pesos (10,000 cents)
            const pesos = price / 100;
            const roundedPesos = Math.round(pesos / 100) * 100;
            price = roundedPesos * 100;
          }

          return { ...v, priceInCents: price };
        });

        return { ...prod, variants: updatedVariants };
      })
    );
  };

  const resetToFactoryProducts = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(PRODUCTS_KEY);
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
        addProduct,
        updateProduct,
        deleteProduct,
        applyBulkPriceAdjustment,
        resetToFactoryProducts,
        theme,
        toggleTheme,
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
