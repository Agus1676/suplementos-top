import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, MapPin, Mail, PackageCheck, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main 4-column modern, clean, light layout */}
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
              Punto oficial en Recoleta, CABA. Suplementos 100% originales con precinto de seguridad de fábrica, retiro sin cargo en el día y envíos a todo el país.
            </p>

            <div className="footer-trust-badge">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Garantía de originalidad ANMAT</span>
            </div>

            <div className="footer-social-row">
              <a
                href={settings.instagram || 'https://www.instagram.com/suplementos_topp'}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram de Suplementos Top"
              >
                <Instagram size={17} />
                <span>@suplementos_topp</span>
              </a>
              <a
                href="https://wa.me/5491165652990"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp oficial"
              >
                <MessageCircle size={17} />
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
              <li><Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenos &amp; Rendimiento</Link></li>
              <li><Link to="/catalogo?categoria=combos">Combos &amp; Packs Ahorro</Link></li>
              <li><Link to="/catalogo?categoria=aminoacidos">Aminoácidos &amp; BCAA</Link></li>
              <li><Link to="/catalogo?categoria=salud-vitaminas">Vitaminas &amp; Magnesio</Link></li>
              <li><Link to="/catalogo" className="footer-link-highlight">Ver catálogo completo →</Link></li>
            </ul>
          </div>

          {/* Col 3: Ayuda & Envíos */}
          <div className="footer-col">
            <h4 className="footer-heading">Información</h4>
            <ul className="footer-links">
              <li>
                <Link to="/seguimiento" className="footer-link-flex">
                  <PackageCheck size={14} className="text-emerald-600" />
                  <span>Seguimiento de pedido</span>
                </Link>
              </li>
              <li><Link to="/envios">Política de envíos y entregas</Link></li>
              <li><Link to="/terminos">Términos y condiciones de compra</Link></li>
              <li><Link to="/responsabilidad">Aviso legal ANMAT</Link></li>
              <li><Link to="/faq">Preguntas frecuentes</Link></li>
              <li><Link to="/contacto">Ubicación y cómo llegar</Link></li>
            </ul>
          </div>

          {/* Col 4: Local & Horarios */}
          <div className="footer-col">
            <h4 className="footer-heading">Sede Recoleta</h4>
            <div className="footer-info-block">
              <div className="footer-info-item">
                <MapPin size={16} className="footer-info-icon" />
                <div>
                  <strong>Pres. José E. Uriburu 1163</strong>
                  <span>Gimnasio Top Shape (entre Av. Santa Fe y Arenales)</span>
                </div>
              </div>

              <div className="footer-info-item">
                <Mail size={16} className="footer-info-icon" />
                <a href={`mailto:${settings.supportEmail || 'suplementostopparg@gmail.com'}`} className="footer-mail-link">
                  {settings.supportEmail || 'suplementostopparg@gmail.com'}
                </a>
              </div>

              <div className="footer-info-hours">
                <span className="footer-hours-label">Horarios de mostrador:</span>
                <span className="footer-hours-text">Lun a Vie 8:00 a 23:00 hs · Sáb 10:00 a 18:00 hs</span>
              </div>

              <div className="footer-pay-pill">
                <strong>10% OFF por transferencia</strong>
                <span>6 cuotas sin interés con Mercado Pago</span>
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
            <Link to="/admin" className="footer-admin-link">Acceso Administrador</Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ========================================================
           CLEAN, MODERN, SOPHISTICATED WHITE / LIGHT E-COMMERCE FOOTER
           Professional, orderly, high-end retail look (Nike/Gymshark)
           ======================================================== */
        .site-footer {
          background: #FFFFFF;
          color: #475569;
          padding: 3.5rem 0 1.75rem;
          border-top: 1px solid #E2E8F0;
          font-family: var(--font-body);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.35fr 1fr 1fr 1.25fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
          border-bottom: 1px solid #F1F5F9;
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
          width: 42px;
          height: 42px;
          object-fit: contain;
          border-radius: 8px;
        }

        .footer-brand-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: 0.04em;
          display: block;
        }

        .footer-brand-sub {
          font-size: 0.72rem;
          font-weight: 700;
          color: #16A34A;
          letter-spacing: 0.02em;
          display: block;
        }

        .footer-desc {
          font-size: 0.84rem;
          line-height: 1.55;
          color: #64748B;
          margin: 0 0 1rem;
          max-width: 320px;
        }

        .footer-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          color: #15803D;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          margin-bottom: 1.15rem;
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
          font-size: 0.84rem;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-social-link:hover {
          color: #16A34A;
        }

        /* Headings */
        .footer-heading {
          font-family: var(--font-display);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0F172A;
          margin: 0 0 1.15rem;
        }

        /* Links List */
        .footer-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-links a {
          color: #64748B;
          text-decoration: none;
          font-size: 0.84rem;
          transition: color 0.15s ease;
        }

        .footer-links a:hover {
          color: #0F172A;
          font-weight: 600;
        }

        .footer-link-flex {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .footer-link-highlight {
          color: #16A34A !important;
          font-weight: 700 !important;
          margin-top: 0.25rem;
        }

        .footer-link-highlight:hover {
          color: #15803D !important;
          text-decoration: underline;
        }

        /* Info Block */
        .footer-info-block {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.83rem;
        }

        .footer-info-item {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          color: #334155;
        }

        .footer-info-icon {
          color: #16A34A;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .footer-info-item strong {
          display: block;
          color: #0F172A;
          font-weight: 700;
        }

        .footer-info-item span {
          color: #64748B;
          font-size: 0.78rem;
          display: block;
        }

        .footer-mail-link {
          color: #334155;
          text-decoration: none;
          word-break: break-all;
          font-weight: 500;
        }

        .footer-mail-link:hover {
          color: #16A34A;
          text-decoration: underline;
        }

        .footer-info-hours {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
        }

        .footer-hours-label {
          display: block;
          font-size: 0.74rem;
          font-weight: 700;
          color: #0F172A;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          margin-bottom: 2px;
        }

        .footer-hours-text {
          font-size: 0.78rem;
          color: #64748B;
        }

        .footer-pay-pill {
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          color: #15803D;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .footer-pay-pill strong {
          font-size: 0.76rem;
          font-weight: 800;
          color: #166534;
        }

        .footer-pay-pill span {
          font-size: 0.73rem;
          color: #15803D;
        }

        /* Bottom Row */
        .footer-bottom {
          padding-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.85rem;
          font-size: 0.78rem;
          color: #64748B;
        }

        @media (min-width: 768px) {
          .footer-bottom {
            padding-right: 6.5rem;
          }
        }

        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            padding-bottom: 4.5rem;
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
          flex-wrap: wrap;
        }

        .footer-bottom-links a {
          color: #64748B;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-bottom-links a:hover {
          color: #0F172A;
        }

        .footer-sep {
          color: #CBD5E1;
        }

        .footer-admin-link {
          color: #475569 !important;
          font-size: 0.74rem;
          font-weight: 600;
          background: #F1F5F9;
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
        }

        .footer-admin-link:hover {
          background: #E2E8F0;
          color: #0F172A !important;
        }
      `}</style>
    </footer>
  );
};
