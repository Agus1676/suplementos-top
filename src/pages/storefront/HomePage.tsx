import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  ArrowRight, 
  Clock, 
  Star, 
  CheckCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { HeroSlider } from '../../components/storefront/HeroSlider';
import { TrustMarquee } from '../../components/storefront/TrustMarquee';
import { HorizontalScroller } from '../../components/ui/HorizontalScroller';

interface CategoryTile {
  title: string;
  slug: string;
  imageUrl: string;
  badge?: string;
}

// Compact category tiles (swipeable rail on mobile, single row on desktop)
const CATEGORY_TILES: CategoryTile[] = [
  {
    title: 'PROTEÍNAS',
    slug: 'proteinas',
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=400&q=70',
  },
  {
    title: 'CREATINAS',
    slug: 'creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=70',
  },
  {
    title: 'PRE-ENTRENOS',
    slug: 'pre-entrenos',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=70',
  },
  {
    title: 'COMBOS',
    slug: 'combos',
    badge: '20% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=400&q=70',
  },
  {
    title: 'AMINOÁCIDOS',
    slug: 'aminoacidos',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=70',
  },
  {
    title: 'VITAMINAS',
    slug: 'salud-vitaminas',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=70',
  },
];

export const HomePage: React.FC = () => {
  const { products, settings } = useStore();

  // Carousels: show a longer list so there's something to swipe through
  const bestSellersRaw = products.filter((p) => p.isBestSeller);
  const bestSellers = (bestSellersRaw.length >= 4 ? bestSellersRaw : products).slice(0, 10);
  const featuredRaw = products.filter((p) => p.isFeatured);
  const featuredProducts = (featuredRaw.length >= 4 ? featuredRaw : products).slice(0, 10);
  const categoryBanners = CATEGORY_TILES;

  // Official brands (matched to catalog)
  const brands = [
    { name: 'STAR NUTRITION', filter: 'Star Nutrition', desc: 'Laboratorio Oficial' },
    { name: 'ENA SPORT', filter: 'ENA Sport', desc: 'Líder en Nutrición' },
    { name: 'OPTIMUM NUTRITION', filter: 'Optimum Nutrition', desc: 'Importado USA' },
    { name: 'DYMATIZE', filter: 'Dymatize', desc: 'ISO 100 Hidrolizada' },
    { name: 'GENTECH', filter: 'Gentech', desc: 'Nutrición Deportiva' },
    { name: 'VER TODAS', filter: '', desc: 'Explorar Catálogo' }
  ];

  return (
    <div className="home-root">
      {/* 1. Interactive Hero Slider */}
      <HeroSlider />

      {/* 2. Trust strip — compact, auto-scrolling to the left */}
      <TrustMarquee />

      {/* 3. Compact category rail (swipeable) */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header section-header-compact">
            <h2 className="section-title">COMPRÁ POR CATEGORÍA</h2>
            <Link to="/catalogo" className="section-link">
              <span>Ver todo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <HorizontalScroller
            ariaLabel="Categorías de productos"
            perView={{ mobile: 3, tablet: 5, desktop: 6 }}
            gapRem={0.65}
            mobilePeek={0.3}
          >
            {categoryBanners.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogo?categoria=${cat.slug}`}
                className="cat-tile"
              >
                <div className="cat-tile-media">
                  <img src={cat.imageUrl} alt="" loading="lazy" className="cat-tile-img" />
                  {cat.badge && <span className="cat-tile-badge">{cat.badge}</span>}
                </div>
                <span className="cat-tile-title">{cat.title}</span>
              </Link>
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* 4. Best Sellers Product Grid */}
      <section className="products-showcase-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">LOS ELEGIDOS POR ATLETAS</span>
              <h2 className="section-title">MÁS VENDIDOS DE LA SEMANA</h2>
            </div>
            <Link to="/catalogo?sort=bestseller" className="section-link">
              <span>Ver todos</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <HorizontalScroller ariaLabel="Más vendidos" perView={{ mobile: 2, tablet: 3, desktop: 4 }} mobilePeek={0.15}>
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* 5. Promotional Multi-Banner Grid (Estilo Entreno 2-Col) */}
      <section className="promotional-banners-section">
        <div className="container">
          <div className="promo-banners-grid">
            {/* Banner 1: Combos de Aumento */}
            <div className="promo-banner-card promo-banner-dark">
              <div className="promo-banner-content">
                <span className="promo-badge-red">HASTA 20% OFF</span>
                <h3 className="promo-title">COMBOS DE DEFINICIÓN & FUERZA</h3>
                <p className="promo-desc">
                  Proteína Whey Isolate + Creatina Creapure®. La combinación con mayor respaldo científico para recuperación y fuerza muscular.
                </p>
                <Link to="/catalogo?categoria=combos" className="btn btn-accent btn-sm">
                  <span>VER COMBOS CON DESCUENTO</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Banner 2: Retiro Inmediato Recoleta */}
            <div className="promo-banner-card promo-banner-light">
              <div className="promo-banner-content">
                <span className="promo-badge-green">RETIRO EXPRESS CABA</span>
                <h3 className="promo-title">COMPRÁ ONLINE Y RETIRÁ EN EL ACTO</h3>
                <p className="promo-desc">
                  Uriburu 1163 (entre Av. Santa Fe y Arenales). Retirás tu pedido presentando tu DNI sin costo de envío adicional.
                </p>
                <Link to="/contacto" className="btn btn-primary btn-sm">
                  <span>CONOCER HORARIOS & UBICACIÓN</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Products Grid */}
      <section className="products-showcase-section bg-secondary-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">NOVEDADES & LANZAMIENTOS</span>
              <h2 className="section-title">FÓRMULAS DESTACADAS</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>Ver catálogo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <HorizontalScroller ariaLabel="Fórmulas destacadas" perView={{ mobile: 2, tablet: 3, desktop: 4 }} mobilePeek={0.15}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* 7. Official Brands Strip */}
      <section className="brands-strip-section">
        <div className="container">
          <div className="brands-header">
            <span className="section-eyebrow">GARANTÍA Y ORIGEN</span>
            <h3 className="brands-title">MARCAS OFICIALES CERTIFICADAS</h3>
          </div>

          <div className="brands-grid">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={brand.filter ? `/catalogo?marca=${encodeURIComponent(brand.filter)}` : '/catalogo'}
                className="brand-item-card"
              >
                <span className="brand-logo-name">{brand.name}</span>
                <span className="brand-logo-desc">{brand.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Recoleta Sede Central & Retiro Box */}
      <section className="location-callout-section">
        <div className="container">
          <div className="location-callout-card">
            <div className="location-info-side">
              <span className="section-eyebrow">PUNTO DE RETIRO & DESPACHO</span>
              <h2 className="location-heading">SEDE CENTRAL RECOLETA</h2>
              <p className="location-address">
                <MapPin size={20} className="text-accent" />
                <span>{settings.pickupAddress} (entre Av. Santa Fe y Arenales)</span>
              </p>
              <p className="location-hours">
                <Clock size={18} className="text-muted" />
                <span>Horarios: {settings.hoursDescription}</span>
              </p>
              <p className="location-details-text">
                Contamos con amplio stock en tienda física. Si realizás tu compra por la web, tu pedido se empaqueta de forma inmediata y podés retirarlo en el día con tu DNI.
              </p>

              <div className="location-actions">
                <a
                  href="https://maps.google.com/?q=Uriburu+1163,+Recoleta,+CABA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <MapPin size={15} />
                  <span>ABRIR EN GOOGLE MAPS</span>
                </a>
                <a
                  href="https://wa.me/5491165651990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Phone size={15} />
                  <span>CONSULTAR POR WHATSAPP</span>
                </a>
              </div>
            </div>

            <div className="location-map-side">
              <div className="map-badge-overlay">
                <div className="map-dot"></div>
                <span>Uriburu 1163, Recoleta, CABA</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80" 
                alt="Local Suplementos Top en Recoleta" 
                className="location-store-photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Social Proof / Verified Athlete Reviews */}
      <section className="reviews-section">
        <div className="container">
          <div className="reviews-header text-center">
            <span className="section-eyebrow">CLIENTES VERIFICADOS</span>
            <h2 className="section-title">MÁS DE 4.800 DEPORTISTAS CONFÍAN EN NOSOTROS</h2>
            <div className="reviews-stars-summary">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <span className="reviews-score">4.9 / 5.0 en satisfacción de entrega y calidad de producto</span>
            </div>
          </div>

          <div className="grid-3 reviews-grid">
            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="review-comment">
                "Excelente atención. Compré la proteína Star Isolate y pasé a retirarla por el local en Uriburu 1163 a las 20hs. Todo rápido, en caja cerrada con precinto original."
              </p>
              <div className="review-author-info">
                <strong>Matías G. (Palermo, CABA)</strong>
                <span className="verified-badge"><CheckCircle size={13} className="text-success" /> Compra Verificada</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="review-comment">
                "Pagué en 3 cuotas sin interés con Mercado Pago desde Córdoba y en menos de 48hs me llegó por correo a casa. El empaque impecable, súper recomendable."
              </p>
              <div className="review-author-info">
                <strong>Carolina B. (Córdoba Capital)</strong>
                <span className="verified-badge"><CheckCircle size={13} className="text-success" /> Compra Verificada</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="review-comment">
                "La creatina Creapure® se disuelve perfecto y la fecha de vencimiento es para 2028. Se nota que traen lotes frescos directamente de fábrica."
              </p>
              <div className="review-author-info">
                <strong>Joaquín R. (Rosario, Santa Fe)</strong>
                <span className="verified-badge"><CheckCircle size={13} className="text-success" /> Compra Verificada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .home-root {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* 3. Compact Category Rail */
        .categories-section {
          padding: 1.75rem 0 1.25rem;
          background-color: #FFFFFF;
        }
        .section-header-compact {
          margin-bottom: 0.9rem !important;
          align-items: center !important;
        }
        .section-header-compact .section-title {
          margin: 0;
        }
        .cat-tile {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          text-decoration: none;
          color: var(--color-text-main);
        }
        .cat-tile-media {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-bg-tertiary);
          border: 1px solid var(--color-border);
        }
        .cat-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s ease;
        }
        .cat-tile:hover .cat-tile-img {
          transform: scale(1.07);
        }
        .cat-tile:hover .cat-tile-media {
          border-color: var(--color-accent);
        }
        .cat-tile-badge {
          position: absolute;
          top: 0.4rem;
          left: 0.4rem;
          background: var(--color-promo-red);
          color: #FFFFFF;
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.03em;
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-xs);
        }
        .cat-tile-title {
          font-family: var(--font-display);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          text-align: center;
          line-height: 1.2;
        }
        @media (min-width: 768px) {
          .cat-tile-title { font-size: 0.85rem; }
        }

        /* 4. Products Showcase */
        .products-showcase-section {
          padding: 2rem 0;
          background-color: #FFFFFF;
        }
        .bg-secondary-section {
          background-color: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        /* 5. Promotional Banners Grid */
        .promotional-banners-section {
          padding: 1rem 0 3.5rem;
          background-color: #FFFFFF;
        }
        .promo-banners-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .promo-banners-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .promo-banner-card {
          border-radius: var(--radius-md);
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        .promo-banner-dark {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
          color: #FFFFFF;
          border-color: #1E293B;
        }
        .promo-banner-light {
          background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
          color: var(--color-text-main);
        }
        .promo-banner-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.85rem;
        }
        .promo-badge-red {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          background-color: var(--color-accent);
          color: #FFFFFF;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-xs);
        }
        .promo-badge-green {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          background-color: var(--color-success);
          color: #FFFFFF;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-xs);
        }
        .promo-title {
          font-size: 1.5rem;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .promo-desc {
          font-size: 0.85rem;
          line-height: 1.55;
          margin: 0;
          opacity: 0.9;
        }

        /* 7. Brands Strip */
        .brands-strip-section {
          padding: 3rem 0;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
        }
        .brands-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .brands-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-text-main);
        }
        .brands-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .brands-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .brands-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        .brand-item-card {
          background-color: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.15rem 0.75rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all var(--transition-fast);
        }
        .brand-item-card:hover {
          border-color: #CBD5E1;
          box-shadow: var(--shadow-sm);
          transform: translateY(-2px);
        }
        .brand-logo-name {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 900;
          letter-spacing: 0.05em;
          color: var(--color-text-main);
          margin-bottom: 0.15rem;
        }
        .brand-logo-desc {
          font-size: 0.65rem;
          color: var(--color-text-muted);
        }

        /* 8. Location Callout */
        .location-callout-section {
          padding: 2rem 0;
          background-color: #FFFFFF;
        }
        .location-callout-card {
          background: #FFFFFF;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
          box-shadow: var(--shadow-sm);
        }
        @media (min-width: 900px) {
          .location-callout-card {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }
        .location-info-side {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .location-heading {
          font-size: 1.8rem;
          font-weight: 900;
          margin-bottom: 1rem;
        }
        .location-address {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.5rem;
        }
        .location-hours {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 1.25rem;
        }
        .location-details-text {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
        }
        .location-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .location-map-side {
          position: relative;
          min-height: 280px;
          background: #000;
        }
        .location-store-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.85;
        }
        .map-badge-overlay {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          z-index: 2;
        }
        .map-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22C55E;
        }

        /* 9. Reviews */
        .reviews-section {
          padding: 3.5rem 0 5rem;
          background-color: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border);
        }
        .reviews-header {
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .reviews-stars-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          margin-top: 0.5rem;
        }
        .reviews-score {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .reviews-grid {
          gap: 1.5rem;
        }
        .review-card {
          background-color: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--shadow-xs);
        }
        .review-stars {
          display: flex;
          gap: 2px;
        }
        .review-comment {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--color-text-main);
          font-style: italic;
          flex: 1;
        }
        .review-author-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.78rem;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
        }
        .verified-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--color-success);
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
