import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { categories as initialCategories } from '../../data/categories';
import { Category } from '../../types';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Edit2, X, FolderOpen } from 'lucide-react';
import './Dashboard.css';

export default function OwnerCategories() {
  const location = useLocation();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cats, setCats] = useState<Category[]>(initialCategories.filter((c) => c.id !== 'popular'));
  const [editing, setEditing] = useState<Category | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formName, setFormName] = useState('');

  const openNew = () => { setIsNew(true); setEditing({} as Category); setFormName(''); };
  const openEdit = (c: Category) => { setIsNew(false); setEditing(c); setFormName(c.name); };

  useEffect(() => {
    if (location.state?.openNew) {
      openNew();
    }
  }, [location.state]);

  const handleSave = () => {
    if (!formName.trim()) { showToast('warning', 'Please enter a category name.'); return; }
    if (isNew) {
      const newCat: Category = {
        id: `cat-${Date.now()}`, name: formName, slug: formName.toLowerCase().replace(/\s+/g, '-'),
        active: true, sortOrder: cats.length,
      };
      setCats([...cats, newCat]);
      showToast('success', 'Category added.');
    } else if (editing) {
      setCats(cats.map((c) => (c.id === editing.id ? { ...c, name: formName } : c)));
      showToast('success', 'Category updated.');
    }
    setEditing(null);
  };

  const toggleActive = (id: string) => {
    setCats(cats.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
    const cat = cats.find((c) => c.id === id);
    showToast('success', `${cat?.name} ${cat?.active ? 'deactivated' : 'activated'}.`);
  };

  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.categories')} />
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Categories</h1>
              <p className="page-subtitle">{cats.length} categories</p>
            </div>
            <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Category</button>
          </div>

          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cats.map((cat) => (
                <div key={cat.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--space-4)', borderBottom: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-md)',
                      background: cat.active ? 'var(--color-beige)' : 'var(--surface-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: cat.active ? 'var(--color-brown-600)' : 'var(--color-text-light)',
                    }}>
                      <FolderOpen size={18} />
                    </div>
                    <div>
                      <span className="font-medium" style={{ fontSize: 'var(--font-size-sm)', opacity: cat.active ? 1 : 0.5 }}>{cat.name}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span className={`badge ${cat.active ? 'badge-success' : 'badge-neutral'}`}>{cat.active ? 'Active' : 'Inactive'}</span>
                    <div className={`toggle ${cat.active ? 'active' : ''}`} onClick={() => toggleActive(cat.id)} />
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}><Edit2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {editing && (
          <div className="modal-overlay" onClick={() => setEditing(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{isNew ? 'Add Category' : 'Edit Category'}</h3>
                <button className="btn btn-icon btn-ghost" onClick={() => setEditing(null)}><X size={18} /></button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <label className="input-label">Category Name *</label>
                  <input className="input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Category name" />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>{isNew ? 'Add Category' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
