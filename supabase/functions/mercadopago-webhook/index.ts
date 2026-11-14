// Supabase Edge Function: mercadopago-webhook
// Runtime: Deno / TypeScript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const eventId = body?.id?.toString() || body?.data?.id?.toString();
    const action = body?.action || body?.type;

    if (!eventId) {
      return new Response(JSON.stringify({ message: 'Evento sin ID' }), { status: 200 });
    }

    // 1. Idempotencia: Verificar si el evento ya fue procesado
    const { data: existingEvent } = await supabase
      .from('payment_events')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (existingEvent) {
      return new Response(JSON.stringify({ message: 'Evento ya procesado previamente' }), { status: 200 });
    }

    // Registrar evento para evitar reprocesamientos concurrentes
    await supabase.from('payment_events').insert({
      event_id: eventId,
      action: action || 'unknown',
      payload: body,
    });

    // 2. Si el evento es un pago, consultar la API oficial de Mercado Pago
    if (body.type === 'payment' || body.topic === 'payment' || body.action?.startsWith('payment.')) {
      const paymentId = body.data?.id || body.id;

      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${mpAccessToken}`,
        },
      });

      if (!mpResponse.ok) {
        throw new Error(`Error consultando pago en Mercado Pago: ${mpResponse.statusText}`);
      }

      const paymentData = await mpResponse.json();
      const orderId = paymentData.external_reference;
      const paymentStatus = paymentData.status; // 'approved', 'rejected', 'pending', etc.

      if (!orderId) {
        return new Response(JSON.stringify({ message: 'Pago sin referencia de orden' }), { status: 200 });
      }

      // Registrar o actualizar registro en tabla payments
      await supabase.from('payments').upsert({
        order_id: orderId,
        provider: 'mercadopago',
        external_payment_id: paymentId.toString(),
        status: paymentStatus,
        amount_in_cents: Math.round(paymentData.transaction_amount * 100),
        net_received_amount_in_cents: paymentData.net_received_amount ? Math.round(paymentData.net_received_amount * 100) : null,
        fee_in_cents: paymentData.fee_details ? Math.round(paymentData.fee_details.reduce((a: number, b: any) => a + b.amount, 0) * 100) : null,
        raw_payload: paymentData,
      });

      // 3. Si el pago fue aprobado legítimamente
      if (paymentStatus === 'approved') {
        // Actualizar orden
        const { data: updatedOrder, error: orderUpErr } = await supabase
          .from('orders')
          .update({
            payment_status: 'approved',
            mercadopago_payment_id: paymentId.toString(),
            fulfillment_status: 'preparing',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .select('*, order_items(*)')
          .single();

        if (orderUpErr) throw orderUpErr;

        // Descontar inventario físico definitivo
        await supabase.rpc('confirm_order_stock_payment', { p_order_id: orderId });

        // 4. Disparar notificaciones por email al comprador y alerta de despacho al dueño
        try {
          await supabase.functions.invoke('send-notifications', {
            body: {
              orderId,
              orderNumber: updatedOrder.order_number,
              customerEmail: updatedOrder.customer_email,
              customerName: updatedOrder.customer_name,
              customerPhone: updatedOrder.customer_phone,
              customerDni: updatedOrder.customer_dni,
              deliveryMethod: updatedOrder.delivery_method,
              shippingAddress: {
                street: updatedOrder.shipping_street,
                number: updatedOrder.shipping_number,
                city: updatedOrder.shipping_city,
                province: updatedOrder.shipping_province,
                postalCode: updatedOrder.shipping_postal_code,
              },
              items: updatedOrder.order_items,
              totalInCents: updatedOrder.total_in_cents,
            },
          });
        } catch (notifErr) {
          console.error('Error enviando notificaciones', notifErr);
        }
      } else if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
        await supabase
          .from('orders')
          .update({ payment_status: 'rejected', updated_at: new Date().toISOString() })
          .eq('id', orderId);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Error procesando webhook', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
