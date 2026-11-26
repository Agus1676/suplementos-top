import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface SlideProduct {
  name: string;
  imageUrl: string;
}

interface Slide {
  id: number;
  bgImage: string;
  tag: string;
  title: string;
  subtitle: string;
  highlight1: string;
  highlight2: string;
  ctaText: string;
  ctaLink: string;
  products: SlideProduct[];
}

const SLIDES: Slide[] = [
  {
    id: 1,
    bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    tag: '⚡ 100% ORIGINALES • ENVÍO A TODO EL PAÍS',
    title: 'MÁS DE 100 PEDIDOS POR DÍA, SALEN DE ACÁ',
    subtitle:
      'Suplementos originales de las mejores marcas, con envío a todo el país o retiro sin cargo en nuestro local de Recoleta.',
    highlight1: '🤝 10% OFF Transferencia',
    highlight2: '💳 6 Cuotas Sin Interés',
    ctaText: 'Ver Productos',
    ctaLink: '/catalogo',
    products: [
      {
        name: 'Star Nutrition Whey Protein',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-36-d9bc6bd2b3819e422717800791905669-640-0.webp',
      },
      {
        name: 'ENA Creatina Micronizada',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/crea1-43ecc9d7c95f3dd32316495194702323-640-0.webp',
      },
      {
        name: 'Optimum Nutrition Gold Standard',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-66-89296cadbf5be4b82e17579636094867-640-0.webp',
      },
    ],
  },
  {
    id: 2,
    bgImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80',
    tag: '🔥 MASA MUSCULAR & RENDIMIENTO',
    title: 'PROTEÍNAS WHEY Y CREATINAS 100% PURAS',
    subtitle:
      'Materia prima importada con máxima pureza y disolución instantánea. Recuperación muscular y fuerza explosiva sin rellenos.',
    highlight1: '🔥 Hasta 20% OFF en Combos',
    highlight2: '🚚 Envíos Express en el Día',
    ctaText: 'Ver Proteínas y Combos',
    ctaLink: '/catalogo?categoria=proteinas',
    products: [
      {
        name: 'Star Nutrition Whey 3 Kg',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/3kg-ban-f6002d8b105495880e17326433478591-640-0.webp',
      },
      {
        name: 'ENA True Made Whey 2lb',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/truemade_vainilla_2lb-webp1-0f17ea0eb698979f4916826203173730-640-0.webp',
      },
      {
        name: 'One Fit Classic Whey',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-95-5c7345af65acc8ee4917654696614725-640-0.webp',
      },
    ],
  },
  {
    id: 3,
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    tag: '📍 GIMNASIO TOP SHAPE • RECOLETA',
    title: 'COMPRÁ ONLINE Y RETIRÁ HOY EN RECOLETA',
    subtitle:
      'Sede oficial en Pres. José E. Uriburu 1163 (entre Av. Santa Fe y Arenales). Lunes a Viernes de 8 a 23 hs y Sábados de 10 a 18 hs sin costo.',
    highlight1: '📍 Retiro en el Día $0 GRATIS',
    highlight2: '💬 WhatsApp 11 6565-2990',
    ctaText: 'Ubicación y Horarios',
    ctaLink: '/contacto',
    products: [
      {
        name: 'Star Nutrition Pump V8',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/v8-acai-296d8b9d4323834baa17326403674588-640-0.webp',
      },
      {
        name: 'ENA ISOPROT Isolate',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-2026-10-03t104933-283-8d35f5b7ba1edf476917910354272508-640-0.webp',
      },
      {
        name: 'Star Nutrition Magnesio',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/magnesio-star-715031aedf196789d517327300732618-640-0.webp',
      },
    ],
  },
];

