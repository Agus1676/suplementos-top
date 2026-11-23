import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Product } from '../../types';
import { formatARS } from '../../lib/utils';
import { useCart } from '../../context/CartContext';

const TRANSFER_DISCOUNT = 0.10;
const INSTALLMENTS_COUNT = 6;
const FALLBACK_PACKSHOT =
  'https://acdn-us.mitiendanube.com/stores/001/247/962/products/truemade_vainilla_2lb-webp1-0f17ea0eb698979f4916826203173730-640-0.webp';

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
    sku: 'ST-DEF',
  };

  const listPrice = primaryVariant.priceInCents;
  const transferPrice = Math.round(listPrice * (1 - TRANSFER_DISCOUNT));
  const installmentPrice = Math.round(listPrice / INSTALLMENTS_COUNT);

  const beforePrice =
    ('compareAtPriceInCents' in primaryVariant && primaryVariant.compareAtPriceInCents) ||
    product.compareAtPriceInCents ||
    0;
  const discountPercent =
    beforePrice > listPrice ? Math.round(((beforePrice - listPrice) / beforePrice) * 100) : 0;

  const isOutOfStock = product.variants.length > 0 && product.variants.every((v) => v.stock <= 0);
  const rawImage = product.images[0]?.url;
  const imageUrl = !rawImage || rawImage === '/logo.jpg' || rawImage === '/logo.png' ? FALLBACK_PACKSHOT : rawImage;
  const reviewCount = product.reviewCount || 74;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) addItem(product, primaryVariant, 1);
  };

  return (
    <article className="pv-card">
      <Link to={`/producto/${product.slug}`} className="pv-card-link">
        <div className="pv-card-media">
          {discountPercent > 0 && (
            <span className="pv-card-ribbon">{discountPercent}% OFF</span>
          )}
          <img
            src={imageUrl}
            alt={product.name}
            className="pv-card-img"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_PACKSHOT;
            }}
          />
        </div>

        <div className="pv-card-body">
          <h3 className="pv-card-title">{product.name}</h3>

          <div className="pv-card-rating" aria-label={`Calificación ${product.rating} de 5`}>
            <span className="pv-stars" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
              ))}
            </span>
            <span className="pv-rating-text">
              <strong>{product.rating.toFixed(1)}</strong> ({reviewCount})
            </span>
          </div>

          <div className="pv-list-price">{formatARS(listPrice)},00</div>

          <div className="pv-transfer-box">
            <strong>{formatARS(transferPrice)} por</strong>
            <span>Transferencia</span>
          </div>

          <div className="pv-mp-box">
            <div className="pv-mp-line">
              <strong>
                {INSTALLMENTS_COUNT} x {formatARS(installmentPrice)} sin interés
              </strong>
            </div>
            <div className="pv-mp-brand-row">
              <span>con</span>
              <img 
                src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.5/mercadopago/logo__small@2x.png" 
                alt="Mercado Pago" 
                className="pv-mp-logo"
              />
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleQuickAdd}
        disabled={isOutOfStock}
        className="pv-add-btn"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
      </button>

      <style>{`
        .pv-card {
          background: #FFFFFF;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 0.5rem;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pv-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 26px -10px rgba(15, 23, 42, 0.14);
        }
        .pv-card-link {
          display: flex;
          flex-direction: column;
          flex: 1;
          text-decoration: none;
          color: inherit;
        }
        .pv-card-media {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.4rem;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        .pv-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.25s ease;
        }
        .pv-card:hover .pv-card-img {
          transform: scale(1.04);
        }
        .pv-card-ribbon {
          position: absolute;
          top: 12px;
          right: -28px;
          background: #B91C1C;
          color: #FFFFFF;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.22rem 2rem;
          transform: rotate(45deg);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.18);
          z-index: 2;
        }
        .pv-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .pv-card-title {
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 400;
          color: #52525B;
          line-height: 1.35;
          margin: 0 0 0.35rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 2.15rem;
        }
        .pv-card-rating {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-bottom: 0.3rem;
        }
        .pv-stars {
          display: inline-flex;
          gap: 1px;
        }
        .pv-rating-text {
          font-size: 0.76rem;
          color: #27272A;
        }
        .pv-rating-text strong {
          font-weight: 700;
        }
        .pv-list-price {
          font-size: 0.82rem;
          font-weight: 700;
          color: #27272A;
          margin-bottom: 0.45rem;
        }
        .pv-transfer-box {
          background: #5B8C2A;
          color: #FFFFFF;
          border-radius: 5px;
          padding: 0.5rem 0.65rem;
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          margin-bottom: 0.4rem;
        }
        .pv-transfer-box strong {
          font-family: var(--font-display);
          font-size: 0.98rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .pv-transfer-box span {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .pv-mp-box {
          background: #F4F5F7;
          border-radius: 5px;
          padding: 0.45rem 0.65rem;
          margin-bottom: 0.55rem;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .pv-mp-line {
          font-size: 0.74rem;
          color: #18181B;
        }
        .pv-mp-line strong {
          font-weight: 700;
        }
        .pv-mp-brand-row {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.72rem;
          color: #3F3F46;
          font-weight: 600;
        }
        .pv-mp-logo {
          height: 15px;
          width: auto;
          object-fit: contain;
          vertical-align: middle;
          display: inline-block;
        }
        .pv-add-btn {
          width: 100%;
          background: var(--color-accent);
          color: #FFFFFF;
          border: none;
          border-radius: 5px;
          padding: 0.58rem 0.75rem;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .pv-add-btn:hover:not(:disabled) {
          background: var(--color-accent-hover);
        }
        .pv-add-btn:disabled {
          background: #CBD5E1;
          cursor: not-allowed;
        }
        @media (min-width: 768px) {
          .pv-card {
            padding: 0.65rem;
          }
          .pv-transfer-box strong {
            font-size: 1.08rem;
          }
        }
      `}</style>
    </article>
  );
};
