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
        <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
      </div>
    );
  }

  const itemsText = order.items
    .map((item) => `• ${item.quantity}x ${item.productName} (${item.variantTitle}) - ${formatARS(item.totalPriceInCents)}`)
    .join('\n');

  const addressText = order.shippingAddress 
    ? `${order.shippingAddress.street} ${order.shippingAddress.number}${order.shippingAddress.apartment ? ` (${order.shippingAddress.apartment})` : ''}, ${order.shippingAddress.neighborhood ? `${order.shippingAddress.neighborhood}, ` : ''}${order.shippingAddress.city}, ${order.shippingAddress.province} (CP: ${order.shippingAddress.postalCode})`
    : `Retiro en sucursal ${settings.pickupAddress}`;

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
            <CheckCircle2 size={50} className="text-success" />
          </div>
          <span className="badge badge-success">PAGO ACREDITADO CON ÉXITO</span>
          <h1 className="result-title">¡GRACIAS POR TU COMPRA, {order.customerName.split(' ')[0].toUpperCase()}!</h1>
          <p className="order-num-text">
            NÚMERO DE PEDIDO: <strong>#{order.orderNumber}</strong> • {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Priority Dispatch Notification Alert for Owner */}
        <div className="dispatch-alert-banner">
          <div className="alert-badge">
            <Send size={15} />
            <span>ALERTA DE DESPACHO INMEDIATO</span>
          </div>
          <h3 className="dispatch-title">Notificación para preparar el paquete</h3>
          <p className="dispatch-desc">
            Se envió un correo automático con todos los datos a <strong>{settings.supportEmail}</strong>. 
            También podés enviar el comprobante directamente al WhatsApp del local para agilizar el retiro o entrega:
          </p>
          <a
            href={waDispatchLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-lg wa-dispatch-btn"
          >
            <Phone size={18} />
            <span>ENVIAR DATOS DE DESPACHO AL WHATSAPP (11 6565 1990)</span>
          </a>
        </div>

        {/* Delivery / Pickup Status Box */}
        <div className="delivery-status-box">
          {order.deliveryMethod === 'pickup' ? (
            <div className="status-flex">
              <MapPin size={24} className="text-primary flex-shrink-0" />
              <div>
                <h4>MODALIDAD: RETIRO EN SUCURSAL RECOLETA</h4>
                <p>
                  <strong>Punto de entrega:</strong> {settings.pickupAddress}
                </p>
                <p className="text-muted text-xs mt-1">
                  Horarios: {settings.hoursDescription}. Podés acercarte presentando tu DNI ({order.customerDni}).
                </p>
              </div>
            </div>
          ) : (
            <div className="status-flex">
              <Truck size={24} className="text-primary flex-shrink-0" />
              <div>
                <h4>MODALIDAD: ENVÍO A DOMICILIO</h4>
                <p>
                  <strong>Destino:</strong> {addressText}
                </p>
                <p className="text-muted text-xs mt-1">
                  El pedido será embalado con máxima protección y despachado desde nuestro centro en {settings.pickupAddress}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Breakdown */}
        <div className="order-items-breakdown">
          <h3>DETALLE DE SUPLEMENTOS COMPRADOS</h3>
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
              <span>Total Abonado (MP):</span>
              <span>{formatARS(order.totalInCents)}</span>
            </div>
          </div>
        </div>

        {/* Next Actions */}
        <div className="result-actions-row">
          <Link to={`/seguimiento?orden=${order.orderNumber}`} className="btn btn-secondary">
            SEGUIMIENTO EN VIVO
          </Link>
          <Link to="/catalogo" className="btn btn-primary">
            SEGUIR COMPRANDO
          </Link>
        </div>
      </div>

      <style>{`
        .payment-result-page {
          padding-top: 2.5rem;
          padding-bottom: 5rem;
          max-width: 760px;
        }
        .result-card {
          padding: 2.5rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
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
          border: 1px solid #A7F3D0;
          padding: 0.85rem;
          border-radius: 50%;
        }
        .result-title {
          font-size: 1.8rem;
          font-weight: 800;
          margin-top: 0.25rem;
          color: var(--color-text);
          letter-spacing: -0.02em;
        }
        .order-num-text {
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
        .dispatch-alert-banner {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: var(--radius-sm);
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
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: 0.05em;
        }
        .dispatch-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--color-text);
          margin: 0;
        }
        .dispatch-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }
        .wa-dispatch-btn {
          margin-top: 0.75rem;
          align-self: flex-start;
        }
        .delivery-status-box {
          background: #F9FAFB;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
        }
        .status-flex {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .status-flex h4 {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          color: var(--color-text);
        }
        .status-flex p {
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }
        .order-items-breakdown {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.5rem;
          margin-bottom: 2rem;
          background: #FFFFFF;
        }
        .order-items-breakdown h3 {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 1.25rem;
          color: var(--color-text);
          letter-spacing: 0.03em;
        }
        .items-table {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
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
          font-weight: 700;
        }
        .item-price {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--color-text);
        }
        .order-totals-summary {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.95rem;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
          color: var(--color-text-muted);
        }
        .grand-total {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--color-text);
          border-top: 1px solid var(--color-border);
          padding-top: 0.5rem;
          margin-top: 0.35rem;
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
