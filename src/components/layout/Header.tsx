import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  PackageCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';

export const Header: React.FC = () => {
  const { totalItemsCount, openCartDrawer } = useCart();
  const { products } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  const liveSearchResults =
    searchQuery.trim().length >= 2
      ? products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="pv-header">
      {/* Top Promo Strip */}
      <div className="pv-topbar">
        <div className="container pv-topbar-inner">
          <span>10% OFF por transferencia · 6 cuotas sin interés · Envío gratis desde $85.000</span>
          <div className="pv-topbar-links">
            <span>Retiro sin cargo: Uriburu 1163, Recoleta</span>
            <span className="pv-topbar-sep">|</span>
            <a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer">
              WhatsApp 11 6565 1990
            </a>
          </div>
        </div>
      </div>

      {/* Main White Header */}
      <div className="pv-header-main">
        <div className="container pv-header-row">
          <button
            type="button"
            className="pv-mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="pv-brand">
            <img src="/logo.jpg" alt="Suplementos Top" className="pv-brand-logo" />
            <span className="pv-brand-name">SUPLEMENTOS TOP</span>
          </Link>

          <div className="pv-right-cluster">
            <div className="pv-search-wrap" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="pv-search-form">
                <input
                  type="text"
                  placeholder="Buscar productos o marcas..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  className="pv-search-input"
                />
                <button type="submit" className="pv-search-btn" aria-label="Buscar">
                  <Search size={16} />
                </button>
              </form>

              {isSearchFocused && searchQuery.trim().length >= 2 && (
                <div className="pv-search-dropdown">
                  {liveSearchResults.length > 0 ? (
                    <>
                      <div className="pv-search-list">
                        {liveSearchResults.map((prod) => (
                          <Link
                            key={prod.id}
                            to={`/producto/${prod.slug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="pv-search-item"
                          >
                            <img
                              src={prod.images[0]?.url || '/logo.jpg'}
                              alt={prod.name}
                              className="pv-search-thumb"
                            />
                            <div className="pv-search-meta">
                              <span className="pv-search-title">{prod.name}</span>
                              <span className="pv-search-price">{formatARS(prod.basePriceInCents)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="pv-search-all"
                      >
                        Ver todos los resultados ({liveSearchResults.length})
                      </button>
                    </>
                  ) : (
                    <div className="pv-search-empty">
                      Sin resultados para "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/seguimiento"
              className="pv-icon-btn"
              title="Seguimiento de pedido"
              aria-label="Seguimiento de pedido"
            >
              <PackageCheck size={20} />
            </Link>

            <button
              type="button"
              onClick={openCartDrawer}
              className="pv-icon-btn pv-cart-btn"
              aria-label="Abrir carrito"
              title="Carrito"
            >
              <ShoppingBag size={20} />
              <span className="pv-cart-badge">{totalItemsCount}</span>
            </button>
          </div>
        </div>

        {/* Clean White Navigation Bar */}
        <nav className="pv-nav" aria-label="Navegación principal">
          <div className="container">
            <ul className="pv-nav-list">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Productos</Link></li>
              <li><Link to="/catalogo?categoria=proteinas">Proteínas</Link></li>
              <li><Link to="/catalogo?categoria=creatinas">Creatinas</Link></li>
              <li><Link to="/catalogo?categoria=pre-entrenos">Pre-entrenos</Link></li>
              <li><Link to="/catalogo?categoria=combos">Combos</Link></li>
              <li><Link to="/catalogo?categoria=salud-vitaminas">Vitaminas</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pv-mobile-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="pv-mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="pv-mobile-head">
              <span>Menú</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>
            <ul className="pv-mobile-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/catalogo">Todos los productos</Link></li>
              <li><Link to="/catalogo?categoria=proteinas">Proteínas</Link></li>
              <li><Link to="/catalogo?categoria=creatinas">Creatinas</Link></li>
              <li><Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenos</Link></li>
              <li><Link to="/catalogo?categoria=combos">Combos</Link></li>
              <li><Link to="/catalogo?categoria=aminoacidos">Aminoácidos</Link></li>
              <li><Link to="/catalogo?categoria=salud-vitaminas">Vitaminas y Salud</Link></li>
              <li><Link to="/seguimiento">Seguimiento de pedido</Link></li>
              <li><Link to="/contacto">Contacto y retiro en Recoleta</Link></li>
            </ul>
          </div>
        </div>
      )}

      <style>{`
        .pv-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FFFFFF;
          color: #18181B;
          border-bottom: 1px solid #E4E4E7;
        }
        .pv-topbar {
          background: #5B8C2A;
          font-size: 0.72rem;
          font-weight: 500;
          color: #FFFFFF;
          padding: 0.35rem 0;
        }
        .pv-topbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .pv-topbar-links {
          display: none;
          align-items: center;
          gap: 0.5rem;
        }
        .pv-topbar-links a {
          color: #FFFFFF;
          text-decoration: none;
          font-weight: 600;
        }
        .pv-topbar-links a:hover {
          text-decoration: underline;
        }
        .pv-topbar-sep {
          opacity: 0.5;
        }
        @media (min-width: 768px) {
          .pv-topbar-links {
            display: flex;
          }
        }

        .pv-header-main {
          background: #FFFFFF;
        }
        .pv-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 0.85rem;
          padding-bottom: 0.75rem;
        }
        .pv-mobile-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: #18181B;
          cursor: pointer;
          padding: 0.25rem;
        }
        @media (min-width: 900px) {
          .pv-mobile-btn {
            display: none;
          }
        }

        .pv-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          text-decoration: none;
          color: #18181B;
          flex-shrink: 0;
        }
        .pv-brand-logo {
          width: 42px;
          height: 42px;
          border-radius: 8px;
          object-fit: cover;
        }
        .pv-brand-name {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #18181B;
        }

        .pv-right-cluster {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          justify-content: flex-end;
        }
        .pv-search-wrap {
          position: relative;
          width: 100%;
          max-width: 360px;
        }
        .pv-search-form {
          display: flex;
          align-items: center;
          background: #F4F4F5;
          border: 1px solid #E4E4E7;
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .pv-search-form:focus-within {
          border-color: #A1A1AA;
          background: #FFFFFF;
        }
        .pv-search-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #18181B;
          font-family: var(--font-body);
          font-size: 0.82rem;
          padding: 0.5rem 0.75rem;
          outline: none;
        }
        .pv-search-input::placeholder {
          color: #71717A;
        }
        .pv-search-btn {
          background: transparent;
          border: none;
          color: #52525B;
          padding: 0.5rem 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .pv-search-btn:hover {
          color: #18181B;
        }

        .pv-search-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          background: #FFFFFF;
          color: #18181B;
          border-radius: 6px;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.14);
          border: 1px solid #E4E4E7;
          overflow: hidden;
          z-index: 200;
        }
        .pv-search-list {
          display: flex;
          flex-direction: column;
        }
        .pv-search-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.55rem 0.75rem;
          text-decoration: none;
          color: #18181B;
          border-bottom: 1px solid #F4F4F5;
          transition: background 0.12s ease;
        }
        .pv-search-item:hover {
          background: #F8FAFC;
        }
        .pv-search-thumb {
          width: 38px;
          height: 38px;
          object-fit: contain;
          background: #FFFFFF;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .pv-search-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .pv-search-title {
          font-size: 0.78rem;
          font-weight: 500;
          color: #18181B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pv-search-price {
          font-size: 0.75rem;
          font-weight: 700;
          color: #5B8C2A;
        }
        .pv-search-all {
          width: 100%;
          background: #F8FAFC;
          border: none;
          padding: 0.55rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #18181B;
          cursor: pointer;
          text-align: center;
        }
        .pv-search-empty {
          padding: 0.85rem;
          font-size: 0.78rem;
          color: #71717A;
          text-align: center;
        }

        .pv-icon-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          color: #27272A;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .pv-icon-btn:hover {
          background: #F4F4F5;
        }
        .pv-cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #5B8C2A;
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 700;
          min-width: 17px;
          height: 17px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          line-height: 1;
        }

        /* Clean Light Navigation Row */
        .pv-nav {
          display: none;
          border-top: 1px solid #F4F4F5;
          background: #FFFFFF;
        }
        @media (min-width: 900px) {
          .pv-nav {
            display: block;
          }
        }
        .pv-nav-list {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.25rem;
          list-style: none;
          margin: 0;
          padding: 0.55rem 0;
        }
        .pv-nav-list a {
          color: #3F3F46;
          font-size: 0.82rem;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .pv-nav-list a:hover {
          color: #18181B;
        }

        /* Mobile Drawer */
        .pv-mobile-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 300;
        }
        .pv-mobile-drawer {
          width: 280px;
          max-width: 85vw;
          height: 100%;
          background: #FFFFFF;
          color: #18181B;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pv-mobile-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-weight: 700;
          font-size: 0.95rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #E4E4E7;
        }
        .pv-mobile-head button {
          background: none;
          border: none;
          color: #18181B;
          cursor: pointer;
        }
        .pv-mobile-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .pv-mobile-links a {
          display: block;
          padding: 0.65rem 0.35rem;
          color: #27272A;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 500;
          border-bottom: 1px solid #F4F4F5;
        }
      `}</style>
    </header>
  );
};
