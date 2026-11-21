// Vercel Serverless Function: /api/create-preference
// Creates an official Mercado Pago Checkout Pro preference using MERCADOPAGO_ACCESS_TOKEN.
// Hardened with strict payload validation, price sanitization, and anti-injection defenses.

function sanitizeText(val, maxLen = 100) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>'"`;(){}]/g, '')
    .trim()
    .slice(0, maxLen);
}

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 120;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://suplementos-top.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://suplementos-top.vercel.app');
  }

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

    // 1. Strict validation of cart items
    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ error: 'Lista de productos inválida o vacía.' });
    }

    if (!customer || typeof customer !== 'object') {
      return res.status(400).json({ error: 'Datos de comprador inválidos.' });
    }

    // 2. Validate and sanitize customer information
    const cleanFirstName = sanitizeText(customer.firstName, 60);
    const cleanLastName = sanitizeText(customer.lastName, 60);
    const cleanEmail = String(customer.email || '').trim().toLowerCase();
    const cleanPhone = String(customer.phone || '').replace(/[^\d+]/g, '').slice(0, 20);
    const cleanDni = String(customer.dni || '').replace(/\D/g, '').slice(0, 12);
    const cleanOrderNumber = sanitizeText(orderNumber || `ST-${Date.now().toString().slice(-6)}`, 30);

    if (!cleanFirstName || !cleanLastName) {
      return res.status(400).json({ error: 'Nombre y apellido requeridos.' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Email con formato inválido.' });
    }

    if (cleanDni.length < 6) {
      return res.status(400).json({ error: 'DNI inválido.' });
    }

    // 3. Strict item price & quantity validation to prevent price tampering
    const mpItems = [];
    for (const item of items) {
      const priceCents = Math.round(Number(item.priceInCents));
      const quantity = Math.round(Number(item.quantity));

      // Guard: unit price must be positive integer between 100 pesos and 10 million pesos
      if (!Number.isFinite(priceCents) || priceCents <= 0 || priceCents > 1000000000) {
        return res.status(400).json({ error: 'Monto de producto inválido detectado.' });
      }

      // Guard: quantity must be between 1 and 99
      if (!Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ error: 'Cantidad de unidades inválida detectada.' });
      }

      const cleanTitle = sanitizeText(
        `${item.productName || 'Producto'}${item.variantTitle ? ` (${item.variantTitle})` : ''}`,
        120
      );

      mpItems.push({
        id: sanitizeText(String(item.variantId || item.productId || 'item'), 40),
        title: cleanTitle,
        unit_price: Number((priceCents / 100).toFixed(2)),
        quantity,
        currency_id: 'ARS',
      });
    }

    // 4. Validate shipping fee
    const cleanShippingFee = Math.round(Number(shippingFeeInCents));
    if (cleanShippingFee > 0 && cleanShippingFee <= 5000000) {
      mpItems.push({
        id: 'shipping',
        title: 'Envío a domicilio protegido',
        unit_price: Number((cleanShippingFee / 100).toFixed(2)),
        quantity: 1,
        currency_id: 'ARS',
      });
    }

    const baseOrigin =
      siteUrl && (siteUrl.startsWith('https://') || siteUrl.startsWith('http://localhost'))
        ? siteUrl
        : 'https://suplementos-top.vercel.app';

    const preferencePayload = {
      items: mpItems,
      payer: {
        name: cleanFirstName,
        surname: cleanLastName,
        email: cleanEmail,
        phone: { number: cleanPhone },
        identification: {
          type: 'DNI',
          number: cleanDni,
        },
      },
      external_reference: cleanOrderNumber,
      statement_descriptor: 'SUPLEMENTOS TOP',
      back_urls: {
        success: `${baseOrigin}/pago-resultado?orden=${encodeURIComponent(cleanOrderNumber)}&status=approved`,
        pending: `${baseOrigin}/pago-resultado?orden=${encodeURIComponent(cleanOrderNumber)}&status=pending`,
        failure: `${baseOrigin}/pago-resultado?orden=${encodeURIComponent(cleanOrderNumber)}&status=rejected`,
      },
      auto_return: 'approved',
      notification_url: `${baseOrigin}/api/mercadopago-webhook`,
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
        details: mpData?.message || 'Error de pasarela',
      });
    }

    return res.status(200).json({
      configured: true,
      preferenceId: mpData.id,
      initPoint: mpData.init_point,
      sandboxInitPoint: mpData.sandbox_init_point,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error procesando solicitud de pago' });
  }
}
