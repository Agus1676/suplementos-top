import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, CheckCircle, Truck, MapPin, AlertCircle } from 'lucide-react';
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

  const getStepStatus = (stepIndex: number, currentStatus: Order['fulfillmentStatus']) => {
    const orderOfSteps = ['unfulfilled', 'preparing', 'ready_for_pickup', 'shipped', 'delivered'];
    const currentIndex = orderOfSteps.indexOf(currentStatus);
    
    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'upcoming';
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
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Número de pedido (ST-...) o DNI"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="tracking-input"
          />
          <button type="submit" className="btn btn-primary">
            RASTREAR
          </button>
        </form>
      </div>

      {hasSearched && !foundOrder && (
        <div className="card not-found-alert">
          <AlertCircle size={36} className="text-gold" />
          <h3>NO ENCONTRAMOS NINGÚN PEDIDO CON ESE IDENTIFICADOR</h3>
          <p>
            Revisá si el número coincide con el comprobante que recibiste por email. Si tenés dudas, podés contactarnos directamente por WhatsApp al <strong>11 6565 1990</strong>.
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

          {/* Timeline */}
          <div className="timeline-wrap">
            <div className="timeline-step completed">
              <div className="step-circle"><CheckCircle size={20} /></div>
              <span className="step-title">1. PAGO APROBADO</span>
              <span className="step-desc">Mercado Pago confirmó la operación</span>
            </div>

            <div className={`timeline-step ${getStepStatus(1, foundOrder.fulfillmentStatus)}`}>
              <div className="step-circle"><Package size={20} /></div>
              <span className="step-title">2. PREPARANDO</span>
              <span className="step-desc">Armado en Uriburu 1163, CABA</span>
            </div>

            <div className={`timeline-step ${getStepStatus(foundOrder.deliveryMethod === 'pickup' ? 2 : 3, foundOrder.fulfillmentStatus)}`}>
              <div className="step-circle">
                {foundOrder.deliveryMethod === 'pickup' ? <MapPin size={20} /> : <Truck size={20} />}
              </div>
              <span className="step-title">
                {foundOrder.deliveryMethod === 'pickup' ? '3. LISTO RETIRO' : '3. DESPACHADO'}
              </span>
              <span className="step-desc">
                {foundOrder.deliveryMethod === 'pickup' ? 'En sucursal Recoleta' : (foundOrder.trackingNumber ? `Guía: ${foundOrder.trackingNumber}` : 'En tránsito express')}
              </span>
            </div>

            <div className={`timeline-step ${getStepStatus(4, foundOrder.fulfillmentStatus)}`}>
              <div className="step-circle"><CheckCircle size={20} /></div>
              <span className="step-title">4. ENTREGADO</span>
              <span className="step-desc">Paquete recibido</span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="order-details-grid">
            <div className="details-col">
              <h4>DATOS DEL DESTINATARIO</h4>
              <p><strong>Nombre:</strong> {foundOrder.customerName}</p>
              <p><strong>DNI:</strong> {foundOrder.customerDni}</p>
              <p><strong>Teléfono:</strong> {foundOrder.customerPhone}</p>
              <p><strong>Email:</strong> {foundOrder.customerEmail}</p>
            </div>

            <div className="details-col">
              <h4>MODALIDAD DE ENTREGA</h4>
              {foundOrder.deliveryMethod === 'pickup' ? (
                <div>
                  <p><strong>Punto de Retiro:</strong></p>
                  <p>{settings.pickupAddress}</p>
                  <p className="text-xs text-muted mt-1">Horarios: {settings.hoursDescription}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Dirección:</strong></p>
                  <p>{foundOrder.shippingAddress?.street} {foundOrder.shippingAddress?.number} {foundOrder.shippingAddress?.apartment}</p>
                  <p>{foundOrder.shippingAddress?.city}, {foundOrder.shippingAddress?.province} (CP: {foundOrder.shippingAddress?.postalCode})</p>
                  {foundOrder.shippingAddress?.deliveryNotes && (
                    <p className="text-xs text-muted mt-1"><em>Notas: {foundOrder.shippingAddress.deliveryNotes}</em></p>
                  )}
                </div>
              )}
            </div>

            <div className="details-col">
              <h4>ARTÍCULOS ({foundOrder.items.length})</h4>
              <ul className="tracking-items-list">
                {foundOrder.items.map((i) => (
                  <li key={i.id}>
                    {i.quantity}x {i.productName} ({i.variantTitle})
                  </li>
                ))}
              </ul>
              <div className="tracking-total mt-2">
                <strong>TOTAL: <span className="text-gold">{formatARS(foundOrder.totalInCents)}</span></strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tracking-page {
          padding-top: 2.5rem;
          padding-bottom: 5rem;
          max-width: 880px;
        }
        .tracking-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-eyebrow {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.2rem;
        }
        .tracking-title {
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
        }
        .tracking-subtitle {
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto 2rem;
          font-size: 1rem;
        }
        .tracking-search-form {
          position: relative;
          display: flex;
          max-width: 540px;
          margin: 0 auto;
          gap: 0.5rem;
        }
        .search-icon {
          position: absolute;
          left: 1.15rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-accent);
        }
        .tracking-input {
          flex: 1;
          padding: 0.85rem 1rem 0.85rem 3rem;
          background: #121724;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: #FFF;
          font-size: 0.95rem;
        }
        .tracking-input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        .not-found-alert {
          text-align: center;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }
        .not-found-alert h3 {
          font-size: 1.4rem;
        }
        .tracking-result-card {
          padding: 2.5rem;
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
          font-size: 1.6rem;
          color: var(--color-accent);
          letter-spacing: 0.04em;
        }
        .status-pill-wrap {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .status-pill {
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .status-approved {
          background: rgba(16, 185, 129, 0.15);
          color: #34D399;
          border: 1px solid rgba(16, 185, 129, 0.35);
        }
        .status-logistic {
          background: rgba(229, 184, 105, 0.15);
          color: var(--color-accent);
          border: 1px solid var(--color-border-gold);
        }
        .timeline-wrap {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          background: #0B0E16;
          border: 1px solid var(--color-border);
          padding: 2rem;
          border-radius: var(--radius-md);
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
          gap: 0.35rem;
          opacity: 0.4;
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
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #121724;
          border: 2px solid currentColor;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .step-title {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          color: #FFF;
          letter-spacing: 0.04em;
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
          font-size: 1.05rem;
          margin-bottom: 0.85rem;
          color: var(--color-accent);
        }
        .details-col p {
          font-size: 0.85rem;
          line-height: 1.6;
        }
        .tracking-items-list {
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .tracking-total {
          font-family: var(--font-display);
          font-size: 1.15rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};
