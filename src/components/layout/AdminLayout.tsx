import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Archive,
  BarChart2,
  Settings, 
  Store, 
  MapPin, 
  Send,
  Menu,
  X,
  Lock,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ADMIN_MASTER_KEY = 'suplementos2026';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { orders, products } = useStore();
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

  // Badges calculation
  const pendingOrdersCount = orders.filter(
    (o) => o.fulfillmentStatus === 'preparing' || o.fulfillmentStatus === 'unfulfilled'
  ).length;

  const lowStockCount = products.filter((p) => {
    const total = p.variants?.length
      ? p.variants.reduce((acc: number, f) => acc + (f.stock || 0), 0)
      : 0;
    return total <= 5;
  }).length;

  // Lock Screen (Jokers UI / Tienda May clean aesthetic)
  if (!isAuthenticated) {
    return (
      <div className="admin-lock-screen">
        <div className="admin-lock-card">
          <div className="admin-lock-header">
            <div className="admin-lock-icon-wrap">
              <ShieldCheck size={28} />
            </div>
            <h1 className="admin-lock-title">Panel Administrador</h1>
            <p className="admin-lock-subtitle">Suplementos Top • Recoleta, CABA</p>
            <p className="admin-lock-desc">
              Ingresá la clave de acceso de la tienda para gestionar catálogo, stock, facturación y pedidos.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="admin-lock-form">
            <div className="admin-lock-input-wrap">
              <Lock size={17} className="lock-icon" />
              <input
                type="password"
                placeholder="Contraseña de administrador"
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
              className="admin-lock-submit-btn"
            >
              <span>Ingresar al Panel</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="admin-lock-footer">
            <Link to="/" className="admin-lock-back-link">
              ← Volver a la Tienda Pública
            </Link>
            <p className="admin-lock-footnote">
              Acceso administrativo exclusivo • Pres. José E. Uriburu 1163
            </p>
          </div>
        </div>

        <style>{`
          .admin-lock-screen {
            min-height: 100vh;
            background: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          .admin-lock-card {
            max-width: 420px;
            width: 100%;
            background: #FFFFFF;
            border: 1px solid #E2E8F0;
            border-radius: 16px;
            padding: 36px 30px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          }
          .admin-lock-icon-wrap {
            width: 54px;
            height: 54px;
            border-radius: 12px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
            color: #0F172A;
          }
          .admin-lock-title {
            font-size: 1.45rem;
            font-weight: 800;
            color: #0F172A;
            margin: 0 0 4px 0;
            letter-spacing: -0.02em;
          }
          .admin-lock-subtitle {
            font-size: 0.85rem;
            font-weight: 600;
            color: #E63946;
            margin: 0 0 12px 0;
          }
          .admin-lock-desc {
            font-size: 0.88rem;
            color: #64748B;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }
          .admin-lock-form {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .admin-lock-input-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }
          .admin-lock-input-wrap .lock-icon {
            position: absolute;
            left: 14px;
            color: #94A3B8;
            pointer-events: none;
          }
          .admin-lock-input {
            width: 100%;
            height: 44px;
            padding: 0 14px 0 42px;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            font-size: 0.92rem;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          .admin-lock-input:focus {
            border-color: #0F172A;
            box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
          }
          .admin-lock-error {
            background: #FEE2E2;
            border: 1px solid #FCA5A5;
            color: #B91C1C;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.82rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            text-align: left;
          }
          .admin-lock-submit-btn {
            height: 44px;
            background: #0F172A;
            color: #FFFFFF;
            border: none;
            border-radius: 8px;
            font-size: 0.92rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: background 0.15s ease;
          }
          .admin-lock-submit-btn:hover:not(:disabled) {
            background: #1E293B;
          }
          .admin-lock-submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .admin-lock-footer {
            margin-top: 24px;
            padding-top: 18px;
            border-top: 1px solid #F1F5F9;
          }
          .admin-lock-back-link {
            font-size: 0.84rem;
            font-weight: 600;
            color: #64748B;
            text-decoration: none;
            transition: color 0.15s ease;
          }
          .admin-lock-back-link:hover {
            color: #0F172A;
            text-decoration: underline;
          }
          .admin-lock-footnote {
            font-size: 0.75rem;
            color: #94A3B8;
            margin: 12px 0 0 0;
          }
        `}</style>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="admin">
      {/* Mobile Top Header */}
      <header className="admin__mobile-header">
        <button
          type="button"
          className="admin__mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          <Menu size={22} />
        </button>
        <div className="admin__mobile-brand">
          <span className="admin__mobile-title">Suplementos Top</span>
          <span className="admin__mobile-subtitle">Admin Panel</span>
        </div>
        <button
          type="button"
          className="admin__mobile-logout-btn"
          onClick={handleLogout}
          title="Cerrar Sesión"
          aria-label="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </header>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="admin__overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar matching Jokers UI / Tienda May 100% */}
      <aside className={`admin__sidebar ${sidebarOpen ? 'admin__sidebar--open' : ''}`}>
        <div className="admin__sidebar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/admin" className="admin__brand-link">
              <div className="admin__brand-avatar">
                <Package size={20} />
              </div>
              <div className="admin__brand-text">
                <h3>Suplementos Top</h3>
                <span className="admin__badge-tag">ADMIN PANEL</span>
              </div>
            </Link>
            <button
              type="button"
              className="admin__sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="admin__nav">
          <Link
            to="/admin"
            className={`admin__nav-item ${isActive('/admin') ? 'admin__nav-item--active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/pedidos"
            className={`admin__nav-item ${isActive('/admin/pedidos') ? 'admin__nav-item--active' : ''}`}
          >
            <ShoppingBag size={18} />
            <span>Pedidos</span>
            {pendingOrdersCount > 0 && (
              <span className="admin__nav-badge admin__nav-badge--danger">{pendingOrdersCount}</span>
            )}
          </Link>

          <Link
            to="/admin/productos"
            className={`admin__nav-item ${isActive('/admin/productos') ? 'admin__nav-item--active' : ''}`}
          >
            <Package size={18} />
            <span>Productos &amp; Catálogo</span>
            <span className="admin__nav-badge">{products.length}</span>
          </Link>

          <Link
            to="/admin/stock"
            className={`admin__nav-item ${isActive('/admin/stock') ? 'admin__nav-item--active' : ''}`}
          >
            <Archive size={18} />
            <span>Control de Stock</span>
            {lowStockCount > 0 && (
              <span className="admin__nav-badge admin__nav-badge--warning">{lowStockCount}</span>
            )}
          </Link>

          <Link
            to="/admin/reportes"
            className={`admin__nav-item ${isActive('/admin/reportes') ? 'admin__nav-item--active' : ''}`}
          >
            <BarChart2 size={18} />
            <span>Reportes de Ventas</span>
          </Link>

          <Link
            to="/admin/configuracion"
            className={`admin__nav-item ${isActive('/admin/configuracion') ? 'admin__nav-item--active' : ''}`}
          >
            <Settings size={18} />
            <span>Configuración</span>
          </Link>
        </nav>

        {/* Sidebar Footer matching Jokers / Tienda May */}
        <div className="admin__sidebar-footer">
          <a
            href="https://wa.me/5491165652990"
            target="_blank"
            rel="noopener noreferrer"
            className="admin__btn-wa-shortcut"
            title="WhatsApp de atención"
          >
            <Send size={14} />
            <span>WhatsApp: 11 6565-2990</span>
          </a>

          <Link to="/" className="admin__btn-store-link">
            <Store size={15} />
            <span>Volver a la Tienda</span>
          </Link>

          <div className="admin__location-pill">
            <MapPin size={13} className="text-accent" />
            <span>Pres. José E. Uriburu 1163, CABA</span>
          </div>

          <div className="admin__footer-credits">
            <p className="admin-footer-credit">
              Desarrollado por{' '}
              <a
                href="https://agustinpollan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agustín Pollán ↗
              </a>
            </p>
            <button
              type="button"
              className="admin__logout-btn"
              onClick={handleLogout}
              title="Cerrar sesión"
            >
              <LogOut size={14} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin__main-container">
        {/* Desktop Top Header Bar */}
        <header className="admin__topbar">
          <div className="admin__topbar-left">
            <h1 className="admin__topbar-title">Panel de Gestión</h1>
            <span className="admin__topbar-dot">•</span>
            <span className="admin__topbar-store">Gimnasio Top Shape Recoleta</span>
          </div>

          <div className="admin__topbar-actions">
            <a
              href="https://wa.me/5491165652990"
              target="_blank"
              rel="noopener noreferrer"
              className="admin__topbar-wa-pill"
            >
              <Send size={13} />
              <span>WhatsApp: 11 6565-2990</span>
            </a>
            <div className="admin__topbar-avatar">
              <span className="avatar-dot" />
              <span>Admin Activo</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="admin__content">
          <Outlet />
        </main>
      </div>

      <style>{`
        /* ========================================================
           TIENDA MAY / JOKERS UI ENGINE - ADMIN STYLES FOR SUPLEMENTOS TOP
           Pure White & Slate Aesthetic • 100% Clean & Professional
           ======================================================== */
        :root {
          --admin-font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          --admin-bg: #FFFFFF;
          --admin-bg-subtle: #F8FAFC;
          --admin-bg-hover: #F1F5F9;
          --admin-border: #E2E8F0;
          --admin-border-subtle: #F1F5F9;
          --admin-text-main: #0F172A;
          --admin-text-secondary: #64748B;
          --admin-text-muted: #94A3B8;
        }

        .admin {
          display: flex;
          min-height: 100vh;
          position: relative;
          background-color: #FFFFFF;
          color: #0F172A;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* Mobile Header */
        .admin__mobile-header {
          display: none;
        }
        .admin__sidebar-close-btn {
          display: none;
        }

        /* Sidebar */
        .admin__sidebar {
          width: 250px;
          background: #FFFFFF;
          border-right: 1px solid #E2E8F0;
          padding: 24px 16px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          z-index: 50;
        }

        .admin__sidebar-header {
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #F1F5F9;
        }

        .admin__brand-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .admin__brand-avatar {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #0F172A;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admin__brand-text h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .admin__badge-tag {
          font-size: 0.68rem;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 0.05em;
        }

        .admin__nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .admin__nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          color: #475569;
          font-size: 0.92rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .admin__nav-item:hover {
          background: #F8FAFC;
          color: #0F172A;
        }

        .admin__nav-item--active {
          background: #F1F5F9 !important;
          color: #0F172A !important;
          font-weight: 700 !important;
        }

        .admin__nav-badge {
          margin-left: auto;
          font-size: 0.74rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          background: #0F172A;
          color: #FFFFFF;
          min-width: 20px;
          text-align: center;
        }

        .admin__nav-badge--danger {
          background: #EF4444 !important;
          color: #FFFFFF !important;
        }

        .admin__nav-badge--warning {
          background: #FEF3C7 !important;
          color: #B45309 !important;
        }

        /* Sidebar Footer */
        .admin__sidebar-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #F1F5F9;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin__btn-wa-shortcut {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          color: #166534;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .admin__btn-wa-shortcut:hover {
          background: #DCFCE7;
        }

        .admin__btn-store-link {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #334155;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .admin__btn-store-link:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .admin__location-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #64748B;
          padding: 4px 6px;
        }

        .admin__footer-credits {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px dashed #E2E8F0;
        }

        .admin-footer-credit {
          font-size: 0.78rem;
          color: #94A3B8;
          margin: 0;
          line-height: 1.4;
        }
        .admin-footer-credit a {
          color: #0F172A;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .admin-footer-credit a:hover {
          color: #E63946;
          text-decoration: underline;
        }

        .admin__logout-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: 1px solid #F1F5F9;
          color: #94A3B8;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
        }
        .admin__logout-btn:hover {
          background: #FEE2E2;
          border-color: #FECACA;
          color: #DC2626;
        }

        /* Main Container & Topbar */
        .admin__main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: #FFFFFF;
        }

        .admin__topbar {
          height: 64px;
          border-bottom: 1px solid #E2E8F0;
          background: #FFFFFF;
          padding: 0 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .admin__topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin__topbar-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .admin__topbar-dot {
          color: #CBD5E1;
          font-size: 0.8rem;
        }
        .admin__topbar-store {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748B;
        }

        .admin__topbar-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin__topbar-wa-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          color: #166534;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .admin__topbar-wa-pill:hover {
          background: #DCFCE7;
        }

        .admin__topbar-avatar {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #0F172A;
        }
        .avatar-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16A34A;
        }

        .admin__content {
          flex: 1;
          padding: 32px;
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 900px) {
          .admin {
            flex-direction: column;
          }

          .admin__topbar {
            display: none;
          }

          .admin__mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            padding: 0 16px;
            background: #FFFFFF;
            border-bottom: 1px solid #E2E8F0;
            position: sticky;
            top: 0;
            z-index: 40;
          }

          .admin__mobile-menu-btn,
          .admin__mobile-logout-btn {
            background: none;
            border: none;
            padding: 8px;
            color: #0F172A;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .admin__mobile-brand {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .admin__mobile-title {
            font-size: 0.95rem;
            font-weight: 800;
            color: #0F172A;
          }
          .admin__mobile-subtitle {
            font-size: 0.68rem;
            font-weight: 700;
            color: #E63946;
            letter-spacing: 0.05em;
          }

          .admin__overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(3px);
            z-index: 55;
          }

          .admin__sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            height: 100vh;
            background: #FFFFFF;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 60;
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
          }

          .admin__sidebar--open {
            transform: translateX(0);
          }

          .admin__sidebar-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: none;
            border: none;
            padding: 6px;
            color: #64748B;
            cursor: pointer;
          }

          .admin__content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};
export default AdminLayout;
