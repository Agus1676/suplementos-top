import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Phone, 
  Send
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, buildWhatsAppDispatchLink, formatDate } from '../../lib/utils';

export const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orders, settings } = useStore();
  const orderNumber = searchParams.get('orden');

  const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

  if (!order) {
    return (
      <div className="container not-found-wrap">
        <h2>Pedido no encontrado</h2>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    );
  }

  // Preparamos texto para WhatsApp al dueño
  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.productName} (${item.variantTitle}) - ${formatARS(item.totalPriceInCents)}`)
    .join('\n');

  const addressText = order.shippingAddress 
    ? `${order.shippingAddress.street} ${order.shippingAddress.number}${order.shippingAddress.apartment ? ` (${order.shippingAddress.apartment})` : ''}, ${order.shippingAddress.neighborhood ? `${order.shippingAddress.neighborhood}, ` : ''}${order.shippingAddress.city}, ${order.shippingAddress.province} (CP: ${order.shippingAddress.postalCode})`
    : 'Retiro en sucursal Uriburu 1163';

  const waDispatchLink = buildWhatsAppDispatchLink({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    customerDni: order.customerDni,
    deliveryMethod: order.deliveryMethod,
    addressText,
    itemsText,
    totalText: formatARS(order.totalInCents),
    paymentStatus: order.paymentStatus,
  });

  return (
    <div className="container payment-result-page">
      <div className="card result-card">
        <div className="result-header">
          <div className="success-icon-wrap">
            <CheckCircle2 size={54} className="text-success" />
          </div>
          <span className="badge badge-success">Pago Acreditado con Éxito</span>
          <h1 className="result-title">¡Gracias por tu compra, {order.customerName.split(' ')[0]}!</h1>
          <p className="order-num-text">
            Número de Pedido: <strong>#{order.orderNumber}</strong> • {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Priority Dispatch Notification Alert for Owner */}
        <div className="dispatch-alert-banner">
          <div className="alert-badge">
            <Send size={16} />
            <span>ALERTA DE DESPACHO INMEDIATO</span>
          </div>
          <h3 className="dispatch-title">Notificación directa para armar el paquete</h3>
          <p className="dispatch-desc">
            Al dueño se le envía una notificación por correo a <strong>{settings.supportEmail}</strong>. 
            También podés enviar el comprobante directamente al WhatsApp del local para agilizar el retiro o entrega:
          </p>
          <a
            href={waDispatchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent btn-lg wa-dispatch-btn"
          >
            <Phone size={18} />
            <span>Enviar Datos de Despacho al WhatsApp (11 6565 1990)</span>
          </a>
        </div>

        {/* Delivery / Pickup Status Box */}
        <div className="delivery-status-box">
          {order.deliveryMethod === 'pickup' ? (
            <div className="status-flex">
              <MapPin size={24} className="text-accent flex-shrink-0" />
              <div>
                <h4>Modalidad: Retiro en Sucursal Recoleta</h4>
                <p>
                  <strong>Punto de entrega:</strong> {settings.pickupAddress}
                </p>
                <p className="text-muted text-xs">
                  Horarios: {settings.hoursDescription}. Podés acercarte presentando tu DNI ({order.customerDni}).
                </p>
              </div>
            </div>
          ) : (
            <div className="status-flex">
              <Truck size={24} className="text-accent flex-shrink-0" />
              <div>
                <h4>Modalidad: Envío a Domicilio</h4>
                <p>
                  <strong>Destino:</strong> {addressText}
                </p>
                <p className="text-muted text-xs">
                  El pedido será embalado con máxima protección y despachado desde nuestro centro en Uriburu 1163.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Breakdown */}
        <div className="order-items-breakdown">
          <h3>Detalle de Suplementos Comprados</h3>
          <div className="items-table">
            {order.items.map((item) => (
              <div key={item.id} className="item-row">
                <div className="item-main">
                  <strong>{item.productName}</strong>
                  <span className="text-xs text-muted">{item.variantTitle}</span>
                </div>
                <div className="item-qty">x{item.quantity}</div>
                <div className="item-price">{formatARS(item.totalPriceInCents)}</div>
              </div>
            ))}
          </div>

          <div className="order-totals-summary">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>{formatARS(order.subtotalInCents)}</span>
            </div>
            <div className="total-line">
              <span>Envío:</span>
              <span>
                {order.shippingFeeInCents === 0 ? 'GRATIS' : formatARS(order.shippingFeeInCents)}
              </span>
            </div>
            <div className="total-line grand-total">
              <span>Total Abonado:</span>
              <span>{formatARS(order.totalInCents)}</span>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="result-actions-row">
          <Link to={`/seguimiento?orden=${order.orderNumber}`} className="btn btn-secondary">
            Ver Seguimiento del Pedido
          </Link>
          <Link to="/catalogo" className="btn btn-primary">
            Seguir Comprando
          </Link>
        </div>
      </div>

      <style>{`
        .payment-result-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
          max-width: 760px;
        }
        .result-card {
          padding: 2.5rem;
        }
        .result-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--color-border);
        }
        .success-icon-wrap {
          background: #ECFDF5;
          padding: 1rem;
          border-radius: 50%;
        }
        .result-title {
          font-size: 2rem;
          margin-top: 0.25rem;
        }
        .order-num-text {
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
        .dispatch-alert-banner {
          background: #FFFBEB;
          border: 1.5px solid #FCD34D;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .alert-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: #B45309;
          letter-spacing: 0.05em;
        }
        .dispatch-title {
          font-size: 1.15rem;
          color: #92400E;
          margin: 0;
        }
        .dispatch-desc {
          font-size: 0.875rem;
          color: #78350F;
          line-height: 1.5;
        }
        .wa-dispatch-btn {
          margin-top: 0.75rem;
          align-self: flex-start;
          background: #25D366;
          color: #FFFFFF;
          box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.25);
        }
        .wa-dispatch-btn:hover {
          background: #20BA5A;
        }
        .delivery-status-box {
          background: var(--color-bg-muted);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .status-flex {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .status-flex h4 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
        .status-flex p {
          font-size: 0.875rem;
        }
        .order-items-breakdown {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .order-items-breakdown h3 {
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }
        .items-table {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }
        .item-main {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .item-qty {
          width: 50px;
          text-align: center;
          color: var(--color-text-muted);
        }
        .item-price {
          font-weight: 700;
          color: var(--color-primary);
        }
        .order-totals-summary {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.875rem;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          color: var(--color-text-muted);
        }
        .grand-total {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-primary);
          border-top: 1px solid var(--color-border);
          padding-top: 0.5rem;
          margin-top: 0.25rem;
        }
        .result-actions-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
