import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { HeroSlider } from '../../components/storefront/HeroSlider';
import { TrustMarquee } from '../../components/storefront/TrustMarquee';
import { HorizontalScroller } from '../../components/ui/HorizontalScroller';
import { SEO } from '../../components/common/SEO';
import { InstagramFeed } from '../../components/storefront/InstagramFeed';
import { GoogleReviews } from '../../components/storefront/GoogleReviews';

interface CategoryTile {
  title: string;
  subtitle: string;
  slug: string;
  headerTitle: string;
  packshots: string[];
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    title: 'Proteínas Whey',
    subtitle: 'Masa Muscular',
    slug: 'proteinas',
    headerTitle: 'PROTEÍNAS',
    packshots: [
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-36-d9bc6bd2b3819e422717800791905669-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/truemade_vainilla_2lb-webp1-0f17ea0eb698979f4916826203173730-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-95-5c7345af65acc8ee4917654696614725-640-0.webp',
    ],
  },
  {
    title: 'Creatinas Puras',
    subtitle: 'Fuerza & Potencia',
    slug: 'creatinas',
    headerTitle: 'CREATINAS',
    packshots: [
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/crea1-43ecc9d7c95f3dd32316495194702323-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-86-b01227391a8693a81817830230456620-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-66-89296cadbf5be4b82e17579636094867-640-0.webp',
    ],
  },
  {
    title: 'Pre-Entreno',
    subtitle: 'Energía Explosiva',
    slug: 'pre-entrenos',
    headerTitle: 'PRE-ENTRENO',
    packshots: [
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/v8-acai-296d8b9d4323834baa17326403674588-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/1-beta-alanina1-9e9e31c14f3fab222116395930246659-640-0.webp',
    ],
  },
  {
    title: 'Combos Ahorro',
    subtitle: 'Proteína + Creatina',
    slug: 'combos',
    headerTitle: 'COMBOS',
    packshots: [
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/3kg-ban-f6002d8b105495880e17326433478591-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/crea1-43ecc9d7c95f3dd32316495194702323-640-0.webp',
    ],
  },
  {
    title: 'Aminoácidos',
    subtitle: 'Recuperación Rápida',
    slug: 'aminoacidos',
    headerTitle: 'AMINOÁCIDOS',
    packshots: [
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/1-beta-alanina1-9e9e31c14f3fab222116395930246659-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/colag-sport-fp-34b023adaa65e4448817335106040409-640-0.webp',
    ],
  },
  {
    title: 'Salud & Vitaminas',
    subtitle: 'Magnesio & Vitalidad',
    slug: 'salud-vitaminas',
    headerTitle: 'VITAMINAS',
    packshots: [
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/magnesio-star-715031aedf196789d517327300732618-640-0.webp',
      'https://acdn-us.mitiendanube.com/stores/001/247/962/products/colag-sport-fp-34b023adaa65e4448817335106040409-640-0.webp',
    ],
  },
];

const BRAND_SHOWCASE = [
  {
    name: 'Star Nutrition',
    tagline: 'Líder en Calidad ANMAT',
    filter: 'Star Nutrition',
    logoText: 'STAR',
    logoSub: 'NUTRITION',
    accentColor: '#10B981',
  },
  {
    name: 'ENA Sport',
    tagline: 'Innovación Deportiva',
    filter: 'ENA Sport',
    logoText: 'ENA',
    logoSub: 'SPORT',
    accentColor: '#EF4444',
  },
  {
    name: 'Optimum Nutrition',
    tagline: 'Gold Standard 100% Whey',
    filter: 'Optimum Nutrition',
    logoText: 'ON',
    logoSub: 'OPTIMUM',
    accentColor: '#D97706',
  },
  {
    name: 'One Fit',
    tagline: 'Máximo Rendimiento',
    filter: 'Suplementos Top Gear',
    logoText: 'ONE FIT',
    logoSub: 'NUTRITION',
    accentColor: '#3B82F6',
  },
  {
    name: 'Gentech',
    tagline: 'Nutrición de Élite',
    filter: 'Gentech',
    logoText: 'GENTECH',
    logoSub: 'PHARMA',
    accentColor: '#6366F1',
  },
];

