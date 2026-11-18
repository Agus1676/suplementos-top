import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  pill1Text: string;
  pill1Sub: string;
  pill2Text: string;
  pill2Sub: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'TEMPORADA DE ENTRENAMIENTO 2026',
    tagColor: '#FF1744',
    title: 'SUPLEMENTOS ORIGINALES AL MEJOR PRECIO',
    subtitle: 'Las marcas líderes en nutrición deportiva con stock garantizado, envío a todo el país y retiro en Recoleta.',
    pill1Text: '10% OFF',
    pill1Sub: 'transferencia',
    pill2Text: '6 CUOTAS',
    pill2Sub: 'SIN INTERÉS',
    ctaText: 'Ver productos',
    ctaLink: '/catalogo',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 2,
    tag: 'FÓRMULAS 100% PURAS & CERTIFICADAS',
    tagColor: '#22C55E',
    title: 'PROTEÍNAS WHEY & CREAPURE® ALEMANA',
    subtitle: 'Materia prima importada con máxima pureza y disolución instantánea. Recuperación muscular sin rellenos.',
    pill1Text: 'HASTA 20% OFF',
    pill1Sub: 'en combos',
    pill2Text: 'ENVÍO GRATIS',
    pill2Sub: 'desde $85.000',
    ctaText: 'Ver proteínas',
    ctaLink: '/catalogo?categoria=proteinas',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 3,
    tag: 'LOCAL FÍSICO OFICIAL EN CABA',
    tagColor: '#FACC15',
    title: 'COMPRÁ ONLINE, RETIRÁ HOY EN RECOLETA',
    subtitle: 'Uriburu 1163 (entre Av. Santa Fe y Arenales). Lunes a Viernes de 8 a 23 hs · Sábados 10 a 18 hs sin cargo.',
    pill1Text: 'RETIRO EN EL DÍA',
    pill1Sub: 'gratis',
    pill2Text: '11 6565 1990',
    pill2Sub: 'WhatsApp directo',
    ctaText: 'Cómo retirar',
    ctaLink: '/contacto',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
  }
];

