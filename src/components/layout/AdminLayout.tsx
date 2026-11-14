import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  Store, 
  MapPin, 
  Send
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { orders } = useStore();

  const pendingCount = orders.filter((o) => o.fulfillmentStatus === 'preparing' || o.fulfillmentStatus === 'unfulfilled').length;

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin-root">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand-header">
          <Link to="/" className="admin-brand-link">
            <span className="admin-badge">TOP</span>
            <div>
              <span className="admin-title">ADMIN PANEL</span>
              <span className="admin-sub">Suplementos Top</span>
            </div>
          </Link>
        </div>

        <nav className="admin-nav">
          <Link 
            to="/admin" 
            className={`admin-nav-item ${isActive('/admin') ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/admin/pedidos" 
            className={`admin-nav-item ${isActive('/admin/pedidos') ? 'active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>Pedidos</span>
            {pendingCount > 0 && (
              <span className="admin-pill-badge">{pendingCount}</span>
            )}
          </Link>

          <Link 
            to="/admin/productos" 
            className={`admin-nav-item ${isActive('/admin/productos') ? 'active' : ''}`}
          >
            <Package size={18} />
            <span>Productos & Stock</span>
          </Link>

          <Link 
            to="/admin/configuracion" 
            className={`admin-nav-item ${isActive('/admin/configuracion') ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Configuración</span>
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="btn-return-store">
            <Store size={16} />
            <span>Volver a la Tienda</span>
          </Link>
          <div className="admin-store-tag">
            <MapPin size={12} className="text-accent" />
            <span>Uriburu 1163, CABA</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>Panel de Gestión y Despacho</span>
          </div>
          <div className="admin-topbar-actions">
            <a 
              href="https://wa.me/5491165651990" 
              target="_blank" 
              rel="noopener noreferrer"
              className="admin-wa-pill"
            >
              <Send size={14} />
              <span>WhatsApp Tienda: 11 6565 1990</span>
            </a>
            <div className="admin-avatar">
              <span>Admin</span>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <style>{`
        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
        }
        .admin-sidebar {
          width: 250px;
          background: var(--color-primary);
          color: #E2E8F0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          height: 100vh;
        }
        .admin-brand-header {
          padding: 1.5rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .admin-brand-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          color: #FFFFFF;
        }
        .admin-badge {
          background: var(--color-accent);
          color: #0F172A;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .admin-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1rem;
          display: block;
        }
        .admin-sub {
          font-size: 0.7rem;
          color: #94A3B8;
          display: block;
        }
        .admin-nav {
          padding: 1rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: #94A3B8;
          transition: all 0.15s;
        }
        .admin-nav-item:hover {
          color: #FFFFFF;
          background: rgba(255,255,255,0.05);
        }
        .admin-nav-item.active {
          color: #0F172A;
          background: var(--color-accent);
          font-weight: 700;
        }
        .admin-pill-badge {
          margin-left: auto;
          background: var(--color-danger);
          color: #FFF;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
        }
        .admin-sidebar-footer {
          padding: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .btn-return-store {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #CBD5E1;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
        }
        .btn-return-store:hover {
          background: rgba(255,255,255,0.08);
          color: #FFF;
        }
        .admin-store-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.725rem;
          color: #94A3B8;
        }
        .admin-main-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
        }
        .admin-topbar {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 20;
        }
        .admin-topbar-title {
          font-weight: 700;
          color: var(--color-primary);
          font-size: 1.1rem;
        }
        .admin-topbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .admin-wa-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #F0FDF4;
          color: #15803D;
          border: 1px solid #BBF7D0;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .admin-avatar {
          background: var(--color-primary);
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.35rem 0.8rem;
          border-radius: var(--radius-full);
        }
        .admin-content {
          padding: 2rem;
          flex: 1;
        }
      `}</style>
    </div>
  );
};
