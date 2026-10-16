import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { salesService } from '../../services/salesService';
import { DateRange, KPIData, CategorySalesData, PaymentBreakdown, WaiterPerformance, SalesChartPoint, Sale } from '../../types';
import { formatCurrency, formatNumber, getGreeting, getCurrentDate, getPaymentLabel } from '../../utils/formatters';
import Sidebar from '../../components/layout/Sidebar';
import OwnerNavbar from '../../components/layout/OwnerNavbar';
import ReceiptModal from '../../components/common/ReceiptModal';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  DollarSign, ShoppingCart, TrendingUp, Package, ArrowUpRight, ArrowDownRight,
  Clock, Users, Award, Zap, UserPlus, PlusCircle, FolderPlus, Receipt, ArrowRight,
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [stats, setStats] = useState<KPIData | null>(null);
  const [categorySales, setCategorySales] = useState<CategorySalesData[]>([]);
  const [paymentData, setPaymentData] = useState<PaymentBreakdown[]>([]);
  const [topProducts, setTopProducts] = useState<{ productId: string; name: string; quantity: number; revenue: number }[]>([]);
  const [waiterPerformance, setWaiterPerformance] = useState<WaiterPerformance[]>([]);
  const [chartData, setChartData] = useState<SalesChartPoint[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [s, cs, pd, tp, wp, cd, rs] = await Promise.all([
        salesService.getStats(dateRange),
        salesService.getCategorySales(dateRange),
        salesService.getPaymentBreakdown(dateRange),
        salesService.getTopProducts(dateRange, 5),
        salesService.getWaiterPerformance(dateRange),
        dateRange === 'month'
          ? salesService.getMonthChartData()
          : salesService.getLast7DaysChartData(),
        salesService.getFiltered({ dateRange: 'today' }),
      ]);
      setStats(s);
      setCategorySales(cs);
      setPaymentData(pd);
      setTopProducts(tp);
      setWaiterPerformance(wp);
      setChartData(cd);
      setRecentSales(rs.slice(0, 8));
      setIsLoading(false);
    }
    loadData();
  }, [dateRange]);

  const topItem = topProducts.length > 0 ? topProducts[0] : null;

  const kpiCards = stats ? [
    { label: 'Total Sales', value: formatCurrency(stats.totalSales), change: stats.salesChange, icon: DollarSign, color: '#4A2C22' },
    { label: 'Orders', value: formatNumber(stats.totalOrders), change: stats.ordersChange, icon: ShoppingCart, color: '#6B4436' },
    {
      label: 'Top Selling Item',
      value: topItem ? topItem.name : '—',
      subtext: topItem ? `${topItem.quantity} sold` : 'No sales yet',
      isText: true,
      icon: Award,
      color: '#8A6252',
    },
    { label: 'Items Served', value: formatNumber(stats.itemsSold), change: stats.itemsChange, icon: Package, color: '#A68070' },
  ] : [];

  const DONUT_COLORS = ['#4A2C22', '#6B4436', '#8A6252', '#A68070', '#C4A594', '#DCC8BB'];

  const getPaymentColor = (method: string) => {
    const m = (method || '').toLowerCase();
    if (m === 'cbe' || m === 'bank-transfer') return '#7E22CE'; // CBE Purple
    if (m === 'cash') return '#10B981'; // Cash Green
    if (m === 'telebirr') return '#0284C7'; // Telebirr Cyan
    return '#F59E0B'; // Other Amber
  };

  return (
    <div className="app-page-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface-secondary)' }}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="dashboard-main">
        <OwnerNavbar title={t('nav.dashboard')} />
        <div className="page-container">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-greeting">{getGreeting()}, {user?.name?.split(' ')[0]}</h1>
              <p className="page-subtitle">Overview of your café performance</p>
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
          </div>

          {/* KPI Cards (Showing Today's Data by default) */}
          <div className="dashboard-kpi-grid">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card kpi-card">
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)' }} />
                    <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: 'var(--space-3)' }} />
                    <div className="skeleton" style={{ width: '70%', height: 28, marginTop: 'var(--space-2)' }} />
                  </div>
                ))
              : kpiCards.map((kpi: any, i) => (
                  <div key={i} className="card kpi-card">
                    <div className="kpi-icon" style={{ background: `${kpi.color}12`, color: kpi.color }}>
                      <kpi.icon size={20} />
                    </div>
                    <span className="kpi-label">{kpi.label}</span>
                    <span className={`kpi-value ${kpi.isText ? 'kpi-value-text' : ''}`} title={kpi.value}>
                      {kpi.value}
                    </span>
                    {kpi.subtext ? (
                      <span className="kpi-subtext-badge">
                        {kpi.subtext}
                      </span>
                    ) : kpi.change !== undefined && kpi.change !== 0 ? (
                      <span className={`kpi-change ${kpi.change > 0 ? 'positive' : 'negative'}`}>
                        {kpi.change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(kpi.change)}% vs previous
                      </span>
                    ) : null}
                  </div>
                ))}
          </div>

          {/* Row 1: Last 7 Days Sales Trend + Today's Recent Sales (Swapped here) */}
          <div className="dashboard-charts-row">
            {/* Sales Chart: Last 7 Days / Month Sales Trend */}
            <div className="card dashboard-chart-main">
              <div className="card-header">
                <div>
                  <h3 className="card-title">
                    {dateRange === 'month' ? 'This Month Sales Trend' : 'Last 7 Days Sales Trend'}
                  </h3>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {dateRange === 'month' ? 'Daily income across this month' : 'Daily income for the past week'}
                  </p>
                </div>
              </div>
              <div className="chart-container">
                {isLoading ? (
                  <div className="skeleton" style={{ width: '100%', height: '100%' }} />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 15, bottom: 5, left: -10 }}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6B4436" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#6B4436" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10.5, fill: '#766A64' }}
                        interval={dateRange === 'month' ? 'preserveStartEnd' : 0}
                        minTickGap={dateRange === 'month' ? 14 : 5}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#766A64' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <Tooltip
                        contentStyle={{
                          background: '#FCFAF7', border: '1px solid #EDE4DB',
                          borderRadius: 10, fontSize: 13, boxShadow: '0 4px 12px rgba(46,27,21,0.08)',
                        }}
                        formatter={(value: any) => [formatCurrency(Number(value) || 0), 'Income']}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#6B4436" strokeWidth={2.5} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Today's Recent Sales (Swapped here from bottom with clean 5 columns) */}
            <div className="card dashboard-chart-side dashboard-recent-sales-side">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Clock size={16} color="var(--color-brown-400)" />
                    <h3 className="card-title">Today's Recent Sales</h3>
                  </div>
                  <span className="recent-sales-count-pill">{recentSales.length} orders</span>
                </div>
              </div>

              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-2) 0', alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 45, height: 16 }} />
                    <div className="skeleton skeleton-text" style={{ flex: 1 }} />
                    <div className="skeleton" style={{ width: 65, height: 16 }} />
                  </div>
                ))
              ) : recentSales.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-6) 0' }}>
                  <p className="empty-state-title" style={{ fontSize: '13px' }}>No sales today yet</p>
                  <p className="empty-state-text" style={{ fontSize: '11px' }}>New sales will appear here in real-time.</p>
                </div>
              ) : (
                <>
                  {/* Tablet & Desktop Table: Items and Status removed for maximum clarity */}
                  <div className="hide-mobile" style={{ overflowX: 'auto' }}>
                    <table className="recent-sales-compact-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Time</th>
                          <th>Waiter</th>
                          <th>Payment</th>
                          <th style={{ textAlign: 'right' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSales.map((sale: any) => (
                          <tr
                            key={sale.id}
                            onClick={() => setSelectedSale(sale)}
                            className="clickable-sale-row"
                            title="Click to view receipt"
                          >
                            <td className="font-semibold">{sale.orderNumber}</td>
                            <td style={{ color: 'var(--color-text-muted)', fontSize: '11.5px' }}>
                              {new Date(sale.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td style={{ fontSize: '12.5px' }}>{sale.waiterName}</td>
                            <td>
                              <span className={`payment-pill payment-pill-${sale.paymentMethod === 'bank-transfer' ? 'cbe' : sale.paymentMethod}`}>
                                {getPaymentLabel(sale.paymentMethod)}
                              </span>
                            </td>
                            <td className="font-semibold" style={{ textAlign: 'right', fontSize: '12.5px' }}>
                              {formatCurrency(sale.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View: Beautiful, spacious rows without Items or Status */}
                  <div className="show-mobile-only recent-sales-mobile-list">
                    {recentSales.map((sale: any) => (
                      <div
                        key={sale.id}
                        className="recent-sale-mobile-item clickable-sale-row"
                        onClick={() => setSelectedSale(sale)}
                        title="Click to view receipt"
                      >
                        <div className="recent-sale-mobile-row-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="sale-order-num">{sale.orderNumber}</span>
                            <span className="sale-order-time">
                              {new Date(sale.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="sale-order-amount">{formatCurrency(sale.total)}</span>
                        </div>
                        <div className="recent-sale-mobile-row-bottom">
                          <span className="sale-order-waiter">Server: <strong>{sale.waiterName}</strong></span>
                          <span className={`payment-pill payment-pill-${sale.paymentMethod === 'bank-transfer' ? 'cbe' : sale.paymentMethod}`}>
                            {getPaymentLabel(sale.paymentMethod)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Row 2: Quick Actions + Top Products & Payment/Waiter Performance */}
          <div className="dashboard-charts-row">
            {/* Left Column: Quick Actions + Top Selling Products */}
            <div className="dashboard-column-left">
              {/* Quick Actions Card */}
              <div className="card dashboard-quick-actions-card">
                <div className="card-header" style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Zap size={16} color="var(--color-brown-400)" />
                    <h3 className="card-title">Quick Actions</h3>
                  </div>
                  <span className="text-xs text-muted">Shortcuts</span>
                </div>
                <div className="quick-actions-grid">
                  <button
                    type="button"
                    className="quick-action-tile"
                    onClick={() => navigate('/owner/products', { state: { openNew: true } })}
                    title="Create a new café product"
                  >
                    <div className="quick-action-icon-wrap" style={{ background: '#FEF3C7', color: '#92400E' }}>
                      <PlusCircle size={18} />
                    </div>
                    <div className="quick-action-content">
                      <span className="quick-action-title">New Product</span>
                      <span className="quick-action-desc">Add menu item</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="quick-action-tile"
                    onClick={() => navigate('/owner/categories', { state: { openNew: true } })}
                    title="Add a new menu category"
                  >
                    <div className="quick-action-icon-wrap" style={{ background: '#EDE4DB', color: '#54362A' }}>
                      <FolderPlus size={18} />
                    </div>
                    <div className="quick-action-content">
                      <span className="quick-action-title">Add Category</span>
                      <span className="quick-action-desc">Organize menu</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="quick-action-tile"
                    onClick={() => navigate('/owner/waiters', { state: { openNew: true } })}
                    title="Add a new waiter to staff"
                  >
                    <div className="quick-action-icon-wrap" style={{ background: '#F4ECE4', color: '#4A2C22' }}>
                      <UserPlus size={18} />
                    </div>
                    <div className="quick-action-content">
                      <span className="quick-action-title">Add Waiter</span>
                      <span className="quick-action-desc">Register staff</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="quick-action-tile"
                    onClick={() => navigate('/owner/sales')}
                    title="View today's sales transactions"
                  >
                    <div className="quick-action-icon-wrap" style={{ background: '#ECFDF5', color: '#065F46' }}>
                      <Receipt size={18} />
                    </div>
                    <div className="quick-action-content">
                      <span className="quick-action-title">Today's Sales</span>
                      <span className="quick-action-desc">View recorded</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="card dashboard-chart-main">
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Award size={16} color="var(--color-brown-400)" />
                    <h3 className="card-title">Top Selling Products</h3>
                  </div>
                </div>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3) 0', alignItems: 'center' }}>
                      <div className="skeleton" style={{ width: 24, height: 24, borderRadius: 'var(--radius-full)' }} />
                      <div className="skeleton skeleton-text" style={{ flex: 1 }} />
                      <div className="skeleton" style={{ width: 60, height: 16 }} />
                    </div>
                  ))
                ) : (
                  <div className="top-products-list">
                    {topProducts.map((product, i) => (
                      <div key={i} className="top-product-item">
                        <span className="top-product-rank">{i + 1}</span>
                        <div className="top-product-info">
                          <span className="top-product-name">{product.name}</span>
                          <span className="top-product-qty">{product.quantity} sold</span>
                        </div>
                        <span className="top-product-revenue">{formatCurrency(product.revenue)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Breakdown + Waiter Activity */}
            <div className="card dashboard-chart-side">
              <div className="card-header">
                <h3 className="card-title">Payment Overview</h3>
              </div>
              {isLoading ? (
                <div className="skeleton" style={{ width: '100%', height: 160 }} />
              ) : (
                <div className="payment-breakdown">
                  {paymentData.map((pm, i) => {
                    const color = getPaymentColor(pm.method || pm.label);
                    return (
                      <div key={i} className="payment-item">
                        <div className="payment-item-header">
                          <span className="payment-item-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                            {pm.label}
                          </span>
                          <span className="payment-item-pct">{pm.percentage}%</span>
                        </div>
                        <div className="payment-bar-track">
                          <div
                            className="payment-bar-fill"
                            style={{
                              width: `${pm.percentage}%`,
                              background: color,
                            }}
                          />
                        </div>
                        <span className="payment-item-amount">{formatCurrency(pm.amount)} · {pm.count} orders</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="divider" />

              <div className="card-header" style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Users size={16} color="var(--color-brown-400)" />
                  <h3 className="card-title">Waiter Activity</h3>
                </div>
              </div>
              {waiterPerformance.length === 0 ? (
                <p className="text-muted text-sm">No activity in this period.</p>
              ) : (
                <div className="waiter-activity-list">
                  {waiterPerformance.map((w, i) => (
                    <div key={i} className="waiter-activity-item">
                      <div className="avatar avatar-sm">{w.waiterName[0]}</div>
                      <div className="waiter-activity-info">
                        <span className="waiter-activity-name">{w.waiterName}</span>
                        <span className="waiter-activity-meta">{w.orders} orders</span>
                      </div>
                      <span className="waiter-activity-revenue">{formatCurrency(w.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sales by Category (Swapped here from top into full wide card) */}
          <div className="card dashboard-category-wide-card" style={{ marginTop: 'var(--space-5)' }}>
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <TrendingUp size={16} color="var(--color-brown-400)" />
                <h3 className="card-title">Sales by Category</h3>
              </div>
            </div>
            {isLoading ? (
              <div className="skeleton" style={{ width: '100%', height: 180 }} />
            ) : (
              <div className="category-wide-layout">
                <div className="category-wide-donut">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={categorySales}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categorySales.map((_, index) => (
                          <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#FCFAF7', border: '1px solid #EDE4DB',
                          borderRadius: 10, fontSize: 12, boxShadow: '0 4px 12px rgba(46,27,21,0.08)',
                        }}
                        formatter={(value: any) => [formatCurrency(Number(value) || 0)]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="category-wide-bars">
                  {categorySales.map((cat, i) => (
                    <div key={i} className="category-wide-bar-item">
                      <div className="category-bar-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="donut-legend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span className="category-bar-name">{cat.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="category-bar-val">{formatCurrency(cat.value)}</span>
                          <span className="category-bar-pct">({cat.percentage}%)</span>
                        </div>
                      </div>
                      <div className="payment-bar-track">
                        <div
                          className="payment-bar-fill"
                          style={{
                            width: `${cat.percentage}%`,
                            background: DONUT_COLORS[i % DONUT_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Realistic Thermal Receipt Modal when Recent Sale clicked */}
        {selectedSale && (
          <ReceiptModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
        )}
      </main>
    </div>
  );
}
