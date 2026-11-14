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
          <span className="badge badge-accent">-{discountPercent}% OFF</span>
        )}
        {product.isBestSeller && (
          <span className="badge badge-dark">Más Vendido</span>
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
      </Link>

      {/* Content */}
      <div className="product-card-body">
        <div className="product-brand-rating">
          <span className="product-brand">{product.brand}</span>
          <div className="product-rating">
            <Star size={13} className="text-accent fill-accent" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="rating-count">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="product-title">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>

        <p className="product-tagline">{product.tagline}</p>

        {/* Variant Pills Selector if more than 1 variant */}
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

          <div className="stock-label">
            {selectedVariant.stock <= 5 && selectedVariant.stock > 0 ? (
              <span className="stock-warning">¡Solo {selectedVariant.stock} en stock!</span>
            ) : selectedVariant.stock > 0 ? (
              <span className="stock-ok">Stock disponible</span>
            ) : (
              <span className="stock-out">Sin stock</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={selectedVariant.stock <= 0}
          className={`btn btn-block ${addedAnimation ? 'btn-secondary' : 'btn-primary'} add-to-cart-btn`}
        >
          {addedAnimation ? (
            <>
              <Check size={16} className="text-success" />
              <span>¡Agregado al Carrito!</span>
            </>
          ) : selectedVariant.stock > 0 ? (
            <>
              <ShoppingBag size={16} />
              <span>Agregar al Carrito</span>
            </>
          ) : (
            <span>Sin Stock Momentáneo</span>
          )}
        </button>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          position: relative;
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .card-badge-wrap {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
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
          background: #F1F5F9;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-main-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .product-card:hover .product-main-img {
          transform: scale(1.05);
        }
        .product-card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .product-brand-rating {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          margin-bottom: 0.4rem;
        }
        .product-brand {
          font-weight: 700;
          color: var(--color-text-subtle);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .rating-count {
          color: var(--color-text-subtle);
          font-weight: 400;
        }
        .fill-accent {
          fill: var(--color-accent);
        }
        .product-title {
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 0.35rem;
        }
        .product-title a {
          color: var(--color-primary);
        }
        .product-title a:hover {
          color: var(--color-accent-hover);
        }
        .product-tagline {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin-bottom: 0.85rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .variants-selector-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }
        .variant-pill {
          font-size: 0.725rem;
          font-weight: 600;
          padding: 0.25rem 0.55rem;
          border-radius: var(--radius-sm);
          background: var(--color-bg-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          transition: all 0.15s;
        }
        .variant-pill:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .variant-pill.active {
          background: var(--color-primary);
          color: #FFFFFF;
          border-color: var(--color-primary);
        }
        .price-stock-row {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 0.75rem;
          margin-bottom: 0.85rem;
          border-top: 1px solid var(--color-border);
        }
        .price-wrap {
          display: flex;
          flex-direction: column;
        }
        .current-price {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
        }
        .compare-price {
          font-size: 0.8rem;
          color: var(--color-text-subtle);
          text-decoration: line-through;
          margin-top: 0.2rem;
        }
        .stock-label {
          font-size: 0.75rem;
          font-weight: 600;
        }
        .stock-ok {
          color: var(--color-success);
        }
        .stock-warning {
          color: var(--color-warning);
        }
        .stock-out {
          color: var(--color-danger);
        }
        .add-to-cart-btn {
          font-size: 0.875rem;
          padding: 0.65rem 1rem;
        }
      `}</style>
    </div>
  );
};
