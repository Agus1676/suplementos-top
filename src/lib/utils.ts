export function formatARS(cents: number): string {
  const pesos = cents / 100;
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(pesos);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateDiscountPercentage(priceInCents: number, comparePriceInCents?: number): number {
  if (!comparePriceInCents || comparePriceInCents <= priceInCents) return 0;
  return Math.round(((comparePriceInCents - priceInCents) / comparePriceInCents) * 100);
}

export function buildWhatsAppDispatchLink(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerDni: string;
  deliveryMethod: 'shipping' | 'pickup';
  addressText: string;
  itemsText: string;
  totalText: string;
  paymentStatus: string;
}): string {
  const ownerNumber = '5491165651990';
  const methodLabel = order.deliveryMethod === 'pickup' ? '📍 RETIRO EN LOCAL (Uriburu 1163)' : '🚚 ENVÍO A DOMICILIO';
  
  const text = `🚨 *NUEVO PEDIDO CONFIRMADO PARA DESPACHO* 🚨
*Pedido:* #${order.orderNumber}
*Modalidad:* ${methodLabel}
*Estado de Pago:* ${order.paymentStatus.toUpperCase()}

👤 *DATOS DEL CLIENTE:*
• Nombre: ${order.customerName}
• DNI: ${order.customerDni}
• Celular: ${order.customerPhone}
${order.deliveryMethod === 'shipping' ? `• Dirección de entrega: ${order.addressText}\n` : ''}
📦 *PRODUCTOS A DESPACHAR:*
${order.itemsText}

💰 *TOTAL COBRADO:* ${order.totalText}

_Ingresá al panel admin de Suplementos Top para imprimir o actualizar seguimiento._`;

  return `https://wa.me/${ownerNumber}?text=${encodeURIComponent(text)}`;
}
