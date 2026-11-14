import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight,
  Package,
  MapPin,
  Truck,
  Phone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatDate, buildWhatsAppDispatchLink } from '../../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { orders, products } = useStore();

  const totalRevenueInCents = orders
    .filter((o) => o.paymentStatus === 'approved')
    .reduce((acc, o) => acc + o.totalInCents, 0);

  const totalOrdersCount = orders.length;

  const averageTicketInCents = totalOrdersCount > 0 
    ? Math.round(totalRevenueInCents / totalOrdersCount) 
    : 0;

  const pendingFulfillmentOrders = orders.filter(
    (o) => o.fulfillmentStatus === 'preparing' || o.fulfillmentStatus === 'unfulfilled'
  );

  const lowStockVariants = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock <= 10)
      .map((v) => ({ ...v, productName: p.name }))
  );

  return (
    <div className="admin-dashboard-view">
      <div className="dashboard-title-row">
        <div>
          <h1>Dashboard General</h1>
          <p className="text-muted">
            Métricas de ventas, pedidos y control de existencias de <strong>Suplementos Top</strong>.
          </p>
        </div>
        <Link to="/admin/pedidos" className="btn btn-primary btn-sm">
          <span>Gestionar Pedidos</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="metrics-grid">
        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Facturación Aprobada</span>
            <div className="metric-icon-wrap icon-green">
              <DollarSign size={20} />
            </div>
          </div>
          <span className="metric-value">{formatARS(totalRevenueInCents)}</span>
          <span className="metric-sub text-success">100% Cobros Mercado Pago</span>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Pedidos Totales</span>
            <div className="metric-icon-wrap icon-blue">
              <ShoppingBag size={20} />
            </div>
          </div>
          <span className="metric-value">{totalOrdersCount}</span>
          <span className="metric-sub text-muted">Transacciones registradas</span>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Ticket Promedio</span>
            <div className="metric-icon-wrap icon-amber">
              <TrendingUp size={20} />
            </div>
          </div>
          <span className="metric-value">{formatARS(averageTicketInCents)}</span>
          <span className="metric-sub text-muted">Por compra concretada</span>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span className="metric-label">Pendientes Despacho</span>
            <div className="metric-icon-wrap icon-rose">
              <Clock size={20} />
            </div>
          </div>
          <span className="metric-value">{pendingFulfillmentOrders.length}</span>
          <span className="metric-sub text-danger font-bold">Requieren empaque o entrega</span>
        </div>
      </div>

      {/* 2 Columns: Recent Orders + Low Stock Alerts */}
      <div className="dashboard-grid-2">
        {/* Recent Orders Card */}
        <div className="card orders-summary-card">
          <div className="card-header-flex">
            <h3>Pedidos Recientes</h3>
            <Link to="/admin/pedidos" className="card-link">Ver todos</Link>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Modalidad</th>
                  <th>Total</th>
                  <th>Logística</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => {
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
                        <span className="d-block text-xs text-muted">{formatDate(order.createdAt)}</span>
                      </td>
                      <td>
                        <strong>{order.customerName}</strong>
                        <span className="d-block text-xs text-muted">{order.customerPhone}</span>
                      </td>
                      <td>
                        {order.deliveryMethod === 'pickup' ? (
                          <span className="pill-method pickup">
                            <MapPin size={12} /> Retiro
                          </span>
                        ) : (
                          <span className="pill-method shipping">
                            <Truck size={12} /> Envío
                          </span>
                        )}
                      </td>
                      <td>
                        <strong>{formatARS(order.totalInCents)}</strong>
                      </td>
                      <td>
                        <span className={`status-badge-mini ${order.fulfillmentStatus}`}>
                          {order.fulfillmentStatus === 'preparing' && 'Preparando'}
                          {order.fulfillmentStatus === 'ready_for_pickup' && 'Listo Retiro'}
                          {order.fulfillmentStatus === 'shipped' && 'Despachado'}
                          {order.fulfillmentStatus === 'delivered' && 'Entregado'}
                        </span>
                      </td>
                      <td>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-wa-action"
                          title="Enviar aviso de despacho por WhatsApp al 11 6565 1990"
                        >
                          <Phone size={13} />
                          <span>Aviso WA</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card stock-alert-card">
          <div className="card-header-flex">
            <div className="title-with-icon">
              <AlertTriangle size={18} className="text-warning" />
              <h3>Control de Stock Bajo</h3>
            </div>
            <Link to="/admin/productos" className="card-link">Ajustar inventario</Link>
          </div>

          <div className="stock-alerts-list">
            {lowStockVariants.length === 0 ? (
              <p className="text-muted text-sm p-3">Todo el inventario está en niveles óptimos.</p>
            ) : (
              lowStockVariants.map((item) => (
                <div key={item.id} className="stock-alert-item">
                  <div>
                    <span className="stock-item-name">{item.productName}</span>
                    <span className="stock-item-variant">{item.title} (SKU: {item.sku})</span>
                  </div>
                  <div className="stock-count-badge">
                    <span className="count-num">{item.stock}</span>
                    <span className="count-label">unidades</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="stock-footer-tip">
            <Package size={16} className="text-accent" />
            <span>Despachos y control de inventario físico centralizados en <strong>Uriburu 1163, CABA</strong>.</span>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .dashboard-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .dashboard-title-row h1 {
          font-size: 1.8rem;
          margin-bottom: 0.2rem;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1100px) {
          .metrics-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .metric-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .metric-label {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .metric-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-green { background: #ECFDF5; color: #10B981; }
        .icon-blue { background: #EFF6FF; color: #3B82F6; }
        .icon-amber { background: #FFFBEB; color: #F59E0B; }
        .icon-rose { background: #FFF1F2; color: #F43F5E; }
        .metric-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1.1;
        }
        .metric-sub {
          font-size: 0.775rem;
        }
        .dashboard-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .dashboard-grid-2 {
            grid-template-columns: 1.6fr 1fr;
          }
        }
        .orders-summary-card, .stock-alert-card {
          padding: 1.5rem;
        }
        .card-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }
        .card-header-flex h3 {
          font-size: 1.15rem;
          margin: 0;
        }
        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .card-link {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--color-accent-hover);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
          text-align: left;
        }
        .admin-table th {
          padding: 0.75rem 0.6rem;
          background: var(--color-bg-muted);
          color: var(--color-text-muted);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        .admin-table td {
          padding: 0.85rem 0.6rem;
          border-bottom: 1px solid var(--color-border);
          vertical-align: middle;
        }
        .d-block { display: block; }
        .pill-method {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .pill-method.pickup {
          background: #FEF3C7;
          color: #92400E;
        }
        .pill-method.shipping {
          background: #DBEAFE;
          color: #1E40AF;
        }
        .status-badge-mini {
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .status-badge-mini.preparing { background: #FEF3C7; color: #B45309; }
        .status-badge-mini.ready_for_pickup { background: #ECFDF5; color: #047857; }
        .status-badge-mini.shipped { background: #E0E7FF; color: #4338CA; }
        .status-badge-mini.delivered { background: #F1F5F9; color: #475569; }
        .btn-wa-action {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          background: #25D366;
          color: #FFF;
          padding: 0.35rem 0.6rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .stock-alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .stock-alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: #FFFFFF;
        }
        .stock-item-name {
          font-weight: 700;
          font-size: 0.85rem;
          display: block;
        }
        .stock-item-variant {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .stock-count-badge {
          text-align: right;
          background: #FEF2F2;
          border: 1px solid #FEE2E2;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        .count-num {
          display: block;
          font-weight: 800;
          font-size: 1rem;
          color: #DC2626;
          line-height: 1;
        }
        .count-label {
          font-size: 0.65rem;
          color: #991B1B;
        }
        .stock-footer-tip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.775rem;
          color: var(--color-text-muted);
          background: var(--color-bg-muted);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
        }
      `}</style>
    </div>
  );
};
