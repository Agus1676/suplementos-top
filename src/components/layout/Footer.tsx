import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Mail, PackageCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main 4-column clean layout */}
        <div className="footer-grid">
          {/* Col 1: Brand & Social */}
          <div className="footer-col footer-col--brand">
            <Link
              to="/"
              className="footer-brand"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="/logo.png" alt={settings.storeName} className="footer-logo" />
              <div className="footer-brand-text">
                <span className="footer-brand-title">SUPLEMENTOS TOP</span>
                <span className="footer-brand-sub">Gimnasio Top Shape • Recoleta</span>
              </div>
            </Link>
            <p className="footer-desc">
              Punto oficial en Recoleta, CABA. Suplementos 100% originales con precinto de seguridad, retiro en el día sin cargo y envíos a todo el país.
            </p>
            <div className="footer-social-row">
              <a
                href={settings.instagram || 'https://www.instagram.com/suplementos_topp'}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram de Suplementos Top"
              >
                <Instagram size={18} />
                <span>@suplementos_topp</span>
              </a>
              <a
                href="https://wa.me/5491165652990"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp oficial"
              >
                <MessageCircle size={18} />
                <span>11 6565-2990</span>
              </a>
            </div>
          </div>

          {/* Col 2: Tienda */}
          <div className="footer-col">
            <h4 className="footer-heading">Categorías</h4>
            <ul className="footer-links">
              <li><Link to="/catalogo?categoria=proteinas">Proteínas Whey &amp; Isolate</Link></li>
              <li><Link to="/catalogo?categoria=creatinas">Creatinas Micronizadas</Link></li>
              <li><Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenos &amp; Óxido</Link></li>
              <li><Link to="/catalogo?categoria=combos">Combos &amp; Packs Ahorro</Link></li>
              <li><Link to="/catalogo?categoria=aminoacidos">Aminoácidos &amp; BCAA</Link></li>
              <li><Link to="/catalogo?categoria=salud-vitaminas">Vitaminas &amp; Magnesio</Link></li>
              <li><Link to="/catalogo" className="footer-link-highlight">Ver todo el catálogo →</Link></li>
            </ul>
          </div>

          {/* Col 3: Ayuda & Envíos */}
          <div className="footer-col">
            <h4 className="footer-heading">Información</h4>
            <ul className="footer-links">
              <li>
                <Link to="/seguimiento" className="footer-link-flex">
                  <PackageCheck size={14} />
                  <span>Seguimiento de pedido</span>
                </Link>
              </li>
              <li><Link to="/envios">Política de envíos y entregas</Link></li>
              <li><Link to="/terminos">Términos y condiciones</Link></li>
              <li><Link to="/responsabilidad">Aviso legal y suplementos</Link></li>
              <li><Link to="/faq">Preguntas frecuentes</Link></li>
              <li><Link to="/contacto">Ubicación y cómo llegar</Link></li>
            </ul>
          </div>

          {/* Col 4: Local & Horarios */}
          <div className="footer-col">
            <h4 className="footer-heading">Sede Recoleta</h4>
            <div className="footer-info-block">
              <div className="footer-info-item">
                <MapPin size={15} className="footer-info-icon" />
                <div>
                  <strong>Pres. José E. Uriburu 1163</strong>
                  <span>Gimnasio Top Shape (entre Av. Santa Fe y Arenales)</span>
                </div>
              </div>

              <div className="footer-info-item">
                <Mail size={15} className="footer-info-icon" />
                <a href={`mailto:${settings.supportEmail || 'suplementostopparg@gmail.com'}`} className="footer-mail-link">
                  {settings.supportEmail || 'suplementostopparg@gmail.com'}
                </a>
              </div>

              <div className="footer-info-hours">
                <span className="footer-hours-label">Horarios de mostrador:</span>
                <span className="footer-hours-text">Lun a Vie 8:00 a 23:00 hs · Sáb 10:00 a 18:00 hs</span>
              </div>

              <div className="footer-pay-pill">
                <span>10% OFF por transferencia · 6 cuotas con Mercado Pago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Suplementos Top · Recoleta, CABA · Todos los derechos reservados.
          </p>

          <div className="footer-bottom-links">
            <Link to="/terminos">Términos</Link>
            <span className="footer-sep">·</span>
            <Link to="/envios">Envíos</Link>
            <span className="footer-sep">·</span>
            <Link to="/responsabilidad">Aviso ANMAT</Link>
            <span className="footer-sep">·</span>
            <Link to="/admin" className="footer-admin-link">Panel</Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ========================================================
           CLEAN, COMPACT, PROFESSIONAL E-COMMERCE FOOTER
           No noisy pastel circle icons, no oversized bulk
           ======================================================== */
        .site-footer {
          background: #0B0F19;
          color: #94A3B8;
          padding: 3rem 0 1.5rem;
          border-top: 1px solid #1E293B;
          font-family: var(--font-body);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
          padding-bottom: 2.25rem;
          border-bottom: 1px solid #1E293B;
        }

        @media (max-width: 991px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        /* Brand Column */
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          margin-bottom: 0.85rem;
        }

        .footer-logo {
          width: 38px;
          height: 38px;
          object-fit: contain;
          border-radius: 6px;
        }

        .footer-brand-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.04em;
          display: block;
        }

        .footer-brand-sub {
          font-size: 0.72rem;
          font-weight: 600;
          color: #10B981;
          letter-spacing: 0.02em;
          display: block;
        }

        .footer-desc {
          font-size: 0.82rem;
          line-height: 1.55;
          color: #94A3B8;
          margin: 0 0 1.15rem 0;
          max-width: 340px;
        }

        .footer-social-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-social-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.82rem;
          font-weight: 600;
          color: #E2E8F0;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-social-link:hover {
          color: #22C55E;
        }

        /* Column Headings */
        .footer-heading {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #FFFFFF;
          margin: 0 0 1rem 0;
        }

        /* Links Lists */
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .footer-links a {
          font-size: 0.82rem;
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.15s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: #FFFFFF;
        }

        .footer-link-highlight {
          color: #22C55E !important;
          font-weight: 700;
          margin-top: 0.25rem;
        }

        .footer-link-flex {
          display: inline-flex !important;
          align-items: center;
          gap: 0.45rem;
        }

        /* Info Block */
        .footer-info-block {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.82rem;
        }

        .footer-info-item {
          display: flex;
          gap: 0.55rem;
          line-height: 1.45;
        }

        .footer-info-icon {
          color: #22C55E;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .footer-info-item strong {
          color: #FFFFFF;
          display: block;
          font-size: 0.84rem;
        }

        .footer-info-item span {
          color: #94A3B8;
          display: block;
          font-size: 0.78rem;
        }

        .footer-mail-link {
          color: #CBD5E1;
          text-decoration: none;
          font-size: 0.82rem;
        }

        .footer-mail-link:hover {
          color: #22C55E;
        }

        .footer-info-hours {
          padding-top: 0.35rem;
          border-top: 1px solid #1E293B;
          font-size: 0.78rem;
          line-height: 1.4;
        }

        .footer-hours-label {
          color: #CBD5E1;
          font-weight: 700;
          display: block;
          margin-bottom: 0.15rem;
        }

        .footer-hours-text {
          color: #94A3B8;
          display: block;
        }

        .footer-pay-pill {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #86EFAC;
          padding: 0.4rem 0.65rem;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 600;
          line-height: 1.35;
        }

        /* Bottom Row */
        .footer-bottom {
          padding-top: 1.35rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.78rem;
          color: #64748B;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            padding-right: 5rem;
          }
        }

        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding-bottom: 4rem;
          }
        }

        .footer-copy {
          margin: 0;
          color: #64748B;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .footer-bottom-links a {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-bottom-links a:hover {
          color: #FFFFFF;
        }

        .footer-sep {
          color: #334155;
        }

        .footer-admin-link {
          color: #475569 !important;
          font-size: 0.72rem;
          text-decoration: none;
        }

        .footer-admin-link:hover {
          color: #94A3B8 !important;
        }
      `}</style>
    </footer>
  );
};
