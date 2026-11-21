import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideProduct {
  name: string;
  imageUrl: string;
}

interface Slide {
  id: number;
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
    title: 'Suplementos originales de las mejores marcas',
    subtitle:
      'Star Nutrition, ENA Sport, Optimum Nutrition y One Fit con envío a todo el país o retiro sin cargo en Recoleta.',
    highlight1: '10% OFF por transferencia',
    highlight2: '6 cuotas sin interés con Mercado Pago',
    ctaText: 'Ver productos',
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
        name: 'Optimum Nutrition Creatine',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/proyecto-nuevo-66-89296cadbf5be4b82e17579636094867-640-0.webp',
      },
    ],
  },
  {
    id: 2,
    title: 'Proteínas Whey y Creatinas 100% puras',
    subtitle:
      'Doypacks de 2 lb y baldes de 3 kg con sello de fábrica. Llevá tu combo de proteína + creatina con descuento.',
    highlight1: 'Hasta 20% OFF en combos',
    highlight2: 'Envío gratis desde $85.000',
    ctaText: 'Ver proteínas',
    ctaLink: '/catalogo?categoria=proteinas',
    products: [
      {
        name: 'Star Nutrition Whey 3 Kg',
        imageUrl:
          'https://acdn-us.mitiendanube.com/stores/001/247/962/products/3kg-ban-f6002d8b105495880e17326433478591-640-0.webp',
      },
      {
        name: 'ENA True Made Whey',
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
    title: 'Comprá online y retirá hoy en Recoleta',
    subtitle:
      'Gimnasio Top Shape — Pres. José E. Uriburu 1163 (entre Av. Santa Fe y Arenales). Lun a Vie 8 a 23 hs y Sáb 10 a 18 hs sin costo.',
    highlight1: 'Retiro en el día sin cargo',
    highlight2: 'Atención personalizada',
    ctaText: 'Ubicación y horarios',
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

const AUTOPLAY_INTERVAL = 3600;

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
              <div className="container pv-hero-grid">
                <div className="pv-hero-copy">
                  <h1 className="pv-hero-title">{slide.title}</h1>
                  <p className="pv-hero-sub">{slide.subtitle}</p>

                  <div className="pv-hero-highlights">
                    <span className="pv-hi pv-hi-green">{slide.highlight1}</span>
                    <span className="pv-hi pv-hi-neutral">{slide.highlight2}</span>
                  </div>

                  <div className="pv-hero-actions">
                    <Link to={slide.ctaLink} className="pv-hero-cta">
                      {slide.ctaText}
                    </Link>
                  </div>
                </div>

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
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="pv-hero-arrow pv-hero-arrow--next"
        aria-label="Siguiente"
      >
        <ChevronRight size={20} />
      </button>

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
          background: #F4F5F7;
          border-bottom: 1px solid #E4E4E7;
          min-height: 340px;
        }
        @media (min-width: 900px) {
          .pv-hero {
            height: clamp(360px, 44vh, 430px);
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
          padding: 1.5rem 0 2.5rem;
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
            min-height: 320px;
            padding: 1.75rem 0 2.75rem;
          }
          .pv-hero-slide:not(.active) {
            display: none;
          }
        }

        .pv-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
        }
        @media (min-width: 900px) {
          .pv-hero-grid {
            grid-template-columns: 1.05fr 0.95fr;
            gap: 2.5rem;
          }
        }

        .pv-hero-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 560px;
        }
        .pv-hero-title {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: clamp(1.6rem, 3.2vw, 2.45rem);
          line-height: 1.15;
          color: #18181B;
          margin: 0 0 0.7rem;
          letter-spacing: -0.02em;
        }
        .pv-hero-sub {
          font-size: clamp(0.84rem, 1.2vw, 0.95rem);
          line-height: 1.55;
          color: #52525B;
          margin: 0 0 1.15rem;
        }

        .pv-hero-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .pv-hi {
          display: inline-flex;
          align-items: center;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.4rem 0.85rem;
          border-radius: 5px;
          line-height: 1.1;
        }
        .pv-hi-green {
          background: #5B8C2A;
          color: #FFFFFF;
        }
        .pv-hi-neutral {
          background: #FFFFFF;
          color: #18181B;
          border: 1px solid #E4E4E7;
        }

        .pv-hero-actions {
          display: flex;
          gap: 0.75rem;
        }
        @media (max-width: 640px) {
          .pv-hero-actions {
            width: 100%;
          }
          .pv-hero-cta {
            width: 100%;
            text-align: center;
          }
        }
        .pv-hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #18181B;
          color: #FFFFFF;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.75rem 1.75rem;
          border-radius: 5px;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .pv-hero-cta:hover {
          background: #27272A;
          color: #FFFFFF;
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
          background: #FFFFFF;
          border: 1px solid #E4E4E7;
          border-radius: 10px;
          padding: 0.75rem;
          width: 155px;
          height: 185px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px -10px rgba(15, 23, 42, 0.12);
        }
        .pv-hero-pack--1 {
          width: 180px;
          height: 215px;
          box-shadow: 0 14px 30px -10px rgba(15, 23, 42, 0.18);
        }
        .pv-hero-pack img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .pv-hero-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #FFFFFF;
          color: #18181B;
          border: 1px solid #E4E4E7;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background 0.15s ease;
        }
        .pv-hero-arrow:hover {
          background: #F4F4F5;
        }
        .pv-hero-arrow--prev { left: 1rem; }
        .pv-hero-arrow--next { right: 1rem; }
        @media (max-width: 640px) {
          .pv-hero-arrow { display: none; }
        }

        .pv-hero-dots {
          position: absolute;
          bottom: 0.9rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.4rem;
          z-index: 10;
        }
        .pv-hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #CBD5E1;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: width 0.25s ease, background 0.25s ease;
        }
        .pv-hero-dot.active {
          width: 24px;
          background: #18181B;
        }
      `}</style>
    </section>
  );
};
