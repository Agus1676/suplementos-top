// Vercel Serverless Function: /api/send-order-email
// Sends the complete dispatch sheet to suplementostopparg@gmail.com (and buyer confirmation) via Resend API.
// Hardened against HTML injection, email header tampering, and XSS.

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'suplementostopparg@gmail.com';

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildOwnerHtml(order) {
  const isPickup = order.deliveryMethod === 'pickup';
  const itemsRows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #E4E4E7;font-size:14px;color:#18181B;">
          <strong>${escapeHtml(item.productName)}</strong><br/>
          <span style="font-size:12px;color:#71717A;">${escapeHtml(item.variantTitle || '')} ${item.sku ? `(SKU: ${escapeHtml(item.sku)})` : ''}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #E4E4E7;font-size:14px;text-align:center;color:#18181B;font-weight:700;">
          x${Math.max(1, Math.min(99, Number(item.quantity) || 1))}
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #E4E4E7;font-size:14px;text-align:right;color:#18181B;font-weight:700;">
          ${escapeHtml(item.totalFormatted || '')}
        </td>
      </tr>`
    )
    .join('');

  const buyerWa = String(order.customerPhone || '').replace(/\D/g, '');

  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;overflow:hidden;">
    <div style="background:#18181B;color:#FFFFFF;padding:20px 24px;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#A1A1AA;">Suplementos Top — Alerta de Venta</div>
      <h1 style="margin:6px 0 0;font-size:22px;">Nuevo Pedido #${escapeHtml(order.orderNumber)}</h1>
    </div>

    <div style="padding:24px;">
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:14px 16px;margin-bottom:20px;">
        <div style="font-size:13px;color:#166534;font-weight:700;">
          Medio de pago: ${escapeHtml(order.paymentMethod || 'Mercado Pago')} (${order.paymentStatus === 'approved' ? 'PAGO ACREDITADO' : 'PENDIENTE DE ACREDITACIÓN'})
        </div>
        <div style="font-size:18px;color:#14532D;font-weight:800;margin-top:4px;">
          Total: ${escapeHtml(order.totalFormatted)}
        </div>
      </div>

      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.5px;color:#18181B;border-bottom:1px solid #E4E4E7;padding-bottom:8px;margin:0 0 12px;">
        1. Datos del Comprador
      </h2>
      <table style="width:100%;font-size:14px;color:#27272A;margin-bottom:22px;border-collapse:collapse;">
        <tr><td style="padding:4px 0;color:#71717A;width:140px;">Nombre:</td><td style="padding:4px 0;font-weight:700;">${escapeHtml(order.customerName)}</td></tr>
        <tr><td style="padding:4px 0;color:#71717A;">DNI / CUIL:</td><td style="padding:4px 0;font-weight:700;">${escapeHtml(order.customerDni)}</td></tr>
        <tr><td style="padding:4px 0;color:#71717A;">Teléfono:</td><td style="padding:4px 0;font-weight:700;"><a href="https://wa.me/549${buyerWa}" style="color:#16A34A;text-decoration:none;">${escapeHtml(order.customerPhone)} (Abrir WhatsApp)</a></td></tr>
        <tr><td style="padding:4px 0;color:#71717A;">Email:</td><td style="padding:4px 0;">${escapeHtml(order.customerEmail)}</td></tr>
      </table>

      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.5px;color:#18181B;border-bottom:1px solid #E4E4E7;padding-bottom:8px;margin:0 0 12px;">
        2. Modalidad de Entrega
      </h2>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:14px 16px;margin-bottom:22px;font-size:14px;color:#18181B;">
        ${
          isPickup
            ? `<strong>RETIRO EN LOCAL RECOLETA</strong><br/>Uriburu 1163 (entre Av. Santa Fe y Arenales), CABA.<br/><span style="font-size:12px;color:#71717A;">El cliente retira presentando DNI ${escapeHtml(order.customerDni)}.</span>`
            : `<strong>ENVÍO A DOMICILIO</strong><br/>
               Dirección: <strong>${escapeHtml(order.shippingAddress?.street || '')} ${escapeHtml(order.shippingAddress?.number || '')} ${order.shippingAddress?.apartment ? `(${escapeHtml(order.shippingAddress.apartment)})` : ''}</strong><br/>
               Localidad: <strong>${escapeHtml(order.shippingAddress?.city || '')}, ${escapeHtml(order.shippingAddress?.province || '')} (CP: ${escapeHtml(order.shippingAddress?.postalCode || '')})</strong>
               ${order.shippingAddress?.deliveryNotes ? `<br/>Indicaciones: <em>${escapeHtml(order.shippingAddress.deliveryNotes)}</em>` : ''}`
        }
      </div>

      <h2 style="font-size:15px;text-transform:uppercase;letter-spacing:0.5px;color:#18181B;border-bottom:1px solid #E4E4E7;padding-bottom:8px;margin:0 0 12px;">
        3. Productos a Preparar
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <thead>
          <tr style="background:#F4F4F5;font-size:12px;text-transform:uppercase;color:#52525B;">
            <th style="padding:8px 12px;text-align:left;">Producto</th>
            <th style="padding:8px 12px;text-align:center;">Cant.</th>
            <th style="padding:8px 12px;text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>

      <div style="text-align:right;font-size:14px;color:#27272A;line-height:1.7;">
        <div>Subtotal: <strong>${escapeHtml(order.subtotalFormatted || order.totalFormatted)}</strong></div>
        ${order.discountFormatted ? `<div style="color:#16A34A;">Descuento 10% Transferencia: <strong>-${escapeHtml(order.discountFormatted)}</strong></div>` : ''}
        <div>Envío: <strong>${escapeHtml(order.shippingFormatted || 'GRATIS')}</strong></div>
        <div style="font-size:18px;font-weight:800;color:#18181B;margin-top:6px;">Total: ${escapeHtml(order.totalFormatted)}</div>
      </div>
    </div>
  </div>`;
}

