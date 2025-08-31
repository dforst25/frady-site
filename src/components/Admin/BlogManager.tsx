import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Eye, Calendar, Search, Filter, Save, X } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const BlogManager: React.FC = () => {
  const { blogPosts, saveBlogPost, updateBlogPost, deleteBlogPost } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const [formData, setFormData] = useState({
    title: { he: '', en: '' },
    content: { he: '', en: '' },
    excerpt: { he: '', en: '' },
    slug: { he: '', en: '' },
    featuredImage: '',
    publishedAt: new Date().toISOString().slice(0, 16),
    status: 'draft' as 'draft' | 'published',
    author: 'Admin'
  });

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.he.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.he.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || post.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const handleEdit = (post: any) => {
    setEditingPost(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      featuredImage: post.featuredImage,
      publishedAt: post.publishedAt.slice(0, 16),
      status: post.status,
      author: post.author
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!formData.title.he || !formData.title.en) {
      toast.error('נא למלא כותרת בשתי השפות');
      return;
    }

    const postData = {
      ...formData,
      publishedAt: new Date(formData.publishedAt).toISOString()
    };

    if (editingPost) {
      updateBlogPost(editingPost, postData);
      toast.success('הפוסט עודכן בהצלחה');
    } else {
      saveBlogPost(postData);
      toast.success('הפוסט נשמר בהצלחה');
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingPost(null);
    setFormData({
      title: { he: '', en: '' },
      content: { he: '', en: '' },
      excerpt: { he: '', en: '' },
      slug: { he: '', en: '' },
      featuredImage: '',
      publishedAt: new Date().toISOString().slice(0, 16),
      status: 'draft',
      author: 'Admin'
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
      deleteBlogPost(id);
      toast.success('הפוסט נמחק בהצלחה');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ניהול בלוג</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>פוסט חדש</span>
        </button>
      </div>

      {!isEditing ? (
        <>
          {/* Filters */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="חיפוש פוסטים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">כל הפוסטים</option>
              <option value="published">פורסמו</option>
              <option value="draft">טיוטות</option>
            </select>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title.he}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? 'פורסם' : 'טיוטה'}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 ml-1" />
                        {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {post.title.he}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt.he}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        מאת: {post.author}
                      </span>
                      
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => handleEdit(post)}
                          className="text-blue-600 hover:text-blue-800"
                          title="עריכה"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600 hover:text-red-800"
                          title="מחיקה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Edit3 className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500">אין פוסטים להצגה</p>
            </div>
          )}
        </>
      ) : (
        /* Post Editor */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {editingPost ? 'עריכת פוסט' : 'פוסט חדש'}
            </h2>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                ביטול
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg"
              >
                <Save className="w-4 h-4" />
                <span>שמור</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כותרת</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">עברית</label>
                  <input
                    type="text"
                    value={formData.title.he}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title: { ...prev.title, he: value },
                        slug: { ...prev.slug, he: generateSlug(value) }
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="כותרת בעברית..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">English</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        title: { ...prev.title, en: value },
                        slug: { ...prev.slug, en: generateSlug(value) }
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Title in English..."
                  />
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תקציר</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">עברית</label>
                  <textarea
                    value={formData.excerpt.he}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      excerpt: { ...prev.excerpt, he: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="תקציר בעברית..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">English</label>
                  <textarea
                    value={formData.excerpt.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      excerpt: { ...prev.excerpt, en: e.target.value }
                    }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Excerpt in English..."
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תוכן</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">עברית</label>
                  <textarea
                    value={formData.content.he}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, he: e.target.value }
                    }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="תוכן הפוסט בעברית..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">English</label>
                  <textarea
                    value={formData.content.en}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      content: { ...prev.content, en: e.target.value }
                    }))}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Post content in English..."
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תמונה ראשית</label>
                <input
                  type="url"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="URL של התמונה..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">תאריך פרסום</label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="draft">טיוטה</option>
                  <option value="published">פורסם</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;