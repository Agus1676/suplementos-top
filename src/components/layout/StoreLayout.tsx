import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../storefront/CartDrawer';
import { WhatsAppFloat } from '../storefront/WhatsAppFloat';

export const StoreLayout: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, search]);

  return (
    <div className="store-layout-root">
      <Header />
      <main className="store-main-content">
        <Outlet />
      </main>
      <CartDrawer />
      <WhatsAppFloat />
      <Footer />

      <style>{`
        .store-layout-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--color-bg-main);
        }
        .store-main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
