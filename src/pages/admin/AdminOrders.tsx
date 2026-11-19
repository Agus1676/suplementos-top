import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Truck, 
  Eye, 
  Phone, 
  X, 
  Send
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatDate, buildWhatsAppDispatchLink } from '../../lib/utils';
import { Order, FulfillmentStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.fulfillmentStatus !== filterStatus) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchNumber = o.orderNumber.toLowerCase().includes(term);
      const matchCustomer = o.customerName.toLowerCase().includes(term);
      const matchDni = o.customerDni.includes(term);
      const matchPhone = o.customerPhone.includes(term);
      if (!matchNumber && !matchCustomer && !matchDni && !matchPhone) return false;
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, newFulfillment: FulfillmentStatus) => {
    updateOrderStatus(orderId, undefined, newFulfillment);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, fulfillmentStatus: newFulfillment });
    }
  };

  const handleSaveTracking = (orderId: string) => {
    if (newTrackingNumber.trim()) {
      updateOrderStatus(orderId, undefined, 'shipped', newTrackingNumber.trim());
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ 
          ...selectedOrder, 
          fulfillmentStatus: 'shipped', 
          trackingNumber: newTrackingNumber.trim() 
        });
      }
      setNewTrackingNumber('');
    }
  };

  return (
    <div className="admin-orders-page">
      <div className="page-header">
        <div>
          <h1>Gestión de Pedidos & Despachos</h1>
          <p className="text-muted">
            Monitoreá pagos acreditados, armá paquetes y coordiná retiros en <strong>Uriburu 1163</strong> o envíos por transporte.
          </p>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="card orders-filters-card">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por número de pedido, cliente, DNI o celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-search-input"
          />
        </div>

        <div className="status-tabs-row">
          <button
            onClick={() => setFilterStatus('all')}
            className={`status-tab ${filterStatus === 'all' ? 'active' : ''}`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('preparing')}
            className={`status-tab ${filterStatus === 'preparing' ? 'active' : ''}`}
          >
            En Preparación ({orders.filter(o => o.fulfillmentStatus === 'preparing').length})
          </button>
          <button
            onClick={() => setFilterStatus('ready_for_pickup')}
            className={`status-tab ${filterStatus === 'ready_for_pickup' ? 'active' : ''}`}
          >
            Listo Retiro ({orders.filter(o => o.fulfillmentStatus === 'ready_for_pickup').length})
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            className={`status-tab ${filterStatus === 'shipped' ? 'active' : ''}`}
          >
            Despachados ({orders.filter(o => o.fulfillmentStatus === 'shipped').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`status-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
          >
            Entregados ({orders.filter(o => o.fulfillmentStatus === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Cliente & Contacto</th>
                <th>Modalidad</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Estado Logístico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No se encontraron pedidos con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemsText = order.items
                    .map((item) => `• ${item.quantity}x ${item.productName} (${item.variantTitle})`)
                    .join('\n');
                  const addressText = order.shippingAddress 
                    ? `${order.shippingAddress.street} ${order.shippingAddress.number}, ${order.shippingAddress.city}`
                    : 'Retiro en sucursal Uriburu 1163';
                  const waLink = buildWhatsAppDispatchLink({
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
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.orderNumber}</strong>
                        <span className="text-xs text-muted d-block">{order.items.length} producto(s)</span>
                      </td>
                      <td className="text-xs text-muted">
                        {formatDate(order.createdAt)}
                      </td>
                      <td>
                        <strong>{order.customerName}</strong>
                        <span className="text-xs text-muted d-block">DNI: {order.customerDni}</span>
                        <span className="text-xs text-muted d-block">Tel: {order.customerPhone}</span>
                      </td>
                      <td>
                        {order.deliveryMethod === 'pickup' ? (
                          <span className="pill-method pickup">
                            <MapPin size={12} /> Retiro Recoleta
                          </span>
                        ) : (
                          <span className="pill-method shipping">
                            <Truck size={12} /> Envío Domicilio
                          </span>
                        )}
                      </td>
                      <td>
                        <strong className="text-primary">{formatARS(order.totalInCents)}</strong>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {order.paymentStatus === 'approved' ? 'Aprobado (MP)' : order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as FulfillmentStatus)}
                          className="status-selector"
                        >
                          <option value="unfulfilled">Sin procesar</option>
                          <option value="preparing">En preparación</option>
                          <option value="ready_for_pickup">Listo para retirar</option>
                          <option value="shipped">Despachado</option>
                          <option value="delivered">Entregado</option>
                        </select>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn-action-icon"
                            title="Ver Detalle Completo"
                          >
                            <Eye size={16} />
                          </button>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-action-wa"
                            title="Enviar WhatsApp de Despacho"
                          >
                            <Phone size={14} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Pedido #{selectedOrder.orderNumber}</h2>
                <span className="text-xs text-muted">Fecha: {formatDate(selectedOrder.createdAt)}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Box */}
              <div className="modal-section-box">
                <h3>Datos del comprador</h3>
                <div className="grid-2">
                  <p><strong>Nombre y Apellido:</strong> {selectedOrder.customerName}</p>
                  <p><strong>DNI / CUIL:</strong> {selectedOrder.customerDni}</p>
                  <p><strong>Teléfono / Celular:</strong> {selectedOrder.customerPhone}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                </div>
              </div>

              {/* Delivery Box */}
              <div className="modal-section-box">
                <h3>Entrega y dirección</h3>
                {selectedOrder.deliveryMethod === 'pickup' ? (
                  <div>
                    <span className="badge badge-accent">Retiro en Local Recoleta</span>
                    <p className="mt-2"><strong>Punto de Entrega:</strong> Uriburu 1163, Recoleta, CABA (entre Santa Fe y Arenales)</p>
                    <p className="text-xs text-muted">El cliente se presentará con su DNI.</p>
                  </div>
                ) : (
                  <div>
                    <span className="badge badge-dark">Envío a Domicilio</span>
                    <div className="mt-2">
                      <p><strong>Calle y Número:</strong> {selectedOrder.shippingAddress?.street} {selectedOrder.shippingAddress?.number} {selectedOrder.shippingAddress?.apartment && `(${selectedOrder.shippingAddress.apartment})`}</p>
                      <p><strong>Localidad y Provincia:</strong> {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.province} (CP: {selectedOrder.shippingAddress?.postalCode})</p>
                      {selectedOrder.shippingAddress?.deliveryNotes && (
                        <p className="delivery-note-box">
                          <strong>Indicaciones de entrega:</strong> {selectedOrder.shippingAddress.deliveryNotes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="modal-section-box">
                <h3>Productos del pedido</h3>
                <div className="modal-items-list">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="modal-item-row">
                      <div>
                        <strong>{item.productName}</strong>
                        <span className="d-block text-xs text-muted">{item.variantTitle} (SKU: {item.sku})</span>
                      </div>
                      <span className="qty-tag">Cant: {item.quantity}</span>
                      <strong>{formatARS(item.totalPriceInCents)}</strong>
                    </div>
                  ))}
                </div>

                <div className="modal-totals-box">
                  <div className="line"><span>Subtotal:</span> <span>{formatARS(selectedOrder.subtotalInCents)}</span></div>
                  <div className="line"><span>Costo Envío:</span> <span>{selectedOrder.shippingFeeInCents === 0 ? 'GRATIS' : formatARS(selectedOrder.shippingFeeInCents)}</span></div>
                  <div className="line total"><span>Total Cobrado (MP):</span> <span>{formatARS(selectedOrder.totalInCents)}</span></div>
                  {selectedOrder.mercadopagoPaymentId && (
                    <span className="text-xs text-muted">ID Pago Mercado Pago: {selectedOrder.mercadopagoPaymentId}</span>
                  )}
                </div>
              </div>

              {/* Logistics Tracking Updater */}
              {selectedOrder.deliveryMethod === 'shipping' && (
                <div className="modal-section-box tracking-update-box">
                  <h3>Número de seguimiento</h3>
                  {selectedOrder.trackingNumber ? (
                    <p className="text-success font-bold">
                      Código de seguimiento: <strong>{selectedOrder.trackingNumber}</strong>
                    </p>
                  ) : (
                    <div className="tracking-input-group">
                      <input
                        type="text"
                        placeholder="Ej: CORREO-AR-981240"
                        value={newTrackingNumber}
                        onChange={(e) => setNewTrackingNumber(e.target.value)}
                        className="form-input"
                      />
                      <button
                        onClick={() => handleSaveTracking(selectedOrder.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Guardar & Despachar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary">
                Cerrar
              </button>
              
              {/* WhatsApp notification link */}
              {(() => {
                const itemsText = selectedOrder.items
                  .map((item) => `• ${item.quantity}x ${item.productName} (${item.variantTitle})`)
                  .join('\n');
                const addressText = selectedOrder.shippingAddress 
                  ? `${selectedOrder.shippingAddress.street} ${selectedOrder.shippingAddress.number}, ${selectedOrder.shippingAddress.city}`
                  : 'Retiro en sucursal Uriburu 1163';
                const waLink = buildWhatsAppDispatchLink({
                  orderNumber: selectedOrder.orderNumber,
                  customerName: selectedOrder.customerName,
                  customerPhone: selectedOrder.customerPhone,
                  customerDni: selectedOrder.customerDni,
                  deliveryMethod: selectedOrder.deliveryMethod,
                  addressText,
                  itemsText,
                  totalText: formatARS(selectedOrder.totalInCents),
                  paymentStatus: selectedOrder.paymentStatus,
                });
                return (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent"
                  >
                    <Send size={16} />
                    <span>Enviar Resumen a WhatsApp (11 6565 1990)</span>
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-orders-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.2rem;
        }
        .orders-filters-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--color-text-subtle);
        }
        .filter-search-input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .status-tabs-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .status-tab {
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--color-bg-muted);
          color: var(--color-text-muted);
          border: 1px solid transparent;
          transition: all 0.15s;
        }
        .status-tab:hover {
          background: #E2E8F0;
        }
        .status-tab.active {
          background: var(--color-primary);
          color: #FFFFFF;
        }
        .table-card {
          padding: 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: var(--radius-md);
        }
        .empty-table-cell {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--color-text-muted);
        }
        .status-selector {
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          font-size: 0.775rem;
          font-weight: 600;
          background: #FFFFFF;
          cursor: pointer;
        }
        .table-actions {
          display: flex;
          gap: 0.4rem;
        }
        .btn-action-icon {
          background: var(--color-bg-muted);
          border: 1px solid var(--color-border);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          color: var(--color-text-main);
        }
        .btn-action-icon:hover {
          background: #E2E8F0;
        }
        .btn-action-wa {
          background: #25D366;
          color: #FFF;
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
        }
        /* Modal Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(2px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-card {
          background: #FFFFFF;
          border-radius: var(--radius-lg);
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .modal-header h2 {
          font-size: 1.25rem;
          margin: 0;
        }
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .modal-section-box {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          padding: 1.25rem;
          border-radius: var(--radius-md);
        }
        .modal-section-box h3 {
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          color: var(--color-primary);
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.5rem;
          font-size: 0.85rem;
        }
        @media (min-width: 600px) {
          .grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .delivery-note-box {
          background: #FFFBEB;
          border: 1px solid #FCD34D;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        .modal-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .modal-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
        }
        .qty-tag {
          font-weight: 700;
          color: var(--color-text-muted);
        }
        .modal-totals-box {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.85rem;
        }
        .modal-totals-box .line {
          display: flex;
          justify-content: space-between;
        }
        .modal-totals-box .total {
          font-weight: 800;
          font-size: 1.05rem;
          border-top: 1px solid var(--color-border);
          padding-top: 0.35rem;
          margin-top: 0.25rem;
          color: var(--color-primary);
        }
        .tracking-update-box {
          background: #EFF6FF;
          border-color: #BFDBFE;
        }
        .tracking-input-group {
          display: flex;
          gap: 0.5rem;
        }
        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--color-border);
          background: #F8FAFC;
        }

        @media (max-width: 768px) {
          .orders-filter-card {
            padding: 1rem;
          }
          .status-tabs-row {
            gap: 0.35rem;
          }
          .status-tab {
            padding: 0.3rem 0.65rem;
            font-size: 0.75rem;
          }
          .modal-backdrop {
            padding: 0.75rem;
          }
          .modal-card {
            max-height: 94vh;
          }
          .modal-header {
            padding: 1rem;
          }
          .modal-body {
            padding: 1rem;
            gap: 1rem;
          }
          .modal-footer {
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
            padding: 1rem;
          }
          .modal-footer button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};
