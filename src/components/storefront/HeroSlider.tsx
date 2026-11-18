import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  imageUrl: string;
}

export const HeroSlider: React.FC = () => {
  const slides: Slide[] = [
    {
      id: 1,
      tag: 'TEMPORADA DE ENTRENAMIENTO 2026',
      tagColor: '#E11D48',
      title: 'SUPLEMENTOS ORIGINALES AL MEJOR PRECIO',
      subtitle: 'Las mejores marcas con envío a todo el país o retiro gratis en Recoleta.',
      badge: '3 Y 6 CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS',
      ctaText: 'Ver productos',
      ctaLink: '/catalogo',
      bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      tag: 'MATERIAS PRIMAS IMPORTADAS',
      tagColor: '#16A34A',
      title: 'PROTEÍNAS Y CREATINAS 100% PURAS',
      subtitle: 'Whey Isolate y Creapure® de distribuidores oficiales. Combos con hasta 20% OFF.',
      badge: 'COMBOS CON HASTA 20% OFF Y ENVÍO GRATIS',
      ctaText: 'Ver proteínas',
      ctaLink: '/catalogo?categoria=proteinas',
      bgGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 3,
      tag: 'RETIRO EN EL DÍA EN CABA',
      tagColor: '#F59E0B',
      title: 'COMPRÁ ONLINE, RETIRÁ HOY EN RECOLETA',
      subtitle: 'Uriburu 1163 (entre Santa Fe y Arenales). Lun a Vie 8 a 23 hs · Sáb 10 a 18 hs.',
      badge: 'COMPRÁ ONLINE Y RETIRÁ EN EL ACTO SIN COSTO',
      ctaText: 'Cómo retirar',
      ctaLink: '/contacto',
      bgGradient: 'linear-gradient(135deg, #18181B 0%, #27272A 100%)',
      imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div 
      className="hero-slider-root"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="hero-slide-item"
        style={{ background: slide.bgGradient }}
      >
        <div className="container hero-slide-grid">
          {/* Text Content */}
          <div className="hero-slide-text">
            <div className="slide-tag-wrap">
              <span className="slide-tag" style={{ borderColor: slide.tagColor, color: slide.tagColor }}>
                {slide.tag}
              </span>
            </div>

            <h1 className="slide-title">{slide.title}</h1>

            <p className="slide-subtitle">{slide.subtitle}</p>

            <div className="slide-promo-pills">
              <span className="promo-pill promo-pill-white">10% OFF <small>transferencia</small></span>
              <span className="promo-pill promo-pill-green">6 CUOTAS <small>SIN INTERÉS</small></span>
            </div>

            <div className="slide-cta-row">
              <Link to={slide.ctaLink} className="slide-cta-btn">
                <span>{slide.ctaText}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Image Content */}
          <div className="hero-slide-media">
            <div className="slide-img-frame">
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                className="slide-img" 
              />
              <div className="slide-img-overlay"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev} 
        className="slider-arrow-btn arrow-prev" 
        aria-label="Slide anterior"
      >
        <ChevronLeft size={22} />
      </button>
      <button 
        onClick={handleNext} 
        className="slider-arrow-btn arrow-next" 
        aria-label="Slide siguiente"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot Indicators */}
      <div className="slider-dots-wrap">
        {slides.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(index)}
            className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero-slider-root {
          position: relative;
          overflow: hidden;
          background: #0F172A;
        }
        .hero-slide-item {
          min-height: 400px;
          display: flex;
          align-items: center;
          transition: background 0.4s ease;
          position: relative;
        }
        @media (min-width: 768px) {
          .hero-slide-item {
            min-height: 500px;
          }
        }
        .hero-slide-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding-top: 2.25rem;
          padding-bottom: 3rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hero-slide-grid {
            grid-template-columns: 1.15fr 0.85fr;
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }
        .hero-slide-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          z-index: 2;
        }
        .slide-tag-wrap {
          margin-bottom: 0.85rem;
        }
        .slide-tag {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-xs);
          border: 1.5px solid currentColor;
          background: rgba(0, 0, 0, 0.35);
        }
        .slide-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 2.1rem;
          line-height: 1.15;
          color: #FFFFFF;
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }
        @media (min-width: 768px) {
          .slide-title {
            font-size: 3rem;
          }
        }
        .slide-subtitle {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #CBD5E1;
          margin-bottom: 1.5rem;
          max-width: 580px;
        }
        .slide-promo-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 1.5rem;
        }
        .promo-pill {
          display: inline-flex;
          align-items: baseline;
          gap: 0.35rem;
          border-radius: var(--radius-full);
          padding: 0.5rem 1.1rem;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1rem;
          line-height: 1;
          letter-spacing: 0.01em;
        }
        .promo-pill small {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }
        .promo-pill-white {
          background: #FFFFFF;
          color: var(--color-promo-red);
        }
        .promo-pill-white small { color: #0F172A; }
        .promo-pill-green {
          background: var(--color-promo-green);
          color: #FFFFFF;
        }
        @media (min-width: 768px) {
          .promo-pill { font-size: 1.2rem; padding: 0.6rem 1.3rem; }
          .promo-pill small { font-size: 0.75rem; }
        }
        .slide-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .slide-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--color-accent);
          color: #FFFFFF;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.1rem;
          padding: 0.9rem 2rem;
          border-radius: var(--radius-full);
          text-decoration: none;
          box-shadow: 0 8px 20px -6px rgba(240, 16, 58, 0.55);
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .slide-cta-btn:hover {
          background: var(--color-accent-hover);
          color: #FFFFFF;
          transform: translateY(-2px);
        }
        @media (min-width: 768px) {
          .slide-cta-btn { font-size: 1.35rem; padding: 1rem 2.6rem; }
        }

        /* Slide Media */
        .hero-slide-media {
          display: none;
          justify-content: center;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hero-slide-media {
            display: flex;
          }
        }
        .slide-img-frame {
          position: relative;
          width: 100%;
          max-width: 440px;
          height: 380px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .hero-slide-root:hover .slide-img {
          transform: scale(1.03);
        }
        .slide-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, transparent 60%);
        }

        /* Arrows */
        .slider-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(4px);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .slider-arrow-btn:hover {
          background: #FFFFFF;
          color: #0F172A;
        }
        .arrow-prev {
          left: 1rem;
        }
        .arrow-next {
          right: 1rem;
        }
        @media (max-width: 640px) {
          .slider-arrow-btn {
            display: none;
          }
        }

        /* Dots */
        .slider-dots-wrap {
          position: absolute;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 10;
        }
        .slider-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.35);
          transition: all 0.2s ease;
        }
        .slider-dot.active {
          width: 28px;
          border-radius: var(--radius-full);
          background: var(--color-accent);
        }
      `}</style>
    </div>
  );
};
