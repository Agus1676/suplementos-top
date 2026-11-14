import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  ShoppingBag, 
  Check, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  Plus, 
  Minus, 
  Sparkles, 
  ArrowLeft,
  CreditCard
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatARS, formatInstallments, calculateDiscountPercentage } from '../../lib/utils';
import { ProductVariant } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, settings } = useStore();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="container not-found-wrap">
        <h2>Producto no encontrado</h2>
        <p>El suplemento que estás buscando no existe o fue despublicado.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.isDefault) || product.variants[0]
  );
  const [selectedImage, setSelectedImage] = useState(product.images[0]?.url);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const discountPercent = calculateDiscountPercentage(
    selectedVariant.priceInCents,
    selectedVariant.compareAtPriceInCents
  );

  const handleAddToCart = () => {
    if (selectedVariant.stock > 0) {
      addItem(product, selectedVariant, quantity);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant.stock > 0) {
      addItem(product, selectedVariant, quantity);
      navigate('/checkout');
    }
  };

  return (
    <div className="container product-detail-page">
      {/* Breadcrumb */}
      <nav className="detail-breadcrumb">
        <Link to="/"><ArrowLeft size={14} /> Inicio</Link>
        <span>/</span>
        <Link to={`/catalogo?categoria=${product.category.slug}`}>{product.category.name}</Link>
        <span>/</span>
        <span className="current-crumb">{product.name}</span>
      </nav>

      <div className="product-detail-grid">
        {/* Left Column: Gallery */}
        <div className="gallery-section">
          <div className="main-image-wrap">
            {discountPercent > 0 && (
              <span className="badge badge-red discount-badge">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={selectedImage || product.images[0]?.url}
              alt={product.name}
              className="main-detail-img"
            />
          </div>

          {product.images.length > 1 && (
            <div className="thumbnails-row">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.url)}
                  className={`thumbnail-btn ${selectedImage === img.url ? 'active' : ''}`}
                >
                  <img src={img.url} alt={img.altText} />
                </button>
              ))}
            </div>
          )}

          {/* Guarantee Badges */}
          <div className="detail-guarantees-card">
            <div className="guarantee-item">
              <ShieldCheck size={22} className="text-red" />
              <div>
                <strong>100% PUREZA Y CALIDAD</strong>
                <p>Materias primas originales selladas de fábrica.</p>
              </div>
            </div>
            <div className="guarantee-item">
              <Truck size={22} className="text-red" />
              <div>
                <strong>DESPACHO EN EL DÍA</strong>
                <p>Embalaje protector hermético desde Recoleta.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Purchase Options */}
        <div className="info-section">
          <div className="brand-rating-header">
            <span className="product-brand-tag">{product.brand}</span>
            <div className="product-stars">
              <Star size={15} className="star-icon" />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-gray-500">({product.reviewCount} opiniones)</span>
            </div>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>
          <p className="detail-tagline">{product.tagline}</p>

          {/* Price Box */}
          <div className="detail-price-box">
            <div className="price-values">
              <span className="detail-current-price">
                {formatARS(selectedVariant.priceInCents)}
              </span>
              {selectedVariant.compareAtPriceInCents && selectedVariant.compareAtPriceInCents > selectedVariant.priceInCents && (
                <span className="detail-compare-price">
                  {formatARS(selectedVariant.compareAtPriceInCents)}
                </span>
              )}
            </div>

            {/* Installments text (ENA style) */}
            <div className="installments-callout">
              <CreditCard size={18} className="text-green-600" />
              <span><strong>{formatInstallments(selectedVariant.priceInCents, 3)}</strong> con Mercado Pago</span>
            </div>
          </div>

          {/* Variant Selector: Flavor */}
          {product.variants.some((v) => v.flavor) && (
            <div className="variant-select-section">
              <label className="variant-label">
                SABOR SELECCIONADO: <strong>{selectedVariant.flavor}</strong>
              </label>
              <div className="variants-buttons-grid">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`variant-option-btn ${selectedVariant.id === v.id ? 'active' : ''}`}
                    disabled={v.stock <= 0}
                  >
                    <span>{v.flavor}</span>
                    {v.size && <span className="variant-size-hint">({v.size})</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Notification */}
          <div className="detail-stock-status">
            {selectedVariant.stock <= 0 ? (
              <span className="text-red-600 font-bold">⚠️ Agotado momentáneamente</span>
            ) : selectedVariant.stock <= 5 ? (
              <span className="text-amber-600 font-bold">
                ⚠️ ¡ÚLTIMAS {selectedVariant.stock} UNIDADES EN STOCK!
              </span>
            ) : (
              <span className="text-green-600 font-bold">
                ✓ En stock disponible para entrega inmediata (SKU: {selectedVariant.sku})
              </span>
            )}
          </div>

          {/* Purchase Actions */}
          <div className="purchase-controls-row">
            <div className="quantity-box">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-change-btn"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="qty-number">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                className="qty-change-btn"
                disabled={quantity >= selectedVariant.stock}
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock <= 0}
              className={`btn ${addedSuccess ? 'btn-secondary' : 'btn-primary'} btn-lg flex-1`}
            >
              {addedSuccess ? (
                <>
                  <Check size={18} className="text-green-600" />
                  <span>¡AGREGADO AL CARRITO!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>AGREGAR AL CARRITO</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={selectedVariant.stock <= 0}
              className="btn btn-secondary btn-lg"
            >
              COMPRAR AHORA
            </button>
          </div>

          {/* Delivery & Pickup Info */}
          <div className="delivery-highlights-box">
            <div className="delivery-card-item">
              <MapPin size={22} className="text-red flex-shrink-0" />
              <div>
                <strong>RETIRO HOY MISMO GRATIS EN RECOLETA</strong>
                <p>{settings.pickupAddress}</p>
                <small className="text-gray-500">Horarios: {settings.hoursDescription}</small>
              </div>
            </div>

            <div className="delivery-card-item">
              <Truck size={22} className="text-red flex-shrink-0" />
              <div>
                <strong>ENVÍOS A DOMICILIO A TODO EL PAÍS</strong>
                <p>CABA, GBA e Interior con despacho prioritario.</p>
                <small className="text-green-600 font-bold">Envío gratis en compras mayores a $85.000</small>
              </div>
            </div>

            <div className="delivery-card-item whatsapp-box">
              <Phone size={22} className="text-green-600 flex-shrink-0" />
              <div>
                <strong>¿CONSULTAS SOBRE ESTE SUPLEMENTO?</strong>
                <p>Chateá en directo con nuestro equipo deportivo.</p>
                <a
                  href={`https://wa.me/5491165651990?text=${encodeURIComponent(`Hola! Quisiera consultar sobre el producto: ${product.name} (${selectedVariant.title})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-inline-link text-green-700"
                >
                  Consultar por WhatsApp al 11 6565 1990 →
                </a>
              </div>
            </div>
          </div>

          {/* Description & Nutritional info */}
          <div className="product-description-wrap">
            <h3 className="section-subheading">DESCRIPCIÓN Y MODO DE USO</h3>
            <p className="description-text">{product.description}</p>

            {product.servingInfo && (
              <div className="serving-info-pill">
                <Sparkles size={16} className="text-red" />
                <span><strong>RENDIMIENTO:</strong> {product.servingInfo}</span>
              </div>
            )}

            {product.nutritionalHighlights && (
              <div className="highlights-list-wrap">
                <h4>BENEFICIOS CLAVE:</h4>
                <ul className="nutritional-bullets">
                  {product.nutritionalHighlights.map((hl, i) => (
                    <li key={i}>
                      <Check size={14} className="text-green-600" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
        }
        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #6B7280;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .detail-breadcrumb a {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #111827;
          font-weight: 500;
        }
        .detail-breadcrumb a:hover {
          color: var(--color-brand-red);
        }
        .current-crumb {
          color: #9CA3AF;
        }
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        @media (min-width: 992px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1.15fr;
          }
        }
        .gallery-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .main-image-wrap {
          position: relative;
          background: #F9FAFB;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .main-detail-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .discount-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 0.85rem;
          padding: 0.35rem 0.75rem;
        }
        .thumbnails-row {
          display: flex;
          gap: 0.75rem;
        }
        .thumbnail-btn {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--color-border);
          overflow: hidden;
          background: #F9FAFB;
          padding: 0.25rem;
        }
        .thumbnail-btn.active {
          border-color: #111827;
        }
        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .detail-guarantees-card {
          background: #F8F9FA;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .guarantee-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.8rem;
        }
        .guarantee-item strong {
          color: #111827;
          display: block;
          font-size: 0.85rem;
        }
        .guarantee-item p {
          color: #6B7280;
        }
        .info-section {
          display: flex;
          flex-direction: column;
        }
        .brand-rating-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .product-brand-tag {
          font-weight: 800;
          font-size: 0.85rem;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .product-stars {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
        }
        .star-icon {
          color: #F59E0B;
          fill: #F59E0B;
        }
        .text-red {
          color: var(--color-brand-red);
        }
        .detail-product-title {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1.15;
          margin-bottom: 0.5rem;
          color: #111827;
        }
        .detail-tagline {
          font-size: 1rem;
          color: #4B5563;
          margin-bottom: 1.5rem;
        }
        .detail-price-box {
          background: #F8F9FA;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .price-values {
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }
        .detail-current-price {
          font-size: 2.4rem;
          font-weight: 900;
          color: #111827;
          line-height: 1;
        }
        .detail-compare-price {
          font-size: 1.25rem;
          color: #9CA3AF;
          text-decoration: line-through;
        }
        .installments-callout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #065F46;
        }
        .variant-select-section {
          margin-bottom: 1.5rem;
        }
        .variant-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.65rem;
        }
        .variants-buttons-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }
        .variant-option-btn {
          border: 1.5px solid var(--color-border);
          background: #FFFFFF;
          color: #111827;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.15s;
        }
        .variant-option-btn:hover {
          border-color: #111827;
        }
        .variant-option-btn.active {
          border-color: #111827;
          background: #111827;
          color: #FFFFFF;
        }
        .variant-size-hint {
          font-size: 0.775rem;
          opacity: 0.8;
        }
        .detail-stock-status {
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .purchase-controls-row {
          display: flex;
          gap: 0.85rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .quantity-box {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: #FFFFFF;
        }
        .qty-change-btn {
          padding: 0.75rem 1rem;
          color: #111827;
        }
        .qty-change-btn:disabled {
          opacity: 0.3;
        }
        .qty-number {
          font-size: 1.05rem;
          font-weight: 700;
          min-width: 25px;
          text-align: center;
        }
        .delivery-highlights-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #F8F9FA;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
        }
        .delivery-card-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          font-size: 0.85rem;
        }
        .delivery-card-item strong {
          color: #111827;
          display: block;
        }
        .delivery-card-item p {
          color: #4B5563;
        }
        .whatsapp-box {
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
        }
        .whatsapp-inline-link {
          display: inline-block;
          margin-top: 0.25rem;
          font-weight: 700;
          text-decoration: underline;
        }
        .product-description-wrap {
          border-top: 1px solid var(--color-border);
          padding-top: 1.5rem;
        }
        .section-subheading {
          font-size: 1.25rem;
          margin-bottom: 0.85rem;
        }
        .description-text {
          font-size: 0.95rem;
          color: #4B5563;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .serving-info-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #F3F4F6;
          border: 1px solid var(--color-border);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: #111827;
          margin-bottom: 1.5rem;
        }
        .highlights-list-wrap h4 {
          font-size: 1rem;
          margin-bottom: 0.65rem;
        }
        .nutritional-bullets {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
        }
        @media (min-width: 600px) {
          .nutritional-bullets {
            grid-template-columns: 1fr 1fr;
          }
        }
        .nutritional-bullets li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }
      `}</style>
    </div>
  );
};
