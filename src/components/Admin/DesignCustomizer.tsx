import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Layout, Eye, Save, RotateCcw } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const DesignCustomizer: React.FC = () => {
  const { content, applyDesignChanges } = useContent();
  const [designSettings, setDesignSettings] = useState(content.design);
  const [previewMode, setPreviewMode] = useState(false);

  const colorPresets = [
    {
      name: 'Rose Classic',
      colors: {
        primary: '#e11d48',
        secondary: '#f43f5e',
        accent: '#fb7185',
        background: '#ffffff',
        text: '#111827'
      }
    },
    {
      name: 'Warm Sunset',
      colors: {
        primary: '#ea580c',
        secondary: '#fb923c',
        accent: '#fbbf24',
        background: '#fffbeb',
        text: '#1f2937'
      }
    },
    {
      name: 'Ocean Blue',
      colors: {
        primary: '#0ea5e9',
        secondary: '#38bdf8',
        accent: '#7dd3fc',
        background: '#f0f9ff',
        text: '#0f172a'
      }
    },
    {
      name: 'Forest Green',
      colors: {
        primary: '#059669',
        secondary: '#10b981',
        accent: '#34d399',
        background: '#f0fdf4',
        text: '#1f2937'
      }
    }
  ];

  const fontOptions = {
    hebrew: [
      { name: 'Heebo', value: 'Heebo' },
      { name: 'Assistant', value: 'Assistant' },
      { name: 'Rubik', value: 'Rubik' },
      { name: 'Alef', value: 'Alef' }
    ],
    english: [
      { name: 'Inter', value: 'Inter' },
      { name: 'Poppins', value: 'Poppins' },
      { name: 'Roboto', value: 'Roboto' },
      { name: 'Open Sans', value: 'Open Sans' }
    ]
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setDesignSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleFontChange = (fontKey: string, value: string) => {
    setDesignSettings(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value
      }
    }));
  };

  const handleLayoutChange = (layoutKey: string, value: string) => {
    setDesignSettings(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [layoutKey]: value
      }
    }));
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setDesignSettings(prev => ({
      ...prev,
      colors: preset.colors
    }));
  };

  const handleSave = () => {
    applyDesignChanges(designSettings);
    toast.success('העיצוב נשמר בהצלחה');
  };

  const handleReset = () => {
    setDesignSettings(content.design);
    toast.info('השינויים בוטלו');
  };

  const handlePreview = () => {
    if (previewMode) {
      // Reset to saved design
      applyDesignChanges(content.design);
    } else {
      // Apply current settings for preview
      applyDesignChanges(designSettings);
    }
    setPreviewMode(!previewMode);
  };

  useEffect(() => {
    // Apply design changes in real-time for preview
    if (previewMode) {
      applyDesignChanges(designSettings);
    }
  }, [designSettings, previewMode]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">מותאם אישי עיצוב</h1>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={handlePreview}
            className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 rounded-lg border ${
              previewMode 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'text-gray-600 hover:text-gray-800 border-gray-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'יציאה מתצוגה מקדימה' : 'תצוגה מקדימה'}</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>איפוס</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span>שמור עיצוב</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Color Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <Palette className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">צבעים</h2>
          </div>

          {/* Color Presets */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">ערכות צבעים מוכנות</h3>
            <div className="grid grid-cols-2 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex space-x-1 rtl:space-x-reverse mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{preset.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Colors */}
          <div className="space-y-4">
            {Object.entries(designSettings.colors).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {key === 'primary' ? 'צבע ראשי' : 
                   key === 'secondary' ? 'צבע משני' : 
                   key === 'accent' ? 'צבע הדגשה' : 
                   key === 'background' ? 'רקע' : 'טקסט'}
                </label>
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <Type className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">טיפוגרפיה</h2>
          </div>

          <div className="space-y-4">
            {/* Hebrew Font */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">פונט עברית</label>
              <select
                value={designSettings.fonts.hebrew}
                onChange={(e) => handleFontChange('hebrew', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {fontOptions.hebrew.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* English Font */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">פונט אנגלית</label>
              <select
                value={designSettings.fonts.english}
                onChange={(e) => handleFontChange('english', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                {fontOptions.english.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Weights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">משקל כותרות</label>
              <select
                value={designSettings.fonts.headingWeight}
                onChange={(e) => handleFontChange('headingWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="400">רגיל (400)</option>
                <option value="500">בינוני (500)</option>
                <option value="600">מודגש (600)</option>
                <option value="700">מודגש מאוד (700)</option>
                <option value="800">כבד (800)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">משקל טקסט רגיל</label>
              <select
                value={designSettings.fonts.bodyWeight}
                onChange={(e) => handleFontChange('bodyWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="300">דק (300)</option>
                <option value="400">רגיל (400)</option>
                <option value="500">בינוני (500)</option>
              </select>
            </div>
          </div>

          {/* Font Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">תצוגה מקדימה</h4>
            <div 
              className="space-y-2"
              style={{ 
                fontFamily: designSettings.fonts.hebrew,
                fontWeight: designSettings.fonts.headingWeight 
              }}
            >
              <h3 className="text-lg">כותרת לדוגמה</h3>
              <p 
                className="text-sm"
                style={{ fontWeight: designSettings.fonts.bodyWeight }}
              >
                זהו טקסט לדוגמה להצגת הפונט שנבחר
              </p>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <Layout className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">פריסה</h2>
          </div>

          <div className="space-y-4">
            {/* Max Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">רוחב מקסימלי</label>
              <select
                value={designSettings.layout.maxWidth}
                onChange={(e) => handleLayoutChange('maxWidth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="1024px">1024px</option>
                <option value="1280px">1280px</option>
                <option value="1440px">1440px</option>
                <option value="1600px">1600px</option>
                <option value="100%">מלא</option>
              </select>
            </div>

            {/* Section Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ריווח בין קטעים</label>
              <select
                value={designSettings.layout.sectionPadding}
                onChange={(e) => handleLayoutChange('sectionPadding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="3rem">קטן (3rem)</option>
                <option value="4rem">בינוני (4rem)</option>
                <option value="5rem">גדול (5rem)</option>
                <option value="6rem">גדול מאוד (6rem)</option>
              </select>
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">תצוגה מקדימה</h4>
            <div 
              className="border rounded p-4 bg-white"
              style={{ 
                maxWidth: designSettings.layout.maxWidth === '100%' ? '100%' : designSettings.layout.maxWidth,
                padding: designSettings.layout.sectionPadding,
                backgroundColor: designSettings.colors.background,
                color: designSettings.colors.text
              }}
            >
              <h3 
                className="text-lg mb-2"
                style={{ 
                  color: designSettings.colors.primary,
                  fontFamily: designSettings.fonts.hebrew,
                  fontWeight: designSettings.fonts.headingWeight
                }}
              >
                כותרת לדוגמה
              </h3>
              <p 
                style={{ 
                  fontFamily: designSettings.fonts.hebrew,
                  fontWeight: designSettings.fonts.bodyWeight
                }}
              >
                זהו טקסט לדוגמה להצגת העיצוב החדש
              </p>
              <button 
                className="mt-2 px-4 py-2 rounded text-white text-sm"
                style={{ backgroundColor: designSettings.colors.primary }}
              >
                כפתור לדוגמה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignCustomizer;