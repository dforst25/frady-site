import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, Globe, Type, Image as ImageIcon } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import { useLanguage } from '../../contexts/LanguageContext';
import toast from 'react-hot-toast';

const ContentEditor: React.FC = () => {
  const { content, updateContent, mediaLibrary } = useContent();
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');
  const [activeLanguage, setActiveLanguage] = useState<'he' | 'en'>('he');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const sections = [
    { key: 'hero', label: 'דף הבית - Hero', icon: ImageIcon },
    { key: 'navigation', label: 'תפריט ניווט', icon: Type },
    { key: 'about', label: 'דף אודות', icon: Type },
    { key: 'contact', label: 'פרטי יצירת קשר', icon: Type },
    { key: 'seo', label: 'SEO ומטא תגים', icon: Globe },
  ];

  const handleContentChange = (section: string, field: string, value: any) => {
    updateContent(`${section}.${field}`, value);
    setUnsavedChanges(true);
  };

  const handleBilingualChange = (section: string, field: string, lang: 'he' | 'en', value: string) => {
    const currentValue = content[section as keyof typeof content][field as any] || { he: '', en: '' };
    const newValue = { ...currentValue, [lang]: value };
    updateContent(`${section}.${field}`, newValue);
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    setUnsavedChanges(false);
    toast.success('השינויים נשמרו בהצלחה');
  };

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">עריכת דף הבית</h3>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">כותרת ראשית</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <input
              type="text"
              value={content.hero.title.he}
              onChange={(e) => handleBilingualChange('hero', 'title', 'he', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="כותרת בעברית..."
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input
              type="text"
              value={content.hero.title.en}
              onChange={(e) => handleBilingualChange('hero', 'title', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Title in English..."
            />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">כותרת משנה</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <textarea
              value={content.hero.subtitle.he}
              onChange={(e) => handleBilingualChange('hero', 'subtitle', 'he', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="כותרת משנה בעברית..."
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <textarea
              value={content.hero.subtitle.en}
              onChange={(e) => handleBilingualChange('hero', 'subtitle', 'en', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Subtitle in English..."
            />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">טקסט כפתור קריאה לפעולה</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <input
              type="text"
              value={content.hero.cta.he}
              onChange={(e) => handleBilingualChange('hero', 'cta', 'he', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="טקסט כפתור בעברית..."
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input
              type="text"
              value={content.hero.cta.en}
              onChange={(e) => handleBilingualChange('hero', 'cta', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Button text in English..."
            />
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תמונת רקע</label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img
            src={content.hero.backgroundImage}
            alt="Background"
            className="w-20 h-20 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <input
              type="url"
              value={content.hero.backgroundImage}
              onChange={(e) => handleContentChange('hero', 'backgroundImage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="URL של תמונת הרקע..."
            />
            <p className="text-xs text-gray-500 mt-1">או בחר מספריית המדיה</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNavigationEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">עריכת תפריט הניווט</h3>
      
      {Object.entries(content.navigation).map(([key, value]) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
            {key === 'home' ? 'בית' : key === 'gallery' ? 'גלריה' : key === 'about' ? 'אודות' : key === 'contact' ? 'צור קשר' : key}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">עברית</label>
              <input
                type="text"
                value={value.he}
                onChange={(e) => handleBilingualChange('navigation', key, 'he', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">English</label>
              <input
                type="text"
                value={value.en}
                onChange={(e) => handleBilingualChange('navigation', key, 'en', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAboutEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">עריכת דף אודות</h3>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">כותרת הדף</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <input
              type="text"
              value={content.about.title.he}
              onChange={(e) => handleBilingualChange('about', 'title', 'he', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input
              type="text"
              value={content.about.title.en}
              onChange={(e) => handleBilingualChange('about', 'title', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תוכן הדף</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <textarea
              value={content.about.content.he}
              onChange={(e) => handleBilingualChange('about', 'content', 'he', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <textarea
              value={content.about.content.en}
              onChange={(e) => handleBilingualChange('about', 'content', 'en', e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תמונה אישית</label>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <img
            src={content.about.image}
            alt="About"
            className="w-20 h-20 object-cover rounded-lg border"
          />
          <div className="flex-1">
            <input
              type="url"
              value={content.about.image}
              onChange={(e) => handleContentChange('about', 'image', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="URL של התמונה האישית..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">עריכת פרטי יצירת קשר</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
          <input
            type="tel"
            value={content.contact.phone}
            onChange={(e) => handleContentChange('contact', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
          <input
            type="email"
            value={content.contact.email}
            onChange={(e) => handleContentChange('contact', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
          <input
            type="tel"
            value={content.contact.whatsapp}
            onChange={(e) => handleContentChange('contact', 'whatsapp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="+972501234567"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <input
              type="text"
              value={content.contact.address.he}
              onChange={(e) => handleBilingualChange('contact', 'address', 'he', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input
              type="text"
              value={content.contact.address.en}
              onChange={(e) => handleBilingualChange('contact', 'address', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-4">רשתות חברתיות</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input
              type="url"
              value={content.contact.socialMedia.instagram}
              onChange={(e) => handleContentChange('contact', 'socialMedia.instagram', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="https://instagram.com/username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input
              type="url"
              value={content.contact.socialMedia.facebook}
              onChange={(e) => handleContentChange('contact', 'socialMedia.facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="https://facebook.com/page"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSEOEditor = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">הגדרות SEO</h3>
      
      {/* Site Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">שם האתר</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <input
              type="text"
              value={content.seo.siteName.he}
              onChange={(e) => handleBilingualChange('seo', 'siteName', 'he', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input
              type="text"
              value={content.seo.siteName.en}
              onChange={(e) => handleBilingualChange('seo', 'siteName', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תיאור האתר</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <textarea
              value={content.seo.description.he}
              onChange={(e) => handleBilingualChange('seo', 'description', 'he', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <textarea
              value={content.seo.description.en}
              onChange={(e) => handleBilingualChange('seo', 'description', 'en', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">מילות מפתח</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">עברית</label>
            <input
              type="text"
              value={content.seo.keywords.he}
              onChange={(e) => handleBilingualChange('seo', 'keywords', 'he', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="מילות מפתח מופרדות בפסיקים"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input
              type="text"
              value={content.seo.keywords.en}
              onChange={(e) => handleBilingualChange('seo', 'keywords', 'en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Keywords separated by commas"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'hero':
        return renderHeroEditor();
      case 'navigation':
        return renderNavigationEditor();
      case 'about':
        return renderAboutEditor();
      case 'contact':
        return renderContactEditor();
      case 'seo':
        return renderSEOEditor();
      default:
        return <div>בחר קטגוריה לעריכה</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">עורך תוכן</h1>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => window.open('/', '_blank')}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            <Eye className="w-4 h-4" />
            <span>תצוגה מקדימה</span>
          </button>
          <button
            onClick={handleSave}
            disabled={!unsavedChanges}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span>שמור שינויים</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">קטגוריות</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key)}
                  className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-2 text-sm rounded-md transition-colors ${
                    activeSection === section.key
                      ? 'bg-rose-50 text-rose-700 border-r-2 border-rose-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;