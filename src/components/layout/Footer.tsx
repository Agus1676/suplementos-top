import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, Instagram, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="footer-root">
      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand & Bio */}
            <div className="footer-col">
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
                Especialistas en nutrición deportiva y suplementación de alto rendimiento en Argentina. Comercializamos primeras marcas oficiales con stock garantizado y asesoramiento personalizado.
              </p>

              <div className="footer-socials">
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                  <span>@suplementos_topp</span>
                </a>
              </div>
            </div>

            {/* Col 2: Sede Central & Retiros */}
            <div className="footer-col">
              <h3 className="footer-heading">LOCAL & RETIROS</h3>
              <ul className="footer-contact-list">
                <li>
                  <MapPin size={18} className="contact-icon text-red" />
                  <div>
                    <strong>Punto de Retiro & Despacho:</strong>
                    <p>{settings.pickupAddress}</p>
                    <a
                      href="https://maps.google.com/?q=Uriburu+1163,+Recoleta,+CABA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-map-link"
                    >
                      Ver en Google Maps →
                    </a>
                  </div>
                </li>
                <li>
                  <Clock size={18} className="contact-icon text-red" />
                  <div>
                    <strong>Horarios de Atención:</strong>
                    <p>{settings.hoursDescription}</p>
                  </div>
                </li>
                <li>
                  <Phone size={18} className="contact-icon text-red" />
                  <div>
                    <strong>WhatsApp Oficial:</strong>
                    <p><a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer" className="text-white font-bold">11 6565 1990</a></p>
                  </div>
                </li>
                <li>
                  <Mail size={18} className="contact-icon text-red" />
                  <div>
                    <strong>Email de Contacto:</strong>
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
              <h3 className="footer-heading">AYUDA & SEGURIDAD</h3>
              <ul className="footer-links">
                <li><Link to="/seguimiento">Rastrear Mi Pedido</Link></li>
                <li><Link to="/envios">Formas de Envío y Retiro</Link></li>
                <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                <li><Link to="/terminos">Términos y Condiciones</Link></li>
                <li><Link to="/contacto">Contacto & Soporte</Link></li>
                <li><Link to="/admin" className="text-muted text-xs">Acceso Administrador</Link></li>
              </ul>

              {/* Data Fiscal Seal simulation (ENA style) */}
              <div className="data-fiscal-card">
                <div className="afip-box">
                  <span className="afip-title">DATA FISCAL</span>
                  <span className="afip-code">Formulario 960/D</span>
                </div>
                <div className="afip-info">
                  <ShieldCheck size={16} className="text-success" />
                  <span>Comercio Adherido y Verificado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Payments & Copyright */}
          <div className="footer-bottom">
            <p className="copyright-text">
              © {new Date().getFullYear()} SUPLEMENTOS TOP. Todos los derechos reservados. Las fotos son de carácter ilustrativo.
            </p>
            <div className="payment-badges-wrap">
              <span className="mp-secure-label">Pagos procesados por Mercado Pago</span>
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
      </div>

      <style>{`
        .footer-root {
          background-color: #111827;
          color: #9CA3AF;
          border-top: 1px solid #1F2937;
          margin-top: 4rem;
          font-size: 0.85rem;
        }
        .footer-main {
          padding: 3.5rem 0 1.5rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.4fr 1.2fr 1fr 1fr;
          }
        }
        .brand-logo-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .logo-badge-footer {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid #374151;
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
          font-size: 1.2rem;
          color: #FFFFFF;
          display: block;
          line-height: 1;
        }
        .text-red {
          color: #EF4444;
        }
        .brand-sub-footer {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #9CA3AF;
        }
        .footer-bio {
          font-size: 0.82rem;
          line-height: 1.55;
          margin-bottom: 1.25rem;
          color: #9CA3AF;
        }
        .footer-socials {
          display: flex;
          gap: 0.75rem;
        }
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #1F2937;
          border: 1px solid #374151;
          color: #F3F4F6;
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          transition: background 0.15s;
        }
        .social-btn:hover {
          background: #374151;
          color: #FFF;
        }
        .footer-heading {
          font-size: 0.85rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 1.15rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .footer-contact-list li {
          display: flex;
          gap: 0.65rem;
          align-items: flex-start;
          font-size: 0.82rem;
        }
        .contact-icon {
          flex-shrink: 0;
          margin-top: 0.15rem;
        }
        .footer-contact-list strong {
          color: #F3F4F6;
          display: block;
          margin-bottom: 0.15rem;
        }
        .footer-contact-list p {
          color: #9CA3AF;
          margin: 0;
        }
        .footer-contact-list a {
          color: #9CA3AF;
          transition: color 0.15s;
        }
        .footer-contact-list a:hover {
          color: #FFFFFF;
        }
        .footer-map-link {
          color: #EF4444 !important;
          font-weight: 600;
          font-size: 0.75rem;
          display: inline-block;
          margin-top: 0.2rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links a {
          color: #9CA3AF;
          font-size: 0.82rem;
          transition: color 0.15s;
        }
        .footer-links a:hover {
          color: #FFFFFF;
        }
        .data-fiscal-card {
          margin-top: 1.5rem;
          background: #1F2937;
          border: 1px solid #374151;
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .afip-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 800;
          font-size: 0.7rem;
          color: #FFFFFF;
          border-bottom: 1px solid #374151;
          padding-bottom: 0.35rem;
        }
        .afip-code {
          color: #9CA3AF;
          font-size: 0.65rem;
        }
        .afip-info {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          color: #D1D5DB;
        }
        .footer-bottom {
          border-top: 1px solid #1F2937;
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
        }
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
          }
        }
        .copyright-text {
          font-size: 0.75rem;
          color: #6B7280;
          margin: 0;
        }
        .payment-badges-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }
        @media (min-width: 768px) {
          .payment-badges-wrap {
            align-items: flex-end;
          }
        }
        .mp-secure-label {
          font-size: 0.7rem;
          color: #9CA3AF;
          font-weight: 600;
        }
        .payment-pills {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
        }
        .payment-pill {
          background: #1F2937;
          border: 1px solid #374151;
          color: #D1D5DB;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.2rem 0.45rem;
          border-radius: 2px;
          letter-spacing: 0.04em;
        }
      `}</style>
    </footer>
  );
};
