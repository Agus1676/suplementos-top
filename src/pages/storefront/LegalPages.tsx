import React from 'react';
import { Truck, MapPin, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShippingPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="container legal-page">
      <h1 className="legal-title">Políticas de Envío y Retiro en Sucursal</h1>
      
      <div className="card legal-card">
        <section className="legal-section">
          <div className="section-title-icon">
            <MapPin size={22} className="text-accent" />
            <h2>1. Retiro Gratuito en Local (Recoleta, CABA)</h2>
          </div>
          <p>
            Podés retirar tu compra sin ningún costo de envío en nuestro punto de entrega oficial:
          </p>
          <div className="highlight-box">
            <strong>Dirección:</strong> {settings.pickupAddress}<br />
            <strong>Horarios:</strong> {settings.hoursDescription}<br />
            <strong>Requisito:</strong> Presentar número de pedido y DNI del titular de la compra.
          </div>
          <p>
            Una vez aprobado el pago por Mercado Pago, tu pedido pasa a estado de preparación. Podés pasar a retirar en el día dentro del horario de atención.
          </p>
        </section>

        <section className="legal-section">
          <div className="section-title-icon">
            <Truck size={22} className="text-accent" />
            <h2>2. Envíos a Domicilio (Todo el País)</h2>
          </div>
          <p>
            Realizamos despachos diarios a todas las provincias de la República Argentina mediante empresas logísticas de primer nivel y Correo.
          </p>
          <ul>
            <li><strong>CABA y GBA:</strong> Entregas en 24 a 48 hs hábiles.</li>
            <li><strong>Interior del País:</strong> Plazo habitual de 3 a 5 días hábiles según la localidad.</li>
            <li><strong>Envío Gratis:</strong> Todas las compras que superen los \$85.000 ARS cuentan con costo de envío 100% bonificado.</li>
          </ul>
        </section>

        <section className="legal-section">
          <div className="section-title-icon">
            <ShieldCheck size={22} className="text-accent" />
            <h2>3. Embalaje y Seguridad de los Suplementos</h2>
          </div>
          <p>
            Todos los potes, bolsas de proteína, shakers y suplementos son embalados con burbuja de protección y sellos de seguridad para asegurar que lleguen en perfectas condiciones higiénicas.
          </p>
        </section>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  return (
    <div className="container legal-page">
      <h1 className="legal-title">Preguntas Frecuentes (FAQ)</h1>

      <div className="card legal-card">
        <div className="faq-item">
          <h3>¿Los productos son 100% originales y sellados?</h3>
          <p>
            Sí, absolutamente. En Suplementos Top trabajamos de forma directa con importadores y laboratorios oficiales certificados. Todos los envases cuentan con precinto de seguridad termosellado y fecha de vencimiento visible.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Qué medios de pago aceptan?</h3>
          <p>
            Aceptamos pagos a través de <strong>Mercado Pago Checkout Pro</strong>: tarjetas de crédito (con opciones de cuotas), tarjetas de débito, y saldo disponible en cuenta de Mercado Pago.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Cómo coordino el retiro en Uriburu 1163?</h3>
          <p>
            Al finalizar tu compra seleccionando "Retiro en Recoleta", nuestro sistema te confirmará el pedido. Podés acercarte de Lunes a Viernes de 8:00 a 23:00 hs o Sábados de 10:00 a 18:00 hs con tu DNI.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Cuándo me llega el número de seguimiento de mi envío?</h3>
          <p>
            En cuanto tu paquete es entregado al transporte, el sistema actualiza tu estado a "Despachado" y te notificamos por email o podés chequearlo en la pestaña de <strong>Seguimiento</strong> de nuestra web.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Puedo comprar como invitado sin registrarme?</h3>
          <p>
            ¡Claro que sí! Nunca te obligamos a crear una cuenta con contraseña. Solo necesitamos tus datos de contacto y entrega para emitir el comprobante y despachar tu compra.
          </p>
        </div>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="container legal-page">
      <h1 className="legal-title">Términos, Condiciones y Devoluciones</h1>

      <div className="card legal-card">
        <section className="legal-section">
          <h2>1. Condiciones Generales</h2>
          <p>
            El acceso y uso de este sitio web se rige por los presentes términos y condiciones y por la legislación aplicable en la República Argentina (Ley de Defensa del Consumidor N° 24.240 y Código Civil y Comercial de la Nación).
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Políticas de Cambio y Devolución</h2>
          <p>
            Por razones sanitarias y de bioseguridad alimentaria, los suplementos nutricionales sólo podrán devolverse o cambiarse si se encuentran en su embalaje original intacto, sin abrir y con el precinto de fábrica sin vulnerar, dentro de los 10 días corridos desde su recepción.
          </p>
        </section>

        <section className="legal-section">
          <h2>3. Botón de Arrepentimiento</h2>
          <p>
            Conforme a la normativa de la Dirección Nacional de Defensa del Consumidor, tenés derecho a revocar la aceptación del producto dentro de los 10 (diez) días corridos computados a partir de la fecha de entrega. Para solicitar la cancelación, escribinos a <strong>suplementostopparg@gmail.com</strong> o a nuestro WhatsApp oficial <strong>11 6565 1990</strong>.
          </p>
        </section>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

const legalStyles = `
  .legal-page {
    padding-top: 2rem;
    padding-bottom: 5rem;
    max-width: 840px;
  }
  .legal-title {
    font-size: 2.2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
  .legal-card {
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  .legal-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .section-title-icon {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .section-title-icon h2, .legal-section h2 {
    font-size: 1.35rem;
    color: var(--color-primary);
    margin: 0;
  }
  .legal-section p, .faq-item p {
    color: var(--color-text-muted);
    line-height: 1.7;
    font-size: 0.95rem;
  }
  .legal-section ul {
    list-style: disc;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.95rem;
  }
  .highlight-box {
    background: var(--color-bg-muted);
    border-left: 4px solid var(--color-accent);
    padding: 1rem 1.25rem;
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    line-height: 1.6;
    margin: 0.5rem 0;
  }
  .faq-item {
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 1.5rem;
  }
  .faq-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .faq-item h3 {
    font-size: 1.15rem;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
  }
`;
