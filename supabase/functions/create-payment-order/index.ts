// Supabase Edge Function: create-payment-order
// Runtime: Deno / TypeScript

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const mpAccessToken = Deno.env.get('MERCADOPAGO_ACCESS_TOKEN') ?? '';
    const siteUrl = Deno.env.get('SITE_URL') ?? 'http://localhost:3000';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { items, customer, deliveryMethod, shippingAddress } = await req.json();

    if (!items || !items.length || !customer) {
      return new Response(JSON.stringify({ error: 'Parámetros inválidos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Recalcular precios reales desde la base de datos (Nunca confiar en el cliente)
    let calculatedSubtotalInCents = 0;
    const verifiedOrderItems = [];

    for (const item of items) {
      const { data: variant, error: varErr } = await supabase
        .from('product_variants')
        .select('*, product:products(*)')
        .eq('id', item.variantId)
        .single();

      if (varErr || !variant) {
        return new Response(JSON.stringify({ error: `Variante no encontrada: ${item.variantId}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const itemTotal = variant.price_in_cents * item.quantity;
      calculatedSubtotalInCents += itemTotal;

      verifiedOrderItems.push({
        productId: variant.product_id,
        variantId: variant.id,
        productName: variant.product.name,
        variantTitle: variant.title,
        sku: variant.sku,
        unitPriceInCents: variant.price_in_cents,
        quantity: item.quantity,
        totalPriceInCents: itemTotal,
      });
    }

    // 2. Costo de envío
    const shippingFeeInCents = deliveryMethod === 'pickup' 
      ? 0 
      : calculatedSubtotalInCents >= 8500000 
        ? 0 
        : 490000;

    const finalTotalInCents = calculatedSubtotalInCents + shippingFeeInCents;
    const orderNumber = `ST-${Date.now().toString().slice(-6)}`;

    // 3. Crear orden en estado pending
    const { data: newOrder, error: orderErr } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_email: customer.email,
        customer_phone: customer.phone,
        customer_dni: customer.dni,
        delivery_method: deliveryMethod,
        shipping_street: shippingAddress?.street,
        shipping_number: shippingAddress?.number,
        shipping_apartment: shippingAddress?.apartment,
        shipping_neighborhood: shippingAddress?.neighborhood,
        shipping_city: shippingAddress?.city,
        shipping_province: shippingAddress?.province,
        shipping_postal_code: shippingAddress?.postalCode,
        shipping_notes: shippingAddress?.deliveryNotes,
        subtotal_in_cents: calculatedSubtotalInCents,
        shipping_fee_in_cents: shippingFeeInCents,
        discount_in_cents: 0,
        total_in_cents: finalTotalInCents,
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 4. Reservar stock en PostgreSQL con bloqueo y TTL
    for (const item of verifiedOrderItems) {
      const { data: reserved, error: resErr } = await supabase.rpc('reserve_stock_for_checkout', {
        p_order_id: newOrder.id,
        p_variant_id: item.variantId,
        p_quantity: item.quantity,
        p_ttl_minutes: 15,
      });

      if (resErr || !reserved) {
        return new Response(JSON.stringify({ error: `Stock insuficiente para ${item.productName}` }), {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // 5. Crear preferencia de pago en Mercado Pago
    const mpItems = verifiedOrderItems.map((item) => ({
      id: item.variantId,
      title: `${item.productName} - ${item.variantTitle}`,
      unit_price: item.unitPriceInCents / 100, // MP espera pesos en float
      quantity: item.quantity,
      currency_id: 'ARS',
    }));

    if (shippingFeeInCents > 0) {
      mpItems.push({
        id: 'shipping-rate',
        title: 'Costo de Envío a Domicilio',
        unit_price: shippingFeeInCents / 100,
        quantity: 1,
        currency_id: 'ARS',
      });
    }

    const preferencePayload = {
      items: mpItems,
      payer: {
        name: customer.firstName,
        surname: customer.lastName,
        email: customer.email,
        phone: { number: customer.phone },
        identification: { type: 'DNI', number: customer.dni },
      },
      external_reference: newOrder.id,
      statement_descriptor: 'SUPLEMENTOS TOP',
      back_urls: {
        success: `${siteUrl}/pago-resultado?orden=${orderNumber}&status=approved`,
        failure: `${siteUrl}/checkout?status=failure`,
        pending: `${siteUrl}/pago-resultado?orden=${orderNumber}&status=pending`,
      },
      auto_return: 'approved',
      notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
    };

    let initPoint = `${siteUrl}/pago-resultado?orden=${orderNumber}&simulated=true`;

    if (mpAccessToken) {
      const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mpAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferencePayload),
      });

      const mpData = await mpRes.json();
      if (mpData.init_point) {
        initPoint = mpData.init_point;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        orderNumber,
        orderId: newOrder.id,
        initPoint,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
