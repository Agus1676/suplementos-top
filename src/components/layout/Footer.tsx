import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, Instagram, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="footer-root">
      {/* Pre-footer trust highlights */}
      <div className="footer-highlights">
        <div className="container">
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">
                <Truck size={24} />
              </div>
              <div className="highlight-text">
                <h4>Envíos a Todo el País</h4>
                <p>Despacho inmediato desde Recoleta, CABA.</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <MapPin size={24} />
              </div>
              <div className="highlight-text">
                <h4>Punto de Retiro Gratis</h4>
                <p>Uriburu 1163 (entre Sta. Fe y Arenales).</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <CreditCard size={24} />
              </div>
              <div className="highlight-text">
                <h4>Mercado Pago Seguro</h4>
                <p>Tarjetas de crédito, débito y dinero en cuenta.</p>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-icon">
                <ShieldCheck size={24} />
              </div>
              <div className="highlight-text">
                <h4>100% Original & Sellado</h4>
                <p>Garantía de pureza y calidad deportiva.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Col 1: Brand & Bio */}
            <div className="footer-col">
              <div className="brand-logo-footer">
                <span className="brand-badge-footer">TOP</span>
                <span className="brand-name-footer">SUPLEMENTOS</span>
              </div>
              <p className="footer-bio">
                Especialistas en suplementación de alto rendimiento, nutrición deportiva y asesoramiento personalizado para atletas y entusiastas del fitness en Argentina.
              </p>
              <div className="footer-socials">
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                  <span>@suplementos_topp</span>
                </a>
              </div>
            </div>

            {/* Col 2: Atención & Retiros */}
            <div className="footer-col">
              <h3 className="footer-heading">Atención y Retiros</h3>
              <ul className="footer-contact-list">
                <li>
                  <MapPin size={18} className="contact-icon text-accent" />
                  <div>
                    <strong>Punto de Retiro & Despacho:</strong>
                    <p>{settings.pickupAddress}</p>
                  </div>
                </li>
                <li>
                  <Clock size={18} className="contact-icon text-accent" />
                  <div>
                    <strong>Horarios:</strong>
                    <p>{settings.hoursDescription}</p>
                  </div>
                </li>
                <li>
                  <Phone size={18} className="contact-icon text-accent" />
                  <div>
                    <strong>WhatsApp Directo:</strong>
                    <p><a href="https://wa.me/5491165651990" target="_blank" rel="noopener noreferrer">11 6565 1990</a></p>
                  </div>
                </li>
                <li>
                  <Mail size={18} className="contact-icon text-accent" />
                  <div>
                    <strong>Email Oficial:</strong>
                    <p><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a></p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Col 3: Navegación & Catálogo */}
            <div className="footer-col">
              <h3 className="footer-heading">Categorías</h3>
              <ul className="footer-links">
                <li><Link to="/catalogo?categoria=proteinas">Proteínas Whey Isolate</Link></li>
                <li><Link to="/catalogo?categoria=creatinas">Creatinas Creapure®</Link></li>
                <li><Link to="/catalogo?categoria=pre-entrenos">Pre-Entrenamientos Extreme</Link></li>
                <li><Link to="/catalogo?categoria=aminoacidos">BCAA & Glutamina</Link></li>
                <li><Link to="/catalogo?categoria=salud-vitaminas">Multivitamínicos & Salud</Link></li>
                <li><Link to="/catalogo?categoria=accesorios">Shakers & Accesorios</Link></li>
              </ul>
            </div>

            {/* Col 4: Ayuda & Políticas */}
            <div className="footer-col">
              <h3 className="footer-heading">Información & Ayuda</h3>
              <ul className="footer-links">
                <li><Link to="/seguimiento">Seguimiento de Mi Pedido</Link></li>
                <li><Link to="/envios">Políticas de Envío y Retiro</Link></li>
                <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                <li><Link to="/terminos">Términos y Condiciones</Link></li>
                <li><Link to="/contacto">Contacto & Soporte</Link></li>
                <li><Link to="/admin" className="text-accent font-semibold">Acceso Administrador</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Suplementos Top Argentina. Todos los derechos reservados.</p>
            <div className="mp-badge-wrap">
              <span className="mp-label">Pagos procesados de forma segura con</span>
              <span className="mp-pill">Mercado Pago</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-root {
          background-color: var(--color-primary-dark);
          color: #94A3B8;
          margin-top: 5rem;
        }
        .footer-highlights {
          background-color: #0b1120;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 2.5rem 0;
        }
        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .highlights-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .highlights-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .highlight-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .highlight-icon {
          color: var(--color-accent);
          background: rgba(245, 158, 11, 0.1);
          padding: 0.75rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .highlight-text h4 {
          color: #F8FAFC;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }
        .highlight-text p {
          font-size: 0.8rem;
          color: #94A3B8;
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
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .brand-badge-footer {
          background: var(--color-accent);
          color: #0F172A;
          font-weight: 800;
          font-size: 1rem;
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
        }
        .brand-name-footer {
          color: #FFFFFF;
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.01em;
        }
        .footer-bio {
          font-size: 0.875rem;
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
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #F8FAFC;
          padding: 0.5rem 0.9rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .social-btn:hover {
          background: var(--color-accent);
          color: #0F172A;
          border-color: var(--color-accent);
        }
        .footer-heading {
          color: #FFFFFF;
          font-size: 1.05rem;
          font-family: var(--font-display);
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
          margin-top: 0.15rem;
        }
        .footer-contact-list strong {
          color: #E2E8F0;
          display: block;
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
          color: #FFFFFF;
          transform: translateX(3px);
        }
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.08);
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
          gap: 0.5rem;
        }
        .mp-pill {
          background: #009EE3;
          color: #FFFFFF;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          letter-spacing: 0.02em;
        }
      `}</style>
    </footer>
  );
};
