import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  AlertTriangle, 
  HeartPulse, 
  FileText, 
  HelpCircle, 
  CreditCard, 
  Clock 
} from 'lucide-react';
import { SEO } from '../../components/common/SEO';

// Reusable Legal Subnav Header
const LegalNav: React.FC<{ current: 'terminos' | 'envios' | 'responsabilidad' | 'faq' }> = ({ current }) => {
  return (
    <nav className="legal-tabs-nav" aria-label="Navegación de documentos legales">
      <Link 
        to="/terminos" 
        className={`legal-tab-btn ${current === 'terminos' ? 'active' : ''}`}
      >
        <FileText size={16} />
        <span>Términos y Condiciones</span>
      </Link>
      <Link 
        to="/envios" 
        className={`legal-tab-btn ${current === 'envios' ? 'active' : ''}`}
      >
        <Truck size={16} />
        <span>Política de Envíos</span>
      </Link>
      <Link 
        to="/responsabilidad" 
        className={`legal-tab-btn ${current === 'responsabilidad' ? 'active' : ''}`}
      >
        <HeartPulse size={16} />
        <span>Aviso de Suplementos</span>
      </Link>
      <Link 
        to="/faq" 
        className={`legal-tab-btn ${current === 'faq' ? 'active' : ''}`}
      >
        <HelpCircle size={16} />
        <span>Preguntas Frecuentes</span>
      </Link>
    </nav>
  );
};

/* =========================================================================
   1. TÉRMINOS Y CONDICIONES DE USO Y COMPRA
   ========================================================================= */
