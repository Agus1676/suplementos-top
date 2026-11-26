import React from 'react';
import { Instagram, ExternalLink, Play, Eye, Flame, Users } from 'lucide-react';
import { HorizontalScroller } from '../ui/HorizontalScroller';

interface ReelItem {
  id: string;
  title: string;
  tag: string;
  views: string;
  imageUrl: string;
  instagramUrl: string;
}

const REELS_DATA: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Retiros en el día en Gimnasio Top Shape • Sede Recoleta',
    tag: 'LOCAL OFICIAL',
    views: '42.8K',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
    instagramUrl: 'https://www.instagram.com/suplementos_topp',
  },
  {
    id: 'reel-2',
    title: 'Nuevo ingreso de Creatinas & Proteínas Star Nutrition',
    tag: 'UNBOXING STOCK',
    views: '68.4K',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
    instagramUrl: 'https://www.instagram.com/suplementos_topp',
  },
  {
    id: 'reel-3',
    title: 'Primera competencia de fuerza & atletas en CABA',
    tag: 'COMUNIDAD',
    views: '95.2K',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=700&q=80',
    instagramUrl: 'https://www.instagram.com/suplementos_topp',
  },
  {
    id: 'reel-4',
    title: 'Despachando más de 100 pedidos diarios a todo el país',
    tag: 'LOGÍSTICA EXPRESS',
    views: '54.1K',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=700&q=80',
    instagramUrl: 'https://www.instagram.com/suplementos_topp',
  },
];

