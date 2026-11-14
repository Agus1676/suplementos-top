import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../storefront/CartDrawer';

export const StoreLayout: React.FC = () => {
  return (
    <div className="store-layout-root">
      <Header />
      <main className="store-main-content">
        <Outlet />
      </main>
      <CartDrawer />
      <Footer />

      <style>{`
        .store-layout-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .store-main-content {
          flex: 1;
        }
      `}</style>
    </div>
  );
};
