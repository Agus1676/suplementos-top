import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Check, 
  ExternalLink, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  X
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatARS } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, applyBulkPriceAdjustment } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);

  // Bulk Price Form State
  const [bulkCategory, setBulkCategory] = useState('all');
  const [bulkBrand] = useState('all');
  const [bulkDirection, setBulkDirection] = useState<'increase' | 'decrease'>('increase');
  const [bulkType, setBulkType] = useState<'percent' | 'fixed'>('percent');
  const [bulkAmount, setBulkAmount] = useState('10');
  const [bulkRoundHundreds, setBulkRoundHundreds] = useState(true);

  // New/Edit Product Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('Star Nutrition');
  const [formCategory, setFormCategory] = useState('proteinas');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formFlavor, setFormFlavor] = useState('Vainilla');
  const [formSize, setFormSize] = useState('2 lb (907g)');
  const [formPricePesos, setFormPricePesos] = useState('42900');
  const [formStock, setFormStock] = useState('15');

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand) return false;
      }
      if (categoryFilter !== 'all' && p.category.slug !== categoryFilter) return false;
      if (brandFilter !== 'all' && p.brand.toLowerCase() !== brandFilter.toLowerCase()) return false;
      return true;
    });
  }, [products, searchTerm, categoryFilter, brandFilter]);

  // Open Edit Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormBrand(product.brand);
    setFormCategory(product.category.slug);
    setFormDescription(product.description || '');
    setFormImageUrl(product.images[0]?.url || '');
    setFormFlavor(product.variants[0]?.flavor || 'Original');
    setFormSize(product.variants[0]?.size || 'Estándar');
    setFormPricePesos(String(Math.round(product.variants[0]?.priceInCents / 100)));
    setFormStock(String(product.variants[0]?.stock || 10));
    setIsProductModalOpen(true);
  };

  // Open New Product Modal
  const handleOpenNew = () => {
    setEditingProduct(null);
    setFormName('');
    setFormBrand('Star Nutrition');
    setFormCategory('proteinas');
    setFormDescription('');
    setFormImageUrl('https://acdn-us.mitiendanube.com/stores/001/247/962/products/truemade_vainilla_2lb-webp1-0f17ea0eb698979f4916826203173730-640-0.webp');
    setFormFlavor('Vainilla');
    setFormSize('2 lb (907g)');
    setFormPricePesos('42900');
    setFormStock('15');
    setIsProductModalOpen(true);
  };

  // Save Product (New or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showFeedback('Por favor completá el nombre del suplemento');
      return;
    }

    const priceCents = Math.round(Number(formPricePesos) * 100);
    const stockQty = Math.max(0, parseInt(formStock, 10) || 0);

    const categoryObj = {
      id: `cat-${formCategory}`,
      name: formCategory === 'proteinas' ? 'Proteínas'
          : formCategory === 'creatinas' ? 'Creatinas'
          : formCategory === 'pre-entrenos' ? 'Pre-Entrenos'
          : formCategory === 'combos' ? 'Combos & Packs'
          : formCategory === 'aminoacidos' ? 'Aminoácidos'
          : 'Salud & Vitaminas',
      slug: formCategory,
      sortOrder: 1,
    };

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: formName,
        brand: formBrand,
        category: categoryObj,
        categoryId: formCategory,
        description: formDescription,
        images: [{ id: 'img-1', url: formImageUrl || editingProduct.images[0]?.url || '/logo.png', altText: formName, sortOrder: 1 }],
        variants: editingProduct.variants.map((v, i) => i === 0 ? {
          ...v,
          title: `${formFlavor} - ${formSize}`,
          flavor: formFlavor,
          size: formSize,
          priceInCents: priceCents,
          stock: stockQty,
        } : v),
      };
      updateProduct(updated);
      showFeedback('Suplemento actualizado con éxito');
    } else {
      const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newId = `prod-${Date.now()}`;
      const newProd: Product = {
        id: newId,
        name: formName,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        tagline: `${formBrand} • Suplemento Nutricional`,
        brand: formBrand,
        category: categoryObj,
        categoryId: formCategory,
        description: formDescription,
        status: 'published',
        basePriceInCents: priceCents,
        isFeatured: true,
        isBestSeller: false,
        rating: 5,
        reviewCount: 1,
        images: [{ id: 'img-1', url: formImageUrl || '/logo.png', altText: formName, sortOrder: 1 }],
        variants: [
          {
            id: `var-${Date.now()}`,
            productId: newId,
            title: `${formFlavor} - ${formSize}`,
            sku: `${formBrand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            flavor: formFlavor,
            size: formSize,
            priceInCents: priceCents,
            stock: stockQty,
          }
        ],
      };
      addProduct(newProd);
      showFeedback('Nuevo suplemento agregado al catálogo');
    }

    setIsProductModalOpen(false);
  };

  // Delete product
  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`¿Estás seguro de que deseás eliminar "${productName}" del catálogo?`)) {
      deleteProduct(productId);
      showFeedback(`"${productName}" fue eliminado`);
    }
  };

  // Apply Bulk Price Adjustment
  const handleApplyBulk = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(bulkAmount);
    if (!amt || amt <= 0) {
      showFeedback('Ingresá un monto mayor a 0');
      return;
    }

    applyBulkPriceAdjustment({
      targetCategory: bulkCategory,
      targetBrand: bulkBrand,
      direction: bulkDirection,
      type: bulkType,
      amount: amt,
      roundHundreds: bulkRoundHundreds,
    });

    setIsBulkPriceModalOpen(false);
    showFeedback(`Precios actualizados con éxito (${bulkDirection === 'increase' ? '+' : '-'}${amt}${bulkType === 'percent' ? '%' : ' ARS'})`);
  };

  return (
    <div className="admin-products-view">
      {/* Toast Feedback */}
      {feedback && (
        <div className="products-toast">
          <Check size={16} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Catálogo & Lista de Suplementos</h1>
          <p className="page-sub">
            Administrá productos, marcas oficiales, variantes de sabores, precios de lista y existencias.
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => setIsBulkPriceModalOpen(true)} className="btn btn-secondary btn-sm">
            <TrendingUp size={15} />
            <span>Aumento Masivo de Precios (%)</span>
          </button>
          <button onClick={handleOpenNew} className="btn btn-primary btn-sm">
            <Plus size={15} />
            <span>Cargar Nuevo Suplemento</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="products-toolbar-card">
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar suplemento por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las categorías</option>
            <option value="proteinas">Proteínas</option>
            <option value="creatinas">Creatinas</option>
            <option value="pre-entrenos">Pre-Entrenos</option>
            <option value="combos">Combos & Packs</option>
            <option value="aminoacidos">Aminoácidos</option>
            <option value="salud-vitaminas">Salud & Vitaminas</option>
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las marcas</option>
            <option value="star nutrition">Star Nutrition</option>
            <option value="ena sport">ENA Sport</option>
            <option value="optimum nutrition">Optimum Nutrition</option>
            <option value="suplementos top gear">Suplementos Top Gear (One Fit)</option>
            <option value="dymatize">Dymatize</option>
            <option value="gentech">Gentech</option>
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="products-table-card">
        <div className="table-responsive">
          <table className="products-table">
            <thead>
              <tr>
                <th>Suplemento</th>
                <th>Marca & Categoría</th>
                <th>Variantes & Sabores</th>
                <th>Precio Actual</th>
                <th>Stock Total</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No se encontraron suplementos con los filtros ingresados.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const totalStock = prod.variants.reduce((acc, v) => acc + v.stock, 0);
                  const minPrice = Math.min(...prod.variants.map((v) => v.priceInCents));
                  const maxPrice = Math.max(...prod.variants.map((v) => v.priceInCents));

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div className="prod-cell">
                          <img
                            src={prod.images[0]?.url || '/logo.png'}
                            alt={prod.name}
                            className="prod-thumb"
                          />
                          <div>
                            <strong className="prod-title">{prod.name}</strong>
                            <Link
                              to={`/producto/${prod.slug}`}
                              target="_blank"
                              className="view-link"
                              title="Ver en la tienda pública"
                            >
                              <span>Ver en tienda</span>
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="brand-badge">{prod.brand}</span>
                        <span className="cat-sub">{prod.category.name}</span>
                      </td>
                      <td>
                        <div className="variants-mini-list">
                          {prod.variants.map((v) => (
                            <span key={v.id} className="var-chip">
                              {v.flavor} ({v.size || v.title}) — <strong>{v.stock} un.</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong className="price-bold">
                          {minPrice === maxPrice ? formatARS(minPrice) : `${formatARS(minPrice)} - ${formatARS(maxPrice)}`}
                        </strong>
                      </td>
                      <td>
                        <span className={`stock-badge ${totalStock <= 5 ? 'low' : ''}`}>
                          {totalStock} unidades
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="actions-cell">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="action-btn edit"
                            title="Editar suplemento"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="action-btn delete"
                            title="Eliminar suplemento"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Cargar / Editar Suplemento */}
      {isProductModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editingProduct ? '✏️ Editar Suplemento' : '✨ Cargar Nuevo Suplemento'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-body">
              <label className="form-label">Nombre del Suplemento:</label>
              <input
                type="text"
                placeholder="Ej: Star Nutrition 100% Whey Gold 2 lb"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="form-input"
                required
              />

              <div className="form-row-2 mt-3">
                <div>
                  <label className="form-label">Marca Oficial:</label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="form-select"
                  >
                    <option value="Star Nutrition">Star Nutrition</option>
                    <option value="ENA Sport">ENA Sport</option>
                    <option value="Optimum Nutrition">Optimum Nutrition</option>
                    <option value="Suplementos Top Gear">Suplementos Top Gear (One Fit)</option>
                    <option value="Dymatize">Dymatize</option>
                    <option value="Gentech">Gentech</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Categoría:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="proteinas">Proteínas</option>
                    <option value="creatinas">Creatinas</option>
                    <option value="pre-entrenos">Pre-Entrenos</option>
                    <option value="combos">Combos & Packs</option>
                    <option value="aminoacidos">Aminoácidos</option>
                    <option value="salud-vitaminas">Salud & Vitaminas</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="form-label">Sabor:</label>
                  <input
                    type="text"
                    placeholder="Ej: Vainilla, Chocolate, Neutro..."
                    value={formFlavor}
                    onChange={(e) => setFormFlavor(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Presentación:</label>
                  <input
                    type="text"
                    placeholder="Ej: Doypack 2 lb, 300g, 3 kg..."
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="form-label">Precio de Venta ($ ARS):</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="Ej: 42900"
                    value={formPricePesos}
                    onChange={(e) => setFormPricePesos(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Stock Inicial Físico:</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <label className="form-label mt-3">URL Foto Packshot (Fondo Blanco o Catálogo):</label>
              <input
                type="url"
                placeholder="https://..."
                value={formImageUrl}
                onChange={(e) => setFormImageUrl(e.target.value)}
                className="form-input"
              />

              <label className="form-label mt-3">Descripción / Información Nutricional:</label>
              <textarea
                rows={3}
                placeholder="Detalles de tomas, servicios por envase y pureza de materia prima..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="form-textarea"
              />

              <div className="modal-footer mt-4">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Guardar Cambios' : 'Crear Suplemento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Aumento Masivo de Precios (Tienda May Engine) */}
      {isBulkPriceModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>📈 Aumento Masivo de Precios</h3>
              <button onClick={() => setIsBulkPriceModalOpen(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleApplyBulk} className="modal-body">
              <p className="modal-hint">
                Ajustá masivamente los precios de los suplementos para trasladar listas de proveedores o aplicar promociones globales.
              </p>

              <div className="form-row-2">
                <div>
                  <label className="form-label">Dirección:</label>
                  <select
                    value={bulkDirection}
                    onChange={(e) => setBulkDirection(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="increase">Aumentar precios (+)</option>
                    <option value="decrease">Rebajar precios (-)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Tipo de Cálculo:</label>
                  <select
                    value={bulkType}
                    onChange={(e) => setBulkType(e.target.value as any)}
                    className="form-select"
                  >
                    <option value="percent">Porcentaje (%)</option>
                    <option value="fixed">Monto Fijo ($ ARS)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2 mt-3">
                <div>
                  <label className="form-label">Valor del Ajuste:</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Ej: 10"
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Categoría Destino:</label>
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">Todo el Catálogo</option>
                    <option value="proteinas">Solo Proteínas</option>
                    <option value="creatinas">Solo Creatinas</option>
                    <option value="pre-entrenos">Solo Pre-Entrenos</option>
                    <option value="combos">Solo Combos</option>
                    <option value="aminoacidos">Solo Aminoácidos</option>
                    <option value="salud-vitaminas">Solo Salud & Vitaminas</option>
                  </select>
                </div>
              </div>

              <div className="checkbox-wrap mt-3">
                <input
                  type="checkbox"
                  id="round-check"
                  checked={bulkRoundHundreds}
                  onChange={(e) => setBulkRoundHundreds(e.target.checked)}
                />
                <label htmlFor="round-check">
                  Redondear al centenar más cercano (ej: $42.870 → $42.900)
                </label>
              </div>

              <div className="modal-footer mt-4">
                <button type="button" onClick={() => setIsBulkPriceModalOpen(false)} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Aplicar Ajuste a Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-products-view {
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-header-flex {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .page-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }
        .page-sub {
          font-size: 0.9rem;
          color: #64748B;
          margin: 0;
        }
        .header-actions {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }
        .products-toast {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: #0F172A;
          color: #FFFFFF;
          padding: 0.85rem 1.25rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.65rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 1000;
          font-weight: 600;
          font-size: 0.88rem;
          animation: slideUp 0.2s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .products-toolbar-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .search-wrap {
          position: relative;
          width: 100%;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }
        .search-input {
          width: 100%;
          height: 42px;
          padding: 0 1rem 0 2.75rem;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #0F172A;
          outline: none;
        }
        .search-input:focus {
          border-color: #0F172A;
        }
        .filters-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .filter-select {
          height: 38px;
          padding: 0 0.85rem;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          font-size: 0.84rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
        }
        /* Table */
        .products-table-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }
        .products-table {
          width: 100%;
          min-width: 860px;
          border-collapse: collapse;
          font-size: 0.86rem;
        }
        .products-table th {
          background: #F8FAFC;
          color: #64748B;
          font-weight: 700;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid #E2E8F0;
          text-align: left;
        }
        .products-table td {
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #F1F5F9;
          color: #1E293B;
          vertical-align: middle;
        }
        .products-table tr:hover td {
          background: #F8FAFC;
        }
        .prod-cell {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .prod-thumb {
          width: 48px;
          height: 48px;
          object-fit: contain;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 2px;
          flex-shrink: 0;
        }
        .prod-title {
          display: block;
          color: #0F172A;
          font-size: 0.9rem;
        }
        .view-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.72rem;
          color: #64748B;
          text-decoration: none;
          margin-top: 0.15rem;
        }
        .view-link:hover {
          color: var(--color-accent);
          text-decoration: underline;
        }
        .brand-badge {
          display: inline-block;
          font-weight: 700;
          font-size: 0.8rem;
          color: #0F172A;
        }
        .cat-sub {
          display: block;
          font-size: 0.72rem;
          color: #64748B;
        }
        .variants-mini-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .var-chip {
          background: #F1F5F9;
          font-size: 0.72rem;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: #334155;
        }
        .price-bold {
          font-size: 0.92rem;
          color: #0F172A;
        }
        .stock-badge {
          font-size: 0.78rem;
          font-weight: 700;
          color: #166534;
          background: #DCFCE7;
          padding: 0.25rem 0.6rem;
          border-radius: 9999px;
        }
        .stock-badge.low {
          background: #FEF3C7;
          color: #92400E;
        }
        .actions-cell {
          display: inline-flex;
          gap: 0.35rem;
        }
        .action-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.12s ease;
        }
        .action-btn.edit { color: #0284C7; }
        .action-btn.edit:hover { background: #F0F9FF; border-color: #0284C7; }
        .action-btn.delete { color: #DC2626; }
        .action-btn.delete:hover { background: #FEF2F2; border-color: #DC2626; }
        /* Modal */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 1rem;
        }
        .modal-card {
          background: #FFFFFF;
          border-radius: 12px;
          width: 100%;
          max-width: 540px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
          overflow: hidden;
          animation: popIn 0.18s ease;
        }
        @keyframes popIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .modal-header h3 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
        }
        .modal-close-btn {
          border: none;
          background: transparent;
          color: #94A3B8;
          cursor: pointer;
        }
        .modal-body {
          padding: 1.5rem;
          max-height: 80vh;
          overflow-y: auto;
        }
        .modal-hint {
          font-size: 0.84rem;
          color: #64748B;
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        .form-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #1E293B;
          margin-bottom: 0.4rem;
        }
        .form-select, .form-input, .form-textarea {
          width: 100%;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.88rem;
          color: #0F172A;
          background: #FFFFFF;
          outline: none;
        }
        .form-select, .form-input {
          height: 42px;
          padding: 0 0.85rem;
        }
        .form-textarea {
          padding: 0.65rem 0.85rem;
        }
        .form-select:focus, .form-input:focus, .form-textarea:focus {
          border-color: #0F172A;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .checkbox-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.84rem;
          color: #334155;
          font-weight: 600;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      `}</style>
    </div>
  );
};