export const InstagramFeed: React.FC = () => {
  return (
    <section className="ig-feed-section" aria-label="Nuestras publicaciones en Instagram">
      <div className="container">
        {/* Section Header with Instagram link */}
        <div className="ig-header-row">
          <div className="ig-header-copy">
            <h2 className="ig-title">Nuestras últimas publicaciones en Instagram</h2>
            <p className="ig-subtitle">Novedades, asesoramiento y detrás de escena de la empresa.</p>
          </div>
          <a
            href="https://www.instagram.com/suplementos_topp"
            target="_blank"
            rel="noopener noreferrer"
            className="ig-follow-btn"
          >
            <Instagram size={17} />
            <span>Seguinos</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Athletic Community Stats Strip (Estilo ProteViking) */}
        <div className="ig-stats-banner">
          <div className="ig-stats-grid">
            <div className="ig-stat-col">
              <div className="ig-stat-icon">
                <Users size={20} />
              </div>
              <div className="ig-stat-info">
                <span className="ig-stat-num">+110 mil</span>
                <span className="ig-stat-label">seguidores en redes</span>
              </div>
            </div>

            <div className="ig-stat-divider" />

            <div className="ig-stat-col">
              <div className="ig-stat-icon">
                <Eye size={20} />
              </div>
              <div className="ig-stat-info">
                <span className="ig-stat-num">+15 M</span>
                <span className="ig-stat-label">vistas por mes</span>
              </div>
            </div>

            <div className="ig-stat-divider" />

            <div className="ig-stat-col">
              <div className="ig-stat-icon">
                <Flame size={20} />
              </div>
              <div className="ig-stat-info">
                <span className="ig-stat-num">Virales</span>
                <span className="ig-stat-label">en Instagram</span>
              </div>
            </div>
          </div>

          <div className="ig-stats-bottom-bar">
            <span>✦ Nos mostramos todos los días · Sumate a la comunidad oficial de Suplementos Top</span>
          </div>
        </div>

        {/* Reels Showcase Scroller */}
        <div className="ig-reels-wrap">
          <HorizontalScroller
            ariaLabel="Reels de Instagram"
            perView={{ mobile: 1.5, tablet: 3, desktop: 4 }}
            gapRem={1}
            mobilePeek={0.2}
          >
            {REELS_DATA.map((reel) => (
              <a
                key={reel.id}
                href={reel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-reel-card"
                aria-label={`Ver reel: ${reel.title}`}
              >
                <div className="ig-reel-media">
                  <img
                    src={reel.imageUrl}
                    alt={reel.title}
                    className="ig-reel-img"
                    loading="lazy"
                  />
                  <div className="ig-reel-overlay" />
                  
                  {/* Top Tag & Views */}
                  <div className="ig-reel-top">
                    <span className="ig-reel-tag">{reel.tag}</span>
                    <span className="ig-reel-views">
                      <Eye size={12} /> {reel.views}
                    </span>
                  </div>

                  {/* Play Icon Center Button */}
                  <div className="ig-reel-play-btn" aria-hidden="true">
                    <Play size={20} fill="currentColor" />
                  </div>

                  {/* Bottom Content & CTA */}
                  <div className="ig-reel-bottom">
                    <h3 className="ig-reel-title">{reel.title}</h3>
                    <div className="ig-reel-cta">
                      <span className="ig-reel-cta-btn">
                        <Play size={13} fill="currentColor" />
                        <span>Ver reel en Instagram</span>
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </HorizontalScroller>
        </div>
      </div>

      <style>{`
        .ig-feed-section {
          padding: 2.75rem 0 3.25rem;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
        }

        .ig-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .ig-header-copy {
          max-width: 600px;
        }

        .ig-title {
          font-family: var(--font-display);
          font-size: clamp(1.25rem, 1.8vw, 1.75rem);
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin: 0 0 0.35rem 0;
          line-height: 1.2;
        }

        .ig-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        .ig-follow-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #FFFFFF;
          color: #0F172A;
          border: 1.5px solid #CBD5E1;
          border-radius: 999px;
          padding: 0.55rem 1.15rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .ig-follow-btn:hover {
          background: #F8FAFC;
          border-color: #0F172A;
          transform: translateY(-1px);
        }

        /* Athletic Stats Banner (Style ProteViking) */
        .ig-stats-banner {
          background: linear-gradient(135deg, #14532D 0%, #166534 60%, #15803D 100%);
          border-radius: 14px;
          color: #FFFFFF;
          overflow: hidden;
          margin-bottom: 1.75rem;
          box-shadow: 0 8px 24px -6px rgba(22, 101, 52, 0.35);
        }

        .ig-stats-grid {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 1.25rem 1rem;
          gap: 0.5rem;
        }

        @media (max-width: 640px) {
          .ig-stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            padding: 1rem 0.5rem;
            text-align: center;
          }
        }

        .ig-stat-col {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0 0.5rem;
        }

        @media (max-width: 640px) {
          .ig-stat-col {
            flex-direction: column;
            gap: 0.25rem;
            padding: 0;
          }
          .ig-stat-icon {
            display: none;
          }
        }

        .ig-stat-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .ig-stat-info {
          display: flex;
          flex-direction: column;
        }

        .ig-stat-num {
          font-family: var(--font-display);
          font-size: clamp(1.15rem, 2vw, 1.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .ig-stat-label {
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
          text-transform: lowercase;
        }

        .ig-stat-divider {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 640px) {
          .ig-stat-divider {
            display: none;
          }
        }

        .ig-stats-bottom-bar {
          background: rgba(0, 0, 0, 0.2);
          padding: 0.45rem 1rem;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #DCFCE7;
        }

        /* Reels Cards Carousel */
        .ig-reels-wrap {
          margin-top: 0.5rem;
        }

        .ig-reel-card {
          text-decoration: none;
          color: inherit;
          display: block;
          border-radius: 14px;
          overflow: hidden;
          background: #0F172A;
          box-shadow: 0 8px 20px -6px rgba(15, 23, 42, 0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .ig-reel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px -8px rgba(15, 23, 42, 0.28);
        }

        .ig-reel-media {
          position: relative;
          aspect-ratio: 9 / 15;
          width: 100%;
          overflow: hidden;
          background: #0B0E14;
        }

        .ig-reel-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.4s ease;
        }

        .ig-reel-card:hover .ig-reel-img {
          transform: scale(1.05);
        }

        .ig-reel-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.45) 0%,
            rgba(0, 0, 0, 0.1) 40%,
            rgba(0, 0, 0, 0.85) 100%
          );
        }

        .ig-reel-top {
          position: absolute;
          top: 0.85rem;
          left: 0.85rem;
          right: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
        }

        .ig-reel-tag {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(6px);
          color: #FFFFFF;
          padding: 0.22rem 0.55rem;
          border-radius: 4px;
        }

        .ig-reel-views {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #FFFFFF;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          padding: 0.2rem 0.5rem;
          border-radius: 999px;
        }

        .ig-reel-play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 3px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          transition: transform 0.2s ease, background 0.2s ease;
          z-index: 2;
        }

        .ig-reel-card:hover .ig-reel-play-btn {
          transform: translate(-50%, -50%) scale(1.12);
          background: #FFFFFF;
        }

        .ig-reel-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem 0.9rem;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .ig-reel-title {
          font-family: var(--font-display);
          font-size: 0.88rem;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.3;
          margin: 0;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ig-reel-cta {
          display: flex;
          align-items: center;
        }

        .ig-reel-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(255, 255, 255, 0.95);
          color: #0F172A;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.35rem 0.7rem;
          border-radius: 999px;
          backdrop-filter: blur(4px);
          transition: background 0.15s ease;
        }

        .ig-reel-card:hover .ig-reel-cta-btn {
          background: #FFFFFF;
        }
      `}</style>
    </section>
  );
};
