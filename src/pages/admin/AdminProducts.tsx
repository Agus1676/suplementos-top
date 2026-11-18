import React, { useState } from 'react';
import { Search, Plus, Minus, Check, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const AdminProducts: React.FC = () => {
  const { products, updateProductStock } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term);
  });

  const handleStockChange = (productId: string, variantId: string, currentStock: number, delta: number) => {
    const next = Math.max(0, currentStock + delta);
    updateProductStock(productId, variantId, next);
    setFeedback(`Stock actualizado a ${next} unidades`);
    setTimeout(() => setFeedback(null), 1800);
  };

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <div>
          <h1>Catálogo & Control de Stock</h1>
          <p className="text-muted">
            Ajustá existencias en tiempo real de cada producto y variante para evitar quiebres de inventario.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="feedback-toast">
          <Check size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search */}
      <div className="card products-filter-card">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar suplemento por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Products & Variants List */}
      <div className="products-list-wrap">
        {filtered.map((product) => {
          const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

          return (
            <div key={product.id} className="card product-manage-card">
              <div className="product-top-row">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  className="product-thumb"
                />
                <div className="product-main-meta">
                  <div className="title-row">
                    <h3>{product.name}</h3>
                    <Link
                      to={`/producto/${product.slug}`}
                      target="_blank"
                      className="view-store-link"
                      title="Ver en la tienda"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                  <span className="brand-tag">{product.brand} • {product.category.name}</span>
                  <div className="stock-summary-pill">
                    Stock Total: <strong>{totalStock} unidades</strong>
                  </div>
                </div>
              </div>

              {/* Variants sub-table */}
              <div className="variants-subtable">
                <span className="subtable-title">Variantes & Existencias:</span>
                <div className="variants-grid">
                  {product.variants.map((v) => (
                    <div key={v.id} className="variant-manage-item">
                      <div className="variant-info">
                        <strong>{v.title}</strong>
                        <span className="sku-text">SKU: {v.sku}</span>
                        <span className="price-text">{formatARS(v.priceInCents)}</span>
                      </div>

                      <div className="stock-control-cluster">
                        <span className="stock-label">Stock:</span>
                        <div className="stock-stepper">
                          <button
                            onClick={() => handleStockChange(product.id, v.id, v.stock, -1)}
                            className="step-btn"
                            disabled={v.stock <= 0}
                          >
                            <Minus size={13} />
                          </button>
                          <span className={`stock-number ${v.stock <= 5 ? 'text-danger font-bold' : ''}`}>
                            {v.stock}
                          </span>
                          <button
                            onClick={() => handleStockChange(product.id, v.id, v.stock, 1)}
                            className="step-btn"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .admin-products-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.2rem;
        }
        .feedback-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #065F46;
          color: #FFF;
          padding: 0.75rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
        }
        .products-filter-card {
          padding: 1rem 1.25rem;
        }
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--color-text-subtle);
        }
        .search-input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .products-list-wrap {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .product-manage-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .product-top-row {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }
        .product-thumb {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }
        .product-main-meta {
          flex: 1;
        }
        .title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .title-row h3 {
          font-size: 1.15rem;
          margin: 0;
        }
        .view-store-link {
          color: var(--color-text-muted);
          padding: 0.2rem;
        }
        .view-store-link:hover {
          color: var(--color-primary);
        }
        .brand-tag {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          display: block;
          margin-top: 0.2rem;
        }
        .stock-summary-pill {
          display: inline-block;
          font-size: 0.775rem;
          background: var(--color-bg-muted);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          margin-top: 0.4rem;
        }
        .variants-subtable {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
        }
        .subtable-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.75rem;
        }
        .variants-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .variants-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .variant-manage-item {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.85rem 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .variant-info {
          display: flex;
          flex-direction: column;
        }
        .variant-info strong {
          font-size: 0.875rem;
          color: var(--color-primary);
        }
        .sku-text {
          font-size: 0.75rem;
          color: var(--color-text-subtle);
        }
        .price-text {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-top: 0.2rem;
        }
        .stock-control-cluster {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .stock-label {
          font-size: 0.775rem;
          color: var(--color-text-muted);
        }
        .stock-stepper {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .step-btn {
          padding: 0.35rem 0.55rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }
        .step-btn:disabled {
          opacity: 0.3;
        }
        .stock-number {
          min-width: 28px;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 700;
        }

        @media (max-width: 640px) {
          .product-manage-card {
            padding: 1rem;
          }
          .product-top-row {
            flex-direction: row;
            align-items: center;
            gap: 0.85rem;
          }
          .product-thumb {
            width: 55px;
            height: 55px;
          }
          .title-row h3 {
            font-size: 1rem;
          }
          .variant-manage-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
            padding: 0.75rem;
          }
          .stock-control-cluster {
            width: 100%;
            justify-content: space-between;
            border-top: 1px solid var(--color-border);
            padding-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};
