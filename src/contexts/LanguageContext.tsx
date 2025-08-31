import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'he' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  he: {
    // Navigation
    'nav.home': 'בית',
    'nav.gallery': 'גלריה',
    'nav.about': 'אודות',
    'nav.blog': 'בלוג',
    'nav.contact': 'צור קשר',
    'nav.admin': 'ניהול',
    
    // Home Page
    'home.hero.title': 'צילומי ילדים ומשפחה מקצועיים',
    'home.hero.subtitle': 'מתמחה בצילומי חלאקה, משפחה וילדים - רגעים יקרים שנשמרים לנצח',
    'home.hero.cta': 'צרו קשר לתיאום צילום',
    'home.about.title': 'צילום באהבה ובמקצועיות',
    'home.about.text': 'עם ניסיון של מעל 10 שנים בצילום ילדים ומשפחות, אני מתמחה ביצירת זכרונות יפים ומשמעותיים. כל צילום הוא סיפור ייחודי המתועד באופן טבעי ורגיש.',
    
    // Gallery
    'gallery.title': 'הגלריה שלי',
    'gallery.chalaka': 'חלאקה',
    'gallery.family': 'משפחה',
    'gallery.newborn': 'ילודים',
    'gallery.smash': 'סמאש קייק',
    
    // About
    'about.title': 'אודותיי',
    'about.text': 'שמי [שם הצלמת] ואני צלמת מקצועית המתמחה בצילומי ילדים ומשפחות. האמונה שלי היא שכל ילד ומשפחה ייחודיים, ותפקידי להעביר את הקסם הזה דרך העדשה.',
    
    // Contact
    'contact.title': 'צרו קשר',
    'contact.name': 'שם מלא',
    'contact.email': 'דואר אלקטרוני',
    'contact.phone': 'טלפון',
    'contact.message': 'הודעה',
    'contact.send': 'שלח הודעה',
    'contact.info.title': 'פרטי התקשרות',
    'contact.info.phone': 'טלפון: 050-123-4567',
    'contact.info.email': 'אימייל: info@photography.co.il',
    'contact.info.location': 'מיקום: תל אביב והמרכז',
    
    // Admin
    'admin.login.title': 'כניסה לפאנל ניהול',
    'admin.login.email': 'אימייל',
    'admin.login.password': 'סיסמה',
    'admin.login.submit': 'התחבר',
    'admin.dashboard.title': 'לוח בקרה',
    'admin.galleries': 'ניהול גלריות',
    'admin.content': 'ניהול תוכן',
    'admin.translations': 'תרגומים',
    'admin.settings': 'הגדרות',
    
    // Footer
    'footer.copyright': '© 2024 כל הזכויות שמורות',
    'footer.follow': 'עקבו אחריי',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    
    // Home Page
    'home.hero.title': 'Professional Children & Family Photography',
    'home.hero.subtitle': 'Specializing in Chalaka, family and children photography - precious moments preserved forever',
    'home.hero.cta': 'Contact for Photo Session',
    'home.about.title': 'Photography with Love and Professionalism',
    'home.about.text': 'With over 10 years of experience in children and family photography, I specialize in creating beautiful and meaningful memories. Every shoot is a unique story documented naturally and sensitively.',
    
    // Gallery
    'gallery.title': 'My Gallery',
    'gallery.chalaka': 'Chalaka',
    'gallery.family': 'Family',
    'gallery.newborn': 'Newborn',
    'gallery.smash': 'Smash Cake',
    
    // About
    'about.title': 'About Me',
    'about.text': 'My name is [Photographer Name] and I am a professional photographer specializing in children and family photography. My belief is that every child and family is unique, and my job is to capture that magic through the lens.',
    
    // Contact
    'contact.title': 'Contact Me',
    'contact.name': 'Full Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.info.title': 'Contact Information',
    'contact.info.phone': 'Phone: 050-123-4567',
    'contact.info.email': 'Email: info@photography.co.il',
    'contact.info.location': 'Location: Tel Aviv & Center',
    
    // Admin
    'admin.login.title': 'Admin Panel Login',
    'admin.login.email': 'Email',
    'admin.login.password': 'Password',
    'admin.login.submit': 'Login',
    'admin.dashboard.title': 'Dashboard',
    'admin.galleries': 'Manage Galleries',
    'admin.content': 'Content Management',
    'admin.translations': 'Translations',
    'admin.settings': 'Settings',
    
    // Footer
    'footer.copyright': '© 2024 All rights reserved',
    'footer.follow': 'Follow Me',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('he');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['he', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const isRTL = language === 'he';

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};