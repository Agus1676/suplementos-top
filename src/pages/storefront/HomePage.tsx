import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  Clock, 
  Award,
  Sparkles,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';

export const HomePage: React.FC = () => {
  const { products, categories, settings } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={14} className="text-accent" />
              <span>Nutrición Deportiva Premium en Argentina</span>
            </div>

            <h1 className="hero-title">
              SUPLEMENTOS TOP <br />
              <span className="hero-gradient-text">RENDIMIENTO SIN LÍMITES</span>
            </h1>

            <p className="hero-desc">
              Proteínas microfiltradas, Creatinas con sello Creapure®, pre-entrenos extremos y fórmulas puras. Despachamos a todo el país o retirá hoy mismo en nuestro punto de entrega exclusivo en Recoleta.
            </p>

            <div className="hero-badges-list">
              <div className="hero-badge-item">
                <CheckCircle2 size={16} className="text-accent" />
                <span>100% Materias Primas Importadas</span>
              </div>
              <div className="hero-badge-item">
                <CheckCircle2 size={16} className="text-accent" />
                <span>Retiro Inmediato en CABA</span>
              </div>
              <div className="hero-badge-item">
                <CheckCircle2 size={16} className="text-accent" />
                <span>Mercado Pago en Cuotas</span>
              </div>
            </div>

            <div className="hero-cta-group">
              <Link to="/catalogo" className="btn btn-accent btn-lg">
                <span>Ver Catálogo Completo</span>
                <ArrowRight size={18} />
              </Link>
              <a 
                href="https://wa.me/5491165651990?text=Hola!%20Quisiera%20asesoramiento%20sobre%20suplementos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary btn-lg"
              >
                <Phone size={18} />
                <span>Asesoramiento WhatsApp</span>
              </a>
            </div>

            {/* Quick Location Alert */}
            <div className="hero-location-card">
              <MapPin size={20} className="text-accent flex-shrink-0" />
              <div>
                <strong>Punto de Retiro Oficial en CABA:</strong>
                <p>{settings.pickupAddress} • <em>Lun a Vie 8 a 23hs | Sáb 10 a 18hs</em></p>
              </div>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=1000&q=80"
                alt="Suplementos Top Nutrición Deportiva"
                className="hero-img"
              />
              <div className="hero-floating-card">
                <Award size={24} className="text-accent" />
                <div>
                  <span className="floating-title">Creapure® & CFM Whey</span>
                  <span className="floating-sub">Máxima pureza certificada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Horizontal Banner */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">EXPLORÁ POR OBJETIVO</span>
              <h2 className="section-title">Categorías Destacadas</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>Ver todas</span>
              <ArrowRight size={16} />
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
                <div className="category-overlay">
                  <h3 className="category-title">{cat.name}</h3>
                  <p className="category-desc">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">MÁXIMA EFICACIA</span>
              <h2 className="section-title">Productos Más Vendidos</h2>
            </div>
            <Link to="/catalogo" className="section-link">
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

      {/* Store Value Banner */}
      <section className="value-banner-section">
        <div className="container">
          <div className="value-banner-card">
            <div className="value-banner-content">
              <span className="value-tag">LOGÍSTICA Y RETIRO EXPRESS</span>
              <h2>¿Querés retirar tu pedido en mano hoy mismo?</h2>
              <p>
                Te esperamos en nuestra sede de <strong>Uriburu 1163 (entre Santa Fe y Arenales), Recoleta</strong>. Nuestro equipo te asesora y te entrega tus suplementos al instante.
              </p>
              <div className="value-schedule-grid">
                <div className="schedule-item">
                  <Clock size={18} className="text-accent" />
                  <span><strong>Lunes a Viernes:</strong> 8:00 a 23:00 hs</span>
                </div>
                <div className="schedule-item">
                  <Clock size={18} className="text-accent" />
                  <span><strong>Sábados:</strong> 10:00 a 18:00 hs</span>
                </div>
              </div>
              <div className="value-cta-wrap">
                <a
                  href="https://maps.google.com/?q=Uriburu+1163,+CABA,+Argentina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent"
                >
                  <MapPin size={16} />
                  <span>Ver ubicación en Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Best Supplements */}
      <section className="all-products-preview">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-subtitle">SELECCIÓN COMPLETA</span>
              <h2 className="section-title">Lanzamientos y Destacados</h2>
            </div>
            <Link to="/catalogo" className="section-link">
              <span>Ver todos ({products.length})</span>
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

      <style>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }
        .hero-section {
          background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
          padding: 3rem 0 4rem;
          border-bottom: 1px solid var(--color-border);
        }
        .hero-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
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
          background: var(--color-accent-light);
          color: var(--color-accent-hover);
          font-weight: 700;
          font-size: 0.775rem;
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          margin-bottom: 1rem;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }
        .hero-title {
          font-size: 2.3rem;
          letter-spacing: -0.03em;
          margin-bottom: 1.25rem;
          line-height: 1.1;
        }
        @media (min-width: 768px) {
          .hero-title {
            font-size: 3.25rem;
          }
        }
        .hero-gradient-text {
          background: linear-gradient(135deg, #0F172A 0%, #3B82F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 1.05rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .hero-badges-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .hero-badge-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-primary);
        }
        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .hero-location-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          background: #FFFFFF;
          border: 1px solid var(--color-border);
          padding: 1rem 1.25rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          font-size: 0.85rem;
        }
        .hero-location-card strong {
          color: var(--color-primary);
          display: block;
        }
        .hero-location-card p {
          color: var(--color-text-muted);
        }
        .hero-media {
          display: flex;
          justify-content: center;
        }
        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-lg);
          overflow: visible;
        }
        .hero-img {
          width: 100%;
          height: auto;
          aspect-ratio: 4/5;
          object-fit: cover;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          border: 4px solid #FFFFFF;
        }
        .hero-floating-card {
          position: absolute;
          bottom: -20px;
          left: -15px;
          background: #FFFFFF;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border: 1px solid var(--color-border);
        }
        .floating-title {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--color-primary);
          display: block;
        }
        .floating-sub {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        .section-subtitle {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--color-accent-hover);
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
        }
        .section-title {
          font-size: 1.8rem;
          margin: 0;
        }
        .section-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
          color: var(--color-primary);
          font-size: 0.9rem;
        }
        .section-link:hover {
          color: var(--color-accent-hover);
        }
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .categories-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        .category-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .category-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .category-card:hover .category-img {
          transform: scale(1.08);
        }
        .category-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1rem;
          color: #FFFFFF;
        }
        .category-title {
          color: #FFFFFF;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.15rem;
        }
        .category-desc {
          font-size: 0.7rem;
          color: #CBD5E1;
          display: none;
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
        .value-banner-card {
          background: var(--color-primary);
          border-radius: var(--radius-lg);
          padding: 3rem 2rem;
          color: #FFFFFF;
          box-shadow: var(--shadow-xl);
          background-image: radial-gradient(circle at top right, #1E293B 0%, #0F172A 100%);
        }
        .value-tag {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: var(--color-accent);
          display: block;
          margin-bottom: 0.75rem;
        }
        .value-banner-content h2 {
          color: #FFFFFF;
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .value-banner-content p {
          color: #CBD5E1;
          font-size: 1.05rem;
          max-width: 700px;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .value-schedule-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .schedule-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
        }
        .value-cta-wrap {
          display: flex;
        }
      `}</style>
    </div>
  );
};
