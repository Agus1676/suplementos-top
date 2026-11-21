import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreLayout } from '../components/layout/StoreLayout';
import { HomePage } from '../pages/storefront/HomePage';

// Home is eager (first paint). Everything else is code-split so the
// initial bundle only contains what the landing page needs.
const named = <T extends Record<string, React.ComponentType>>(
  loader: () => Promise<T>,
  key: keyof T
) => lazy(() => loader().then((m) => ({ default: m[key] as React.ComponentType })));

// Storefront
const CatalogPage = named(() => import('../pages/storefront/CatalogPage'), 'CatalogPage');
const ProductDetailPage = named(() => import('../pages/storefront/ProductDetailPage'), 'ProductDetailPage');
const CheckoutPage = named(() => import('../pages/storefront/CheckoutPage'), 'CheckoutPage');
const PaymentResultPage = named(() => import('../pages/storefront/PaymentResultPage'), 'PaymentResultPage');
const OrderTrackingPage = named(() => import('../pages/storefront/OrderTrackingPage'), 'OrderTrackingPage');
const ContactPage = named(() => import('../pages/storefront/ContactPage'), 'ContactPage');
const ShippingPolicyPage = named(() => import('../pages/storefront/LegalPages'), 'ShippingPolicyPage');
const FAQPage = named(() => import('../pages/storefront/LegalPages'), 'FAQPage');
const TermsPage = named(() => import('../pages/storefront/LegalPages'), 'TermsPage');
const NotFoundPage = named(() => import('../pages/storefront/NotFoundPage'), 'NotFoundPage');

// Admin (never loaded by shoppers)
const AdminLayout = named(() => import('../components/layout/AdminLayout'), 'AdminLayout');
const AdminDashboard = named(() => import('../pages/admin/AdminDashboard'), 'AdminDashboard');
const AdminOrders = named(() => import('../pages/admin/AdminOrders'), 'AdminOrders');
const AdminProducts = named(() => import('../pages/admin/AdminProducts'), 'AdminProducts');
const AdminStock = named(() => import('../pages/admin/AdminStock'), 'AdminStock');
const AdminReports = named(() => import('../pages/admin/AdminReports'), 'AdminReports');
const AdminSettings = named(() => import('../pages/admin/AdminSettings'), 'AdminSettings');

const PageFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Cargando"
    style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <span
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '3px solid #E2E8F0',
        borderTopColor: 'var(--color-accent)',
        animation: 'route-spin 0.7s linear infinite',
      }}
    />
    <style>{`@keyframes route-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
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
          <Route path="stock" element={<AdminStock />} />
          <Route path="reportes" element={<AdminReports />} />
          <Route path="configuracion" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
