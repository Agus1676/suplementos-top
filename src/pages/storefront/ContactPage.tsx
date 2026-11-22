import React, { useState } from 'react';
import { MapPin, Clock, Mail, Send, CheckCircle2, Navigation, MessageCircle, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SEO } from '../../components/common/SEO';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Consulta por Stock o Sabores',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hola Suplementos Top! Mi nombre es ${formData.name || 'un cliente'}. Tengo una consulta sobre: *${formData.topic}*.\n\nMensaje: ${formData.message || 'Quisiera asesoramiento'}`
    );
    window.open(`https://wa.me/5491165652990?text=${text}`, '_blank');
  };

  return (
    <div className="contact-page-wrapper">
      <SEO
        title="Contacto y Punto de Retiro en Recoleta"
        description="Punto de retiro oficial en Gimnasio Top Shape (Pres. José E. Uriburu 1163, entre Av. Santa Fe y Arenales, Recoleta). WhatsApp oficial: 11 6565-2990. Horarios: Lun a Vie 8 a 23 hs, Sáb 10 a 18 hs."
        canonicalUrl="/contacto"
      />
      <div className="container">
        {/* Header */}
        <div className="contact-hero-header">
          <span className="contact-eyebrow">SEDE CENTRAL & ATENCIÓN AL CLIENTE</span>
          <h1 className="contact-main-title">CONTACTO & RETIROS</h1>
          <p className="contact-lead">
            Visitanos en nuestro punto oficial en <strong>Recoleta</strong> para retirar tu pedido en el día o consultanos por asesoramiento directo en suplementación deportiva.
          </p>
        </div>

        {/* 3 Action Highlights Cards */}
        <div className="contact-highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon-wrap">
              <MapPin size={24} className="text-red" />
            </div>
            <div>
              <h3>PUNTO RECOLETA (GIMNASIO TOP SHAPE)</h3>
              <p>Pres. José E. Uriburu 1163, entre Av. Santa Fe y Arenales</p>
              <span className="highlight-badge">Retiro Gratis en el día</span>
            </div>
          </div>

          <div className="highlight-card">
            <div className="highlight-icon-wrap">
              <Clock size={24} className="text-red" />
            </div>
            <div>
              <h3>HORARIO EXTENDIDO</h3>
              <p>Lun a Vie de 8:00 a 23:00 hs · Sáb de 10:00 a 18:00 hs</p>
              <span className="highlight-badge">Atención continua</span>
            </div>
          </div>

          <div className="highlight-card">
            <div className="highlight-icon-wrap">
              <MessageCircle size={24} className="text-red" />
            </div>
            <div>
              <h3>ASESORAMIENTO TÉCNICO</h3>
              <p>Respondemos dudas de tomas, ciclos y combinación de suplementos</p>
              <span className="highlight-badge">WhatsApp 11 6565-2990</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Location & Form */}
        <div className="contact-content-grid">
          {/* Location & Map Col */}
          <div className="contact-location-col">
            <div className="card location-card">
              <div className="card-top-title">
                <Navigation size={18} className="text-red" />
                <h2>Ubicación & Cómo Llegar</h2>
              </div>

              <p className="location-desc">
                Nuestro centro de retiro y despacho está ubicado en una zona estratégica de Recoleta, a metros de Av. Santa Fe y con acceso inmediato a transporte público (Subte Línea D y múltiples líneas de colectivos).
              </p>

              {/* Embedded Google Maps */}
              <div className="map-iframe-container">
                <iframe
                  title="Ubicación Suplementos Top - Gimnasio Top Shape, Pres. José E. Uriburu 1163"
                  src="https://maps.google.com/maps?q=Gimnasio+Top+Shape,+Pres.+Jose+Evaristo+Uriburu+1163,+Recoleta,+Buenos+Aires&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="260"
                  style={{ border: 0, borderRadius: 'var(--radius-sm)' }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="location-details-list">
                <div className="loc-item">
                  <strong className="text-white">Sede:</strong>
                  <span>Gimnasio Top Shape</span>
                </div>
                <div className="loc-item">
                  <strong className="text-white">Dirección:</strong>
                  <span>Pres. José E. Uriburu 1163, Recoleta, CABA</span>
                </div>
                <div className="loc-item">
                  <strong className="text-white">Horarios:</strong>
                  <span>Lunes a Viernes 8:00 a 23:00 hs | Sábados 10:00 a 18:00 hs</span>
                </div>
                <div className="loc-item">
                  <strong className="text-white">WhatsApp:</strong>
                  <a href="https://wa.me/5491165652990" target="_blank" rel="noopener noreferrer" className="text-accent font-bold">
                    +54 9 11 6565-2990
                  </a>
                </div>
                <div className="loc-item">
                  <strong className="text-white">Email:</strong>
                  <a href={`mailto:${settings.supportEmail}`} className="text-muted hover-white">
                    {settings.supportEmail}
                  </a>
                </div>
                <div className="loc-item">
                  <strong className="text-white">Instagram:</strong>
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover-white">
                    @suplementos_topp
                  </a>
                </div>
              </div>

              <div className="pickup-tips-box">
                <HelpCircle size={18} className="text-accent flex-shrink-0" />
                <div className="tips-text">
                  <strong>¿Qué necesitás para retirar tu pedido?</strong>
                  <p>Presentate en el local con tu <strong>DNI</strong> o informá el <strong>número de pedido (#ST-XXXXXX)</strong> generado al momento de la compra.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Col */}
          <div className="contact-form-col">
            <div className="card form-card">
              <div className="card-top-title">
                <Mail size={18} className="text-red" />
                <h2>Dejanos tu Consulta</h2>
              </div>
              <p className="form-subtitle">Completá el formulario o hacé clic abajo para contactarnos directamente por WhatsApp.</p>

              {submitted ? (
                <div className="form-success-state">
                  <CheckCircle2 size={48} className="text-success" />
                  <h3>¡Mensaje Enviado con Éxito!</h3>
                  <p>Recibimos tu consulta. Nuestro equipo de asesores te responderá a la brevedad.</p>
                  
                  <button
                    onClick={handleWhatsAppDirect}
                    className="btn btn-accent btn-lg mt-3"
                  >
                    <MessageCircle size={18} />
                    <span>Continuar la charla por WhatsApp</span>
                  </button>

                  <button 
                    onClick={() => setSubmitted(false)} 
                    className="btn btn-secondary btn-sm mt-3"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="styled-contact-form">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="Ej: Marcos Rossi"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        className="form-input"
                        placeholder="Ej: 11 2345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="tunombre@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Motivo de la Consulta</label>
                    <select
                      className="form-input"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    >
                      <option value="Consulta por Stock o Sabores">Consulta por Stock o Sabores</option>
                      <option value="Retiro de Pedido en Uriburu 1163">Retiro de Pedido en Uriburu 1163</option>
                      <option value="Asesoramiento Nutricional / Objetivos">Asesoramiento Nutricional / Objetivos</option>
                      <option value="Envíos al Interior / Seguimiento">Envíos al Interior / Seguimiento</option>
                      <option value="Ventas Mayoristas / Gimnasios">Ventas Mayoristas / Gimnasios</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mensaje o Consulta Detallada *</label>
                    <textarea
                      rows={4}
                      required
                      className="form-textarea"
                      placeholder="Escribinos tus dudas sobre productos, tomas recomendadas o detalles de tu pedido..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="form-submit-row">
                    <button type="submit" className="btn btn-primary btn-lg flex-1">
                      <Send size={16} />
                      <span>Enviar Mensaje</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="btn btn-accent btn-lg"
                      title="Enviar directamente a WhatsApp"
                    >
                      <MessageCircle size={18} />
                      <span>WhatsApp Directo</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-page-wrapper {
          padding-top: 2.5rem;
          padding-bottom: 5rem;
        }
        .contact-hero-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 3rem;
        }
        .contact-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          color: #E11D48;
          margin-bottom: 0.4rem;
        }
        .contact-main-title {
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--color-text-main);
          margin-bottom: 0.75rem;
        }
        .contact-lead {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .contact-highlights-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .contact-highlights-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .highlight-card {
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .highlight-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          background: #FEE2E2;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .highlight-card h3 {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          margin-bottom: 0.25rem;
          color: var(--color-text-main);
        }
        .highlight-card p {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin-bottom: 0.4rem;
        }
        .highlight-badge {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #E11D48;
          background: #FFF1F2;
          padding: 0.15rem 0.45rem;
          border-radius: 2px;
        }
        .contact-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 992px) {
          .contact-content-grid {
            grid-template-columns: 1fr 1.15fr;
          }
        }
        .card-top-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }
        .card-top-title h2 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
        }
        .location-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-bottom: 1.25rem;
        }
        .map-iframe-container {
          overflow: hidden;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          margin-bottom: 1.25rem;
        }
        .location-details-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
        }
        .loc-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        @media (min-width: 480px) {
          .loc-item {
            flex-direction: row;
            gap: 0.5rem;
          }
        }
        .loc-item strong {
          min-width: 90px;
          color: var(--color-text-main);
        }
        .pickup-tips-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .tips-text strong {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-main);
          margin-bottom: 0.2rem;
        }
        .tips-text p {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.4;
          margin: 0;
        }
        .form-subtitle {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
        }
        .styled-contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 540px) {
          .form-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-submit-row {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }
        .form-success-state {
          text-align: center;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
};
