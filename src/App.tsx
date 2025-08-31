import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import MediaLibrary from './components/Admin/MediaLibrary';
import ContentEditor from './components/Admin/ContentEditor';
import DesignCustomizer from './components/Admin/DesignCustomizer';
import ContactManager from './components/Admin/ContactManager';
import BlogManager from './components/Admin/BlogManager';
import AnalyticsSettings from './components/Admin/AnalyticsSettings';
import GalleryEditor from './components/Admin/GalleryEditor';
import EmailSettings from './components/Admin/EmailSettings';

// Pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="galleries" element={<GalleryEditor />} />
                <Route path="content" element={<ContentEditor />} />
                <Route path="design" element={<DesignCustomizer />} />
                <Route path="blog" element={<BlogManager />} />
                <Route path="contacts" element={<ContactManager />} />
                <Route path="email" element={<EmailSettings />} />
                <Route path="settings" element={<AnalyticsSettings />} />
                <Route path="users" element={<div className="p-6">ניהול משתמשים - בפיתוח</div>} />
              </Route>
            </Routes>
          </Router>
        </LanguageProvider>
      </ContentProvider>
    </AuthProvider>
  );
}

export default App;