import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Settings, Save, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const AnalyticsSettings: React.FC = () => {
  const { content, updateContent } = useContent();
  const [settings, setSettings] = useState({
    googleAnalytics: content.analytics.googleAnalytics,
    metaPixel: content.analytics.metaPixel,
    maintenance: content.maintenance
  });

  const handleSave = () => {
    updateContent('analytics', {
      googleAnalytics: settings.googleAnalytics,
      metaPixel: settings.metaPixel
    });
    updateContent('maintenance', settings.maintenance);
    toast.success('ההגדרות נשמרו בהצלחה');
  };

  const handleMaintenanceToggle = () => {
    setSettings(prev => ({
      ...prev,
      maintenance: {
        ...prev.maintenance,
        enabled: !prev.maintenance.enabled
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">הגדרות מתקדמות</h1>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
        >
          <Save className="w-4 h-4" />
          <span>שמור הגדרות</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">כלי אנליטיקה</h2>
          </div>

          <div className="space-y-6">
            {/* Google Analytics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID
              </label>
              <input
                type="text"
                value={settings.googleAnalytics}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  googleAnalytics: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="G-XXXXXXXXXX או UA-XXXXXXXX-X"
              />
              <p className="text-xs text-gray-500 mt-1">
                הזן את מזהה Google Analytics שלך לעקוב אחר תנועה באתר
              </p>
            </div>

            {/* Meta Pixel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Pixel ID (Facebook)
              </label>
              <input
                type="text"
                value={settings.metaPixel}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  metaPixel: e.target.value
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="123456789012345"
              />
              <p className="text-xs text-gray-500 mt-1">
                הזן את מזהה Meta Pixel לעקוב אחר המרות ופרסום ממוקד
              </p>
            </div>

            {/* Analytics Preview */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">סטטוס כלי האנליטיקה</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Google Analytics</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    settings.googleAnalytics 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {settings.googleAnalytics ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meta Pixel</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    settings.metaPixel 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {settings.metaPixel ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <Settings className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">מצב תחזוקה</h2>
          </div>

          <div className="space-y-6">
            {/* Maintenance Toggle */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">מצב תחזוקה</h3>
                  <p className="text-xs text-yellow-600">
                    הפעל כדי להציג הודעת תחזוקה למבקרים
                  </p>
                </div>
              </div>
              <button
                onClick={handleMaintenanceToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenance.enabled ? 'bg-yellow-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenance.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Maintenance Messages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                הודעת תחזוקה
              </label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">עברית</label>
                  <textarea
                    value={settings.maintenance.message.he}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maintenance: {
                        ...prev.maintenance,
                        message: {
                          ...prev.maintenance.message,
                          he: e.target.value
                        }
                      }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="הודעת תחזוקה בעברית..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">English</label>
                  <textarea
                    value={settings.maintenance.message.en}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      maintenance: {
                        ...prev.maintenance,
                        message: {
                          ...prev.maintenance.message,
                          en: e.target.value
                        }
                      }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Maintenance message in English..."
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Preview */}
            {settings.maintenance.enabled && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                  <EyeOff className="w-4 h-4 text-red-600" />
                  <h4 className="text-sm font-medium text-red-800">האתר במצב תחזוקה</h4>
                </div>
                <p className="text-sm text-red-700">
                  מבקרים יראו את הודעת התחזוקה במקום האתר הרגיל
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">הגדרות נוספות</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SEO Settings */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">הגדרות SEO</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Sitemap XML</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  פעיל
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Robots.txt</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  פעיל
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Open Graph</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  פעיל
                </span>
              </div>
            </div>
          </div>

          {/* Performance Settings */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">ביצועים</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">דחיסת תמונות</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  פעיל
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Lazy Loading</span>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  פעיל
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">CDN</span>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  לא זמין
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSettings;