import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, Instagram, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="footer-root">
      <div className="container">
        {/* Main Grid */}
        <div className="footer-grid">
          {/* Col 1: Brand & Bio */}
          <div className="footer-col footer-col-brand">
            <div className="brand-logo-footer">
              <div className="logo-badge-footer">
                <img src="/logo.jpg" alt="Logo Suplementos Top" className="footer-logo-img" />
              </div>
              <div>
                <span className="brand-name-footer">SUPLEMENTOS <span className="text-red">TOP</span></span>
                <span className="brand-sub-footer">SPORT NUTRITION • ARGENTINA</span>
              </div>
            </div>
            
            <p className="footer-bio">
              Nutrición deportiva y suplementación de alto rendimiento con stock oficial garantizado.
            </p>

            <a 
              href={settings.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-pill"
              aria-label="Instagram"
            >
              <Instagram size={14} />
              <span>@suplementos_topp</span>
            </a>
          </div>

          {/* Col 2: Local & Retiros */}
          <div className="footer-col">
            <h3 className="footer-heading">LOCAL & RETIROS</h3>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={15} className="contact-icon text-red" />
                <div>
                  <strong>Punto Recoleta:</strong>
                  <p>{settings.pickupAddress}</p>
                  <a
                    href="https://maps.google.com/?q=Uriburu+1163,+Recoleta,+CABA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-map-link"
                  >
                    Ver en Maps →
                  </a>
                </div>
              </li>
              <li>
                <Clock size={15} className="contact-icon text-red" />
                <div>
                  <strong>Horarios:</strong>
                  <p>{settings.hoursDescription}</p>
                </div>
              </li>
              <li>
                <Phone size={15} className="contact-icon text-red" />
                <div>
                  <strong>WhatsApp:</strong>
                  <p><a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer" className="text-white font-bold">11 6565 1990</a></p>
                </div>
              </li>
              <li>
                <Mail size={15} className="contact-icon text-red" />
                <div>
                  <strong>Email:</strong>
                  <p><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a></p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Categorías */}
          <div className="footer-col">
            <h3 className="footer-heading">CATEGORÍAS</h3>
            <ul className="footer-links">
              <li><Link to="/catalogo?categoria=proteinas">Proteínas Whey & Isolate</Link></li>
              <li><Link to="/catalogo?categoria=creatinas">Creatinas Monohidrato</Link></li>
              <li><Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenos & Pump</Link></li>
              <li><Link to="/catalogo?categoria=aminoacidos">BCAA & Glutamina</Link></li>
              <li><Link to="/catalogo?categoria=salud-vitaminas">Multivitamínicos & Salud</Link></li>
              <li><Link to="/catalogo?categoria=accesorios">Shakers & Accesorios</Link></li>
            </ul>
          </div>

          {/* Col 4: Ayuda & AFIP Data Fiscal */}
          <div className="footer-col">
            <h3 className="footer-heading">AYUDA & INFORMACIÓN</h3>
            <ul className="footer-links">
              <li><Link to="/seguimiento">Rastrear Mi Pedido</Link></li>
              <li><Link to="/envios">Formas de Envío y Retiro</Link></li>
              <li><Link to="/faq">Preguntas Frecuentes</Link></li>
              <li><Link to="/terminos">Términos y Condiciones</Link></li>
              <li><Link to="/contacto">Contacto & Soporte</Link></li>
              <li><Link to="/admin" className="text-muted text-xs">Acceso Administrador</Link></li>
            </ul>

            <div className="data-fiscal-compact">
              <ShieldCheck size={14} className="text-success" />
              <div>
                <span className="df-title">DATA FISCAL F960/D</span>
                <span className="df-sub">Comercio Verificado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="footer-bottom">
          <p className="copyright-text">
            © {new Date().getFullYear()} SUPLEMENTOS TOP. Todos los derechos reservados.
          </p>
          
          <div className="payment-badges-wrap">
            <span className="mp-secure-label">Pagos seguros con Mercado Pago:</span>
            <div className="payment-pills">
              <span className="payment-pill">VISA</span>
              <span className="payment-pill">MASTERCARD</span>
              <span className="payment-pill">CABAL</span>
              <span className="payment-pill">PAGO FÁCIL</span>
              <span className="payment-pill">RAPIPAGO</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: #0F172A;
          color: #94A3B8;
          border-top: 1px solid #1E293B;
          margin-top: 2.5rem;
          padding: 2.25rem 0 1.25rem;
          font-size: 0.8rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          margin-bottom: 1.75rem;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.3fr 1.3fr 1fr 1fr;
            gap: 2rem;
          }
        }
        .footer-col-brand {
          max-width: 320px;
        }
        .brand-logo-footer {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.75rem;
        }
        .logo-badge-footer {
          width: 34px;
          height: 34px;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid #334155;
          flex-shrink: 0;
          background: #000;
        }
        .footer-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .brand-name-footer {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.05rem;
          color: #FFFFFF;
          display: block;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        .text-red {
          color: #E11D48;
        }
        .brand-sub-footer {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #64748B;
          display: block;
        }
        .footer-bio {
          font-size: 0.78rem;
          line-height: 1.45;
          margin-bottom: 0.85rem;
          color: #94A3B8;
        }
        .social-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #1E293B;
          border: 1px solid #334155;
          color: #F8FAFC;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        .social-pill:hover {
          background: #334155;
          color: #FFFFFF;
        }
        .footer-heading {
          font-size: 0.78rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 0.75rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .footer-contact-list li {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          font-size: 0.78rem;
          line-height: 1.35;
        }
        .contact-icon {
          flex-shrink: 0;
          margin-top: 0.1rem;
        }
        .footer-contact-list strong {
          color: #F1F5F9;
          font-weight: 600;
          display: block;
          font-size: 0.75rem;
        }
        .footer-contact-list p {
          color: #94A3B8;
          margin: 0;
        }
        .footer-contact-list a {
          color: #94A3B8;
          transition: color 0.15s;
        }
        .footer-contact-list a:hover {
          color: #FFFFFF;
        }
        .footer-map-link {
          color: #E11D48 !important;
          font-weight: 700;
          font-size: 0.72rem;
          display: inline-block;
          margin-top: 0.1rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .footer-links a {
          color: #94A3B8;
          font-size: 0.78rem;
          transition: color 0.15s;
        }
        .footer-links a:hover {
          color: #FFFFFF;
        }
        .data-fiscal-compact {
          margin-top: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #1E293B;
          border: 1px solid #334155;
          padding: 0.4rem 0.65rem;
          border-radius: 4px;
        }
        .df-title {
          display: block;
          font-weight: 800;
          font-size: 0.68rem;
          color: #FFFFFF;
          line-height: 1.1;
        }
        .df-sub {
          display: block;
          font-size: 0.62rem;
          color: #94A3B8;
        }
        .footer-bottom {
          border-top: 1px solid #1E293B;
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
          }
        }
        .copyright-text {
          font-size: 0.72rem;
          color: #64748B;
          margin: 0;
        }
        .payment-badges-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .mp-secure-label {
          font-size: 0.7rem;
          color: #94A3B8;
          font-weight: 600;
        }
        .payment-pills {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }
        .payment-pill {
          background: #1E293B;
          border: 1px solid #334155;
          color: #CBD5E1;
          font-size: 0.62rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border-radius: 2px;
          letter-spacing: 0.03em;
        }
      `}</style>
    </footer>
  );
};
