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
        <h1 className="tracking-title">Seguimiento de Pedido</h1>
        <p className="tracking-subtitle">
          Consultá el estado en tiempo real de tu compra ingresando tu número de pedido (ej: ST-2026-1001) o tu DNI.
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
            Rastrear
          </button>
        </form>
      </div>

      {hasSearched && !foundOrder && (
        <div className="card not-found-alert">
          <AlertCircle size={32} className="text-warning" />
          <h3>No encontramos ningún pedido con ese identificador</h3>
          <p>
            Revisá si el número coincide con el comprobante que recibiste por email. Si tenés dudas, podés contactarnos directamente por WhatsApp al <strong>11 6565 1990</strong>.
          </p>
        </div>
      )}

      {foundOrder && (
        <div className="card tracking-result-card">
          <div className="result-top-info">
            <div>
              <span className="order-badge">Pedido #{foundOrder.orderNumber}</span>
              <p className="text-xs text-muted mt-1">Realizado el {formatDate(foundOrder.createdAt)}</p>
            </div>
            <div className="status-pill-wrap">
              <span className="status-pill status-approved">
                Pago Acreditado
              </span>
              <span className="status-pill status-logistic">
                {foundOrder.fulfillmentStatus === 'preparing' && 'Preparando en local'}
                {foundOrder.fulfillmentStatus === 'ready_for_pickup' && 'Listo para Retiro en Recoleta'}
                {foundOrder.fulfillmentStatus === 'shipped' && 'Despachado en Camino'}
                {foundOrder.fulfillmentStatus === 'delivered' && 'Entregado'}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-wrap">
            <div className="timeline-step completed">
              <div className="step-circle"><CheckCircle size={18} /></div>
              <span className="step-title">1. Pago Aprobado</span>
              <span className="step-desc">Mercado Pago confirmó la operación</span>
            </div>

            <div className={`timeline-step ${getStepStatus(1, foundOrder.fulfillmentStatus)}`}>
              <div className="step-circle"><Package size={18} /></div>
              <span className="step-title">2. Preparando</span>
              <span className="step-desc">Armado en Uriburu 1163, CABA</span>
            </div>

            <div className={`timeline-step ${getStepStatus(foundOrder.deliveryMethod === 'pickup' ? 2 : 3, foundOrder.fulfillmentStatus)}`}>
              <div className="step-circle">
                {foundOrder.deliveryMethod === 'pickup' ? <MapPin size={18} /> : <Truck size={18} />}
              </div>
              <span className="step-title">
                {foundOrder.deliveryMethod === 'pickup' ? '3. Listo para Retirar' : '3. Despachado'}
              </span>
              <span className="step-desc">
                {foundOrder.deliveryMethod === 'pickup' ? 'En sucursal Recoleta' : (foundOrder.trackingNumber ? `Guía: ${foundOrder.trackingNumber}` : 'En tránsito prioritario')}
              </span>
            </div>

            <div className={`timeline-step ${getStepStatus(4, foundOrder.fulfillmentStatus)}`}>
              <div className="step-circle"><CheckCircle size={18} /></div>
              <span className="step-title">4. Entregado</span>
              <span className="step-desc">Paquete recibido</span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="order-details-grid">
            <div className="details-col">
              <h4>Datos del Destinatario</h4>
              <p><strong>Nombre:</strong> {foundOrder.customerName}</p>
              <p><strong>DNI:</strong> {foundOrder.customerDni}</p>
              <p><strong>Teléfono:</strong> {foundOrder.customerPhone}</p>
              <p><strong>Email:</strong> {foundOrder.customerEmail}</p>
            </div>

            <div className="details-col">
              <h4>Modalidad de Entrega</h4>
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
              <h4>Artículos ({foundOrder.items.length})</h4>
              <ul className="tracking-items-list">
                {foundOrder.items.map((i) => (
                  <li key={i.id}>
                    {i.quantity}x {i.productName} ({i.variantTitle})
                  </li>
                ))}
              </ul>
              <div className="tracking-total mt-2">
                <strong>Total: {formatARS(foundOrder.totalInCents)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .tracking-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
          max-width: 860px;
        }
        .tracking-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .tracking-title {
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
        }
        .tracking-subtitle {
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto 1.5rem;
          font-size: 0.95rem;
        }
        .tracking-search-form {
          position: relative;
          display: flex;
          max-width: 520px;
          margin: 0 auto;
          gap: 0.5rem;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-subtle);
        }
        .tracking-input {
          flex: 1;
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
        }
        .not-found-alert {
          text-align: center;
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .tracking-result-card {
          padding: 2rem;
        }
        .result-top-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1.25rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .order-badge {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.35rem;
          color: var(--color-primary);
        }
        .status-pill-wrap {
          display: flex;
          gap: 0.5rem;
        }
        .status-pill {
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.775rem;
          font-weight: 700;
        }
        .status-approved {
          background: #ECFDF5;
          color: #065F46;
        }
        .status-logistic {
          background: #EFF6FF;
          color: #1E40AF;
        }
        .timeline-wrap {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          background: var(--color-bg-muted);
          padding: 1.5rem;
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
          opacity: 0.45;
        }
        .timeline-step.completed {
          opacity: 1;
          color: var(--color-success);
        }
        .timeline-step.current {
          opacity: 1;
          color: var(--color-accent-hover);
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
          margin-bottom: 0.35rem;
        }
        .step-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .step-desc {
          font-size: 0.725rem;
          color: var(--color-text-muted);
        }
        .order-details-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          border-top: 1px solid var(--color-border);
          padding-top: 1.5rem;
        }
        @media (min-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        .details-col h4 {
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          color: var(--color-primary);
        }
        .details-col p {
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .tracking-items-list {
          font-size: 0.825rem;
          line-height: 1.4;
        }
        .tracking-total {
          font-size: 0.95rem;
          color: var(--color-primary);
        }
      `}</style>
    </div>
  );
};