function buildBuyerHtml(order) {
  const isPickup = order.deliveryMethod === 'pickup';
  return `
  <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E4E7;border-radius:8px;overflow:hidden;">
    <div style="background:#5B8C2A;color:#FFFFFF;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;">¡Gracias por tu compra en Suplementos Top!</h1>
      <div style="font-size:13px;opacity:0.9;margin-top:4px;">Pedido #${escapeHtml(order.orderNumber)}</div>
    </div>
    <div style="padding:24px;font-size:14px;color:#27272A;line-height:1.6;">
      <p>Hola <strong>${escapeHtml(order.customerName)}</strong>, registramos tu pedido <strong>#${escapeHtml(order.orderNumber)}</strong> por un total de <strong>${escapeHtml(order.totalFormatted)}</strong>.</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;padding:14px 16px;margin:16px 0;">
        ${
          isPickup
            ? `<strong>Punto de retiro sin cargo:</strong><br/>Uriburu 1163 (entre Av. Santa Fe y Arenales), Recoleta, CABA.<br/>Horarios: Lunes a Viernes de 8:00 a 23:00 hs | Sábados de 10:00 a 18:00 hs.<br/>Presentate con tu DNI (${escapeHtml(order.customerDni)}).`
            : `<strong>Envío a domicilio:</strong><br/>${escapeHtml(order.shippingAddress?.street || '')} ${escapeHtml(order.shippingAddress?.number || '')}, ${escapeHtml(order.shippingAddress?.city || '')} (CP ${escapeHtml(order.shippingAddress?.postalCode || '')}).`
        }
      </div>
      <p>Por cualquier consulta podés escribirnos directo a nuestro WhatsApp oficial: <a href="https://wa.me/5491165651990" style="color:#5B8C2A;font-weight:700;">11 6565 1990</a>.</p>
    </div>
  </div>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const resendApiKey = process.env.RESEND_API_KEY;
  const order = req.body;

  if (!order || !order.orderNumber) {
    return res.status(400).json({ error: 'Faltan datos del pedido' });
  }

  if (!resendApiKey) {
    return res.status(200).json({
      sent: false,
      configured: false,
      message: 'RESEND_API_KEY no configurada aún en Vercel.',
    });
  }

  try {
    const fromAddress = process.env.EMAIL_FROM || 'Suplementos Top <onboarding@resend.dev>';

    // 1. Enviar planilla completa al dueño (suplementostopparg@gmail.com)
    let ownerRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [OWNER_EMAIL],
        reply_to: order.customerEmail || undefined,
        subject: `NUEVA VENTA #${order.orderNumber} — ${order.customerName} (${order.totalFormatted})`,
        html: buildOwnerHtml(order),
      }),
    });

    let ownerData = await ownerRes.json();

    // Si la cuenta de Resend está en modo sandbox (sin dominio propio verificado todavía),
    // Resend exige enviar a la cuenta registrada (ej: agustinpollanceo@gmail.com):
    if (!ownerRes.ok && ownerData?.statusCode === 403 && ownerData?.message?.includes('testing emails')) {
      const match = ownerData.message.match(/\(([^)]+)\)/);
      const sandboxEmail = match ? match[1] : 'agustinpollanceo@gmail.com';
      ownerRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [sandboxEmail],
          reply_to: order.customerEmail || undefined,
          subject: `NUEVA VENTA #${order.orderNumber} — ${order.customerName} (${order.totalFormatted})`,
          html: buildOwnerHtml(order),
        }),
      });
      ownerData = await ownerRes.json();
    }
    if (order.customerEmail) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [order.customerEmail],
          subject: `Confirmación de pedido #${order.orderNumber} — Suplementos Top`,
          html: buildBuyerHtml(order),
        }),
      }).catch(() => {});
    }

    return res.status(200).json({
      sent: ownerRes.ok,
      configured: true,
      id: ownerData?.id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error enviando email' });
  }
}
