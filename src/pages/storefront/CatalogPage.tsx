import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Search, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories } = useStore();

  const activeCategory = searchParams.get('categoria') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category.slug !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }
      if (onlyInStock) {
        const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
        if (totalStock <= 0) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceInCents - b.basePriceInCents;
      if (sortBy === 'price-desc') return b.basePriceInCents - a.basePriceInCents;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, activeCategory, searchQuery, onlyInStock, sortBy]);

  const handleSelectCategory = (catSlug: string) => {
    if (catSlug === 'all') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setOnlyInStock(false);
  };

  return (
    <div className="container catalog-page-container">
      {/* Top Header */}
      <div className="catalog-header">
        <div>
          <span className="section-eyebrow">CATÁLOGO OFICIAL</span>
          <h1 className="catalog-title">SUPLEMENTOS & NUTRICIÓN</h1>
          <p className="catalog-subtitle">
            Mostrando <strong>{filteredProducts.length}</strong> fórmulas de élite disponibles con despacho a todo el país o retiro en <strong>Uriburu 1163, CABA</strong>.
          </p>
        </div>

        {/* Controls */}
        <div className="catalog-controls">
          <button 
            className="mobile-filter-btn"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal size={16} />
            <span>FILTROS</span>
          </button>

          <div className="sort-dropdown-wrap">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="featured">DESTACADOS</option>
              <option value="price-asc">MENOR PRECIO</option>
              <option value="price-desc">MAYOR PRECIO</option>
              <option value="rating">MEJOR VALORADOS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeCategory !== 'all' || searchQuery || onlyInStock) && (
        <div className="active-filters-bar">
          <span className="text-xs text-muted font-bold">FILTROS ACTIVOS:</span>
          {activeCategory !== 'all' && (
            <span className="filter-chip">
              Categoría: {categories.find((c) => c.slug === activeCategory)?.name}
              <button onClick={() => handleSelectCategory('all')}><X size={12} /></button>
            </span>
          )}
          {searchQuery && (
            <span className="filter-chip">
              Búsqueda: "{searchQuery}"
              <button onClick={() => { searchParams.delete('q'); setSearchParams(searchParams); }}><X size={12} /></button>
            </span>
          )}
          {onlyInStock && (
            <span className="filter-chip">
              Solo con stock
              <button onClick={() => setOnlyInStock(false)}><X size={12} /></button>
            </span>
          )}
          <button onClick={handleClearFilters} className="clear-all-btn">
            LIMPIAR TODOS
          </button>
        </div>
      )}

      {/* Main Layout */}
      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className={`catalog-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header-mobile">
            <h3 className="font-display">FILTRAR CATÁLOGO</h3>
            <button onClick={() => setMobileFiltersOpen(false)}><X size={22} /></button>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">CATEGORÍAS</h4>
            <div className="category-filter-list">
              <button
                type="button"
                className={`category-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('all')}
              >
                <span>TODAS LAS CATEGORÍAS</span>
                <span className="cat-count">({products.length})</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(cat.slug)}
                  >
                    <span>{cat.name.toUpperCase()}</span>
                    <span className="cat-count">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">DISPONIBILIDAD</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>Mostrar solo productos con stock</span>
            </label>
          </div>

          <div className="filter-group sidebar-info-box">
            <strong className="text-gold">¿DUDAS SOBRE TU DOSIFICACIÓN?</strong>
            <p>Escribinos a nuestro WhatsApp oficial y un asesor deportivo te orienta en el acto.</p>
            <a
              href="https://wa.me/5491165651990"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <Phone size={14} className="text-gold" />
              <span>CONSULTAR AL 11 6565 1990</span>
            </a>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="catalog-products-main">
          {filteredProducts.length === 0 ? (
            <div className="no-products-card card">
              <Search size={40} className="text-subtle" />
              <h3>NO SE ENCONTRARON PRODUCTOS</h3>
              <p>Probá modificando los filtros o realizando otra búsqueda.</p>
              <button onClick={handleClearFilters} className="btn btn-primary btn-sm">
                RESTABLECER FILTROS
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .catalog-page-container {
          padding-top: 2.5rem;
          padding-bottom: 5rem;
        }
        .section-eyebrow {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.2rem;
        }
        .catalog-header {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .catalog-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
        .catalog-title {
          font-size: 2.6rem;
          margin-bottom: 0.25rem;
        }
        .catalog-subtitle {
          color: var(--color-text-muted);
          font-size: 1rem;
        }
        .catalog-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mobile-filter-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #121724;
          border: 1px solid var(--color-border);
          color: #FFF;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        @media (min-width: 900px) {
          .mobile-filter-btn {
            display: none;
          }
        }
        .sort-dropdown-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sort-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--color-accent);
          pointer-events: none;
        }
        .sort-select {
          appearance: none;
          background: #121724;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.65rem 2rem 0.65rem 2.4rem;
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #FFFFFF;
          cursor: pointer;
        }
        .sort-select:focus {
          border-color: var(--color-accent);
          outline: none;
        }
        .active-filters-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 2rem;
          padding: 0.85rem 1.25rem;
          background: #121724;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #1C2436;
          border: 1px solid var(--color-border-gold);
          color: #FFF;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .filter-chip button {
          display: flex;
          align-items: center;
          color: var(--color-accent);
        }
        .clear-all-btn {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-danger);
          margin-left: 0.5rem;
          letter-spacing: 0.05em;
        }
        .clear-all-btn:hover {
          text-decoration: underline;
        }
        .catalog-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .catalog-layout {
            grid-template-columns: 260px 1fr;
          }
        }
        .catalog-sidebar {
          display: none;
          flex-direction: column;
          gap: 1.5rem;
        }
        @media (min-width: 900px) {
          .catalog-sidebar {
            display: flex;
          }
        }
        .catalog-sidebar.mobile-open {
          display: flex;
          position: fixed;
          top: 0;
          left: 0;
          width: 85%;
          max-width: 320px;
          height: 100vh;
          background: #0D111A;
          border-right: 1px solid var(--color-border);
          z-index: 1000;
          padding: 1.5rem;
          box-shadow: var(--shadow-xl);
          overflow-y: auto;
        }
        .sidebar-header-mobile {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }
        @media (min-width: 900px) {
          .sidebar-header-mobile {
            display: none;
          }
        }
        .filter-group {
          background: #121724;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }
        .filter-group-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.85rem;
          color: #FFF;
          letter-spacing: 0.05em;
        }
        .category-filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .category-filter-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
          text-align: left;
          transition: all 0.15s;
        }
        .category-filter-btn:hover {
          background: #182032;
          color: #FFF;
        }
        .category-filter-btn.active {
          background: rgba(229, 184, 105, 0.15);
          color: var(--color-accent);
          border: 1px solid var(--color-border-gold);
          font-weight: 700;
        }
        .category-filter-btn.active .cat-count {
          color: var(--color-accent);
        }
        .cat-count {
          font-size: 0.75rem;
          color: var(--color-text-subtle);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: #CBD5E1;
          cursor: pointer;
        }
        .sidebar-info-box {
          background: #0B0E16;
          border-color: var(--color-border-gold);
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .sidebar-info-box p {
          color: var(--color-text-muted);
          font-size: 0.8rem;
          line-height: 1.5;
        }
        .catalog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 600px) {
          .catalog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .catalog-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .no-products-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4.5rem 2rem;
          text-align: center;
          gap: 0.85rem;
        }
      `}</style>
    </div>
  );
};
