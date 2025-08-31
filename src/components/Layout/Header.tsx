import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Camera, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const location = useLocation();

  const navigation = [
    { key: 'home', href: '/' },
    { key: 'gallery', href: '/gallery' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <Camera className="h-8 w-8 text-rose-500" />
            <span className="text-xl font-bold text-gray-900">
              Photography Studio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-rose-500 ${
                  location.pathname === item.href
                    ? 'text-rose-500'
                    : 'text-gray-700'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'he' ? 'EN' : 'עב'}
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {navigation.map((item) => (
                  <Link
                    key={item.key}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-rose-500 bg-rose-50'
                        : 'text-gray-700 hover:text-rose-500 hover:bg-gray-50'
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;