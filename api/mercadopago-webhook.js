// Vercel Serverless Function: /api/mercadopago-webhook
// Receives official payment notifications from Mercado Pago and emails suplementostopparg@gmail.com when approved.

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'suplementostopparg@gmail.com';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS' || req.method === 'GET') {
    return res.status(200).json({ ok: true });
  }

  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const resendApiKey = process.env.RESEND_API_KEY;

    const body = req.body || {};
    const topic = body.type || body.topic || req.query?.topic || req.query?.type;
    const paymentId = body.data?.id || req.query?.['data.id'] || req.query?.id;

    if ((topic === 'payment' || body.action?.startsWith('payment.')) && paymentId && accessToken) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (mpRes.ok) {
        const payment = await mpRes.json();

        if (payment.status === 'approved' && resendApiKey) {
          const orderRef = payment.external_reference || payment.id;
          const amountARS = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0,
          }).format(payment.transaction_amount || 0);

          const itemsList = (payment.additional_info?.items || [])
            .map((i) => `<li><strong>${i.quantity}x</strong> ${i.title} — $${i.unit_price}</li>`)
            .join('');

          const fromAddress = process.env.EMAIL_FROM || 'Suplementos Top <onboarding@resend.dev>';

          const emailBody = {
            from: fromAddress,
            to: [OWNER_EMAIL],
            subject: `PAGO ACREDITADO MP #${orderRef} — ${amountARS}`,
            html: `
              <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #E4E4E7;border-radius:8px;padding:24px;">
                <h2 style="margin:0 0 12px;color:#166534;">Pago Acreditado en Mercado Pago</h2>
                <p><strong>Pedido:</strong> #${orderRef}</p>
                <p><strong>ID Transacción MP:</strong> #${payment.id}</p>
                <p><strong>Monto acreditado:</strong> ${amountARS}</p>
                <p><strong>Comprador:</strong> ${payment.payer?.first_name || ''} ${payment.payer?.last_name || ''} (${payment.payer?.email || ''}) — DNI: ${payment.payer?.identification?.number || '-'}</p>
                ${itemsList ? `<h3>Productos:</h3><ul>${itemsList}</ul>` : ''}
              </div>
            `,
          };

          const webhookEmailRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailBody),
          });

          const webhookData = await webhookEmailRes.json().catch(() => ({}));
          if (!webhookEmailRes.ok && webhookData?.statusCode === 403 && webhookData?.message?.includes('testing emails')) {
            const match = webhookData.message.match(/\(([^)]+)\)/);
            if (match && match[1]) {
              emailBody.to = [match[1]];
              await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailBody),
              }).catch(() => {});
            }
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    return res.status(200).json({ received: true, warning: err.message });
  }
}