export const HomePage: React.FC = () => {
  const { products, settings } = useStore();

  const bestSellersRaw = products.filter((p) => p.isBestSeller);
  const bestSellers = (bestSellersRaw.length >= 4 ? bestSellersRaw : products).slice(0, 10);
  const featuredRaw = products.filter((p) => p.isFeatured);
  const featuredProducts = (featuredRaw.length >= 4 ? featuredRaw : products).slice(0, 10);

  const homeFaqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '¿Dónde queda el local de Suplementos Top en Recoleta y qué horarios tienen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Estamos ubicados en Pres. José E. Uriburu 1163 (dentro del Gimnasio Top Shape), entre Av. Santa Fe y Arenales, Recoleta, CABA. Atendemos de Lunes a Viernes de 8:00 a 23:00 hs y Sábados de 10:00 a 18:00 hs.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Tienen descuento abonando por transferencia bancaria?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, tenés un 10% de descuento automático en toda la tienda abonando mediante transferencia bancaria. Al finalizar tu pedido en el checkout se aplica la bonificación de forma inmediata.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Qué marcas de suplementos deportivos trabajan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Trabajamos con líneas oficiales 100% originales de Star Nutrition, ENA Sport, Optimum Nutrition (Gold Standard), One Fit, Dymatize y Gentech. Todos los productos cuentan con precinto de seguridad de fábrica y registro ANMAT.',
        },
      },
      {
        '@type': 'Question',
        name: '¿Puedo retirar mi compra en el día sin cargo?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sí, podés comprar online a través de la web o WhatsApp y retirar tu pedido en el día sin ningún costo de envío en nuestro punto de entrega en Recoleta (Gimnasio Top Shape).',
        },
      },
      {
        '@type': 'Question',
        name: '¿Hacen envíos a domicilio a todo el país?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Realizamos envíos en el día en CABA y despachos a todo el país por correo expreso con código de seguimiento online. Además, tenés retiro sin cargo en el día en nuestro local oficial de Recoleta (Pres. José E. Uriburu 1163).',
        },
      },
    ],
  };

  return (
    <div className="home-root">
      <SEO
        title="Suplementos Top Recoleta | Proteínas, Creatinas y Nutrición Deportiva CABA"
        description="Tienda oficial de suplementos deportivos en Recoleta, CABA. Retiro en el día en Gimnasio Top Shape (Pres. José E. Uriburu 1163) o envíos a todo el país. Star Nutrition, ENA Sport, Optimum Nutrition. 10% OFF transferencia."
        canonicalUrl="/"
        jsonLd={homeFaqJsonLd}
      />

      {/* 1. Interactive Hero Slider */}
      <HeroSlider />

      {/* 2. Trust strip — compact, auto-scrolling to the left */}
      <TrustMarquee />

      {/* 3. Categorías principales (Estilo ProteViking con banner verde y bundle packshots) */}
      <section className="categories-section" aria-label="Categorías principales">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">SELECCIÓN OFICIAL</span>
              <h2 className="section-title">Categorías principales</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>Ver todas</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <HorizontalScroller
            ariaLabel="Categorías principales de productos"
            perView={{ mobile: 1.6, tablet: 3.2, desktop: 4.2 }}
            gapRem={0.85}
            mobilePeek={0.25}
          >
            {CATEGORY_TILES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalogo?categoria=${cat.slug}`}
                className="cat-card-viking"
              >
                <div className="cat-card-header">
                  <span className="cat-card-header-title">{cat.headerTitle}</span>
                </div>

                <div className="cat-card-stage">
                  <div className="cat-bundle-wrap">
                    {cat.packshots.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt=""
                        className={`cat-bundle-img cat-bundle-img--${idx === 0 ? 'center' : idx === 1 ? 'left' : 'right'}`}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>

                <div className="cat-card-footer">
                  <span className="cat-card-title">{cat.title}</span>
                  <span className="cat-card-subtitle">{cat.subtitle}</span>
                </div>
              </Link>
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* 4. Best Sellers Carousel */}
      <section className="products-showcase-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Más vendidos</h2>
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

      {/* 5. Dual Product Promo Banners with Real Packshots */}
      <section className="promotional-banners-section">
        <div className="container">
          <div className="promo-banners-grid">
            <Link to="/catalogo?categoria=proteinas" className="promo-banner-card promo-banner-dark">
              <div className="promo-banner-content">
                <span className="promo-badge-red">10% OFF POR TRANSFERENCIA</span>
                <h3 className="promo-title">Proteínas Whey & Isolate</h3>
                <p className="promo-desc">
                  Star Nutrition, ENA True Made y One Fit en doypack de 2 lb y baldes de 3 kg.
                </p>
                <span className="promo-cta-link">
                  Ver proteínas <ArrowRight size={15} />
                </span>
              </div>
              <img
                src="https://acdn-us.mitiendanube.com/stores/001/247/962/products/3kg-ban-f6002d8b105495880e17326433478591-640-0.webp"
                alt="Proteínas Whey"
                className="promo-banner-packshot"
                loading="lazy"
              />
            </Link>

            <Link to="/catalogo?categoria=creatinas" className="promo-banner-card promo-banner-dark-alt">
              <div className="promo-banner-content">
                <span className="promo-badge-green">6 CUOTAS SIN INTERÉS</span>
                <h3 className="promo-title">Creatinas Micronizadas 100% Puras</h3>
                <p className="promo-desc">
                  Monohidrato micronizado de ENA Sport, Star Nutrition y Optimum Nutrition.
                </p>
                <span className="promo-cta-link promo-cta-green">
                  Ver creatinas <ArrowRight size={15} />
                </span>
              </div>
              <img
                src="https://acdn-us.mitiendanube.com/stores/001/247/962/products/crea1-43ecc9d7c95f3dd32316495194702323-640-0.webp"
                alt="Creatinas Micronizadas"
                className="promo-banner-packshot"
                loading="lazy"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Featured Products Carousel */}
      <section className="products-showcase-section bg-secondary-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Destacados del mes</h2>
            <Link to="/catalogo" className="section-link">
              <span>Ver catálogo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <HorizontalScroller ariaLabel="Destacados del mes" perView={{ mobile: 2, tablet: 3, desktop: 4 }} mobilePeek={0.15}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </HorizontalScroller>
        </div>
      </section>

      {/* 7. Brands Showcase with Clean Brand Badges & Deep Shadows */}
      <section className="brands-strip-section" aria-label="Marcas oficiales de suplementación">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">DISTRIBUCIÓN OFICIAL</span>
              <h2 className="section-title">Nuestras Marcas</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>Ver catálogo completo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="brands-showcase-grid">
            {BRAND_SHOWCASE.map((brand) => (
              <Link
                key={brand.name}
                to={`/catalogo?marca=${encodeURIComponent(brand.filter)}`}
                className="brand-pack-card"
              >
                <div className="brand-logo-emblem" style={{ borderColor: `${brand.accentColor}33` }}>
                  <span className="brand-logo-text" style={{ color: brand.accentColor }}>{brand.logoText}</span>
                  <span className="brand-logo-sub">{brand.logoSub}</span>
                </div>
                <div className="brand-pack-meta">
                  <span className="brand-pack-name">{brand.name}</span>
                  <span className="brand-pack-tagline">{brand.tagline}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Google Reviews Moving Carousel */}
      <GoogleReviews />

      {/* 8. Recoleta Pickup & Real Google Map */}
      <section className="location-callout-section">
        <div className="container">
          <div className="location-callout-card">
            <div className="location-info-side">
              <h2 className="location-heading">Retiro sin cargo en Recoleta</h2>
              <div className="location-gym-badge">
                <span className="gym-tag">Gimnasio Top Shape</span>
              </div>
              <p className="location-address">
                <MapPin size={18} className="text-accent" />
                <span>Pres. José E. Uriburu 1163 (entre Av. Santa Fe y Arenales) — Recoleta, CABA</span>
              </p>
              <p className="location-hours">
                <Clock size={17} className="text-muted" />
                <span>{settings.hoursDescription}</span>
              </p>
              <p className="location-details-text">
                Comprá online y pasá a retirar tu pedido en el día presentando tu DNI en <strong>Gimnasio Top Shape</strong>, o pedí envío a domicilio a todo el país.
              </p>

              <div className="location-actions">
                <a
                  href="https://maps.google.com/?q=Gimnasio+Top+Shape,+Pres.+Jose+Evaristo+Uriburu+1163,+Recoleta,+Buenos+Aires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  <MapPin size={15} />
                  <span>Cómo llegar en Google Maps</span>
                </a>
                <a
                  href={`https://wa.me/${(settings.supportPhone || '5491165652990').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  <Phone size={15} />
                  <span>Consultas por WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="location-map-side">
              <iframe
                title="Mapa Suplementos Top — Gimnasio Top Shape, Pres. José E. Uriburu 1163, Recoleta"
                src="https://maps.google.com/maps?q=Pres.+Jose+E.+Uriburu+1163,+Recoleta,+Buenos+Aires&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '260px', display: 'block' }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Human Community & Instagram Reels (Estilo ProteViking) */}
      <InstagramFeed />

      {/* 10. Local SEO Semantic Authority Section */}
      <section className="seo-local-authority-section" aria-label="Información local de Suplementos Top en Recoleta">
        <div className="container">
          <div className="seo-authority-card">
            <h2 className="seo-authority-title">
              Tu Tienda de Suplementos Deportivos en Recoleta • Gimnasio Top Shape
            </h2>
            <div className="seo-authority-grid">
              <div className="seo-authority-item">
                <span className="seo-authority-tag">UBICACIÓN ESTRATÉGICA</span>
                <h3>Sede Recoleta / Barrio Norte</h3>
                <p>
                  Estamos ubicados en <strong>Pres. José E. Uriburu 1163</strong> (entre Av. Santa Fe y Arenales), a solo una cuadra de Av. Pueyrredón y a pasos de la estación Pueyrredón (Subte Líneas D y H). Zona de fácil acceso en CABA con múltiples líneas de transporte.
                </p>
              </div>

              <div className="seo-authority-item">
                <span className="seo-authority-tag">RETIRO EN EL DÍA</span>
                <h3>Mostrador Gimnasio Top Shape</h3>
                <p>
                  Comprá online con <strong>10% OFF por transferencia</strong> y retirá tu proteína, creatina o pre-entreno en el día sin costo de envío. Horarios amplios de Lunes a Viernes de 8:00 a 23:00 hs y Sábados de 10:00 a 18:00 hs.
                </p>
              </div>

              <div className="seo-authority-item">
                <span className="seo-authority-tag">CALIDAD CERTIFICADA</span>
                <h3>Marcas Oficiales ANMAT</h3>
                <p>
                  Punto de venta autorizado de <strong>Star Nutrition, ENA Sport, Optimum Nutrition (Gold Standard), One Fit, Dymatize y Gentech</strong>. Suplementos 100% originales con precinto de seguridad y vencimiento visible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-root {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* 3. Categorías principales (Estilo ProteViking con banner verde y bundle packshots) */
        .categories-section {
          padding: 2rem 0 1.25rem;
          background: var(--color-bg-main);
        }
        .cat-card-viking {
          position: relative;
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 18px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .cat-card-viking:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.14);
          border-color: #22C55E;
        }
        .cat-card-header {
          background: linear-gradient(135deg, #15803D 0%, #16A34A 50%, #22C55E 100%);
          padding: 0.75rem 1rem;
          color: #FFFFFF;
        }
        .cat-card-header-title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #FFFFFF;
          display: block;
        }
        .cat-card-stage {
          position: relative;
          height: 155px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0.85rem 0.5rem 0.65rem;
          background: #FFFFFF;
          overflow: hidden;
        }
        .cat-bundle-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .cat-bundle-img {
          object-fit: contain;
          transition: transform 0.25s ease;
          mix-blend-mode: multiply;
        }
        .cat-bundle-img--center {
          position: relative;
          z-index: 3;
          height: 125px;
          max-width: 58%;
        }
        .cat-bundle-img--left {
          position: absolute;
          left: 4%;
          bottom: 2px;
          z-index: 2;
          height: 105px;
          max-width: 48%;
          transform: rotate(-5deg);
          opacity: 0.95;
        }
        .cat-bundle-img--right {
          position: absolute;
          right: 4%;
          bottom: 2px;
          z-index: 1;
          height: 102px;
          max-width: 48%;
          transform: rotate(5deg);
          opacity: 0.95;
        }
        .cat-card-viking:hover .cat-bundle-img--center {
          transform: scale(1.05);
        }
        .cat-card-viking:hover .cat-bundle-img--left {
          transform: rotate(-7deg) scale(1.03);
        }
        .cat-card-viking:hover .cat-bundle-img--right {
          transform: rotate(7deg) scale(1.03);
        }
        .cat-card-footer {
          padding: 0.65rem 0.85rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          background: #FFFFFF;
          border-top: 1px solid #F1F5F9;
        }
        .cat-card-title {
          font-family: var(--font-display);
          font-size: 0.92rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.2;
        }
        .cat-card-subtitle {
          font-size: 0.76rem;
          color: #64748B;
          font-weight: 500;
        }

        /* 4. Products Showcase */
        .products-showcase-section {
          padding: 1.75rem 0;
          background-color: var(--color-bg-main);
        }
        .bg-secondary-section {
          background-color: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }

        /* 5. Promotional Banners with Real Packshots */
        .promotional-banners-section {
          padding: 0.75rem 0 2.25rem;
          background-color: var(--color-bg-main);
        }
        .promo-banners-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .promo-banners-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        .promo-banner-card {
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.25rem;
          border: 1px solid var(--color-border);
          text-decoration: none;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        @media (max-width: 480px) {
          .promo-banner-card {
            padding: 1.15rem 1rem;
            gap: 0.75rem;
          }
          .promo-banner-packshot {
            width: 90px !important;
            height: 90px !important;
          }
          .promo-title {
            font-size: 1.1rem !important;
          }
          .promo-desc {
            font-size: 0.76rem !important;
          }
        }
        .promo-banner-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(15, 23, 42, 0.18);
        }
        .promo-banner-dark {
          background: linear-gradient(135deg, #09090B 0%, #18181B 60%, #0F172A 100%);
          color: #FFFFFF;
          border-color: #27272A;
        }
        .promo-banner-dark .promo-title {
          color: #FFFFFF;
        }
        .promo-banner-dark .promo-desc {
          color: #CBD5E1;
        }
        .promo-banner-dark-alt {
          background: linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #09090B 100%);
          color: #FFFFFF;
          border-color: #1E293B;
        }
        .promo-banner-dark-alt .promo-title {
          color: #FFFFFF;
        }
        .promo-banner-dark-alt .promo-desc {
          color: #CBD5E1;
        }
        .promo-banner-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.55rem;
          flex: 1;
        }
        .promo-badge-red {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          background-color: var(--color-accent);
          color: #FFFFFF;
          padding: 0.22rem 0.55rem;
          border-radius: 4px;
        }
        .promo-badge-green {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          background-color: #16A34A;
          color: #FFFFFF;
          padding: 0.22rem 0.55rem;
          border-radius: 4px;
        }
        .promo-title {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .promo-desc {
          font-size: 0.82rem;
          line-height: 1.45;
          margin: 0;
        }
        .promo-cta-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-top: 0.25rem;
          transition: color 0.15s ease;
        }
        .promo-cta-link:hover {
          color: var(--color-accent);
        }
        .promo-cta-green:hover {
          color: #4ADE80;
        }
        .promo-banner-packshot {
          width: 120px;
          height: 120px;
          object-fit: contain;
          background: #FFFFFF;
          border-radius: 8px;
          padding: 0.4rem;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        @media (min-width: 900px) {
          .promo-banner-packshot {
            width: 140px;
            height: 140px;
          }
        }

        /* 7. Brands Showcase with Clean Brand Badges & Deep Shadows */
        .brands-strip-section {
          padding: 2.5rem 0;
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
        }
        .brands-showcase-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .brands-showcase-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.15rem;
          }
        }
        @media (min-width: 992px) {
          .brands-showcase-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 1.25rem;
          }
        }
        .brand-pack-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.1rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
          color: var(--color-text-main);
          min-width: 0;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
          transition: all 0.25s ease;
        }
        .brand-pack-card:hover {
          border-color: #10B981;
          box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.1);
          transform: translateY(-3px);
        }
        .brand-logo-emblem {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 2px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .brand-logo-text {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0.05em;
        }
        .brand-logo-sub {
          font-family: var(--font-body);
          font-size: 0.52rem;
          font-weight: 800;
          color: #64748B;
          letter-spacing: 0.08em;
          margin-top: 1px;
        }
        .brand-pack-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .brand-pack-name {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .brand-pack-tagline {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        @media (max-width: 420px) {
          .brands-showcase-grid {
            grid-template-columns: 1fr;
            gap: 0.65rem;
          }
          .brand-pack-card {
            padding: 0.85rem;
          }
          .brand-logo-emblem {
            width: 42px;
            height: 42px;
          }
          .brand-logo-text {
            font-size: 0.75rem;
          }
        }

        /* 8. Location Callout with Real Map */
        .location-callout-section {
          padding: 2rem 0 1rem;
          background-color: var(--color-bg-main);
        }
        .location-callout-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 12px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .location-callout-card {
            grid-template-columns: 1.15fr 0.85fr;
          }
        }
        .location-info-side {
          padding: 1.5rem 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        @media (min-width: 768px) {
          .location-info-side {
            padding: 2.25rem;
          }
        }
        @media (max-width: 540px) {
          .location-actions {
            flex-direction: column;
            width: 100%;
            gap: 0.6rem;
          }
          .location-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
        .location-heading {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }
        .location-gym-badge {
          margin-bottom: 0.75rem;
        }
        .gym-tag {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: var(--color-accent-light);
          color: var(--color-accent);
          border: 1px solid rgba(240, 16, 58, 0.3);
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
        }
        .location-address,
        .location-hours {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--color-text-main);
        }
        .location-hours {
          font-weight: 500;
          color: var(--color-text-muted);
          margin-bottom: 1rem;
        }
        .location-details-text {
          font-size: 0.84rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          max-width: 520px;
        }
        .location-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .location-map-side {
          position: relative;
          min-height: 260px;
          background: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border);
        }
        @media (min-width: 900px) {
          .location-map-side {
            border-top: none;
            border-left: 1px solid var(--color-border);
          }
        }

        /* 9. SEO Local Authority Section */
        .seo-local-authority-section {
          padding: 2.5rem 0 3.5rem;
          background: var(--color-bg-main);
        }
        .seo-authority-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 2.25rem 2rem;
        }
        .seo-authority-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.02em;
          margin: 0 0 1.75rem 0;
          text-align: center;
        }
        .seo-authority-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .seo-authority-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
        }
        .seo-authority-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .seo-authority-tag {
          font-size: 0.70rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--color-accent);
          text-transform: uppercase;
        }
        .seo-authority-item h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin: 0;
        }
        .seo-authority-item p {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* NEON THEME HOME PAGE OVERRIDES */
        /* Tarjetas de categoría: placa blanca completa (los packshots vienen con fondo blanco) */
        [data-theme="neon"] .cat-pack-stage {
          background: #FFFFFF !important;
          border: 2px solid #1E293B !important;
          padding: 1.9rem 0.6rem 0.6rem !important;
        }
        [data-theme="neon"] .categories-section {
          padding-bottom: 0.25rem !important;
        }
        [data-theme="neon"] .cat-pack-title {
          margin-top: 0.35rem !important;
        }
        [data-theme="neon"] .cat-pack-stage:hover {
          border-color: #00FF66 !important;
          box-shadow: 0 0 16px rgba(0, 255, 102, 0.25) !important;
        }
        [data-theme="neon"] .cat-pack-title {
          color: #F8FAFC !important;
        }
        [data-theme="neon"] .cat-pack-subtitle {
          color: #94A3B8 !important;
        }
        [data-theme="neon"] .brand-pack-card {
          background: #121824 !important;
          border-color: #1E293B !important;
        }
        [data-theme="neon"] .brand-pack-card:hover {
          border-color: #00FF66 !important;
          box-shadow: 0 0 16px rgba(0, 255, 102, 0.22) !important;
        }
        [data-theme="neon"] .brand-pack-name {
          color: #F8FAFC !important;
        }
        [data-theme="neon"] .location-callout-card {
          background: #121824 !important;
          border-color: #1E293B !important;
        }
        [data-theme="neon"] .location-heading {
          color: #F8FAFC !important;
        }
        [data-theme="neon"] .location-address {
          color: #F8FAFC !important;
        }
        [data-theme="neon"] .location-hours,
        [data-theme="neon"] .location-details-text {
          color: #94A3B8 !important;
        }
        [data-theme="neon"] .location-map-side {
          background: #0E141E !important;
          border-color: #1E293B !important;
        }
        [data-theme="neon"] .seo-authority-card {
          background: #121824 !important;
          border-color: #1E293B !important;
        }
        [data-theme="neon"] .seo-authority-title,
        [data-theme="neon"] .seo-authority-item h3 {
          color: #F8FAFC !important;
        }
        [data-theme="neon"] .seo-authority-item p {
          color: #94A3B8 !important;
        }
        [data-theme="neon"] .btn-outline {
          background: transparent !important;
          border: 1.5px solid #00FF66 !important;
          color: #00FF66 !important;
        }
        [data-theme="neon"] .btn-outline:hover {
          background: #00FF66 !important;
          color: #0B0E14 !important;
        }
      `}</style>
    </div>
  );
};
