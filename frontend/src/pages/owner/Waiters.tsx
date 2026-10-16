import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { waiterService } from '../../services/waiterService';
import { Waiter } from '../../types';
import { getInitials } from '../../utils/formatters';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Edit2, X, Users } from 'lucide-react';
import './Dashboard.css';

export default function OwnerWaiters() {
  const location = useLocation();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState<Waiter | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadWaiters();
    if (location.state?.openNew) {
      openNew();
    }
  }, []);

  const loadWaiters = async () => {
    setIsLoading(true);
    const data = await waiterService.getAll();
    setWaiters(data);
    setIsLoading(false);
  };

  const openNew = () => { setIsNew(true); setEditing({} as Waiter); setFormName(''); setFormPhone(''); };
  const openEdit = (w: Waiter) => { setIsNew(false); setEditing(w); setFormName(w.name); setFormPhone(w.phone || ''); };

  const handleSave = async () => {
    if (!formName.trim()) { showToast('warning', 'Please enter the waiter name.'); return; }
    setIsSaving(true);
    if (isNew) {
      await waiterService.create({ name: formName, phone: formPhone || undefined });
      showToast('success', 'Waiter added.');
    } else if (editing) {
      await waiterService.update(editing.id, { name: formName, phone: formPhone || undefined });
      showToast('success', 'Waiter updated.');
    }
    setIsSaving(false);
    setEditing(null);
    loadWaiters();
  };

  const toggleActive = async (w: Waiter) => {
    await waiterService.toggleActive(w.id);
    showToast('success', `${w.name} ${w.active ? 'deactivated' : 'activated'}.`);
    loadWaiters();
  };

  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.waiters')} />
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Waiters</h1>
              <p className="page-subtitle">{waiters.filter((w) => w.active).length} active</p>
            </div>
            <button className="btn btn-primary" onClick={openNew}><Plus size={16} /> Add Waiter</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div className="skeleton skeleton-circle" style={{ width: 48, height: 48 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text short" />
                  </div>
                </div>
              ))
            ) : waiters.map((w) => (
              <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', opacity: w.active ? 1 : 0.5 }}>
                <div className="avatar avatar-lg">{getInitials(w.name)}</div>
                <div style={{ flex: 1 }}>
                  <span className="font-semibold" style={{ fontSize: 'var(--font-size-md)' }}>{w.name}</span>
                  <br />
                  <span className={`badge ${w.active ? 'badge-success' : 'badge-neutral'}`} style={{ marginTop: 4 }}>
                    {w.active ? 'Active' : 'Inactive'}
                  </span>
                  {w.phone && <span className="text-xs text-muted" style={{ marginLeft: 'var(--space-2)' }}>{w.phone}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', alignItems: 'flex-end' }}>
                  <div className={`toggle ${w.active ? 'active' : ''}`} onClick={() => toggleActive(w)} />
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(w)}><Edit2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editing && (
          <div className="modal-overlay" onClick={() => setEditing(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">{isNew ? 'Add Waiter' : 'Edit Waiter'}</h3>
                <button className="btn btn-icon btn-ghost" onClick={() => setEditing(null)}><X size={18} /></button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Name *</label>
                    <input className="input" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Waiter name" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone (optional)</label>
                    <input className="input" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="Phone number" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <><span className="btn-spinner" />Saving...</> : isNew ? 'Add Waiter' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
