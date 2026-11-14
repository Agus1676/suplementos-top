// Supabase Edge Function: send-notifications
// Runtime: Deno / TypeScript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
    const ownerEmail = Deno.env.get('OWNER_EMAIL') ?? 'suplementostopparg@gmail.com';
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://suplementos-top.vercel.app';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    const {
      orderId,
      orderNumber,
      customerEmail,
      customerName,
      customerPhone,
      customerDni,
      deliveryMethod,
      shippingAddress,
      items,
      totalInCents,
    } = payload;

    const totalPesosFormatted = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(totalInCents / 100);

    const itemsHtmlList = items
      .map((i: any) => `<li><strong>${i.quantity}x ${i.product_name || i.productName}</strong> (${i.variant_title || i.variantTitle}) - SKU: ${i.sku}</li>`)
      .join('');

    // 1. Email al Comprador (Confirmación de compra y comprobante)
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #0F172A; max-width: 600px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0F172A; color: #FFFFFF; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; color: #F59E0B;">SUPLEMENTOS TOP</h1>
          <p style="margin: 4px 0 0; font-size: 14px; color: #CBD5E1;">Nutrición y Rendimiento Deportivo</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #0F172A; font-size: 20px;">¡Gracias por tu compra, ${customerName}!</h2>
          <p style="color: #475569; font-size: 15px;">Tu pago fue acreditado exitosamente por Mercado Pago.</p>
          
          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px;"><strong>Pedido:</strong> #${orderNumber}</p>
            <p style="margin: 0 0 8px;"><strong>Modalidad:</strong> ${deliveryMethod === 'pickup' ? 'Retiro en Local (Uriburu 1163, CABA)' : 'Envío a Domicilio'}</p>
            <p style="margin: 0;"><strong>Total Abonado:</strong> ${totalPesosFormatted}</p>
          </div>

          <h3 style="font-size: 16px; margin-bottom: 8px;">Productos adquiridos:</h3>
          <ul style="color: #334155; line-height: 1.6;">
            ${itemsHtmlList}
          </ul>

          ${deliveryMethod === 'pickup' ? `
            <div style="background-color: #FEF3C7; border: 1px solid #FCD34D; border-radius: 6px; padding: 14px; margin-top: 20px;">
              <strong style="color: #92400E;">📍 Podés retirar en:</strong>
              <p style="margin: 4px 0 0; color: #78350F; font-size: 14px;">
                Uriburu 1163 (entre Santa Fe y Arenales), Recoleta, CABA.<br/>
                Horarios: Lun a Vie 8 a 23hs | Sáb 10 a 18hs.<br/>
                Presentar DNI: <strong>${customerDni}</strong>.
              </p>
            </div>
          ` : `
            <p style="font-size: 14px; color: #64748B; margin-top: 20px;">
              Te notificaremos el código de seguimiento en cuanto tu paquete sea entregado al transportista.
            </p>
          `}

          <div style="margin-top: 28px; text-align: center;">
            <a href="${siteUrl}/seguimiento?orden=${orderNumber}" style="background-color: #0F172A; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Ver Estado de Mi Pedido
            </a>
          </div>
        </div>
      </div>
    `;

    // 2. Email al Dueño (Datos completos de despacho y cliente)
    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #0F172A; max-width: 600px; margin: 0 auto; border: 2px solid #F59E0B; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #F59E0B; color: #0F172A; padding: 16px 24px;">
          <h2 style="margin: 0; font-size: 20px;">🚨 NUEVO PEDIDO PARA DESPACHAR (#${orderNumber})</h2>
        </div>
        <div style="padding: 24px;">
          <h3 style="margin-top: 0; color: #0F172A;">👤 Datos del Comprador:</h3>
          <ul style="line-height: 1.6; color: #334155;">
            <li><strong>Nombre:</strong> ${customerName}</li>
            <li><strong>DNI:</strong> ${customerDni}</li>
            <li><strong>Teléfono / WhatsApp:</strong> <a href="https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}">${customerPhone}</a></li>
            <li><strong>Email:</strong> ${customerEmail}</li>
          </ul>

          <h3>📦 Modalidad de Entrega:</h3>
          <p style="background: #F1F5F9; padding: 12px; border-radius: 6px;">
            ${deliveryMethod === 'pickup' 
              ? '<strong>📍 RETIRO EN SUCURSAL (Uriburu 1163)</strong>' 
              : `<strong>🚚 ENVÍO A DOMICILIO:</strong><br/>${shippingAddress?.street} ${shippingAddress?.number}, ${shippingAddress?.city}, ${shippingAddress?.province} (CP: ${shippingAddress?.postalCode})`}
          </p>

          <h3>💊 Productos a Preparar:</h3>
          <ul>
            ${itemsHtmlList}
          </ul>

          <p style="font-size: 16px; margin-top: 16px;">
            <strong>Monto Total Cobrado en Mercado Pago:</strong> ${totalPesosFormatted}
          </p>

          <div style="margin-top: 24px;">
            <a href="${siteUrl}/admin/pedidos" style="background-color: #0F172A; color: #FFFFFF; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Abrir en Panel de Pedidos
            </a>
          </div>
        </div>
      </div>
    `;

    // Si Resend API Key está configurado, despachar emails
    if (resendApiKey) {
      // 1. Enviar al comprador
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Suplementos Top <pedidos@suplementostop.com>',
          to: [customerEmail],
          subject: `¡Confirmación de Pedido #${orderNumber}! - Suplementos Top`,
          html: customerEmailHtml,
        }),
      });

      // 2. Enviar al dueño
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Suplementos Top <alertas@suplementostop.com>',
          to: [ownerEmail],
          subject: `[NUEVA VENTA] #${orderNumber} - Despachar a ${customerName}`,
          html: ownerEmailHtml,
        }),
      });

      // Registrar en log
      if (orderId) {
        await supabase.from('notifications_log').insert([
          { order_id: orderId, channel: 'email', recipient: customerEmail, template_type: 'order_confirmation', status: 'sent' },
          { order_id: orderId, channel: 'email', recipient: ownerEmail, template_type: 'owner_dispatch_alert', status: 'sent' },
        ]);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error enviando notificaciones', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
