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
  ArrowLeft 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatARS, calculateDiscountPercentage } from '../../lib/utils';
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
        <Link to="/"><ArrowLeft size={14} /> INICIO</Link>
        <span>/</span>
        <Link to={`/catalogo?categoria=${product.category.slug}`}>{product.category.name.toUpperCase()}</Link>
        <span>/</span>
        <span className="current-crumb">{product.name.toUpperCase()}</span>
      </nav>

      <div className="product-detail-grid">
        {/* Left Column: Gallery */}
        <div className="gallery-section">
          <div className="main-image-wrap">
            {discountPercent > 0 && (
              <span className="badge badge-gold discount-badge">
                -{discountPercent}% OFF
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

          {/* Guarantees Box */}
          <div className="detail-guarantees-card">
            <div className="guarantee-item">
              <ShieldCheck size={22} className="text-gold" />
              <div>
                <strong>100% PUREZA CERTIFICADA</strong>
                <p>Materias primas originales selladas de laboratorio.</p>
              </div>
            </div>
            <div className="guarantee-item">
              <Truck size={22} className="text-gold" />
              <div>
                <strong>DESPACHO INMEDIATO</strong>
                <p>Embalaje hermético protector desde Recoleta.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information & Purchase Options */}
        <div className="info-section">
          <div className="brand-rating-header">
            <span className="product-brand-tag">{product.brand}</span>
            <div className="product-stars">
              <Star size={15} className="text-gold fill-gold" />
              <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
              <span className="text-muted">({product.reviewCount} opiniones de atletas)</span>
            </div>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>
          <p className="detail-tagline">{product.tagline}</p>

          {/* Price Box */}
          <div className="detail-price-box">
            <div className="price-values">
              <span className="detail-current-price text-gold">
                {formatARS(selectedVariant.priceInCents)}
              </span>
              {selectedVariant.compareAtPriceInCents && selectedVariant.compareAtPriceInCents > selectedVariant.priceInCents && (
                <span className="detail-compare-price">
                  {formatARS(selectedVariant.compareAtPriceInCents)}
                </span>
              )}
            </div>
            <span className="mp-installments-pill">
              Hasta 3 cuotas sin interés con Mercado Pago
            </span>
          </div>

          {/* Variant Selector: Flavor */}
          {product.variants.some((v) => v.flavor) && (
            <div className="variant-select-section">
              <label className="variant-label">
                SABOR SELECCIONADO: <strong className="text-gold">{selectedVariant.flavor}</strong>
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
              <span className="text-danger font-bold">⚠️ Agotado momentáneamente</span>
            ) : selectedVariant.stock <= 5 ? (
              <span className="text-warning font-bold">
                ⚠️ ¡ÚLTIMAS {selectedVariant.stock} UNIDADES EN STOCK!
              </span>
            ) : (
              <span className="text-success font-bold">
                ✓ En stock físico para entrega inmediata (SKU: {selectedVariant.sku})
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
                  <Check size={18} className="text-success" />
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

          {/* Delivery Location Info */}
          <div className="delivery-highlights-box">
            <div className="delivery-card-item">
              <MapPin size={22} className="text-gold flex-shrink-0" />
              <div>
                <strong>RETIRO HOY MISMO GRATIS EN RECOLETA</strong>
                <p>{settings.pickupAddress}</p>
                <small className="text-muted">Horarios: {settings.hoursDescription}</small>
              </div>
            </div>

            <div className="delivery-card-item">
              <Truck size={22} className="text-gold flex-shrink-0" />
              <div>
                <strong>ENVÍOS A DOMICILIO A TODO EL PAÍS</strong>
                <p>CABA, GBA e Interior con despacho prioritario.</p>
                <small className="text-success font-bold">Envío gratis en compras mayores a $85.000</small>
              </div>
            </div>

            <div className="delivery-card-item whatsapp-box">
              <Phone size={22} className="text-gold flex-shrink-0" />
              <div>
                <strong>¿CONSULTAS SOBRE ESTE SUPLEMENTO?</strong>
                <p>Chateá en directo con nuestro equipo de asesores.</p>
                <a
                  href={`https://wa.me/5491165651990?text=${encodeURIComponent(`Hola! Quisiera consultar sobre el producto: ${product.name} (${selectedVariant.title})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-inline-link text-gold"
                >
                  Consultar por WhatsApp al 11 6565 1990 →
                </a>
              </div>
            </div>
          </div>

          {/* Description & Nutritional */}
          <div className="product-description-wrap">
            <h3 className="section-subheading">DESCRIPCIÓN Y MODO DE USO</h3>
            <p className="description-text">{product.description}</p>

            {product.servingInfo && (
              <div className="serving-info-pill">
                <Sparkles size={16} className="text-gold" />
                <span><strong>RENDIMIENTO:</strong> {product.servingInfo}</span>
              </div>
            )}

            {product.nutritionalHighlights && (
              <div className="highlights-list-wrap">
                <h4>BENEFICIOS CLAVE:</h4>
                <ul className="nutritional-bullets">
                  {product.nutritionalHighlights.map((hl, i) => (
                    <li key={i}>
                      <Check size={14} className="text-gold" />
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
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .detail-breadcrumb a {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: #FFF;
        }
        .detail-breadcrumb a:hover {
          color: var(--color-accent);
        }
        .current-crumb {
          color: var(--color-accent);
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
          background: #0B0E16;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-sm);
        }
        .main-detail-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          border-radius: var(--radius-md);
          border: 1.5px solid var(--color-border);
          overflow: hidden;
          background: #000;
        }
        .thumbnail-btn.active {
          border-color: var(--color-accent);
        }
        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .detail-guarantees-card {
          background: #121724;
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
          color: #FFF;
          font-family: var(--font-display);
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          display: block;
        }
        .guarantee-item p {
          color: var(--color-text-muted);
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
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--color-accent);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .product-stars {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.85rem;
        }
        .detail-product-title {
          font-size: 2.6rem;
          line-height: 1.05;
          margin-bottom: 0.5rem;
        }
        .detail-tagline {
          font-size: 1rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
        }
        .detail-price-box {
          background: #121724;
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
          gap: 1.25rem;
        }
        .detail-current-price {
          font-family: var(--font-display);
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1;
        }
        .detail-compare-price {
          font-family: var(--font-display);
          font-size: 1.4rem;
          color: var(--color-text-subtle);
          text-decoration: line-through;
        }
        .mp-installments-pill {
          font-size: 0.85rem;
          font-weight: 600;
          color: #009EE3;
        }
        .variant-select-section {
          margin-bottom: 1.5rem;
        }
        .variant-label {
          display: block;
          font-family: var(--font-display);
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          color: var(--color-text-muted);
          margin-bottom: 0.65rem;
        }
        .variants-buttons-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }
        .variant-option-btn {
          border: 1.5px solid var(--color-border);
          background: #0B0E16;
          color: #FFF;
          padding: 0.75rem 1.2rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.15s;
        }
        .variant-option-btn:hover {
          border-color: var(--color-accent);
        }
        .variant-option-btn.active {
          border-color: var(--color-accent);
          background: rgba(229, 184, 105, 0.15);
          color: var(--color-accent);
        }
        .variant-size-hint {
          font-size: 0.8rem;
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
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: #0B0E16;
        }
        .qty-change-btn {
          padding: 0.85rem 1.15rem;
          color: #FFF;
        }
        .qty-change-btn:disabled {
          opacity: 0.3;
        }
        .qty-number {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 800;
          color: #FFF;
          min-width: 30px;
          text-align: center;
        }
        .delivery-highlights-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #121724;
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
          color: #FFF;
          font-family: var(--font-display);
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          display: block;
        }
        .delivery-card-item p {
          color: var(--color-text-muted);
        }
        .whatsapp-box {
          background: rgba(229, 184, 105, 0.06);
          border: 1px solid var(--color-border-gold);
          padding: 0.95rem 1.25rem;
          border-radius: var(--radius-md);
        }
        .whatsapp-inline-link {
          display: inline-block;
          margin-top: 0.25rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
          text-decoration: underline;
        }
        .product-description-wrap {
          border-top: 1px solid var(--color-border);
          padding-top: 1.5rem;
        }
        .section-subheading {
          font-size: 1.35rem;
          margin-bottom: 0.85rem;
        }
        .description-text {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .serving-info-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #121724;
          border: 1px solid var(--color-border);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: #CBD5E1;
          margin-bottom: 1.5rem;
        }
        .highlights-list-wrap h4 {
          font-size: 1.05rem;
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
          color: #E2E8F0;
        }
      `}</style>
    </div>
  );
};
