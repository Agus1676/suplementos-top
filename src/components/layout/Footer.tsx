import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  Instagram, 
  MapPin, 
  Clock, 
  Truck, 
  CreditCard, 
  PackageCheck, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-grid">
          {/* Brand Info */}
          <div className="ft-col ft-brand-col">
            <Link
              to="/"
              className="ft-brand"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="/logo.png" alt={settings.storeName} className="ft-logo" />
              <div>
                <div className="ft-name">SUPLEMENTOS TOP</div>
                <span className="ft-badge">GIMNASIO TOP SHAPE • RECOLETA</span>
              </div>
            </Link>
            <p className="ft-about">
              Tienda oficial de suplementación deportiva original en Recoleta, CABA. Retiro sin cargo en el día y envíos a todo el país.
            </p>
            <div className="ft-trust-pill">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Garantía de originalidad 100% sellado</span>
            </div>
          </div>

          {/* Tienda */}
          <div className="ft-col">
            <h4 className="ft-heading">Tienda</h4>
            <ul className="ft-nav-list">
              <li>
                <Link to="/catalogo" className="ft-nav-link">
                  <ChevronRight size={13} className="ft-chevron" />
                  <span>Catálogo completo</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=proteinas" className="ft-nav-link">
                  <ChevronRight size={13} className="ft-chevron" />
                  <span>Proteínas Whey &amp; Isolate</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=creatinas" className="ft-nav-link">
                  <ChevronRight size={13} className="ft-chevron" />
                  <span>Creatinas Creapure®</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=pre-entrenos" className="ft-nav-link">
                  <ChevronRight size={13} className="ft-chevron" />
                  <span>Pre-Entrenos &amp; Óxido</span>
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=combos" className="ft-nav-link">
                  <ChevronRight size={13} className="ft-chevron" />
                  <span>Combos &amp; Ofertas</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="ft-nav-link">
                  <ChevronRight size={13} className="ft-chevron" />
                  <span>Preguntas frecuentes</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto con iconos destacados */}
          <div className="ft-col">
            <h4 className="ft-heading">Contacto Directo</h4>
            <ul className="ft-contact-list">
              <li>
                <a
                  href="https://wa.me/5491165652990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-contact-item ft-item-wa"
                  title="WhatsApp oficial"
                >
                  <div className="ft-icon-box ft-icon-wa">
                    <Phone size={14} />
                  </div>
                  <div className="ft-item-texts">
                    <span className="ft-label-sub">WhatsApp Oficial:</span>
                    <strong className="ft-strong">11 6565-2990</strong>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="ft-contact-item"
                  title="Correo electrónico oficial"
                >
                  <div className="ft-icon-box ft-icon-mail">
                    <Mail size={14} />
                  </div>
                  <div className="ft-item-texts">
                    <span className="ft-label-sub">Email de atención:</span>
                    <strong className="ft-strong">{settings.supportEmail}</strong>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-contact-item ft-item-ig"
                  title="Instagram oficial"
                >
                  <div className="ft-icon-box ft-icon-ig">
                    <Instagram size={14} />
                  </div>
                  <div className="ft-item-texts">
                    <span className="ft-label-sub">Instagram:</span>
                    <strong className="ft-strong">@suplementos_topp</strong>
                  </div>
                </a>
              </li>

              <li>
                <Link to="/seguimiento" className="ft-contact-item">
                  <div className="ft-icon-box ft-icon-tracking">
                    <PackageCheck size={14} />
                  </div>
                  <div className="ft-item-texts">
                    <span className="ft-label-sub">Tu Pedido:</span>
                    <strong className="ft-strong">Seguimiento de despacho</strong>
                  </div>
                </Link>
              </li>

              <li>
                <Link to="/contacto" className="ft-contact-item">
                  <div className="ft-icon-box ft-icon-map">
                    <MapPin size={14} />
                  </div>
                  <div className="ft-item-texts">
                    <span className="ft-label-sub">Sede Física:</span>
                    <strong className="ft-strong">Ubicación y horarios</strong>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Retiro y Envíos con iconos destacados */}
          <div className="ft-col">
            <h4 className="ft-heading">Retiro &amp; Envíos</h4>
            <ul className="ft-logistics-list">
              <li className="ft-logistics-item">
                <div className="ft-icon-box ft-icon-pickup">
                  <MapPin size={15} />
                </div>
                <div>
                  <strong className="ft-logistics-title">Retiro sin cargo en Recoleta:</strong>
                  <p className="ft-logistics-desc">
                    Pres. José E. Uriburu 1163 (Gimnasio Top Shape), entre Av. Santa Fe y Arenales.
                  </p>
                </div>
              </li>

              <li className="ft-logistics-item">
                <div className="ft-icon-box ft-icon-clock">
                  <Clock size={15} />
                </div>
                <div>
                  <strong className="ft-logistics-title">Horarios de mostrador:</strong>
                  <p className="ft-logistics-desc">
                    Lun a Vie 8:00 a 23:00 hs | Sáb 10:00 a 18:00 hs.
                  </p>
                </div>
              </li>

              <li className="ft-logistics-item">
                <div className="ft-icon-box ft-icon-truck">
                  <Truck size={15} />
                </div>
                <div>
                  <strong className="ft-logistics-title">Envíos a todo el país:</strong>
                  <p className="ft-logistics-desc">
                    Despacho express por Correo con código de seguimiento online.
                  </p>
                </div>
              </li>

              <li className="ft-logistics-item">
                <div className="ft-icon-box ft-icon-pay">
                  <CreditCard size={15} />
                </div>
                <div>
                  <strong className="ft-logistics-title">Medios de pago:</strong>
                  <p className="ft-logistics-desc">
                    <span className="ft-pay-highlight">10% OFF por Transferencia</span> o en cuotas con Mercado Pago.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Credits */}
        <div className="ft-bottom">
          <span>© {new Date().getFullYear()} {settings.storeName}. Todos los derechos reservados • Recoleta, CABA.</span>
          <div className="ft-bottom-right">
            <span>
              Desarrollado por{' '}
              <a href="https://agustinpollan.vercel.app/" target="_blank" rel="noopener noreferrer">
                Agustín Pollán ↗
              </a>
            </span>
            <span className="ft-bottom-sep">•</span>
            <Link to="/admin" className="ft-admin-link">
              Acceso Panel Admin
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ========================================================
           HIGH-CONTRAST PROFESSIONAL FOOTER - NO MÁS "MEDIO LAVADO"
           Bold Icons, Rich Typography & Responsive Layout
           ======================================================== */
        .ft {
          background: #FFFFFF;
          color: #0F172A;
          border-top: 1px solid #E2E8F0;
          margin-top: 3.5rem;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .ft-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 44px 20px 20px;
          box-sizing: border-box;
        }
        .ft-grid {
          display: grid;
          grid-template-columns: 1.25fr 1fr 1.2fr 1.2fr;
          gap: 32px;
          padding-bottom: 32px;
        }
        @media (max-width: 1024px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 28px;
          }
        }
        @media (max-width: 640px) {
          .ft-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
        }

        /* Brand Column */
        .ft-brand-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ft-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .ft-logo {
          height: 52px;
          width: auto;
          object-fit: contain;
          flex-shrink: 0;
        }
        .ft-name {
          font-size: 1.05rem;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: 0.03em;
          line-height: 1.1;
        }
        .ft-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 800;
          color: #E63946;
          letter-spacing: 0.05em;
          margin-top: 3px;
        }
        .ft-about {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }
        .ft-trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          width: fit-content;
        }

        /* Headings */
        .ft-heading {
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #0F172A;
          margin: 0 0 14px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #0F172A;
          display: inline-block;
        }

        /* Tienda List */
        .ft-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ft-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .ft-chevron {
          color: #94A3B8;
          transition: transform 0.15s ease, color 0.15s ease;
        }
        .ft-nav-link:hover {
          color: #E63946;
          transform: translateX(3px);
        }
        .ft-nav-link:hover .ft-chevron {
          color: #E63946;
        }

        /* Contact List with Bold Colored Icon Boxes */
        .ft-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ft-contact-item {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          padding: 6px 8px;
          border-radius: 8px;
          transition: background 0.15s ease;
        }
        .ft-contact-item:hover {
          background: #F8FAFC;
        }
        .ft-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s ease;
        }
        .ft-contact-item:hover .ft-icon-box {
          transform: scale(1.08);
        }

        .ft-icon-wa {
          background: #DCFCE7;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }
        .ft-icon-mail {
          background: #EFF6FF;
          color: #2563EB;
          border: 1px solid #BFDBFE;
        }
        .ft-icon-ig {
          background: #FDF2F8;
          color: #DB2777;
          border: 1px solid #FBCFE8;
        }
        .ft-icon-tracking {
          background: #F1F5F9;
          color: #0F172A;
          border: 1px solid #E2E8F0;
        }
        .ft-icon-map {
          background: #FFF1F2;
          color: #E11D48;
          border: 1px solid #FFE4E6;
        }

        .ft-item-texts {
          display: flex;
          flex-direction: column;
          line-height: 1.25;
        }
        .ft-label-sub {
          font-size: 0.70rem;
          font-weight: 600;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .ft-strong {
          font-size: 0.86rem;
          font-weight: 700;
          color: #0F172A;
          word-break: break-all;
        }

        /* Logistics List */
        .ft-logistics-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .ft-logistics-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .ft-icon-pickup {
          background: #FFF1F2;
          color: #E11D48;
          border: 1px solid #FFE4E6;
        }
        .ft-icon-clock {
          background: #F1F5F9;
          color: #0F172A;
          border: 1px solid #CBD5E1;
        }
        .ft-icon-truck {
          background: #E0F2FE;
          color: #0284C7;
          border: 1px solid #BAE6FD;
        }
        .ft-icon-pay {
          background: #DCFCE7;
          color: #16A34A;
          border: 1px solid #BBF7D0;
        }

        .ft-logistics-title {
          display: block;
          font-size: 0.84rem;
          font-weight: 800;
          color: #0F172A;
          margin-bottom: 2px;
        }
        .ft-logistics-desc {
          font-size: 0.78rem;
          color: #475569;
          line-height: 1.4;
          margin: 0;
        }
        .ft-pay-highlight {
          color: #16A34A;
          font-weight: 700;
        }

        /* Footer Bottom */
        .ft-bottom {
          border-top: 1px solid #E2E8F0;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 0.78rem;
          color: #64748B;
        }
        .ft-bottom-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ft-bottom-right a {
          color: #0F172A;
          font-weight: 700;
          text-decoration: none;
        }
        .ft-bottom-right a:hover {
          color: #E63946;
          text-decoration: underline;
        }
        .ft-bottom-sep {
          color: #CBD5E1;
        }
        .ft-admin-link {
          background: #0F172A;
          color: #FFFFFF !important;
          padding: 3px 10px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          transition: background 0.15s ease;
        }
        .ft-admin-link:hover {
          background: #E63946;
        }
      `}</style>
    </footer>
  );
};
