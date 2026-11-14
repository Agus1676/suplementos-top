import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Clock, 
  Award,
  Phone,
  ShieldCheck,
  Truck,
  CreditCard,
  Flame,
  Star
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';

export const HomePage: React.FC = () => {
  const { products, categories, settings } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="home-container">
      {/* Cinematic Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-pill">
              <Flame size={15} className="text-gold" />
              <span>SUPLEMENTACIÓN DEPORTIVA PROFESIONAL</span>
            </div>

            <h1 className="hero-title">
              POTENCIA. FUERZA. <br />
              <span className="text-gold-gradient">RENDIMIENTO SIN LÍMITES.</span>
            </h1>

            <p className="hero-desc">
              Proteínas de flujo cruzado CFM, creatinas micronizadas con sello Creapure® y pre-entrenos de máxima intensidad. Despachos diarios a todo el país y retiro presencial hoy mismo en nuestra sede de Recoleta.
            </p>

            {/* Quick Metrics */}
            <div className="hero-metrics-bar">
              <div className="metric-box">
                <span className="metric-num text-gold">100%</span>
                <span className="metric-txt">Puras & Selladas</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-box">
                <span className="metric-num text-gold">+15.000</span>
                <span className="metric-txt">Atletas Satisfechos</span>
              </div>
              <div className="metric-divider"></div>
              <div className="metric-box">
                <span className="metric-num text-gold">24/48hs</span>
                <span className="metric-txt">Despacho Express</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn btn-primary btn-lg">
                <span>VER CATÁLOGO COMPLETO</span>
                <ArrowRight size={20} />
              </Link>
              <a 
                href="https://wa.me/5491165651990?text=Hola!%20Quisiera%20asesoramiento%20sobre%20suplementos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <Phone size={18} className="text-gold" />
                <span>ASESORAMIENTO WHATSAPP</span>
              </a>
            </div>

            {/* Location Banner Pill */}
            <div className="hero-location-banner">
              <MapPin size={22} className="text-gold flex-shrink-0" />
              <div>
                <strong>Punto de Retiro Oficial en CABA:</strong>
                <p>{settings.pickupAddress} • <em>{settings.hoursDescription}</em></p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="hero-media">
            <div className="hero-image-wrapper">
              <div className="hero-emblem-card">
                <img 
                  src="/logo.jpg" 
                  alt="Suplementos Top Emblem" 
                  className="hero-badge-img"
                />
              </div>
              
              <div className="hero-floating-stat top-stat">
                <Award size={20} className="text-gold" />
                <div>
                  <span className="stat-title">CREAPURE® ORIGINAL</span>
                  <span className="stat-sub">Sello alemán certificado</span>
                </div>
              </div>

              <div className="hero-floating-stat bottom-stat">
                <ShieldCheck size={20} className="text-success" />
                <div>
                  <span className="stat-title">PAGOS EN CUOTAS</span>
                  <span className="stat-sub">Protección Mercado Pago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Bar */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon-box">
                <Truck size={24} />
              </div>
              <div className="trust-content">
                <h4>ENVÍOS A TODO EL PAÍS</h4>
                <p>Gratis en compras superiores a $85.000.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <MapPin size={24} />
              </div>
              <div className="trust-content">
                <h4>RETIRO INMEDIATO EN CABA</h4>
                <p>Uriburu 1163 (entre Sta. Fe y Arenales).</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <CreditCard size={24} />
              </div>
              <div className="trust-content">
                <h4>MERCADO PAGO SEGURO</h4>
                <p>3 cuotas con tarjetas y dinero en cuenta.</p>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Clock size={24} />
              </div>
              <div className="trust-content">
                <h4>AMPLIOS HORARIOS</h4>
                <p>Lun a Vie 8 a 23hs | Sáb 10 a 18hs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">SELECCIONÁ TU OBJETIVO</span>
              <h2 className="section-title">CATEGORÍAS DE RENDIMIENTO</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>EXPLORAR TODO</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="category-card"
              >
                <img src={cat.imageUrl} alt={cat.name} className="category-img" />
                <div className="category-gradient"></div>
                <div className="category-content">
                  <h3 className="category-name">{cat.name}</h3>
                  <span className="category-cta">VER PRODUCTOS →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">LOS FAVORITOS DE NUESTROS ATLETAS</span>
              <h2 className="section-title">PRODUCTOS MÁS VENDIDOS</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>VER CATÁLOGO COMPLETO</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="products-grid">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Athletic Location Showcase Banner */}
      <section className="location-showcase-section">
        <div className="container">
          <div className="showcase-card">
            <div className="showcase-content">
              <span className="showcase-tag">SEDE CENTRAL Y RETIRO EXPRESS</span>
              <h2 className="showcase-title">¿QUERÉS RETIRAR TUS SUPLEMENTOS HOY?</h2>
              <p className="showcase-desc">
                Te esperamos en nuestro exclusivo punto de entrega ubicado en <strong>Uriburu 1163 (entre Av. Santa Fe y Arenales), Recoleta, CABA</strong>.
                Podés abonar por la tienda online con Mercado Pago y retirar en el acto presentando tu DNI.
              </p>

              <div className="showcase-hours-grid">
                <div className="hour-item">
                  <Clock size={20} className="text-gold" />
                  <div>
                    <strong>Lunes a Viernes:</strong>
                    <span>8:00 a 23:00 hs (Horario Corrido)</span>
                  </div>
                </div>

                <div className="hour-item">
                  <Clock size={20} className="text-gold" />
                  <div>
                    <strong>Sábados:</strong>
                    <span>10:00 a 18:00 hs</span>
                  </div>
                </div>
              </div>

              <div className="showcase-actions">
                <a
                  href="https://maps.google.com/?q=Uriburu+1163,+Recoleta,+CABA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MapPin size={18} />
                  <span>VER EN GOOGLE MAPS</span>
                </a>

                <a
                  href="https://wa.me/5491165651990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <Phone size={18} className="text-gold" />
                  <span>CONSULTAR AL 11 6565 1990</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">MÁXIMA PUREZA Y RECUPERACIÓN</span>
              <h2 className="section-title">LANZAMIENTOS Y NOVEDADES</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>EXPLORAR CATÁLOGO ({products.length})</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Athlete Testimonials / Social Proof */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <div>
              <span className="section-eyebrow">EXPERIENCIAS REALES</span>
              <h2 className="section-title">LO QUE DICEN NUESTROS ATLETAS</h2>
            </div>
          </div>

          <div className="testimonials-grid">
            <div className="card testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="testimonial-quote">
                "La calidad de la Creatina Creapure y el aislado de suero es superior a cualquier otra tienda. Retiré en el local de Uriburu a las 21hs sin demora. 10 de 10."
              </p>
              <div className="testimonial-author">
                <strong>Matías Benítez</strong>
                <span>Atleta de Fuerza & Powerlifting</span>
              </div>
            </div>

            <div className="card testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="testimonial-quote">
                "Excelente atención por WhatsApp. Me asesoraron sobre qué pre-entreno tomar para mis turnos de crossfit y llegó a Córdoba en 48 horas impecable."
              </p>
              <div className="testimonial-author">
                <strong>Camila Rossi</strong>
                <span>CrossFit Competitor</span>
              </div>
            </div>

            <div className="card testimonial-card">
              <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="testimonial-quote">
                "Compro todos los meses. Los sabores belga y frutilla del aislado se mezclan al instante sin grumos. El mejor servicio de suplementos de Argentina."
              </p>
              <div className="testimonial-author">
                <strong>Luciano Díaz</strong>
                <span>Entrenador Personal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 4.5rem;
        }
        .hero-section {
          position: relative;
          background: radial-gradient(circle at 75% 20%, rgba(229, 184, 105, 0.12) 0%, rgba(7, 9, 14, 0.95) 70%), #07090E;
          padding: 4.5rem 0 5.5rem;
          border-bottom: 1px solid var(--color-border);
          overflow: hidden;
        }
        .hero-bg-glow {
          position: absolute;
          top: -200px;
          right: -100px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(229, 184, 105, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        @media (min-width: 992px) {
          .hero-inner {
            grid-template-columns: 1.2fr 1fr;
          }
        }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(229, 184, 105, 0.12);
          border: 1px solid rgba(229, 184, 105, 0.35);
          color: var(--color-accent);
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          padding: 0.4rem 0.9rem;
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
        }
        .hero-title {
          font-size: 2.8rem;
          letter-spacing: 0.02em;
          line-height: 1;
          margin-bottom: 1.25rem;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 4.2rem;
          }
        }
        .hero-desc {
          font-size: 1.05rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 620px;
        }
        .hero-metrics-bar {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          background: rgba(18, 23, 36, 0.6);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          width: fit-content;
        }
        .metric-box {
          display: flex;
          flex-direction: column;
        }
        .metric-num {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 800;
          line-height: 1;
        }
        .metric-txt {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .metric-divider {
          width: 1px;
          height: 32px;
          background: var(--color-border);
        }
        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.25rem;
        }
        .hero-location-banner {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: rgba(18, 23, 36, 0.7);
          border: 1px solid var(--color-border);
          border-left: 3px solid var(--color-accent);
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
        }
        .hero-location-banner strong {
          color: #FFF;
          display: block;
        }
        .hero-location-banner p {
          color: var(--color-text-muted);
        }
        .hero-media {
          display: flex;
          justify-content: center;
        }
        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 440px;
        }
        .hero-emblem-card {
          width: 100%;
          aspect-ratio: 1;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 2px solid var(--color-border-gold);
          box-shadow: 0 0 35px rgba(229, 184, 105, 0.2);
          background: #000;
        }
        .hero-badge-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .hero-image-wrapper:hover .hero-badge-img {
          transform: scale(1.03);
        }
        .hero-floating-stat {
          position: absolute;
          background: rgba(18, 23, 36, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid var(--color-border-gold);
          padding: 0.75rem 1.15rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-lg);
        }
        .top-stat {
          top: -20px;
          right: -15px;
        }
        .bottom-stat {
          bottom: -20px;
          left: -15px;
        }
        .stat-title {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.95rem;
          color: #FFFFFF;
          display: block;
        }
        .stat-sub {
          font-size: 0.725rem;
          color: var(--color-text-muted);
        }
        /* Trust Strip */
        .trust-strip {
          background: var(--color-bg-secondary);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: 2.5rem 0;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .trust-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .trust-card {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .trust-icon-box {
          background: rgba(229, 184, 105, 0.1);
          color: var(--color-accent);
          border: 1px solid rgba(229, 184, 105, 0.25);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .trust-content h4 {
          font-size: 1.05rem;
          color: #FFF;
          margin-bottom: 0.15rem;
        }
        .trust-content p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        /* Section Headers */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .section-eyebrow {
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.25rem;
        }
        .section-title {
          font-size: 2.2rem;
          margin: 0;
        }
        .section-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 1rem;
          color: var(--color-accent);
          letter-spacing: 0.05em;
        }
        .section-link:hover {
          color: #FFF;
        }
        /* Categories */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        .category-card {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .category-card:hover .category-img {
          transform: scale(1.08);
        }
        .category-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 9, 14, 0) 30%, rgba(7, 9, 14, 0.95) 100%);
        }
        .category-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1rem;
        }
        .category-name {
          font-size: 1.15rem;
          margin-bottom: 0.25rem;
        }
        .category-cta {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--color-accent);
          letter-spacing: 0.05em;
        }
        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .products-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        /* Location Showcase */
        .showcase-card {
          background: radial-gradient(circle at top right, #1C2436 0%, #0D111A 100%);
          border: 1.5px solid var(--color-border-gold);
          border-radius: var(--radius-lg);
          padding: 3.5rem 2.5rem;
          box-shadow: var(--shadow-gold);
        }
        .showcase-tag {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.75rem;
        }
        .showcase-title {
          font-size: 2.4rem;
          margin-bottom: 1rem;
        }
        .showcase-desc {
          color: var(--color-text-muted);
          font-size: 1.1rem;
          max-width: 720px;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .showcase-hours-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2.25rem;
        }
        .hour-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid var(--color-border);
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
        }
        .hour-item strong {
          display: block;
          font-size: 0.9rem;
          color: #FFF;
        }
        .hour-item span {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .showcase-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        /* Testimonials */
        .text-center {
          text-align: center;
          justify-content: center;
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .testimonial-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-color: var(--color-border);
        }
        .testimonial-rating {
          display: flex;
          gap: 0.25rem;
        }
        .fill-gold {
          fill: var(--color-accent);
        }
        .testimonial-quote {
          font-size: 0.95rem;
          color: #CBD5E1;
          line-height: 1.6;
          font-style: italic;
          flex: 1;
        }
        .testimonial-author strong {
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: #FFF;
          display: block;
        }
        .testimonial-author span {
          font-size: 0.775rem;
          color: var(--color-accent);
        }
      `}</style>
    </div>
  );
};
