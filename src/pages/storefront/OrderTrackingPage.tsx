import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, AlertCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatDate } from '../../lib/utils';
import { Order } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orders, settings } = useStore();
  const initialQuery = searchParams.get('orden') || '';
  const [query, setQuery] = useState(initialQuery);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, orders]);

  const handleSearch = (searchVal: string) => {
    const term = searchVal.trim().toUpperCase();
    if (!term) return;

    const matched = orders.find(
      (o) => o.orderNumber.toUpperCase() === term || o.customerDni.includes(term) || o.customerEmail.toLowerCase() === term.toLowerCase()
    );

    setFoundOrder(matched || null);
    setHasSearched(true);
  };

  return (
    <div className="container tracking-page">
      <div className="tracking-header">
        <span className="section-eyebrow">ESTADO EN TIEMPO REAL</span>
        <h1 className="tracking-title">SEGUIMIENTO DE PEDIDO</h1>
        <p className="tracking-subtitle">
          Consultá el estado de tu compra ingresando tu número de pedido (ej: ST-2026-1001) o tu DNI.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="tracking-search-form"
        >
          <div className="tracking-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Número de pedido (ST-...) o DNI"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="tracking-input"
              autoComplete="off"
            />
          </div>
          <button type="submit" className="btn btn-primary tracking-search-btn">
            BUSCAR PEDIDO
          </button>
        </form>
      </div>

      {hasSearched && !foundOrder && (
        <div className="card not-found-alert">
          <AlertCircle size={36} className="text-primary" />
          <h3>No encontramos ningún pedido con ese identificador</h3>
          <p>
            Revisá si el número coincide con el comprobante que recibiste por email. Si tenés dudas, podés contactarnos directamente por WhatsApp al <strong>11 6565-2990</strong>.
          </p>
        </div>
      )}

      {foundOrder && (
        <div className="card tracking-result-card">
          <div className="result-top-info">
            <div>
              <span className="order-badge">PEDIDO #{foundOrder.orderNumber}</span>
              <p className="text-xs text-muted mt-1">Realizado el {formatDate(foundOrder.createdAt)}</p>
            </div>
            <div className="status-pill-wrap">
              <span className="status-pill status-approved">
                PAGO ACREDITADO (MP)
              </span>
              <span className="status-pill status-logistic">
                {foundOrder.fulfillmentStatus === 'preparing' && 'PREPARANDO EN RECOLETA'}
                {foundOrder.fulfillmentStatus === 'ready_for_pickup' && 'LISTO PARA RETIRO EN LOCAL'}
                {foundOrder.fulfillmentStatus === 'shipped' && 'DESPACHADO EN CAMINO'}
                {foundOrder.fulfillmentStatus === 'delivered' && 'ENTREGADO'}
              </span>
            </div>
          </div>

          {/* Timeline steps */}
          <div className="timeline-wrap">
            <div className={`timeline-step ${['preparing', 'ready_for_pickup', 'shipped', 'delivered'].includes(foundOrder.fulfillmentStatus) ? 'completed' : 'current'}`}>
              <div className="step-circle">1</div>
              <span className="step-title">Pago Aprobado</span>
              <span className="step-desc">Mercado Pago OK</span>
            </div>

            <div className={`timeline-step ${['ready_for_pickup', 'shipped', 'delivered'].includes(foundOrder.fulfillmentStatus) ? 'completed' : foundOrder.fulfillmentStatus === 'preparing' ? 'current' : ''}`}>
              <div className="step-circle">2</div>
              <span className="step-title">Preparación</span>
              <span className="step-desc">Control y embalaje</span>
            </div>

            <div className={`timeline-step ${['shipped', 'delivered'].includes(foundOrder.fulfillmentStatus) ? 'completed' : foundOrder.fulfillmentStatus === 'ready_for_pickup' ? 'current' : ''}`}>
              <div className="step-circle">3</div>
              <span className="step-title">{foundOrder.deliveryMethod === 'pickup' ? 'Listo en Local' : 'Despachado'}</span>
              <span className="step-desc">{foundOrder.deliveryMethod === 'pickup' ? 'Uriburu 1163' : 'En transporte'}</span>
            </div>

            <div className={`timeline-step ${foundOrder.fulfillmentStatus === 'delivered' ? 'completed' : ''}`}>
              <div className="step-circle">4</div>
              <span className="step-title">Entregado</span>
              <span className="step-desc">En manos del cliente</span>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="order-details-grid">
            <div className="details-col">
              <h4>Datos del Destinatario</h4>
              <p><strong>{foundOrder.customerName}</strong></p>
              <p>DNI: {foundOrder.customerDni}</p>
              <p>Tel: {foundOrder.customerPhone}</p>
              <p>Email: {foundOrder.customerEmail}</p>
            </div>

            <div className="details-col">
              <h4>Entrega</h4>
              {foundOrder.deliveryMethod === 'pickup' ? (
                <>
                  <p><strong>Retiro en Sucursal Recoleta</strong></p>
                  <p>{settings.pickupAddress}</p>
                  <p className="text-muted text-xs mt-1">{settings.hoursDescription}</p>
                </>
              ) : (
                <>
                  <p><strong>Envío a Domicilio</strong></p>
                  <p>{foundOrder.shippingAddress?.street} {foundOrder.shippingAddress?.number}</p>
                  <p>{foundOrder.shippingAddress?.city}, {foundOrder.shippingAddress?.province} (CP: {foundOrder.shippingAddress?.postalCode})</p>
                </>
              )}
            </div>

            <div className="details-col">
              <h4>Productos</h4>
              <div className="tracking-items-list">
                {foundOrder.items.map((item) => (
                  <div key={item.id}>
                    {item.quantity}x {item.productName} ({item.variantTitle})
                  </div>
                ))}
              </div>
              <div className="tracking-total">
                <strong>TOTAL: <span>{formatARS(foundOrder.totalInCents)}</span></strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tracking-page {
          padding-top: 2.5rem;
          padding-bottom: 5rem;
          max-width: 860px;
          margin-left: auto !important;
          margin-right: auto !important;
          width: 100%;
          box-sizing: border-box;
        }
        .section-eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.25rem;
          text-align: center;
        }
        .tracking-header {
          text-align: center;
          margin-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }
        .tracking-title {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
          text-align: center;
        }
        .tracking-subtitle {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          max-width: 580px;
          margin: 0 auto 1.5rem;
          text-align: center;
        }
        .tracking-search-form {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 540px;
          margin: 0 auto;
          gap: 0.65rem;
          box-sizing: border-box;
        }
        .tracking-input-wrapper {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .tracking-input {
          width: 100%;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.75rem 1rem 0.75rem 2.6rem;
          font-size: 0.95rem;
          color: var(--color-text);
          box-sizing: border-box;
        }
        .tracking-input:focus {
          border-color: var(--color-text);
          outline: none;
        }
        .tracking-search-btn {
          white-space: nowrap;
          padding: 0.75rem 1.4rem;
        }
        @media (max-width: 560px) {
          .tracking-title {
            font-size: 1.7rem;
          }
          .tracking-search-form {
            flex-direction: column;
            gap: 0.6rem;
            width: 100%;
          }
          .tracking-search-btn {
            width: 100%;
          }
        }
        .not-found-alert {
          text-align: center;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
        }
        .not-found-alert h3 {
          font-size: 1.25rem;
          font-weight: 800;
        }
        .tracking-result-card {
          padding: 2.25rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .result-top-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .order-badge {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.4rem;
          color: var(--color-text);
          letter-spacing: -0.01em;
        }
        .status-pill-wrap {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .status-pill {
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
        .status-approved {
          background: #ECFDF5;
          color: #065F46;
          border: 1px solid #A7F3D0;
        }
        .status-logistic {
          background: #FEF2F2;
          color: var(--color-accent);
          border: 1px solid #FECACA;
        }
        .timeline-wrap {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          background: #F9FAFB;
          border: 1px solid var(--color-border);
          padding: 1.75rem;
          border-radius: var(--radius-sm);
        }
        @media (min-width: 640px) {
          .timeline-wrap {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.25rem;
          opacity: 0.45;
        }
        .timeline-step.completed {
          opacity: 1;
          color: var(--color-success);
        }
        .timeline-step.current {
          opacity: 1;
          color: var(--color-accent);
        }
        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }
        .step-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--color-text);
        }
        .step-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          border-top: 1px solid var(--color-border);
          padding-top: 1.75rem;
        }
        @media (min-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        .details-col h4 {
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: var(--color-text);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .details-col p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }
        .details-col p strong {
          color: var(--color-text);
        }
        .tracking-items-list {
          font-size: 0.85rem;
          line-height: 1.5;
          color: var(--color-text-muted);
        }
        .tracking-total {
          font-size: 1.1rem;
          font-weight: 800;
          margin-top: 0.65rem;
          color: var(--color-text);
        }
      `}</style>
    </div>
  );
};
