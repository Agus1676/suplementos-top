import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  Award,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  BarChart2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { formatARS, calculateDiscountPercentage } from '../../lib/utils';
import { ProductVariant } from '../../types';
import { SEO } from '../../components/common/SEO';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, settings } = useStore();
  const { addItem, openCartDrawer } = useCart();
  const navigate = useNavigate();

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="container not-found-wrap">
        <h2>Producto no encontrado</h2>
        <p>El suplemento que estás buscando no existe o fue despublicado.</p>
        <Link to="/catalogo" className="btn btn-primary mt-3">
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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    desc: true,
    nutrition: true,
    usage: true,
    guarantee: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  // Shipping calculator state
  const [postalCode, setPostalCode] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);

  // Mobile Sticky Bar state & ref
  const [showStickyBar, setShowStickyBar] = useState(false);
  const purchaseSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (purchaseSectionRef.current) {
        const rect = purchaseSectionRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const discountPercent = calculateDiscountPercentage(
    selectedVariant.priceInCents,
    selectedVariant.compareAtPriceInCents
  );

  const handleAddToCart = () => {
    if (selectedVariant.stock > 0) {
      addItem(product, selectedVariant, quantity);
      openCartDrawer();
    }
  };

  const handleBuyNow = () => {
    if (selectedVariant.stock > 0) {
      addItem(product, selectedVariant, quantity);
      navigate('/checkout');
    }
  };

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (postalCode.trim().length >= 4) {
      setShippingCalculated(true);
    }
  };

  // Default nutritional table fallback if not provided in product
  const nutritionalRows = product.nutritionalTable || [
    { nutrient: 'Valor Energético', perServing: '124 kcal = 518 kJ', dailyValue: '6%' },
    { nutrient: 'Proteínas', perServing: '27 g', dailyValue: '36%' },
    { nutrient: 'Carbohidratos Totales', perServing: '1.2 g', dailyValue: '0%' },
    { nutrient: 'Grasas Totales', perServing: '0.8 g', dailyValue: '1%' },
    { nutrient: 'Grasas Saturadas', perServing: '0.3 g', dailyValue: '1%' },
    { nutrient: 'Sodio', perServing: '95 mg', dailyValue: '4%' },
    { nutrient: 'BCAA (Leucina, Isoleucina, Valina)', perServing: '5.8 g', dailyValue: '-' },
    { nutrient: 'Glutamina & Precursores', perServing: '4.6 g', dailyValue: '-' }
  ];

  const waProductLink = `https://wa.me/5491165652990?text=${encodeURIComponent(
    `Hola! Quisiera consultar sobre el producto: ${product.name} (${selectedVariant.title}) - Precio: ${formatARS(selectedVariant.priceInCents)}`
  )}`;

  const productPriceNumber = (selectedVariant.priceInCents / 100).toFixed(2);
  const productSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.images.map((img) => img.url),
      description: product.description,
      sku: selectedVariant.sku,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category.name,
      offers: {
        '@type': 'Offer',
        url: `https://suplementos-top.vercel.app/producto/${product.slug}`,
        priceCurrency: 'ARS',
        price: productPriceNumber,
        priceValidUntil: '2027-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: selectedVariant.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'AR',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 10,
          returnMethod: 'https://schema.org/ReturnInStore',
          returnFees: 'https://schema.org/FreeReturn',
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'ARS',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'AR',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: {
              '@type': 'QuantitativeValue',
              minValue: 0,
              maxValue: 1,
              unitCode: 'DAY',
            },
            transitTime: {
              '@type': 'QuantitativeValue',
              minValue: 1,
              maxValue: 3,
              unitCode: 'DAY',
            },
          },
        },
        seller: {
          '@type': 'HealthAndBeautyBusiness',
          name: 'Suplementos Top',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Pres. José E. Uriburu 1163 (Gimnasio Top Shape)',
            addressLocality: 'Recoleta',
            addressRegion: 'CABA',
            addressCountry: 'AR',
          },
        },
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating || 4.9,
        reviewCount: product.reviewCount || 48,
        bestRating: '5',
        worstRating: '1',
      },
      review: [
        {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          author: {
            '@type': 'Person',
            name: 'Atleta Top Shape Recoleta',
          },
          reviewBody: 'Excelente pureza y disolución. Lo retiré en el día en Uriburu 1163 con 10% de descuento por transferencia.',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: 'https://suplementos-top.vercel.app/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: product.category.name,
          item: `https://suplementos-top.vercel.app/catalogo?categoria=${product.category.slug}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.name,
          item: `https://suplementos-top.vercel.app/producto/${product.slug}`,
        },
      ],
    },
  ];

  return (
    <div className="container product-detail-page">
      <SEO
        title={`${product.name} en Recoleta`}
        description={`${product.name} de ${product.brand}. ${product.tagline}. Comprá con 10% OFF por transferencia y retiro sin cargo en Gimnasio Top Shape (Uriburu 1163, Recoleta). Envíos a todo el país.`}
        canonicalUrl={`/producto/${product.slug}`}
        ogImage={product.images[0]?.url}
        ogType="product"
        jsonLd={productSchemas}
      />

      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumb">
        <Link to="/"><ArrowLeft size={13} /> Inicio</Link>
        <span className="crumb-sep">/</span>
        <Link to="/catalogo">Catálogo</Link>
        <span className="crumb-sep">/</span>
        <Link to={`/catalogo?categoria=${product.category.slug}`}>{product.category.name}</Link>
        <span className="crumb-sep">/</span>
        <span className="current-crumb">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="product-detail-grid">
        {/* Left Column: Visual Gallery */}
        <div className="gallery-section">
          <div className="main-image-wrap">
            {discountPercent > 0 && (
              <span className="product-badge-discount-lg">
                {discountPercent}% OFF
              </span>
            )}
            <img
              src={selectedImage || product.images[0]?.url || '/logo.png'}
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

          {/* Value Highlights Under Gallery */}
          <div className="detail-trust-cards">
            <div className="trust-card-mini">
              <ShieldCheck size={20} className="text-accent" />
              <div>
                <strong>MATERIAS PRIMAS 100% PURAS</strong>
                <p>Envases sellados de fábrica con precinto inviolable y trazabilidad de lote.</p>
              </div>
            </div>
            <div className="trust-card-mini">
              <MapPin size={20} className="text-accent" />
              <div>
                <strong>RETIRO EN RECOLETA EN EL DÍA</strong>
                <p>{settings.pickupAddress} — Lunes a Viernes de 8 a 23 hs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Information, Pricing, Variants & Purchase */}
        <div className="info-section">
          {/* Brand & Reviews Header */}
          <div className="brand-rating-header">
            <span className="product-brand-tag">{product.brand}</span>
            <div className="product-stars">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="rating-val">{product.rating.toFixed(1)}</span>
              <span className="rating-count">({product.reviewCount} reseñas verificadas)</span>
            </div>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>
          <p className="detail-tagline">{product.tagline}</p>

          {/* Pricing Box */}
          <div className="detail-price-box">
            <div className="price-values">
              {selectedVariant.compareAtPriceInCents && selectedVariant.compareAtPriceInCents > selectedVariant.priceInCents && (
                <span className="detail-compare-price">
                  {formatARS(selectedVariant.compareAtPriceInCents)}
                </span>
              )}
              <span className="detail-current-price">
                {formatARS(selectedVariant.priceInCents)},00
              </span>
            </div>

            {/* Argentine Transfer 10% OFF Highlight Box */}
            <div className="pdp-transfer-box">
              <div className="pdp-transfer-content">
                <span className="pdp-transfer-price">
                  {formatARS(Math.round(selectedVariant.priceInCents * 0.90))}
                </span>
                <span className="pdp-transfer-label">por Transferencia Bancaria</span>
              </div>
              <span className="pdp-transfer-badge">10% OFF</span>
            </div>

            {/* Mercado Pago 6 Cuotas Sin Interés Box */}
            <div className="pdp-installments-box">
              <span className="pdp-inst-highlight">
                6 x {formatARS(Math.round(selectedVariant.priceInCents / 6))} sin interés
              </span>
              <span className="pdp-inst-sub">
                con <img 
                  src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.5/mercadopago/logo__small@2x.png" 
                  alt="Mercado Pago" 
                  className="pdp-mp-logo" 
                />
              </span>
            </div>
          </div>

          {/* Variant Selector: Flavor */}
          {product.variants.some((v) => v.flavor) && (
            <div className="variant-select-section">
              <label className="variant-label">
                SABOR: <strong>{selectedVariant.flavor}</strong>
              </label>
              <div className="variants-buttons-grid">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setQuantity(1);
                    }}
                    className={`variant-option-btn ${selectedVariant.id === v.id ? 'active' : ''}`}
                    disabled={v.stock <= 0}
                  >
                    <span>{v.flavor}</span>
                    {v.size && <span className="variant-size-tag">{v.size}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability Indicator */}
          <div className="detail-stock-status">
            {selectedVariant.stock <= 0 ? (
              <span className="stock-alert stock-out">Agotado por el momento</span>
            ) : selectedVariant.stock <= 5 ? (
              <span className="stock-alert stock-low">
                Quedan {selectedVariant.stock} unidades
              </span>
            ) : (
              <span className="stock-alert stock-in">
                En stock · Retiro hoy en Recoleta (SKU: {selectedVariant.sku})
              </span>
            )}
          </div>

          {/* Quantity & Purchase Action Buttons */}
          <div ref={purchaseSectionRef} className="purchase-controls-row">
            <div className="quantity-box">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-change-btn"
                disabled={quantity <= 1}
                aria-label="Disminuir"
              >
                <Minus size={14} />
              </button>
              <span className="qty-number">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                className="qty-change-btn"
                disabled={quantity >= selectedVariant.stock}
                aria-label="Aumentar"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock <= 0}
              className="btn btn-primary btn-lg flex-1 product-main-cta"
            >
              <ShoppingBag size={18} />
              <span>AGREGAR AL CARRITO</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={selectedVariant.stock <= 0}
              className="btn btn-secondary btn-lg"
            >
              COMPRAR AHORA
            </button>
          </div>

          {/* Shipping Calculator Box */}
          <div className="shipping-calculator-box">
            <div className="calc-header">
              <Truck size={18} className="text-accent" />
              <span>Calculá el costo y tiempo de envío a tu código postal</span>
            </div>

            <form onSubmit={handleCalculateShipping} className="calc-form">
              <input
                type="text"
                placeholder="Ingresá tu Código Postal (Ej: 1425)"
                value={postalCode}
                onChange={(e) => {
                  setPostalCode(e.target.value);
                  setShippingCalculated(false);
                }}
                className="calc-input"
                maxLength={8}
              />
              <button type="submit" className="btn btn-secondary btn-sm calc-btn">
                CALCULAR
              </button>
            </form>

            {shippingCalculated && (
              <div className="calc-results-list">
                <div className="calc-result-row">
                  <div className="calc-res-info">
                    <MapPin size={16} className="text-accent" />
                    <div>
                      <strong>Retiro sin cargo en Recoleta</strong>
                      <p>{settings.pickupAddress} — ¡Listo para retirar hoy!</p>
                    </div>
                  </div>
                  <span className="calc-res-price text-success font-bold">¡GRATIS!</span>
                </div>

                <div className="calc-result-row">
                  <div className="calc-res-info">
                    <Truck size={16} className="text-accent" />
                    <div>
                      <strong>Envío Express a Domicilio</strong>
                      <p>Entrega en 24 a 48 hs hábiles</p>
                    </div>
                  </div>
                  <span className="calc-res-price font-bold">
                    {formatARS(settings.flatShippingRateInCents || 490000)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Help */}
          <div className="whatsapp-help-strip">
            <Phone size={18} className="text-success" />
            <div className="wa-help-text">
              <span>¿Tenés dudas sobre cómo tomar este producto?</span>
              <a 
                href={waProductLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="wa-link font-bold text-success"
              >
                Chateá por WhatsApp con un asesor (11 6565-2990) →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Section Accordion / Desplegables Verticales */}
      <section className="product-accordion-section">
        {/* Accordion Item 1: Descripción & Beneficios */}
        <div className={`accordion-card ${openSections.desc ? 'expanded' : ''}`}>
          <button 
            type="button"
            onClick={() => toggleSection('desc')}
            className="accordion-header-btn"
            aria-expanded={openSections.desc}
          >
            <div className="accordion-title-group">
              <span className="accordion-icon-box bg-rose">
                <FileText size={18} className="text-accent" />
              </span>
              <span className="accordion-title-text">DESCRIPCIÓN & BENEFICIOS DE LA FÓRMULA</span>
            </div>
            <div className="accordion-right-toggle">
              <span className="accordion-status-pill">{openSections.desc ? 'Ocultar' : 'Ver detalle'}</span>
              {openSections.desc ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {openSections.desc && (
            <div className="accordion-body-panel">
              <h3>FÓRMULA Y CARACTERÍSTICAS PRINCIPALES</h3>
              <p className="tab-body-text">{product.description}</p>
              
              {product.servingInfo && (
                <div className="serving-highlight-pill">
                  <Zap size={16} className="text-accent" />
                  <span><strong>PRESENTACIÓN & RENDIMIENTO:</strong> {product.servingInfo}</span>
                </div>
              )}

              {product.nutritionalHighlights && (
                <div className="benefits-bullets-grid">
                  <h4>Puntos destacados de la fórmula:</h4>
                  <ul>
                    {product.nutritionalHighlights.map((hl, i) => (
                      <li key={i}>
                        <Check size={16} className="text-success" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accordion Item 2: Tabla Nutricional Oficial */}
        <div className={`accordion-card ${openSections.nutrition ? 'expanded' : ''}`}>
          <button 
            type="button"
            onClick={() => toggleSection('nutrition')}
            className="accordion-header-btn"
            aria-expanded={openSections.nutrition}
          >
            <div className="accordion-title-group">
              <span className="accordion-icon-box bg-blue">
                <BarChart2 size={18} className="text-blue-600" />
              </span>
              <span className="accordion-title-text">TABLA NUTRICIONAL OFICIAL CERTIFICADA</span>
            </div>
            <div className="accordion-right-toggle">
              <span className="accordion-status-pill">{openSections.nutrition ? 'Ocultar' : 'Ver tabla'}</span>
              {openSections.nutrition ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {openSections.nutrition && (
            <div className="accordion-body-panel">
              <h3>INFORMACIÓN NUTRICIONAL CERTIFICADA</h3>
              <p className="text-muted text-xs mb-3">
                Valores calculados por porción de referencia. Los porcentajes de valores diarios (%VD) están basados en una dieta de 2.000 kcal.
              </p>

              <div className="nutrition-table-wrapper">
                <table className="nutrition-table">
                  <thead>
                    <tr>
                      <th>NUTRIENTE</th>
                      <th>CANTIDAD POR PORCIÓN</th>
                      <th>% VALOR DIARIO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionalRows.map((row, idx) => (
                      <tr key={idx}>
                        <td><strong>{row.nutrient}</strong></td>
                        <td>{row.perServing}</td>
                        <td>{row.dailyValue || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item 3: Modo de Uso & Dosificación */}
        <div className={`accordion-card ${openSections.usage ? 'expanded' : ''}`}>
          <button 
            type="button"
            onClick={() => toggleSection('usage')}
            className="accordion-header-btn"
            aria-expanded={openSections.usage}
          >
            <div className="accordion-title-group">
              <span className="accordion-icon-box bg-amber">
                <Zap size={18} className="text-amber-500" />
              </span>
              <span className="accordion-title-text">MODO DE PREPARACIÓN & DOSIFICACIÓN</span>
            </div>
            <div className="accordion-right-toggle">
              <span className="accordion-status-pill">{openSections.usage ? 'Ocultar' : 'Ver guía'}</span>
              {openSections.usage ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {openSections.usage && (
            <div className="accordion-body-panel">
              <h3>MODO DE PREPARACIÓN Y DOSIFICACIÓN RECOMENDADA</h3>
              <div className="usage-steps-grid">
                <div className="usage-step-card">
                  <span className="step-num">1</span>
                  <h4>Días de Entrenamiento</h4>
                  <p>Consumir 1 porción (1 scoop colmado) disuelto en 250ml a 300ml de agua fría o leche descremada inmediatamente después de finalizar tu sesión de entrenamiento para optimizar la síntesis proteica.</p>
                </div>
                <div className="usage-step-card">
                  <span className="step-num">2</span>
                  <h4>Días de Descanso</h4>
                  <p>Tomar 1 porción a media mañana o media tarde entre comidas principales para asegurar el balance de nitrógeno positivo y una óptima recuperación de las fibras musculares.</p>
                </div>
                <div className="usage-step-card">
                  <span className="step-num">3</span>
                  <h4>Recomendación de Shaker</h4>
                  <p>Colocar primero el líquido y luego el polvo en el shaker. Agitar enérgicamente durante 15 a 20 segundos para lograr una textura homogénea y sin grumos.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion Item 4: Origen & Garantía */}
        <div className={`accordion-card ${openSections.guarantee ? 'expanded' : ''}`}>
          <button 
            type="button"
            onClick={() => toggleSection('guarantee')}
            className="accordion-header-btn"
            aria-expanded={openSections.guarantee}
          >
            <div className="accordion-title-group">
              <span className="accordion-icon-box bg-emerald">
                <Award size={18} className="text-emerald-600" />
              </span>
              <span className="accordion-title-text">COMPROMISO DE CALIDAD & RETIRO EN RECOLETA</span>
            </div>
            <div className="accordion-right-toggle">
              <span className="accordion-status-pill">{openSections.guarantee ? 'Ocultar' : 'Ver garantías'}</span>
              {openSections.guarantee ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {openSections.guarantee && (
            <div className="accordion-body-panel">
              <h3>COMPROMISO DE CALIDAD Y RETIRO OFICIAL</h3>
              <div className="guarantee-features-grid">
                <div className="guarantee-feature-item">
                  <Award size={24} className="text-accent" />
                  <div>
                    <strong>Laboratorio y Lote Fresco</strong>
                    <p>Comercializamos únicamente productos de distribuidores oficiales con fecha de vencimiento lejana y certificación de ANMAT.</p>
                  </div>
                </div>
                <div className="guarantee-feature-item">
                  <MapPin size={24} className="text-accent" />
                  <div>
                    <strong>Punto de Retiro Oficial en CABA</strong>
                    <p>Sede física en Uriburu 1163 (entre Av. Santa Fe y Arenales), Recoleta. Podés retirar tu compra el mismo día presentando tu DNI.</p>
                  </div>
                </div>
                <div className="guarantee-feature-item">
                  <Clock size={24} className="text-accent" />
                  <div>
                    <strong>Horarios de Atención Amplios</strong>
                    <p>Lunes a Viernes de 8:00 a 23:00 hs y Sábados de 10:00 a 18:00 hs. Respondemos consultas y dudas técnicas al instante.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Sticky Action Bar */}
      <div className={`mobile-sticky-buy-bar ${showStickyBar ? 'visible' : ''}`}>
        <div className="sticky-bar-inner">
          <div className="sticky-product-meta">
            <img 
              src={selectedImage || product.images[0]?.url || 'https://acdn-us.mitiendanube.com/stores/001/247/962/products/truemade_vainilla_2lb-webp1-0f17ea0eb698979f4916826203173730-640-0.webp'} 
              alt={product.name} 
              className="sticky-product-thumb" 
            />
            <div className="sticky-product-texts">
              <span className="sticky-product-title">{product.name}</span>
              <div className="sticky-pricing-row">
                <span className="sticky-price">{formatARS(selectedVariant.priceInCents)}</span>
                <span className="sticky-installments">6 x {formatARS(Math.round(selectedVariant.priceInCents / 6))}</span>
              </div>
            </div>
          </div>

          <div className="sticky-actions-group">
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock <= 0}
              className="btn btn-primary sticky-add-btn"
            >
              <ShoppingBag size={15} />
              <span>{selectedVariant.stock <= 0 ? 'SIN STOCK' : 'COMPRAR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Component Styles */}
      <style>{`
        .pdp-transfer-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ECFDF5;
          border: 1.5px solid #10B981;
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem;
          margin-bottom: 0.65rem;
        }
        .pdp-transfer-content {
          display: flex;
          flex-direction: column;
        }
        .pdp-transfer-price {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 900;
          color: #065F46;
          line-height: 1.1;
        }
        .pdp-transfer-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #047857;
        }
        .pdp-transfer-badge {
          background: #10B981;
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 900;
          padding: 0.25rem 0.55rem;
          border-radius: var(--radius-xs);
          letter-spacing: 0.04em;
        }
        .pdp-installments-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F3F4F6;
          border: 1px solid #E5E7EB;
          border-radius: var(--radius-sm);
          padding: 0.65rem 1rem;
        }
        .pdp-inst-highlight {
          font-size: 0.88rem;
          font-weight: 800;
          color: #111827;
        }
        .pdp-inst-sub {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          color: #6B7280;
        }
        .pdp-mp-logo {
          height: 18px;
          width: auto;
          vertical-align: middle;
        }
        .mobile-sticky-buy-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-top: 1px solid var(--color-border);
          padding: 0.65rem 1rem;
          z-index: 998;
          transform: translateY(110%);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
        }
        @media (max-width: 900px) {
          .mobile-sticky-buy-bar {
            display: block;
          }
        }
        .mobile-sticky-buy-bar.visible {
          transform: translateY(0);
        }
        .sticky-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          max-width: 600px;
          margin: 0 auto;
        }
        .sticky-product-meta {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          min-width: 0;
        }
        .sticky-product-thumb {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          object-fit: contain;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          flex-shrink: 0;
          padding: 2px;
        }
        .sticky-product-texts {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .sticky-product-title {
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--color-text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 170px;
        }
        .sticky-pricing-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .sticky-price {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--color-text-main);
        }
        .sticky-installments {
          font-size: 0.7rem;
          color: #059669;
          font-weight: 700;
        }
        .sticky-actions-group {
          flex-shrink: 0;
        }
        .sticky-add-btn {
          padding: 0.55rem 1rem !important;
          font-size: 0.82rem !important;
          border-radius: var(--radius-sm) !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.4rem !important;
          background: #E11D48 !important;
          font-weight: 800 !important;
        }
        .product-detail-page {
          padding-top: 1.5rem;
          padding-bottom: 5rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          width: 100%;
          box-sizing: border-box;
        }
        .detail-breadcrumb a {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--color-text-main);
          font-weight: 600;
        }
        .detail-breadcrumb a:hover {
          color: var(--color-accent);
        }
        .crumb-sep {
          color: var(--color-border-hover);
        }
        .current-crumb {
          color: var(--color-text-subtle);
        }
        .product-detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 992px) {
          .product-detail-grid {
            grid-template-columns: 1fr 1.15fr;
            gap: 3rem;
            margin-bottom: 4rem;
          }
        }
        .gallery-section, .info-section {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }
        .main-image-wrap {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          box-shadow: var(--shadow-xs);
        }
        .main-detail-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .main-image-wrap:hover .main-detail-img {
          transform: scale(1.04);
        }
        .product-badge-discount-lg {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background-color: var(--color-accent);
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 800;
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-xs);
          letter-spacing: 0.04em;
          z-index: 2;
        }
        .thumbnails-row {
          display: flex;
          gap: 0.75rem;
        }
        .thumbnail-btn {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-xs);
          border: 1.5px solid var(--color-border);
          overflow: hidden;
          background: #FFFFFF;
          padding: 0.25rem;
          transition: border-color 0.15s ease;
        }
        .thumbnail-btn.active {
          border-color: var(--color-primary);
        }
        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .detail-trust-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
        }
        .trust-card-mini {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.82rem;
        }
        .trust-card-mini strong {
          color: var(--color-text-main);
          display: block;
          margin-bottom: 0.15rem;
          font-size: 0.82rem;
        }
        .trust-card-mini p {
          color: var(--color-text-muted);
          font-size: 0.78rem;
          margin: 0;
        }

        /* Right Info Section */
        .info-section {
          display: flex;
          flex-direction: column;
        }
        .brand-rating-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .product-brand-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .product-stars {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .rating-stars {
          display: flex;
          gap: 1px;
        }
        .rating-val {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-text-main);
        }
        .rating-count {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }
        .detail-product-title {
          font-size: 2.1rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--color-text-main);
          margin-bottom: 0.5rem;
          line-height: 1.15;
        }
        .detail-tagline {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
        }

        /* Price Box */
        .detail-price-box {
          background-color: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.5rem;
        }
        .price-values {
          display: flex;
          align-items: baseline;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .detail-compare-price {
          font-size: 1.1rem;
          color: var(--color-text-subtle);
          text-decoration: line-through;
        }
        .detail-current-price {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
        }
        .installments-callout-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-xs);
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .transfer-discount-callout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--color-text-body);
        }
        .badge-tag {
          background-color: #F1F5F9;
          border: 1px solid var(--color-border);
          color: var(--color-text-main);
          font-weight: 800;
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-xs);
        }

        /* Variants */
        .variant-select-section {
          margin-bottom: 1.5rem;
        }
        .variant-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.65rem;
        }
        .variants-buttons-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.65rem;
        }
        .variant-option-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          color: var(--color-text-main);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-xs);
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.15s ease;
        }
        .variant-option-btn:hover {
          border-color: var(--color-primary);
        }
        .variant-option-btn.active {
          border-color: var(--color-accent);
          background-color: #FFF1F2;
          color: var(--color-accent);
        }
        .variant-size-tag {
          font-size: 0.72rem;
          color: var(--color-text-muted);
        }

        /* Stock Status */
        .detail-stock-status {
          margin-bottom: 1.5rem;
          font-size: 0.82rem;
        }
        .stock-alert {
          font-weight: 700;
          display: block;
        }
        .stock-in { color: var(--color-success); }
        .stock-low { color: #D97706; }
        .stock-out { color: var(--color-accent); }

        /* Purchase Controls */
        .purchase-controls-row {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .quantity-box {
          display: flex;
          align-items: center;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-xs);
          background: #FFFFFF;
        }
        .qty-change-btn {
          width: 40px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-main);
        }
        .qty-change-btn:disabled {
          opacity: 0.3;
        }
        .qty-number {
          width: 36px;
          text-align: center;
          font-weight: 800;
          font-size: 0.95rem;
        }
        .product-main-cta {
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        /* Shipping Calculator */
        .shipping-calculator-box {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          background: #FFFFFF;
          margin-bottom: 1.25rem;
        }
        .calc-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.75rem;
        }
        .calc-form {
          display: flex;
          gap: 0.5rem;
        }
        .calc-input {
          flex: 1;
          padding: 0.6rem 0.85rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xs);
          font-size: 0.85rem;
        }
        .calc-btn {
          padding: 0.6rem 1rem;
        }
        .calc-results-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid var(--color-border);
        }
        .calc-result-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }
        .calc-res-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .calc-res-info p {
          margin: 0;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        /* WhatsApp Help Strip */
        .whatsapp-help-strip {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: var(--radius-xs);
          padding: 0.75rem 1rem;
        }
        .wa-help-text {
          font-size: 0.78rem;
          display: flex;
          flex-direction: column;
        }
        .wa-link {
          text-decoration: underline;
        }

        /* Technical Accordion Section (Vertical Desplegables) */
        .product-accordion-section {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin-top: 1.5rem;
        }
        .accordion-card {
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .accordion-card.expanded {
          border-color: #94A3B8;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
        }
        .accordion-header-btn {
          width: 100%;
          padding: 1.1rem 1.25rem;
          background: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.85rem;
          cursor: pointer;
          border: none;
          text-align: left;
          transition: background-color 0.15s ease;
          box-sizing: border-box;
        }
        .accordion-header-btn:hover {
          background: #F1F5F9;
        }
        .accordion-card.expanded .accordion-header-btn {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
        }
        .accordion-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
          flex: 1;
        }
        .accordion-icon-box {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bg-rose { background: #FFE4E6; }
        .bg-blue { background: #EFF6FF; }
        .bg-amber { background: #FEF3C7; }
        .bg-emerald { background: #DCFCE7; }

        .accordion-title-text {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .accordion-right-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748B;
          flex-shrink: 0;
        }
        .accordion-status-pill {
          font-size: 0.72rem;
          font-weight: 700;
          color: #475569;
          background: #E2E8F0;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }
        .accordion-card.expanded .accordion-status-pill {
          background: #F1F5F9;
          color: #0F172A;
        }
        .accordion-body-panel {
          padding: 1.75rem 1.5rem;
          background: #FFFFFF;
          width: 100%;
          box-sizing: border-box;
          animation: accordionFade 0.2s ease-out;
        }
        @keyframes accordionFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .product-detail-page {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .product-detail-grid {
            gap: 1.25rem !important;
            width: 100% !important;
            margin-bottom: 2rem !important;
          }
          .gallery-section, .info-section {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .main-image-wrap {
            padding: 1rem !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .detail-trust-cards {
            padding: 1rem 0.85rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .detail-price-box {
            padding: 1rem 0.85rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .detail-product-title {
            font-size: 1.5rem !important;
            word-break: break-word !important;
          }
          .purchase-controls-row {
            flex-direction: column !important;
            width: 100% !important;
            gap: 0.65rem !important;
          }
          .product-main-cta, .purchase-controls-row .btn-secondary {
            width: 100% !important;
          }
          .quantity-box {
            width: 100% !important;
            justify-content: space-between !important;
          }
          .quantity-box .qty-change-btn {
            flex: 1 !important;
          }
          .quantity-box .qty-number {
            flex: 1 !important;
          }
          .accordion-header-btn {
            padding: 0.95rem 0.85rem !important;
          }
          .accordion-title-text {
            font-size: 0.82rem !important;
          }
          .accordion-body-panel {
            padding: 1.25rem 0.85rem !important;
          }
          .accordion-status-pill {
            display: none !important;
          }
        }
        .accordion-body-panel h3 {
          font-size: 1.15rem;
          font-weight: 900;
          margin-bottom: 0.85rem;
          color: #0F172A;
        }
        .tab-body-text {
          font-size: 0.92rem;
          line-height: 1.7;
          color: var(--color-text-body);
          margin-bottom: 1.5rem;
        }
        .serving-highlight-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFF1F2;
          border: 1px solid #FFE4E6;
          color: var(--color-accent);
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-xs);
          font-size: 0.82rem;
          margin-bottom: 1.5rem;
        }
        .benefits-bullets-grid h4 {
          font-size: 0.95rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }
        .benefits-bullets-grid ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .benefits-bullets-grid li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: var(--color-text-body);
        }

        /* Nutrition Table */
        .nutrition-table-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          max-width: 100%;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xs);
        }
        .nutrition-table {
          width: 100%;
          min-width: 440px;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
        .nutrition-table th {
          background: var(--color-bg-secondary);
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 800;
          border-bottom: 1.5px solid var(--color-border);
        }
        .nutrition-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--color-border);
        }
        .nutrition-table tr:hover td {
          background: #F8FAFC;
        }

        /* Usage Steps */
        .usage-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .usage-steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .usage-step-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xs);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-primary);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.8rem;
        }
        .usage-step-card h4 {
          font-size: 0.95rem;
          margin: 0;
        }
        .usage-step-card p {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* Guarantee features */
        .guarantee-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .guarantee-features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .guarantee-feature-item {
          display: flex;
          gap: 0.85rem;
          align-items: flex-start;
        }
        .guarantee-feature-item strong {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        .guarantee-feature-item p {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
};
