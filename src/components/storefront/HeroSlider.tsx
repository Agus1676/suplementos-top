import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck } from 'lucide-react';

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
      title: 'SUPLEMENTACIÓN DE ÉLITE PARA DEPORTISTAS',
      subtitle: 'Proteínas Isolate CFM, Creatinas Creapure® y Pre-Entrenos con despacho express a todo el país o retiro sin cargo en Recoleta.',
      badge: '3 Y 6 CUOTAS SIN INTERÉS CON TODAS LAS TARJETAS',
      ctaText: 'VER CATÁLOGO COMPLETO',
      ctaLink: '/catalogo',
      bgGradient: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      tag: 'MATERIAS PRIMAS IMPORTADAS',
      tagColor: '#16A34A',
      title: 'CREAPURE® & WHEY ISOLATE 100% PURA',
      subtitle: 'Fórmulas oficiales con certificación internacional de pureza. Máxima recuperación, hipertrofia y rendimiento atlético.',
      badge: 'COMBOS CON HASTA 20% OFF Y ENVÍO GRATIS',
      ctaText: 'VER PROTEÍNAS & CREATINAS',
      ctaLink: '/catalogo?categoria=proteinas',
      bgGradient: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
      imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 3,
      tag: 'RETIRO EN EL DÍA EN CABA',
      tagColor: '#F59E0B',
      title: 'LOCAL & DESPACHO EN RECOLETA',
      subtitle: 'Uriburu 1163 (entre Santa Fe y Arenales). Lunes a Viernes de 8:00 a 23:00 hs y Sábados de 10:00 a 18:00 hs.',
      badge: 'COMPRÁ ONLINE Y RETIRÁ EN EL ACTO SIN COSTO',
      ctaText: 'CÓMO RETIRAR MI PEDIDO',
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

            <div className="slide-badge-wrap">
              <ShieldCheck size={16} className="text-success" />
              <span>{slide.badge}</span>
            </div>

            <div className="slide-cta-row">
              <Link to={slide.ctaLink} className="btn btn-accent btn-lg slide-cta-btn">
                <span>{slide.ctaText}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/catalogo?categoria=combos" className="btn btn-secondary btn-lg slide-secondary-btn">
                <span>COMBOS 15% OFF</span>
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
          min-height: 480px;
          display: flex;
          align-items: center;
          transition: background 0.4s ease;
          position: relative;
        }
        @media (min-width: 768px) {
          .hero-slide-item {
            min-height: 520px;
          }
        }
        .hero-slide-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          padding-top: 3.5rem;
          padding-bottom: 3.5rem;
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
        .slide-badge-wrap {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(22, 163, 74, 0.15);
          border: 1px solid rgba(22, 163, 74, 0.35);
          color: #86EFAC;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.4rem 0.85rem;
          border-radius: var(--radius-sm);
          margin-bottom: 2rem;
        }
        .slide-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .slide-cta-btn {
          background-color: var(--color-accent);
          border-color: var(--color-accent);
          color: #FFFFFF;
          font-weight: 800;
        }
        .slide-cta-btn:hover {
          background-color: var(--color-accent-hover);
        }
        .slide-secondary-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.25);
          font-weight: 700;
        }
        .slide-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
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
