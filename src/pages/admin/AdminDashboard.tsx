import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Archive,
  Download,
  ArrowUpRight,
  MapPin,
  Truck,
  Phone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatDate, buildWhatsAppDispatchLink } from '../../lib/utils';

export const AdminDashboard: React.FC = () => {
  const { orders, products, settings } = useStore();
  const navigate = useNavigate();

  const approvedOrders = orders.filter((o) => o.paymentStatus === 'approved');
  const totalRevenueInCents = approvedOrders.reduce((acc, o) => acc + o.totalInCents, 0);
  const totalOrdersCount = orders.length;
  const averageTicketInCents = totalOrdersCount > 0 ? Math.round(totalRevenueInCents / totalOrdersCount) : 0;

  // Flatten all variants for stock count
  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      categoryName: p.category.name,
      imageUrl: p.images[0]?.url || '/logo.png',
    }))
  );

  const lowStockVariants = allVariants.filter((v) => v.stock > 0 && v.stock <= 5);
  const outOfStockVariants = allVariants.filter((v) => v.stock <= 0);
  const criticalStockCount = lowStockVariants.length + outOfStockVariants.length;

  const handleExportBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      store: settings.storeName,
      address: settings.pickupAddress,
      products,
      orders,
      settings,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suplementos_top_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="admin-dashboard-view">
      {/* Header */}
      <div className="dashboard-title-row">
        <div>
          <h1 className="dashboard-main-title">Dashboard General</h1>
          <p className="dashboard-sub">
            Métricas de ventas, pedidos y control de existencias de <strong>{settings.storeName}</strong>.
          </p>
        </div>
        <div className="dashboard-header-btns">
          <Link to="/admin/pedidos" className="btn btn-primary btn-sm">
            <span>Gestionar Pedidos</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="metrics-grid">
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <DollarSign size={22} />
          </div>
          <div>
            <span className="stat-value">{formatARS(totalRevenueInCents)}</span>
            <span className="stat-label">Facturación Aprobada</span>
            <span className="stat-note text-success">100% Cobros MP & Transf.</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span className="stat-value">{totalOrdersCount}</span>
            <span className="stat-label">Pedidos Totales</span>
            <span className="stat-note text-muted">Transacciones registradas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <TrendingUp size={22} />
          </div>
          <div>
            <span className="stat-value">{formatARS(averageTicketInCents)}</span>
            <span className="stat-label">Ticket Promedio</span>
            <span className="stat-note text-muted">Por compra concretada</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-rose">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span className="stat-value">{criticalStockCount}</span>
            <span className="stat-label">Alertas de Inventario</span>
            <span className="stat-note text-danger font-bold">
              {outOfStockVariants.length} agotados · {lowStockVariants.length} críticos
            </span>
          </div>
        </div>
      </div>

      {/* ⚡ Acciones Operativas Rápidas (Tienda May Engine) */}
      <div className="quick-actions-card">
        <h3 className="section-title">⚡ Acciones Operativas Rápidas</h3>
        <div className="quick-buttons-row">
          <button onClick={() => navigate('/admin/productos')} className="quick-action-btn primary">
            <Plus size={16} />
            <span>Cargar Nuevo Suplemento</span>
          </button>
          <button onClick={() => navigate('/admin/productos')} className="quick-action-btn">
            <TrendingUp size={16} />
            <span>Aumento Masivo de Precios (%)</span>
          </button>
          <button onClick={() => navigate('/admin/stock')} className="quick-action-btn">
            <Archive size={16} />
            <span>Control Rápido de Stock</span>
          </button>
          <button onClick={handleExportBackup} className="quick-action-btn">
            <Download size={16} />
            <span>Descargar Copia JSON</span>
          </button>
        </div>
      </div>

      {/* ⚠️ Alertas de Inventario si hay agotados o bajo stock */}
      {criticalStockCount > 0 && (
        <div className="inventory-alerts-card">
          <div className="card-header-flex">
            <div className="title-with-icon">
              <AlertTriangle size={18} className="text-warning" />
              <h3 className="section-title" style={{ margin: 0 }}>Alertas de Inventario (Sede Recoleta)</h3>
            </div>
            <Link to="/admin/stock" className="card-link">Ir a Control de Stock →</Link>
          </div>

          <div className="inventory-alerts-list">
            {outOfStockVariants.slice(0, 3).map((item) => (
              <div key={`${item.productId}-${item.id}`} className="alert-row border-red">
                <img src={item.imageUrl} alt={item.productName} className="alert-thumb" />
                <div style={{ flex: 1 }}>
                  <strong className="alert-item-name">{item.productName}</strong>
                  <span className="alert-item-sub">{item.title} (SKU: {item.sku})</span>
                </div>
                <span className="badge-pill badge-red">Agotado (0 un.)</span>
                <Link to="/admin/stock" className="btn btn-outline-sm">Reponer</Link>
              </div>
            ))}

            {lowStockVariants.slice(0, 3).map((item) => (
              <div key={`${item.productId}-${item.id}`} className="alert-row border-amber">
                <img src={item.imageUrl} alt={item.productName} className="alert-thumb" />
                <div style={{ flex: 1 }}>
                  <strong className="alert-item-name">{item.productName}</strong>
                  <span className="alert-item-sub">{item.title} (SKU: {item.sku})</span>
                </div>
                <span className="badge-pill badge-amber">Quedan {item.stock} un.</span>
                <Link to="/admin/stock" className="btn btn-outline-sm">Ajustar</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders & Delivery Mode */}
      <div className="dashboard-grid-orders">
        <div className="card orders-summary-card">
          <div className="card-header-flex">
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>Pedidos Recientes</h3>
              <span className="text-muted text-xs">Últimas transacciones registradas</span>
            </div>
            <Link to="/admin/pedidos" className="card-link">Ver todos los pedidos</Link>
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
                  <th style={{ textAlign: 'right' }}>Acción WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748B' }}>
                      No hay pedidos registrados en la tienda todavía.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => {
                    const itemsText = order.items
                      .map((item) => `• ${item.quantity}x ${item.productName} (${item.variantTitle})`)
                      .join('\n');
                    const addressText = order.shippingAddress 
                      ? `${order.shippingAddress.street} ${order.shippingAddress.number}, ${order.shippingAddress.city}`
                      : `Retiro en Gimnasio Top Shape (Pres. José E. Uriburu 1163)`;
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
                              <MapPin size={12} /> Retiro Top Shape
                            </span>
                          ) : (
                            <span className="pill-method shipping">
                              <Truck size={12} /> Envío Correo
                            </span>
                          )}
                        </td>
                        <td>
                          <strong className="amount-text">{formatARS(order.totalInCents)}</strong>
                        </td>
                        <td>
                          <span className={`status-badge-mini ${order.fulfillmentStatus}`}>
                            {order.fulfillmentStatus === 'preparing' && 'Preparando'}
                            {order.fulfillmentStatus === 'ready_for_pickup' && 'Listo Retiro'}
                            {order.fulfillmentStatus === 'shipped' && 'Despachado'}
                            {order.fulfillmentStatus === 'delivered' && 'Entregado'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-wa-action"
                            title="Avisar por WhatsApp al cliente"
                          >
                            <Phone size={13} />
                            <span>Aviso WA</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-view {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .dashboard-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .dashboard-main-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }
        .dashboard-sub {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
        }
        .dashboard-header-btns {
          display: flex;
          gap: 0.5rem;
        }
        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .stat-card:hover {
          border-color: #CBD5E1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-green { background: #F0FDF4; color: #16A34A; }
        .icon-blue { background: #EFF6FF; color: #2563EB; }
        .icon-amber { background: #FEF3C7; color: #D97706; }
        .icon-rose { background: #FEF2F2; color: #DC2626; }
        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.15;
        }
        .stat-label {
          font-size: 0.82rem;
          color: #64748B;
          font-weight: 500;
          display: block;
        }
        .stat-note {
          font-size: 0.72rem;
          display: block;
          margin-top: 0.15rem;
        }
        /* Quick Actions Card */
        .quick-actions-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }
        .section-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 1rem;
        }
        .quick-buttons-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .quick-action-btn {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #0F172A;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          transition: all 0.15s ease;
        }
        .quick-action-btn:hover {
          background: #F8FAFC;
          border-color: #0F172A;
        }
        .quick-action-btn.primary {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .quick-action-btn.primary:hover {
          background: #1E293B;
        }
        /* Inventory Alerts Card */
        .inventory-alerts-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }
        .inventory-alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 1rem;
        }
        .alert-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
        }
        .border-red { border-left: 4px solid #DC2626; }
        .border-amber { border-left: 4px solid #D97706; }
        .alert-thumb {
          width: 38px;
          height: 38px;
          object-fit: contain;
          background: #FFFFFF;
          border-radius: 6px;
          border: 1px solid #E2E8F0;
          padding: 2px;
        }
        .alert-item-name {
          display: block;
          font-size: 0.86rem;
          color: #0F172A;
        }
        .alert-item-sub {
          display: block;
          font-size: 0.74rem;
          color: #64748B;
        }
        .badge-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
        }
        .badge-red { background: #FEE2E2; color: #991B1B; }
        .badge-amber { background: #FEF3C7; color: #92400E; }
        .btn-outline-sm {
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          color: #0F172A;
          text-decoration: none;
          transition: all 0.15s ease;
        }
        .btn-outline-sm:hover {
          background: #F1F5F9;
          border-color: #0F172A;
        }
        /* Orders Table */
        .orders-summary-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }
        .card-header-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .title-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .card-link {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-accent);
          text-decoration: none;
        }
        .card-link:hover {
          text-decoration: underline;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
        }
        .admin-table th {
          background: #F8FAFC;
          color: #64748B;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #E2E8F0;
          text-align: left;
        }
        .admin-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
          vertical-align: middle;
        }
        .admin-table tr:hover td {
          background: #F8FAFC;
        }
        .amount-text {
          font-size: 0.92rem;
          color: #0F172A;
        }
        .pill-method {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
        }
        .pill-method.pickup { background: #FEF3C7; color: #92400E; }
        .pill-method.shipping { background: #EFF6FF; color: #1D4ED8; }
        .status-badge-mini {
          display: inline-flex;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
        }
        .status-badge-mini.preparing { background: #EFF6FF; color: #1E40AF; }
        .status-badge-mini.ready_for_pickup { background: #FEF3C7; color: #92400E; }
        .status-badge-mini.shipped { background: #FAF5FF; color: #7E22CE; }
        .status-badge-mini.delivered { background: #DCFCE7; color: #166534; }
        .btn-wa-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: #16A34A;
          color: #FFFFFF;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .btn-wa-action:hover {
          background: #15803D;
        }
      `}</style>
    </div>
  );
};