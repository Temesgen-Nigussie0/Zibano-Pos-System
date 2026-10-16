import React, { useState, useEffect } from 'react';
import { Menu as MenuIcon, Coffee } from 'lucide-react';
import { toggleMobileSidebar } from './Sidebar';
import { getCurrentDate, getCurrentTime } from '../../utils/formatters';
import LanguageToggle from '../common/LanguageToggle';
import { useLanguage } from '../../contexts/LanguageContext';
import './OwnerNavbar.css';

interface OwnerNavbarProps {
  title?: string;
}

export default function OwnerNavbar({ title }: OwnerNavbarProps) {
  const { language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(getCurrentTime()), 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="owner-navbar">
      <div className="owner-navbar-left">
        <button
          type="button"
          className="btn btn-icon btn-ghost show-mobile-only"
          onClick={toggleMobileSidebar}
          aria-label="Open menu"
        >
          <MenuIcon size={20} />
        </button>
        <div className="owner-navbar-brand">
          <Coffee size={18} className="owner-navbar-brand-icon" />
          <span className="owner-navbar-brand-title">
            {language === 'am' ? 'ዝባኖ ቡና' : 'Zibano Coffee'}
          </span>
          {title && <span className="owner-navbar-breadcrumb">/ {title}</span>}
        </div>
      </div>

      <div className="owner-navbar-right">
        <span className="owner-navbar-date hide-mobile">{getCurrentDate()}</span>
        <span className="owner-navbar-time hide-mobile">{currentTime}</span>
        <LanguageToggle />
      </div>
    </header>
  );
}
