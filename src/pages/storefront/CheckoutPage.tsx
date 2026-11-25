import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  ShoppingBag, 
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';
import { formatARS, formatInstallments } from '../../lib/utils';
import { Order, OrderItem } from '../../types';
import { SHIPPING_ZONES_CONFIG } from '../../lib/mockData';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

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
  const { items, subtotalInCents, clearCart } = useCart();
  const { settings, createOrder } = useStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<'mercadopago' | 'transfer'>('mercadopago');
  const [selectedZone, setSelectedZone] = useState<'caba' | 'gba1' | 'gba2' | 'gba3' | 'interior'>('caba');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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

  const zoneRates: Record<string, number> = {
    caba: settings.shippingRates?.cabaInCents ?? 500000,
    gba1: settings.shippingRates?.gba1InCents ?? 670000,
    gba2: settings.shippingRates?.gba2InCents ?? 870000,
    gba3: settings.shippingRates?.gba3InCents ?? 970000,
    interior: settings.shippingRates?.interiorInCents ?? 990000,
  };

  const currentZoneRateInCents = zoneRates[selectedZone] ?? 500000;

  if (items.length === 0) {
    return (
      <div className="container empty-checkout-wrap">
        <ShoppingBag size={48} className="text-gray-400" />
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
    : currentZoneRateInCents;

  const transferDiscountInCents = paymentChoice === 'transfer' ? Math.round(subtotalInCents * 0.10) : 0;
  const finalTotalInCents = subtotalInCents - transferDiscountInCents + effectiveShippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
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
          shippingZone: selectedZone,
          shippingZoneName: SHIPPING_ZONES_CONFIG.find((z) => z.id === selectedZone)?.name,
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
        discountInCents: transferDiscountInCents,
        totalInCents: finalTotalInCents,
        paymentStatus: paymentChoice === 'transfer' ? 'pending' : 'approved',
        fulfillmentStatus: data.deliveryMethod === 'pickup' ? 'ready_for_pickup' : 'preparing',
        paymentMethod: paymentChoice === 'transfer' ? 'Transferencia Bancaria (10% OFF)' : 'Mercado Pago Checkout Pro',
        mercadopagoPaymentId: paymentChoice === 'mercadopago' ? `MP-${Math.floor(100000000 + Math.random() * 900000000)}` : undefined,
      };

      // Guardamos el pedido para que esté disponible al volver de Mercado Pago y en /admin
      createOrder(newOrder);

      // Disparamos el email automático de despacho a suplementostopparg@gmail.com
      fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: newOrder.orderNumber,
          customerName: newOrder.customerName,
          customerEmail: newOrder.customerEmail,
          customerPhone: newOrder.customerPhone,
          customerDni: newOrder.customerDni,
          deliveryMethod: newOrder.deliveryMethod,
          shippingAddress: newOrder.shippingAddress,
          paymentMethod: newOrder.paymentMethod,
          paymentStatus: newOrder.paymentStatus,
          subtotalFormatted: formatARS(subtotalInCents),
          discountFormatted: transferDiscountInCents > 0 ? formatARS(transferDiscountInCents) : null,
          shippingFormatted: effectiveShippingCost === 0 ? 'GRATIS' : formatARS(effectiveShippingCost),
          totalFormatted: formatARS(finalTotalInCents),
          items: orderItems.map((it) => ({
            productName: it.productName,
            variantTitle: it.variantTitle,
            sku: it.sku,
            quantity: it.quantity,
            totalFormatted: formatARS(it.totalPriceInCents),
          })),
        }),
      }).catch(() => {});

      // Si eligió Mercado Pago, intentamos crear la preferencia real en /api/create-preference
      if (paymentChoice === 'mercadopago') {
        try {
          const apiRes = await fetch('/api/create-preference', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderNumber: generatedOrderNumber,
              siteUrl: window.location.origin,
              shippingFeeInCents: effectiveShippingCost,
              customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                dni: data.dni,
              },
              items: items.map((i) => ({
                productId: i.productId,
                variantId: i.variantId,
                productName: i.productName,
                variantTitle: i.variantTitle,
                priceInCents: i.priceInCents,
                quantity: i.quantity,
              })),
            }),
          });

          if (apiRes.ok) {
            const mpData = await apiRes.json();
            if (mpData?.configured && mpData?.initPoint && mpData.initPoint.startsWith('https://')) {
              clearCart();
              window.location.href = mpData.initPoint;
              return;
            }
          }
        } catch {
          // Si estamos en Vite local sin serverless o sin token, continúa al flujo normal
        }

        // Alternativa: Supabase Edge Function si está configurada
        if (isSupabaseConfigured) {
          const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('create-payment-order', {
            body: {
              items: items.map((i) => ({
                variantId: i.variantId,
                quantity: i.quantity,
              })),
              customer: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                dni: data.dni,
              },
              deliveryMethod: data.deliveryMethod,
              shippingAddress: data.deliveryMethod === 'shipping' ? {
                street: data.street,
                number: data.number,
                apartment: data.apartment,
                neighborhood: data.neighborhood,
                city: data.city,
                province: data.province,
                postalCode: data.postalCode,
                deliveryNotes: data.deliveryNotes,
              } : null,
            }
          });

          if (!edgeErr && edgeData?.initPoint && edgeData.initPoint.startsWith('https://')) {
            clearCart();
            window.location.href = edgeData.initPoint;
            return;
          }
        }
      }

      clearCart();
      const statusParam = paymentChoice === 'transfer' ? 'pending' : 'approved';
      setTimeout(() => {
        navigate(`/pago-resultado?orden=${newOrder.orderNumber}&status=${statusParam}`);
      }, 500);
    } catch (err) {
      console.error('Error procesando checkout', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-bg">
      <div className="container checkout-page">
        <div className="checkout-top-bar">
          <Link to="/catalogo" className="back-link">
            <ArrowLeft size={16} /> Volver a la tienda
          </Link>
          <div className="secure-badge">
            <ShieldCheck size={16} className="text-green-600" />
            <span>Checkout Seguro SSL 256-bit</span>
          </div>
        </div>

        <h1 className="checkout-main-title">Finalizar Compra</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="checkout-grid">
          {/* Left Column */}
          <div className="checkout-form-column">
            <div className="card checkout-card">
              <h2 className="card-section-title">1. Datos Personales & Facturación</h2>
              <p className="section-note">
                Comprás de forma rápida como invitado. Sin contraseñas obligatorias.
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
                  <label className="form-label">Email para el comprobante *</label>
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

            {/* Section 2: Delivery */}
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
                      <Truck size={20} className="text-gray-800" />
                      <span className="box-title">Envío a Domicilio</span>
                    </div>
                    <span className="box-price">
                      {formatARS(currentZoneRateInCents)}
                    </span>
                    <p className="box-detail">
                      {selectedDeliveryMethod === 'shipping' 
                        ? `${SHIPPING_ZONES_CONFIG.find(z => z.id === selectedZone)?.tag} (${formatARS(currentZoneRateInCents)})`
                        : 'Tarifas por zona: CABA, GBA 1, 2, 3 e Interior.'}
                    </p>
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
                      <MapPin size={20} className="text-red-600" />
                      <span className="box-title">Retiro en Recoleta</span>
                    </div>
                    <span className="box-price text-green-600 font-bold">¡GRATIS!</span>
                    <p className="box-detail">Uriburu 1163 (entre Sta. Fe y Arenales), CABA.</p>
                  </div>
                </label>
              </div>

              {selectedDeliveryMethod === 'shipping' && (
                <div className="shipping-zones-box">
                  <div className="zones-header">
                    <MapPin size={17} className="text-accent" />
                    <div>
                      <strong>Seleccioná tu Zona de Entrega:</strong>
                      <p className="zones-sub-text">El costo de envío se actualiza automáticamente según tu ubicación.</p>
                    </div>
                  </div>

                  <div className="zones-grid">
                    {SHIPPING_ZONES_CONFIG.map((zone) => {
                      const cost = zoneRates[zone.id] ?? zone.defaultPriceInCents;
                      const isSelected = selectedZone === zone.id;
                      return (
                        <div
                          key={zone.id}
                          onClick={() => {
                            setSelectedZone(zone.id);
                            if (zone.id === 'caba') {
                              setValue('province', 'CABA');
                              setValue('city', 'Ciudad Autónoma de Buenos Aires');
                            } else if (zone.id === 'gba1' || zone.id === 'gba2' || zone.id === 'gba3') {
                              setValue('province', 'Buenos Aires');
                            }
                          }}
                          className={`zone-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="zone-card-header">
                            <span className={`zone-tag-pill tag-${zone.id}`}>{zone.tag}</span>
                            <strong className="zone-card-price">{formatARS(cost)}</strong>
                          </div>
                          <div className="zone-card-title">{zone.name}</div>
                          <div className="zone-card-partidos">{zone.partidos}</div>
                          <div className="zone-card-time">⚡ {zone.deliveryTime}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedDeliveryMethod === 'pickup' ? (
                <div className="pickup-info-alert">
                  <Clock size={20} className="text-red-600 flex-shrink-0" />
                  <div>
                    <strong>PUNTO DE RETIRO: {settings.pickupAddress}</strong>
                    <p>Horarios: {settings.hoursDescription}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Podés retirar hoy mismo presentando tu DNI una vez confirmado el pago.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="shipping-address-fields">
                  <h3 className="sub-fields-title">Dirección de Entrega</h3>

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
                        placeholder="CABA, Buenos Aires..."
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
                    <label className="form-label">Indicaciones para el transportista (Opcional)</label>
                    <textarea
                      rows={2}
                      className="form-textarea"
                      placeholder="Ej: Tocar timbre en portería, dejar con encargado las 24hs..."
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

          {/* Right Column: Order Summary */}
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

                {transferDiscountInCents > 0 && (
                  <div className="financial-row">
                    <span>Descuento 10% Transferencia:</span>
                    <strong className="text-green-600 font-bold">-{formatARS(transferDiscountInCents)}</strong>
                  </div>
                )}

                <div className="financial-row">
                  <span>
                    {selectedDeliveryMethod === 'pickup' 
                      ? 'Costo de entrega:' 
                      : `Costo de envío (${SHIPPING_ZONES_CONFIG.find(z => z.id === selectedZone)?.tag || 'Domicilio'}):`}
                  </span>
                  <span>
                    {effectiveShippingCost === 0 ? (
                      <strong className="text-green-600 font-bold">GRATIS</strong>
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

                <div className="summary-installments">
                  {paymentChoice === 'mercadopago' ? (
                    <span>{formatInstallments(finalTotalInCents, 6)} con Mercado Pago</span>
                  ) : (
                    <span>10% de ahorro aplicado por transferencia o efectivo</span>
                  )}
                </div>
              </div>

              {/* Selector de Medio de Pago */}
              <div className="mp-card-cta-box">
                <div className="payment-choice-tabs" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '6px',
                      border: paymentChoice === 'mercadopago' ? '2px solid #009EE3' : '1px solid #E2E8F0',
                      background: paymentChoice === 'mercadopago' ? '#F0F9FF' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentChoice"
                      checked={paymentChoice === 'mercadopago'}
                      onChange={() => setPaymentChoice('mercadopago')}
                    />
                    <div>
                      <strong style={{ display: 'block', color: '#0F172A' }}>Mercado Pago (Tarjetas, Débito, Dinero en cuenta)</strong>
                      <span style={{ fontSize: '0.74rem', color: '#475569' }}>Hasta 6 cuotas sin interés</span>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.65rem 0.75rem',
                      borderRadius: '6px',
                      border: paymentChoice === 'transfer' ? '2px solid #5B8C2A' : '1px solid #E2E8F0',
                      background: paymentChoice === 'transfer' ? '#F0FDF4' : '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentChoice"
                      checked={paymentChoice === 'transfer'}
                      onChange={() => setPaymentChoice('transfer')}
                    />
                    <div>
                      <strong style={{ display: 'block', color: '#166534' }}>Transferencia Bancaria / Efectivo (10% OFF)</strong>
                      <span style={{ fontSize: '0.74rem', color: '#15803D' }}>Ahorrás {formatARS(Math.round(subtotalInCents * 0.10))} en tu compra</span>
                    </div>
                  </label>

                  {paymentChoice === 'transfer' && (
                    <div style={{
                      marginTop: '0.35rem',
                      padding: '0.75rem',
                      background: '#F0FDF4',
                      border: '1px dashed #22C55E',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      color: '#14532D',
                      lineHeight: '1.4'
                    }}>
                      <div style={{ fontWeight: 800, marginBottom: '0.25rem', color: '#166534' }}>
                        💳 Datos para transferir tras confirmar:
                      </div>
                      <div><strong>Alias:</strong> {settings.bankAlias || 'Suplementos.top'}</div>
                      <div><strong>CVU:</strong> {settings.bankCvu || '0000076500000020117357'}</div>
                      <div><strong>Titular:</strong> {settings.bankHolder || 'Camila Cettour'}</div>
                      <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: '#15803D' }}>
                        * Al tocar Confirmar Pedido verás la pantalla con los botones para copiar los datos y enviar el comprobante directo por WhatsApp.
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary btn-block btn-lg pay-submit-btn"
                >
                  {isProcessing ? (
                    <span>Procesando pedido...</span>
                  ) : paymentChoice === 'mercadopago' ? (
                    <span>PAGAR {formatARS(finalTotalInCents)} CON MERCADO PAGO</span>
                  ) : (
                    <span>CONFIRMAR PEDIDO POR {formatARS(finalTotalInCents)} (10% OFF)</span>
                  )}
                </button>
              </div>

              <div className="post-payment-guarantee">
                <ShieldCheck size={16} className="text-green-600 flex-shrink-0" />
                <span>
                  Al confirmarse el pago, recibirás tu comprobante y se enviará la alerta a nuestro depósito en Uriburu 1163 para despachar de inmediato.
                </span>
              </div>

              {/* Botón discreto de Legales & Términos */}
              <div className="checkout-discreet-legal">
                <span>
                  Compra protegida conforme a la Ley 24.240. Al confirmar tu compra, declarás conocer y aceptar los{' '}
                  <Link to="/terminos" target="_blank" className="discreet-legal-link">Términos y Condiciones de Uso y Compra</Link>,{' '}
                  las <Link to="/envios" target="_blank" className="discreet-legal-link">Políticas de Envío</Link> y el{' '}
                  <Link to="/responsabilidad" target="_blank" className="discreet-legal-link">Aviso de Suplementos Dietarios</Link>.
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .checkout-bg {
          background-color: #F8F9FA;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }
        .checkout-page {
          padding-top: 2rem;
          padding-bottom: 5rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        .checkout-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
          width: 100%;
          box-sizing: border-box;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: #374151;
        }
        .back-link:hover {
          color: #111827;
        }
        .secure-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: #059669;
          background: #ECFDF5;
          padding: 0.3rem 0.65rem;
          border-radius: 999px;
          border: 1px solid #A7F3D0;
        }
        .checkout-main-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin-bottom: 2rem;
          color: #111827;
          word-break: break-word;
        }
        .checkout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media (min-width: 992px) {
          .checkout-grid {
            grid-template-columns: 1.35fr 1fr;
          }
        }
        .checkout-form-column, .checkout-summary-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          min-width: 0;
        }
        .checkout-card {
          padding: 1.75rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          .checkout-card {
            padding: 1.15rem 0.95rem;
          }
          .checkout-main-title {
            font-size: 1.6rem !important;
            margin-bottom: 1.25rem !important;
          }
          .summary-card {
            padding: 1.15rem 0.95rem !important;
            position: static !important;
          }
        }
        .card-section-title {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 0.35rem;
          color: #111827;
        }
        .section-note {
          font-size: 0.825rem;
          color: #6B7280;
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
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.15rem;
          cursor: pointer;
          transition: all 0.15s;
          background: #FFFFFF;
        }
        .delivery-option-box:hover {
          border-color: #111827;
        }
        .delivery-option-box.selected {
          border-color: #111827;
          background: #F9FAFB;
          box-shadow: 0 0 0 1px #111827;
        }
        .delivery-box-inner {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .box-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .box-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #111827;
        }
        .box-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: #111827;
        }
        .box-detail {
          font-size: 0.775rem;
          color: #6B7280;
        }

        /* Shipping Zones Selector Styles */
        .shipping-zones-box {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: var(--radius-sm);
          padding: 1.15rem;
          margin-bottom: 1.5rem;
        }
        .zones-header {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }
        .zones-header strong {
          font-size: 0.9rem;
          color: #0F172A;
          display: block;
        }
        .zones-sub-text {
          font-size: 0.78rem;
          color: #64748B;
          margin: 0.15rem 0 0 0;
        }
        .zones-grid {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .zone-card {
          background: #FFFFFF;
          border: 1.5px solid #E2E8F0;
          border-radius: 6px;
          padding: 0.75rem 0.95rem;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .zone-card:hover {
          border-color: #94A3B8;
        }
        .zone-card.selected {
          border-color: #E11D48;
          background: #FFF1F2;
          box-shadow: 0 0 0 1px #E11D48;
        }
        .zone-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .zone-tag-pill {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .tag-caba { background: #FCE7F3; color: #DB2777; }
        .tag-gba1 { background: #CCFBF1; color: #0D9488; }
        .tag-gba2 { background: #DBEAFE; color: #1E40AF; }
        .tag-gba3 { background: #FEE2E2; color: #DC2626; }
        .tag-interior { background: #F1F5F9; color: #334155; }

        .zone-card-price {
          font-size: 1rem;
          font-weight: 900;
          color: #0F172A;
        }
        .zone-card-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #0F172A;
        }
        .zone-card-partidos {
          font-size: 0.76rem;
          color: #475569;
          line-height: 1.35;
        }
        .zone-card-time {
          font-size: 0.72rem;
          color: #059669;
          font-weight: 700;
        }

        .pickup-info-alert {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: #F8F9FA;
          border: 1px solid #E5E7EB;
          padding: 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .pickup-info-alert strong {
          color: #111827;
          display: block;
        }
        .pickup-info-alert p {
          color: #4B5563;
        }
        .shipping-address-fields {
          border-top: 1px solid var(--color-border);
          padding-top: 1.25rem;
          margin-top: 0.5rem;
        }
        .sub-fields-title {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #DC2626;
          font-size: 0.85rem;
          margin-top: 0.75rem;
        }
        .summary-card {
          padding: 1.75rem;
          position: sticky;
          top: 5.5rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
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
          width: 52px;
          height: 52px;
          object-fit: contain;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border);
          flex-shrink: 0;
          background: #F9FAFB;
        }
        .summary-item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .summary-item-name {
          font-weight: 700;
          color: #111827;
        }
        .summary-item-variant {
          color: #6B7280;
          font-size: 0.75rem;
        }
        .summary-item-qty {
          color: #9CA3AF;
          font-size: 0.75rem;
        }
        .summary-item-price {
          font-weight: 800;
          color: #111827;
        }
        .summary-financials {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }
        .financial-row {
          display: flex;
          justify-content: space-between;
          color: #4B5563;
        }
        .financial-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-border);
          padding-top: 0.75rem;
          font-size: 1.15rem;
          font-weight: 800;
          color: #111827;
        }
        .final-total-amount {
          font-size: 1.6rem;
        }
        .summary-installments {
          font-size: 0.825rem;
          font-weight: 700;
          color: #059669;
          margin-top: 0.2rem;
        }
        .mp-card-cta-box {
          background: #F9FAFB;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
        }
        .mp-badge-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.9rem;
          color: #111827;
        }
        .pay-submit-btn {
          margin-top: 0.5rem;
        }
        .post-payment-guarantee {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.775rem;
          color: #6B7280;
        }
        .checkout-discreet-legal {
          margin-top: 0.85rem;
          padding: 0.75rem 0.85rem;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: var(--radius-sm);
          font-size: 0.73rem;
          line-height: 1.5;
          color: #64748B;
          text-align: center;
        }
        .discreet-legal-link {
          color: #334155;
          font-weight: 600;
          text-decoration: underline;
        }
        .discreet-legal-link:hover {
          color: #E63946;
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
