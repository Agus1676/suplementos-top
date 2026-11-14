import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  ShieldCheck, 
  ChevronDown, 
  LayoutDashboard, 
  Zap 
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
      {/* Infinite Athletic Announcement Bar */}
      <div className="ticker-bar">
        <div className="ticker-track">
          <div className="ticker-content">
            <span>🔥 ENVÍO GRATIS EN COMPRAS MAYORES A $85.000</span>
            <span className="ticker-dot">•</span>
            <span>📍 RETIRO HOY MISMO EN RECOLETA: URIBURU 1163, CABA</span>
            <span className="ticker-dot">•</span>
            <span>💳 HASTA 3 CUOTAS SIN INTERÉS CON MERCADO PAGO</span>
            <span className="ticker-dot">•</span>
            <span>⚡ WHATSAPP OFICIAL: 11 6565 1990</span>
            <span className="ticker-dot">•</span>
            <span>🏆 100% SUPLEMENTACIÓN DE ALTO RENDIMIENTO CON MATERIAS PRIMAS IMPORTADAS</span>
            <span className="ticker-dot">•</span>
          </div>
          <div className="ticker-content" aria-hidden="true">
            <span>🔥 ENVÍO GRATIS EN COMPRAS MAYORES A $85.000</span>
            <span className="ticker-dot">•</span>
            <span>📍 RETIRO HOY MISMO EN RECOLETA: URIBURU 1163, CABA</span>
            <span className="ticker-dot">•</span>
            <span>💳 HASTA 3 CUOTAS SIN INTERÉS CON MERCADO PAGO</span>
            <span className="ticker-dot">•</span>
            <span>⚡ WHATSAPP OFICIAL: 11 6565 1990</span>
            <span className="ticker-dot">•</span>
            <span>🏆 100% SUPLEMENTACIÓN DE ALTO RENDIMIENTO CON MATERIAS PRIMAS IMPORTADAS</span>
            <span className="ticker-dot">•</span>
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
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Real Brand Logo with Emblem */}
          <Link to="/" className="brand-logo-container">
            <div className="logo-badge-wrap">
              <img 
                src="/logo.jpg" 
                alt="Suplementos Top Logo" 
                className="brand-logo-img"
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-main-title">SUPLEMENTOS <span className="text-gold">TOP</span></span>
              <span className="brand-sub-tag">PERFORMANCE & NUTRITION</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form className="desktop-search" onSubmit={handleSearch}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar proteínas CFM, creatina Creapure®, pre-entrenos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              Buscar
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            <a 
              href="https://wa.me/5491165651990?text=Hola%20Suplementos%20Top,%20quiero%20hacer%20una%20consulta"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-nav-pill hidden-mobile"
            >
              <Phone size={14} className="text-gold" />
              <span>11 6565 1990</span>
            </a>

            <Link to="/seguimiento" className="action-link hidden-mobile">
              <ShieldCheck size={18} className="text-gold" />
              <span>Seguimiento</span>
            </Link>

            <Link to="/admin" className="admin-pill hidden-mobile" title="Panel Administrador">
              <LayoutDashboard size={15} />
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
              <span className="cart-label hidden-mobile">CARRITO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Navigation Bar */}
      <nav className="categories-nav hidden-mobile">
        <div className="container categories-nav-inner">
          <div 
            className="nav-dropdown-wrap"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="nav-dropdown-btn">
              <Zap size={14} className="text-gold" />
              <span>CATEGORÍAS</span>
              <ChevronDown size={14} />
            </button>
            {categoriesOpen && (
              <div className="nav-dropdown-menu">
                <Link to="/catalogo" className="nav-dropdown-item font-bold text-gold">
                  ⚡ VER TODO EL CATÁLOGO
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    to={`/catalogo?categoria=${cat.slug}`} 
                    className="nav-dropdown-item"
                  >
                    {cat.name.toUpperCase()}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/catalogo" className="nav-link">TODOS LOS PRODUCTOS</Link>
          <Link to="/catalogo?categoria=proteinas" className="nav-link">PROTEÍNAS ISOLATE</Link>
          <Link to="/catalogo?categoria=creatinas" className="nav-link">CREATINAS CREAPURE®</Link>
          <Link to="/catalogo?categoria=pre-entrenos" className="nav-link">PRE-WORKOUTS</Link>
          <Link to="/catalogo?categoria=aminoacidos" className="nav-link">AMINOÁCIDOS & BCAA</Link>
          <Link to="/envios" className="nav-link highlight">📍 RETIRO EN RECOLETA</Link>
          <Link to="/contacto" className="nav-link">CONTACTO</Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="flex items-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded" />
                <span className="font-display font-bold text-lg text-gold">SUPLEMENTOS TOP</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)}><X size={24} /></button>
            </div>

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
              <Link to="/catalogo" onClick={() => setMobileMenuOpen(false)} className="mobile-link text-gold">
                ⚡ CATÁLOGO COMPLETO
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
              <hr className="my-3 border-slate-800" />
              <Link to="/seguimiento" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                📦 Seguimiento de Pedido
              </Link>
              <Link to="/envios" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                📍 Retiro en Recoleta (Uriburu 1163)
              </Link>
              <Link to="/contacto" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                💬 WhatsApp: 11 6565 1990
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-link text-gold font-bold">
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
          z-index: 100;
          background: rgba(7, 9, 14, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--color-border);
        }
        /* Marquee Ticker */
        .ticker-bar {
          background: #000000;
          border-bottom: 1px solid rgba(229, 184, 105, 0.2);
          overflow: hidden;
          white-space: nowrap;
          padding: 0.35rem 0;
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #E2E8F0;
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerScroll 25s linear infinite;
        }
        .ticker-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-right: 1.5rem;
        }
        .ticker-dot {
          color: var(--color-accent);
          font-size: 1.1rem;
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .main-navbar {
          padding: 0.65rem 0;
          border-bottom: 1px solid var(--color-border);
        }
        .main-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .brand-logo-container {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
        }
        .logo-badge-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1.5px solid var(--color-accent);
          box-shadow: 0 0 15px var(--color-accent-glow);
          background: #000;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .brand-logo-container:hover .logo-badge-wrap {
          transform: scale(1.05);
        }
        .brand-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
        }
        .brand-main-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.55rem;
          letter-spacing: 0.04em;
          color: #FFFFFF;
          line-height: 1;
        }
        .brand-sub-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--color-text-muted);
          margin-top: 0.15rem;
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
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-subtle);
        }
        .search-input {
          width: 100%;
          padding: 0.65rem 6rem 0.65rem 2.6rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: #FFF;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 2px var(--color-accent-glow);
        }
        .search-btn {
          position: absolute;
          right: 0.35rem;
          top: 50%;
          transform: translateY(-50%);
          background: var(--color-accent);
          color: #07090E;
          font-family: var(--font-display);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          transition: background 0.15s;
        }
        .search-btn:hover {
          background: var(--color-accent-hover);
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.15rem;
        }
        .wa-nav-pill {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          background: rgba(229, 184, 105, 0.1);
          border: 1px solid rgba(229, 184, 105, 0.3);
          color: #FFFFFF;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.825rem;
          font-weight: 700;
        }
        .action-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-muted);
          font-family: var(--font-display);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .action-link:hover {
          color: var(--color-accent);
        }
        .admin-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: #182032;
          color: var(--color-accent);
          border: 1px solid var(--color-border-gold);
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
        .cart-trigger {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #F3C77D 0%, #E5B869 100%);
          color: #07090E;
          padding: 0.55rem 1.15rem;
          border-radius: var(--radius-full);
          box-shadow: 0 4px 15px rgba(229, 184, 105, 0.3);
          transition: all 0.2s;
        }
        .cart-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(229, 184, 105, 0.45);
        }
        .cart-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .cart-badge {
          position: absolute;
          top: -9px;
          right: -10px;
          background: #07090E;
          color: var(--color-accent);
          border: 1px solid var(--color-accent);
          font-weight: 900;
          font-size: 0.725rem;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-label {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .mobile-toggle {
          color: #FFFFFF;
        }
        @media (min-width: 900px) {
          .mobile-toggle {
            display: none;
          }
        }
        .categories-nav {
          background: #0B0E16;
          border-bottom: 1px solid var(--color-border);
        }
        .categories-nav-inner {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          padding: 0.5rem 0;
          font-family: var(--font-display);
          font-size: 0.95rem;
          letter-spacing: 0.05em;
        }
        .nav-link {
          color: var(--color-text-muted);
          transition: color 0.15s;
        }
        .nav-link:hover {
          color: var(--color-accent);
        }
        .nav-link.highlight {
          color: var(--color-accent);
          font-weight: 700;
        }
        .nav-dropdown-wrap {
          position: relative;
        }
        .nav-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          color: #FFFFFF;
        }
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 240px;
          background: #0D111A;
          border: 1px solid var(--color-border-gold);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          z-index: 100;
        }
        .nav-dropdown-item {
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          color: #E2E8F0;
          font-size: 0.9rem;
          transition: background 0.15s;
        }
        .nav-dropdown-item:hover {
          background: #182032;
          color: var(--color-accent);
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
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
        }
        .mobile-drawer {
          width: 85%;
          max-width: 320px;
          background: #0D111A;
          border-right: 1px solid var(--color-border);
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
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
          margin: 1.25rem 0;
          position: relative;
        }
        .mobile-search-form input {
          width: 100%;
          padding: 0.7rem 2.4rem 0.7rem 0.85rem;
          background: #07090E;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: #FFF;
          font-size: 0.9rem;
        }
        .mobile-search-form button {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-accent);
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
          overflow-y: auto;
          font-family: var(--font-display);
          font-size: 1.1rem;
        }
        .mobile-link {
          color: #FFF;
          padding: 0.4rem 0;
        }
        .mobile-link-sub {
          padding-left: 1rem;
          font-size: 0.95rem;
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
