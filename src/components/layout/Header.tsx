import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Truck, 
  CreditCard,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';

export const Header: React.FC = () => {
  const { totalItemsCount, subtotalInCents, openCartDrawer } = useCart();
  const { categories, products } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Announcement Bar Rotation
  const announcements = [
    { text: '3 Y 6 CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS Y MERCADO PAGO', icon: CreditCard },
    { text: 'ENVÍO GRATIS A TODO EL PAÍS EN COMPRAS SUPERIORES A $85.000', icon: Truck },
    { text: 'RETIRO GRATIS HOY EN RECOLETA (URIBURU 1163) — 8 A 23 HS', icon: MapPin },
    { text: 'WHATSAPP DIRECTO Y ASESORAMIENTO OFICIAL: 11 6565 1990', icon: Phone }
  ];
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [announcements.length]);

  // Click outside search listener to close results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for live predictive search
  const liveSearchResults = searchQuery.trim().length >= 2
    ? products.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const currentAnnouncement = announcements[currentAnnouncementIndex];
  const CurrentIcon = currentAnnouncement.icon;

  return (
    <header className="header-root">
      {/* 1. Top Commercial Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="container announcement-content">
          <div className="announcement-item">
            <CurrentIcon size={14} className="announcement-icon" />
            <span className="announcement-text">{currentAnnouncement.text}</span>
          </div>

          <div className="announcement-links-right">
            <a 
              href="https://wa.me/5491165651990" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="announcement-link"
            >
              <Phone size={12} />
              <span>WhatsApp: 11 6565 1990</span>
            </a>
            <span className="announcement-divider">•</span>
            <Link to="/seguimiento" className="announcement-link">
              <span>Seguimiento de Pedido</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header Bar (Brand, Live Search, Actions) */}
      <div className="main-header-bar">
        <div className="container header-grid">
          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo & Emblem */}
          <Link to="/" className="brand-logo-wrap">
            <div className="brand-logo-img-wrap">
              <img 
                src="/logo.jpg" 
                alt="Suplementos Top Logo" 
                className="brand-logo-img" 
              />
            </div>
            <div className="brand-text-block">
              <span className="brand-title">
                SUPLEMENTOS <span className="brand-title-accent">TOP</span>
              </span>
              <span className="brand-tagline">SPORT NUTRITION • CABA</span>
            </div>
          </Link>

          {/* Live Search Bar with Predictive Dropdown */}
          <div className="header-search-wrap" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <input
                type="text"
                placeholder="Buscar proteínas, creatinas, pre-entrenos, marcas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="search-input"
              />
              <button type="submit" className="search-submit-btn" aria-label="Buscar">
                <Search size={18} />
              </button>
            </form>

            {/* Predictive Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length >= 2 && (
              <div className="search-dropdown-results">
                {liveSearchResults.length > 0 ? (
                  <>
                    <div className="search-results-list">
                      {liveSearchResults.map((prod) => (
                        <Link
                          key={prod.id}
                          to={`/producto/${prod.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="search-result-item"
                        >
                          <img src={prod.images[0]?.url || '/logo.jpg'} alt={prod.name} className="search-result-thumb" />
                          <div className="search-result-info">
                            <span className="search-result-brand">{prod.brand}</span>
                            <span className="search-result-title">{prod.name}</span>
                            <span className="search-result-price">{formatARS(prod.basePriceInCents)}</span>
                          </div>
                          <ChevronRight size={16} className="search-result-arrow" />
                        </Link>
                      ))}
                    </div>
                    <button 
                      onClick={handleSearchSubmit} 
                      className="search-view-all-btn"
                    >
                      Ver todos los resultados para "{searchQuery}" →
                    </button>
                  </>
                ) : (
                  <div className="search-no-results">
                    No encontramos productos para "{searchQuery}". Intentá con otra búsqueda.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions (Location, Phone & Cart) */}
          <div className="header-actions">
            {/* Pickup Location Badge (Desktop) */}
            <Link to="/contacto" className="header-badge-link hide-mobile">
              <MapPin size={18} className="text-accent" />
              <div className="badge-text-wrap">
                <span className="badge-micro">LOCAL RECOLETA</span>
                <span className="badge-strong">Uriburu 1163</span>
              </div>
            </Link>

            {/* Cart Button with Count Badge and Subtotal */}
            <button 
              onClick={openCartDrawer} 
              className="header-cart-btn"
              aria-label="Abrir carrito"
            >
              <div className="cart-icon-wrap">
                <ShoppingBag size={22} />
                {totalItemsCount > 0 && (
                  <span className="cart-counter-pill">{totalItemsCount}</span>
                )}
              </div>
              <div className="cart-text-wrap hide-mobile">
                <span className="cart-micro">MI CARRITO</span>
                <span className="cart-amount">{formatARS(subtotalInCents)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Secondary Category Navigation Bar */}
      <nav className="category-nav-bar">
        <div className="container category-nav-container">
          <ul className="category-nav-list">
            <li>
              <Link to="/catalogo" className="nav-item-link">
                <span>TODOS LOS PRODUCTOS</span>
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=proteinas" className="nav-item-link">
                <span>PROTEÍNAS</span>
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=creatinas" className="nav-item-link">
                <span>CREATINAS</span>
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=pre-entrenos" className="nav-item-link">
                <span>PRE-ENTRENOS</span>
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=aminoacidos" className="nav-item-link">
                <span>AMINOÁCIDOS</span>
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=salud-vitaminas" className="nav-item-link">
                <span>SALUD & VITAMINAS</span>
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=combos" className="nav-item-link nav-highlight">
                <Flame size={14} className="nav-icon-flame" />
                <span>COMBOS & OFERTAS</span>
              </Link>
            </li>
            <li className="nav-spacer"></li>
            <li>
              <Link to="/contacto" className="nav-item-link nav-store-link">
                <MapPin size={14} />
                <span>RETIRO EN RECOLETA</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-title">MENÚ PRINCIPAL</span>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="close-drawer-btn"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-body">
              <ul className="mobile-nav-list">
                <li>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
                </li>
                <li>
                  <Link to="/catalogo" onClick={() => setMobileMenuOpen(false)}>Todos los Productos</Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      to={`/catalogo?categoria=${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
                <li className="divider-line"></li>
                <li>
                  <Link to="/seguimiento" onClick={() => setMobileMenuOpen(false)}>
                    Rastrear Mi Pedido
                  </Link>
                </li>
                <li>
                  <Link to="/envios" onClick={() => setMobileMenuOpen(false)}>
                    Envíos y Retiro en Local
                  </Link>
                </li>
                <li>
                  <Link to="/contacto" onClick={() => setMobileMenuOpen(false)}>
                    Contacto & Ubicación
                  </Link>
                </li>
                <li>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="admin-link">
                    Panel Administrador
                  </Link>
                </li>
              </ul>

              <div className="mobile-contact-box">
                <p className="mobile-contact-title">¿DUDAS CON TU COMPRA?</p>
                <p className="mobile-contact-desc">Atención de Lun a Vie de 8 a 23 hs</p>
                <a 
                  href="https://wa.me/5491165651990" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-block btn-sm mt-2"
                >
                  <Phone size={15} />
                  <span>WhatsApp: 11 6565 1990</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Component Styles */}
      <style>{`
        .header-root {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #FFFFFF;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
        }

        /* 1. Top Announcement Bar */
        .top-announcement-bar {
          background-color: var(--color-primary);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.45rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .announcement-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .announcement-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.3s ease;
        }
        .announcement-icon {
          color: var(--color-accent);
          flex-shrink: 0;
        }
        .announcement-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .announcement-links-right {
          display: none;
          align-items: center;
          gap: 0.75rem;
        }
        @media (min-width: 900px) {
          .announcement-links-right {
            display: flex;
          }
        }
        .announcement-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #E2E8F0;
          font-size: 0.72rem;
          font-weight: 600;
        }
        .announcement-link:hover {
          color: #FFFFFF;
        }
        .announcement-divider {
          color: #64748B;
        }

        /* 2. Main Header Bar */
        .main-header-bar {
          padding: 0.85rem 0;
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
        }
        .header-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
        }
        .mobile-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          color: var(--color-primary);
        }
        @media (min-width: 1024px) {
          .mobile-toggle-btn {
            display: none;
          }
        }

        /* Logo */
        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .brand-logo-img-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1.5px solid var(--color-primary);
          background: #000000;
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
        .brand-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.25rem;
          line-height: 1.1;
          color: var(--color-primary);
          letter-spacing: -0.02em;
        }
        .brand-title-accent {
          color: var(--color-accent);
        }
        .brand-tagline {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-text-muted);
        }

        /* Search Bar */
        .header-search-wrap {
          flex: 1;
          max-width: 580px;
          position: relative;
          display: none;
        }
        @media (min-width: 640px) {
          .header-search-wrap {
            display: block;
          }
        }
        .search-form {
          position: relative;
          width: 100%;
          display: flex;
        }
        .search-input {
          width: 100%;
          padding: 0.65rem 3rem 0.65rem 1rem;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          background: var(--color-bg-secondary);
          color: var(--color-text-main);
          transition: all var(--transition-fast);
        }
        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
        }
        .search-submit-btn {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }
        .search-submit-btn:hover {
          background: var(--color-primary-hover);
        }

        /* Search Dropdown */
        .search-dropdown-results {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          z-index: 100;
        }
        .search-results-list {
          max-height: 340px;
          overflow-y: auto;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.65rem 1rem;
          border-bottom: 1px solid var(--color-border);
          transition: background var(--transition-fast);
        }
        .search-result-item:hover {
          background: var(--color-bg-secondary);
        }
        .search-result-thumb {
          width: 44px;
          height: 44px;
          object-fit: contain;
          border-radius: var(--radius-xs);
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 2px;
        }
        .search-result-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .search-result-brand {
          font-size: 0.68rem;
          font-weight: 800;
          color: var(--color-accent);
          text-transform: uppercase;
        }
        .search-result-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.25;
        }
        .search-result-price {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-top: 0.15rem;
        }
        .search-result-arrow {
          color: var(--color-text-subtle);
        }
        .search-view-all-btn {
          width: 100%;
          padding: 0.75rem;
          background: var(--color-bg-secondary);
          color: var(--color-primary);
          font-size: 0.82rem;
          font-weight: 700;
          text-align: center;
          border-top: 1px solid var(--color-border);
        }
        .search-view-all-btn:hover {
          background: #E2E8F0;
        }
        .search-no-results {
          padding: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        /* Header Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .header-badge-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .badge-text-wrap {
          display: flex;
          flex-direction: column;
        }
        .badge-micro {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--color-text-muted);
          letter-spacing: 0.06em;
        }
        .badge-strong {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--color-text-main);
        }
        .header-cart-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }
        .header-cart-btn:hover {
          background: #E2E8F0;
          border-color: var(--color-border-hover);
        }
        .cart-icon-wrap {
          position: relative;
          color: var(--color-primary);
        }
        .cart-counter-pill {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--color-accent);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cart-text-wrap {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .cart-micro {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }
        .cart-amount {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
          .header-cart-btn {
            padding: 0.5rem;
            border-radius: var(--radius-sm);
          }
        }

        /* 3. Secondary Category Navigation Bar */
        .category-nav-bar {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          display: none;
        }
        @media (min-width: 1024px) {
          .category-nav-bar {
            display: block;
          }
        }
        .category-nav-list {
          display: flex;
          align-items: center;
          list-style: none;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }
        .nav-item-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.75rem 0;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--color-text-main);
          position: relative;
          text-transform: uppercase;
        }
        .nav-item-link:hover {
          color: var(--color-accent);
        }
        .nav-highlight {
          color: var(--color-accent);
        }
        .nav-icon-flame {
          color: var(--color-accent);
        }
        .nav-spacer {
          flex: 1;
        }
        .nav-store-link {
          color: var(--color-text-muted);
          font-size: 0.75rem;
        }
        .nav-store-link:hover {
          color: var(--color-primary);
        }

        /* Mobile Drawer */
        .mobile-menu-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          z-index: 1000;
          display: flex;
        }
        .mobile-menu-drawer {
          width: 82%;
          max-width: 320px;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          animation: slideRight 0.2s ease;
        }
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .mobile-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }
        .mobile-drawer-title {
          font-size: 0.95rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .close-drawer-btn {
          color: var(--color-text-muted);
          padding: 0.25rem;
        }
        .mobile-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .mobile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .mobile-nav-list a {
          display: block;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-main);
          padding: 0.35rem 0;
        }
        .mobile-nav-list .divider-line {
          height: 1px;
          background: var(--color-border);
          margin: 0.5rem 0;
        }
        .admin-link {
          color: var(--color-accent) !important;
        }
        .mobile-contact-box {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1rem;
          margin-top: 1.5rem;
        }
        .mobile-contact-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .mobile-contact-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
      `}</style>
    </header>
  );
};
