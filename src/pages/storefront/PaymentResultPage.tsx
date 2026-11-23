import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Phone, 
  Send,
  Clock,
  AlertCircle,
  RotateCcw,
  Copy,
  Check,
  Building2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, buildWhatsAppDispatchLink, formatDate } from '../../lib/utils';

export const PaymentResultPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { orders, settings } = useStore();
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [copiedCbu, setCopiedCbu] = useState(false);
  
  // Read params from internal router or Mercado Pago return redirect
  const orderNumber = searchParams.get('orden') || searchParams.get('external_reference');
  const mpStatus = searchParams.get('collection_status') || searchParams.get('status') || 'approved';
  const mpPaymentId = searchParams.get('payment_id') || searchParams.get('collection_id');

  const order = orders.find((o) => o.orderNumber === orderNumber) || orders[0];

  const bankAlias = settings.bankAlias || 'Suplementos.top';
  const bankCvu = settings.bankCvu || '0000076500000020117357';
  const bankHolder = settings.bankHolder || 'Camila Cettour';

  const handleCopyAlias = () => {
    navigator.clipboard.writeText(bankAlias);
    setCopiedAlias(true);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  const handleCopyCbu = () => {
    navigator.clipboard.writeText(bankCvu);
    setCopiedCbu(true);
    setTimeout(() => setCopiedCbu(false), 2000);
  };

  if (!order) {
    return (
      <div className="container not-found-wrap">
        <h2>Pedido no encontrado</h2>
        <p>No se pudo localizar el pedido solicitado. Podés revisar tu historial o contactarte con nosotros.</p>
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
    paymentStatus: mpStatus === 'approved' ? 'approved' : mpStatus,
  });

  const waTransferReceiptLink = `https://wa.me/5491165652990?text=${encodeURIComponent(
    `Hola Suplementos Top! Realicé la transferencia para mi Pedido #${order.orderNumber} por ${formatARS(order.totalInCents)} a nombre de ${order.customerName} a la cuenta de ${bankHolder}. Adjunto comprobante:`
  )}`;

  const isApproved = mpStatus === 'approved';
  const isPending = mpStatus === 'pending' || mpStatus === 'in_process';
  const isRejected = mpStatus === 'rejected' || mpStatus === 'failure';
  const isTransfer = isPending || order.paymentMethod?.toLowerCase().includes('transferencia') || order.paymentStatus === 'pending';

  return (
    <div className="container payment-result-page">
      <div className="card result-card">
        {/* Status Header */}
        <div className="result-header">
          {isApproved && (
            <>
              <div className="success-icon-wrap">
                <CheckCircle2 size={50} className="text-success" />
              </div>
              <span className="badge badge-success">PAGO ACREDITADO CON MERCADO PAGO</span>
              <h1 className="result-title">¡GRACIAS POR TU COMPRA, {order.customerName.split(' ')[0].toUpperCase()}!</h1>
              <p className="order-num-text">
                NÚMERO DE PEDIDO: <strong>#{order.orderNumber}</strong> • {formatDate(order.createdAt)}
              </p>
              {mpPaymentId && (
                <span className="mp-id-tag">ID Transacción Mercado Pago: #{mpPaymentId}</span>
              )}
            </>
          )}

          {isPending && (
            <>
              <div className="warning-icon-wrap">
                <Clock size={50} className="text-amber-500" />
              </div>
              <span className="badge badge-warning">PAGO EN PROCESO DE ACREDITACIÓN</span>
              <h1 className="result-title">PEDIDO GENERADO — ESPERANDO PAGO</h1>
              <p className="order-num-text">
                NÚMERO DE PEDIDO: <strong>#{order.orderNumber}</strong>
              </p>
              <p className="status-note-text">
                Si abonaste por Pago Fácil, Rapipago o Transferencia, la acreditación puede demorar hasta 24 hs hábiles. Una vez impactado, comenzamos a empaquetar tu pedido.
              </p>
            </>
          )}

          {isRejected && (
            <>
              <div className="danger-icon-wrap">
                <AlertCircle size={50} className="text-danger" />
              </div>
              <span className="badge badge-danger">EL PAGO NO PUDO COMPLETARSE</span>
              <h1 className="result-title">TRANSACCIÓN RECHAZADA</h1>
              <p className="order-num-text">
                La entidad bancaria o Mercado Pago no autorizó el cobro.
              </p>
              <div className="retry-btn-box mt-3">
                <Link to="/checkout" className="btn btn-primary">
                  <RotateCcw size={16} />
                  <span>Reintentar con otro medio de pago</span>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Bank Transfer Details Section */}
        {isTransfer && !isRejected && (
          <div className="bank-transfer-card">
            <div className="bank-card-header">
              <div className="bank-header-badge">
                <Building2 size={16} />
                <span>DATOS BANCARIOS OFICIALES (10% OFF APLICADO)</span>
              </div>
              <h3 className="bank-card-title">Realizá la transferencia por {formatARS(order.totalInCents)}</h3>
              <p className="bank-card-sub">
                Transferí desde cualquier app bancaria o billetera virtual (Mercado Pago, Santander, Galicia, BBVA, Modo, etc.) y enviá el comprobante por WhatsApp:
              </p>
            </div>

            <div className="bank-data-grid">
              <div className="bank-data-row">
                <span className="bank-data-label">Banco / Billetera:</span>
                <strong className="bank-data-val">Mercado Pago / Billetera Virtual</strong>
              </div>

              <div className="bank-data-row">
                <span className="bank-data-label">Titular de la Cuenta:</span>
                <strong className="bank-data-val">{bankHolder}</strong>
              </div>

              <div className="bank-data-row highlight-row">
                <div className="code-text-group">
                  <span className="bank-data-label">Alias:</span>
                  <strong className="bank-data-code">{bankAlias}</strong>
                </div>
                <button 
                  onClick={handleCopyAlias}
                  className={`copy-data-btn ${copiedAlias ? 'copied' : ''}`}
                  type="button"
                >
                  {copiedAlias ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedAlias ? '¡Copiado!' : 'Copiar Alias'}</span>
                </button>
              </div>

              <div className="bank-data-row highlight-row">
                <div className="code-text-group">
                  <span className="bank-data-label">CVU:</span>
                  <strong className="bank-data-code">{bankCvu}</strong>
                </div>
                <button 
                  onClick={handleCopyCbu}
                  className={`copy-data-btn ${copiedCbu ? 'copied' : ''}`}
                  type="button"
                >
                  {copiedCbu ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCbu ? '¡Copiado!' : 'Copiar CVU'}</span>
                </button>
              </div>

              <div className="bank-data-row total-transfer-row">
                <span className="bank-data-label">Monto Exacto a Transferir:</span>
                <strong className="bank-total-val">{formatARS(order.totalInCents)}</strong>
              </div>
            </div>

            <div className="receipt-cta-wrap">
              <a
                href={waTransferReceiptLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg wa-receipt-btn"
              >
                <Phone size={18} />
                <span>ENVIAR COMPROBANTE POR WHATSAPP (11 6565-2990)</span>
              </a>
              <span className="receipt-cta-hint">
                Al enviar el comprobante con tu número de pedido #{order.orderNumber}, se acredita en minutos y preparamos tu paquete.
              </span>
            </div>
          </div>
        )}

        {/* Priority Dispatch Notification Alert for Owner (si no es transferencia o ya pagó) */}
        {!isRejected && !isTransfer && (
          <div className="dispatch-alert-banner">
            <div className="alert-badge">
              <Send size={15} />
              <span>ALERTA DE DESPACHO INMEDIATO</span>
            </div>
            <h3 className="dispatch-title">Notificación para preparar el paquete</h3>
            <p className="dispatch-desc">
              Se envió un comprobante automático con todos los datos a <strong>{settings.supportEmail}</strong>. 
              También podés avisar directamente al WhatsApp del local para agilizar el retiro o despacho:
            </p>
            <a
              href={waDispatchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg wa-dispatch-btn"
            >
              <Phone size={18} />
              <span>AVISAR AL WHATSAPP DE DESPACHO (11 6565-2990)</span>
            </a>
          </div>
        )}

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
                  Horarios: {settings.hoursDescription}. Podés acercarte presentando tu DNI ({order.customerDni}) o indicando tu número #{order.orderNumber}.
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
              <span>{isTransfer ? 'Total con Descuento 10% (Transferencia):' : 'Total Abonado (Mercado Pago):'}</span>
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
          padding-top: 2rem;
          padding-bottom: 5rem;
          max-width: 760px;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        .result-card {
          padding: 2.25rem 2rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          .result-card {
            padding: 1.25rem 1rem;
          }
          .result-title {
            font-size: 1.4rem !important;
          }
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
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #DCFCE7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .warning-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #FEF3C7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .danger-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #FEE2E2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .result-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--color-text-main);
          margin: 0;
          letter-spacing: -0.01em;
          word-break: break-word;
        }
        .order-num-text {
          font-size: 0.9rem;
          color: var(--color-text-muted);
          margin: 0;
        }
        .mp-id-tag {
          font-size: 0.75rem;
          color: var(--color-text-subtle);
          font-family: monospace;
        }
        .status-note-text {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          max-width: 500px;
          line-height: 1.45;
        }

        /* Bank Transfer Card */
        .bank-transfer-card {
          background: #F0FDF4;
          border: 2px solid #22C55E;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.08);
        }
        .bank-card-header {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .bank-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: #166534;
          background: #DCFCE7;
          padding: 0.25rem 0.6rem;
          border-radius: 999px;
          width: fit-content;
          letter-spacing: 0.05em;
        }
        .bank-card-title {
          font-size: 1.35rem;
          font-weight: 900;
          color: #14532D;
          margin: 0;
        }
        .bank-card-sub {
          font-size: 0.85rem;
          color: #166534;
          margin: 0;
          line-height: 1.45;
        }
        .bank-data-grid {
          background: #FFFFFF;
          border: 1px solid #BBF7D0;
          border-radius: var(--radius-sm);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .bank-data-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #F0FDF4;
          font-size: 0.85rem;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .bank-data-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .bank-data-label {
          color: #475569;
          font-weight: 600;
          font-size: 0.82rem;
        }
        .bank-data-val {
          color: #0F172A;
          font-weight: 700;
        }
        .code-text-group {
          display: flex;
          flex-direction: column;
        }
        .bank-data-code {
          font-family: monospace;
          font-size: 0.95rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: 0.03em;
        }
        .copy-data-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .copy-data-btn:hover {
          background: #E2E8F0;
          color: #0F172A;
        }
        .copy-data-btn.copied {
          background: #DCFCE7;
          border-color: #86EFAC;
          color: #166534;
        }
        .total-transfer-row {
          background: #F8FAFC;
          padding: 0.75rem;
          border-radius: 6px;
          border: 1px dashed #CBD5E1;
          margin-top: 0.25rem;
        }
        .bank-total-val {
          font-size: 1.25rem;
          font-weight: 900;
          color: #166534;
        }
        .receipt-cta-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .wa-receipt-btn {
          background: #25D366 !important;
          border-color: #25D366 !important;
          color: #FFFFFF !important;
          font-weight: 800 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          padding: 0.9rem 1.25rem !important;
          font-size: 0.95rem !important;
          border-radius: var(--radius-sm) !important;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }
        .wa-receipt-btn:hover {
          background: #1EBE5D !important;
          border-color: #1EBE5D !important;
        }
        .receipt-cta-hint {
          font-size: 0.78rem;
          color: #15803D;
          text-align: center;
          line-height: 1.35;
        }

        .dispatch-alert-banner {
          background: #FFF1F2;
          border: 1px solid #FECDD3;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .alert-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.7rem;
          font-weight: 800;
          color: #E11D48;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .dispatch-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #9F1239;
          margin: 0;
        }
        .dispatch-desc {
          font-size: 0.85rem;
          color: #4B5563;
          line-height: 1.45;
          margin: 0;
        }
        .wa-dispatch-btn {
          margin-top: 0.5rem;
          background: #25D366 !important;
          border-color: #25D366 !important;
          color: #FFFFFF !important;
          font-weight: 800 !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
        }
        .wa-dispatch-btn:hover {
          background: #1EBE5D !important;
          border-color: #1EBE5D !important;
        }
        .delivery-status-box {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          margin-bottom: 2rem;
        }
        .status-flex {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .status-flex h4 {
          font-size: 0.85rem;
          font-weight: 800;
          margin: 0 0 0.35rem 0;
          letter-spacing: 0.04em;
        }
        .status-flex p {
          font-size: 0.85rem;
          margin: 0;
          line-height: 1.4;
        }
        .order-items-breakdown {
          margin-bottom: 2rem;
        }
        .order-items-breakdown h3 {
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.04em;
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
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
        }
        .item-main {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .item-qty {
          color: var(--color-text-muted);
          margin: 0 1.5rem;
        }
        .item-price {
          font-weight: 700;
        }
        .order-totals-summary {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        .total-line {
          display: flex;
          justify-content: space-between;
        }
        .grand-total {
          font-size: 1.1rem;
          font-weight: 800;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
          margin-top: 0.5rem;
          color: var(--color-text-main);
        }
        .result-actions-row {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
