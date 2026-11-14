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
            <ShoppingBag size={22} className="text-gold" />
            <h3 className="cart-drawer-title">TU CARRITO ({totalItemsCount})</h3>
          </div>
          <button onClick={closeCartDrawer} className="close-btn" aria-label="Cerrar carrito">
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="free-shipping-bar-wrap">
          <div className="free-shipping-text">
            <Truck size={16} className={isFreeShippingEligible ? 'text-success' : 'text-gold'} />
            {isFreeShippingEligible ? (
              <span className="text-success font-bold">¡ENVÍO GRATIS A TODO EL PAÍS CONSEGUIDO! 🎉</span>
            ) : (
              <span>
                Agregá <strong>{formatARS(centsRemainingForFreeShipping)}</strong> para tener <strong>Envío Gratis</strong>
              </span>
            )}
          </div>
          <div className="progress-track">
            <div 
              className={`progress-fill ${isFreeShippingEligible ? 'bg-success' : 'bg-gold'}`}
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
              <h4>TU CARRITO ESTÁ VACÍO</h4>
              <p>Descubrí nuestras proteínas CFM, creatinas Creapure® y suplementos de élite.</p>
              <button 
                onClick={() => { closeCartDrawer(); navigate('/catalogo'); }}
                className="btn btn-primary btn-sm"
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
                      <Trash2 size={16} />
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
              <span className="text-muted">SUBTOTAL:</span>
              <span className="summary-amount text-gold">{formatARS(subtotalInCents)}</span>
            </div>
            
            <div className="summary-line text-xs">
              <span className="text-muted">ENVÍO ESTIMADO:</span>
              <span>
                {isFreeShippingEligible ? (
                  <strong className="text-success font-bold">¡GRATIS!</strong>
                ) : (
                  <span>A calcular en checkout (o retiro gratis en Uriburu 1163)</span>
                )}
              </span>
            </div>

            <button 
              onClick={handleCheckoutClick}
              className="btn btn-primary btn-block btn-lg checkout-cta"
            >
              <span>INICIAR CHECKOUT</span>
              <ArrowRight size={20} />
            </button>

            <div className="cart-security-badge">
              <ShieldCheck size={16} className="text-success" />
              <span>Compra 100% segura con Mercado Pago</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer-panel {
          width: 100%;
          max-width: 440px;
          height: 100%;
          background: #0D111A;
          border-left: 1px solid var(--color-border);
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
          gap: 0.6rem;
        }
        .cart-drawer-title {
          font-size: 1.25rem;
          margin: 0;
          color: #FFF;
        }
        .close-btn {
          color: var(--color-text-muted);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
        }
        .close-btn:hover {
          color: #FFF;
          background: #182032;
        }
        .free-shipping-bar-wrap {
          background-color: #121724;
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }
        .free-shipping-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          color: #CBD5E1;
        }
        .progress-track {
          width: 100%;
          height: 6px;
          background: #1E2638;
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          transition: width 0.3s ease;
        }
        .bg-gold {
          background: linear-gradient(90deg, #F3C77D, #E5B869);
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
        .cart-empty-state h4 {
          font-size: 1.25rem;
          color: #FFF;
        }
        .empty-icon-wrap {
          background: #121724;
          padding: 1.5rem;
          border-radius: 50%;
          border: 1px solid var(--color-border);
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
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
          background: #000;
        }
        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .cart-item-name {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.2;
        }
        .cart-item-variant {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .cart-item-price {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-accent);
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
          background: #07090E;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
        }
        .qty-btn {
          padding: 0.3rem 0.65rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #CBD5E1;
        }
        .qty-btn:disabled {
          opacity: 0.3;
        }
        .qty-val {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          padding: 0 0.4rem;
          min-width: 20px;
          text-align: center;
          color: #FFF;
        }
        .remove-btn {
          color: var(--color-text-subtle);
          padding: 0.35rem;
          transition: color 0.15s;
        }
        .remove-btn:hover {
          color: var(--color-danger);
        }
        .cart-drawer-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--color-border);
          background: #0B0E16;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-display);
          font-size: 1.05rem;
          letter-spacing: 0.04em;
        }
        .summary-amount {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .checkout-cta {
          margin-top: 0.5rem;
        }
        .cart-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};
