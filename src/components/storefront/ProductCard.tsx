import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { Product } from '../../types';
import { formatARS, formatInstallments } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

/** Discount applied when paying by bank transfer / cash (shown site-wide). */
const TRANSFER_DISCOUNT = 0.1;
const PLACEHOLDER_IMAGE = '/logo.jpg';

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

  const listPrice = primaryVariant.priceInCents;
  const transferPrice = Math.round(listPrice * (1 - TRANSFER_DISCOUNT));

  // Only show a "before" price when the store actually set one (never invented)
  const beforePrice =
    ('compareAtPriceInCents' in primaryVariant && primaryVariant.compareAtPriceInCents) ||
    product.compareAtPriceInCents ||
    0;
  const discountPercent =
    beforePrice > listPrice ? Math.round(((beforePrice - listPrice) / beforePrice) * 100) : 0;

  const isOutOfStock = product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);
  const imageUrl = product.images[0]?.url;
  const hasRealPhoto = Boolean(imageUrl) && imageUrl !== PLACEHOLDER_IMAGE;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) addItem(product, primaryVariant, 1);
  };

  return (
    <article className="pc-root">
      <Link to={`/producto/${product.slug}`} className="pc-link">
        <div className="pc-media">
          {discountPercent > 0 && <span className="pc-tag">-{discountPercent}%</span>}

          {hasRealPhoto ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="pc-img"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="pc-placeholder" aria-label={product.name}>
              <span className="pc-placeholder-brand">{product.brand}</span>
            </div>
          )}
        </div>

        <div className="pc-body">
          <h3 className="pc-title">{product.name}</h3>

          <div className="pc-rating" aria-label={`Calificación ${product.rating} de 5`}>
            <Star size={12} fill="#F59E0B" color="#F59E0B" />
            <span>{product.rating}</span>
          </div>

          <div className="pc-list-price">
            {beforePrice > listPrice && <s>{formatARS(beforePrice)}</s>}
            <span>{formatARS(listPrice)}</span>
          </div>

          <div className="pc-transfer">
            <strong>{formatARS(transferPrice)}</strong>
            <span>por transferencia</span>
          </div>

          <div className="pc-installments">
            {formatInstallments(listPrice, 3)}
            <small>con Mercado Pago</small>
          </div>
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
          <span>{isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}</span>
        </button>
      </div>

      <style>{`
        .pc-root {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          height: 100%;
          transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
        }
        .pc-root:hover {
          border-color: #CBD5E1;
          box-shadow: 0 8px 22px -10px rgba(15, 23, 42, 0.22);
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
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .pc-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .pc-placeholder {
          width: 100%;
          height: 100%;
          background: #F1F5F9;
          border-radius: var(--radius-xs);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .pc-placeholder-brand {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          letter-spacing: -0.01em;
          color: #94A3B8;
          text-align: center;
          line-height: 1.2;
        }
        .pc-tag {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          z-index: 2;
          background: var(--color-promo-red);
          color: #FFFFFF;
          font-size: 0.72rem;
          font-weight: 800;
          line-height: 1;
          padding: 0.28rem 0.42rem;
          border-radius: var(--radius-xs);
        }
        .pc-body {
          padding: 0.5rem 0.75rem 0.65rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .pc-title {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 500;
          color: var(--color-text-body);
          line-height: 1.35;
          margin: 0 0 0.3rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.2em;
        }
        .pc-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--color-text-muted);
          margin-bottom: 0.3rem;
        }
        .pc-list-price {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          font-size: 0.78rem;
          color: var(--color-text-muted);
          margin-bottom: 0.4rem;
        }
        .pc-list-price s {
          color: var(--color-text-subtle);
        }
        .pc-transfer {
          background: var(--color-promo-green-dark);
          color: #FFFFFF;
          border-radius: var(--radius-xs);
          padding: 0.5rem 0.6rem;
          display: flex;
          flex-direction: column;
          line-height: 1.15;
          margin-bottom: 0.4rem;
        }
        .pc-transfer strong {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .pc-transfer span {
          font-size: 0.72rem;
          font-weight: 600;
          opacity: 0.95;
        }
        .pc-installments {
          background: #F1F5F9;
          border-radius: var(--radius-xs);
          padding: 0.4rem 0.6rem;
          font-size: 0.72rem;
          color: var(--color-text-body);
          line-height: 1.3;
        }
        .pc-installments small {
          display: block;
          font-size: 0.68rem;
          color: var(--color-text-muted);
        }
        .pc-footer {
          padding: 0 0.75rem 0.75rem;
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
          border-radius: var(--radius-xs);
          padding: 0.6rem 0.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .pc-add-btn:hover:not(:disabled) {
          background: var(--color-accent-hover);
        }
        .pc-add-btn:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
        }
        @media (min-width: 768px) {
          .pc-body { padding: 0.5rem 1rem 0.75rem; }
          .pc-footer { padding: 0 1rem 1rem; }
          .pc-title { font-size: 0.88rem; }
          .pc-transfer strong { font-size: 1.35rem; }
        }
      `}</style>
    </article>
  );
};
