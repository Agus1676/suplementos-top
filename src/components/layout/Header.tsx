import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const { totalItemsCount, openCartDrawer } = useCart();
  const { categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="header-root">
      {/* Top Banner Bar */}
      <div className="top-banner">
        <div className="container top-banner-content">
          <div className="top-banner-item">
            <MapPin size={13} className="text-accent" />
            <span>Retiro en Recoleta: <strong>Uriburu 1163, CABA</strong></span>
          </div>
          <div className="top-banner-item hidden-mobile">
            <Clock size={13} className="text-accent" />
            <span>Lun a Vie 8 a 23hs | Sáb 10 a 18hs</span>
          </div>
          <div className="top-banner-right">
            <a 
              href="https://wa.me/5491165651990?text=Hola%20Suplementos%20Top,%20quiero%20hacer%20una%20consulta"
              target="_blank" 
              rel="noopener noreferrer" 
              className="top-banner-link"
            >
              <Phone size={13} />
              <span>WhatsApp: 11 6565 1990</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-navbar">
        <div className="container main-navbar-inner">
          {/* Mobile Menu Button */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="brand-logo">
            <span className="brand-logo-badge">TOP</span>
            <div className="brand-logo-text">
              <span className="brand-title">SUPLEMENTOS</span>
              <span className="brand-sub">NUTRITION & PERFORMANCE</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form className="desktop-search" onSubmit={handleSearch}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar proteínas, creatinas, pre-entrenos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Buscar
            </button>
          </form>

          {/* Actions & Utilities */}
          <div className="header-actions">
            <Link to="/seguimiento" className="action-link hidden-mobile">
              <ShieldCheck size={18} />
              <span>Seguimiento</span>
            </Link>

            <Link to="/admin" className="action-link-admin hidden-mobile" title="Panel de Administración">
              <LayoutDashboard size={18} />
              <span>Admin</span>
            </Link>

            {/* Cart Trigger */}
            <button 
              onClick={openCartDrawer} 
              className="cart-trigger" 
              aria-label="Ver carrito"
            >
              <div className="cart-icon-wrap">
                <ShoppingBag size={22} />
                {totalItemsCount > 0 && (
                  <span className="cart-badge">{totalItemsCount}</span>
                )}
              </div>
              <span className="cart-label hidden-mobile">Carrito</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Desktop Categories Navigation */}
      <nav className="categories-nav hidden-mobile">
        <div className="container categories-nav-inner">
          <div 
            className="nav-dropdown-wrap"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="nav-dropdown-btn">
              <span>Categorías</span>
              <ChevronDown size={14} />
            </button>
            {categoriesOpen && (
              <div className="nav-dropdown-menu">
                <Link to="/catalogo" className="nav-dropdown-item font-bold">
                  Ver Todo el Catálogo
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/catalogo?categoria=${cat.slug}`} 
                    className="nav-dropdown-item"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/catalogo" className="nav-link">Catálogo Completo</Link>
          <Link to="/catalogo?categoria=proteinas" className="nav-link">Proteínas</Link>
          <Link to="/catalogo?categoria=creatinas" className="nav-link">Creatinas Creapure</Link>
          <Link to="/catalogo?categoria=pre-entrenos" className="nav-link">Pre-Entrenos</Link>
          <Link to="/catalogo?categoria=aminoacidos" className="nav-link">Aminoácidos</Link>
          <Link to="/envios" className="nav-link highlight">Envíos & Retiro</Link>
          <Link to="/contacto" className="nav-link">Contacto</Link>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="font-bold">Menú de Navegación</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={22} /></button>
            </div>

            {/* Mobile Search */}
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Buscar suplementos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit"><Search size={18} /></button>
            </form>

            <div className="mobile-nav-links">
              <Link to="/catalogo" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                🔥 Catálogo Completo
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogo?categoria=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-link-sub"
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="my-2 border-slate-200" />
              <Link to="/seguimiento" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                📦 Seguimiento de Pedido
              </Link>
              <Link to="/envios" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                📍 Retiro en Local & Envíos
              </Link>
              <Link to="/contacto" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                💬 Contacto & WhatsApp
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-link text-accent">
                ⚙️ Panel Administrador
              </Link>
            </div>

            <div className="mobile-drawer-footer">
              <p className="text-xs text-muted"><strong>Uriburu 1163, Recoleta CABA</strong></p>
              <p className="text-xs text-muted">Lun a Vie 8 a 23hs | Sáb 10 a 18hs</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .header-root {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #FFFFFF;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07);
        }
        .top-banner {
          background-color: var(--color-primary);
          color: #E2E8F0;
          font-size: 0.775rem;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .top-banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .top-banner-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .top-banner-right {
          display: flex;
          gap: 1.25rem;
        }
        .top-banner-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-accent);
          font-weight: 600;
        }
        .top-banner-link:hover {
          text-decoration: underline;
        }
        .text-accent {
          color: var(--color-accent);
        }
        .main-navbar {
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .main-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
        }
        .brand-logo-badge {
          background: var(--color-primary);
          color: var(--color-accent);
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          letter-spacing: 0.05em;
          border: 1px solid var(--color-accent);
        }
        .brand-logo-text {
          display: flex;
          flex-direction: column;
        }
        .brand-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
          color: var(--color-primary);
          line-height: 1.1;
        }
        .brand-sub {
          font-size: 0.625rem;
          font-weight: 700;
          color: var(--color-text-muted);
          letter-spacing: 0.12em;
        }
        .desktop-search {
          display: none;
          position: relative;
          flex: 1;
          max-width: 480px;
        }
        @media (min-width: 900px) {
          .desktop-search {
            display: flex;
          }
        }
        .search-icon {
          position: absolute;
          left: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-subtle);
        }
        .search-input {
          width: 100%;
          padding: 0.65rem 5.5rem 0.65rem 2.5rem;
          background: var(--color-bg-muted);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus {
          background: #FFFFFF;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
        }
        .search-btn {
          position: absolute;
          right: 0.35rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--color-primary);
          color: #FFF;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-full);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .action-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-main);
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        .action-link:hover {
          background-color: var(--color-bg-muted);
        }
        .action-link-admin {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-primary);
          background: var(--color-accent-light);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .cart-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-primary);
          color: #FFFFFF;
          padding: 0.55rem 0.95rem;
          border-radius: var(--radius-full);
          transition: all 0.2s;
        }
        .cart-trigger:hover {
          background: var(--color-primary-light);
          transform: translateY(-1px);
        }
        .cart-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -10px;
          background: var(--color-accent);
          color: #0F172A;
          font-weight: 800;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        .cart-label {
          font-size: 0.875rem;
          font-weight: 700;
        }
        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
        }
        @media (min-width: 900px) {
          .mobile-toggle {
            display: none;
          }
        }
        .categories-nav {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
        }
        .categories-nav-inner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          padding-top: 0.4rem;
          padding-bottom: 0.4rem;
        }
        .nav-link {
          color: var(--color-text-muted);
          transition: color 0.15s;
          padding: 0.3rem 0;
        }
        .nav-link:hover {
          color: var(--color-primary);
        }
        .nav-link.highlight {
          color: var(--color-secondary);
        }
        .nav-dropdown-wrap {
          position: relative;
        }
        .nav-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 700;
          color: var(--color-primary);
          padding: 0.3rem 0;
        }
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 220px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          z-index: 100;
        }
        .nav-dropdown-item {
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          color: var(--color-text-main);
          font-size: 0.85rem;
        }
        .nav-dropdown-item:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-accent-hover);
        }
        .hidden-mobile {
          display: none;
        }
        @media (min-width: 900px) {
          .hidden-mobile {
            display: flex;
          }
        }
        /* Mobile Drawer */
        .mobile-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          z-index: 100;
          display: flex;
        }
        .mobile-drawer {
          width: 82%;
          max-width: 320px;
          background: #FFFFFF;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.25rem;
          box-shadow: var(--shadow-xl);
          animation: slideRight 0.2s ease-out;
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }
        .mobile-search-form {
          display: flex;
          margin: 1rem 0;
          position: relative;
        }
        .mobile-search-form input {
          width: 100%;
          padding: 0.6rem 2.2rem 0.6rem 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }
        .mobile-search-form button {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-subtle);
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          overflow-y: auto;
        }
        .mobile-link {
          font-weight: 700;
          font-size: 0.95rem;
          padding: 0.5rem 0;
          color: var(--color-primary);
        }
        .mobile-link-sub {
          padding-left: 1rem;
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .mobile-drawer-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }
      `}</style>
    </header>
  );
};
