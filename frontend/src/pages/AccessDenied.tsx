import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldX, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleReturn = () => {
    navigate(role === 'owner' ? '/owner/dashboard' : '/pos', { replace: true });
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--surface-secondary)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <div className="empty-state-icon" style={{ margin: '0 auto var(--space-5)', background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
          <ShieldX size={28} />
        </div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-2)' }}>Access restricted</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
          You don't have permission to view this page.
        </p>
        <button className="btn btn-primary" onClick={handleReturn}>
          <ArrowLeft size={16} />
          {role === 'owner' ? 'Return to Dashboard' : 'Return to POS'}
        </button>
      </div>
    </div>
  );
}
