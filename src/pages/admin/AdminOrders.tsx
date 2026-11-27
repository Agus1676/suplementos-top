import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Truck, 
  Eye, 
  Phone, 
  X, 
  Send,
  Printer,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatDate, buildWhatsAppDispatchLink } from '../../lib/utils';
import { Order, FulfillmentStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, settings } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<'all' | 'pickup' | 'shipping'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [quickLabelOrder, setQuickLabelOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus !== 'all' && o.fulfillmentStatus !== filterStatus) return false;
    if (deliveryFilter !== 'all' && o.deliveryMethod !== deliveryFilter) return false;
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

  const handlePrint = () => {
    window.print();
  };

  // Helper to build fast customized WhatsApp message
  const buildCustomWhatsAppUrl = (order: Order, type: 'ready' | 'shipped') => {
    const rawPhone = order.customerPhone.replace(/\D/g, '');
    if (!rawPhone) return '#';
    const cleanPhone = `549${rawPhone.startsWith('54') ? rawPhone.slice(2) : rawPhone}`;

    let text = '';
    if (type === 'ready') {
      text = `¡Hola ${order.customerName}! Te escribimos de *Suplementos Top Recoleta* 🏋️‍♂️.\n\n` +
        `Tu pedido *#${order.orderNumber}* ya se encuentra listo para retirar en el mostrador de *Gimnasio Top Shape* (Pres. José E. Uriburu 1163).\n\n` +
        `• Horarios: Lun a Vie 8:00 a 23:00 hs | Sáb 10:00 a 18:00 hs.\n` +
        `• Presentá tu DNI (${order.customerDni}) al retirar.\n\n` +
        `¡Te esperamos!`;
    } else {
      text = `¡Hola ${order.customerName}! Te escribimos de *Suplementos Top* 📦.\n\n` +
        `Tu pedido *#${order.orderNumber}* ya fue embalado y despachado por correo expreso.\n\n` +
        (order.trackingNumber ? `• Código de seguimiento online: *${order.trackingNumber}*\n` : '') +
        `Podés consultar el estado de tu envío en cualquier momento desde nuestra web en la sección de Seguimiento.\n\n` +
        `¡Muchas gracias por confiar en nosotros!`;
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Helper to format clean date (e.g., "17 nov 2026 • 21:05 hs")
  const formatOrderDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      const day = d.getDate().toString().padStart(2, '0');
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `${day} ${month} ${year} • ${hours}:${minutes} hs`;
    } catch {
      return formatDate(dateStr);
    }
  };

  return (
    <div className="admin-orders-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Pedidos &amp; Despachos</h1>
          <p className="page-subtitle">
            Monitoreá pagos acreditados, coordiná retiros en <strong>Pres. José E. Uriburu 1163</strong> (Gimnasio Top Shape) y envíos a todo el país.
          </p>
        </div>
      </div>

      {/* Controls Card: Search & Refined Status Pills */}
      <div className="orders-filter-card">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por número de pedido (#ST...), cliente, DNI o celular..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-search-input"
          />
        </div>

        {/* Delivery Method Segmented Switch */}
        <div className="delivery-filter-bar">
          <span className="delivery-filter-label">Filtrar por Entrega:</span>
          <div className="delivery-filter-pills">
            <button
              type="button"
              onClick={() => setDeliveryFilter('all')}
              className={`delivery-filter-btn ${deliveryFilter === 'all' ? 'active' : ''}`}
            >
              <span>Todos ({orders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryFilter('pickup')}
              className={`delivery-filter-btn ${deliveryFilter === 'pickup' ? 'active' : ''}`}
            >
              <MapPin size={13} />
              <span>Retiro en Recoleta ({orders.filter(o => o.deliveryMethod === 'pickup').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryFilter('shipping')}
              className={`delivery-filter-btn ${deliveryFilter === 'shipping' ? 'active' : ''}`}
            >
              <Truck size={13} />
              <span>Envíos por Correo ({orders.filter(o => o.deliveryMethod === 'shipping').length})</span>
            </button>
          </div>
        </div>

        <div className="status-tabs-row">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`status-tab ${filterStatus === 'all' ? 'active' : ''}`}
          >
            <span>Todos</span>
            <span className="status-tab-count">{orders.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('preparing')}
            className={`status-tab ${filterStatus === 'preparing' ? 'active' : ''}`}
          >
            <span>En Preparación</span>
            <span className="status-tab-count">
              {orders.filter(o => o.fulfillmentStatus === 'preparing').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('ready_for_pickup')}
            className={`status-tab ${filterStatus === 'ready_for_pickup' ? 'active' : ''}`}
          >
            <span>Listo Retiro</span>
            <span className="status-tab-count">
              {orders.filter(o => o.fulfillmentStatus === 'ready_for_pickup').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('shipped')}
            className={`status-tab ${filterStatus === 'shipped' ? 'active' : ''}`}
          >
            <span>Despachados</span>
            <span className="status-tab-count">
              {orders.filter(o => o.fulfillmentStatus === 'shipped').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('delivered')}
            className={`status-tab ${filterStatus === 'delivered' ? 'active' : ''}`}
          >
            <span>Entregados</span>
            <span className="status-tab-count">
              {orders.filter(o => o.fulfillmentStatus === 'delivered').length}
            </span>
          </button>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="orders-table-card">
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th style={{ width: '150px' }}>Pedido</th>
                <th style={{ width: '160px' }}>Fecha</th>
                <th>Cliente &amp; Contacto</th>
                <th style={{ width: '170px' }}>Modalidad</th>
                <th style={{ width: '130px' }}>Total</th>
                <th style={{ width: '130px' }}>Pago</th>
                <th style={{ width: '170px' }}>Estado Logístico</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    <ShoppingBag size={36} className="text-muted" style={{ margin: '0 auto 12px auto' }} />
                    <p style={{ fontWeight: 700, margin: '0 0 4px 0', color: '#0F172A' }}>
                      No se encontraron pedidos
                    </p>
                    <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
                      Probá modificando el término de búsqueda o cambiando el filtro de estado.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const totalProductsQty = order.items.reduce((acc, i) => acc + i.quantity, 0);
                  
                  // Format phone link for 1-click WhatsApp
                  const rawPhone = order.customerPhone.replace(/\D/g, '');
                  const waCustomerChat = rawPhone ? `https://wa.me/549${rawPhone.startsWith('54') ? rawPhone.slice(2) : rawPhone}` : null;

                  return (
                    <tr key={order.id} className="orders-table-row">
                      {/* Pedido */}
                      <td className="cell-order-number">
                        <div className="order-number-title">
                          #{order.orderNumber}
                        </div>
                        <div className="order-items-badge">
                          <Package size={12} />
                          <span>{totalProductsQty} {totalProductsQty === 1 ? 'producto' : 'productos'}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="cell-date">
                        <div className="order-date-text">
                          <Clock size={12} className="date-icon" />
                          <span>{formatOrderDate(order.createdAt)}</span>
                        </div>
                      </td>

                      {/* Cliente & Contacto */}
                      <td className="cell-customer">
                        <div className="customer-info-box">
                          <span className="customer-name">{order.customerName}</span>
                          <div className="customer-meta-row">
                            <span className="customer-dni-tag">DNI: {order.customerDni}</span>
                            {waCustomerChat ? (
                              <a
                                href={waCustomerChat}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="customer-phone-link"
                                title="Abrir chat en WhatsApp"
                              >
                                <Phone size={11} />
                                <span>{order.customerPhone}</span>
                              </a>
                            ) : (
                              <span className="customer-phone-plain">Tel: {order.customerPhone}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Modalidad */}
                      <td className="cell-delivery">
                        {order.deliveryMethod === 'pickup' ? (
                          <div className="delivery-pill-wrapper">
                            <span className="badge-delivery badge-pickup">
                              <MapPin size={12} />
                              <span>Retiro Recoleta</span>
                            </span>
                            <span className="delivery-subtext">Gimnasio Top Shape</span>
                          </div>
                        ) : (
                          <div className="delivery-pill-wrapper">
                            <span className="badge-delivery badge-shipping">
                              <Truck size={12} />
                              <span>Envío Domicilio</span>
                            </span>
                            <span className="delivery-subtext">A todo el país</span>
                          </div>
                        )}
                      </td>

                      {/* Total */}
                      <td className="cell-total">
                        <span className="order-total-price">
                          {formatARS(order.totalInCents)}
                        </span>
                      </td>

                      {/* Pago */}
                      <td className="cell-payment">
                        {order.paymentStatus === 'approved' ? (
                          <span className="badge-payment badge-payment-approved">
                            <CheckCircle2 size={12} />
                            <span>Aprobado (MP)</span>
                          </span>
                        ) : (
                          <span className="badge-payment badge-payment-pending">
                            <Clock size={12} />
                            <span>Pendiente</span>
                          </span>
                        )}
                      </td>

                      {/* Estado Logístico (Refined Custom Select) */}
                      <td className="cell-status">
                        <select
                          value={order.fulfillmentStatus}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as FulfillmentStatus)}
                          className={`status-selector status-selector--${order.fulfillmentStatus}`}
                        >
                          <option value="unfulfilled">Sin procesar</option>
                          <option value="preparing">En preparación</option>
                          <option value="ready_for_pickup">Listo para retirar</option>
                          <option value="shipped">Despachado</option>
                          <option value="delivered">Entregado</option>
                        </select>
                      </td>

                      {/* Acciones */}
                      <td className="cell-actions">
                        <div className="actions-cluster">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="btn-action-view"
                            title="Ver Remito y Detalle"
                          >
                            <Eye size={14} />
                            <span>Remito</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setQuickLabelOrder(order)}
                            className="btn-action-label"
                            title="Etiqueta Térmica de Envío / Despacho"
                          >
                            <Printer size={14} />
                            <span>Etiqueta</span>
                          </button>

                          {order.deliveryMethod === 'pickup' ? (
                            <a
                              href={buildCustomWhatsAppUrl(order, 'ready')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-action-wa btn-action-wa--pickup"
                              title="Avisar que está listo para retirar en Gimnasio Top Shape"
                            >
                              <Send size={13} />
                              <span>Listo Retiro</span>
                            </a>
                          ) : (
                            <a
                              href={buildCustomWhatsAppUrl(order, 'shipped')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-action-wa btn-action-wa--shipped"
                              title="Enviar aviso de despacho por Correo"
                            >
                              <Send size={13} />
                              <span>Aviso Envío</span>
                            </a>
                          )}
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

      {/* Order Remito / Invoice Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Top Toolbar */}
            <div className="modal-topbar">
              <div className="modal-topbar-left">
                <h2>Remito de Despacho #{selectedOrder.orderNumber}</h2>
                <span className="modal-date-sub">{formatOrderDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="modal-topbar-actions">
                <button type="button" onClick={handlePrint} className="btn-modal-print">
                  <Printer size={15} />
                  <span>Imprimir Remito</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedOrder(null)} 
                  className="btn-modal-close"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body">
              {/* Store Identity Banner in Remito */}
              <div className="remito-store-banner">
                <div className="store-banner-left">
                  <img src="/logo.png" alt="Suplementos Top" className="remito-logo-img" />
                  <div>
                    <h3 className="remito-brand-name">SUPLEMENTOS TOP</h3>
                    <p className="remito-brand-address">
                      Pres. José E. Uriburu 1163 (Gimnasio Top Shape) • Recoleta, CABA<br />
                      WhatsApp: {settings.supportPhone || '11 6565-2990'} • Email: {settings.supportEmail}
                    </p>
                  </div>
                </div>
                <div className="store-banner-right">
                  <span className="badge-remito-status">
                    {selectedOrder.fulfillmentStatus === 'ready_for_pickup' ? 'LISTO PARA RETIRO'
                      : selectedOrder.fulfillmentStatus === 'shipped' ? 'DESPACHADO'
                      : selectedOrder.fulfillmentStatus === 'delivered' ? 'ENTREGADO'
                      : 'EN PREPARACIÓN'}
                  </span>
                </div>
              </div>

              {/* Grid 2: Destination & Logistics */}
              <div className="modal-grid-2">
                <div className="modal-detail-card">
                  <h4 className="detail-card-title">Datos del Comprador</h4>
                  <p className="detail-line"><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                  <p className="detail-line"><strong>DNI / CUIL:</strong> {selectedOrder.customerDni}</p>
                  <p className="detail-line"><strong>Teléfono:</strong> {selectedOrder.customerPhone}</p>
                  <p className="detail-line"><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                </div>

                <div className="modal-detail-card">
                  <h4 className="detail-card-title">Logística &amp; Destino</h4>
                  <p className="detail-line">
                    <strong>Modalidad:</strong> {selectedOrder.deliveryMethod === 'pickup' 
                      ? 'Retiro Presencial en Gimnasio Top Shape' 
                      : 'Envío a Domicilio'}
                  </p>
                  {selectedOrder.shippingAddress && (
                    <p className="detail-line">
                      <strong>Dirección:</strong> {selectedOrder.shippingAddress.street} {selectedOrder.shippingAddress.number}
                      {selectedOrder.shippingAddress.apartment ? ` Piso ${selectedOrder.shippingAddress.apartment}` : ''}, {selectedOrder.shippingAddress.city} (CP: {selectedOrder.shippingAddress.postalCode})
                    </p>
                  )}
                  <p className="detail-line">
                    <strong>Pago:</strong> {selectedOrder.paymentMethod || 'Mercado Pago Checkout Pro'} ({selectedOrder.paymentStatus.toUpperCase()})
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="modal-detail-card">
                <h4 className="detail-card-title">Suplementos a Preparar</h4>
                <div className="modal-items-list">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="modal-item-row">
                      <div className="item-name-col">
                        <span className="item-title">{item.productName}</span>
                        <span className="item-variant">{item.variantTitle}</span>
                        <span className="item-sku">SKU: {item.sku}</span>
                      </div>
                      <div className="item-qty-col">
                        <span className="qty-tag">x{item.quantity}</span>
                      </div>
                      <div className="item-price-col">
                        <span>{formatARS(item.totalPriceInCents)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="modal-totals-block">
                  <div className="totals-line">
                    <span>Subtotal:</span>
                    <span>{formatARS(selectedOrder.subtotalInCents)}</span>
                  </div>
                  {selectedOrder.discountInCents > 0 && (
                    <div className="totals-line text-success">
                      <span>Descuento Transferencia (10% OFF):</span>
                      <span>-{formatARS(selectedOrder.discountInCents)}</span>
                    </div>
                  )}
                  <div className="totals-line">
                    <span>Envío:</span>
                    <span>{selectedOrder.shippingFeeInCents === 0 ? 'Sin cargo' : formatARS(selectedOrder.shippingFeeInCents)}</span>
                  </div>
                  <div className="totals-line totals-grand-total">
                    <span>Total Pagado:</span>
                    <span>{formatARS(selectedOrder.totalInCents)}</span>
                  </div>
                </div>
              </div>

              {/* Tracking Code Section for Shipping */}
              {selectedOrder.deliveryMethod === 'shipping' && (
                <div className="modal-detail-card tracking-section">
                  <h4 className="detail-card-title">Código de Seguimiento de Correo</h4>
                  <div className="tracking-controls-row">
                    <input
                      type="text"
                      placeholder={selectedOrder.trackingNumber || 'Pegá aquí el código de envío (Andreani, Correo Arg)...'}
                      value={newTrackingNumber}
                      onChange={(e) => setNewTrackingNumber(e.target.value)}
                      className="tracking-input"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveTracking(selectedOrder.id)}
                      className="btn-save-tracking"
                    >
                      Guardar Tracking
                    </button>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <span className="current-tracking-tag">
                      Guía actual: <strong>{selectedOrder.trackingNumber}</strong>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="modal-footer">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="btn-modal-back"
              >
                Cerrar Ventana
              </button>

              {(() => {
                const itemsText = selectedOrder.items
                  .map((item) => `• ${item.quantity}x ${item.productName} (${item.variantTitle})`)
                  .join('\n');
                const addressText = selectedOrder.shippingAddress 
                  ? `${selectedOrder.shippingAddress.street} ${selectedOrder.shippingAddress.number}, ${selectedOrder.shippingAddress.city}`
                  : 'Retiro en sucursal Uriburu 1163 (Gimnasio Top Shape)';
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
                    className="btn-modal-wa-send"
                  >
                    <Send size={15} />
                    <span>Enviar Notificación a WhatsApp ({selectedOrder.customerPhone})</span>
                  </a>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Quick Shipping / Pickup Label Modal */}
      {quickLabelOrder && (
        <div className="modal-backdrop" onClick={() => setQuickLabelOrder(null)}>
          <div className="modal-card modal-card--label" onClick={(e) => e.stopPropagation()}>
            <div className="modal-topbar">
              <div className="modal-topbar-left">
                <h2>Etiqueta Térmica de Despacho</h2>
                <span className="modal-date-sub">Pedido #{quickLabelOrder.orderNumber}</span>
              </div>
              <div className="modal-topbar-actions">
                <button type="button" onClick={handlePrint} className="btn-modal-print">
                  <Printer size={15} />
                  <span>Imprimir Etiqueta</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setQuickLabelOrder(null)} 
                  className="modal-btn-close"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="thermal-label-container">
              <div className="thermal-label-box" id="thermal-label-print">
                <div className="label-brand-head">
                  <div className="label-logo-row">
                    <img src="/logo.png" alt="Suplementos Top" className="label-logo" />
                    <div>
                      <strong className="label-brand-name">SUPLEMENTOS TOP</strong>
                      <span className="label-brand-sub">Sede Recoleta • Pres. José E. Uriburu 1163</span>
                    </div>
                  </div>
                  <div className="label-order-tag">
                    <span>PEDIDO</span>
                    <strong>#{quickLabelOrder.orderNumber}</strong>
                  </div>
                </div>

                <div className="label-divider-heavy" />

                <div className="label-section">
                  <span className="label-section-title">DESTINATARIO / CLIENTE:</span>
                  <div className="label-dest-name">{quickLabelOrder.customerName}</div>
                  <div className="label-dest-row">
                    <span><strong>DNI:</strong> {quickLabelOrder.customerDni}</span>
                    <span><strong>TEL:</strong> {quickLabelOrder.customerPhone}</span>
                  </div>
                  <div className="label-dest-address">
                    <strong>MODALIDAD:</strong>{' '}
                    {quickLabelOrder.deliveryMethod === 'pickup' ? (
                      <span className="label-pickup-text">RETIRO EN MOSTRADOR (GIMNASIO TOP SHAPE - RECOLETA)</span>
                    ) : (
                      <span className="label-shipping-text">
                        ENVÍO A DOMICILIO: {quickLabelOrder.shippingAddress?.street} {quickLabelOrder.shippingAddress?.number}
                        {quickLabelOrder.shippingAddress?.apartment ? ` (Piso/Depto ${quickLabelOrder.shippingAddress.apartment})` : ''}, {quickLabelOrder.shippingAddress?.city} (CP {quickLabelOrder.shippingAddress?.postalCode || 'CABA'})
                      </span>
                    )}
                  </div>
                </div>

                <div className="label-divider" />

                <div className="label-section">
                  <span className="label-section-title">DETALLE DEL PAQUETE:</span>
                  <div className="label-items-list">
                    {quickLabelOrder.items.map((item, idx) => (
                      <div key={idx} className="label-item-row">
                        <span className="label-item-qty">{item.quantity}x</span>
                        <span className="label-item-name">{item.productName} ({item.variantTitle})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="label-divider" />

                <div className="label-footer-row">
                  <div>
                    <span className="label-footnote">PAQUETE SELLADO • FRÁGIL</span>
                    <span className="label-footnote-sub">Fecha: {formatOrderDate(quickLabelOrder.createdAt)}</span>
                  </div>
                  <div className="label-total-box">
                    <span>TOTAL:</span>
                    <strong>{formatARS(quickLabelOrder.totalInCents)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ========================================================
           TIENDA MAY / JOKERS UI - PROFESSIONAL ORDERS TABLE
           Clean, Ultra-Prolijo, Responsive & Anti-Cramp Typography
           ======================================================== */
        .admin-orders-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .page-header {
          margin-bottom: 4px;
        }
        .page-title {
          font-size: 1.65rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
        }
        .page-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        /* Controls Card */
        .orders-filter-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .search-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          pointer-events: none;
        }
        .filter-search-input {
          width: 100%;
          height: 42px;
          padding: 0 14px 0 42px;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .filter-search-input:focus {
          border-color: #0F172A;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
        }

        /* Delivery Filter Bar */
        .delivery-filter-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .delivery-filter-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .delivery-filter-pills {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .delivery-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          background: #F8FAFC;
          color: #475569;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .delivery-filter-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
          border-color: #CBD5E1;
        }
        .delivery-filter-btn.active {
          background: #16A34A;
          color: #FFFFFF;
          border-color: #16A34A;
        }

        .status-tabs-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .status-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 600;
          background: #F1F5F9;
          color: #475569;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .status-tab:hover {
          background: #E2E8F0;
          color: #0F172A;
        }
        .status-tab.active {
          background: #0F172A;
          color: #FFFFFF;
        }
        .status-tab-count {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 1px 7px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.08);
        }
        .status-tab.active .status-tab-count {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        /* Table Card */
        .orders-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }
        .table-responsive {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
        }

        .orders-table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
          font-size: 0.88rem;
          text-align: left;
        }

        .orders-table th {
          background: #FAFAFA;
          color: #64748B;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 14px 18px;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .orders-table td {
          padding: 14px 18px;
          border-bottom: 1px solid #F1F5F9;
          vertical-align: middle;
          color: #0F172A;
        }

        .orders-table-row:hover td {
          background: #F8FAFC;
        }

        /* Column: Pedido */
        .cell-order-number {
          white-space: nowrap;
        }
        .order-number-title {
          font-weight: 800;
          font-size: 0.94rem;
          color: #0F172A;
          letter-spacing: -0.01em;
          margin-bottom: 3px;
        }
        .order-items-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.74rem;
          color: #64748B;
          font-weight: 600;
          background: #F1F5F9;
          padding: 2px 7px;
          border-radius: 4px;
        }

        /* Column: Fecha */
        .cell-date {
          white-space: nowrap;
        }
        .order-date-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          color: #475569;
          font-weight: 500;
        }
        .date-icon {
          color: #94A3B8;
        }

        /* Column: Cliente & Contacto */
        .cell-customer {
          min-width: 220px;
        }
        .customer-info-box {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .customer-name {
          font-weight: 700;
          font-size: 0.92rem;
          color: #0F172A;
        }
        .customer-meta-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .customer-dni-tag {
          font-size: 0.76rem;
          color: #64748B;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .customer-phone-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          color: #166534;
          background: #F0FDF4;
          border: 1px solid #DCFCE7;
          padding: 1px 8px;
          border-radius: 4px;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .customer-phone-link:hover {
          background: #DCFCE7;
          color: #14532D;
        }
        .customer-phone-plain {
          font-size: 0.78rem;
          color: #64748B;
        }

        /* Column: Modalidad */
        .cell-delivery {
          white-space: nowrap;
        }
        .delivery-pill-wrapper {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .badge-delivery {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          width: fit-content;
        }
        .badge-pickup {
          background: #FEF3C7;
          color: #92400E;
          border: 1px solid #FDE68A;
        }
        .badge-shipping {
          background: #E0F2FE;
          color: #0369A1;
          border: 1px solid #BAE6FD;
        }
        .delivery-subtext {
          font-size: 0.72rem;
          color: #64748B;
          padding-left: 2px;
        }

        /* Column: Total */
        .cell-total {
          white-space: nowrap;
        }
        .order-total-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.01em;
        }

        /* Column: Pago */
        .cell-payment {
          white-space: nowrap;
        }
        .badge-payment {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
          border-radius: 9999px;
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .badge-payment-approved {
          background: #DCFCE7;
          color: #15803D;
          border: 1px solid #BBF7D0;
        }
        .badge-payment-pending {
          background: #FEF3C7;
          color: #B45309;
          border: 1px solid #FDE68A;
        }

        /* Column: Estado Logístico (Refined Selector) */
        .cell-status {
          white-space: nowrap;
        }
        .status-selector {
          height: 34px;
          padding: 0 10px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          outline: none;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .status-selector--preparing {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          color: #B45309;
        }
        .status-selector--ready_for_pickup {
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #047857;
        }
        .status-selector--shipped {
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          color: #1D4ED8;
        }
        .status-selector--delivered {
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #334155;
        }
        .status-selector--unfulfilled {
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #B91C1C;
        }

        /* Column: Acciones */
        .cell-actions {
          white-space: nowrap;
          text-align: center;
        }
        .actions-cluster {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .btn-action-view {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #334155;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-action-view:hover {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .btn-action-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #1E293B;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-action-label:hover {
          background: #0284C7;
          color: #FFFFFF;
          border-color: #0284C7;
        }
        .btn-action-wa {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #16A34A;
          color: #FFFFFF;
          padding: 6px 11px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .btn-action-wa--pickup {
          background: #059669;
        }
        .btn-action-wa--pickup:hover {
          background: #047857;
        }
        .btn-action-wa--shipped {
          background: #2563EB;
        }
        .btn-action-wa--shipped:hover {
          background: #1D4ED8;
        }

        /* Thermal Label Modal Specifics */
        .modal-card--label {
          max-width: 520px;
        }
        .thermal-label-container {
          padding: 1.5rem;
          background: #F1F5F9;
          overflow-y: auto;
          display: flex;
          justify-content: center;
        }
        .thermal-label-box {
          background: #FFFFFF;
          border: 2px dashed #0F172A;
          border-radius: 8px;
          padding: 1.5rem;
          width: 100%;
          max-width: 440px;
          font-family: 'Courier New', Courier, monospace;
          color: #000000;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        }
        .label-brand-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .label-logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .label-logo {
          width: 38px;
          height: 38px;
          object-fit: contain;
        }
        .label-brand-name {
          font-family: sans-serif;
          font-size: 0.95rem;
          font-weight: 900;
          display: block;
        }
        .label-brand-sub {
          font-family: sans-serif;
          font-size: 0.7rem;
          color: #475569;
          display: block;
        }
        .label-order-tag {
          text-align: right;
          font-family: sans-serif;
        }
        .label-order-tag span {
          display: block;
          font-size: 0.65rem;
          color: #64748B;
        }
        .label-order-tag strong {
          font-size: 1.1rem;
          font-weight: 900;
        }
        .label-divider-heavy {
          height: 3px;
          background: #000000;
          margin: 12px 0;
        }
        .label-divider {
          height: 1px;
          border-top: 1px dashed #94A3B8;
          margin: 12px 0;
        }
        .label-section-title {
          font-family: sans-serif;
          font-size: 0.7rem;
          font-weight: 800;
          color: #64748B;
          display: block;
          margin-bottom: 4px;
        }
        .label-dest-name {
          font-family: sans-serif;
          font-size: 1.15rem;
          font-weight: 900;
          margin-bottom: 4px;
        }
        .label-dest-row {
          display: flex;
          gap: 16px;
          font-size: 0.85rem;
          margin-bottom: 6px;
        }
        .label-dest-address {
          font-size: 0.85rem;
          line-height: 1.4;
          background: #F8FAFC;
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid #E2E8F0;
        }
        .label-pickup-text {
          color: #047857;
          font-weight: 800;
        }
        .label-shipping-text {
          color: #1D4ED8;
          font-weight: 700;
        }
        .label-items-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.82rem;
        }
        .label-item-row {
          display: flex;
          gap: 8px;
        }
        .label-item-qty {
          font-weight: 800;
          width: 24px;
        }
        .label-footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .label-footnote {
          font-family: sans-serif;
          font-size: 0.72rem;
          font-weight: 800;
          display: block;
        }
        .label-footnote-sub {
          font-family: sans-serif;
          font-size: 0.68rem;
          color: #64748B;
          display: block;
        }
        .label-total-box {
          text-align: right;
          font-family: sans-serif;
        }
        .label-total-box span {
          display: block;
          font-size: 0.65rem;
          color: #64748B;
        }
        .label-total-box strong {
          font-size: 1.05rem;
          font-weight: 900;
        }

        .empty-table-cell {
          text-align: center;
          padding: 48px 16px;
        }

        /* Modal / Remito Styles */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .modal-card {
          background: #FFFFFF;
          border-radius: 16px;
          max-width: 720px;
          width: 100%;
          max-height: 92vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }
        .modal-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          border-bottom: 1px solid #E2E8F0;
          background: #FFFFFF;
        }
        .modal-topbar-left h2 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 2px 0;
          letter-spacing: -0.01em;
        }
        .modal-date-sub {
          font-size: 0.8rem;
          color: #64748B;
        }
        .modal-topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-modal-print {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #334155;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-modal-print:hover {
          background: #E2E8F0;
          color: #0F172A;
        }
        .btn-modal-close {
          background: transparent;
          border: none;
          color: #64748B;
          padding: 6px;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-modal-close:hover {
          background: #F1F5F9;
          color: #0F172A;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #F8FAFC;
        }

        .remito-store-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
        }
        .store-banner-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .remito-logo-img {
          height: 42px;
          width: auto;
          object-fit: contain;
        }
        .remito-brand-name {
          font-size: 1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 2px 0;
        }
        .remito-brand-address {
          font-size: 0.74rem;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }
        .badge-remito-status {
          background: #0F172A;
          color: #FFFFFF;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.04em;
        }

        .modal-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .modal-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }

        .modal-detail-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 16px;
        }
        .detail-card-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 10px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid #F1F5F9;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .detail-line {
          font-size: 0.82rem;
          color: #475569;
          margin: 0 0 6px 0;
          line-height: 1.4;
        }
        .detail-line strong {
          color: #0F172A;
        }

        .modal-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }
        .modal-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          font-size: 0.84rem;
        }
        .item-name-col {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .item-title {
          font-weight: 700;
          color: #0F172A;
        }
        .item-variant {
          font-size: 0.76rem;
          color: #64748B;
        }
        .item-sku {
          font-size: 0.70rem;
          color: #94A3B8;
        }
        .qty-tag {
          font-weight: 800;
          color: #0F172A;
          background: #E2E8F0;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .item-price-col {
          font-weight: 700;
          color: #0F172A;
        }

        .modal-totals-block {
          border-top: 1px dashed #CBD5E1;
          padding-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .totals-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          color: #64748B;
        }
        .totals-line.text-success {
          color: #16A34A;
          font-weight: 600;
        }
        .totals-grand-total {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          padding-top: 6px;
          border-top: 1px solid #E2E8F0;
          margin-top: 2px;
        }

        .tracking-section {
          background: #EFF6FF;
          border-color: #BFDBFE;
        }
        .tracking-controls-row {
          display: flex;
          gap: 8px;
        }
        .tracking-input {
          flex: 1;
          height: 38px;
          padding: 0 12px;
          border: 1px solid #93C5FD;
          border-radius: 6px;
          font-size: 0.85rem;
          background: #FFFFFF;
          outline: none;
        }
        .btn-save-tracking {
          background: #1D4ED8;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0 14px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .current-tracking-tag {
          font-size: 0.78rem;
          color: #1E40AF;
          margin-top: 6px;
          display: block;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-top: 1px solid #E2E8F0;
          background: #FFFFFF;
        }
        .btn-modal-back {
          background: #F1F5F9;
          border: 1px solid #CBD5E1;
          color: #475569;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-modal-wa-send {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #16A34A;
          color: #FFFFFF;
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .btn-modal-wa-send:hover {
          background: #15803D;
        }

        /* Print Media Styles */
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-backdrop, .modal-card, .modal-card * {
            visibility: visible;
          }
          .modal-backdrop {
            position: absolute;
            left: 0;
            top: 0;
            padding: 0;
            background: none;
          }
          .modal-topbar-actions, .modal-footer, .tracking-section {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
