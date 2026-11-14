import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product, ProductVariant } from '../../types';
import { formatARS, formatInstallments, calculateDiscountPercentage } from '../../lib/utils';
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
          <span className="badge badge-red">{discountPercent}% OFF</span>
        )}
        {product.isBestSeller && (
          <span className="badge badge-black">MÁS VENDIDO</span>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/producto/${product.slug}`} className="product-image-container">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.altText || product.name}
          className="product-main-img"
          loading="lazy"
        />
      </Link>

      {/* Card Body */}
      <div className="product-card-body">
        <div className="product-brand-rating">
          <span className="product-brand">{product.brand}</span>
          <div className="product-rating">
            <Star size={13} className="star-icon" />
            <span className="rating-val">{product.rating.toFixed(1)}</span>
            <span className="rating-count">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="product-title">
          <Link to={`/producto/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Variant selector pills if >1 */}
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

        {/* Pricing Block */}
        <div className="price-block">
          <div className="price-row">
            <span className="current-price">
              {formatARS(selectedVariant.priceInCents)}
            </span>
            {selectedVariant.compareAtPriceInCents && selectedVariant.compareAtPriceInCents > selectedVariant.priceInCents && (
              <span className="compare-price">
                {formatARS(selectedVariant.compareAtPriceInCents)}
              </span>
            )}
          </div>

          {/* Real Argentine Installment Text (like ENA Sport) */}
          <div className="installments-text">
            <span>💳 {formatInstallments(selectedVariant.priceInCents, 3)}</span>
          </div>

          <div className="stock-info">
            {selectedVariant.stock <= 5 && selectedVariant.stock > 0 ? (
              <span className="stock-warn">¡Últimas {selectedVariant.stock} unidades en stock!</span>
            ) : selectedVariant.stock > 0 ? (
              <span className="stock-ok">✓ En stock para entrega inmediata</span>
            ) : (
              <span className="stock-out">Sin stock momentáneo</span>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleAddToCart}
          disabled={selectedVariant.stock <= 0}
          className={`btn btn-block ${addedAnimation ? 'btn-secondary' : 'btn-primary'} add-btn`}
        >
          {addedAnimation ? (
            <>
              <Check size={16} className="text-green-600" />
              <span>¡Agregado al Carrito!</span>
            </>
          ) : selectedVariant.stock > 0 ? (
            <>
              <ShoppingBag size={16} />
              <span>AGREGAR AL CARRITO</span>
            </>
          ) : (
            <span>AGOTADO</span>
          )}
        </button>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .product-card:hover {
          border-color: #9CA3AF;
          box-shadow: var(--shadow-md);
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
          background: #F9FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border);
        }
        .product-main-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.25s ease;
        }
        .product-card:hover .product-main-img {
          transform: scale(1.04);
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
          margin-bottom: 0.4rem;
        }
        .product-brand {
          font-size: 0.75rem;
          font-weight: 700;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          font-size: 0.775rem;
        }
        .star-icon {
          color: #F59E0B;
          fill: #F59E0B;
        }
        .rating-val {
          font-weight: 700;
          color: #111827;
        }
        .rating-count {
          color: #9CA3AF;
        }
        .product-title {
          font-size: 1rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.35;
          margin-bottom: 0.65rem;
          min-height: 2.7rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-title a {
          color: #111827;
        }
        .product-title a:hover {
          color: var(--color-brand-red);
        }
        .variants-selector-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.85rem;
        }
        .variant-pill {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          background: #F3F4F6;
          color: #4B5563;
          border: 1px solid #E5E7EB;
          transition: all 0.15s;
        }
        .variant-pill:hover {
          border-color: #111827;
          color: #111827;
        }
        .variant-pill.active {
          background: #111827;
          color: #FFFFFF;
          border-color: #111827;
        }
        .price-block {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding-top: 0.75rem;
          margin-bottom: 1rem;
          border-top: 1px solid #F3F4F6;
        }
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 0.65rem;
        }
        .current-price {
          font-size: 1.45rem;
          font-weight: 800;
          color: #111827;
          line-height: 1;
        }
        .compare-price {
          font-size: 0.85rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }
        .installments-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-success);
        }
        .stock-info {
          font-size: 0.725rem;
          font-weight: 600;
          margin-top: 0.2rem;
        }
        .stock-ok { color: #059669; }
        .stock-warn { color: #D97706; }
        .stock-out { color: #DC2626; }
        .add-btn {
          font-size: 0.875rem;
          padding: 0.65rem 1rem;
        }
      `}</style>
    </div>
  );
};
