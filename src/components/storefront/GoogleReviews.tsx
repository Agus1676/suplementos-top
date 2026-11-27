import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

interface ReviewItem {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatarBg: string;
  verified: boolean;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Facundo Benítez',
    date: 'Hace 3 días',
    rating: 5,
    comment: 'Compré la proteína Star Nutrition y una creatina Creapure. Llegó en el día a Palermo en perfectas condiciones y con precinto de fábrica. Excelente atención por WhatsApp.',
    avatarBg: '#3B82F6',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Micaela Rossi',
    date: 'Hace 1 semana',
    rating: 5,
    comment: 'Paso siempre a retirar por el gimnasio Top Shape en Recoleta. Súper cómodo, te atienden de 10 y los precios con el 10% de transferencia no tienen competencia.',
    avatarBg: '#10B981',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Lucas Giannini',
    date: 'Hace 2 semanas',
    rating: 5,
    comment: '100% recomendables. Pedí para enviar a Rosario por Correo y en 48hs ya tenía el número de tracking y la caja en mi casa. Productos 100% originales.',
    avatarBg: '#8B5CF6',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Gonzalo Morales',
    date: 'Hace 3 semanas',
    rating: 5,
    comment: 'El combo de Whey Protein + Creatina ENA rinde muchísimo. Me asesoraron al toque por WhatsApp sobre cómo tomarlo. Volveré a comprar seguro.',
    avatarBg: '#F59E0B',
    verified: true,
  },
  {
    id: 'rev-5',
    name: 'Camila Delgado',
    date: 'Hace 1 mes',
    rating: 5,
    comment: 'Excelente local. Muy buena onda los chicos en el mostrador del gimnasio en Uriburu 1163. Todo sellado y con fecha de vencimiento bien lejana.',
    avatarBg: '#EC4899',
    verified: true,
  },
  {
    id: 'rev-6',
    name: 'Joaquín Navarro',
    date: 'Hace 1 mes',
    rating: 5,
    comment: 'El mejor precio de CABA en Optimum Nutrition Gold Standard. Pagás por transferencia con descuento al instante y retirás en el día. Un golazo.',
    avatarBg: '#06B6D4',
    verified: true,
  },
];

export const GoogleReviews: React.FC = () => {
  // Duplicamos la lista para crear el efecto infinito de marquee continuo
  const marqueeReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="google-reviews-section" aria-label="Opiniones de clientes en Google">
      <div className="container">
        {/* Header con puntuación Google */}
        <div className="google-reviews-header">
          <div className="google-badge-box">
            <div className="google-g-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <div>
              <div className="google-score-row">
                <span className="google-score-num">4.9</span>
                <div className="google-stars-row">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="#FBBC05" color="#FBBC05" />
                  ))}
                </div>
              </div>
              <span className="google-score-text">Opiniones reales en Google Maps • Sede Recoleta</span>
            </div>
          </div>

          <div className="google-header-copy">
            <h2 className="google-title">Lo que dicen nuestros clientes</h2>
            <p className="google-subtitle">Más de 500 atletas y clientes nos eligen mes a mes en todo el país.</p>
          </div>
        </div>
      </div>

      {/* Track Infinito con movimiento continuo */}
      <div className="google-marquee-viewport">
        <div className="google-marquee-track">
          {marqueeReviews.map((rev, index) => (
            <div key={`${rev.id}-${index}`} className="review-card">
              <div className="review-card-head">
                <div className="review-avatar" style={{ backgroundColor: rev.avatarBg }}>
                  {rev.name.charAt(0)}
                </div>
                <div className="review-author-meta">
                  <span className="review-author-name">{rev.name}</span>
                  <div className="review-verified-row">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    <span>Compra verificada</span>
                    <span className="review-dot">·</span>
                    <span>{rev.date}</span>
                  </div>
                </div>
              </div>

              <div className="review-stars-row">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="#FBBC05" color="#FBBC05" />
                ))}
              </div>

              <p className="review-comment">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .google-reviews-section {
          padding: 2.75rem 0 2rem;
          background: #FAFAFA;
          border-top: 1px solid #E5E7EB;
          border-bottom: 1px solid #E5E7EB;
          overflow: hidden;
        }

        .google-reviews-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
        }

        .google-badge-box {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          padding: 0.65rem 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
        }

        .google-g-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8FAFC;
          padding: 6px;
          border-radius: 8px;
        }

        .google-score-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .google-score-num {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 900;
          color: #0F172A;
          line-height: 1;
        }

        .google-stars-row {
          display: flex;
          gap: 2px;
        }

        .google-score-text {
          font-size: 0.72rem;
          color: #64748B;
          font-weight: 500;
        }

        .google-header-copy {
          text-align: right;
        }

        @media (max-width: 640px) {
          .google-header-copy {
            text-align: left;
            width: 100%;
          }
        }

        .google-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .google-subtitle {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0.2rem 0 0;
        }

        /* Continuous Marquee Animation */
        .google-marquee-viewport {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 0.5rem 0 1rem;
        }

        .google-marquee-viewport::before,
        .google-marquee-viewport::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
        }

        .google-marquee-viewport::before {
          left: 0;
          background: linear-gradient(90deg, #FAFAFA 0%, rgba(250, 250, 250, 0) 100%);
        }

        .google-marquee-viewport::after {
          right: 0;
          background: linear-gradient(-90deg, #FAFAFA 0%, rgba(250, 250, 250, 0) 100%);
        }

        .google-marquee-track {
          display: flex;
          gap: 1.25rem;
          width: max-content;
          animation: marqueeScroll 45s linear infinite;
        }

        .google-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Review Card with Clean Depth */
        .review-card {
          width: 320px;
          flex-shrink: 0;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 1.25rem;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -4px rgba(15, 23, 42, 0.08);
          border-color: #CBD5E1;
        }

        .review-card-head {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .review-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .review-author-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .review-author-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #0F172A;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .review-verified-row {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          color: #64748B;
        }

        .review-dot {
          color: #CBD5E1;
        }

        .review-stars-row {
          display: flex;
          gap: 2px;
        }

        .review-comment {
          font-size: 0.83rem;
          line-height: 1.45;
          color: #334155;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};
