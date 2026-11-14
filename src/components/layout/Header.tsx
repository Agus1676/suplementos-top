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
  Zap,
  MapPin
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
      {/* Top Corporate Promo Bar */}
      <div className="top-promo-bar">
        <div className="container promo-inner">
          <div className="promo-text-item">
            <span>💳 <strong>3 CUOTAS SIN INTERÉS</strong> con Mercado Pago en toda la tienda</span>
          </div>
          <div className="promo-text-item hidden-mobile">
            <MapPin size={13} className="text-red" />
            <span>Retiro gratis en Recoleta: <strong>Uriburu 1163, CABA</strong> (Lun a Vie 8 a 23hs)</span>
          </div>
          <div className="promo-links">
            <a 
              href="https://wa.me/5491165651990" 
              target="_blank" 
              rel="noopener noreferrer"
              className="top-wa-link"
            >
              <Phone size={12} />
              <span>WhatsApp: 11 6565 1990</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="main-navbar">
        <div className="container main-navbar-inner">
          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Clean Corporate Brand Logo */}
          <Link to="/" className="brand-logo-container">
            <img 
              src="/logo.jpg" 
              alt="Suplementos Top Logo" 
              className="brand-logo-img"
            />
            <div className="brand-text-block">
              <span className="brand-main-title">SUPLEMENTOS <span className="text-red">TOP</span></span>
              <span className="brand-sub-tag">NUTRICIÓN & RENDIMIENTO</span>
            </div>
          </Link>

          {/* Search Bar (Clean ENA Sport style) */}
          <form className="desktop-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar proteínas, creatina, pre-entreno, vitaminas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" aria-label="Buscar">
              <Search size={18} />
            </button>
          </form>

          {/* Action Links */}
          <div className="header-actions">
            <Link to="/seguimiento" className="action-link hidden-mobile">
              <ShieldCheck size={18} />
              <span>Seguimiento</span>
            </Link>

            <Link to="/admin" className="admin-link hidden-mobile" title="Panel Administrador">
              <LayoutDashboard size={16} />
              <span>Admin</span>
            </Link>

            {/* Shopping Cart Button */}
            <button 
              onClick={openCartDrawer} 
              className="cart-trigger-btn" 
              aria-label="Ver carrito"
            >
              <div className="cart-icon-wrap">
                <ShoppingBag size={24} />
                {totalItemsCount > 0 && (
                  <span className="cart-badge">{totalItemsCount}</span>
                )}
              </div>
              <div className="cart-label-block hidden-mobile">
                <span className="cart-title">Mi Carrito</span>
                <span className="cart-sub">{totalItemsCount} producto(s)</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Clean Categories Nav (like enasport.com) */}
      <nav className="categories-nav hidden-mobile">
        <div className="container categories-nav-inner">
          <div 
            className="nav-dropdown-wrap"
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button className="nav-dropdown-btn">
              <Zap size={15} className="text-red" />
              <span>CATEGORÍAS</span>
              <ChevronDown size={14} />
            </button>
            {categoriesOpen && (
              <div className="nav-dropdown-menu">
                <Link to="/catalogo" className="nav-dropdown-item font-bold text-red">
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

          <Link to="/catalogo" className="nav-link">TODOS LOS PRODUCTOS</Link>
          <Link to="/catalogo?categoria=proteinas" className="nav-link">PROTEÍNAS WHEY</Link>
          <Link to="/catalogo?categoria=creatinas" className="nav-link">CREATINAS</Link>
          <Link to="/catalogo?categoria=pre-entrenos" className="nav-link">PRE-ENTRENO</Link>
          <Link to="/catalogo?categoria=aminoacidos" className="nav-link">AMINOÁCIDOS & BCAA</Link>
          <Link to="/catalogo?categoria=salud-vitaminas" className="nav-link">SALUD & VITAMINAS</Link>
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
                <span className="font-bold text-lg">SUPLEMENTOS TOP</span>
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
              <Link to="/catalogo" onClick={() => setMobileMenuOpen(false)} className="mobile-link text-red font-bold">
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
              <hr className="my-2 border-gray-200" />
              <Link to="/seguimiento" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                📦 Seguimiento de Pedido
              </Link>
              <Link to="/envios" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                📍 Retiro en Recoleta (Uriburu 1163)
              </Link>
              <Link to="/contacto" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
                💬 WhatsApp Oficial (11 6565 1990)
              </Link>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-link text-gray-700">
                ⚙️ Panel Administrador
              </Link>
            </div>

            <div className="mobile-drawer-footer">
              <p className="text-xs text-gray-500"><strong>Uriburu 1163, Recoleta CABA</strong></p>
              <p className="text-xs text-gray-500">Lun a Vie 8 a 23hs | Sáb 10 a 18hs</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .header-root {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }
        /* Top Promo Bar (Black ENA Style) */
        .top-promo-bar {
          background-color: #111827;
          color: #F3F4F6;
          font-size: 0.775rem;
          padding: 0.4rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .promo-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .promo-text-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .text-red {
          color: var(--color-brand-red);
        }
        .top-wa-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #9CA3AF;
          font-weight: 500;
          transition: color 0.15s;
        }
        .top-wa-link:hover {
          color: #FFFFFF;
        }
        /* Main Navbar */
        .main-navbar {
          padding: 0.85rem 0;
          border-bottom: 1px solid var(--color-border);
          background: #FFFFFF;
        }
        .main-navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .brand-logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .brand-logo-img {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          border: 1px solid var(--color-border);
        }
        .brand-text-block {
          display: flex;
          flex-direction: column;
        }
        .brand-main-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.45rem;
          letter-spacing: -0.03em;
          color: #111827;
          line-height: 1;
        }
        .brand-sub-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #6B7280;
          margin-top: 0.15rem;
        }
        /* Desktop Search */
        .desktop-search {
          display: none;
          position: relative;
          flex: 1;
          max-width: 540px;
        }
        @media (min-width: 900px) {
          .desktop-search {
            display: flex;
          }
        }
        .search-input {
          width: 100%;
          padding: 0.7rem 3.5rem 0.7rem 1.15rem;
          background: #F9FAFB;
          border: 1.5px solid #E5E7EB;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          color: #111827;
          outline: none;
          transition: all 0.2s;
        }
        .search-input:focus {
          background: #FFFFFF;
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
        }
        .search-btn {
          position: absolute;
          right: 0.4rem;
          top: 50%;
          transform: translateY(-50%);
          background: #111827;
          color: #FFFFFF;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
        }
        .search-btn:hover {
          background: #000000;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .action-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
        }
        .action-link:hover {
          color: var(--color-brand-red);
        }
        .admin-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #4B5563;
          background: #F3F4F6;
          padding: 0.35rem 0.65rem;
          border-radius: var(--radius-sm);
        }
        .admin-link:hover {
          background: #E5E7EB;
          color: #111827;
        }
        .cart-trigger-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #111827;
          padding: 0.2rem;
        }
        .cart-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .cart-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: var(--color-brand-red);
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-label-block {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .cart-title {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.1;
        }
        .cart-sub {
          font-size: 0.725rem;
          color: #6B7280;
        }
        .mobile-toggle {
          color: #111827;
        }
        @media (min-width: 900px) {
          .mobile-toggle {
            display: none;
          }
        }
        /* Categories Nav Bar */
        .categories-nav {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
        }
        .categories-nav-inner {
          display: flex;
          align-items: center;
          gap: 1.75rem;
          padding: 0.6rem 0;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .nav-link {
          color: #374151;
          transition: color 0.15s;
        }
        .nav-link:hover {
          color: var(--color-brand-red);
        }
        .nav-link.highlight {
          color: var(--color-brand-red);
        }
        .nav-dropdown-wrap {
          position: relative;
        }
        .nav-dropdown-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 800;
          color: #111827;
        }
        .nav-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 240px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          z-index: 100;
        }
        .nav-dropdown-item {
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          color: #374151;
          font-size: 0.85rem;
          transition: background 0.15s;
        }
        .nav-dropdown-item:hover {
          background: #F3F4F6;
          color: var(--color-brand-red);
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
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          z-index: 1000;
          display: flex;
        }
        .mobile-drawer {
          width: 82%;
          max-width: 320px;
          background: #FFFFFF;
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          box-shadow: var(--shadow-lg);
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
          padding: 0.65rem 2.4rem 0.65rem 0.85rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .mobile-search-form button {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6B7280;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
          overflow-y: auto;
          font-size: 0.95rem;
        }
        .mobile-link {
          color: #111827;
          padding: 0.35rem 0;
        }
        .mobile-link-sub {
          padding-left: 0.75rem;
          font-size: 0.85rem;
          color: #4B5563;
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
