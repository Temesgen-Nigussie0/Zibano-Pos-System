import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { salesService } from '../../services/salesService';
import { Sale, DateRange, VoidReason } from '../../types';
import { formatCurrency, formatDate, formatTime, getPaymentLabel } from '../../utils/formatters';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import ReceiptModal from '../../components/common/ReceiptModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, X, Clock, Download, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const VOID_REASONS: { value: VoidReason; label: string }[] = [
  { value: 'wrong-order', label: 'Wrong order' },
  { value: 'wrong-quantity', label: 'Wrong quantity' },
  { value: 'customer-cancelled', label: 'Customer cancelled' },
  { value: 'duplicate-sale', label: 'Duplicate sale' },
  { value: 'other', label: 'Other' },
];

export default function OwnerSales() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [waiterFilter, setWaiterFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [voidingSale, setVoidingSale] = useState<Sale | null>(null);
  const [voidReason, setVoidReason] = useState<VoidReason>('wrong-order');
  const [isVoiding, setIsVoiding] = useState(false);

  useEffect(() => {
    loadSales();
  }, [dateRange, paymentFilter, waiterFilter, statusFilter, searchQuery]);

  const loadSales = async () => {
    setIsLoading(true);
    const data = await salesService.getFiltered({
      dateRange, paymentMethod: paymentFilter, waiterId: waiterFilter,
      status: statusFilter, search: searchQuery,
    });
    setSales(data);
    setIsLoading(false);
  };

  const handleVoid = async () => {
    if (!voidingSale || !user) return;
    setIsVoiding(true);
    await salesService.voidSale(voidingSale.id, voidReason, user.id);
    showToast('success', `Sale ${voidingSale.orderNumber} has been voided.`);
    setVoidingSale(null);
    setIsVoiding(false);
    loadSales();
  };

  const completed = sales.filter((s) => s.status === 'completed');
  const totalSales = completed.reduce((s, sale) => s + sale.total, 0);

  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.sales')} />
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Sales</h1>
              <p className="page-subtitle">{completed.length} transactions · {formatCurrency(totalSales)} total</p>
            </div>
            <button className="btn btn-secondary" onClick={() => showToast('info', 'Export will be available in the full version.')}>
              <Download size={16} /> Export
            </button>
          </div>

          {/* Professional Filters Bar */}
          <div className="sales-filters-row">
            <div className="sales-filter-search">
              <Search size={16} className="pos-search-icon" />
              <input className="pos-search-input" placeholder="Search orders..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            {/* Professionally Crafted Segmented Date Filter */}
            <div className="segmented-date-control">
              {(['today', 'yesterday', 'week', 'month'] as DateRange[]).map((range) => {
                const labels: Record<DateRange, { full: string; short: string }> = {
                  today: { full: 'Today', short: 'Today' },
                  yesterday: { full: 'Yesterday', short: 'Yest.' },
                  week: { full: 'This Week', short: 'Week' },
                  month: { full: 'This Month', short: 'Month' },
                  custom: { full: 'Custom', short: 'Custom' },
                };
                return (
                  <button
                    key={range}
                    type="button"
                    className={`segmented-date-btn ${dateRange === range ? 'active' : ''}`}
                    onClick={() => setDateRange(range)}
                  >
                    <span className="date-btn-full">{labels[range].full}</span>
                    <span className="date-btn-short">{labels[range].short}</span>
                  </button>
                );
              })}
            </div>

            <select className="sales-filter-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="all">All Payments</option>
              <option value="cash">Cash</option>
              <option value="telebirr">Telebirr</option>
              <option value="cbe">CBE</option>
              <option value="other">Other</option>
            </select>
            <select className="sales-filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="voided">Voided</option>
            </select>
          </div>

          {/* Table */}
          <div className="card">
            {isLoading ? (
              <div style={{ padding: 'var(--space-6)' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton skeleton-text" style={{ marginBottom: 'var(--space-4)' }} />
                ))}
              </div>
            ) : sales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Clock size={24} /></div>
                <p className="empty-state-title">No sales found</p>
                <p className="empty-state-text">Try changing your filters.</p>
              </div>
            ) : (
              <div className="hide-mobile">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Date</th>
                      <th>Waiter</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map((sale) => (
                      <tr key={sale.id} className="clickable" onClick={() => setSelectedSale(sale)}>
                        <td className="font-semibold">{sale.orderNumber}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{formatDate(sale.createdAt)} {formatTime(sale.createdAt)}</td>
                        <td>{sale.waiterName}</td>
                        <td>{sale.items.length}</td>
                        <td className="font-semibold">{formatCurrency(sale.total)}</td>
                        <td>
                          <span className={`payment-pill payment-pill-${sale.paymentMethod === 'bank-transfer' ? 'cbe' : sale.paymentMethod}`}>
                            {getPaymentLabel(sale.paymentMethod)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>{sale.status}</span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          {sale.status === 'completed' && (
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}
                              onClick={() => setVoidingSale(sale)}>
                              Void
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile cards */}
            {!isLoading && sales.length > 0 && (
              <div className="show-mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: 'var(--space-3)' }}>
                {sales.map((sale) => (
                  <div key={sale.id} onClick={() => setSelectedSale(sale)} style={{
                    padding: 'var(--space-3)', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 4 }}>
                        <span className="font-semibold text-sm">{sale.orderNumber}</span>
                        <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>{sale.status}</span>
                      </div>
                      <span className="text-xs text-muted">{sale.waiterName} · {formatTime(sale.createdAt)}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="font-semibold text-sm">{formatCurrency(sale.total)}</span>
                      <div style={{ marginTop: '3px' }}>
                        <span className={`payment-pill payment-pill-${sale.paymentMethod === 'bank-transfer' ? 'cbe' : sale.paymentMethod}`}>
                          {getPaymentLabel(sale.paymentMethod)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sale Detail Thermal Receipt Modal */}
        {selectedSale && (
          <ReceiptModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
        )}

        {/* Void Confirmation */}
        {voidingSale && (
          <div className="modal-overlay" onClick={() => setVoidingSale(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <AlertTriangle size={18} color="var(--color-danger)" /> Void Sale?
                </h3>
                <button className="btn btn-icon btn-ghost" onClick={() => setVoidingSale(null)}><X size={18} /></button>
              </div>
              <div className="modal-body">
                <p style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                  This will mark sale <strong>{voidingSale.orderNumber}</strong> ({formatCurrency(voidingSale.total)}) as voided.
                </p>
                <div className="input-group">
                  <label className="input-label">Reason</label>
                  <select className="select" value={voidReason} onChange={(e) => setVoidReason(e.target.value as VoidReason)}>
                    {VOID_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setVoidingSale(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleVoid} disabled={isVoiding}>
                  {isVoiding ? <><span className="btn-spinner" />Voiding...</> : 'Void Sale'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
