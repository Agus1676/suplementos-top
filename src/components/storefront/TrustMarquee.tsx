import React from 'react';
import { CreditCard, Truck, MapPin, MessageCircle, Percent, ShieldCheck } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: CreditCard, title: '3 Y 6 CUOTAS SIN INTERÉS', desc: 'Con todas las tarjetas' },
  { icon: Truck, title: 'ENVÍOS A TODO EL PAÍS', desc: 'Gratis desde $85.000' },
  { icon: MapPin, title: 'RETIRO GRATIS EN RECOLETA', desc: 'Uriburu 1163' },
  { icon: MessageCircle, title: 'ASESORAMIENTO POR WHATSAPP', desc: '11 6565 1990' },
  { icon: Percent, title: '10% OFF', desc: 'Transferencia o efectivo' },
  { icon: ShieldCheck, title: 'PRODUCTOS 100% ORIGINALES', desc: 'Distribuidores oficiales' },
];

/**
 * Compact, infinite left-scrolling trust strip.
 * Pure CSS animation (GPU transform) — no JS timers, no layout thrash.
 * The list is rendered twice so the loop is seamless at -50%.
 */
export const TrustMarquee: React.FC = () => {
  const renderGroup = (ariaHidden: boolean) => (
    <ul className="tm-group" aria-hidden={ariaHidden}>
      {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="tm-item">
          <Icon size={16} className="tm-icon" />
          <strong>{title}</strong>
          <span className="tm-desc">{desc}</span>
          <span className="tm-sep" aria-hidden="true">•</span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="tm-root" aria-label="Beneficios de compra">
      <div className="tm-track">
        {renderGroup(false)}
        {renderGroup(true)}
      </div>

      <style>{`
        .tm-root {
          background: #0F172A;
          color: #FFFFFF;
          overflow: hidden;
          border-bottom: 3px solid var(--color-accent);
        }
        .tm-track {
          display: flex;
          width: max-content;
          animation: tm-scroll 38s linear infinite;
        }
        .tm-root:hover .tm-track {
          animation-play-state: paused;
        }
        .tm-group {
          display: flex;
          flex-shrink: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .tm-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.6rem 0 0.6rem 1.75rem;
          white-space: nowrap;
          font-size: 0.74rem;
          letter-spacing: 0.03em;
        }
        .tm-item strong {
          font-weight: 800;
        }
        .tm-icon {
          color: var(--color-promo-green);
          flex-shrink: 0;
        }
        .tm-desc {
          color: #94A3B8;
          font-weight: 500;
        }
        .tm-sep {
          color: var(--color-accent);
          margin-left: 1.25rem;
          font-weight: 900;
        }
        @keyframes tm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tm-track { animation-duration: 120s; }
        }
      `}</style>
    </section>
  );
};
