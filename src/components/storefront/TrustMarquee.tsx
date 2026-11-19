import React from 'react';
import { CreditCard, Truck, MapPin, MessageCircle, Percent, ShieldCheck } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: CreditCard, title: '3 y 6 cuotas sin interés', desc: 'Con todas las tarjetas' },
  { icon: Truck, title: 'Envíos a todo el país', desc: 'Gratis desde $85.000' },
  { icon: MapPin, title: 'Retiro sin cargo en Recoleta', desc: 'Uriburu 1163' },
  { icon: MessageCircle, title: 'Asesoramiento por WhatsApp', desc: '11 6565 1990' },
  { icon: Percent, title: '10% OFF', desc: 'Por transferencia o efectivo' },
  { icon: ShieldCheck, title: 'Productos 100% originales', desc: 'Distribuidores oficiales' },
];

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
          background: #F8FAFC;
          color: #18181B;
          overflow: hidden;
          border-bottom: 1px solid #E4E4E7;
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
          padding: 0.65rem 0 0.65rem 1.75rem;
          white-space: nowrap;
          font-size: 0.78rem;
        }
        .tm-item strong {
          font-weight: 700;
          color: #18181B;
        }
        .tm-icon {
          color: #5B8C2A;
          flex-shrink: 0;
        }
        .tm-desc {
          color: #52525B;
          font-weight: 400;
        }
        .tm-sep {
          color: #CBD5E1;
          margin-left: 1.25rem;
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
