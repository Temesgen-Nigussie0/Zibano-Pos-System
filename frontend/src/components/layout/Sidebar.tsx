import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, ShoppingCart, ClipboardList, Package, FolderOpen,
  Users, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';
import zibanoLogo from '../../assets/logo/Z LOGO.png';
import { getInitials } from '../../utils/formatters';
import './Sidebar.css';

export const toggleMobileSidebar = () => {
  window.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'));
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const ownerNavItems = [
    { path: '/owner/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/owner/sales', icon: ClipboardList, label: t('nav.sales') },
    { path: '/pos', icon: ShoppingCart, label: t('nav.pos') },
    { path: '/owner/products', icon: Package, label: t('nav.products') },
    { path: '/owner/categories', icon: FolderOpen, label: t('nav.categories') },
    { path: '/owner/waiters', icon: Users, label: t('nav.waiters') },
    { path: '/owner/settings', icon: Settings, label: t('nav.settings') },
  ];

  const cashierNavItems = [
    { path: '/pos', icon: ShoppingCart, label: t('nav.pos') },
    { path: '/pos/history', icon: ClipboardList, label: t('nav.history') },
  ];

  const navItems = role === 'owner' ? ownerNavItems : cashierNavItems;
  const isPOS = location.pathname === '/pos';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // When mobile drawer is open, always show text. On desktop, only when !collapsed.
  const isExpanded = !collapsed || mobileOpen;

  // Listen to global toggle event (e.g. from POSPage top bar menu button)
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener('toggle-mobile-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-mobile-sidebar', handleToggle);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer or logout modal is open
  useEffect(() => {
    if (mobileOpen || showLogoutConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, showLogoutConfirm]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    };
    if (showLogoutConfirm) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLogoutConfirm]);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Topbar for pages other than /pos (which already has its search header) */}
      {!isPOS && (
        <header className="sidebar-mobile-topbar show-mobile-only">
          <button
            type="button"
            className="sidebar-mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="sidebar-mobile-brand">
            <div className="sidebar-mobile-brand-icon">
              <img src={zibanoLogo} alt="Zibano Coffee" className="sidebar-logo-img" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span className="sidebar-mobile-brand-title">Zibano Coffee</span>
              <span className="sidebar-mobile-brand-sub">ዝባኖ ቡና</span>
            </div>
            <span className="sidebar-mobile-brand-badge">{role === 'owner' ? t('nav.owner') : t('nav.cashier')}</span>
          </div>

          <div className="sidebar-mobile-user" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LanguageToggle compact />
            <div className="avatar avatar-sm" style={{ background: '#3A241C', color: '#FFF', fontSize: '11px' }}>
              {getInitials(user?.name || 'U')}
            </div>
          </div>
        </header>
      )}

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-backdrop show-mobile-only"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop Sticky Sidebar + Mobile Slide-out Drawer) */}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Header Row: Logo & Toggle Button */}
        <div className="sidebar-header-row">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <img src={zibanoLogo} alt="Zibano Coffee" className="sidebar-logo-img" />
            </div>
            {isExpanded && (
              <div className="sidebar-logo-text">
                <span className="sidebar-logo-title">Zibano Coffee</span>
                <span className="sidebar-logo-sub">ዝባኖ ቡና</span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button: Cleanly placed inside the sidebar header */}
          <button
            type="button"
            className="sidebar-toggle-btn hide-mobile"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            className="sidebar-mobile-close show-mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/pos'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
              title={collapsed && !mobileOpen ? item.label : undefined}
            >
              <item.icon size={20} className="sidebar-link-icon" />
              {isExpanded && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Profile / Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <div className="avatar avatar-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontSize: '11px', flexShrink: 0 }}>
              {getInitials(user?.name || 'U')}
            </div>
            {isExpanded && (
              <div className="sidebar-profile-info">
                <span className="sidebar-profile-name">{user?.name}</span>
                <span className="sidebar-profile-role">{role === 'owner' ? t('nav.owner') : t('nav.cashier')}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="sidebar-link sidebar-logout"
            onClick={() => setShowLogoutConfirm(true)}
            title={collapsed && !mobileOpen ? t('nav.logout') : undefined}
          >
            <LogOut size={20} className="sidebar-link-icon" />
            {isExpanded && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
        >
          <div
            className="logout-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="logout-modal-close-btn"
              onClick={() => setShowLogoutConfirm(false)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="logout-modal-icon-badge">
              <LogOut size={26} strokeWidth={2.2} />
            </div>

            <div className="logout-modal-content">
              <h3 id="logout-confirm-title" className="logout-modal-title">
                {t('nav.logoutConfirmTitle')}
              </h3>
              <p className="logout-modal-subtitle">
                {t('nav.logoutConfirmText')}
              </p>

              {user && (
                <div className="logout-user-pill">
                  <div className="avatar avatar-xs logout-user-avatar">
                    {getInitials(user.name || 'U')}
                  </div>
                  <div className="logout-user-info">
                    <span className="logout-user-name">{user.name}</span>
                    <span className="logout-user-role">
                      {role === 'owner' ? t('nav.owner') : t('nav.cashier')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="logout-btn-confirm"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
