import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'am';

export interface Translations {
  [key: string]: {
    en: string;
    am: string;
  };
}

export const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', am: 'ዳሽቦርድ' },
  'nav.sales': { en: 'Sales', am: 'ሽያጭ' },
  'nav.pos': { en: 'POS', am: 'መሸጫ (POS)' },
  'nav.products': { en: 'Products', am: 'ምርቶች' },
  'nav.categories': { en: 'Categories', am: 'ምድቦች' },
  'nav.waiters': { en: 'Waiters', am: 'አስተናጋጆች' },
  'nav.settings': { en: 'Settings', am: 'ቅንብሮች' },
  'nav.history': { en: 'Sales History', am: 'የሽያጭ ታሪክ' },
  'nav.logout': { en: 'Log Out', am: 'ውጣ' },
  'nav.owner': { en: 'Owner', am: 'ባለቤት' },
  'nav.cashier': { en: 'Cashier', am: 'ገንዘብ ተቀባይ' },

  // POS Interface
  'pos.search': { en: 'Search products...', am: 'ምርቶችን ፈልግ...' },
  'pos.currentOrder': { en: 'Current Order', am: 'የአሁኑ ትዕዛዝ' },
  'pos.items': { en: 'items', am: 'እቃዎች' },
  'pos.item': { en: 'item', am: 'እቃ' },
  'pos.clear': { en: 'Clear', am: 'አፅዳ' },
  'pos.dineIn': { en: 'Dine In', am: 'እዚህ የሚበላ' },
  'pos.takeAway': { en: 'Take Away', am: 'ይዞ መሄድ' },
  'pos.waiter': { en: 'Waiter', am: 'አስተናጋጅ' },
  'pos.subtotal': { en: 'Subtotal', am: 'ንዑስ ድምር' },
  'pos.vat': { en: 'VAT (15%)', am: 'ተ.እ.ታ (15%)' },
  'pos.total': { en: 'Total', am: 'ጠቅላላ ድምር' },
  'pos.paymentMethod': { en: 'Payment Method', am: 'የመክፈያ ዘዴ' },
  'pos.cash': { en: 'Cash', am: 'ጥሬ ገንዘብ' },
  'pos.telebirr': { en: 'Telebirr', am: 'ቴሌብር' },
  'pos.cbe': { en: 'CBE', am: 'ንግድ ባንክ' },
  'pos.other': { en: 'Other', am: 'ሌላ' },
  'pos.completeSale': { en: 'Complete Sale', am: 'ሽያጩን አጠናቅቅ' },
  'pos.noItems': { en: 'No items yet', am: 'እስካሁን ምንም እቃ አልተመረጠም' },
  'pos.noItemsSub': { en: 'Select a product to start an order.', am: 'ትዕዛዝ ለመጀመር ከምርቶቹ ይምረጡ።' },
  'pos.unavailable': { en: 'Unavailable', am: 'አልቋል' },
  'pos.active': { en: 'Active', am: 'ንቁ' },

  // Categories
  'cat.popular': { en: 'Popular', am: 'ተወዳጅ' },
  'cat.breakfast': { en: 'Breakfast', am: 'ቁርስ' },
  'cat.wraps': { en: 'Wraps & Sandwiches', am: 'ጥቅልሎች እና ሳንድዊች' },
  'cat.ethiopian': { en: 'Ethiopian Dish', am: 'የሀበሻ ምግብ' },
  'cat.pasta': { en: 'Pasta', am: 'ፓስታ' },
  'cat.snacks': { en: 'Snacks', am: 'መክሰስ' },
  'cat.coldDrinks': { en: 'Cold Drinks', am: 'ቀዝቃዛ መጠጦች' },
  'cat.juice': { en: 'Juice', am: 'ጭማቂ' },
  'cat.hotDrinks': { en: 'Hot Drinks', am: 'ትኩስ መጠጦች' },
  'cat.cakes': { en: 'Cakes', am: 'ኬኮች' },

  // Dashboard & Common
  'dash.totalSales': { en: 'Total Sales', am: 'ጠቅላላ ሽያጭ' },
  'dash.orders': { en: 'Orders', am: 'ትዕዛዞች' },
  'dash.topSelling': { en: 'Top Selling Item', am: 'በብዛት የተሸጠ ምርት' },
  'dash.itemsServed': { en: 'Items Served', am: 'የተሸጡ እቃዎች' },
  'dash.today': { en: 'Today', am: 'ዛሬ' },
  'dash.yesterday': { en: 'Yesterday', am: 'ትናንት' },
  'dash.week': { en: 'This Week', am: 'በዚህ ሳምንት' },
  'dash.month': { en: 'This Month', am: 'በዚህ ወር' },
  'dash.overview': { en: 'Overview of your café performance', am: 'የካፌዎ የስራ አፈፃፀም አጠቃላይ እይታ' },
  'common.cancel': { en: 'Cancel', am: 'ሰርዝ' },
  'nav.logoutConfirmTitle': { en: 'Log Out of Zibano?', am: 'ከዝባኖ መውጣት ይፈልጋሉ?' },
  'nav.logoutConfirmText': { en: 'Are you sure you want to log out? You will need to enter your credentials to log back in.', am: 'እርግጠኛ ነዎት መውጣት ይፈልጋሉ? መልሰው ለመግባት መለያዎን ማስገባት ያስፈልግዎታል።' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('zibano_language');
    return saved === 'am' ? 'am' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('zibano_language', lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'am' : 'en';
    setLanguage(next);
  };

  const t = (key: string, fallback?: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return fallback || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
