import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Settings, Save, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const EmailSettings: React.FC = () => {
  const { content, updateContent, sendTestEmail, emailLogs } = useContent();
  const [settings, setSettings] = useState(content.emailSettings);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const handleSave = async () => {
    await updateContent('emailSettings', settings);
    toast.success('הגדרות האימייל נשמרו בהצלחה');
  };

  const handleTestEmail = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const success = await sendTestEmail();
      setTestResult(success ? 'success' : 'failed');
      
      if (success) {
        toast.success('אימייל הבדיקה נשלח בהצלחה!');
      } else {
        toast.error('שליחת אימייל הבדיקה נכשלה');
      }
    } catch (error) {
      setTestResult('failed');
      toast.error('שגיאה בשליחת אימייל הבדיקה');
    } finally {
      setIsTesting(false);
    }
  };

  const recentLogs = emailLogs.slice(0, 10);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">הגדרות אימייל</h1>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
        >
          <Save className="w-4 h-4" />
          <span>שמור הגדרות</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMTP Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
            <Settings className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold">הגדרות SMTP</h2>
          </div>

          <div className="space-y-4">
            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">הפעל שליחת אימיילים</h3>
                <p className="text-xs text-gray-500">כאשר מופעל, הטופס ישלח אימיילים אוטומטית</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.enabled ? 'bg-rose-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* SMTP Host */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שרת SMTP</label>
              <input
                type="text"
                value={settings.smtpHost}
                onChange={(e) => setSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="smtp.gmail.com"
              />
            </div>

            {/* SMTP Port */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">פורט</label>
              <input
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="587"
              />
            </div>

            {/* SMTP User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם משתמש</label>
              <input
                type="email"
                value={settings.smtpUser}
                onChange={(e) => setSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="your-email@gmail.com"
              />
            </div>

            {/* SMTP Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה</label>
              <input
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="••••••••••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">
                עבור Gmail, השתמש ב-App Password במקום הסיסמה הרגילה
              </p>
            </div>

            {/* From Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת שולח</label>
              <input
                type="email"
                value={settings.fromEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="noreply@photography.co.il"
              />
            </div>

            {/* To Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת יעד</label>
              <input
                type="email"
                value={settings.toEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, toEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                placeholder="admin@photography.co.il"
              />
              <p className="text-xs text-gray-500 mt-1">
                כתובת האימייל שתקבל את הפניות מהטופס
              </p>
            </div>
          </div>
        </div>

        {/* Test & Status */}
        <div className="space-y-6">
          {/* Test Email */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Send className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold">בדיקת אימייל</h2>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">
                שלח אימייל בדיקה כדי לוודא שההגדרות פועלות כראוי
              </p>

              <button
                onClick={handleTestEmail}
                disabled={isTesting || !settings.enabled}
                className="w-full flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
              >
                {isTesting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>שולח...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>שלח אימייל בדיקה</span>
                  </>
                )}
              </button>

              {testResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg flex items-center space-x-2 rtl:space-x-reverse ${
                    testResult === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {testResult === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>
                    {testResult === 'success' 
                      ? 'אימייל הבדיקה נשלח בהצלחה!' 
                      : 'שליחת אימייל הבדיקה נכשלה. בדוק את ההגדרות.'
                    }
                  </span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Email Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <Mail className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold">סטטוס מערכת</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">מערכת אימייל</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  settings.enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {settings.enabled ? 'פעיל' : 'לא פעיל'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">הגדרות SMTP</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  settings.smtpHost && settings.smtpUser && settings.smtpPassword
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {settings.smtpHost && settings.smtpUser && settings.smtpPassword ? 'מוגדר' : 'לא מוגדר'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">כתובת יעד</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  settings.toEmail
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {settings.toEmail ? 'מוגדר' : 'לא מוגדר'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Logs */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">יומן אימיילים</h2>
        
        {recentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">נמען</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">נושא</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">סוג</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(log.timestamp).toLocaleString('he-IL')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{log.to}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{log.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {log.type === 'contact' ? 'פנייה' : 'בדיקה'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        log.status === 'success' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status === 'success' ? 'הצליח' : 'נכשל'}
                      </span>
                      {log.error && (
                        <p className="text-xs text-red-600 mt-1">{log.error}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">אין יומן אימיילים עדיין</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSettings;