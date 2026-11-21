import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  CreditCard, 
  Truck, 
  MapPin, 
  Download
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatDate } from '../../lib/utils';

export const AdminReports: React.FC = () => {
  const { orders } = useStore();
  const [period, setPeriod] = useState<'today' | 'yesterday' | '7d' | '30d' | 'all'>('30d');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'mercadopago' | 'transfer'>('all');

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter((o) => {
      const orderDate = new Date(o.createdAt);

      if (period === 'today') {
        if (orderDate.toDateString() !== now.toDateString()) return false;
      } else if (period === 'yesterday') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        if (orderDate.toDateString() !== y.toDateString()) return false;
      } else if (period === '7d') {
        const d7 = new Date();
        d7.setDate(d7.getDate() - 7);
        if (orderDate < d7) return false;
      } else if (period === '30d') {
        const d30 = new Date();
        d30.setDate(d30.getDate() - 30);
        if (orderDate < d30) return false;
      }

      const method = (o.paymentMethod || '').toLowerCase();
      if (paymentFilter === 'mercadopago') {
        if (!method.includes('mercado pago')) return false;
      } else if (paymentFilter === 'transfer') {
        if (!method.includes('transferencia')) return false;
      }

      return true;
    });
  }, [orders, period, paymentFilter]);

  // Approved sales
  const approvedOrders = useMemo(() => {
    return filteredOrders.filter((o) => o.paymentStatus === 'approved');
  }, [filteredOrders]);

  const totalRevenue = useMemo(() => {
    return approvedOrders.reduce((sum, o) => sum + o.totalInCents, 0);
  }, [approvedOrders]);

  const avgTicket = useMemo(() => {
    return approvedOrders.length > 0 ? Math.round(totalRevenue / approvedOrders.length) : 0;
  }, [approvedOrders, totalRevenue]);

  // Methods breakdown
  const mpSales = useMemo(() => {
    return approvedOrders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('mercado pago'));
  }, [approvedOrders]);

  const transferSales = useMemo(() => {
    return approvedOrders.filter((o) => (o.paymentMethod || '').toLowerCase().includes('transferencia'));
  }, [approvedOrders]);

  const mpTotal = mpSales.reduce((sum, o) => sum + o.totalInCents, 0);
  const transferTotal = transferSales.reduce((sum, o) => sum + o.totalInCents, 0);

  // Logistics breakdown
  const pickupOrders = approvedOrders.filter((o) => o.deliveryMethod === 'pickup');
  const shippingOrders = approvedOrders.filter((o) => o.deliveryMethod === 'shipping');

  const handleExportCSV = () => {
    const headers = ['Pedido', 'Fecha', 'Cliente', 'DNI', 'Telefono', 'Metodo Pago', 'Logistica', 'Total ARS'];
    const rows = filteredOrders.map((o) => [
      o.orderNumber,
      formatDate(o.createdAt),
      `"${o.customerName}"`,
      o.customerDni,
      o.customerPhone,
      `"${o.paymentMethod || 'No especificado'}"`,
      o.deliveryMethod === 'pickup' ? 'Retiro Gimnasio Top Shape' : 'Envio a Domicilio',
      (o.totalInCents / 100).toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_ventas_suplementos_top_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-page">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Reportes & Analíticas de Ventas</h1>
          <p className="page-sub">
            Métricas de ingresos, tickets promedio y rendimiento de canales de pago de <strong>Suplementos Top</strong>.
          </p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
          <Download size={15} />
          <span>Exportar a Excel / CSV</span>
        </button>
      </div>

      {/* Period Filter Bar */}
      <div className="period-bar-card">
        <div className="period-label-group">
          <Calendar size={18} className="text-muted" />
          <span>Período de análisis:</span>
        </div>
        <div className="period-buttons">
          <button onClick={() => setPeriod('today')} className={`p-btn ${period === 'today' ? 'active' : ''}`}>
            Hoy
          </button>
          <button onClick={() => setPeriod('yesterday')} className={`p-btn ${period === 'yesterday' ? 'active' : ''}`}>
            Ayer
          </button>
          <button onClick={() => setPeriod('7d')} className={`p-btn ${period === '7d' ? 'active' : ''}`}>
            Últimos 7 días
          </button>
          <button onClick={() => setPeriod('30d')} className={`p-btn ${period === '30d' ? 'active' : ''}`}>
            Últimos 30 días
          </button>
          <button onClick={() => setPeriod('all')} className={`p-btn ${period === 'all' ? 'active' : ''}`}>
            Todo el Historial
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="reports-metrics-grid">
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="stat-val">{formatARS(totalRevenue)}</span>
            <span className="stat-lbl">Facturación Neta Aprobada</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="stat-val">{approvedOrders.length}</span>
            <span className="stat-lbl">Ventas Concretadas</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="stat-val">{formatARS(avgTicket)}</span>
            <span className="stat-lbl">Ticket Promedio por Compra</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-purple">
            <CreditCard size={24} />
          </div>
          <div>
            <span className="stat-val">{mpSales.length} MP / {transferSales.length} Transf.</span>
            <span className="stat-lbl">Operaciones por Canal</span>
          </div>
        </div>
      </div>

      {/* 2 Comparison Cards: Payments & Logistics */}
      <div className="comparison-grid">
        <div className="comp-card">
          <h3 className="comp-title">Canales de Cobro</h3>
          <div className="comp-rows">
            <div className="comp-row">
              <div className="comp-info">
                <strong>Mercado Pago Checkout Pro</strong>
                <span>{mpSales.length} operaciones aprobadas</span>
              </div>
              <div className="comp-amount">
                <strong>{formatARS(mpTotal)}</strong>
                <span>{totalRevenue > 0 ? Math.round((mpTotal / totalRevenue) * 100) : 0}%</span>
              </div>
            </div>
            <div className="comp-row">
              <div className="comp-info">
                <strong>Transferencia Bancaria (10% OFF)</strong>
                <span>{transferSales.length} operaciones</span>
              </div>
              <div className="comp-amount">
                <strong>{formatARS(transferTotal)}</strong>
                <span>{totalRevenue > 0 ? Math.round((transferTotal / totalRevenue) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="comp-card">
          <h3 className="comp-title">Modalidad de Despacho</h3>
          <div className="comp-rows">
            <div className="comp-row">
              <div className="comp-info">
                <span className="pill-ico icon-green-sm"><MapPin size={13} /></span>
                <div>
                  <strong>Retiro en Gimnasio Top Shape</strong>
                  <span>Pres. José E. Uriburu 1163, Recoleta</span>
                </div>
              </div>
              <div className="comp-amount">
                <strong>{pickupOrders.length} pedidos</strong>
                <span>{approvedOrders.length > 0 ? Math.round((pickupOrders.length / approvedOrders.length) * 100) : 0}%</span>
              </div>
            </div>
            <div className="comp-row">
              <div className="comp-info">
                <span className="pill-ico icon-blue-sm"><Truck size={13} /></span>
                <div>
                  <strong>Envíos a Domicilio por Correo</strong>
                  <span>Despachos a todo el país</span>
                </div>
              </div>
              <div className="comp-amount">
                <strong>{shippingOrders.length} pedidos</strong>
                <span>{approvedOrders.length > 0 ? Math.round((shippingOrders.length / approvedOrders.length) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="table-wrap-card">
        <div className="card-header-flex">
          <h3>Detalle de Operaciones en el Período</h3>
          <div className="payment-filter-btns">
            <button
              onClick={() => setPaymentFilter('all')}
              className={`filter-btn ${paymentFilter === 'all' ? 'active' : ''}`}
            >
              Todos
            </button>
            <button
              onClick={() => setPaymentFilter('mercadopago')}
              className={`filter-btn ${paymentFilter === 'mercadopago' ? 'active' : ''}`}
            >
              Solo Mercado Pago
            </button>
            <button
              onClick={() => setPaymentFilter('transfer')}
              className={`filter-btn ${paymentFilter === 'transfer' ? 'active' : ''}`}
            >
              Solo Transferencias
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="rep-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Medio de Pago</th>
                <th>Modalidad</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No hay transacciones registradas en este período.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>#{o.orderNumber}</strong>
                    </td>
                    <td>
                      <span className="text-muted text-xs">{formatDate(o.createdAt)}</span>
                    </td>
                    <td>
                      <strong>{o.customerName}</strong>
                      <span className="d-block text-xs text-muted">DNI: {o.customerDni}</span>
                    </td>
                    <td>
                      <span className="method-pill">{o.paymentMethod}</span>
                    </td>
                    <td>
                      {o.deliveryMethod === 'pickup' ? (
                        <span className="log-pill pickup">Retiro Top Shape</span>
                      ) : (
                        <span className="log-pill shipping">Envío Correo</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-pill ${o.paymentStatus}`}>
                        {o.paymentStatus === 'approved' ? 'Acreditado' : 'Pendiente'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <strong className="amount-text">{formatARS(o.totalInCents)}</strong>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .reports-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }
        .page-sub {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
        }
        .period-bar-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .period-label-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: #0F172A;
        }
        .period-buttons {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .p-btn {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .p-btn:hover {
          background: #F8FAFC;
          color: #0F172A;
        }
        .p-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .reports-metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .icon-green { background: #F0FDF4; color: #16A34A; }
        .icon-blue { background: #EFF6FF; color: #2563EB; }
        .icon-amber { background: #FEF3C7; color: #D97706; }
        .icon-purple { background: #FAF5FF; color: #9333EA; }
        .stat-val {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.2;
        }
        .stat-lbl {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 500;
        }
        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        @media (min-width: 800px) {
          .comparison-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .comp-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.5rem;
        }
        .comp-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 1.25rem;
        }
        .comp-rows {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .comp-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: #F8FAFC;
          border-radius: 8px;
          border: 1px solid #F1F5F9;
        }
        .comp-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .comp-info strong {
          display: block;
          font-size: 0.86rem;
          color: #0F172A;
        }
        .comp-info span {
          display: block;
          font-size: 0.74rem;
          color: #64748B;
        }
        .comp-amount {
          text-align: right;
        }
        .comp-amount strong {
          display: block;
          font-size: 0.95rem;
          color: #0F172A;
        }
        .comp-amount span {
          font-size: 0.75rem;
          color: #16A34A;
          font-weight: 700;
        }
        .pill-ico {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-green-sm { background: #DCFCE7; color: #166534; }
        .icon-blue-sm { background: #DBEAFE; color: #1D4ED8; }
        .table-wrap-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
        }
        .card-header-flex {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E2E8F0;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .card-header-flex h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
        }
        .payment-filter-btns {
          display: flex;
          gap: 0.4rem;
        }
        .filter-btn {
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: 6px;
          cursor: pointer;
        }
        .filter-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .rep-table {
          width: 100%;
          min-width: 800px;
          border-collapse: collapse;
          font-size: 0.86rem;
        }
        .rep-table th {
          background: #F8FAFC;
          color: #64748B;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid #E2E8F0;
          text-align: left;
        }
        .rep-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
          vertical-align: middle;
        }
        .rep-table tr:hover td {
          background: #F8FAFC;
        }
        .method-pill {
          font-size: 0.74rem;
          font-weight: 600;
          background: #F1F5F9;
          padding: 0.25rem 0.55rem;
          border-radius: 4px;
          color: #334155;
        }
        .log-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
        }
        .log-pill.pickup { background: #FEF3C7; color: #92400E; }
        .log-pill.shipping { background: #EFF6FF; color: #1D4ED8; }
        .status-pill {
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.22rem 0.55rem;
          border-radius: 9999px;
        }
        .status-pill.approved { background: #DCFCE7; color: #166534; }
        .status-pill.pending { background: #FEF3C7; color: #92400E; }
        .amount-text {
          font-size: 0.95rem;
          color: #0F172A;
        }
      `}</style>
    </div>
  );
};