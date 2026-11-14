import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatARS } from '../../lib/utils';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeItem,
    subtotalInCents,
    totalItemsCount,
    isFreeShippingEligible,
    freeShippingProgress,
    centsRemainingForFreeShipping,
  } = useCart();

  const navigate = useNavigate();

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
            <h3 className="cart-drawer-title">Tu Carrito ({totalItemsCount})</h3>
          </div>
          <button onClick={closeCartDrawer} className="close-btn" aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-bar-wrap">
          <div className="free-shipping-text">
            <Truck size={16} className={isFreeShippingEligible ? 'text-success' : 'text-accent'} />
            {isFreeShippingEligible ? (
              <span className="text-success font-bold">¡Genial! Tenés ENVÍO GRATIS a todo el país 🎉</span>
            ) : (
              <span>
                Agregá <strong>{formatARS(centsRemainingForFreeShipping)}</strong> para tener <strong>Envío Gratis</strong>
              </span>
            )}
          </div>
          <div className="progress-track">
            <div 
              className={`progress-fill ${isFreeShippingEligible ? 'bg-success' : 'bg-accent'}`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="empty-icon-wrap">
                <ShoppingBag size={48} className="text-subtle" />
              </div>
              <h4>Tu carrito está vacío</h4>
              <p>Descubrí nuestras proteínas, creatinas y suplementos de alta pureza.</p>
              <button 
                onClick={() => { closeCartDrawer(); navigate('/catalogo'); }}
                className="btn btn-primary btn-sm"
              >
                Explorar Catálogo
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
                        <Minus size={13} />
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                        disabled={item.quantity >= item.maxStock}
                        aria-label="Aumentar"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-btn"
                      title="Eliminar producto"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="summary-line">
              <span className="text-muted">Subtotal productos:</span>
              <span className="summary-amount">{formatARS(subtotalInCents)}</span>
            </div>
            
            <div className="summary-line text-xs">
              <span className="text-muted">Envío estimado:</span>
              <span>
                {isFreeShippingEligible ? (
                  <strong className="text-success">¡GRATIS!</strong>
                ) : (
                  <span>A calcular en checkout (o retiro gratis en Uriburu 1163)</span>
                )}
              </span>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="btn btn-accent btn-block btn-lg checkout-cta"
            >
              <span>Continuar al Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div className="cart-security-badge">
              <ShieldCheck size={15} className="text-success" />
              <span>Compra 100% segura con garantía oficial</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(3px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer-panel {
          width: 100%;
          max-width: 440px;
          height: 100%;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          animation: slideLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1);
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
        }
        .header-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cart-drawer-title {
          font-size: 1.15rem;
          margin: 0;
        }
        .close-btn {
          color: var(--color-text-muted);
          padding: 0.3rem;
          border-radius: var(--radius-sm);
        }
        .close-btn:hover {
          color: var(--color-primary);
          background: var(--color-bg-muted);
        }
        .free-shipping-bar-wrap {
          background-color: var(--color-bg-muted);
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .free-shipping-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.825rem;
          margin-bottom: 0.5rem;
        }
        .progress-track {
          width: 100%;
          height: 6px;
          background: #CBD5E1;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .bg-accent {
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
          gap: 0.75rem;
          color: var(--color-text-muted);
          padding: 2rem 1rem;
        }
        .empty-icon-wrap {
          background: var(--color-bg-muted);
          padding: 1.25rem;
          border-radius: 50%;
        }
        .cart-item-row {
          display: flex;
          gap: 1rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--color-border);
        }
        .cart-item-img {
          width: 76px;
          height: 76px;
          object-fit: cover;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .cart-item-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-primary);
          line-height: 1.25;
        }
        .cart-item-variant {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .cart-item-price {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--color-primary);
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
          background: var(--color-bg-muted);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .qty-btn {
          padding: 0.25rem 0.6rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-main);
        }
        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .qty-val {
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0 0.4rem;
          min-width: 20px;
          text-align: center;
        }
        .remove-btn {
          color: var(--color-text-subtle);
          padding: 0.3rem;
          transition: color 0.15s;
        }
        .remove-btn:hover {
          color: var(--color-danger);
        }
        .cart-drawer-footer {
          padding: 1.25rem 1.5rem;
          border-top: 1px solid var(--color-border);
          background: #FAFAFA;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }
        .summary-amount {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .checkout-cta {
          margin-top: 0.5rem;
        }
        .cart-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};
