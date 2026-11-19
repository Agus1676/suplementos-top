import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="footer-compact-root">
      <div className="container">
        {/* Main horizontal bar */}
        <div className="footer-compact-main">
          {/* Brand & Social */}
          <div className="footer-compact-brand">
            <div className="brand-lockup">
              <img src="/logo.jpg" alt="Logo Suplementos Top" className="footer-mini-logo" />
              <div>
                <span className="brand-text">SUPLEMENTOS <span className="text-red">TOP</span></span>
                <span className="brand-tagline">SPORT NUTRITION · CABA</span>
              </div>
            </div>
            <a 
              href={settings.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-ig-link"
              aria-label="Instagram"
            >
              <Instagram size={13} />
              <span>@suplementos_topp</span>
            </a>
          </div>

          {/* Quick Store Info */}
          <div className="footer-compact-info">
            <div className="info-item">
              <MapPin size={13} className="text-red flex-shrink-0" />
              <span>
                <strong>Retiro Recoleta:</strong> Uriburu 1163 (Lun a Vie 8-23h · Sáb 10-18h)
              </span>
            </div>
            <div className="info-item">
              <Phone size={13} className="text-red flex-shrink-0" />
              <span>
                <strong>WhatsApp:</strong>{' '}
                <a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer" className="text-white hover-underline">
                  11 6565 1990
                </a>
                {' · '}
                <Mail size={13} className="text-red inline-icon" />{' '}
                <a href={`mailto:${settings.supportEmail}`} className="text-muted hover-white">
                  {settings.supportEmail}
                </a>
              </span>
            </div>
          </div>

          {/* Inline Navigation Links */}
          <div className="footer-compact-links">
            <Link to="/catalogo">Catálogo</Link>
            <span className="sep">·</span>
            <Link to="/seguimiento">Rastrear Pedido</Link>
            <span className="sep">·</span>
            <Link to="/envios">Envíos</Link>
            <span className="sep">·</span>
            <Link to="/faq">Preguntas</Link>
            <span className="sep">·</span>
            <Link to="/contacto">Contacto</Link>
            <span className="sep">·</span>
            <Link to="/admin" className="admin-subtle-link">Admin</Link>
          </div>
        </div>

        {/* Micro Bottom Bar */}
        <div className="footer-compact-bottom">
          <div className="copyright-area">
            <span>© {new Date().getFullYear()} SUPLEMENTOS TOP. Todos los derechos reservados.</span>
            <span className="footer-author">
              Desarrollado por{' '}
              <a
                href="https://agustinpollan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-author-link"
              >
                Agustín Pollán
              </a>
            </span>
            <span className="data-fiscal-badge">
              <ShieldCheck size={12} className="text-success" />
              <span>AFIP F960/D Verificado</span>
            </span>
          </div>

          <div className="payment-area">
            <span className="mp-tag">Mercado Pago</span>
            <div className="pay-icons">
              <span className="pay-badge">VISA</span>
              <span className="pay-badge">MASTERCARD</span>
              <span className="pay-badge">CABAL</span>
              <span className="pay-badge">PAGO FÁCIL</span>
              <span className="pay-badge">RAPIPAGO</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-compact-root {
          background-color: #0B0F17;
          color: #94A3B8;
          border-top: 1px solid #1E293B;
          margin-top: 2rem;
          padding: 1.25rem 0 0.85rem;
          font-size: 0.78rem;
        }
        .footer-compact-main {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        @media (min-width: 900px) {
          .footer-compact-main {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 1.5rem;
          }
        }
        .footer-compact-brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }
        .brand-lockup {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .footer-mini-logo {
          width: 28px;
          height: 28px;
          border-radius: 4px;
          border: 1px solid #334155;
          object-fit: cover;
          background: #000;
        }
        .brand-text {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 0.95rem;
          color: #FFFFFF;
          display: block;
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .text-red {
          color: #E11D48;
        }
        .brand-tagline {
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #64748B;
          display: block;
          margin-top: 0.15rem;
        }
        .footer-ig-link {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #1E293B;
          border: 1px solid #334155;
          color: #F8FAFC;
          padding: 0.25rem 0.55rem;
          border-radius: 3px;
          font-size: 0.72rem;
          font-weight: 600;
          transition: background 0.15s ease;
        }
        .footer-ig-link:hover {
          background: #334155;
          color: #FFFFFF;
        }
        .footer-compact-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.74rem;
          color: #94A3B8;
        }
        .info-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          line-height: 1.3;
        }
        .inline-icon {
          vertical-align: middle;
          margin: 0 0.15rem;
        }
        .hover-underline:hover {
          text-decoration: underline;
        }
        .hover-white:hover {
          color: #FFFFFF;
        }
        .footer-compact-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.74rem;
        }
        .footer-compact-links a {
          color: #94A3B8;
          transition: color 0.15s;
        }
        .footer-compact-links a:hover {
          color: #FFFFFF;
        }
        .sep {
          color: #334155;
        }
        .admin-subtle-link {
          color: #64748B !important;
        }
        .admin-subtle-link:hover {
          color: #94A3B8 !important;
        }
        .footer-compact-bottom {
          padding-top: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          justify-content: space-between;
          font-size: 0.68rem;
          color: #64748B;
        }
        @media (min-width: 768px) {
          .footer-compact-bottom {
            flex-direction: row;
          }
        }
        .copyright-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .data-fiscal-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 0.15rem 0.45rem;
          border-radius: 2px;
          color: #94A3B8;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .footer-author {
          color: #94A3B8;
        }
        .footer-author-link {
          color: var(--color-accent);
          font-weight: 700;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .footer-author-link:hover {
          color: #FFFFFF;
          text-decoration: underline;
        }
        .payment-area {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .mp-tag {
          font-size: 0.65rem;
          font-weight: 700;
          color: #94A3B8;
        }
        .pay-icons {
          display: flex;
          gap: 0.25rem;
        }
        .pay-badge {
          background: #161F30;
          border: 1px solid #233148;
          color: #94A3B8;
          font-size: 0.58rem;
          font-weight: 800;
          padding: 0.1rem 0.35rem;
          border-radius: 2px;
          letter-spacing: 0.03em;
        }
      `}</style>
    </footer>
  );
};
