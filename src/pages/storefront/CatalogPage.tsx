import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Search, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { SEO } from '../../components/common/SEO';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, settings } = useStore();

  const activeCategory = searchParams.get('categoria') || 'all';
  const selectedBrand = searchParams.get('marca') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const allBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'all' && p.category.slug !== activeCategory) {
        return false;
      }
      if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
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
  }, [products, activeCategory, selectedBrand, searchQuery, onlyInStock, sortBy]);

  const handleSelectCategory = (catSlug: string) => {
    if (catSlug === 'all') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleSelectBrand = (brand: string) => {
    if (brand === 'all') {
      searchParams.delete('marca');
    } else {
      searchParams.set('marca', brand);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setOnlyInStock(false);
  };

  const currentCategoryObj = categories.find((c) => c.slug === activeCategory);
  const catalogPageTitle = currentCategoryObj 
    ? `${currentCategoryObj.name} en Recoleta` 
    : searchQuery 
    ? `Búsqueda "${searchQuery}" - Suplementos`
    : 'Catálogo de Suplementos Deportivos en Recoleta';

  const catalogMetaDesc = currentCategoryObj
    ? `Comprá ${currentCategoryObj.name} en Recoleta, CABA. ${currentCategoryObj.description} Retiro inmediato en Gimnasio Top Shape (Uriburu 1163) y 10% OFF por transferencia.`
    : 'Catálogo completo de suplementos deportivos originales en Recoleta, CABA. Star Nutrition, ENA Sport, Optimum Nutrition. Retiro sin cargo en Uriburu 1163 o envíos a todo el país.';

  const catalogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: catalogPageTitle,
    description: catalogMetaDesc,
    url: `https://suplementos-top.vercel.app/catalogo${activeCategory !== 'all' ? `?categoria=${activeCategory}` : ''}`,
    hasPart: filteredProducts.slice(0, 10).map((p) => ({
      '@type': 'Product',
      name: p.name,
      url: `https://suplementos-top.vercel.app/producto/${p.slug}`,
      image: p.images[0]?.url,
      brand: {
        '@type': 'Brand',
        name: p.brand,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'ARS',
        price: (p.basePriceInCents / 100).toFixed(2),
        availability: 'https://schema.org/InStock',
      },
    })),
  };

  return (
    <div className="container catalog-page-container">
      <SEO
        title={catalogPageTitle}
        description={catalogMetaDesc}
        canonicalUrl={`/catalogo${activeCategory !== 'all' ? `?categoria=${activeCategory}` : ''}`}
        jsonLd={catalogJsonLd}
      />

      {/* Top Header */}
      <div className="catalog-header">
        <div>
          <span className="section-eyebrow">CATÁLOGO COMPLETO</span>
          <h1 className="catalog-title">SUPLEMENTOS & NUTRICIÓN</h1>
          <p className="catalog-subtitle">
            Mostrando <strong>{filteredProducts.length}</strong> productos disponibles con despacho a todo el país o retiro en <strong>{settings.pickupAddress}</strong>.
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
              <option value="featured">MÁS DESTACADOS</option>
              <option value="price-asc">MENOR PRECIO</option>
              <option value="price-desc">MAYOR PRECIO</option>
              <option value="rating">MEJOR VALORADOS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeCategory !== 'all' || selectedBrand !== 'all' || searchQuery || onlyInStock) && (
        <div className="active-filters-bar">
          <span className="text-xs text-muted font-bold">FILTROS ACTIVOS:</span>
          {activeCategory !== 'all' && (
            <span className="filter-chip">
              Categoría: {categories.find((c) => c.slug === activeCategory)?.name}
              <button onClick={() => handleSelectCategory('all')} aria-label="Quitar filtro">
                <X size={14} />
              </button>
            </span>
          )}
          {selectedBrand !== 'all' && (
            <span className="filter-chip">
              Marca: {selectedBrand}
              <button onClick={() => handleSelectBrand('all')} aria-label="Quitar filtro">
                <X size={14} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="filter-chip">
              Búsqueda: "{searchQuery}"
              <button 
                onClick={() => {
                  searchParams.delete('q');
                  setSearchParams(searchParams);
                }} 
                aria-label="Quitar filtro"
              >
                <X size={14} />
              </button>
            </span>
          )}
          {onlyInStock && (
            <span className="filter-chip">
              Solo con stock inmediato
              <button onClick={() => setOnlyInStock(false)} aria-label="Quitar filtro">
                <X size={14} />
              </button>
            </span>
          )}
          <button onClick={handleClearFilters} className="clear-all-btn">
            Limpiar todos
          </button>
        </div>
      )}

      {/* Main Catalog Layout */}
      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className={`catalog-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-header-mobile">
            <h3>Filtros</h3>
            <button onClick={() => setMobileFiltersOpen(false)} aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <h4 className="filter-group-title">CATEGORÍAS</h4>
            <div className="category-filter-list">
              <button
                onClick={() => handleSelectCategory('all')}
                className={`category-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              >
                <span>Todas las categorías</span>
                <span className="cat-count">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category.slug === cat.slug).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.slug)}
                    className={`category-filter-btn ${activeCategory === cat.slug ? 'active' : ''}`}
                  >
                    <span>{cat.name}</span>
                    <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">MARCAS OFICIALES</h4>
            <div className="category-filter-list">
              <button
                onClick={() => handleSelectBrand('all')}
                className={`category-filter-btn ${selectedBrand === 'all' ? 'active' : ''}`}
              >
                <span>Todas las marcas</span>
                <span className="cat-count">{products.length}</span>
              </button>
              {allBrands.map((brand) => {
                const count = products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase()).length;
                return (
                  <button
                    key={brand}
                    onClick={() => handleSelectBrand(brand)}
                    className={`category-filter-btn ${selectedBrand.toLowerCase() === brand.toLowerCase() ? 'active' : ''}`}
                  >
                    <span>{brand}</span>
                    <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">DISPONIBILIDAD</h4>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
              />
              <span>Solo productos con stock</span>
            </label>
          </div>

          {/* WhatsApp Direct Help Widget */}
          <div className="filter-group sidebar-info-box">
            <strong>¿DUDAS SOBRE TU SUPLEMENTACIÓN?</strong>
            <p>
              Escribinos por WhatsApp y nuestro equipo te asesora de forma personalizada sobre qué suplemento se adapta a tu objetivo.
            </p>
            <a
              href="https://wa.me/5491165652990"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              <Phone size={14} />
              <span>CONSULTAR POR WHATSAPP</span>
            </a>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="catalog-main">
          {filteredProducts.length === 0 ? (
            <div className="card no-products-card">
              <Search size={44} className="text-muted" />
              <h3>No se encontraron productos</h3>
              <p className="text-muted">
                Probá cambiando los filtros o buscando con otros términos en el catálogo.
              </p>
              <button onClick={handleClearFilters} className="btn btn-primary btn-sm mt-3">
                Ver todos los productos
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
          padding-bottom: 5rem;
        }
        .section-eyebrow {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.25rem;
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
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
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
          color: var(--color-text);
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 700;
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
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .sort-select {
          appearance: none;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.65rem 2rem 0.65rem 2.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text);
          cursor: pointer;
        }
        .sort-select:focus {
          border-color: var(--color-text);
          outline: none;
        }
        .active-filters-bar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.5rem;
          padding: 0.85rem 1.25rem;
          background: #F9FAFB;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          color: var(--color-text);
          padding: 0.25rem 0.75rem;
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
          color: var(--color-accent);
        }
        .clear-all-btn {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-accent);
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
          gap: 1.25rem;
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
          border-right: 1px solid var(--color-border);
          z-index: 1000;
          padding: 1.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
          border-radius: var(--radius-sm);
          padding: 1.25rem;
        }
        .filter-group-title {
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 0.85rem;
          color: var(--color-text);
          letter-spacing: 0.05em;
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
          padding: 0.5rem 0.65rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--color-text-muted);
          text-align: left;
          transition: all 0.15s;
        }
        .category-filter-btn:hover {
          background: #F3F4F6;
          color: var(--color-text);
        }
        .category-filter-btn.active {
          background: #FEE2E2;
          color: var(--color-accent);
          font-weight: 700;
        }
        .category-filter-btn.active .cat-count {
          color: var(--color-accent);
          font-weight: 700;
        }
        .cat-count {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: var(--color-text);
          cursor: pointer;
        }
        .sidebar-info-box {
          background: #F9FAFB;
          border-color: var(--color-border);
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
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .catalog-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 1.1rem;
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
          background: #FFFFFF;
        }
      `}</style>
    </div>
  );
};
