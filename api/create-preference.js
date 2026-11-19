// Vercel Serverless Function: /api/create-preference
// Creates an official Mercado Pago Checkout Pro preference using MERCADOPAGO_ACCESS_TOKEN.

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(200).json({
      configured: false,
      message: 'MERCADOPAGO_ACCESS_TOKEN no configurado aún en variables de entorno.',
    });
  }

  try {
    const { items, customer, shippingFeeInCents = 0, orderNumber, siteUrl } = req.body || {};

    if (!Array.isArray(items) || items.length === 0 || !customer) {
      return res.status(400).json({ error: 'Datos de orden incompletos' });
    }

    const origin =
      siteUrl ||
      (req.headers.origin ? req.headers.origin : 'https://suplementos-top.vercel.app');

    const mpItems = items.map((item) => ({
      id: String(item.variantId || item.productId || 'item'),
      title: `${item.productName}${item.variantTitle ? ` (${item.variantTitle})` : ''}`,
      unit_price: Number((Number(item.priceInCents) / 100).toFixed(2)),
      quantity: Number(item.quantity) || 1,
      currency_id: 'ARS',
    }));

    if (Number(shippingFeeInCents) > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Envío a domicilio',
        unit_price: Number((Number(shippingFeeInCents) / 100).toFixed(2)),
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
        phone: { number: String(customer.phone || '') },
        identification: {
          type: 'DNI',
          number: String(customer.dni || '').replace(/\D/g, ''),
        },
      },
      external_reference: String(orderNumber || `ST-${Date.now().toString().slice(-6)}`),
      statement_descriptor: 'SUPLEMENTOS TOP',
      back_urls: {
        success: `${origin}/pago-resultado?orden=${encodeURIComponent(orderNumber)}&status=approved`,
        pending: `${origin}/pago-resultado?orden=${encodeURIComponent(orderNumber)}&status=pending`,
        failure: `${origin}/pago-resultado?orden=${encodeURIComponent(orderNumber)}&status=rejected`,
      },
      auto_return: 'approved',
    };

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferencePayload),
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok || !mpData.init_point) {
      return res.status(502).json({
        error: 'Error creando preferencia en Mercado Pago',
        details: mpData,
      });
    }

    return res.status(200).json({
      configured: true,
      preferenceId: mpData.id,
      initPoint: mpData.init_point,
      sandboxInitPoint: mpData.sandbox_init_point,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
}
