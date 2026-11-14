import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../context/StoreContext';
import { CartProvider } from '../context/CartContext';
import { AppRoutes } from './routes';
import '../styles/variables.css';
import '../styles/base.css';
import '../styles/components.css';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <StoreProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </StoreProvider>
    </BrowserRouter>
  );
};
