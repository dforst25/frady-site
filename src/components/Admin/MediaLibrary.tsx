import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Edit3, Search, Filter, Grid, List, X, Image as ImageIcon } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const MediaLibrary: React.FC = () => {
  const { mediaLibrary, uploadMedia, deleteMedia } = useContent();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMedia, setEditingMedia] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredMedia = mediaLibrary.filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          await uploadMedia(file);
        }
      }
      toast.success(`${files.length} קבצים הועלו בהצלחה`);
    } catch (error) {
      toast.error('שגיאה בהעלאת הקבצים');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
      deleteMedia(id);
      toast.success('התמונה נמחקה בהצלחה');
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק ${selectedMedia.length} תמונות?`)) {
      selectedMedia.forEach(id => deleteMedia(id));
      setSelectedMedia([]);
      toast.success('התמונות נמחקו בהצלחה');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ספריית מדיה</h1>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-rose-100 text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'מעלה...' : 'העלה תמונות'}</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חיפוש תמונות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
        {selectedMedia.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Trash2 className="w-4 h-4" />
            <span>מחק נבחרים ({selectedMedia.length})</span>
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-rose-400 transition-colors"
      >
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">גרור תמונות לכאן או לחץ להעלאה</p>
        <p className="text-sm text-gray-500">תומך ב-JPG, PNG, WebP עד 10MB</p>
      </div>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => setEditingMedia(item.id)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedMedia.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMedia([...selectedMedia, item.id]);
                      } else {
                        setSelectedMedia(selectedMedia.filter(id => id !== item.id));
                      }
                    }}
                    className="w-4 h-4 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500"
                  />
                </div>

                {/* File Info */}
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{item.filename}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">תמונה</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם קובץ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">גודל</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך העלאה</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredMedia.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={item.url} alt={item.alt} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.filename}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatFileSize(item.size)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(item.uploadedAt).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <button
                          onClick={() => setEditingMedia(item.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        className="hidden"
      />

      {/* Edit Media Modal */}
      <AnimatePresence>
        {editingMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">עריכת תמונה</h3>
                <button
                  onClick={() => setEditingMedia(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Edit form would go here */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טקסט חלופי (Alt Text)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="תיאור התמונה..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => setEditingMedia(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={() => {
                      setEditingMedia(null);
                      toast.success('התמונה עודכנה בהצלחה');
                    }}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md"
                  >
                    שמור
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaLibrary;