import React from 'react';
import { Camera, Instagram, Facebook, Heart } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Camera className="h-8 w-8 text-rose-400" />
              <span className="text-xl font-bold">Photography Studio</span>
            </div>
            <p className="text-gray-400 text-center md:text-start">
              צילומי ילדים ומשפחה מקצועיים עם אהבה ותשומת לב לפרטים הקטנים
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-start">
            <h3 className="text-lg font-semibold mb-4">{t('contact.info.title')}</h3>
            <div className="space-y-2 text-gray-400">
              <p>{t('contact.info.phone')}</p>
              <p>{t('contact.info.email')}</p>
              <p>{t('contact.info.location')}</p>
            </div>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-start">
            <h3 className="text-lg font-semibold mb-4">{t('footer.follow')}</h3>
            <div className="flex justify-center md:justify-start space-x-4 rtl:space-x-reverse">
              <a
                href="#"
                className="text-gray-400 hover:text-rose-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-rose-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-1 rtl:space-x-reverse">
            <span>{t('footer.copyright')}</span>
            <Heart className="h-4 w-4 text-rose-400 mx-1" />
            <span>Made with love</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;