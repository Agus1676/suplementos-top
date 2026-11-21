import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-grid">
          <Link
            to="/"
            className="ft-brand"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/logo.png" alt={settings.storeName} className="ft-logo" />
            <div>
              <div className="ft-name">SUPLEMENTOS TOP</div>
              <p className="ft-about">
                Suplementación deportiva original en Recoleta, Ciudad Autónoma de Buenos Aires.
              </p>
            </div>
          </Link>

          <div className="ft-col">
            <h4>Tienda</h4>
            <Link to="/catalogo">Catálogo completo</Link>
            <Link to="/catalogo?categoria=proteinas">Proteínas</Link>
            <Link to="/catalogo?categoria=creatinas">Creatinas</Link>
            <Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenos</Link>
            <Link to="/catalogo?categoria=combos">Combos y ofertas</Link>
            <Link to="/faq">Preguntas frecuentes</Link>
          </div>

          <div className="ft-col">
            <h4>Contacto</h4>
            <a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer">
              WhatsApp 11 6565 1990
            </a>
            <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a>
            <a href={settings.instagram} target="_blank" rel="noopener noreferrer">
              @suplementos_topp
            </a>
            <Link to="/seguimiento">Seguimiento de pedido</Link>
            <Link to="/contacto">Ubicación y horarios</Link>
          </div>

          <div className="ft-col">
            <h4>Retiro y envíos</h4>
            <span>Pres. José E. Uriburu 1163 (Gimnasio Top Shape) — sin cargo</span>
            <span>Lun a Vie 8 a 23 hs / Sáb 10 a 18 hs</span>
            <span>Envíos a todo el país</span>
            <span>Transferencia (10% OFF) y Mercado Pago</span>
          </div>
        </div>

        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados.</span>
          <span>
            Desarrollado por{' '}
            <a href="https://agustinpollan.vercel.app/" target="_blank" rel="noopener noreferrer">
              Agustín Pollán
            </a>
          </span>
          <Link to="/admin" className="ft-admin">
            Admin
          </Link>
        </div>
      </div>

      <style>{`
        .ft {
          background: #F8FAFC;
          color: #52525B;
          border-top: 1px solid #E4E4E7;
          margin-top: 3rem;
          width: 100%;
          font-size: 0.82rem;
        }
        .ft-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 20px 16px;
          box-sizing: border-box;
        }
        .ft-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.1fr;
          gap: 28px;
          padding-bottom: 22px;
        }
        .ft-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
          cursor: pointer;
        }
        .ft-logo {
          height: 58px;
          width: auto;
          object-fit: contain;
          display: block;
          flex-shrink: 0;
        }
        .ft-name {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: #18181B;
          letter-spacing: 0.04em;
          line-height: 1.15;
          margin-bottom: 5px;
        }
        .ft-about {
          margin: 0;
          max-width: 240px;
          line-height: 1.45;
          color: #71717A;
          font-size: 0.8rem;
        }
        .ft-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-start;
        }
        .ft-col h4 {
          margin: 0 0 4px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #18181B;
        }
        .ft-col a,
        .ft-col span {
          color: #52525B;
          text-decoration: none;
          line-height: 1.4;
          transition: color 0.15s ease;
        }
        .ft-col a:hover {
          color: #18181B;
        }
        .ft-bottom {
          border-top: 1px solid #E4E4E7;
          padding-top: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px 16px;
          flex-wrap: wrap;
          font-size: 0.75rem;
          color: #71717A;
        }
        .ft-bottom a {
          color: #18181B;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .ft-bottom a:hover {
          text-decoration: underline;
        }
        .ft-admin {
          color: #A1A1AA !important;
          font-weight: 400 !important;
        }
        .ft-admin:hover {
          color: #52525B !important;
        }
        @media (max-width: 860px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .ft-brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .ft-inner {
            padding: 24px 16px 14px;
          }
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px 14px;
            padding-bottom: 16px;
          }
          .ft-bottom {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};
