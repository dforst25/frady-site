import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Camera, MessageSquare, TrendingUp, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'מבקרים החודש', value: '2,543', change: '+12%', color: 'bg-blue-500' },
    { icon: Camera, label: 'תמונות בגלריה', value: '156', change: '+8', color: 'bg-rose-500' },
    { icon: MessageSquare, label: 'פניות חדשות', value: '23', change: '+5', color: 'bg-green-500' },
    { icon: Calendar, label: 'צילומים השבוע', value: '8', change: '+2', color: 'bg-purple-500' },
  ];

  const recentActivities = [
    { type: 'contact', message: 'פנייה חדשה מ-שרה כהן לצילום חלאקה', time: 'לפני 2 שעות' },
    { type: 'gallery', message: 'הוספת 12 תמונות חדשות לגלריית משפחות', time: 'לפני 4 שעות' },
    { type: 'booking', message: 'אישור צילום עם משפחת לוי ל-15/12', time: 'לפני יום' },
    { type: 'review', message: 'המלצה חדשה (5 כוכבים) מ-דנה רוזן', time: 'לפני יומיים' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          שלום, {user?.name} 👋
        </h1>
        <p className="text-gray-600">
          מבט כללי על הפעילות באתר ובפאנל הניהול
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">פעילות אחרונה</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-gray-900 text-sm">{activity.message}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">פעולות מהירות</h2>
          <div className="space-y-4">
            <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium py-3 px-4 rounded-lg transition-colors text-right">
              הוספת תמונות חדשות לגלריה
            </button>
            <button className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-3 px-4 rounded-lg transition-colors text-right">
              כתיבת פוסט חדש בבלוג
            </button>
            <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 px-4 rounded-lg transition-colors text-right">
              עדכון פרטי יצירת קשר
            </button>
            <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-3 px-4 rounded-lg transition-colors text-right">
              צפייה בפניות ממתינות
            </button>
          </div>
        </motion.div>
      </div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">תנועה באתר - 30 יום אחרונים</h2>
          <BarChart3 className="w-6 h-6 text-gray-400" />
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p>גרף נתונים יתווסף בהמשך</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;