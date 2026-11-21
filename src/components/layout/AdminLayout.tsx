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
  X,
  Lock,
  LogOut,
  KeyRound,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ADMIN_MASTER_KEY = 'suplementos2026';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { orders } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Security Gate State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('st_admin_session') === 'active';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLockedTemporarily, setIsLockedTemporarily] = useState(false);

  // Close sidebar on navigation change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLockedTemporarily) return;

    if (enteredPin === ADMIN_MASTER_KEY) {
      sessionStorage.setItem('st_admin_session', 'active');
      setIsAuthenticated(true);
      setPinError('');
      setEnteredPin('');
      setFailedAttempts(0);
    } else {
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);
      setEnteredPin('');

      if (nextAttempts >= 5) {
        setIsLockedTemporarily(true);
        setPinError('Demasiados intentos fallidos. Bloqueado por 30 segundos por seguridad.');
        setTimeout(() => {
          setIsLockedTemporarily(false);
          setFailedAttempts(0);
          setPinError('');
        }, 30000);
      } else {
        setPinError(`Clave incorrecta. Te quedan ${5 - nextAttempts} intentos.`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('st_admin_session');
    setIsAuthenticated(false);
  };

  // If not authenticated, render the Security Gate Screen
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-lock-header">
            <div className="admin-lock-icon-wrap">
              <KeyRound size={32} className="text-accent" />
            </div>
            <img src="/logo.png" alt="Suplementos Top" className="admin-lock-logo" />
            <h1 className="admin-lock-title">Panel de Administración</h1>
            <p className="admin-lock-desc">
              Acceso restringido para el personal y dueño de Suplementos Top.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="admin-lock-form">
            <div className="lock-input-wrap">
              <Lock size={18} className="lock-field-icon" />
              <input
                type="password"
                placeholder="Ingresá la clave de acceso..."
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError('');
                }}
                disabled={isLockedTemporarily}
                className="admin-lock-input"
                autoFocus
              />
            </div>

            {pinError && (
              <div className="admin-lock-error">
                <ShieldAlert size={16} />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!enteredPin.trim() || isLockedTemporarily}
              className="btn btn-primary btn-block admin-lock-btn"
            >
              <span>Desbloquear Panel</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="admin-lock-footer">
            <Link to="/" className="btn-return-store-link">
              ← Volver a la Tienda Pública
            </Link>
          </div>
        </div>

        <style>{`
          .admin-lock-screen {
            min-height: 100vh;
            background: #F4F5F7;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }
          .admin-lock-card {
            background: #FFFFFF;
            border: 1px solid #E4E4E7;
            border-radius: 12px;
            width: 100%;
            max-width: 420px;
            padding: 2.25rem 2rem;
            box-shadow: 0 16px 40px -10px rgba(15, 23, 42, 0.12);
          }
          .admin-lock-header {
            text-align: center;
            margin-bottom: 1.75rem;
          }
          .admin-lock-icon-wrap {
            width: 58px;
            height: 58px;
            background: #FFF1F2;
            border: 1px solid #FFE4E6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1rem;
          }
          .admin-lock-logo {
            height: 48px;
            width: auto;
            margin: 0 auto 0.75rem;
            display: block;
          }
          .admin-lock-title {
            font-size: 1.35rem;
            font-weight: 800;
            color: #18181B;
            margin: 0 0 0.35rem;
          }
          .admin-lock-desc {
            font-size: 0.82rem;
            color: #71717A;
            margin: 0;
            line-height: 1.45;
          }
          .admin-lock-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .lock-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }
          .lock-field-icon {
            position: absolute;
            left: 0.95rem;
            color: #71717A;
            pointer-events: none;
          }
          .admin-lock-input {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.6rem;
            border: 1.5px solid #E4E4E7;
            border-radius: 8px;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.15s ease;
          }
          .admin-lock-input:focus {
            border-color: #18181B;
          }
          .admin-lock-error {
            display: flex;
            align-items: center;
            gap: 0.45rem;
            color: #DC2626;
            font-size: 0.78rem;
            font-weight: 600;
            background: #FEF2F2;
            padding: 0.55rem 0.75rem;
            border-radius: 6px;
            border: 1px solid #FEE2E2;
          }
          .admin-lock-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 0.8rem;
            font-weight: 700;
            font-size: 0.9rem;
            border-radius: 8px;
          }
          .admin-lock-footer {
            margin-top: 1.5rem;
            text-align: center;
            padding-top: 1.25rem;
            border-top: 1px solid #F4F4F5;
          }
          .btn-return-store-link {
            font-size: 0.82rem;
            font-weight: 600;
            color: #52525B;
            text-decoration: none;
          }
          .btn-return-store-link:hover {
            color: #18181B;
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

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
            <img src="/logo.png" alt="Suplementos Top" className="admin-logo-img" />
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
          <button 
            type="button" 
            onClick={handleLogout} 
            className="btn-admin-logout"
            title="Bloquear panel por seguridad"
          >
            <LogOut size={15} />
            <span>Cerrar Sesión / Bloquear</span>
          </button>
          <Link to="/" className="btn-return-store">
            <Store size={16} />
            <span>Volver a la Tienda</span>
          </Link>
          <div className="admin-store-tag">
            <MapPin size={12} className="text-accent" />
            <span>Uriburu 1163, CABA</span>
          </div>
          <div className="admin-sidebar-author">
            <span className="admin-author-sub">Desarrollado por</span>
            <a 
              href="https://agustinpollan.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="admin-author-link"
              title="Portafolio de Agustín Pollán"
            >
              Agustín Pollán ↗
            </a>
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
              href="https://wa.me/5491165652990" 
              target="_blank" 
              rel="noopener noreferrer"
              className="admin-wa-pill"
              title="WhatsApp de atención"
            >
              <Send size={14} />
              <span className="hide-on-mobile">WhatsApp Tienda: 11 6565-2990</span>
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
        .admin-logo-img {
          height: 44px;
          width: auto;
          object-fit: contain;
          display: block;
          flex-shrink: 0;
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
        .btn-admin-logout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #F87171;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.55rem 0.85rem;
          border-radius: var(--radius-sm, 6px);
          border: 1px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.08);
          cursor: pointer;
          transition: background 0.15s ease;
          width: 100%;
          margin-bottom: 0.35rem;
        }
        .btn-admin-logout:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #FCA5A5;
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
        .admin-sidebar-author {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .admin-author-sub {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
          font-weight: 700;
        }
        .admin-author-link {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-accent, #3B82F6);
          text-decoration: none;
          transition: all 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .admin-author-link:hover {
          color: #FFFFFF;
          text-decoration: underline;
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
