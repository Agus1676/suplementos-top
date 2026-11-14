import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';
import { Order, OrderItem } from '../../types';

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Ingresá tu nombre'),
  lastName: z.string().min(2, 'Ingresá tu apellido'),
  email: z.string().email('Ingresá un email válido'),
  phone: z.string().min(8, 'Ingresá un teléfono o celular válido'),
  dni: z.string().min(7, 'Ingresá un DNI válido para la factura y despacho'),
  deliveryMethod: z.enum(['shipping', 'pickup']),
  street: z.string().optional(),
  number: z.string().optional(),
  apartment: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
}).refine((data) => {
  if (data.deliveryMethod === 'shipping') {
    return Boolean(data.street && data.number && data.city && data.province && data.postalCode);
  }
  return true;
}, {
  message: 'Para el envío a domicilio es necesario completar calle, número, localidad, provincia y código postal.',
  path: ['street'],
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const { items, subtotalInCents, isFreeShippingEligible, clearCart } = useCart();
  const { settings, createOrder } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: 'shipping',
      province: 'CABA',
      city: 'Ciudad Autónoma de Buenos Aires',
    },
  });

  const selectedDeliveryMethod = watch('deliveryMethod');

  if (items.length === 0) {
    return (
      <div className="container empty-checkout-wrap">
        <ShoppingBag size={48} className="text-subtle" />
        <h2>No hay productos en tu carrito</h2>
        <p>Seleccioná al menos un suplemento para poder iniciar el proceso de checkout.</p>
        <Link to="/catalogo" className="btn btn-primary">
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  const effectiveShippingCost = selectedDeliveryMethod === 'pickup' 
    ? 0 
    : isFreeShippingEligible 
      ? 0 
      : settings.flatShippingRateInCents;

  const finalTotalInCents = subtotalInCents + effectiveShippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    // Simulación de creación de orden en base de datos transaccional
    const generatedOrderNumber = `ST-${Date.now().toString().slice(-6)}`;
    
    const orderItems: OrderItem[] = items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      orderId: generatedOrderNumber,
      productId: item.productId,
      productName: item.productName,
      variantId: item.variantId,
      variantTitle: item.variantTitle,
      sku: `${item.productId.slice(0, 4).toUpperCase()}-${item.variantId.slice(0, 3)}`,
      unitPriceInCents: item.priceInCents,
      quantity: item.quantity,
      totalPriceInCents: item.priceInCents * item.quantity,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: generatedOrderNumber,
      createdAt: new Date().toISOString(),
      customerName: `${data.firstName} ${data.lastName}`,
      customerEmail: data.email,
      customerPhone: data.phone,
      customerDni: data.dni,
      deliveryMethod: data.deliveryMethod,
      shippingAddress: data.deliveryMethod === 'shipping' ? {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        dni: data.dni,
        deliveryMethod: 'shipping',
        street: data.street || '',
        number: data.number || '',
        apartment: data.apartment,
        neighborhood: data.neighborhood,
        city: data.city || '',
        province: data.province || '',
        postalCode: data.postalCode || '',
        deliveryNotes: data.deliveryNotes,
      } : undefined,
      items: orderItems,
      subtotalInCents,
      shippingFeeInCents: effectiveShippingCost,
      discountInCents: 0,
      totalInCents: finalTotalInCents,
      paymentStatus: 'approved', // Simulación exitosa de retorno
      fulfillmentStatus: data.deliveryMethod === 'pickup' ? 'ready_for_pickup' : 'preparing',
      paymentMethod: 'Mercado Pago Checkout Pro',
      mercadopagoPaymentId: `MP-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    // Registrar en store
    createOrder(newOrder);
    clearCart();

    // Redirigir al resultado del pago con la información
    setTimeout(() => {
      navigate(`/pago-resultado?orden=${newOrder.orderNumber}`);
    }, 1000);
  };

  return (
    <div className="container checkout-page">
      <div className="checkout-top-bar">
        <Link to="/catalogo" className="back-link">
          <ArrowLeft size={16} /> Volver a la tienda
        </Link>
        <div className="secure-badge">
          <ShieldCheck size={16} className="text-success" />
          <span>Checkout Seguro SSL 256-bit</span>
        </div>
      </div>

      <h1 className="checkout-main-title">Finalizar Compra</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="checkout-grid">
        {/* Left Column: Customer & Delivery Details */}
        <div className="checkout-form-column">
          {/* Section 1: Customer Contact */}
          <div className="card checkout-card">
            <h2 className="card-section-title">1. Datos Personales & Facturación</h2>
            <p className="section-note">
              No necesitás crear contraseña. Comprás como invitado de forma rápida y segura.
            </p>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Juan"
                  {...register('firstName')}
                />
                {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Pérez"
                  {...register('lastName')}
                />
                {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Email de confirmación *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="juanperez@gmail.com"
                  {...register('email')}
                />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Celular / WhatsApp *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ej: 11 4455 6677"
                  {...register('phone')}
                />
                {errors.phone && <span className="form-error">{errors.phone.message}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">DNI / CUIL * (Requerido para la factura y despacho)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej: 36.123.456"
                {...register('dni')}
              />
              {errors.dni && <span className="form-error">{errors.dni.message}</span>}
            </div>
          </div>

          {/* Section 2: Delivery Option */}
          <div className="card checkout-card">
            <h2 className="card-section-title">2. Forma de Entrega</h2>

            <div className="delivery-selector-grid">
              <label className={`delivery-option-box ${selectedDeliveryMethod === 'shipping' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="shipping"
                  {...register('deliveryMethod')}
                  className="hidden-radio"
                />
                <div className="delivery-box-inner">
                  <div className="box-header">
                    <Truck size={20} className="text-accent" />
                    <span className="box-title">Envío a Domicilio</span>
                  </div>
                  <span className="box-price">
                    {isFreeShippingEligible ? (
                      <strong className="text-success">¡GRATIS!</strong>
                    ) : (
                      formatARS(settings.flatShippingRateInCents)
                    )}
                  </span>
                  <p className="box-detail">A todo el país por correo y logística prioritaria.</p>
                </div>
              </label>

              <label className={`delivery-option-box ${selectedDeliveryMethod === 'pickup' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="pickup"
                  {...register('deliveryMethod')}
                  className="hidden-radio"
                />
                <div className="delivery-box-inner">
                  <div className="box-header">
                    <MapPin size={20} className="text-accent" />
                    <span className="box-title">Retiro en Recoleta</span>
                  </div>
                  <span className="box-price text-success">¡GRATIS!</span>
                  <p className="box-detail">Uriburu 1163 (entre Sta. Fe y Arenales), CABA.</p>
                </div>
              </label>
            </div>

            {selectedDeliveryMethod === 'pickup' ? (
              <div className="pickup-info-alert">
                <Clock size={18} className="text-accent flex-shrink-0" />
                <div>
                  <strong>Dirección de Retiro: {settings.pickupAddress}</strong>
                  <p>Horarios: {settings.hoursDescription}</p>
                  <p className="text-xs text-muted mt-1">
                    Te enviaremos un WhatsApp cuando tu pedido esté listo para retirar con tu DNI.
                  </p>
                </div>
              </div>
            ) : (
              <div className="shipping-address-fields">
                <h3 className="sub-fields-title">Dirección de Envío</h3>

                <div className="form-row-2">
                  <div className="form-group flex-2">
                    <label className="form-label">Calle *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Av. Santa Fe"
                      {...register('street')}
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">Número *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: 1420"
                      {...register('number')}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Piso / Depto (Opcional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: 4to B"
                      {...register('apartment')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Barrio (Opcional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: Recoleta / Palermo"
                      {...register('neighborhood')}
                    />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">Provincia *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="CABA, Buenos Aires, etc."
                      {...register('province')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Localidad / Ciudad *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ciudad"
                      {...register('city')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Código Postal *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ej: 1425"
                      {...register('postalCode')}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Indicaciones especiales para el repartidor (Opcional)</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Ej: Tocar timbre en portería, entre calles, dejar con seguridad..."
                    {...register('deliveryNotes')}
                  />
                </div>

                {errors.street && (
                  <div className="error-alert">
                    <AlertCircle size={16} />
                    <span>{errors.street.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Mercado Pago CTA */}
        <div className="checkout-summary-column">
          <div className="card summary-card">
            <h2 className="card-section-title">Resumen del Pedido</h2>

            <div className="summary-items-list">
              {items.map((item) => (
                <div key={item.id} className="summary-item-row">
                  <img src={item.imageUrl} alt={item.productName} className="summary-item-img" />
                  <div className="summary-item-details">
                    <span className="summary-item-name">{item.productName}</span>
                    <span className="summary-item-variant">{item.variantTitle}</span>
                    <span className="summary-item-qty">Cant: {item.quantity}</span>
                  </div>
                  <span className="summary-item-price">
                    {formatARS(item.priceInCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-financials">
              <div className="financial-row">
                <span>Subtotal:</span>
                <span>{formatARS(subtotalInCents)}</span>
              </div>

              <div className="financial-row">
                <span>Costo de envío:</span>
                <span>
                  {effectiveShippingCost === 0 ? (
                    <strong className="text-success">GRATIS</strong>
                  ) : (
                    formatARS(effectiveShippingCost)
                  )}
                </span>
              </div>

              <div className="financial-total-row">
                <span>Total a Pagar:</span>
                <span className="final-total-amount">
                  {formatARS(finalTotalInCents)}
                </span>
              </div>
            </div>

            {/* Mercado Pago Badge */}
            <div className="mp-card-cta-box">
              <div className="mp-badge-header">
                <CreditCard size={18} className="text-accent" />
                <span>Pago Procesado por <strong>Mercado Pago</strong></span>
              </div>
              <p className="text-xs text-muted">
                Serás redirigido a la plataforma oficial de Mercado Pago para abonar con tarjeta de crédito, débito o dinero en cuenta con total protección.
              </p>

              <button
                type="submit"
                disabled={isProcessing}
                className="btn btn-accent btn-block btn-lg pay-submit-btn"
              >
                {isProcessing ? (
                  <span>Conectando con Mercado Pago...</span>
                ) : (
                  <span>Pagar {formatARS(finalTotalInCents)} con Mercado Pago</span>
                )}
              </button>
            </div>

            <div className="post-payment-guarantee">
              <ShieldCheck size={16} className="text-success flex-shrink-0" />
              <span>
                Al confirmarse el pago, recibirás tu comprobante y se enviará la orden a despacho inmediatamente.
              </span>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        .checkout-page {
          padding-top: 1.5rem;
          padding-bottom: 5rem;
        }
        .checkout-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .back-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
        }
        .secure-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-success);
        }
        .checkout-main-title {
          font-size: 2.2rem;
          margin-bottom: 2rem;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1.35fr 1fr;
          }
        }
        .checkout-form-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .checkout-card {
          padding: 1.75rem;
        }
        .card-section-title {
          font-size: 1.25rem;
          margin-bottom: 0.4rem;
        }
        .section-note {
          font-size: 0.825rem;
          color: var(--color-text-muted);
          margin-bottom: 1.25rem;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .form-row-2 {
            grid-template-columns: 1fr 1fr;
          }
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 600px) {
          .form-row-3 {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }
        .flex-2 { flex: 2; }
        .flex-1 { flex: 1; }
        .delivery-selector-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 600px) {
          .delivery-selector-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .hidden-radio {
          display: none;
        }
        .delivery-option-box {
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          background: #FFFFFF;
        }
        .delivery-option-box:hover {
          border-color: var(--color-primary);
        }
        .delivery-option-box.selected {
          border-color: var(--color-primary);
          background: #F8FAFC;
          box-shadow: 0 0 0 1px var(--color-primary);
        }
        .delivery-box-inner {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .box-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .box-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .box-price {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .box-detail {
          font-size: 0.775rem;
          color: var(--color-text-muted);
        }
        .pickup-info-alert {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: var(--color-bg-muted);
          border: 1px solid var(--color-border);
          padding: 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
        }
        .pickup-info-alert strong {
          color: var(--color-primary);
          display: block;
        }
        .pickup-info-alert p {
          color: var(--color-text-muted);
        }
        .shipping-address-fields {
          border-top: 1px solid var(--color-border);
          padding-top: 1.25rem;
          margin-top: 0.5rem;
        }
        .sub-fields-title {
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-danger);
          font-size: 0.85rem;
          margin-top: 0.75rem;
        }
        .summary-card {
          padding: 1.75rem;
          position: sticky;
          top: 5.5rem;
        }
        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
          max-height: 280px;
          overflow-y: auto;
        }
        .summary-item-row {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.85rem;
        }
        .summary-item-img {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
        }
        .summary-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .summary-item-name {
          font-weight: 700;
          color: var(--color-primary);
        }
        .summary-item-variant {
          color: var(--color-text-muted);
          font-size: 0.75rem;
        }
        .summary-item-qty {
          color: var(--color-text-subtle);
          font-size: 0.75rem;
        }
        .summary-item-price {
          font-weight: 700;
          color: var(--color-primary);
        }
        .summary-financials {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }
        .financial-row {
          display: flex;
          justify-content: space-between;
          color: var(--color-text-muted);
        }
        .financial-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .final-total-amount {
          font-size: 1.5rem;
          color: var(--color-primary);
        }
        .mp-card-cta-box {
          background: #F8FAFC;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }
        .mp-badge-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--color-primary);
        }
        .pay-submit-btn {
          margin-top: 0.5rem;
        }
        .post-payment-guarantee {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.775rem;
          color: var(--color-text-muted);
        }
        .empty-checkout-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 5rem 1rem;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};
