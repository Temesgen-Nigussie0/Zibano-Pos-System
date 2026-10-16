import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';
import './LanguageToggle.css';

interface LanguageToggleProps {
  compact?: boolean;
  className?: string;
}

export default function LanguageToggle({ compact = false, className = '' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`lang-toggle-btn ${compact ? 'compact' : ''} ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <span className="lang-toggle-icon" title={language === 'en' ? 'Language: English' : 'ቋንቋ፡ አማርኛ'}>
        <Globe size={compact ? 13 : 15} />
      </span>

      <div className="lang-toggle-options">
        <button
          type="button"
          className={`lang-pill ${language === 'en' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setLanguage('en');
          }}
          title="Switch to English"
        >
          EN
        </button>

        <button
          type="button"
          className={`lang-pill ${language === 'am' ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setLanguage('am');
          }}
          title="ቀይር ወደ አማርኛ"
        >
          አማ
        </button>
      </div>
    </div>
  );
}
