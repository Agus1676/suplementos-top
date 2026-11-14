import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { formatARS, calculateDiscountPercentage } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = calculateDiscountPercentage(
    selectedVariant.priceInCents,
    selectedVariant.compareAtPriceInCents
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedVariant.stock > 0) {
      addItem(product, selectedVariant, 1);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  return (
    <div className="product-card card">
      {/* Badges Overlay */}
      <div className="card-badge-wrap">
        {discountPercent > 0 && (
          <span className="badge badge-gold">-{discountPercent}% OFF</span>
        )}
        {product.isBestSeller && (
          <span className="badge badge-dark">TOP SELLER</span>
        )}
      </div>

      {/* Image with Link */}
      <Link to={`/producto/${product.slug}`} className="product-image-container">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.altText || product.name}
          className="product-main-img"
          loading="lazy"
        />
        <div className="img-glow-overlay"></div>
      </Link>

      {/* Content */}
      <div className="product-card-body">
        <div className="product-brand-rating">
          <span className="product-brand">{product.brand}</span>
          <div className="product-rating">
            <Star size={13} className="text-gold fill-gold" />
            <span className="rating-val">{product.rating.toFixed(1)}</span>
            <span className="rating-count">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="product-title">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="product-tagline">{product.tagline}</p>

        {/* Variant Pills Selector */}
        {product.variants.length > 1 && (
          <div className="variants-selector-grid">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariant(v);
                }}
                className={`variant-pill ${selectedVariant.id === v.id ? 'active' : ''}`}
                title={v.title}
              >
                {v.flavor ? v.flavor.split(' ')[0] : v.size || v.title}
              </button>
            ))}
          </div>
        )}

        {/* Pricing & Stock */}
        <div className="price-stock-row">
          <div className="price-wrap">
            <span className="current-price">
              {formatARS(selectedVariant.priceInCents)}
            </span>
            {selectedVariant.compareAtPriceInCents && selectedVariant.compareAtPriceInCents > selectedVariant.priceInCents && (
              <span className="compare-price">
                {formatARS(selectedVariant.compareAtPriceInCents)}
              </span>
            )}
          </div>

          <div className="stock-indicator">
            {selectedVariant.stock <= 5 && selectedVariant.stock > 0 ? (
              <span className="stock-badge-warn">
                <span className="dot dot-warn"></span>
                Últimas {selectedVariant.stock} un.
              </span>
            ) : selectedVariant.stock > 0 ? (
              <span className="stock-badge-ok">
                <span className="dot dot-ok"></span>
                Stock Disponible
              </span>
            ) : (
              <span className="stock-badge-out">Sin Stock</span>
            )}
          </div>
        </div>

        {/* Add to Cart CTA */}
        <button
          onClick={handleAddToCart}
          disabled={selectedVariant.stock <= 0}
          className={`btn btn-block ${addedAnimation ? 'btn-secondary' : 'btn-primary'} add-to-cart-btn`}
        >
          {addedAnimation ? (
            <>
              <Check size={18} className="text-success" />
              <span>¡AGREGADO AL CARRITO!</span>
            </>
          ) : selectedVariant.stock > 0 ? (
            <>
              <ShoppingBag size={18} />
              <span>AGREGAR AL CARRITO</span>
            </>
          ) : (
            <span>SIN STOCK MOMENTÁNEO</span>
          )}
        </button>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          position: relative;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s;
          overflow: hidden;
        }
        .product-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-border-gold);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(229, 184, 105, 0.15);
        }
        .card-badge-wrap {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          z-index: 10;
        }
        .product-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: #0B0E16;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid var(--color-border);
        }
        .product-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-main-img {
          transform: scale(1.08);
        }
        .img-glow-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 40%, rgba(7, 9, 14, 0.4) 100%);
          pointer-events: none;
        }
        .product-card-body {
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-brand-rating {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.45rem;
        }
        .product-brand {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--color-accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
        }
        .rating-val {
          font-weight: 700;
          color: #FFFFFF;
        }
        .rating-count {
          color: var(--color-text-subtle);
        }
        .fill-gold {
          fill: var(--color-accent);
        }
        .product-title {
          font-size: 1.3rem;
          line-height: 1.15;
          margin-bottom: 0.35rem;
          letter-spacing: 0.02em;
        }
        .product-title a {
          color: #FFFFFF;
          transition: color 0.15s;
        }
        .product-title a:hover {
          color: var(--color-accent);
        }
        .product-tagline {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .variants-selector-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }
        .variant-pill {
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-sm);
          background: #0B0E16;
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          transition: all 0.15s;
        }
        .variant-pill:hover {
          border-color: var(--color-accent);
          color: #FFF;
        }
        .variant-pill.active {
          background: rgba(229, 184, 105, 0.15);
          color: var(--color-accent);
          border-color: var(--color-accent);
        }
        .price-stock-row {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 0.85rem;
          margin-bottom: 1rem;
          border-top: 1px solid var(--color-border);
        }
        .price-wrap {
          display: flex;
          flex-direction: column;
        }
        .current-price {
          font-family: var(--font-display);
          font-size: 1.7rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.02em;
          line-height: 1;
        }
        .compare-price {
          font-size: 0.85rem;
          color: var(--color-text-subtle);
          text-decoration: line-through;
          margin-top: 0.15rem;
        }
        .stock-indicator {
          font-size: 0.75rem;
          font-weight: 700;
        }
        .stock-badge-ok, .stock-badge-warn, .stock-badge-out {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .stock-badge-ok { color: #34D399; }
        .stock-badge-warn { color: #FBBF24; }
        .stock-badge-out { color: #F87171; }
        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .dot-ok {
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }
        .dot-warn {
          background: #F59E0B;
          box-shadow: 0 0 8px #F59E0B;
        }
        .add-to-cart-btn {
          font-size: 1rem;
          padding: 0.75rem 1rem;
        }
      `}</style>
    </div>
  );
};
