import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  const [tooltipDismissed, setTooltipDismissed] = useState(false);

  return (
    <div className="whatsapp-float-root">
      {/* Tooltip bubble */}
      {!tooltipDismissed && (
        <div className="wa-tooltip-bubble">
          <button 
            onClick={() => setTooltipDismissed(true)} 
            className="wa-tooltip-close" 
            aria-label="Cerrar mensaje"
          >
            <X size={12} />
          </button>
          <p className="wa-tooltip-title">¿Dudas con tu compra?</p>
          <p className="wa-tooltip-text">Atención y asesoramiento en el acto por WhatsApp</p>
        </div>
      )}

      {/* Main floating button */}
      <a
        href="https://wa.me/5491165651990?text=Hola!%20Tengo%20una%20consulta%20sobre%20los%20suplementos%20de%20la%20tienda"
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float-btn"
        aria-label="Chat de WhatsApp con Suplementos Top"
      >
        <MessageCircle size={28} />
      </a>

      <style>{`
        .whatsapp-float-root {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }
        .wa-tooltip-bubble {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.65rem 1.8rem 0.65rem 0.85rem;
          box-shadow: var(--shadow-lg);
          max-width: 220px;
          animation: popIn 0.3s ease;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wa-tooltip-close {
          position: absolute;
          top: 0.4rem;
          right: 0.4rem;
          color: var(--color-text-subtle);
          padding: 0.15rem;
        }
        .wa-tooltip-close:hover {
          color: var(--color-text-main);
        }
        .wa-tooltip-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 0.1rem;
        }
        .wa-tooltip-text {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          line-height: 1.35;
        }
        .wa-float-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #25D366;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37, 211, 102, 0.45);
          transition: all 0.2s ease;
        }
        .wa-float-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.6);
        }
      `}</style>
    </div>
  );
};
