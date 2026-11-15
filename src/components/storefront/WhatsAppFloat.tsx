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
            <X size={11} />
          </button>
          <p className="wa-tooltip-title">¿Dudas con tu pedido?</p>
          <p className="wa-tooltip-text">Asesoramiento directo al 11 6565 1990</p>
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
        <MessageCircle size={24} />
      </a>

      <style>{`
        .whatsapp-float-root {
          position: fixed;
          bottom: 1.25rem;
          right: 1.25rem;
          z-index: 999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.4rem;
        }
        .wa-tooltip-bubble {
          position: relative;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.5rem 1.6rem 0.5rem 0.75rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          max-width: 190px;
          animation: popIn 0.3s ease;
        }
        @keyframes popIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wa-tooltip-close {
          position: absolute;
          top: 0.35rem;
          right: 0.35rem;
          color: var(--color-text-subtle);
          padding: 0.1rem;
          background: none;
          border: none;
          cursor: pointer;
        }
        .wa-tooltip-close:hover {
          color: var(--color-text-main);
        }
        .wa-tooltip-title {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin-bottom: 0.1rem;
        }
        .wa-tooltip-text {
          font-size: 0.68rem;
          color: var(--color-text-muted);
          line-height: 1.3;
        }
        .wa-float-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #25D366;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
          transition: all 0.2s ease;
        }
        .wa-float-btn:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5);
        }
      `}</style>
    </div>
  );
};
