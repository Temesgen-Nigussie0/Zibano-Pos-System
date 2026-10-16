import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { salesService } from '../../services/salesService';
import { Sale, DateRange } from '../../types';
import { formatCurrency, formatDate, formatTime, getPaymentLabel } from '../../utils/formatters';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import ReceiptModal from '../../components/common/ReceiptModal';
import { useLanguage } from '../../contexts/LanguageContext';
import { Search, X, Clock, Filter, ChevronRight } from 'lucide-react';
import '../owner/Dashboard.css';

export default function POSHistory() {
  const { role } = useAuth();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await salesService.getFiltered({
        dateRange, paymentMethod: paymentFilter, search: searchQuery,
      });
      setSales(data);
      setIsLoading(false);
    }
    load();
  }, [dateRange, paymentFilter, searchQuery]);

  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.history')} />
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Sales History</h1>
              <p className="page-subtitle">View past transactions</p>
            </div>
          </div>

          {/* Professional Filters Bar */}
          <div className="sales-filters-row">
            <div className="sales-filter-search">
              <Search size={16} className="pos-search-icon" />
              <input
                type="text"
                className="pos-search-input"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
          </div>

          {/* Sales Table / Cards */}
          <div className="card">
            {isLoading ? (
              <div style={{ padding: 'var(--space-6)' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div className="skeleton" style={{ width: 60, height: 16 }} />
                    <div className="skeleton" style={{ width: 50, height: 16 }} />
                    <div className="skeleton" style={{ width: 80, height: 16 }} />
                    <div className="skeleton" style={{ flex: 1, height: 16 }} />
                    <div className="skeleton" style={{ width: 80, height: 16 }} />
                  </div>
                ))}
              </div>
            ) : sales.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Clock size={24} /></div>
                <p className="empty-state-title">No sales found</p>
                <p className="empty-state-text">Try changing your date or filter.</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hide-mobile">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Time</th>
                        <th>Waiter</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => (
                        <tr key={sale.id} className="clickable" onClick={() => setSelectedSale(sale)}>
                          <td><span className="font-semibold">{sale.orderNumber}</span></td>
                          <td>{formatTime(sale.createdAt)}</td>
                          <td>{sale.waiterName}</td>
                          <td>{sale.items.length} items</td>
                          <td><span className="font-semibold">{formatCurrency(sale.total)}</span></td>
                          <td>
                            <span className={`payment-pill payment-pill-${sale.paymentMethod === 'bank-transfer' ? 'cbe' : sale.paymentMethod}`}>
                              {getPaymentLabel(sale.paymentMethod)}
                            </span>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>{sale.orderType.replace('-', ' ')}</td>
                          <td>
                            <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>
                              {sale.status === 'completed' ? 'Completed' : 'Voided'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="show-mobile-only" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-3)' }}>
                  {sales.map((sale) => (
                    <div key={sale.id} onClick={() => setSelectedSale(sale)}
                      style={{
                        padding: 'var(--space-3)', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 4 }}>
                          <span className="font-semibold" style={{ fontSize: 'var(--font-size-sm)' }}>{sale.orderNumber}</span>
                          <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-danger'}`}>{sale.status}</span>
                        </div>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                          {sale.waiterName} · {formatTime(sale.createdAt)} · {sale.items.length} items
                        </span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="font-semibold" style={{ fontSize: 'var(--font-size-sm)' }}>{formatCurrency(sale.total)}</span>
                        <div style={{ marginTop: '3px' }}>
                          <span className={`payment-pill payment-pill-${sale.paymentMethod === 'bank-transfer' ? 'cbe' : sale.paymentMethod}`}>
                            {getPaymentLabel(sale.paymentMethod)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sale Detail Thermal Receipt Modal */}
        {selectedSale && (
          <ReceiptModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
        )}
      </main>
    </div>
  );
}
