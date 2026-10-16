import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { categories } from '../../data/categories';
import { formatCurrency } from '../../utils/formatters';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, Plus, X, Edit2, Star, Eye, EyeOff } from 'lucide-react';
import './Dashboard.css';

export default function OwnerProducts() {
  const location = useLocation();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [formData, setFormData] = useState({ name: '', categoryId: '', price: '', description: '', available: true, popular: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => { loadProducts(); }, [searchQuery, categoryFilter]);

  useEffect(() => {
    if (location.state?.openNew) {
      openNew();
    }
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    let prods: Product[];
    if (searchQuery) {
      prods = await productService.search(searchQuery);
    } else if (categoryFilter !== 'all') {
      prods = await productService.getByCategory(categoryFilter);
    } else {
      prods = await productService.getAll();
    }
    setProducts(prods);
    setIsLoading(false);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsNewProduct(false);
    setFormData({
      name: product.name, categoryId: product.categoryId,
      price: String(product.price), description: product.description,
      available: product.available, popular: product.popular,
    });
  };

  const openNew = () => {
    setEditingProduct({} as Product);
    setIsNewProduct(true);
    setFormData({ name: '', categoryId: 'breakfast', price: '', description: '', available: true, popular: false });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      showToast('warning', 'Please fill in all required fields.');
      return;
    }
    setIsSaving(true);
    if (isNewProduct) {
      await productService.create({
        name: formData.name, categoryId: formData.categoryId,
        price: parseFloat(formData.price), description: formData.description,
        image: '', available: formData.available, popular: formData.popular,
      });
      showToast('success', 'Product added.');
    } else if (editingProduct) {
      await productService.update(editingProduct.id, {
        name: formData.name, categoryId: formData.categoryId,
        price: parseFloat(formData.price), description: formData.description,
        available: formData.available, popular: formData.popular,
      });
      showToast('success', 'Product updated.');
    }
    setIsSaving(false);
    setEditingProduct(null);
    loadProducts();
  };

  const toggleAvailability = async (product: Product) => {
    await productService.toggleAvailability(product.id);
    showToast('success', `${product.name} is now ${product.available ? 'unavailable' : 'available'}.`);
    loadProducts();
  };

  const togglePopular = async (product: Product) => {
    await productService.togglePopular(product.id);
    showToast('success', `${product.name} ${product.popular ? 'removed from' : 'added to'} popular.`);
    loadProducts();
  };

  const activeCategories = categories.filter((c) => c.id !== 'popular');
  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.products')} />
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Products</h1>
              <p className="page-subtitle">{products.length} items</p>
            </div>
            <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Product</button>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
            <div className="pos-search-wrapper" style={{ maxWidth: 280 }}>
              <Search size={16} className="pos-search-icon" />
              <input className="pos-search-input" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <select className="select" style={{ width: 180 }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {activeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Products Table */}
          <div className="card">
            {isLoading ? (
              <div style={{ padding: 'var(--space-6)' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 'var(--space-4)' }} />
                ))}
              </div>
            ) : (
              <>
                <div className="hide-mobile">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Available</th>
                        <th>Popular</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-cream)', flexShrink: 0 }}>
                                <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div>
                                <span className="font-medium" style={{ fontSize: 'var(--font-size-sm)' }}>{p.name}</span>
                                <br /><span className="text-xs text-muted">{p.description}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge badge-neutral">{activeCategories.find((c) => c.id === p.categoryId)?.name || p.categoryId}</span></td>
                          <td className="font-semibold">{formatCurrency(p.price)}</td>
                          <td>
                            <div className={`toggle ${p.available ? 'active' : ''}`} onClick={() => toggleAvailability(p)} />
                          </td>
                          <td>
                            <button className={`btn btn-icon btn-ghost btn-sm ${p.popular ? '' : ''}`}
                              style={{ color: p.popular ? 'var(--color-warning)' : 'var(--color-text-light)' }}
                              onClick={() => togglePopular(p)}>
                              <Star size={16} fill={p.popular ? 'currentColor' : 'none'} />
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>
                              <Edit2 size={14} /> Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="show-mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 'var(--space-3)' }}>
                  {products.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-cream)' }}>
                          <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <span className="font-medium text-sm">{p.name}</span>
                          <br /><span className="text-xs text-muted">{formatCurrency(p.price)}</span>
                        </div>
                      </div>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit/Add Modal */}
        {editingProduct && (
          <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
            <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{isNewProduct ? 'Add Product' : 'Edit Product'}</h3>
                <button className="btn btn-icon btn-ghost" onClick={() => setEditingProduct(null)}><X size={18} /></button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Name *</label>
                    <input className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product name" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="input-group">
                      <label className="input-label">Category *</label>
                      <select className="select" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}>
                        {activeCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="input-group">
                      <label className="input-label">Price (ETB) *</label>
                      <input type="number" className="input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0" />
                    </div>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Description</label>
                    <input className="input" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Short description" />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                    <label className="checkbox-wrapper" onClick={() => setFormData({ ...formData, available: !formData.available })}>
                      <div className={`checkbox ${formData.available ? 'checked' : ''}`}>{formData.available && <Eye size={12} color="white" />}</div>
                      <span className="checkbox-label">Available</span>
                    </label>
                    <label className="checkbox-wrapper" onClick={() => setFormData({ ...formData, popular: !formData.popular })}>
                      <div className={`checkbox ${formData.popular ? 'checked' : ''}`}>{formData.popular && <Star size={12} color="white" />}</div>
                      <span className="checkbox-label">Popular</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <><span className="btn-spinner" />Saving...</> : isNewProduct ? 'Add Product' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
