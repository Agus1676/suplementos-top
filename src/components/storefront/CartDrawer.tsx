import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatInstallments } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    addItem,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    subtotalInCents,
    totalItemsCount,
  } = useCart();
  const { products } = useStore();

  const navigate = useNavigate();

  const upsellProducts = products
    .filter((p) => !items.some((i) => i.productId === p.id))
    .slice(0, 2);

  if (!isCartDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={closeCartDrawer}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="header-title-wrap">
            <ShoppingBag size={20} className="text-primary" />
            <h3 className="cart-drawer-title">TU CARRITO ({totalItemsCount})</h3>
          </div>
          <button onClick={closeCartDrawer} className="close-btn" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Shipping & Pickup Highlight */}
        <div className="free-shipping-bar-wrap">
          <div className="free-shipping-text">
            <Truck size={16} className="text-primary" />
            <span>
              <strong>Envíos a todo el país</strong> · Retiro sin cargo en Recoleta
            </span>
          </div>
        </div>

        {/* Item List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-wrap">
                <ShoppingBag size={42} className="text-muted" />
              </div>
              <h4>TU CARRITO ESTÁ VACÍO</h4>
              <p>Descubrí nuestras proteínas, creatinas Creapure® y suplementos de alta calidad.</p>
              <button 
                onClick={() => { closeCartDrawer(); navigate('/catalogo'); }}
                className="btn btn-primary btn-sm mt-3"
              >
                EXPLORAR CATÁLOGO
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item-row">
                <img src={item.imageUrl} alt={item.productName} className="cart-item-img" />
                
                <div className="cart-item-info">
                  <h4 className="cart-item-name">{item.productName}</h4>
                  <div className="cart-item-variant">
                    {item.variantTitle}
                  </div>
                  <div className="cart-item-price">
                    {formatARS(item.priceInCents)}
                  </div>

                  <div className="cart-item-actions">
                    <div className="qty-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                        aria-label="Disminuir"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                        disabled={item.quantity >= item.maxStock}
                        aria-label="Aumentar"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                      title="Eliminar producto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Smart Upsell Recommendations */}
        {items.length > 0 && upsellProducts.length > 0 && (
          <div className="cart-drawer-upsell">
            <div className="upsell-header">
              <Zap size={13} className="text-accent" />
              <span>SUMÁ A TU PEDIDO CON 1 CLIC:</span>
            </div>
            <div className="upsell-list">
              {upsellProducts.map((prod) => {
                const variant = prod.variants[0];
                return (
                  <div key={prod.id} className="upsell-item-card">
                    <img src={prod.images[0]?.url || '/logo.png'} alt={prod.name} className="upsell-thumb" />
                    <div className="upsell-meta">
                      <span className="upsell-title">{prod.name}</span>
                      <span className="upsell-price">{formatARS(variant.priceInCents)}</span>
                    </div>
                    <button
                      onClick={() => addItem(prod, variant, 1)}
                      className="upsell-add-btn"
                      aria-label={`Agregar ${prod.name}`}
                    >
                      + AGREGAR
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Drawer Footer / Checkout CTA */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="installments-cart-pill">
              <CreditCard size={15} className="text-success" />
              <span><strong>{formatInstallments(subtotalInCents, 3)}</strong> con Mercado Pago</span>
            </div>

            <div className="cart-summary-block">
              <div className="summary-line">
                <span className="summary-label">SUBTOTAL:</span>
                <span className="summary-amount">{formatARS(subtotalInCents)}</span>
              </div>
              
              <div className="cart-shipping-box">
                <div className="shipping-main-row">
                  <span className="shipping-title">ENVÍO:</span>
                  <span className="shipping-status">A calcular en checkout</span>
                </div>
                <div className="shipping-details-row">
                  <span className="shipping-pickup-badge">✓ Retiro GRATIS en Recoleta</span>
                  <span className="shipping-country-badge">Envíos a todo el país</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="btn btn-primary btn-block btn-lg checkout-cta"
            >
              <span>INICIAR COMPRA</span>
              <ArrowRight size={18} />
            </button>

            <div className="cart-security-badge">
              <ShieldCheck size={15} className="text-success" />
              <span>Compra 100% segura con Mercado Pago</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.6);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer-panel {
          width: 100%;
          max-width: 420px;
          height: 100%;
          background: #FFFFFF;
          border-left: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 25px rgba(0, 0, 0, 0.1);
          animation: slideLeft 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .cart-drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          background: #FFFFFF;
        }
        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .cart-drawer-title {
          font-size: 1.05rem;
          font-weight: 800;
          margin: 0;
          color: var(--color-text);
          letter-spacing: 0.04em;
        }
        .close-btn {
          color: var(--color-text-muted);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          color: var(--color-text);
          background: #F3F4F6;
        }
        .free-shipping-bar-wrap {
          background-color: #F9FAFB;
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .free-shipping-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          color: var(--color-text-muted);
        }
        .progress-track {
          width: 100%;
          height: 6px;
          background: #E5E7EB;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .bg-primary {
          background-color: var(--color-accent);
        }
        .bg-success {
          background-color: var(--color-success);
        }
        .cart-drawer-items {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .cart-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          gap: 0.65rem;
          color: var(--color-text-muted);
          padding: 2rem 1rem;
        }
        .cart-empty-state h4 {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-text);
          letter-spacing: 0.03em;
        }
        .cart-empty-state p {
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .empty-icon-wrap {
          background: #F3F4F6;
          padding: 1.25rem;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          margin-bottom: 0.5rem;
        }
        .cart-item-row {
          display: flex;
          gap: 1rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }
        .cart-item-img {
          width: 72px;
          height: 72px;
          object-fit: contain;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
          background: #F9FAFB;
          padding: 0.35rem;
        }
        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .cart-item-name {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text);
          line-height: 1.25;
        }
        .cart-item-variant {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .cart-item-price {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-text);
          margin-top: 0.2rem;
        }
        .cart-item-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 0.5rem;
        }
        .qty-controls {
          display: flex;
          align-items: center;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .qty-btn {
          padding: 0.3rem 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text);
        }
        .qty-btn:disabled {
          opacity: 0.3;
        }
        .qty-val {
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 700;
          padding: 0 0.4rem;
          min-width: 20px;
          text-align: center;
          color: var(--color-text);
        }
        .remove-btn {
          color: var(--color-text-muted);
          padding: 0.35rem;
          transition: color 0.15s;
        }
        .remove-btn:hover {
          color: var(--color-accent);
        }
        .cart-drawer-upsell {
          background: #F8FAFC;
          border-top: 1px solid var(--color-border);
          padding: 0.75rem 1.25rem;
        }
        .upsell-header {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--color-text-main);
          margin-bottom: 0.5rem;
        }
        .upsell-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }
        .upsell-item-card {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 0.4rem 0.65rem;
        }
        .upsell-thumb {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .upsell-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }
        .upsell-title {
          font-size: 0.74rem;
          font-weight: 700;
          color: var(--color-text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .upsell-price {
          font-size: 0.74rem;
          font-weight: 800;
          color: var(--color-text-main);
        }
        .upsell-add-btn {
          background: var(--color-accent);
          color: #FFFFFF;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s ease;
        }
        .upsell-add-btn:hover {
          background: var(--color-accent-hover);
        }
        .cart-drawer-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--color-border);
          background: #FAFAFA;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .installments-cart-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .cart-summary-block {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          background: #FFFFFF;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--color-border);
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 0.75rem;
        }
        .summary-label {
          font-weight: 800;
          color: var(--color-text-muted);
          font-size: 0.82rem;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .summary-amount {
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--color-text);
          text-align: right;
        }
        .cart-shipping-box {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 0.6rem;
          border-top: 1px dashed var(--color-border);
        }
        .shipping-main-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
        }
        .shipping-title {
          font-size: 0.78rem;
          font-weight: 800;
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .shipping-status {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text);
          text-align: right;
        }
        .shipping-details-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          font-size: 0.74rem;
          flex-wrap: wrap;
        }
        .shipping-pickup-badge {
          color: #166534;
          background: #DCFCE7;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
        }
        .shipping-country-badge {
          color: var(--color-text-muted);
          font-weight: 500;
        }
        .checkout-cta {
          margin-top: 0.25rem;
        }
        .cart-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.15rem;
        }
        @media (max-width: 420px) {
          .cart-drawer-header {
            padding: 1rem 1.15rem;
          }
          .free-shipping-bar-wrap {
            padding: 0.75rem 1.15rem;
          }
          .cart-drawer-footer {
            padding: 1rem 1.15rem;
          }
          .cart-items-scroll {
            padding: 1rem 1.15rem;
          }
        }
      `}</style>
    </div>
  );
};
