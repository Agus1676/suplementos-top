import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, CreditCard } from 'lucide-react';
import { Product } from '../../types';
import { formatARS, formatInstallments } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const primaryVariant = product.variants[0] || {
    id: `${product.id}-default`,
    title: 'Estándar',
    priceInCents: product.basePriceInCents,
    stock: 10,
    sku: 'ST-DEF'
  };

  const currentPrice = primaryVariant.priceInCents;
  // Only show a discount when the store actually set a "before" price (never invented)
  const originalPrice =
    ('compareAtPriceInCents' in primaryVariant && primaryVariant.compareAtPriceInCents) ||
    product.compareAtPriceInCents ||
    0;
  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;
  const isOutOfStock = product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) addItem(product, primaryVariant, 1);
  };

  return (
    <article className="pc-root">
      <Link to={`/producto/${product.slug}`} className="pc-link">
        {/* Media */}
        <div className="pc-media">
          <div className="pc-badges">
            {discountPercent > 0 && (
              <span className="pc-badge pc-badge-off">-{discountPercent}%</span>
            )}
            {product.isBestSeller && (
              <span className="pc-badge pc-badge-hot">TOP VENTAS</span>
            )}
          </div>

          <img 
            src={product.images[0]?.url || '/logo.jpg'} 
            alt={product.name} 
            className="pc-img"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Body */}
        <div className="pc-body">
          <span className="pc-brand">{product.brand}</span>
          <h3 className="pc-title">{product.name}</h3>

          <div className="pc-rating" aria-label={`Calificación ${product.rating} de 5`}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
            ))}
            <span>{product.rating}</span>
          </div>

          <div className="pc-prices">
            {originalPrice > currentPrice && (
              <span className="pc-price-old">{formatARS(originalPrice)}</span>
            )}
            <span className="pc-price">{formatARS(currentPrice)}</span>
          </div>

          <div className="pc-cuotas">
            <CreditCard size={12} />
            <span><strong>{formatInstallments(currentPrice, 3)}</strong> sin interés</span>
          </div>

          <span className="pc-transfer">
            <strong>10% OFF</strong> transferencia
          </span>
        </div>
      </Link>

      <div className="pc-footer">
        <button 
          type="button"
          onClick={handleQuickAdd}
          disabled={isOutOfStock}
          className="pc-add-btn"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag size={15} />
          <span>{isOutOfStock ? 'SIN STOCK' : 'AGREGAR'}</span>
        </button>
      </div>

      <style>{`
        .pc-root {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast), transform var(--transition-fast);
        }
        .pc-root:hover {
          border-color: #CBD5E1;
          box-shadow: 0 12px 24px -8px rgba(15, 23, 42, 0.14);
          transform: translateY(-2px);
        }
        .pc-link {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-decoration: none;
          color: inherit;
        }
        .pc-media {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #FFFFFF;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pc-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .pc-root:hover .pc-img {
          transform: scale(1.05);
        }
        .pc-badges {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          right: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.25rem;
          z-index: 2;
          pointer-events: none;
        }
        .pc-badge {
          font-weight: 900;
          line-height: 1;
          border-radius: var(--radius-xs);
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .pc-badge-off {
          background: var(--color-promo-red);
          color: #FFFFFF;
          font-size: 0.82rem;
          padding: 0.32rem 0.5rem;
          box-shadow: 0 3px 8px rgba(255, 23, 68, 0.35);
        }
        .pc-badge-hot {
          background: var(--color-promo-yellow);
          color: #0F172A;
          font-size: 0.58rem;
          padding: 0.3rem 0.4rem;
          margin-left: auto;
        }
        .pc-body {
          padding: 0.6rem 0.7rem 0.4rem;
          display: flex;
          flex-direction: column;
          flex: 1;
          border-top: 1px solid var(--color-border);
        }
        .pc-brand {
          font-size: 0.62rem;
          font-weight: 800;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .pc-title {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.3;
          margin: 0.15rem 0 0.3rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.08em;
        }
        .pc-rating {
          display: flex;
          align-items: center;
          gap: 1px;
          margin-bottom: 0.35rem;
        }
        .pc-rating span {
          font-size: 0.66rem;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-left: 0.25rem;
        }
        .pc-prices {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.35rem;
        }
        .pc-price-old {
          font-size: 0.7rem;
          color: var(--color-text-subtle);
          text-decoration: line-through;
        }
        .pc-price {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--color-text-main);
          letter-spacing: -0.01em;
          line-height: 1.1;
        }
        .pc-cuotas {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          align-self: flex-start;
          background: var(--color-promo-green);
          color: #FFFFFF;
          border-radius: var(--radius-full);
          padding: 0.22rem 0.55rem;
          font-size: 0.64rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
          max-width: 100%;
        }
        .pc-cuotas span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pc-transfer {
          font-size: 0.64rem;
          color: var(--color-text-muted);
        }
        .pc-transfer strong {
          color: var(--color-promo-green-dark);
        }
        .pc-footer {
          padding: 0.4rem 0.7rem 0.7rem;
        }
        .pc-add-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          background: var(--color-accent);
          color: #FFFFFF;
          border: none;
          border-radius: var(--radius-full);
          padding: 0.55rem 0.5rem;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background var(--transition-fast), transform var(--transition-fast);
        }
        .pc-add-btn:hover:not(:disabled) {
          background: var(--color-accent-hover);
        }
        .pc-add-btn:active:not(:disabled) {
          transform: scale(0.97);
        }
        .pc-add-btn:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
        }
        @media (min-width: 768px) {
          .pc-body { padding: 0.8rem 0.95rem 0.5rem; }
          .pc-footer { padding: 0.5rem 0.95rem 0.95rem; }
          .pc-title { font-size: 0.9rem; }
          .pc-price { font-size: 1.3rem; }
          .pc-cuotas { font-size: 0.72rem; }
          .pc-transfer { font-size: 0.7rem; }
          .pc-add-btn { font-size: 0.8rem; padding: 0.65rem; }
        }
      `}</style>
    </article>
  );
};
