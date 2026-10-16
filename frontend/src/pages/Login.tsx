import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, Check } from 'lucide-react';
import zibanoLogo from '../assets/logo/Z LOGO.png';
import './Login.css';

const DEMO_CREDENTIALS = [
  { label: 'Owner', email: 'owner@zibano.demo', password: 'ZibanoOwner123!', role: 'Owner' },
  { label: 'Cashier', email: 'cashier@zibano.demo', password: 'ZibanoCashier123!', role: 'Cashier' },
];

export default function Login() {
  const { login, isAuthenticated, role } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={role === 'owner' ? '/owner/dashboard' : '/pos'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success && result.error) {
      setError(result.error);
    }
  };

  const fillCredentials = (cred: typeof DEMO_CREDENTIALS[0]) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError('');
  };

  return (
    <div className="login-page">
      {/* Left Panel — Login Form */}
      <div className="login-left">
        <div className="login-form-container">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon-wrap">
              <img src={zibanoLogo} alt="Zibano Coffee" className="login-logo-img" />
            </div>
            <div>
              <h1 className="login-logo-text">Zibano Coffee</h1>
              <span className="login-logo-sub">ዝባኖ ቡና</span>
            </div>
          </div>

          {/* Heading */}
          <div className="login-heading">
            <h2>Welcome back</h2>
            <p>Sign in to continue to Zibano Coffee / ዝባኖ ቡና</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                <Lock size={14} />
                {error}
              </div>
            )}

            <div className="input-group">
              <label className="input-label" htmlFor="login-email">Email</label>
              <div className="input-wrapper">
                <Mail size={16} className="input-icon-left" />
                <input
                  id="login-email"
                  type="email"
                  className="input has-icon-left"
                  placeholder="name@zibano.demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon-left" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input has-icon-left has-icon-right"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="checkbox-wrapper" onClick={() => setRememberMe(!rememberMe)}>
                <div className={`checkbox ${rememberMe ? 'checked' : ''}`}>
                  {rememberMe && <Check size={12} color="white" />}
                </div>
                <span className="checkbox-label">Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="login-demo">
            <span className="login-demo-label">Demo credentials</span>
            <div className="login-demo-buttons">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.label}
                  type="button"
                  className="login-demo-btn"
                  onClick={() => fillCredentials(cred)}
                >
                  <span className="login-demo-role">{cred.role}</span>
                  <span className="login-demo-email">{cred.email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="login-footer-text">Demo environment · v1.0</p>
        </div>
      </div>

      {/* Right Panel — Brand Visual */}
      <div className="login-right">
        <div className="login-right-overlay">
          <div className="login-brand-content">
            <div className="login-brand-logo-card">
              <img src={zibanoLogo} alt="Zibano Coffee" className="login-brand-logo-img" />
            </div>
            <div className="login-brand-badge">EST. 2020</div>
            <h2 className="login-brand-title">Zibano Coffee<br /><span style={{ fontSize: '0.6em', opacity: 0.85, fontWeight: 600 }}>ዝባኖ ቡና</span></h2>
            <p className="login-brand-tagline">Good coffee. Good moments.</p>
            <div className="login-brand-divider" />
            <p className="login-brand-subtitle">Premium café management system</p>
          </div>

          {/* Decorative elements */}
          <div className="login-decor login-decor-1" />
          <div className="login-decor login-decor-2" />
          <div className="login-decor login-decor-3" />
        </div>
      </div>
    </div>
  );
}