export const TermsPage: React.FC = () => {
  return (
    <div className="container legal-page">
      <SEO
        title="Términos y Condiciones de Uso y Compra | Suplementos Top"
        description="Bases, garantías y condiciones legales que regulan el acceso, navegación y operaciones en la tienda online de Suplementos Top Argentina."
        canonicalUrl="/terminos"
      />

      <LegalNav current="terminos" />

      <header className="legal-header">
        <div className="legal-badge">Marco Legal Oficial</div>
        <h1 className="legal-title">Términos y Condiciones de Uso y Compra</h1>
        <p className="legal-updated">Última actualización: 23/11/2026</p>
      </header>

      <div className="card legal-card">
        <div className="legal-intro">
          <p>
            Bienvenido a <strong>Suplementos Top</strong>.
          </p>
          <p>
            El presente documento establece los términos y condiciones que regulan el acceso, navegación y utilización del sitio web <strong>suplementos-top.vercel.app</strong>, así como las operaciones de compra realizadas a través de nuestra tienda online.
          </p>
          <p>
            Al navegar por el sitio o realizar una compra, el usuario declara haber leído y comprendido las condiciones aquí establecidas, sin que ello implique renuncia a los derechos que le reconoce la legislación vigente.
          </p>
        </div>

        {/* 1. Identificación del vendedor */}
        <section className="legal-section">
          <h2>1. Identificación del vendedor</h2>
          <p>La tienda online es operada comercialmente bajo el nombre <strong>Suplementos Top</strong>.</p>
          <div className="legal-contact-grid">
            <div className="legal-contact-item">
              <strong>Título comercial:</strong> Suplementos Top
            </div>
            <div className="legal-contact-item">
              <strong>Domicilio comercial:</strong> Pres. José E. Uriburu 1163, Recoleta, CABA
            </div>
            <div className="legal-contact-item">
              <strong>Correo electrónico:</strong> suplementostopparg@gmail.com
            </div>
            <div className="legal-contact-item">
              <strong>WhatsApp de contacto:</strong> 11 6565-2990
            </div>
            <div className="legal-contact-item">
              <strong>Instagram oficial:</strong> @suplementos_topp
            </div>
          </div>
        </section>

        {/* 2. Productos y disponibilidad */}
        <section className="legal-section">
          <h2>2. Productos y disponibilidad</h2>
          <p>
            Suplementos Top comercializa suplementos dietarios, nutricionales, deportivos y productos relacionados.
          </p>
          <p>
            Las fotografías, imágenes y descripciones tienen carácter ilustrativo e informativo. Se procurará que representen fielmente los productos comercializados.
          </p>
          <p>
            La disponibilidad de los productos estará sujeta al stock existente al momento de procesar cada pedido.
          </p>
          <p>
            En caso de que un producto no se encuentre disponible luego de realizada una compra, nos comunicaremos con el cliente para ofrecer una solución, que podrá incluir la espera de reposición, la elección de un producto equivalente con conformidad del comprador o la devolución del importe abonado.
          </p>
        </section>

        {/* 3. Precios y promociones */}
        <section className="legal-section">
          <h2>3. Precios y promociones</h2>
          <p>
            Todos los precios publicados deberán indicar claramente la moneda correspondiente (Pesos Argentinos - ARS) y las condiciones de comercialización.
          </p>
          <p>
            Las promociones estarán sujetas a las condiciones y vigencia informadas en cada publicación (incluyendo el 10% de descuento abonando por Transferencia Bancaria directa).
          </p>
          <p>
            Los costos de envío, cuando correspondan, serán informados antes de finalizar la compra de forma transparente en la pantalla de checkout.
          </p>
        </section>

        {/* 4. Proceso de compra */}
        <section className="legal-section">
          <h2>4. Proceso de compra</h2>
          <p>
            Para realizar una compra, el usuario deberá seleccionar los productos, indicar las cantidades, proporcionar los datos necesarios para la operación y elegir el medio de pago y modalidad de entrega disponible.
          </p>
          <p>
            Una vez realizado el pedido, el sistema enviará una confirmación de recepción con el número de pedido asignado.
          </p>
          <p>
            La confirmación de recepción del pedido no necesariamente implica que el pago haya sido acreditado. El estado de la operación será informado por los canales correspondientes (Mercado Pago o comprobante de transferencia bancaria).
          </p>
          <p>
            El cliente es responsable de proporcionar información correcta y completa para el procesamiento y entrega de su compra.
          </p>
        </section>

        {/* 5. Medios de pago */}
        <section className="legal-section">
          <h2>5. Medios de pago</h2>
          <p>
            Los medios de pago disponibles serán informados durante el proceso de compra.
          </p>
          <p>
            Podrán incluir <strong>Mercado Pago</strong> (tarjetas de crédito en cuotas, débito y saldo en cuenta), transferencias bancarias u otros medios habilitados por Suplementos Top.
          </p>
          <p>
            Las operaciones efectuadas mediante plataformas de pago externas estarán sujetas también a los términos y condiciones de dichas plataformas.
          </p>
          <div className="alert-box alert-info">
            <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Seguridad Bancaria:</strong> Suplementos Top <strong>nunca solicita contraseñas bancarias</strong>, códigos de seguridad token ni claves personales de los compradores.
            </span>
          </div>
        </section>

        {/* 6. Entregas y retiros */}
        <section className="legal-section">
          <h2>6. Entregas y retiros</h2>
          <p>
            Los pedidos podrán entregarse mediante servicios de envío o retirarse presencialmente sin cargo en el punto de entrega informado por Suplementos Top (Sede Gimnasio Top Shape, Pres. José E. Uriburu 1163, Recoleta, CABA).
          </p>
          <p>
            Los plazos de entrega serán estimados y dependerán de la modalidad seleccionada y de las condiciones del servicio logístico.
          </p>
          <p>
            El cliente deberá proporcionar correctamente los datos de entrega.
          </p>
          <p>
            Los inconvenientes relacionados con la entrega podrán comunicarse a nuestros canales de atención para gestionar la correspondiente solución.
          </p>
        </section>

        {/* 7. Garantías y derechos del consumidor */}
        <section className="legal-section">
          <h2>7. Garantías y derechos del consumidor</h2>
          <p>
            Los productos comercializados se encuentran sujetos a las garantías legales que correspondan.
          </p>
          <p>
            Ninguna disposición de estos términos y condiciones podrá interpretarse como una renuncia o limitación de los derechos reconocidos por la <strong>Ley 24.240 de Defensa del Consumidor</strong>, el <strong>Código Civil y Comercial de la Nación</strong> y demás normativa aplicable en la República Argentina.
          </p>
        </section>

        {/* 8. Uso del sitio web */}
        <section className="legal-section">
          <h2>8. Uso del sitio web</h2>
          <p>
            El usuario se compromete a utilizar el sitio de manera lícita y a no realizar actividades que puedan perjudicar su funcionamiento, seguridad o disponibilidad.
          </p>
          <p>
            Se encuentra estrictamente prohibido utilizar la plataforma para realizar operaciones fraudulentas, introducir código malicioso o intentar acceder sin autorización a información o sistemas internos.
          </p>
        </section>

        {/* 9. Propiedad intelectual */}
        <section className="legal-section">
          <h2>9. Propiedad intelectual</h2>
          <p>
            Los contenidos propios del sitio, incluyendo textos, fotografías, diseños, identidad visual, logotipos y elementos gráficos, pertenecen a sus respectivos titulares o se utilizan con debida autorización.
          </p>
          <p>
            Queda prohibida su reproducción o utilización comercial no autorizada.
          </p>
        </section>

        {/* 10. Modificaciones */}
        <section className="legal-section">
          <h2>10. Modificaciones</h2>
          <p>
            Suplementos Top podrá actualizar estos términos y condiciones cuando resulte necesario por cambios comerciales, técnicos o normativos.
          </p>
          <p>
            Las modificaciones serán publicadas en esta sección, indicando la fecha de actualización correspondiente.
          </p>
          <p>
            Las condiciones aplicables a cada compra serán las vigentes al momento de su realización, sin afectar derechos adquiridos.
          </p>
        </section>

        {/* 11. Legislación aplicable */}
        <section className="legal-section">
          <h2>11. Legislación aplicable y jurisdicción</h2>
          <p>
            Las operaciones realizadas a través del sitio se regirán por las leyes de la República Argentina, especialmente por la normativa de defensa del consumidor y protección de datos personales.
          </p>
          <p>
            En caso de controversias, serán competentes las autoridades y tribunales que correspondan conforme a las normas de protección al consumidor.
          </p>
        </section>

        {/* 12. Contacto */}
        <section className="legal-section">
          <h2>12. Canales de Contacto y Atención</h2>
          <p>Para consultas, reclamos o solicitudes relacionadas con estos términos, podés comunicarte con nosotros:</p>
          <ul className="legal-bullets">
            <li><strong>Correo electrónico:</strong> <a href="mailto:suplementostopparg@gmail.com">suplementostopparg@gmail.com</a></li>
            <li><strong>WhatsApp oficial:</strong> <a href="https://wa.me/5491165652990" target="_blank" rel="noopener noreferrer">11 6565-2990</a></li>
            <li><strong>Instagram:</strong> <a href="https://instagram.com/suplementos_topp" target="_blank" rel="noopener noreferrer">@suplementos_topp</a></li>
          </ul>
        </section>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

/* =========================================================================
   2. POLÍTICA DE ENVÍOS Y ENTREGAS
   ========================================================================= */
export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="container legal-page">
      <SEO
        title="Política de Envíos y Entregas | Suplementos Top"
        description="Modalidades de entrega, zonas de despacho a domicilio en CABA, GBA e Interior del país, y retiro presencial sin cargo en Recoleta."
        canonicalUrl="/envios"
      />

      <LegalNav current="envios" />

      <header className="legal-header">
        <div className="legal-badge">Logística y Despacho</div>
        <h1 className="legal-title">Política de Envíos y Entregas</h1>
        <p className="legal-updated">Última actualización: 23/11/2026</p>
      </header>

      <div className="card legal-card">
        <div className="legal-intro">
          <p>
            En <strong>Suplementos Top</strong> trabajamos para que cada pedido llegue a su destinatario de manera segura y en las condiciones adecuadas.
          </p>
        </div>

        {/* 1. Modalidades de entrega */}
        <section className="legal-section">
          <div className="section-title-icon">
            <Truck size={22} className="text-accent" />
            <h2>1. Modalidades de entrega</h2>
          </div>
          <p>Los clientes podrán elegir entre las modalidades disponibles al momento de realizar la compra:</p>
          <ul className="legal-bullets">
            <li><strong>Envío a domicilio:</strong> Despacho express a CABA, Gran Buenos Aires (Zonas 1, 2 y 3) y todo el país.</li>
            <li><strong>Envío a sucursal o punto de retiro:</strong> Disponible a través de las empresas logísticas correspondientes.</li>
            <li><strong>Retiro presencial en el punto de entrega de Suplementos Top (100% Sin Cargo):</strong></li>
          </ul>
          <div className="highlight-box">
            <strong>Punto de retiro habitual:</strong> Gimnasio Top Shape, Pres. José E. Uriburu 1163 (entre Av. Santa Fe y Arenales), Recoleta, Ciudad Autónoma de Buenos Aires.<br />
            <strong>Horarios de atención:</strong> Lunes a Viernes de 8:00 a 23:00 hs | Sábados de 10:00 a 18:00 hs.<br />
            <strong>Requisito:</strong> Presentar el número de pedido y DNI.
          </div>
        </section>

        {/* 2. Costos de envío */}
        <section className="legal-section">
          <div className="section-title-icon">
            <CreditCard size={22} className="text-accent" />
            <h2>2. Costos de envío</h2>
          </div>
          <p>
            El costo del envío dependerá del destino, modalidad seleccionada y servicio logístico disponible.
          </p>
          <p>
            El importe correspondiente será informado antes de finalizar la compra en la calculadora de envío y en la pantalla de checkout.
          </p>
          <div className="legal-zones-table-wrap">
            <table className="legal-zones-table">
              <thead>
                <tr>
                  <th>Zona de Cobertura</th>
                  <th>Destino / Partidos</th>
                  <th>Costo Estimado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Retiro en Sede</strong></td>
                  <td>Uriburu 1163 (Gimnasio Top Shape, Recoleta)</td>
                  <td className="text-emerald-700 font-bold">¡GRATIS!</td>
                </tr>
                <tr>
                  <td><strong>CABA</strong></td>
                  <td>Todos los barrios de la Ciudad de Buenos Aires</td>
                  <td>$5.000</td>
                </tr>
                <tr>
                  <td><strong>GBA 1</strong></td>
                  <td>Vicente López, San Isidro, San Fernando, San Martín, Morón, Ituzaingó, Hurlingham, 3 de Febrero, Lanús, Avellaneda, Lomas de Zamora, La Matanza Norte</td>
                  <td>$6.700</td>
                </tr>
                <tr>
                  <td><strong>GBA 2</strong></td>
                  <td>Tigre, Malvinas Argentinas, San Miguel, José C. Paz, Moreno, Merlo, Ezeiza, Esteban Echeverría, Almirante Brown, Quilmes, Berazategui, Florencio Varela, La Matanza Sur</td>
                  <td>$8.700</td>
                </tr>
                <tr>
                  <td><strong>GBA 3</strong></td>
                  <td>Escobar, Pilar, Gral. Rodríguez, Marcos Paz, Cañuelas, San Vicente, Guernica, La Plata (Norte, Centro, Oeste), Berisso, Ensenada</td>
                  <td>$9.700</td>
                </tr>
                <tr>
                  <td><strong>Interior del País</strong></td>
                  <td>Todas las provincias de Argentina por Correo Express a domicilio</td>
                  <td>$9.900</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="legal-fineprint">
            En caso de existir promociones de envío especial o bonificaciones, se indicarán expresamente sus condiciones y vigencia en la tienda.
          </p>
        </section>

        {/* 3. Plazos de entrega */}
        <section className="legal-section">
          <div className="section-title-icon">
            <Clock size={22} className="text-accent" />
            <h2>3. Plazos de entrega</h2>
          </div>
          <p>
            Los plazos de entrega serán estimados y dependerán del destino, la disponibilidad del producto y el servicio de transporte seleccionado:
          </p>
          <ul className="legal-bullets">
            <li><strong>CABA y GBA:</strong> Plazo estimado de 24 a 48 hs hábiles tras confirmarse el pago.</li>
            <li><strong>Interior del país:</strong> Plazo habitual de 3 a 5 días hábiles según la distancia y la localidad.</li>
            <li><strong>Retiro en Sede Recoleta:</strong> Disponible en el mismo día hábil una vez acreditado el pago.</li>
          </ul>
          <p>
            Los tiempos informados no deberán interpretarse como una renuncia a los plazos y obligaciones legales aplicables al vendedor.
          </p>
          <p>
            Ante demoras significativas, el cliente podrá comunicarse con nosotros por WhatsApp (11 6565-2990) o email para solicitar información sobre su pedido.
          </p>
        </section>

        {/* 4. Datos de entrega */}
        <section className="legal-section">
          <h2>4. Datos de entrega</h2>
          <p>
            El comprador será responsable de proporcionar correctamente los datos necesarios para realizar la entrega (dirección exacta, piso/departamento, entrecalles, código postal y teléfono de contacto).
          </p>
          <p>
            En caso de detectar un error en la dirección o información de contacto, deberá comunicarse con nosotros lo antes posible para corregirlo antes de la salida del transporte.
          </p>
        </section>

        {/* 5. Seguimiento del pedido */}
        <section className="legal-section">
          <h2>5. Seguimiento del pedido</h2>
          <p>
            Cuando el servicio logístico lo permita, se proporcionará un número o enlace de seguimiento para consultar el estado del envío en tiempo real, accesible también desde la sección <Link to="/seguimiento"><strong>Seguimiento de Pedido</strong></Link> de nuestra web.
          </p>
        </section>

        {/* 6. Entregas fallidas */}
        <section className="legal-section">
          <h2>6. Entregas fallidas</h2>
          <p>
            Si la entrega no pudiera concretarse por ausencia del destinatario, dirección incorrecta u otra circunstancia, se analizará cada situación para coordinar una nueva entrega o el retiro correspondiente.
          </p>
          <p>
            Los costos adicionales que pudieran generarse por una segunda visita podrán informarse al cliente cuando sean efectivamente aplicables y legalmente procedentes.
          </p>
        </section>

        {/* 7. Productos dañados durante el transporte */}
        <section className="legal-section">
          <h2>7. Productos dañados durante el transporte</h2>
          <p>
            Si recibís un paquete con daños visibles, recomendamos tomar fotografías del embalaje exterior y del contenido de inmediato y comunicarte con nosotros dentro de las 48 hs.
          </p>
          <p>
            Gestionaremos el reclamo y la solución que corresponda para garantizar tu satisfacción y la reposición del producto.
          </p>
          <p>
            La intervención de una empresa de transporte no elimina las responsabilidades legales que correspondan a Suplementos Top frente al consumidor.
          </p>
        </section>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

/* =========================================================================
   3. INFORMACIÓN SOBRE SUPLEMENTOS DIETARIOS Y ALCANCE DE RESPONSABILIDAD
   ========================================================================= */
export const SupplementDisclaimerPage: React.FC = () => {
  return (
    <div className="container legal-page">
      <SEO
        title="Información sobre Suplementos Dietarios y Responsabilidad | Suplementos Top"
        description="Aviso médico, pautas de consumo responsable, advertencias sanitarias y alcance de responsabilidad de suplementos deportivos comercializados por Suplementos Top."
        canonicalUrl="/responsabilidad"
      />

      <LegalNav current="responsabilidad" />

      <header className="legal-header">
        <div className="legal-badge legal-badge-health">
          <HeartPulse size={15} />
          Salud &amp; Consumo Responsable
        </div>
        <h1 className="legal-title">Información sobre Suplementos Dietarios y Alcance de Responsabilidad</h1>
        <p className="legal-updated">Última actualización: 23/11/2026</p>
      </header>

      <div className="card legal-card">
        <div className="alert-box alert-warning">
          <AlertTriangle size={24} className="text-amber-600 flex-shrink-0" />
          <div>
            <strong>Aviso Importante para Consumidores:</strong> Los suplementos dietarios no son medicamentos y no suplen una alimentación balanceada ni el asesoramiento de profesionales de la salud. Consulta a tu médico antes de iniciar cualquier plan nutricional o de suplementación.
          </div>
        </div>

        <div className="legal-intro">
          <p>
            En <strong>Suplementos Top</strong> comercializamos suplementos dietarios, nutricionales y deportivos destinados a complementar la alimentación.
          </p>
          <p>
            La presente información tiene como finalidad establecer pautas para la correcta interpretación de los contenidos publicados en nuestra tienda online y aclarar el alcance de la información comercial proporcionada.
          </p>
        </div>

        {/* 1. Naturaleza de los suplementos dietarios */}
        <section className="legal-section">
          <h2>1. Naturaleza de los suplementos dietarios</h2>
          <p>
            Los suplementos dietarios son productos destinados a complementar la incorporación de nutrientes y otros componentes a la alimentación.
          </p>
          <p>
            <strong>No constituyen medicamentos</strong> ni deben utilizarse como sustitutos de tratamientos médicos, indicaciones profesionales o una alimentación variada y equilibrada.
          </p>
        </section>

        {/* 2. Información de los productos */}
        <section className="legal-section">
          <h2>2. Información de los productos</h2>
          <p>
            Las descripciones, fotografías, características, ingredientes, composiciones, recomendaciones de uso y advertencias publicadas en el sitio se basan en la información proporcionada por los fabricantes, importadores o proveedores correspondientes.
          </p>
          <p>
            El consumidor deberá consultar siempre el <strong>etiquetado original del envase</strong> antes de utilizarlo.
          </p>
          <p>
            En caso de diferencias entre una descripción comercial y la información obligatoria del envase, deberá prevalecer la información reglamentaria correspondiente al producto emitida por la autoridad sanitaria (ANMAT).
          </p>
        </section>

        {/* 3. Uso y consumo */}
        <section className="legal-section">
          <h2>3. Uso y consumo</h2>
          <p>
            Cada suplemento deberá utilizarse respetando estrictamente las instrucciones, dosis recomendadas y advertencias indicadas por su fabricante.
          </p>
          <p>
            <strong>No recomendamos superar las cantidades de consumo</strong> indicadas en el etiquetado del envase.
          </p>
          <p>
            Ante dudas sobre la conveniencia de consumir un producto, se recomienda consultar con un médico, nutricionista o profesional de la salud matriculado.
          </p>
          <p>
            Se deberá prestar especial atención a las advertencias relativas a embarazo, lactancia, menores de edad, enfermedades preexistentes, alergias e interacciones con medicamentos.
          </p>
        </section>

        {/* 4. Ausencia de asesoramiento médico */}
        <section className="legal-section">
          <h2>4. Ausencia de asesoramiento médico</h2>
          <p>
            La información publicada por Suplementos Top tiene carácter <strong>exclusivamente comercial e informativo</strong>.
          </p>
          <p>
            No constituye diagnóstico, prescripción, tratamiento ni asesoramiento médico o nutricional individualizado.
          </p>
          <p>
            La compra de un suplemento no reemplaza en ningún caso la consulta y el seguimiento con profesionales habilitados.
          </p>
        </section>

        {/* 5. Resultados individuales */}
        <section className="legal-section">
          <h2>5. Resultados individuales</h2>
          <p>
            Los resultados derivados del consumo de suplementos pueden variar significativamente entre personas y dependen de múltiples factores biológicos y de estilo de vida, tales como alimentación general, plan de actividad física, descanso, características metabólicas individuales y constancia.
          </p>
          <p>
            Suplementos Top <strong>no garantiza resultados específicos</strong>, transformaciones físicas predeterminadas ni efectos milagrosos por el consumo de un producto.
          </p>
          <p>
            Las fotografías, testimonios y contenidos publicitarios no deben interpretarse como una promesa de resultados garantizados.
          </p>
        </section>

        {/* 6. Contraindicaciones y precauciones */}
        <section className="legal-section">
          <h2>6. Contraindicaciones y precauciones</h2>
          <p>
            El consumidor deberá revisar exhaustivamente la lista de ingredientes, alergenos y advertencias de cada producto antes de consumirlo.
          </p>
          <p>
            En caso de presentar alergias, intolerancias, afecciones renales, hepáticas o cardíacas, encontrarse bajo tratamiento farmacológico, estar embarazada o en período de lactancia, deberá consultar previamente con un profesional de la salud.
          </p>
          <p>
            <strong>No se deberán consumir</strong> productos cuyo envase presente roturas, alteraciones, pérdida de integridad, signos de manipulación indebida en el precinto de seguridad o fecha de vencimiento caducada.
          </p>
        </section>

        {/* 7. Conservación de los productos */}
        <section className="legal-section">
          <h2>7. Conservación de los productos</h2>
          <p>
            Los suplementos deberán almacenarse siguiendo las condiciones indicadas por el fabricante (generalmente en lugar fresco, seco, al resguardo de la luz solar directa y fuera del alcance de los niños).
          </p>
          <p>
            Suplementos Top no puede garantizar las condiciones de conservación de productos una vez entregados al comprador y fuera de nuestro ámbito de control.
          </p>
          <p>
            Esto no limita las responsabilidades que pudieran corresponder por defectos de origen, almacenamiento previo a la entrega o incumplimientos imputables al vendedor.
          </p>
        </section>

        {/* 8. Calidad y procedencia */}
        <section className="legal-section">
          <h2>8. Calidad y procedencia</h2>
          <p>
            Suplementos Top comercializa productos de procedencia identificable, con trazabilidad de lote y que cumplen con los requisitos sanitarios y comerciales aplicables según la normativa vigente en la República Argentina.
          </p>
          <p>
            La información de identificación sanitaria y trazabilidad se encuentra disponible en los envases originales y, cuando corresponda, en las fichas técnicas de producto.
          </p>
        </section>

        {/* 9. Alcance de responsabilidad */}
        <section className="legal-section">
          <h2>9. Alcance de responsabilidad</h2>
          <p>
            Suplementos Top no será responsable por el uso indebido de los productos, el incumplimiento de las instrucciones del fabricante, el consumo de cantidades superiores a las recomendadas ni por decisiones de consumo realizadas ignorando las advertencias correspondientes, en la medida en que legalmente proceda.
          </p>
          <p>
            Esta disposición no excluye ni limita la responsabilidad que pudiera corresponder a Suplementos Top por productos defectuosos, información engañosa, incumplimientos contractuales, negligencia u otras obligaciones establecidas imperativamente por la legislación vigente (Ley 24.240 y concordantes).
          </p>
        </section>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

/* =========================================================================
   4. PREGUNTAS FRECUENTES (FAQ)
   ========================================================================= */
export const FAQPage: React.FC = () => {
  return (
    <div className="container legal-page">
      <SEO
        title="Preguntas Frecuentes | Retiros en Recoleta, Pagos y Envíos"
        description="Preguntas habituales sobre retiros en Uriburu 1163, pagos con 10% OFF en transferencia bancaria, Mercado Pago, suplementos 100% sellados y plazos de entrega."
        canonicalUrl="/faq"
      />

      <LegalNav current="faq" />

      <header className="legal-header">
        <div className="legal-badge">Centro de Ayuda</div>
        <h1 className="legal-title">Preguntas Frecuentes (FAQ)</h1>
        <p className="legal-updated">Respuestas rápidas a las consultas más habituales</p>
      </header>

      <div className="card legal-card">
        <div className="faq-item">
          <h3>¿Los suplementos son 100% originales y sellados de fábrica?</h3>
          <p>
            Sí, absolutamente. En Suplementos Top trabajamos de forma directa con importadores y laboratorios oficiales certificados (Star Nutrition, ENA Sport, BSN, Optimum Nutrition, Mutant, etc.). Cada unidad cuenta con su precinto de seguridad inviolable termosellado de fábrica, número de lote y fecha de vencimiento clara.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Cómo funciona el descuento del 10% por Transferencia Bancaria?</h3>
          <p>
            Al seleccionar el método "Transferencia Bancaria (10% OFF)" durante el Checkout, el sistema descuenta automáticamente el 10% del total de tu pedido. Tras generar la orden, te brindamos los datos de nuestra cuenta bancaria oficial (Alias: <strong>Suplementos.top</strong>, Titular: <strong>Camila Cettour</strong>, CVU: <strong>0000076500000020117357</strong>) y nos enviás el comprobante por WhatsApp para preparar tu paquete al instante.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Puedo pagar en cuotas con Mercado Pago?</h3>
          <p>
            ¡Sí! Aceptamos Mercado Pago Checkout oficial. Podés abonar con todas las tarjetas de crédito habilitadas, aprovechar las promociones bancarias vigentes en cuotas, tarjeta de débito o dinero en cuenta de Mercado Pago.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Cómo y cuándo puedo retirar mi pedido en Recoleta?</h3>
          <p>
            El retiro es <strong>100% gratuito</strong> en nuestro punto de entrega: <strong>Pres. José E. Uriburu 1163 (Gimnasio Top Shape), Recoleta, CABA</strong>. Atendemos de Lunes a Viernes de 8:00 a 23:00 hs y Sábados de 10:00 a 18:00 hs. Podés retirar en el mismo día tras acreditar tu pago presentando tu DNI y número de pedido.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Cuáles son los plazos y costos de envío?</h3>
          <p>
            Realizamos envíos a CABA ($5.000), GBA 1 ($6.700), GBA 2 ($8.700), GBA 3 ($9.700) e Interior del País ($9.900). En CABA y GBA las entregas demoran entre 24 y 48 hs hábiles; al interior del país, entre 3 y 5 días hábiles a domicilio con código de seguimiento online.
          </p>
        </div>

        <div className="faq-item">
          <h3>¿Necesito registrar una cuenta con contraseña para comprar?</h3>
          <p>
            No. Comprás como invitado de manera ágil sin contraseñas obligatorias. Solo te solicitamos los datos necesarios para facturar y coordinar la entrega de tu pedido de forma segura.
          </p>
        </div>
      </div>

      <style>{legalStyles}</style>
    </div>
  );
};

/* =========================================================================
   ESTILOS COMPARTIDOS PARA PÁGINAS LEGALES
   ========================================================================= */
const legalStyles = `
  .legal-page {
    padding-top: 2rem;
    padding-bottom: 5rem;
    max-width: 860px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  .legal-tabs-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 2rem;
    padding: 6px;
    background: #F1F5F9;
    border-radius: 12px;
    border: 1px solid #E2E8F0;
  }
  .legal-tab-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    font-size: 0.88rem;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.15s ease;
  }
  .legal-tab-btn:hover {
    color: #0F172A;
    background: #E2E8F0;
  }
  .legal-tab-btn.active {
    background: #FFFFFF;
    color: #0F172A;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }
  .legal-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .legal-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #EEF2F6;
    color: #1E293B;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 4px 12px;
    border-radius: 9999px;
    margin-bottom: 12px;
  }
  .legal-badge-health {
    background: #FEF3C7;
    color: #92400E;
  }
  .legal-title {
    font-size: 2.2rem;
    font-weight: 900;
    color: #0F172A;
    line-height: 1.2;
    margin: 0 0 10px 0;
  }
  .legal-updated {
    color: #64748B;
    font-size: 0.9rem;
    margin: 0;
  }
  .legal-card {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 16px;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 2.25rem;
    box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.04);
  }
  .legal-intro {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .legal-intro p {
    margin: 0;
    color: #334155;
    line-height: 1.65;
    font-size: 0.95rem;
  }
  .legal-section {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }
  .section-title-icon {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .section-title-icon h2, .legal-section h2 {
    font-size: 1.35rem;
    font-weight: 800;
    color: #0F172A;
    margin: 0;
  }
  .legal-section p {
    color: #475569;
    line-height: 1.7;
    font-size: 0.96rem;
    margin: 0;
  }
  .legal-bullets {
    list-style: disc;
    padding-left: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
  }
  .legal-contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 6px;
  }
  @media (max-width: 640px) {
    .legal-contact-grid {
      grid-template-columns: 1fr;
    }
  }
  .legal-contact-item {
    background: #F8FAFC;
    border: 1px solid #E2E8F0;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #334155;
  }
  .legal-contact-item strong {
    color: #0F172A;
  }
  .highlight-box {
    background: #F0FDF4;
    border-left: 4px solid #16A34A;
    border-right: 1px solid #DCFCE7;
    border-top: 1px solid #DCFCE7;
    border-bottom: 1px solid #DCFCE7;
    padding: 1.1rem 1.35rem;
    border-radius: 8px;
    font-size: 0.92rem;
    line-height: 1.65;
    color: #166534;
    margin: 0.5rem 0;
  }
  .alert-box {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    font-size: 0.92rem;
    line-height: 1.55;
  }
  .alert-info {
    background: #F0FDF4;
    border: 1px solid #BBF7D0;
    color: #166534;
  }
  .alert-warning {
    background: #FFFBEB;
    border: 1px solid #FDE68A;
    color: #92400E;
  }
  .legal-zones-table-wrap {
    overflow-x: auto;
    margin: 0.75rem 0;
    border-radius: 10px;
    border: 1px solid #E2E8F0;
  }
  .legal-zones-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
    text-align: left;
  }
  .legal-zones-table th {
    background: #0F172A;
    color: #FFFFFF;
    padding: 10px 14px;
    font-weight: 700;
  }
  .legal-zones-table td {
    padding: 10px 14px;
    border-bottom: 1px solid #E2E8F0;
    color: #334155;
  }
  .legal-zones-table tr:last-child td {
    border-bottom: none;
  }
  .legal-zones-table tr:nth-child(even) td {
    background: #F8FAFC;
  }
  .legal-fineprint {
    font-size: 0.85rem !important;
    color: #64748B !important;
    font-style: italic;
  }
  .faq-item {
    border-bottom: 1px solid #E2E8F0;
    padding-bottom: 1.5rem;
  }
  .faq-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .faq-item h3 {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 0.6rem;
  }
  .faq-item p {
    color: #475569;
    line-height: 1.7;
    font-size: 0.95rem;
    margin: 0;
  }

  @media (max-width: 640px) {
    .legal-page {
      padding: 1.25rem 1rem 4rem;
    }
    .legal-card {
      padding: 1.5rem 1.25rem;
      gap: 1.75rem;
    }
    .legal-title {
      font-size: 1.6rem;
    }
    .legal-tab-btn {
      flex: 1 1 calc(50% - 8px);
      justify-content: center;
      text-align: center;
      font-size: 0.82rem;
      padding: 8px 10px;
    }
  }
`;
