import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Phone,
  Flame,
  Award,
  Instagram
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';

export const HomePage: React.FC = () => {
  const { products, categories, settings } = useStore();

  const bestSellers = products.filter((p) => p.isBestSeller);
  const featuredProducts = products.filter((p) => p.isFeatured);

  return (
    <div className="home-container">
      {/* Hero Banner (Clean, Professional Corporate Sports Style like ENA Sport) */}
      <section className="hero-banner">
        <div className="container hero-inner">
          <div className="hero-text-side">
            <div className="hero-badge">
              <Flame size={14} className="text-red" />
              <span>TIENDA OFICIAL DE NUTRICIÓN DEPORTIVA</span>
            </div>

            <h1 className="hero-title">
              POTENCIÁ TU ENTRENAMIENTO AL MÁXIMO
            </h1>

            <p className="hero-subtitle">
              Proteínas microfiltradas CFM, creatinas puras Creapure® y fórmulas avanzadas para atletas exigentes.
            </p>

            <div className="hero-installments-pill">
              <CreditCard size={18} className="text-green-600" />
              <span><strong>HASTA 3 CUOTAS SIN INTERÉS</strong> con todas las tarjetas en Mercado Pago</span>
            </div>

            <div className="hero-buttons">
              <Link to="/catalogo" className="btn btn-primary btn-lg">
                <span>VER TODOS LOS PRODUCTOS</span>
                <ArrowRight size={18} />
              </Link>
              <a 
                href="https://wa.me/5491165651990?text=Hola!%20Quisiera%20asesoramiento%20sobre%20suplementos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <Phone size={18} />
                <span>ASESORAMIENTO WHATSAPP</span>
              </a>
            </div>

            {/* Sede Retiro Info */}
            <div className="hero-pickup-card">
              <MapPin size={20} className="text-red flex-shrink-0" />
              <div>
                <strong>Punto de Retiro Oficial en Recoleta:</strong>
                <p>{settings.pickupAddress} • <em>Lun a Vie 8 a 23hs | Sáb 10 a 18hs</em></p>
              </div>
            </div>
          </div>

          <div className="hero-image-side">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=900&q=80"
                alt="Nutrición deportiva Suplementos Top"
                className="hero-main-photo"
              />
              <div className="floating-badge-award">
                <Award size={22} className="text-red" />
                <div>
                  <strong>CALIDAD CERTIFICADA</strong>
                  <span>Materias primas originales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip (Clean 4-column like ENA Sport) */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon-wrap">
                <Truck size={24} />
              </div>
              <div className="trust-text">
                <h4>ENVÍO GRATIS</h4>
                <p>En compras superiores a $85.000 a todo el país.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-wrap">
                <CreditCard size={24} />
              </div>
              <div className="trust-text">
                <h4>3 CUOTAS SIN INTERÉS</h4>
                <p>Con todas las tarjetas a través de Mercado Pago.</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-wrap">
                <MapPin size={24} />
              </div>
              <div className="trust-text">
                <h4>RETIRO EN EL DÍA GRATIS</h4>
                <p>Uriburu 1163, Recoleta (Lun a Vie 8 a 23hs).</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-wrap">
                <ShieldCheck size={24} />
              </div>
              <div className="trust-text">
                <h4>100% ORIGINAL</h4>
                <p>Productos sellados y con fecha de vencimiento visible.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Circles (Clean ENA Sport style) */}
      <section className="category-circles-section">
        <div className="container">
          <div className="section-title-wrap">
            <h2 className="section-heading">COMPRAR POR CATEGORÍA</h2>
            <Link to="/catalogo" className="section-all-link">
              <span>Ver todas</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-circles-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="category-circle-item"
              >
                <div className="circle-image-wrap">
                  <img src={cat.imageUrl} alt={cat.name} />
                </div>
                <span className="circle-title">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="products-showcase-section">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="eyebrow-text">LOS FAVORITOS</span>
              <h2 className="section-heading">PRODUCTOS MÁS VENDIDOS</h2>
            </div>
            <Link to="/catalogo" className="section-all-link">
              <span>Ver catálogo</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Grid (Comprar por Objetivo - ENA Sport standard) */}
      <section className="objectives-section">
        <div className="container">
          <div className="section-title-wrap text-center-header">
            <h2 className="section-heading">COMPRAR POR OBJETIVO</h2>
            <p className="section-desc">Elegí la nutrición diseñada específicamente para tu meta física.</p>
          </div>

          <div className="objectives-grid">
            <Link to="/catalogo?categoria=proteinas" className="objective-card">
              <div className="objective-bg-img" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80')` }}></div>
              <div className="objective-overlay"></div>
              <div className="objective-content">
                <h3>AUMENTO DE MASA MUSCULAR</h3>
                <span>VER PRODUCTOS →</span>
              </div>
            </Link>

            <Link to="/catalogo?categoria=creatinas" className="objective-card">
              <div className="objective-bg-img" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80')` }}></div>
              <div className="objective-overlay"></div>
              <div className="objective-content">
                <h3>FUERZA Y POTENCIA EXPLOSIVA</h3>
                <span>VER PRODUCTOS →</span>
              </div>
            </Link>

            <Link to="/catalogo?categoria=pre-entrenos" className="objective-card">
              <div className="objective-bg-img" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80')` }}></div>
              <div className="objective-overlay"></div>
              <div className="objective-content">
                <h3>ENERGÍA & RENDIMIENTO INTENSO</h3>
                <span>VER PRODUCTOS →</span>
              </div>
            </Link>

            <Link to="/catalogo?categoria=salud-vitaminas" className="objective-card">
              <div className="objective-bg-img" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80')` }}></div>
              <div className="objective-overlay"></div>
              <div className="objective-content">
                <h3>RECUPERACIÓN & SALUD INTEGRAL</h3>
                <span>VER PRODUCTOS →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Sede Central Recoleta (Uriburu 1163) Callout */}
      <section className="pickup-showcase-section">
        <div className="container">
          <div className="pickup-banner-card">
            <div className="pickup-text-side">
              <span className="badge badge-red">SEDE CENTRAL RECOLETA</span>
              <h2>¿QUERÉS RETIRAR TU PEDIDO HOY MISMO?</h2>
              <p>
                Comprá online con Mercado Pago y retirá sin costo de envío en nuestro punto de entrega de <strong>Uriburu 1163 (entre Av. Santa Fe y Arenales), Recoleta, CABA</strong>.
              </p>

              <div className="hours-list">
                <div className="hour-row">
                  <Clock size={18} className="text-red" />
                  <span><strong>Lunes a Viernes:</strong> 8:00 a 23:00 hs</span>
                </div>
                <div className="hour-row">
                  <Clock size={18} className="text-red" />
                  <span><strong>Sábados:</strong> 10:00 a 18:00 hs</span>
                </div>
              </div>

              <div className="pickup-actions">
                <a
                  href="https://maps.google.com/?q=Uriburu+1163,+Recoleta,+CABA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MapPin size={18} />
                  <span>CÓMO LLEGAR (GOOGLE MAPS)</span>
                </a>

                <a
                  href="https://wa.me/5491165651990"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <Phone size={18} />
                  <span>CONSULTAS: 11 6565 1990</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Products / New Arrivals */}
      <section className="products-showcase-section">
        <div className="container">
          <div className="section-title-wrap">
            <div>
              <span className="eyebrow-text">MÁXIMA RECUPERACIÓN</span>
              <h2 className="section-heading">NOVEDADES Y LANZAMIENTOS</h2>
            </div>
            <Link to="/catalogo" className="section-all-link">
              <span>Ver catálogo ({products.length})</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Community Section */}
      <section className="community-section">
        <div className="container">
          <div className="community-header">
            <Instagram size={28} className="text-red" />
            <h2>SUMATE A NUESTRA COMUNIDAD</h2>
            <p>Seguinos en Instagram <a href={settings.instagram} target="_blank" rel="noopener noreferrer">@suplementos_topp</a> y enterate de sorteos, lanzamientos y rutinas.</p>
          </div>
        </div>
      </section>

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }
        /* Hero Banner */
        .hero-banner {
          background-color: #F8F9FA;
          border-bottom: 1px solid var(--color-border);
          padding: 3.5rem 0 4rem;
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 992px) {
          .hero-inner {
            grid-template-columns: 1.15fr 1fr;
          }
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #FEE2E2;
          color: var(--color-brand-red);
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 1rem;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 900;
          color: #111827;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: #4B5563;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          max-width: 580px;
        }
        .hero-installments-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          padding: 0.65rem 1.15rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          margin-bottom: 2rem;
        }
        .hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .hero-pickup-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          box-shadow: var(--shadow-sm);
        }
        .hero-pickup-card strong {
          color: #111827;
          display: block;
        }
        .hero-pickup-card p {
          color: #4B5563;
        }
        .hero-image-side {
          display: flex;
          justify-content: center;
        }
        .hero-image-card {
          position: relative;
          width: 100%;
          max-width: 480px;
        }
        .hero-main-photo {
          width: 100%;
          height: auto;
          aspect-ratio: 4/5;
          object-fit: cover;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .floating-badge-award {
          position: absolute;
          bottom: -15px;
          left: -15px;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-md);
        }
        .floating-badge-award strong {
          display: block;
          font-size: 0.85rem;
          color: #111827;
        }
        .floating-badge-award span {
          font-size: 0.75rem;
          color: #6B7280;
        }
        /* Trust Strip (ENA Style) */
        .trust-section {
          background-color: #FFFFFF;
          border-bottom: 1px solid var(--color-border);
          padding: 2.5rem 0;
        }
        .trust-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
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
        .trust-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .trust-icon-wrap {
          color: #111827;
          background: #F3F4F6;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .trust-text h4 {
          font-size: 0.95rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 0.2rem;
        }
        .trust-text p {
          font-size: 0.825rem;
          color: #6B7280;
          line-height: 1.4;
        }
        /* Category Circles */
        .category-circles-section {
          padding: 1rem 0;
        }
        .section-title-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .section-heading {
          font-size: 1.75rem;
          font-weight: 900;
          color: #111827;
          letter-spacing: -0.02em;
        }
        .section-all-link {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-brand-red);
        }
        .section-all-link:hover {
          text-decoration: underline;
        }
        .category-circles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (min-width: 768px) {
          .category-circles-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        .category-circle-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.75rem;
        }
        .circle-image-wrap {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          background: #F3F4F6;
          border: 2px solid var(--color-border);
          transition: transform 0.2s, border-color 0.2s;
        }
        .category-circle-item:hover .circle-image-wrap {
          transform: scale(1.06);
          border-color: #111827;
        }
        .circle-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .circle-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #111827;
        }
        /* Products Showcase */
        .eyebrow-text {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--color-brand-red);
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 0.2rem;
        }
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
        /* Objectives Grid (Comprar por Objetivo) */
        .objectives-section {
          background-color: #F8F9FA;
          padding: 4rem 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .text-center-header {
          text-align: center;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2.5rem;
        }
        .section-desc {
          color: #6B7280;
          font-size: 1rem;
          margin-top: 0.25rem;
        }
        .objectives-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .objectives-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .objectives-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .objective-card {
          position: relative;
          aspect-ratio: 4/5;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .objective-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.3s ease;
        }
        .objective-card:hover .objective-bg-img {
          transform: scale(1.06);
        }
        .objective-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(17, 24, 39, 0.1) 40%, rgba(17, 24, 39, 0.85) 100%);
        }
        .objective-content {
          position: absolute;
          inset: 0;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #FFFFFF;
        }
        .objective-content h3 {
          color: #FFFFFF;
          font-size: 1.15rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 0.4rem;
        }
        .objective-content span {
          font-size: 0.775rem;
          font-weight: 700;
          color: #F87171;
          letter-spacing: 0.05em;
        }
        /* Sede Central Pickup Showcase */
        .pickup-banner-card {
          background-color: #FFFFFF;
          border: 1.5px solid var(--color-border);
          border-left: 5px solid var(--color-brand-red);
          border-radius: var(--radius-md);
          padding: 3rem 2.5rem;
          box-shadow: var(--shadow-sm);
        }
        .pickup-text-side h2 {
          font-size: 2.2rem;
          font-weight: 900;
          color: #111827;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .pickup-text-side p {
          color: #4B5563;
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 720px;
          margin-bottom: 1.5rem;
        }
        .hours-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .hour-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #F3F4F6;
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
        }
        .pickup-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        /* Community Section */
        .community-section {
          text-align: center;
          padding: 3rem 0;
          background-color: #F8F9FA;
          border-top: 1px solid var(--color-border);
        }
        .community-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .community-header h2 {
          font-size: 1.8rem;
          font-weight: 900;
        }
        .community-header p {
          color: #6B7280;
          font-size: 1rem;
        }
        .community-header a {
          color: var(--color-brand-red);
          font-weight: 700;
        }
        .community-header a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
