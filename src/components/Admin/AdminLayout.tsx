import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Home, 
  Camera, 
  FileText, 
  Settings, 
  Users, 
  MessageSquare, 
  LogOut,
  Globe,
  Palette
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navigation = [
    { name: 'לוח בקרה', href: '/admin', icon: Home },
    { name: 'ספריית מדיה', href: '/admin/media', icon: Camera },
    { name: 'עורך גלריות', href: '/admin/galleries', icon: Camera },
    { name: 'ניהול תוכן', href: '/admin/content', icon: FileText },
    { name: 'עיצוב', href: '/admin/design', icon: Palette },
    { name: 'בלוג', href: '/admin/blog', icon: FileText },
    { name: 'פניות', href: '/admin/contacts', icon: MessageSquare },
    { name: 'הגדרות אימייל', href: '/admin/email', icon: MessageSquare },
    { name: 'הגדרות', href: '/admin/settings', icon: Settings },
    { name: 'משתמשים', href: '/admin/users', icon: Users },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          exit={{ x: -300 }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 lg:translate-x-0 lg:static lg:inset-0"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">פאנל ניהול</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 flex-1">
            <div className="px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-rose-50 text-rose-700 border-r-2 border-rose-500'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon
                      className={`ml-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User info and logout */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse mb-4">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                <span className="text-rose-600 font-medium text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <LogOut className="ml-2 h-4 w-4" />
              יציאה
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main content */}
      <div className="lg:mr-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Link
                to="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                צפייה באתר
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('he-IL')}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;