import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import { useLanguage } from '../../contexts/LanguageContext';
import { Coffee, MapPin, Eye, EyeOff, Lock, Save, Check } from 'lucide-react';
import './Dashboard.css';

export default function OwnerSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'password'>('general');

  // General settings
  const [businessName, setBusiness] = useState('Zibano Coffee / ዝባኖ ቡና');
  const [currency, setCurrency] = useState('ETB');
  const [vatRate, setVat] = useState('15');
  const [defaultOrderType, setDefaultOrder] = useState('dine-in');

  // Password
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handleSaveGeneral = () => {
    showToast('success', 'Settings saved.');
  };

  const handleChangePassword = async () => {
    if (!currentPass) { showToast('warning', 'Please enter your current password.'); return; }
    if (newPass.length < 8) { showToast('warning', 'Password must be at least 8 characters.'); return; }
    if (newPass !== confirmPass) { showToast('warning', 'Passwords do not match.'); return; }
    setIsChangingPass(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsChangingPass(false);
    setCurrentPass(''); setNewPass(''); setConfirmPass('');
    showToast('success', 'Password changed successfully.');
  };

  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.settings')} />
        <div className="page-container" style={{ maxWidth: 800 }}>
          <div className="page-header">
            <div>
              <h1 className="page-title">Settings</h1>
              <p className="page-subtitle">Manage your café configuration</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="segmented-control" style={{ marginBottom: 'var(--space-6)' }}>
            <button className={`segmented-option ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
            <button className={`segmented-option ${activeTab === 'password' ? 'active' : ''}`} onClick={() => setActiveTab('password')}>Password</button>
          </div>

          {activeTab === 'general' && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Café Information</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 480 }}>
                <div className="input-group">
                  <label className="input-label">Business Name</label>
                  <div className="input-wrapper">
                    <Coffee size={16} className="input-icon-left" />
                    <input className="input has-icon-left" value={businessName} onChange={(e) => setBusiness(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="input-group">
                    <label className="input-label">Currency</label>
                    <input className="input" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">VAT Rate (%)</label>
                    <input className="input" value={vatRate} onChange={(e) => setVat(e.target.value)} />
                    <span className="input-hint">Prices include this VAT in the POS.</span>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Default Order Type</label>
                  <select className="select" value={defaultOrderType} onChange={(e) => setDefaultOrder(e.target.value)}>
                    <option value="dine-in">Dine In</option>
                    <option value="take-away">Take Away</option>
                  </select>
                </div>

                <div className="divider" />

                <div>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Tables</h4>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                    Currently configured: Tables 1-8
                  </p>
                  <span className="badge badge-neutral">8 tables active</span>
                </div>

                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleSaveGeneral}>
                  <Save size={16} /> Save Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="card">
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', maxWidth: 400 }}>
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon-left" />
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      className="input has-icon-left has-icon-right"
                      value={currentPass} onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button className="input-icon-right" onClick={() => setShowCurrent(!showCurrent)} type="button" tabIndex={-1}>
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon-left" />
                    <input
                      type={showNew ? 'text' : 'password'}
                      className="input has-icon-left has-icon-right"
                      value={newPass} onChange={(e) => setNewPass(e.target.value)}
                      placeholder="Enter new password"
                    />
                    <button className="input-icon-right" onClick={() => setShowNew(!showNew)} type="button" tabIndex={-1}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="input-hint">Minimum 8 characters.</span>
                </div>

                <div className="input-group">
                  <label className="input-label">Confirm New Password</label>
                  <div className="input-wrapper">
                    <Lock size={16} className="input-icon-left" />
                    <input
                      type="password"
                      className="input has-icon-left"
                      value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleChangePassword} disabled={isChangingPass}>
                  {isChangingPass ? <><span className="btn-spinner" />Changing...</> : <><Check size={16} /> Change Password</>}
                </button>

                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)' }}>
                  In the production version, password changes will be processed through server-side authentication.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
