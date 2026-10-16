import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import Login from './pages/Login';
import POSPage from './pages/pos/POSPage';
import POSHistory from './pages/pos/POSHistory';
import Dashboard from './pages/owner/Dashboard';
import OwnerSales from './pages/owner/Sales';
import OwnerProducts from './pages/owner/Products';
import OwnerCategories from './pages/owner/Categories';
import OwnerWaiters from './pages/owner/Waiters';
import OwnerSettings from './pages/owner/Settings';
import AccessDenied from './pages/AccessDenied';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <Routes>
              {/* Public */}
              <Route path="/login" element={<Login />} />
              <Route path="/access-denied" element={<AccessDenied />} />

              {/* Cashier routes */}
              <Route
                path="/pos"
                element={
                  <ProtectedRoute allowedRoles={['cashier', 'owner']}>
                    <POSPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pos/history"
                element={
                  <ProtectedRoute allowedRoles={['cashier', 'owner']}>
                    <POSHistory />
                  </ProtectedRoute>
                }
              />

              {/* Owner routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/sales"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerSales />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/products"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/categories"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/waiters"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerWaiters />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/settings"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <OwnerSettings />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
  );
}
