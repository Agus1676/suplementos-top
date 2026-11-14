import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreLayout } from '../components/layout/StoreLayout';
import { AdminLayout } from '../components/layout/AdminLayout';

// Storefront pages
import { HomePage } from '../pages/storefront/HomePage';
import { CatalogPage } from '../pages/storefront/CatalogPage';
import { ProductDetailPage } from '../pages/storefront/ProductDetailPage';
import { CheckoutPage } from '../pages/storefront/CheckoutPage';
import { PaymentResultPage } from '../pages/storefront/PaymentResultPage';
import { OrderTrackingPage } from '../pages/storefront/OrderTrackingPage';
import { ContactPage } from '../pages/storefront/ContactPage';
import { ShippingPolicyPage, FAQPage, TermsPage } from '../pages/storefront/LegalPages';
import { NotFoundPage } from '../pages/storefront/NotFoundPage';

// Admin pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminOrders } from '../pages/admin/AdminOrders';
import { AdminProducts } from '../pages/admin/AdminProducts';
import { AdminSettings } from '../pages/admin/AdminSettings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Storefront Routes */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/categoria/:slug" element={<CatalogPage />} />
        <Route path="/producto/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pago-resultado" element={<PaymentResultPage />} />
        <Route path="/seguimiento" element={<OrderTrackingPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/envios" element={<ShippingPolicyPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="pedidos" element={<AdminOrders />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="configuracion" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};