const AUTOPLAY_INTERVAL = 3400; // 3.4 seconds (fast, dynamic, modern)

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

  // Fast auto-change timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      nextSlide(); // swipe left
    } else if (diff < -45) {
      prevSlide(); // swipe right
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="hero-slider-root"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="hero-slides-wrapper">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div 
              key={slide.id}
              className={`hero-slide-layer ${isActive ? 'active' : ''}`}
              aria-hidden={!isActive}
            >
              {/* Full-bleed background image with modern overlay */}
              <div className="hero-slide-bg">
                <img 
                  src={slide.imageUrl} 
                  alt="" 
                  className="hero-slide-bg-img"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <div className="hero-slide-gradient-overlay" />
              </div>

              {/* Text content inside container */}
              <div className="container hero-slide-container">
                <div className="hero-slide-content">
                  <div className="slide-tag-wrap">
                    <span 
                      className="slide-tag" 
                      style={{ borderColor: slide.tagColor, color: slide.tagColor }}
                    >
                      {slide.tag}
                    </span>
                  </div>

                  <h1 className="slide-title">{slide.title}</h1>

                  <p className="slide-subtitle">{slide.subtitle}</p>

                  <div className="slide-promo-pills">
                    <span className="promo-pill promo-pill-white">
                      {slide.pill1Text} <small>{slide.pill1Sub}</small>
                    </span>
                    <span className="promo-pill promo-pill-green">
                      {slide.pill2Text} <small>{slide.pill2Sub}</small>
                    </span>
                  </div>

                  <div className="slide-cta-row">
                    <Link to={slide.ctaLink} className="slide-cta-btn">
                      <span>{slide.ctaText}</span>
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button 
        type="button"
        onClick={prevSlide} 
        className="slider-arrow-btn arrow-prev" 
        aria-label="Slide anterior"
      >
        <ChevronLeft size={22} />
      </button>
      <button 
        type="button"
        onClick={nextSlide} 
        className="slider-arrow-btn arrow-next" 
        aria-label="Slide siguiente"
      >
        <ChevronRight size={22} />
      </button>

      {/* Modern Progress Dots */}
      <div className="slider-dots-wrap">
        {SLIDES.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`slider-dot ${isActive ? 'active' : ''}`}
              aria-label={`Ir al slide ${index + 1}`}
            >
              {isActive && (
                <span 
                  className="dot-progress-bar"
                  style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        .hero-slider-root {
          position: relative;
          overflow: hidden;
          background: #080D18;
          min-height: 420px;
          height: clamp(420px, 48vh, 520px);
        }
        .hero-slides-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .hero-slide-layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .hero-slide-layer.active {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          z-index: 2;
        }

        /* Full Bleed Background */
        .hero-slide-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
        }
        .hero-slide-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: right center;
          transform: scale(1.06);
          transition: transform 3.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-slide-layer.active .hero-slide-bg-img {
          transform: scale(1);
        }
        .hero-slide-gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(8, 13, 24, 0.97) 0%,
            rgba(8, 13, 24, 0.90) 42%,
            rgba(8, 13, 24, 0.45) 75%,
            rgba(8, 13, 24, 0.65) 100%
          );
        }
        @media (max-width: 768px) {
          .hero-slide-bg-img {
            object-position: center;
          }
          .hero-slide-gradient-overlay {
            background: linear-gradient(
              180deg,
              rgba(8, 13, 24, 0.78) 0%,
              rgba(8, 13, 24, 0.95) 85%
            );
          }
        }

        /* Content & Staggered Motion */
        .hero-slide-container {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          align-items: center;
        }
        .hero-slide-content {
          max-width: 620px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transform: translateY(14px);
          opacity: 0;
          transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, opacity 0.45s ease 0.08s;
        }
        .hero-slide-layer.active .hero-slide-content {
          transform: translateY(0);
          opacity: 1;
        }

        .slide-tag-wrap {
          margin-bottom: 0.65rem;
        }
        .slide-tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 0.22rem 0.6rem;
          border-radius: var(--radius-xs);
          border: 1.5px solid currentColor;
          background: rgba(0, 0, 0, 0.45);
        }
        .slide-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(1.8rem, 4vw, 2.85rem);
          line-height: 1.12;
          color: #FFFFFF;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }
        .slide-subtitle {
          font-size: clamp(0.85rem, 1.4vw, 0.95rem);
          line-height: 1.5;
          color: #CBD5E1;
          margin-bottom: 1.25rem;
          max-width: 540px;
        }

        .slide-promo-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .promo-pill {
          display: inline-flex;
          align-items: baseline;
          gap: 0.35rem;
          border-radius: var(--radius-full);
          padding: 0.45rem 1rem;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 0.95rem;
          line-height: 1;
          letter-spacing: 0.01em;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
        }
        .promo-pill small {
          font-size: 0.65rem;
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
          .promo-pill { font-size: 1.15rem; padding: 0.55rem 1.2rem; }
          .promo-pill small { font-size: 0.72rem; }
        }

        .slide-cta-row {
          display: flex;
          gap: 1rem;
        }
        .slide-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: var(--color-accent);
          color: #FFFFFF;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.05rem;
          padding: 0.85rem 2rem;
          border-radius: var(--radius-full);
          text-decoration: none;
          box-shadow: 0 8px 24px -4px rgba(240, 16, 58, 0.6);
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .slide-cta-btn:hover {
          background: var(--color-accent-hover);
          color: #FFFFFF;
          transform: translateY(-2px);
        }
        @media (min-width: 768px) {
          .slide-cta-btn { font-size: 1.25rem; padding: 0.95rem 2.5rem; }
        }

        /* Arrows */
        .slider-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .slider-arrow-btn:hover {
          background: #FFFFFF;
          color: #0F172A;
          transform: translateY(-50%) scale(1.06);
        }
        .arrow-prev { left: 1rem; }
        .arrow-next { right: 1rem; }
        @media (max-width: 640px) {
          .slider-arrow-btn { display: none; }
        }

        /* Modern Progress Dots */
        .slider-dots-wrap {
          position: absolute;
          bottom: 1.15rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          z-index: 10;
        }
        .slider-dot {
          position: relative;
          width: 24px;
          height: 5px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.25);
          border: none;
          padding: 0;
          cursor: pointer;
          overflow: hidden;
          transition: width 0.3s ease, background 0.3s ease;
        }
        .slider-dot.active {
          width: 42px;
          background: rgba(255, 255, 255, 0.35);
        }
        .dot-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 100%;
          background: var(--color-accent);
          transform-origin: left;
          animation: dotFill linear forwards;
        }
        @keyframes dotFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};