const AUTOPLAY_INTERVAL = 4500;

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) nextSlide();
    else if (diff < -45) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      className="pv-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promociones principales"
    >
      <div className="pv-hero-slides">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`pv-hero-slide ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Background atmospheric photo */}
              <div className="pv-hero-bg">
                <img
                  src={slide.bgImage}
                  alt=""
                  className="pv-hero-bg-img"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="pv-hero-bg-overlay" />
              </div>

              <div className="container pv-hero-grid">
                <div className="pv-hero-copy">
                  <div className="pv-hero-tag-wrap">
                    <span className="pv-hero-tag">{slide.tag}</span>
                  </div>

                  <h1 className="pv-hero-title">{slide.title}</h1>
                  <p className="pv-hero-sub">{slide.subtitle}</p>

                  {/* Pills (Estilo ProteViking: 10% OFF & 6 Cuotas) */}
                  <div className="pv-hero-highlights">
                    <span className="pv-hi pv-hi-pill-white">{slide.highlight1}</span>
                    <span className="pv-hi pv-hi-pill-green">{slide.highlight2}</span>
                  </div>

                  {/* Prominent floating CTA button at the bottom */}
                  <div className="pv-hero-actions">
                    <Link to={slide.ctaLink} className="pv-hero-cta-viking">
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>

                {/* Real Product Packshots Trio on Right */}
                <div className="pv-hero-products">
                  {slide.products.map((prod, idx) => (
                    <div key={prod.name} className={`pv-hero-pack pv-hero-pack--${idx}`}>
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={prevSlide}
        className="pv-hero-arrow pv-hero-arrow--prev"
        aria-label="Anterior"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="pv-hero-arrow pv-hero-arrow--next"
        aria-label="Siguiente"
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination dots centered at bottom */}
      <div className="pv-hero-dots">
        {SLIDES.map((s, index) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentSlide(index)}
            className={`pv-hero-dot ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .pv-hero {
          position: relative;
          overflow: hidden;
          background: #0B0E14;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          min-height: 440px;
        }
        @media (min-width: 900px) {
          .pv-hero {
            height: clamp(430px, 52vh, 490px);
          }
        }
        .pv-hero-slides {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .pv-hero-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
          pointer-events: none;
          display: flex;
          align-items: center;
          padding: 2rem 0 3.25rem;
        }
        .pv-hero-slide.active {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          z-index: 2;
        }
        @media (max-width: 899px) {
          .pv-hero-slides {
            display: grid;
            grid-template-columns: 1fr;
          }
          .pv-hero-slide {
            grid-area: 1 / 1;
            position: relative;
            inset: auto;
            min-height: 420px;
            padding: 2rem 0 3.75rem;
          }
          .pv-hero-slide:not(.active) {
            display: none;
          }
        }

        /* Atmospheric Background Image & Overlays */
        .pv-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }
        .pv-hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transform: scale(1.04);
          transition: transform 6s ease-out;
        }
        .pv-hero-slide.active .pv-hero-bg-img {
          transform: scale(1);
        }
        .pv-hero-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg, 
            rgba(11, 14, 20, 0.95) 0%, 
            rgba(11, 14, 20, 0.88) 52%, 
            rgba(11, 14, 20, 0.50) 100%
          );
        }
        @media (max-width: 899px) {
          .pv-hero-bg-overlay {
            background: linear-gradient(
              180deg, 
              rgba(11, 14, 20, 0.92) 0%, 
              rgba(11, 14, 20, 0.96) 100%
            );
          }
        }

        .pv-hero-grid {
          position: relative;
          z-index: 3;
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }
        @media (min-width: 900px) {
          .pv-hero-grid {
            grid-template-columns: 1.2fr 0.8fr;
            gap: 2.5rem;
            padding-left: 3.75rem;
            padding-right: 3.75rem;
          }
        }

        .pv-hero-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 620px;
        }
        @media (max-width: 899px) {
          .pv-hero-copy {
            align-items: center;
            text-align: center;
            margin: 0 auto;
          }
        }

        .pv-hero-tag-wrap {
          margin-bottom: 0.65rem;
        }
        .pv-hero-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
        }

        .pv-hero-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(1.65rem, 3.8vw, 2.75rem);
          line-height: 1.1;
          color: #FFFFFF;
          margin: 0 0 0.75rem;
          letter-spacing: -0.01em;
          text-transform: uppercase;
          text-shadow: 0 2px 12px rgba(0,0,0,0.6);
        }

        .pv-hero-sub {
          font-size: clamp(0.88rem, 1.3vw, 1.02rem);
          line-height: 1.55;
          color: #CBD5E1;
          margin: 0 0 1.35rem;
          text-shadow: 0 1px 6px rgba(0,0,0,0.5);
          max-width: 540px;
        }

        /* Pills (Estilo ProteViking: 10% OFF & 6 Cuotas) */
        .pv-hero-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 1.6rem;
        }
        @media (max-width: 899px) {
          .pv-hero-highlights {
            justify-content: center;
          }
        }
        .pv-hi {
          display: inline-flex;
          align-items: center;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 0.45rem 1rem;
          border-radius: 999px;
          line-height: 1.15;
          letter-spacing: 0.02em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .pv-hi-pill-white {
          background: #FFFFFF;
          color: #15803D;
          border: 1.5px solid #86EFAC;
        }
        .pv-hi-pill-green {
          background: #16A34A;
          color: #FFFFFF;
          border: 1.5px solid #22C55E;
        }

        /* Floating CTA Button (Estilo ProteViking) */
        .pv-hero-actions {
          display: flex;
          gap: 0.75rem;
        }
        @media (max-width: 899px) {
          .pv-hero-actions {
            width: 100%;
            justify-content: center;
          }
        }
        .pv-hero-cta-viking {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #16A34A 0%, #22C55E 100%);
          color: #FFFFFF;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.05rem;
          letter-spacing: -0.01em;
          padding: 0.85rem 2.5rem;
          border-radius: 999px;
          text-decoration: none;
          box-shadow: 0 6px 22px rgba(22, 163, 74, 0.45);
          transition: all 0.22s ease;
        }
        .pv-hero-cta-viking:hover {
          background: linear-gradient(135deg, #15803D 0%, #16A34A 100%);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 28px rgba(22, 163, 74, 0.6);
          color: #FFFFFF;
        }
        @media (max-width: 480px) {
          .pv-hero-cta-viking {
            width: 85%;
            padding: 0.8rem 1.75rem;
            font-size: 0.98rem;
          }
        }

        /* Real Product Packshots Trio on Right */
        .pv-hero-products {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 0.85rem;
        }
        @media (min-width: 900px) {
          .pv-hero-products {
            display: flex;
          }
        }
        .pv-hero-pack {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 14px;
          padding: 0.85rem;
          width: 155px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
          transition: transform 0.25s ease;
        }
        .pv-hero-pack:hover {
          transform: translateY(-4px) scale(1.02);
        }
        .pv-hero-pack--1 {
          width: 185px;
          height: 225px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
          border-color: rgba(34, 197, 94, 0.5);
        }
        .pv-hero-pack img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Arrows */
        .pv-hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(11, 14, 20, 0.7);
          backdrop-filter: blur(8px);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
        }
        .pv-hero-arrow:hover {
          background: #FFFFFF;
          color: #0F172A;
          border-color: #FFFFFF;
          transform: translateY(-50%) scale(1.06);
        }
        .pv-hero-arrow--prev { left: 1rem; }
        .pv-hero-arrow--next { right: 1rem; }
        @media (max-width: 640px) {
          .pv-hero-arrow { display: none; }
        }

        /* Pagination dots centered at bottom */
        .pv-hero-dots {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 10;
        }
        .pv-hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .pv-hero-dot.active {
          width: 26px;
          border-radius: 999px;
          background: #22C55E;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
        }
      `}</style>
    </section>
  );
};
