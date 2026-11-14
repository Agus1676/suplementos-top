import React, { useState } from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Send, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container contact-page">
      <div className="contact-header">
        <h1 className="contact-title">Contacto & Asesoramiento</h1>
        <p className="contact-subtitle">
          Estamos a tu disposición para ayudarte con tu plan de suplementación deportiva, consultas de stock o retiros en nuestro local.
        </p>
      </div>

      <div className="contact-grid">
        {/* Info Column */}
        <div className="contact-info-col">
          <div className="card contact-info-card">
            <h2>Nuestra Sede en Recoleta</h2>
            
            <div className="info-list">
              <div className="info-block">
                <MapPin size={22} className="text-accent" />
                <div>
                  <strong>Dirección de Retiro y Despacho</strong>
                  <p>{settings.pickupAddress}</p>
                  <a
                    href="https://maps.google.com/?q=Uriburu+1163,+CABA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>

              <div className="info-block">
                <Clock size={22} className="text-accent" />
                <div>
                  <strong>Horarios de Atención</strong>
                  <p>Lunes a Viernes: 8:00 a 23:00 hs</p>
                  <p>Sábados: 10:00 a 18:00 hs</p>
                  <p className="text-xs text-muted mt-1">Domingos y feriados cerrado para retiros presenciales.</p>
                </div>
              </div>

              <div className="info-block">
                <Phone size={22} className="text-accent" />
                <div>
                  <strong>WhatsApp Oficial</strong>
                  <p>{settings.supportPhone}</p>
                  <a
                    href="https://wa.me/5491165651990"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm mt-2"
                  >
                    Abrir Chat de WhatsApp
                  </a>
                </div>
              </div>

              <div className="info-block">
                <Mail size={22} className="text-accent" />
                <div>
                  <strong>Email Directo</strong>
                  <p><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a></p>
                </div>
              </div>

              <div className="info-block">
                <Instagram size={22} className="text-accent" />
                <div>
                  <strong>Instagram Oficial</strong>
                  <p><a href={settings.instagram} target="_blank" rel="noopener noreferrer">@suplementos_topp</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="contact-form-col">
          <div className="card form-card">
            <h2>Dejanos tu Consulta</h2>
            {submitted ? (
              <div className="form-success-box">
                <CheckCircle size={40} className="text-success" />
                <h3>¡Mensaje Recibido!</h3>
                <p>Nos pondremos en contacto a la brevedad por correo o WhatsApp.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary btn-sm mt-3">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label className="form-label">Nombre y Apellido *</label>
                  <input type="text" required className="form-input" placeholder="Tu nombre" />
                </div>

                <div className="form-group">
                  <label className="form-label">Email de contacto *</label>
                  <input type="email" required className="form-input" placeholder="tuemail@ejemplo.com" />
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono o WhatsApp *</label>
                  <input type="tel" required className="form-input" placeholder="11 2345 6789" />
                </div>

                <div className="form-group">
                  <label className="form-label">Mensaje o Consulta *</label>
                  <textarea rows={4} required className="form-textarea" placeholder="Escribí aquí tu consulta..." />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  <Send size={18} />
                  <span>Enviar Mensaje</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
        }
        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .contact-title {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        .contact-subtitle {
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .contact-info-card, .form-card {
          padding: 2rem;
        }
        .contact-info-card h2, .form-card h2 {
          font-size: 1.4rem;
          margin-bottom: 1.5rem;
        }
        .info-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .info-block {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .info-block strong {
          color: var(--color-primary);
          display: block;
          margin-bottom: 0.2rem;
        }
        .info-block p {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }
        .map-link {
          color: var(--color-accent-hover);
          font-weight: 700;
          font-size: 0.85rem;
          display: inline-block;
          margin-top: 0.25rem;
        }
        .form-success-box {
          text-align: center;
          padding: 3rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
};
