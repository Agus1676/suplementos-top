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
  const originalPrice = product.compareAtPriceInCents || Math.round(currentPrice * 1.18);
  const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, primaryVariant, 1);
  };

  return (
    <div className="product-card-root">
      <Link to={`/producto/${product.slug}`} className="product-card-link">
        {/* Media Frame */}
        <div className="product-card-media">
          {discountPercent > 0 && (
            <span className="product-badge-discount">{discountPercent}% OFF</span>
          )}
          {product.isBestSeller && (
            <span className="product-badge-bestseller">MÁS VENDIDO</span>
          )}

          <img 
            src={product.images[0]?.url || '/logo.jpg'} 
            alt={product.name} 
            className="product-card-img"
            loading="lazy"
          />
        </div>

        {/* Content Body */}
        <div className="product-card-body">
          {/* Brand */}
          <span className="product-card-brand">{product.brand}</span>

          {/* Title */}
          <h3 className="product-card-title">{product.name}</h3>

          {/* Ratings */}
          <div className="product-card-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="star-filled" fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <span className="rating-num">{product.rating}</span>
          </div>

          {/* Prices */}
          <div className="product-card-prices">
            {originalPrice > currentPrice && (
              <span className="price-original">{formatARS(originalPrice)}</span>
            )}
            <div className="price-current-wrap">
              <span className="price-current">{formatARS(currentPrice)}</span>
            </div>
          </div>

          {/* 3 Cuotas sin interés Callout (Argentine eCommerce Standard) */}
          <div className="product-installments-pill">
            <CreditCard size={13} className="text-success" />
            <span><strong>{formatInstallments(currentPrice, 3)}</strong> sin interés</span>
          </div>

          <div className="product-transfer-notice">
            <span><strong>10% OFF</strong> con Transferencia / Efectivo</span>
          </div>
        </div>
      </Link>

      {/* Action Footer */}
      <div className="product-card-footer">
        <button 
          onClick={handleQuickAdd}
          className="btn btn-primary btn-block btn-sm product-add-btn"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <ShoppingBag size={15} />
          <span>AGREGAR AL CARRITO</span>
        </button>
      </div>

      <style>{`
        .product-card-root {
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all var(--transition-fast);
          position: relative;
        }
        .product-card-root:hover {
          border-color: #CBD5E1;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        .product-card-link {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          flex: 1;
        }
        .product-card-media {
          position: relative;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          padding: 1.25rem 1rem;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .product-card-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .product-card-root:hover .product-card-img {
          transform: scale(1.05);
        }
        .product-badge-discount {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background-color: var(--color-accent);
          color: #FFFFFF;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-xs);
          letter-spacing: 0.04em;
          z-index: 2;
        }
        .product-badge-bestseller {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background-color: #0F172A;
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-xs);
          letter-spacing: 0.05em;
          z-index: 2;
        }
        .product-card-body {
          padding: 1rem 1.15rem 0.75rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-card-brand {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.25rem;
        }
        .product-card-title {
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.35;
          margin-bottom: 0.45rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.5rem;
        }
        .product-card-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.65rem;
        }
        .rating-stars {
          display: flex;
          gap: 1px;
        }
        .rating-num {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .product-card-prices {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
        }
        .price-original {
          font-size: 0.78rem;
          color: var(--color-text-subtle);
          text-decoration: line-through;
        }
        .price-current-wrap {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .price-current {
          font-family: var(--font-display);
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--color-text-main);
          letter-spacing: -0.01em;
        }
        .product-installments-pill {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background-color: var(--color-success-light);
          color: var(--color-success);
          border: 1px solid var(--color-success-border);
          border-radius: var(--radius-xs);
          padding: 0.35rem 0.55rem;
          font-size: 0.75rem;
          margin-bottom: 0.35rem;
        }
        .product-transfer-notice {
          font-size: 0.7rem;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }
        .product-card-footer {
          padding: 0 1.15rem 1.15rem;
        }
        .product-add-btn {
          font-weight: 800;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
};
