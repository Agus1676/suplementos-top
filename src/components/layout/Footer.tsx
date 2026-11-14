import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, Instagram } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="footer-root">
      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand & Emblem */}
            <div className="footer-col">
              <div className="brand-logo-footer">
                <div className="logo-badge-footer">
                  <img src="/logo.jpg" alt="Logo Suplementos Top" className="footer-logo-img" />
                </div>
                <div>
                  <span className="brand-name-footer">SUPLEMENTOS <span className="text-gold">TOP</span></span>
                  <span className="brand-sub-footer">ATHLETIC PERFORMANCE</span>
                </div>
              </div>
              
              <p className="footer-bio">
                Líderes en nutrición de vanguardia y suplementación para atletas de alta exigencia en Argentina. Materias primas importadas con certificación Creapure® y microfiltrado CFM.
              </p>

              <div className="footer-socials">
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  aria-label="Instagram"
                >
                  <Instagram size={18} className="text-gold" />
                  <span>@suplementos_topp</span>
                </a>
              </div>
            </div>

            {/* Col 2: Sede Central & Retiros */}
            <div className="footer-col">
              <h3 className="footer-heading">SEDE & RETIRO EN CABA</h3>
              <ul className="footer-contact-list">
                <li>
                  <MapPin size={20} className="contact-icon text-gold" />
                  <div>
                    <strong>Punto de Retiro & Despacho:</strong>
                    <p>{settings.pickupAddress}</p>
                    <a
                      href="https://maps.google.com/?q=Uriburu+1163,+Recoleta,+CABA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-map-link"
                    >
                      Abrir en Google Maps →
                    </a>
                  </div>
                </li>
                <li>
                  <Clock size={20} className="contact-icon text-gold" />
                  <div>
                    <strong>Horarios de Atención:</strong>
                    <p>{settings.hoursDescription}</p>
                  </div>
                </li>
                <li>
                  <Phone size={20} className="contact-icon text-gold" />
                  <div>
                    <strong>WhatsApp Directo:</strong>
                    <p><a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer" className="text-gold font-bold">11 6565 1990</a></p>
                  </div>
                </li>
                <li>
                  <Mail size={20} className="contact-icon text-gold" />
                  <div>
                    <strong>Email Oficial:</strong>
                    <p><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a></p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Col 3: Categorías */}
            <div className="footer-col">
              <h3 className="footer-heading">CATEGORÍAS</h3>
              <ul className="footer-links">
                <li><Link to="/catalogo?categoria=proteinas">Proteínas Whey Isolate CFM</Link></li>
                <li><Link to="/catalogo?categoria=creatinas">Creatinas Creapure® Monohidrato</Link></li>
                <li><Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenos Extreme Pump</Link></li>
                <li><Link to="/catalogo?categoria=aminoacidos">Aminoácidos BCAA 4:1:1 & Glutamina</Link></li>
                <li><Link to="/catalogo?categoria=salud-vitaminas">Multivitamínicos & Salud</Link></li>
                <li><Link to="/catalogo?categoria=accesorios">Shakers Pro de Acero</Link></li>
              </ul>
            </div>

            {/* Col 4: Ayuda & Políticas */}
            <div className="footer-col">
              <h3 className="footer-heading">INFORMACIÓN & AYUDA</h3>
              <ul className="footer-links">
                <li><Link to="/seguimiento">Rastrear Mi Pedido</Link></li>
                <li><Link to="/envios">Políticas de Envío y Retiro</Link></li>
                <li><Link to="/faq">Preguntas Frecuentes (FAQ)</Link></li>
                <li><Link to="/terminos">Términos y Condiciones</Link></li>
                <li><Link to="/contacto">Contacto & Soporte</Link></li>
                <li><Link to="/admin" className="text-gold font-bold">Panel Administrador</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} SUPLEMENTOS TOP ARGENTINA. Todos los derechos reservados.</p>
            <div className="mp-badge-wrap">
              <span className="mp-label">Cobros seguros garantizados por</span>
              <span className="mp-pill">MERCADO PAGO</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: #05070B;
          color: #94A3B8;
          border-top: 1px solid var(--color-border);
          margin-top: 4rem;
        }
        .footer-main {
          padding: 4rem 0 2rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          margin-bottom: 3.5rem;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1.2fr 1fr 1fr;
          }
        }
        .brand-logo-footer {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .logo-badge-footer {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1.5px solid var(--color-accent);
          flex-shrink: 0;
        }
        .footer-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .brand-name-footer {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.35rem;
          color: #FFFFFF;
          display: block;
          line-height: 1;
        }
        .brand-sub-footer {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-text-muted);
        }
        .footer-bio {
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          color: #94A3B8;
        }
        .footer-socials {
          display: flex;
          gap: 0.75rem;
        }
        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #0D111A;
          border: 1px solid var(--color-border);
          color: #FFFFFF;
          padding: 0.5rem 0.95rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .social-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-1px);
        }
        .footer-heading {
          color: #FFFFFF;
          font-size: 1.15rem;
          margin-bottom: 1.25rem;
        }
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.85rem;
        }
        .footer-contact-list li {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .contact-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
        }
        .footer-contact-list strong {
          color: #FFFFFF;
          display: block;
          font-size: 0.85rem;
        }
        .footer-map-link {
          color: var(--color-accent);
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-block;
          margin-top: 0.2rem;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.875rem;
        }
        .footer-links a {
          color: #94A3B8;
          transition: color 0.15s, transform 0.15s;
          display: inline-block;
        }
        .footer-links a:hover {
          color: var(--color-accent);
          transform: translateX(4px);
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8rem;
        }
        @media (min-width: 640px) {
          .footer-bottom {
            flex-direction: row;
          }
        }
        .mp-badge-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .mp-pill {
          background: #009EE3;
          color: #FFFFFF;
          font-family: var(--font-display);
          font-weight: 800;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }
      `}</style>
    </footer>
  );
};
