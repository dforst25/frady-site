import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Trash2, 
  Edit3, 
  Search, 
  Grid, 
  List, 
  X, 
  Image as ImageIcon,
  GripVertical,
  Plus,
  Eye,
  Save
} from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const GalleryEditor: React.FC = () => {
  const { 
    content, 
    galleryItems, 
    uploadGalleryImage, 
    deleteGalleryImage, 
    updateGalleryImage,
    reorderGalleryImages,
    getGalleryByCategory 
  } = useContent();
  
  const [activeCategory, setActiveCategory] = useState('chalaka');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: 'chalaka', label: content.galleryCategories.chalaka.he, labelEn: content.galleryCategories.chalaka.en },
    { key: 'family', label: content.galleryCategories.family.he, labelEn: content.galleryCategories.family.en },
    { key: 'newborn', label: content.galleryCategories.newborn.he, labelEn: content.galleryCategories.newborn.en },
    { key: 'smash', label: content.galleryCategories.smash.he, labelEn: content.galleryCategories.smash.en },
  ];

  const currentCategoryImages = getGalleryByCategory(activeCategory).filter(item =>
    item.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => {
        if (file.type.startsWith('image/')) {
          return uploadGalleryImage(file, activeCategory);
        }
        return null;
      }).filter(Boolean);

      await Promise.all(uploadPromises);
      toast.success(`${uploadPromises.length} תמונות הועלו בהצלחה לקטגוריית ${categories.find(c => c.key === activeCategory)?.label}`);
    } catch (error) {
      toast.error('שגיאה בהעלאת התמונות');
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

  const handleDelete = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התמונה?')) {
      await deleteGalleryImage(id);
      toast.success('התמונה נמחקה בהצלחה');
    }
  };

  const handleUpdateImage = async (id: string, updates: any) => {
    await updateGalleryImage(id, updates);
    toast.success('התמונה עודכנה בהצלחה');
    setEditingImage(null);
  };

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedItem(imageId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleReorder = async (draggedId: string, targetId: string) => {
    const images = currentCategoryImages;
    const draggedIndex = images.findIndex(img => img.id === draggedId);
    const targetIndex = images.findIndex(img => img.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...images];
    const [draggedImage] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedImage);

    const newImageIds = newOrder.map(img => img.id);
    await reorderGalleryImages(activeCategory, newImageIds);
    toast.success('סדר התמונות עודכן');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const editingImageData = editingImage 
    ? galleryItems.find(img => img.id === editingImage)
    : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">עורך גלריות</h1>
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

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === category.key
                ? 'bg-rose-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label} ({getGalleryByCategory(category.key).length})
          </button>
        ))}
      </div>

      {/* Search */}
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
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-rose-400 transition-colors"
      >
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">
          גרור תמונות לכאן או לחץ להעלאה לקטגוריית "{categories.find(c => c.key === activeCategory)?.label}"
        </p>
        <p className="text-sm text-gray-500">תומך ב-JPG, PNG, WebP עד 10MB</p>
      </div>

      {/* Images Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {currentCategoryImages.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-move ${
                  draggedItem === item.id ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedItem && draggedItem !== item.id) {
                    handleReorder(draggedItem, item.id);
                  }
                }}
              >
                <div className="aspect-square relative">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                  <div className="absolute top-2 right-2">
                    <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={() => setEditingImage(item.id)}
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
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">סדר</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">תמונה</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם קובץ</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">גודל</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך העלאה</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCategoryImages.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
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
                          onClick={() => setEditingImage(item.id)}
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

      {currentCategoryImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            אין תמונות בקטגוריית "{categories.find(c => c.key === activeCategory)?.label}"
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 rtl:space-x-reverse mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>הוסף תמונות</span>
          </button>
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

      {/* Edit Image Modal */}
      <AnimatePresence>
        {editingImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">עריכת תמונה</h3>
                <button
                  onClick={() => setEditingImage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <img
                    src={editingImageData.url}
                    alt={editingImageData.alt}
                    className="max-w-full max-h-64 object-contain rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    טקסט חלופי (Alt Text)
                  </label>
                  <input
                    type="text"
                    defaultValue={editingImageData.alt}
                    id="alt-text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="תיאור התמונה..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    קטגוריה
                  </label>
                  <select
                    defaultValue={editingImageData.category}
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.key} value={category.key}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">שם קובץ:</span> {editingImageData.filename}
                  </div>
                  <div>
                    <span className="font-medium">גודל:</span> {formatFileSize(editingImageData.size)}
                  </div>
                  <div>
                    <span className="font-medium">סוג:</span> {editingImageData.type}
                  </div>
                  <div>
                    <span className="font-medium">הועלה:</span> {new Date(editingImageData.uploadedAt).toLocaleDateString('he-IL')}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4 border-t">
                  <button
                    onClick={() => setEditingImage(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ביטול
                  </button>
                  <button
                    onClick={() => {
                      const altText = (document.getElementById('alt-text') as HTMLInputElement).value;
                      const category = (document.getElementById('category') as HTMLSelectElement).value;
                      handleUpdateImage(editingImageData.id, { alt: altText, category });
                    }}
                    className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>שמור</span>
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

export default GalleryEditor;