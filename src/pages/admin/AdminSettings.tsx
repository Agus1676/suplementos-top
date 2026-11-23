import React, { useState } from 'react';
import { 
  Save, 
  Check, 
  MapPin, 
  Truck, 
  Store, 
  CreditCard, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, products, orders, resetToFactoryProducts } = useStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.0-suplementos-top',
      storeName: formData.storeName,
      settings: formData,
      products,
      orders,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suplementos_top_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.settings) {
          setFormData((prev) => ({ ...prev, ...parsed.settings }));
          updateSettings(parsed.settings);
        }
        if (parsed.products && Array.isArray(parsed.products)) {
          localStorage.setItem('st_products_v1', JSON.stringify(parsed.products));
        }
        if (parsed.orders && Array.isArray(parsed.orders)) {
          localStorage.setItem('st_orders_v1', JSON.stringify(parsed.orders));
        }
        setImportMessage({ type: 'success', text: '¡Copia de seguridad restaurada con éxito! Recargando datos...' });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        setImportMessage({ type: 'error', text: 'El archivo de respaldo no es válido o está dañado.' });
      }
    };
    reader.readAsText(file);
  };

  const handleFactoryReset = () => {
    if (window.confirm('¿Seguro que deseás restaurar el catálogo oficial de fábrica? Esto volverá a cargar los 14 suplementos originales (Star, ENA, Optimum, One Fit).')) {
      resetToFactoryProducts();
      setImportMessage({ type: 'success', text: '¡Catálogo original restaurado exitosamente!' });
      setTimeout(() => setImportMessage(null), 3000);
    }
  };

  return (
    <div className="admin-settings-page">
      <div className="page-header">
        <div>
          <h1>Configuración de la Tienda</h1>
          <p className="text-muted">
            Gestioná los datos comerciales de <strong>Suplementos Top</strong>, dirección en el <strong>Gimnasio Top Shape</strong>, WhatsApp oficial y copias de seguridad.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {savedSuccess && (
          <div className="alert-banner alert-success">
            <Check size={18} />
            <span>¡Configuración guardada y actualizada exitosamente!</span>
          </div>
        )}

        {importMessage && (
          <div className={`alert-banner ${importMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {importMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span>{importMessage.text}</span>
          </div>
        )}

        {/* Identity & Contact */}
        <div className="card settings-card">
          <div className="card-title-icon">
            <Store size={20} className="text-accent" />
            <h2>Identidad Comercial &amp; Contacto</h2>
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
              <span className="field-hint">Número oficial del negocio: 11 6565-2990</span>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Email Oficial del Cliente / Notificaciones</label>
              <input
                type="email"
                className="form-input"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
              />
              <span className="field-hint">A este correo se envían los avisos de nuevas compras realizadas en la web.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Oficial</label>
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
            <h2>Punto de Retiro &amp; Horarios (Recoleta)</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Dirección de Retiro Presencial</label>
            <input
              type="text"
              className="form-input"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            />
            <span className="field-hint">Pres. José E. Uriburu 1163 (Gimnasio Top Shape), entre Av. Santa Fe y Arenales — Recoleta, CABA</span>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Horarios de Atención</label>
              <input
                type="text"
                className="form-input"
                value={formData.hoursDescription}
                onChange={(e) => setFormData({ ...formData, hoursDescription: e.target.value })}
              />
              <span className="field-hint">Lunes a Viernes de 8:00 a 23:00 hs | Sábados de 10:00 a 18:00 hs</span>
            </div>

            <div className="form-group">
              <label className="form-label">Dirección de Despacho de Envíos</label>
              <input
                type="text"
                className="form-input"
                value={formData.dispatchAddress}
                onChange={(e) => setFormData({ ...formData, dispatchAddress: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="card settings-card">
          <div className="card-title-icon">
            <Truck size={20} className="text-accent" />
            <h2>Tarifas de Logística &amp; Envíos</h2>
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

        {/* Payment & Banking */}
        <div className="card settings-card">
          <div className="card-title-icon">
            <CreditCard size={20} className="text-accent" />
            <h2>Cobros, Mercado Pago &amp; Transferencias</h2>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Descuento por Transferencia Bancaria (%)</label>
              <input
                type="number"
                className="form-input"
                value={formData.transferDiscountPercent}
                onChange={(e) => setFormData({ ...formData, transferDiscountPercent: Number(e.target.value) })}
              />
              <span className="field-hint">Actualmente configurado al 10% OFF</span>
            </div>

            <div className="form-group">
              <label className="form-label">Alias para Transferencias</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankAlias || 'Suplementos.top'}
                onChange={(e) => setFormData({ ...formData, bankAlias: e.target.value })}
              />
              <span className="field-hint">Alias de la cuenta para recibir transferencias</span>
            </div>

            <div className="form-group">
              <label className="form-label">CVU / CBU para Transferencias</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankCvu || '0000076500000020117357'}
                onChange={(e) => setFormData({ ...formData, bankCvu: e.target.value })}
              />
              <span className="field-hint">CVU / CBU de 22 dígitos</span>
            </div>

            <div className="form-group">
              <label className="form-label">Titular de la Cuenta</label>
              <input
                type="text"
                className="form-input"
                value={formData.bankHolder || 'Camila Cettour'}
                onChange={(e) => setFormData({ ...formData, bankHolder: e.target.value })}
              />
              <span className="field-hint">Nombre que verá el cliente al transferir</span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-black-primary">
          <Save size={18} />
          <span>Guardar Configuración General</span>
        </button>
      </form>

      {/* Backup & Catalog Recovery (Jokers UI Engine feature) */}
      <div className="card settings-card backup-section">
        <div className="card-title-icon">
          <ShieldCheck size={20} className="text-accent" />
          <h2>Copias de Seguridad &amp; Restauración</h2>
        </div>
        <p className="text-muted" style={{ margin: 0, fontSize: '0.88rem' }}>
          Descargá una copia íntegra en formato JSON de tus productos, variantes, pedidos y configuraciones, o restaurá el estado de la tienda en 1 clic.
        </p>

        <div className="backup-actions-grid">
          <button type="button" onClick={handleExportBackup} className="btn-secondary-action">
            <Download size={16} />
            <span>Descargar Copia JSON</span>
          </button>

          <label className="btn-secondary-action" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={16} />
            <span>Restaurar Copia JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              style={{ display: 'none' }}
            />
          </label>

          <button type="button" onClick={handleFactoryReset} className="btn-secondary-action btn-danger-action">
            <RotateCcw size={16} />
            <span>Restablecer Catálogo Original (14 items)</span>
          </button>
        </div>
      </div>

      <style>{`
        .admin-settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 920px;
        }
        .page-header h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin: 0 0 4px 0;
        }
        .settings-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .card-title-icon {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
        }
        .card-title-icon h2 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
        }
        .form-input {
          height: 42px;
          padding: 0 12px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .form-input:focus {
          border-color: #0F172A;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
        }
        .field-hint {
          font-size: 0.76rem;
          color: #64748B;
        }
        .btn-black-primary {
          height: 44px;
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 24px;
          align-self: flex-start;
          transition: background 0.15s ease;
        }
        .btn-black-primary:hover {
          background: #1E293B;
        }
        .alert-banner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .alert-success {
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          color: #166534;
        }
        .alert-error {
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          color: #991B1B;
        }
        .backup-section {
          margin-top: 0.5rem;
        }
        .backup-actions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 6px;
        }
        .btn-secondary-action {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #334155;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-secondary-action:hover {
          background: #F1F5F9;
          color: #0F172A;
          border-color: #94A3B8;
        }
        .btn-danger-action:hover {
          background: #FEE2E2;
          border-color: #FCA5A5;
          color: #B91C1C;
        }
      `}</style>
    </div>
  );
};
export default AdminSettings;
