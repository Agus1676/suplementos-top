import React, { useState } from 'react';
import { Save, Check, MapPin, Truck, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="admin-settings-page">
      <div className="page-header">
        <div>
          <h1>Configuración de la Tienda</h1>
          <p className="text-muted">
            Gestioná los datos comerciales, dirección de retiro en <strong>Uriburu 1163</strong>, horarios y canales de contacto.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {savedSuccess && (
          <div className="success-banner">
            <Check size={18} />
            <span>¡Configuración guardada exitosamente!</span>
          </div>
        )}

        {/* Identity & Contact */}
        <div className="card settings-card">
          <div className="card-title-icon">
            <Store size={20} className="text-accent" />
            <h2>Identidad Comercial & Contacto</h2>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Nombre de la Tienda</label>
              <input
                type="text"
                className="form-input"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Oficial (Despachos y Ventas)</label>
              <input
                type="text"
                className="form-input"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email Oficial del Dueño / Notificaciones</label>
              <input
                type="email"
                className="form-input"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram de la Tienda</label>
              <input
                type="text"
                className="form-input"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Logistics & Location */}
        <div className="card settings-card">
          <div className="card-title-icon">
            <MapPin size={20} className="text-accent" />
            <h2>Ubicación, Retiros y Despachos</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Punto de Retiro Presencial</label>
            <input
              type="text"
              className="form-input"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            />
            <span className="field-hint">Ubicación visible para que los clientes retiren sus pedidos sin cargo.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección de Origen de Despachos</label>
            <input
              type="text"
              className="form-input"
              value={formData.dispatchAddress}
              onChange={(e) => setFormData({ ...formData, dispatchAddress: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Horarios de Atención</label>
            <input
              type="text"
              className="form-input"
              value={formData.hoursDescription}
              onChange={(e) => setFormData({ ...formData, hoursDescription: e.target.value })}
            />
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="card settings-card">
          <div className="card-title-icon">
            <Truck size={20} className="text-accent" />
            <h2>Tarifas de Envíos</h2>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Costo Fijo de Envío a Domicilio (Centavos)</label>
              <input
                type="number"
                className="form-input"
                value={formData.flatShippingRateInCents}
                onChange={(e) => setFormData({ ...formData, flatShippingRateInCents: Number(e.target.value) })}
              />
              <span className="field-hint">Equivale a {formatARS(formData.flatShippingRateInCents)}</span>
            </div>

            <div className="form-group">
              <label className="form-label">Monto Mínimo para Envío Gratis (Centavos)</label>
              <input
                type="number"
                className="form-input"
                value={formData.freeShippingThresholdInCents}
                onChange={(e) => setFormData({ ...formData, freeShippingThresholdInCents: Number(e.target.value) })}
              />
              <span className="field-hint">Equivale a {formatARS(formData.freeShippingThresholdInCents)}</span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg save-btn">
          <Save size={18} />
          <span>Guardar Configuración</span>
        </button>
      </form>

      <style>{`
        .admin-settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 860px;
        }
        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.2rem;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .card-title-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .card-title-icon h2 {
          font-size: 1.2rem;
          margin: 0;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .field-hint {
          font-size: 0.775rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
          display: block;
        }
        .save-btn {
          align-self: flex-start;
          min-width: 220px;
        }
        .success-banner {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};
