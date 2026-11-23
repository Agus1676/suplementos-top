import React from 'react';
import { CreditCard, Truck, MapPin, MessageCircle, Percent, ShieldCheck } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: CreditCard, title: '3 Y 6 CUOTAS SIN INTERÉS', desc: 'CON TODAS LAS TARJETAS' },
  { icon: Truck, title: 'ENVÍOS A TODO EL PAÍS', desc: 'ENTREGA RÁPIDA Y SEGURA' },
  { icon: MapPin, title: 'RETIRO SIN CARGO EN RECOLETA', desc: 'GIMNASIO TOP SHAPE' },
  { icon: MessageCircle, title: 'ASESORAMIENTO DIRECTO', desc: 'CONSULTAS POR WHATSAPP' },
  { icon: Percent, title: '10% OFF', desc: 'POR TRANSFERENCIA O EFECTIVO' },
  { icon: ShieldCheck, title: 'PRODUCTOS 100% ORIGINALES', desc: 'DISTRIBUIDORES OFICIALES' },
];

export const TrustMarquee: React.FC = () => {
  const renderGroup = (ariaHidden: boolean) => (
    <ul className="tm-group" aria-hidden={ariaHidden}>
      {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
        <li key={title} className="tm-item">
          <Icon size={15} className="tm-icon" />
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
          animation: tm-scroll 24s linear infinite;
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
          gap: 0.4rem;
          padding: 0.55rem 0 0.55rem 0.85rem;
          white-space: nowrap;
          font-size: 0.73rem;
          text-transform: uppercase;
          letter-spacing: 0.035em;
        }
        .tm-item strong {
          font-weight: 800;
          color: #18181B;
        }
        .tm-icon {
          color: #5B8C2A;
          flex-shrink: 0;
        }
        .tm-desc {
          color: #52525B;
          font-weight: 600;
        }
        .tm-sep {
          color: #CBD5E1;
          margin-left: 0.85rem;
        }
        @keyframes tm-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tm-track { animation-duration: 90s; }
        }
      `}</style>
    </section>
  );
};
