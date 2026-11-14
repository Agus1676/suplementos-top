import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="container not-found-page">
      <div className="card not-found-box">
        <AlertTriangle size={48} className="text-warning" />
        <h1>Página no encontrada (404)</h1>
        <p>
          La página o producto que estás buscando no existe o fue movida de lugar.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      <style>{`
        .not-found-page {
          padding: 6rem 1rem;
          display: flex;
          justify-content: center;
        }
        .not-found-box {
          max-width: 500px;
          text-align: center;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .not-found-box h1 {
          font-size: 1.8rem;
          margin: 0;
        }
        .not-found-box p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
        }
      `}</style>
    </div>
  );
};
