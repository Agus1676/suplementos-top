import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  Store, 
  MapPin, 
  Send,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { orders } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on navigation change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const pendingCount = orders.filter((o) => o.fulfillmentStatus === 'preparing' || o.fulfillmentStatus === 'unfulfilled').length;

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin-root">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="admin-backdrop" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true" 
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-brand-header">
          <Link to="/" className="admin-brand-link">
            <span className="admin-badge">TOP</span>
            <div>
              <span className="admin-title">ADMIN PANEL</span>
              <span className="admin-sub">Suplementos Top</span>
            </div>
          </Link>
          <button 
            type="button" 
            className="admin-sidebar-close" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
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
          <div className="admin-topbar-left">
            <button 
              type="button" 
              className="admin-menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <div className="admin-topbar-title">
              <span>Panel de Gestión</span>
              <span className="admin-store-name">Suplementos Top</span>
            </div>
          </div>

          <div className="admin-topbar-actions">
            <a 
              href="https://wa.me/5491165651990" 
              target="_blank" 
              rel="noopener noreferrer"
              className="admin-wa-pill"
              title="WhatsApp de atención"
            >
              <Send size={14} />
              <span className="hide-on-mobile">WhatsApp Tienda: 11 6565 1990</span>
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

      {/* Mobile Sticky Bottom Nav Bar for ultra-fast 1-tap navigation */}
      <nav className="admin-bottom-nav">
        <Link 
          to="/admin" 
          className={`bottom-nav-item ${isActive('/admin') ? 'active' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>Inicio</span>
        </Link>
        <Link 
          to="/admin/pedidos" 
          className={`bottom-nav-item ${isActive('/admin/pedidos') ? 'active' : ''}`}
        >
          <div className="bottom-nav-badge-wrap">
            <ShoppingBag size={20} />
            {pendingCount > 0 && <span className="bottom-badge-dot" />}
          </div>
          <span>Pedidos</span>
        </Link>
        <Link 
          to="/admin/productos" 
          className={`bottom-nav-item ${isActive('/admin/productos') ? 'active' : ''}`}
        >
          <Package size={20} />
          <span>Stock</span>
        </Link>
        <Link 
          to="/admin/configuracion" 
          className={`bottom-nav-item ${isActive('/admin/configuracion') ? 'active' : ''}`}
        >
          <Settings size={20} />
          <span>Config</span>
        </Link>
        <Link 
          to="/" 
          className="bottom-nav-item"
        >
          <Store size={20} />
          <span>Tienda</span>
        </Link>
      </nav>

      <style>{`
        .admin-root {
          display: flex;
          min-height: 100vh;
          background: #F8FAFC;
        }
        .admin-sidebar {
          width: 260px;
          background: #0B132B;
          color: #E2E8F0;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 100;
          flex-shrink: 0;
        }
        .admin-brand-header {
          padding: 1.25rem 1.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-sidebar-close {
          display: none;
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
        }
        .admin-brand-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          color: #FFFFFF;
          text-decoration: none;
        }
        .admin-badge {
          background: #FF5500;
          color: #FFFFFF;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm, 6px);
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
        .admin-title {
          font-weight: 900;
          font-size: 0.95rem;
          display: block;
          color: #FFFFFF;
          letter-spacing: 0.02em;
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
          border-radius: var(--radius-md, 8px);
          font-size: 0.9rem;
          font-weight: 600;
          color: #94A3B8;
          transition: all 0.15s;
          text-decoration: none;
        }
        .admin-nav-item:hover {
          color: #FFFFFF;
          background: rgba(255,255,255,0.06);
        }
        .admin-nav-item.active {
          color: #FFFFFF;
          background: #FF5500;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(255, 85, 0, 0.35);
        }
        .admin-pill-badge {
          margin-left: auto;
          background: #EF4444;
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: 9999px;
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
          border-radius: var(--radius-sm, 6px);
          text-decoration: none;
          background: rgba(255,255,255,0.04);
          transition: background 0.15s;
        }
        .btn-return-store:hover {
          background: rgba(255,255,255,0.1);
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
          min-width: 0;
        }
        .admin-topbar {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 0.85rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 20;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
        }
        .admin-topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .admin-menu-toggle {
          display: none;
          background: transparent;
          border: none;
          color: #0F172A;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          align-items: center;
          justify-content: center;
        }
        .admin-menu-toggle:hover {
          background: #F1F5F9;
        }
        .admin-topbar-title {
          display: flex;
          flex-direction: column;
        }
        .admin-topbar-title span {
          font-weight: 800;
          color: #0F172A;
          font-size: 1.05rem;
          line-height: 1.2;
        }
        .admin-store-name {
          font-size: 0.72rem;
          color: #64748B;
          font-weight: 600;
        }
        .admin-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .admin-wa-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #F0FDF4;
          color: #15803D;
          border: 1px solid #BBF7D0;
          padding: 0.35rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s;
        }
        .admin-wa-pill:hover {
          background: #DCFCE7;
        }
        .admin-avatar {
          background: #0B132B;
          color: #FFFFFF;
          font-size: 0.78rem;
          font-weight: 800;
          padding: 0.35rem 0.8rem;
          border-radius: 9999px;
          letter-spacing: 0.05em;
        }
        .admin-content {
          padding: 1.75rem 2rem;
          flex: 1;
        }

        .admin-bottom-nav {
          display: none;
        }

        /* Responsive Overrides */
        @media (max-width: 900px) {
          .admin-root {
            flex-direction: column;
            padding-bottom: 64px; /* Space for mobile sticky bottom nav */
          }
          .admin-menu-toggle {
            display: flex;
          }
          .admin-sidebar-close {
            display: block;
          }
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 270px;
            max-width: 80vw;
            height: 100vh;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 4px 0 24px rgba(0,0,0,0.3);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
          .admin-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.55);
            backdrop-filter: blur(4px);
            z-index: 95;
          }
          .admin-topbar {
            padding: 0.75rem 1rem;
          }
          .admin-content {
            padding: 1rem;
          }
          .hide-on-mobile {
            display: none !important;
          }

          /* Mobile Bottom Navigation Bar */
          .admin-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 58px;
            background: #0B132B;
            border-top: 1px solid rgba(255,255,255,0.12);
            z-index: 80;
            align-items: center;
            justify-content: space-around;
            padding: 0 4px;
            box-shadow: 0 -4px 16px rgba(0,0,0,0.2);
          }
          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #94A3B8;
            font-size: 0.68rem;
            font-weight: 700;
            text-decoration: none;
            gap: 2px;
            flex: 1;
            height: 100%;
            transition: color 0.15s;
          }
          .bottom-nav-item.active {
            color: #FF5500;
          }
          .bottom-nav-badge-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .bottom-badge-dot {
            position: absolute;
            top: -2px;
            right: -3px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #EF4444;
            border: 2px solid #0B132B;
          }
        }
      `}</style>
    </div>
  );
};
