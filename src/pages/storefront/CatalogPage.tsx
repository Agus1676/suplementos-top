import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
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
      // Category filter
      if (activeCategory !== 'all' && p.category.slug !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }
      // Stock filter
      if (onlyInStock) {
        const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
        if (totalStock <= 0) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.basePriceInCents - b.basePriceInCents;
      }
      if (sortBy === 'price-desc') {
        return b.basePriceInCents - a.basePriceInCents;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
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
      {/* Top Header / Breadcrumb */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Catálogo de Suplementos</h1>
          <p className="catalog-subtitle">
            Mostrando <strong>{filteredProducts.length}</strong> productos disponibles con entrega en CABA y envíos a todo el país.
          </p>
        </div>

        {/* Sort and Mobile Filter Trigger */}
        <div className="catalog-controls">
          <button 
            className="mobile-filter-btn"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            <SlidersHorizontal size={16} />
            <span>Filtros</span>
          </button>

          <div className="sort-dropdown-wrap">
            <ArrowUpDown size={15} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="rating">Mejor valorados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeCategory !== 'all' || searchQuery || onlyInStock) && (
        <div className="active-filters-bar">
          <span className="text-xs text-muted font-bold">Filtros activos:</span>
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
            Limpiar todos
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="catalog-layout">
        {/* Desktop Sidebar */}
        <aside className={`catalog-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header-mobile">
            <h3>Filtrar Catálogo</h3>
            <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Categorías</h4>
            <div className="category-filter-list">
              <button
                type="button"
                className={`category-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleSelectCategory('all')}
              >
                <span>Todas las categorías</span>
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
                    <span>{cat.name}</span>
                    <span className="cat-count">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Disponibilidad</h4>
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
            <strong>¿Dudas con tu suplementación?</strong>
            <p>Escribinos a nuestro WhatsApp oficial y un asesor deportivo te orienta al instante.</p>
            <a
              href="https://wa.me/5491165651990"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              Consultar al 11 6565 1990
            </a>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="catalog-products-main">
          {filteredProducts.length === 0 ? (
            <div className="no-products-card card">
              <Search size={40} className="text-subtle" />
              <h3>No se encontraron productos</h3>
              <p>Probá modificando los filtros o realizando otra búsqueda.</p>
              <button onClick={handleClearFilters} className="btn btn-primary btn-sm">
                Restablecer Filtros
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
          padding-top: 2rem;
          padding-bottom: 4rem;
        }
        .catalog-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
          .catalog-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
        .catalog-title {
          font-size: 2rem;
          margin-bottom: 0.25rem;
        }
        .catalog-subtitle {
          color: var(--color-text-muted);
          font-size: 0.95rem;
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
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 0.55rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
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
          left: 0.75rem;
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .sort-select {
          appearance: none;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.55rem 1.8rem 0.55rem 2.2rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-main);
          cursor: pointer;
        }
        .active-filters-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 0.75rem 1rem;
          background: var(--color-bg-muted);
          border-radius: var(--radius-md);
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .filter-chip button {
          display: flex;
          align-items: center;
          color: var(--color-text-muted);
        }
        .filter-chip button:hover {
          color: var(--color-danger);
        }
        .clear-all-btn {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-danger);
          margin-left: 0.5rem;
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
          background: #FFFFFF;
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
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }
        .filter-group-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--color-primary);
        }
        .category-filter-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .category-filter-btn {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.45rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--color-text-main);
          text-align: left;
          transition: background 0.15s;
        }
        .category-filter-btn:hover {
          background: var(--color-bg-muted);
        }
        .category-filter-btn.active {
          background: var(--color-primary);
          color: #FFFFFF;
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
          gap: 0.5rem;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .sidebar-info-box {
          background: var(--color-bg-muted);
          border-color: rgba(245, 158, 11, 0.3);
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-info-box p {
          color: var(--color-text-muted);
          font-size: 0.8rem;
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
          padding: 4rem 2rem;
          text-align: center;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
};
