import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../locales/en.json';
import es from '../locales/es.json';

type Locale = 'en' | 'es';
type Translations = typeof en;

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: Translations;
}

const translations: Record<Locale, Translations> = { en, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Locale) || 'en';
    }
    return 'en';
  });

  const t = translations[language];

  const setLanguage = (lang: Locale) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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