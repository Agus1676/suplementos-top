import React, { useState, useMemo } from 'react';
import { 
  Archive, 
  Search, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  Check, 
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';

export const AdminStock: React.FC = () => {
  const { products, updateProductStock } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isCounterSaleOpen, setIsCounterSaleOpen] = useState(false);

  // Restock Form
  const [selectedVariantKey, setSelectedVariantKey] = useState('');
  const [restockAmount, setRestockAmount] = useState(10);

  // Counter Sale Form
  const [saleVariantKey, setSaleVariantKey] = useState('');
  const [saleQty, setSaleQty] = useState(1);
  const [saleCustomer, setSaleCustomer] = useState('');
  const [salePayment, setSalePayment] = useState('efectivo');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Flat list of all product variants
  const allVariants = useMemo(() => {
    return products.flatMap((p) =>
      p.variants.map((v) => ({
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        imageUrl: p.images[0]?.url || '/logo.png',
        variantId: v.id,
        variantTitle: v.title,
        flavor: v.flavor,
        size: v.size,
        sku: v.sku,
        priceInCents: v.priceInCents,
        stock: v.stock,
      }))
    );
  }, [products]);

  // Overall metrics
  const totalUnits = useMemo(() => allVariants.reduce((sum, v) => sum + v.stock, 0), [allVariants]);
  const lowStockCount = useMemo(() => allVariants.filter((v) => v.stock > 0 && v.stock <= 5).length, [allVariants]);
  const outOfStockCount = useMemo(() => allVariants.filter((v) => v.stock <= 0).length, [allVariants]);

  // Filtered variants
  const filtered = useMemo(() => {
    return allVariants.filter((item) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.productName.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesSku = item.sku.toLowerCase().includes(q);
        const matchesFlavor = (item.flavor || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesSku && !matchesFlavor) return false;
      }

      if (categoryFilter !== 'all' && item.categorySlug !== categoryFilter) {
        return false;
      }

      if (statusFilter === 'available' && item.stock <= 5) return false;
      if (statusFilter === 'low' && (item.stock <= 0 || item.stock > 5)) return false;
      if (statusFilter === 'out' && item.stock > 0) return false;

      return true;
    });
  }, [allVariants, searchTerm, statusFilter, categoryFilter]);

  // Quick delta (+1 / -1)
  const handleDelta = (productId: string, variantId: string, current: number, delta: number) => {
    const next = Math.max(0, current + delta);
    updateProductStock(productId, variantId, next);
    showToast(`Stock actualizado a ${next} unidades`);
  };

  // Submit direct inline edit
  const handleInlineSubmit = (productId: string, variantId: string) => {
    const num = parseInt(editValue, 10);
    if (isNaN(num) || num < 0) {
      showToast('Por favor ingresá un número válido mayor o igual a 0');
      return;
    }
    updateProductStock(productId, variantId, num);
    setEditingId(null);
    showToast(`Stock fijado en ${num} unidades`);
  };

  // Handle Restock Submit
  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariantKey) {
      showToast('Seleccioná un suplemento para reponer');
      return;
    }
    const [pId, vId] = selectedVariantKey.split(':::');
    const target = allVariants.find((v) => v.productId === pId && v.variantId === vId);
    if (!target) return;

    const next = target.stock + Number(restockAmount);
    updateProductStock(pId, vId, next);
    setIsRestockOpen(false);
    setSelectedVariantKey('');
    showToast(`Ingreso registrado: +${restockAmount} un. para ${target.productName} (${target.variantTitle})`);
  };

  // Handle Counter Sale Submit (Gym Top Shape)
  const handleCounterSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleVariantKey) {
      showToast('Seleccioná un suplemento vendido');
      return;
    }
    const [pId, vId] = saleVariantKey.split(':::');
    const target = allVariants.find((v) => v.productId === pId && v.variantId === vId);
    if (!target) return;

    if (target.stock < saleQty) {
      showToast(`Stock insuficiente. Quedan solo ${target.stock} unidades`);
      return;
    }

    const next = Math.max(0, target.stock - Number(saleQty));
    updateProductStock(pId, vId, next);
    setIsCounterSaleOpen(false);
    setSaleVariantKey('');
    setSaleCustomer('');
    showToast(`Venta mostrador registrada: -${saleQty} un. de ${target.productName}`);
  };

  return (
    <div className="stock-page">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="stock-toast">
          <Check size={16} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Control de Stock & Existencias</h1>
          <p className="page-sub">
            Gestión en tiempo real del inventario físico en <strong>Gimnasio Top Shape (Pres. José E. Uriburu 1163)</strong>.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => setIsCounterSaleOpen(true)} className="btn btn-secondary btn-sm">
            <ShoppingBag size={15} />
            <span>Venta Mostrador Gimnasio</span>
          </button>
          <button onClick={() => setIsRestockOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Ingreso de Mercadería</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stock-stats-grid">
        <div className="stock-stat-card">
          <div className="stat-icon icon-blue">
            <Package size={22} />
          </div>
          <div>
            <span className="stat-num">{allVariants.length}</span>
            <span className="stat-lbl">Variantes Activas</span>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stat-icon icon-green">
            <Archive size={22} />
          </div>
          <div>
            <span className="stat-num">{totalUnits}</span>
            <span className="stat-lbl">Unidades Físicas Totales</span>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stat-icon icon-amber">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span className="stat-num">{lowStockCount}</span>
            <span className="stat-lbl">En Stock Crítico (≤ 5 un.)</span>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stat-icon icon-rose">
            <X size={22} />
          </div>
          <div>
            <span className="stat-num">{outOfStockCount}</span>
            <span className="stat-lbl">Agotados (0 un.)</span>
          </div>
        </div>
      </div>

      {/* Toolbar: Search and Filter Tabs */}
      <div className="stock-toolbar-card">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por suplemento, marca (Star, ENA, ON), sabor o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las categorías</option>
            <option value="proteinas">Proteínas</option>
            <option value="creatinas">Creatinas</option>
            <option value="pre-entrenos">Pre-Entrenos</option>
            <option value="combos">Combos & Packs</option>
            <option value="aminoacidos">Aminoácidos</option>
            <option value="salud-vitaminas">Salud & Vitaminas</option>
          </select>

          <div className="status-pills">
            <button
              onClick={() => setStatusFilter('all')}
              className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
            >
              Todos ({allVariants.length})
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`pill-btn ${statusFilter === 'available' ? 'active' : ''}`}
            >
              Óptimos
            </button>
            <button
              onClick={() => setStatusFilter('low')}
              className={`pill-btn pill-amber ${statusFilter === 'low' ? 'active' : ''}`}
            >
              Stock Bajo ({lowStockCount})
            </button>
            <button
              onClick={() => setStatusFilter('out')}
              className={`pill-btn pill-rose ${statusFilter === 'out' ? 'active' : ''}`}
            >
              Agotados ({outOfStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="stock-table-card">
        <div className="table-responsive">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Suplemento & Marca</th>
                <th>Sabor / Presentación</th>
                <th>SKU</th>
                <th>Precio Unit.</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Existencias Físicas</th>
                <th style={{ textAlign: 'right' }}>Ajuste Rápido</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No se encontraron variantes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isLow = item.stock > 0 && item.stock <= 5;
                  const isOut = item.stock <= 0;
                  const rowKey = `${item.productId}-${item.variantId}`;
                  const isEditingThis = editingId === rowKey;

                  return (
                    <tr key={rowKey} className={isOut ? 'row-out' : isLow ? 'row-low' : ''}>
                      <td>
                        <div className="product-cell">
                          <img src={item.imageUrl} alt={item.productName} className="stock-thumb" />
                          <div>
                            <strong className="product-name">{item.productName}</strong>
                            <span className="brand-sub">{item.brand} • {item.categoryName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="variant-tag">{item.variantTitle}</span>
                      </td>
                      <td>
                        <code className="sku-code">{item.sku}</code>
                      </td>
                      <td>
                        <strong className="price-text">{formatARS(item.priceInCents)}</strong>
                      </td>
                      <td>
                        {isOut ? (
                          <span className="badge-pill badge-out">Sin Stock (0)</span>
                        ) : isLow ? (
                          <span className="badge-pill badge-low">Crítico ({item.stock})</span>
                        ) : (
                          <span className="badge-pill badge-ok">Normal</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isEditingThis ? (
                          <div className="inline-edit-box">
                            <input
                              type="number"
                              min="0"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="inline-input"
                              autoFocus
                            />
                            <button
                              onClick={() => handleInlineSubmit(item.productId, item.variantId)}
                              className="btn-icon-check"
                              title="Guardar"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn-icon-cancel"
                              title="Cancelar"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(rowKey);
                              setEditValue(String(item.stock));
                            }}
                            className={`stock-display-btn ${isOut ? 'out' : isLow ? 'low' : ''}`}
                            title="Hacé clic para editar el número exacto"
                          >
                            <span>{item.stock}</span>
                            <span className="unit-label">unidades</span>
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="stepper-wrap">
                          <button
                            onClick={() => handleDelta(item.productId, item.variantId, item.stock, -1)}
                            disabled={item.stock <= 0}
                            className="btn-step"
                            title="Descontar 1 unidad"
                          >
                            <Minus size={13} />
                          </button>
                          <button
                            onClick={() => handleDelta(item.productId, item.variantId, item.stock, 1)}
                            className="btn-step"
                            title="Sumar 1 unidad"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            onClick={() => handleDelta(item.productId, item.variantId, item.stock, 5)}
                            className="btn-step-bulk"
                            title="Sumar lote de 5 unidades"
                          >
                            +5
                          </button>
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

      {/* MODAL 1: Ingreso de Mercadería (Restock) */}
      {isRestockOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>📦 Ingreso de Mercadería (Reposición)</h3>
              <button onClick={() => setIsRestockOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRestockSubmit} className="modal-body">
              <label className="form-label">Seleccioná el producto y variante:</label>
              <select
                value={selectedVariantKey}
                onChange={(e) => setSelectedVariantKey(e.target.value)}
                className="form-select"
                required
              >
                <option value="">-- Seleccionar suplemento --</option>
                {allVariants.map((v) => (
                  <option key={`${v.productId}:::${v.variantId}`} value={`${v.productId}:::${v.variantId}`}>
                    {v.productName} ({v.variantTitle}) — Stock actual: {v.stock} un.
                  </option>
                ))}
              </select>

              <label className="form-label mt-3">Cantidad de unidades a sumar:</label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="form-input"
                required
              />

              <div className="modal-footer mt-4">
                <button type="button" onClick={() => setIsRestockOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Sumar al Stock Físico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Venta Mostrador Gimnasio (Counter Sale) */}
      {isCounterSaleOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>🛒 Venta Mostrador — Gimnasio Top Shape</h3>
              <button onClick={() => setIsCounterSaleOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCounterSaleSubmit} className="modal-body">
              <p className="modal-hint">
                Registrá una venta directa en el mostrador para descontar el stock al instante y mantener sincronizada la tienda web.
              </p>

              <label className="form-label">Suplemento vendido:</label>
              <select
                value={saleVariantKey}
                onChange={(e) => setSaleVariantKey(e.target.value)}
                className="form-select"
                required
              >
                <option value="">-- Seleccionar suplemento --</option>
                {allVariants.filter((v) => v.stock > 0).map((v) => (
                  <option key={`${v.productId}:::${v.variantId}`} value={`${v.productId}:::${v.variantId}`}>
                    {v.productName} ({v.variantTitle}) — {formatARS(v.priceInCents)} (Quedan: {v.stock} un.)
                  </option>
                ))}
              </select>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="form-label">Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    value={saleQty}
                    onChange={(e) => setSaleQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Forma de Pago:</label>
                  <select
                    value={salePayment}
                    onChange={(e) => setSalePayment(e.target.value)}
                    className="form-select"
                  >
                    <option value="efectivo">Efectivo en mano</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                    <option value="mercadopago">Mercado Pago (QR / Link)</option>
                  </select>
                </div>
              </div>

              <label className="form-label mt-3">Nombre del Alumno / Cliente (Opcional):</label>
              <input
                type="text"
                placeholder="Ej: Socio del Gym o Comprador..."
                value={saleCustomer}
                onChange={(e) => setSaleCustomer(e.target.value)}
                className="form-input"
              />

              <div className="modal-footer mt-4">
                <button type="button" onClick={() => setIsCounterSaleOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar Venta & Descontar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .stock-page {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.75rem;
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
        .header-actions {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }
        .stock-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #0F172A;
          color: #FFFFFF;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 1000;
          font-weight: 600;
          font-size: 0.88rem;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        /* Stats Grid */
        .stock-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.75rem;
        }
        .stock-stat-card {
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
        .stock-stat-card:hover {
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
        .icon-blue { background: #EFF6FF; color: #2563EB; }
        .icon-green { background: #F0FDF4; color: #16A34A; }
        .icon-amber { background: #FEF3C7; color: #D97706; }
        .icon-rose { background: #FEF2F2; color: #DC2626; }
        .stat-num {
          display: block;
          font-size: 1.6rem;
          font-weight: 800;
          color: #0F172A;
          line-height: 1.15;
        }
        .stat-lbl {
          font-size: 0.8rem;
          color: #64748B;
          font-weight: 500;
        }
        /* Toolbar */
        .stock-toolbar-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .search-wrap {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }
        .search-input {
          width: 100%;
          height: 42px;
          padding: 0 1rem 0 2.75rem;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #0F172A;
          outline: none;
        }
        .search-input:focus {
          border-color: #0F172A;
        }
        .filter-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .filter-select {
          height: 38px;
          padding: 0 0.85rem;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.84rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
        }
        .status-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }
        .pill-btn {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #64748B;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .pill-btn:hover {
          background: #F8FAFC;
          color: #0F172A;
        }
        .pill-btn.active {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }
        .pill-amber.active { background: #D97706; border-color: #D97706; }
        .pill-rose.active { background: #DC2626; border-color: #DC2626; }
        /* Table */
        .stock-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .stock-table {
          width: 100%;
          min-width: 820px;
          border-collapse: collapse;
          font-size: 0.86rem;
        }
        .stock-table th {
          background: #F8FAFC;
          color: #64748B;
          font-weight: 700;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid #E2E8F0;
          text-align: left;
        }
        .stock-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
          vertical-align: middle;
        }
        .stock-table tr:hover td {
          background: #F8FAFC;
        }
        .row-low td {
          background: #FFFBEB;
        }
        .row-out td {
          background: #FEF2F2;
        }
        .product-cell {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .stock-thumb {
          width: 44px;
          height: 44px;
          object-fit: contain;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 2px;
          flex-shrink: 0;
        }
        .product-name {
          display: block;
          color: #0F172A;
          font-size: 0.88rem;
        }
        .brand-sub {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
        }
        .variant-tag {
          font-weight: 700;
          font-size: 0.82rem;
          color: #0F172A;
        }
        .sku-code {
          font-family: monospace;
          font-size: 0.75rem;
          background: #F1F5F9;
          padding: 0.2rem 0.45rem;
          border-radius: 4px;
          color: #475569;
        }
        .price-text {
          font-size: 0.88rem;
          color: #0F172A;
        }
        .badge-pill {
          display: inline-flex;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
        }
        .badge-ok { background: #DCFCE7; color: #166534; }
        .badge-low { background: #FEF3C7; color: #92400E; }
        .badge-out { background: #FEE2E2; color: #991B1B; }
        .stock-display-btn {
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
          cursor: pointer;
          transition: all 0.15s ease;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }
        .stock-display-btn:hover {
          border-color: #0F172A;
          background: #F8FAFC;
        }
        .stock-display-btn.low { color: #D97706; border-color: #FCD34D; }
        .stock-display-btn.out { color: #DC2626; border-color: #FCA5A5; }
        .unit-label { font-size: 0.65rem; color: #94A3B8; font-weight: 500; }
        .inline-edit-box {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .inline-input {
          width: 60px;
          height: 32px;
          text-align: center;
          border: 2px solid #0F172A;
          border-radius: 4px;
          font-weight: 800;
          outline: none;
        }
        .btn-icon-check {
          background: #16A34A;
          color: #FFFFFF;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .btn-icon-cancel {
          background: #F1F5F9;
          color: #64748B;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stepper-wrap {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }
        .btn-step {
          width: 32px;
          height: 32px;
          border: 1px solid #CBD5E1;
          background: #FFFFFF;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s ease;
          color: #1E293B;
        }
        .btn-step:hover:not(:disabled) {
          border-color: #0F172A;
          background: #F8FAFC;
        }
        .btn-step:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .btn-step-bulk {
          height: 32px;
          padding: 0 0.55rem;
          border: 1px solid #CBD5E1;
          background: #F8FAFC;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #0F172A;
          cursor: pointer;
        }
        .btn-step-bulk:hover {
          background: #E2E8F0;
        }
        /* Modals */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 1rem;
        }
        .modal-card {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
          overflow: hidden;
          animation: popIn 0.18s ease;
        }
        @keyframes popIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
        }
        .modal-close-btn {
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
        }
        .modal-hint {
          font-size: 0.82rem;
          color: #64748B;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 0.4rem;
        }
        .form-select, .form-input {
          width: 100%;
          height: 42px;
          padding: 0 0.85rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.88rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
        }
        .form-select:focus, .form-input:focus {
          border-color: #0F172A;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
};