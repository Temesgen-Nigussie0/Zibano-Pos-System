import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { productService } from '../../services/productService';
import { salesService } from '../../services/salesService';
import { waiterService } from '../../services/waiterService';
import { Product, Waiter, Sale } from '../../types';
import { tables } from '../../data/tables';
import { formatCurrency, calculateVATBreakdown, getCurrentDate, getCurrentTime } from '../../utils/formatters';
import Sidebar, { toggleMobileSidebar } from '../../components/layout/Sidebar';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../../components/common/LanguageToggle';
import {
  Search, X, Minus, Plus, Trash2, ShoppingBag, CreditCard, Banknote,
  Smartphone, MoreHorizontal, Coffee, Check, ArrowRight,
  Clock, Menu as MenuIcon, UtensilsCrossed, Package,
} from 'lucide-react';
import cashImg from '../../assets/payment/cash.png';
import telebirrImg from '../../assets/payment/telebirr.png';
import cbeImg from '../../assets/payment/cbe.png';
import './POSPage.css';

export default function POSPage() {
  const { user } = useAuth();
  const cart = useCart();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const posCategories = useMemo(() => [
    { id: 'popular', label: t('cat.popular') },
    { id: 'breakfast', label: t('cat.breakfast') },
    { id: 'wraps', label: t('cat.wraps') },
    { id: 'ethiopian', label: t('cat.ethiopian') },
    { id: 'pasta', label: t('cat.pasta') },
    { id: 'snacks', label: t('cat.snacks') },
    { id: 'cold-drinks', label: t('cat.coldDrinks') },
    { id: 'juice', label: t('cat.juice') },
    { id: 'hot-drinks', label: t('cat.hotDrinks') },
    { id: 'cakes', label: t('cat.cakes') },
  ], [t]);

  const paymentMethodsList = useMemo(() => [
    { id: 'cash' as const, label: t('pos.cash'), image: cashImg },
    { id: 'telebirr' as const, label: t('pos.telebirr'), image: telebirrImg },
    { id: 'cbe' as const, label: t('pos.cbe'), image: cbeImg },
    { id: 'other' as const, label: t('pos.other'), icon: MoreHorizontal },
  ], [t]);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Load products and waiters
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [prods, wts] = await Promise.all([
        productService.getByCategory(activeCategory),
        waiterService.getActive(),
      ]);
      setProducts(prods);
      setWaiters(wts);
      if (wts.length > 0 && !cart.selectedWaiter) {
        cart.setSelectedWaiter(wts[0]);
      }
      setIsLoading(false);
    }
    load();
  }, [activeCategory]);

  // Search handler
  useEffect(() => {
    if (searchQuery.trim()) {
      productService.search(searchQuery).then(setProducts);
    } else {
      productService.getByCategory(activeCategory).then(setProducts);
    }
  }, [searchQuery, activeCategory]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setSearchQuery('');
  };

  // Popular section: 2 rows (5 cols x 2 rows = 10 items when collapsed, 4 cols x 2 rows = 8 items when extended)
  const displayedProducts = useMemo(() => {
    if (activeCategory === 'popular' && !searchQuery.trim()) {
      const limit = sidebarCollapsed ? 10 : 8;
      return products.slice(0, limit);
    }
    return products;
  }, [products, activeCategory, searchQuery, sidebarCollapsed]);

  const handleCompleteSale = async () => {
    const waiterToUse = cart.selectedWaiter || (waiters.length > 0 ? waiters[0] : null);
    if (!waiterToUse) {
      showToast('warning', 'Please select a waiter (T1, T2, T3) below.');
      return;
    }
    if (cart.items.length === 0) {
      showToast('warning', 'Add at least one product to complete the sale.');
      return;
    }
    if (!cart.paymentMethod) {
      showToast('warning', 'Please select a payment method.');
      return;
    }

    setIsCompleting(true);
    try {
      const sale = await salesService.create({
        waiterId: waiterToUse.id,
        waiterName: waiterToUse.name,
        cashierId: user?.id || '',
        cashierName: user?.name || '',
        orderType: cart.orderType,
        paymentMethod: cart.paymentMethod,
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
        total: cart.total,
      });
      setCompletedSale(sale);
      showToast('success', 'Sale completed successfully.');
    } catch {
      showToast('error', 'Something went wrong. Please try again.');
    }
    setIsCompleting(false);
  };

  const handleNewOrder = () => {
    cart.resetOrder();
    setCompletedSale(null);
  };

  const vatBreakdown = calculateVATBreakdown(cart.total);

  // If sale just completed, show success
  if (completedSale) {
    return (
      <div className="pos-layout">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className="pos-main">
          <div className="sale-success-overlay">
            <div className="sale-success-card">
              <div className="sale-success-icon">
                <Check size={32} />
              </div>
              <h2>Sale Completed</h2>
              <p className="sale-success-amount">{formatCurrency(completedSale.total)}</p>
              <div className="sale-success-details">
                <div className="sale-success-row">
                  <span>Order</span>
                  <span className="font-semibold">{completedSale.orderNumber}</span>
                </div>
                <div className="sale-success-row">
                  <span>Waiter</span>
                  <span>{completedSale.waiterName}</span>
                </div>
                <div className="sale-success-row">
                  <span>Payment</span>
                  <span style={{ textTransform: 'capitalize' }}>{completedSale.paymentMethod.replace('-', ' ')}</span>
                </div>
                {completedSale.tableNumber && (
                  <div className="sale-success-row">
                    <span>Table</span>
                    <span>Table {completedSale.tableNumber}</span>
                  </div>
                )}
                {completedSale.changeGiven && completedSale.changeGiven > 0 && (
                  <div className="sale-success-row">
                    <span>Change</span>
                    <span className="font-semibold">{formatCurrency(completedSale.changeGiven)}</span>
                  </div>
                )}
              </div>
              <div className="sale-success-actions">
                <button className="btn btn-primary btn-lg btn-block" onClick={handleNewOrder}>
                  New Order
                </button>
              </div>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-light)', marginTop: 'var(--space-4)' }}>
                Internal sales record
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pos-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className="pos-main">
        {/* Header */}
        <header className="pos-header">
          <button className="btn btn-icon btn-ghost show-mobile-only" onClick={toggleMobileSidebar} aria-label="Open menu">
            <MenuIcon size={20} />
          </button>

          <div className="pos-search-wrapper">
            <Search size={16} className="pos-search-icon" />
            <input
              type="text"
              className="pos-search-input"
              placeholder={t('pos.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="pos-search-clear" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="pos-header-right">
            <span className="pos-header-date hide-mobile">{getCurrentDate()}</span>
            <span className="pos-header-time hide-mobile">{currentTime}</span>
            <LanguageToggle />
          </div>
        </header>

        <div className="pos-content">
          {/* Products Area */}
          <div className={`pos-products ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-extended'}`}>
            {/* Category Tabs */}
            <div className="pos-categories">
              {posCategories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Scrollable Products Grid Area */}
            <div className="pos-products-body">
              <div className="pos-product-grid">
                {isLoading ? (
                  Array.from({ length: sidebarCollapsed ? 10 : 8 }).map((_, i) => (
                    <div key={i} className="pos-product-card-skeleton">
                      <div className="skeleton" style={{ height: 145, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
                      <div style={{ padding: 'var(--space-3)' }}>
                        <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                        <div className="skeleton skeleton-text short" />
                      </div>
                    </div>
                  ))
                ) : displayedProducts.length === 0 ? (
                  <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
                    <div className="empty-state-icon"><Search size={24} /></div>
                    <p className="empty-state-title">No products found</p>
                    <p className="empty-state-text">
                      {searchQuery ? 'Try another search term.' : 'No products in this category.'}
                    </p>
                  </div>
                ) : (
                  displayedProducts.map((product) => {
                    const cartItem = cart.items.find((i) => i.productId === product.id);
                    return (
                      <div
                        key={product.id}
                        className={`pos-product-card ${!product.available ? 'unavailable' : ''} ${cartItem ? 'in-cart' : ''}`}
                      >
                        <div className="pos-product-image">
                          <img src={product.image} alt={product.name} loading="lazy" />
                          {!product.available && <span className="pos-product-unavailable-badge">Unavailable</span>}
                          {cartItem && (
                            <span className="pos-product-qty-badge">{cartItem.quantity}</span>
                          )}
                        </div>
                        <div className="pos-product-info">
                          <h4 className="pos-product-name">{product.name}</h4>
                          <p className="pos-product-desc">{product.description}</p>
                          <div className="pos-product-footer">
                            <span className="pos-product-price">{formatCurrency(product.price)}</span>
                            {product.available && !cartItem && (
                              <button
                                type="button"
                                className="pos-product-add"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cart.addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: product.image,
                                  });
                                }}
                                title={`Add ${product.name} to order`}
                                aria-label={`Add ${product.name} to order`}
                              >
                                <Plus size={16} />
                              </button>
                            )}
                            {cartItem && (
                              <div className="pos-product-qty-controls" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={() => cart.updateQuantity(product.id, cartItem.quantity - 1)}
                                  title="Decrease quantity"
                                >
                                  <Minus size={14} />
                                </button>
                                <span>{cartItem.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => cart.updateQuantity(product.id, cartItem.quantity + 1)}
                                  title="Increase quantity"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Waiters Dock (Fixed in the bottom) */}
            <div className="pos-waiters-bar-bottom">
              <div className="pos-waiters-dock">
                {waiters.slice(0, 3).map((w, index) => {
                  const isSelected = cart.selectedWaiter?.id === w.id;
                  const label = `T${index + 1}`;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      className={`pos-waiter-capsule ${isSelected ? 'active' : ''}`}
                      onClick={() => cart.setSelectedWaiter(isSelected ? null : w)}
                      title={`Assign ${w.name}`}
                    >
                      <div className="pos-waiter-badge">
                        <span>{label}</span>
                      </div>
                      <div className="pos-waiter-details">
                        <div className="pos-waiter-name-row">
                          <span className="pos-waiter-name">{w.name}</span>
                          {isSelected && <span className="pos-waiter-status-tag">Active</span>}
                        </div>
                        <span className="pos-waiter-sub">Waiter</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Panel (Desktop) */}
          <div className={`pos-order-panel ${showMobileCart ? 'show-mobile' : ''}`}>
            <div className="pos-order-header">
              <div className="pos-order-title-wrap">
                <Coffee size={16} className="pos-order-header-icon" />
                <h3>{t('pos.currentOrder')}</h3>
                <span className="pos-order-item-count-chip">
                  {cart.itemCount} {cart.itemCount === 1 ? t('pos.item') : t('pos.items')}
                </span>
              </div>
              {cart.items.length > 0 && (
                <button
                  className="pos-order-clear-btn"
                  onClick={() => {
                    if (window.confirm('Clear current order? All selected items will be removed.')) {
                      cart.clearCart();
                    }
                  }}
                  title="Clear order"
                >
                  <Trash2 size={12} />
                  <span>{t('pos.clear')}</span>
                </button>
              )}
            </div>

            {/* Order Type */}
            <div className="pos-order-type">
              <div className="segmented-control" style={{ width: '100%' }}>
                <button
                  className={`segmented-option ${cart.orderType === 'dine-in' ? 'active' : ''}`}
                  onClick={() => cart.setOrderType('dine-in')}
                  style={{ flex: 1 }}
                >
                  {t('pos.dineIn')}
                </button>
                <button
                  className={`segmented-option ${cart.orderType === 'take-away' ? 'active' : ''}`}
                  onClick={() => cart.setOrderType('take-away')}
                  style={{ flex: 1 }}
                >
                  {t('pos.takeAway')}
                </button>
              </div>
            </div>

            {/* Server Assigned Pill */}
            {cart.selectedWaiter && (
              <div className="pos-order-server-badge">
                <div className="pos-server-info-left">
                  <span className="pos-server-indicator-dot" />
                  <span className="pos-server-caption">{t('pos.waiter')}:</span>
                  <span className="pos-server-val">{cart.selectedWaiter.name}</span>
                </div>
                <span className="pos-server-tag">
                  T{waiters.findIndex((w) => w.id === cart.selectedWaiter?.id) + 1 || 1}
                </span>
              </div>
            )}

            {/* Cart Items */}
            <div className="pos-order-items">
              {cart.items.length === 0 ? (
                <div className="empty-state" style={{ padding: 'var(--space-6) var(--space-4)' }}>
                  <div className="empty-state-icon"><ShoppingBag size={20} /></div>
                  <p className="empty-state-title">{t('pos.noItems')}</p>
                  <p className="empty-state-text">{t('pos.noItemsSub')}</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div key={item.productId} className="pos-order-item-card">
                    <div className="pos-order-item-info">
                      <span className="pos-order-item-name">{item.productName}</span>
                      <span className="pos-order-item-price">{item.quantity} × {formatCurrency(item.unitPrice)}</span>
                    </div>
                    <div className="pos-order-item-right">
                      <span className="pos-order-item-subtotal">{formatCurrency(item.subtotal)}</span>
                      <div className="pos-order-item-controls">
                        <button
                          className="pos-order-qty-btn minus"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity - 1)}
                          title="Decrease"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="pos-order-qty-num">{item.quantity}</span>
                        <button
                          className="pos-order-qty-btn plus"
                          onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                          title="Increase"
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          className="pos-order-remove-btn"
                          onClick={() => cart.removeItem(item.productId)}
                          title="Remove"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals & Payment */}
            {cart.items.length > 0 && (
              <div className="pos-order-footer">
                {/* Total Payable Card */}
                <div className="pos-order-total-payable-card">
                  <span className="pos-grand-total-label">{t('pos.total')}</span>
                  <span className="pos-grand-total-val">{formatCurrency(cart.total)}</span>
                </div>

                {/* Payment Method - 4 in One Row */}
                <div className="pos-payment-section">
                  <div className="pos-payment-header">
                    <span className="pos-payment-label">{t('pos.paymentMethod')}</span>
                    {cart.paymentMethod && (
                      <span className="pos-payment-selected-tag">
                        {cart.paymentMethod}
                      </span>
                    )}
                  </div>
                  <div className="pos-payment-row">
                    {paymentMethodsList.map((pm) => {
                      const isSelected = cart.paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          className={`pos-payment-card-compact pos-payment-${pm.id} ${isSelected ? 'active' : ''}`}
                          onClick={() => cart.setPaymentMethod(isSelected ? null : pm.id)}
                          title={pm.label}
                        >
                          {isSelected && (
                            <div className="pos-payment-check-mini">
                              <Check size={8} strokeWidth={3.5} />
                            </div>
                          )}
                          <div className="pos-payment-img-wrap-compact">
                            {'image' in pm && pm.image ? (
                              <img src={pm.image} alt={pm.label} className="pos-payment-img-compact" />
                            ) : 'icon' in pm && pm.icon ? (
                              <pm.icon size={15} />
                            ) : null}
                          </div>
                          <span className="pos-payment-name-compact">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  className="pos-checkout-btn"
                  onClick={handleCompleteSale}
                  disabled={isCompleting}
                >
                  {isCompleting ? (
                    <>
                      <span className="btn-spinner" />
                      ...
                    </>
                  ) : (
                    <>
                      <Check size={19} strokeWidth={2.5} />
                      {t('pos.completeSale')} · {formatCurrency(cart.total)}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cart FAB */}
        {cart.items.length > 0 && (
          <button
            className="pos-mobile-cart-fab show-mobile-only"
            onClick={() => setShowMobileCart(!showMobileCart)}
          >
            <ShoppingBag size={20} />
            <span>{cart.itemCount} items · {formatCurrency(cart.total)}</span>
          </button>
        )}

        {/* Mobile Cart Overlay */}
        {showMobileCart && (
          <div className="drawer-overlay show-mobile-only" onClick={() => setShowMobileCart(false)} />
        )}
      </div>
    </div>
  );
}
