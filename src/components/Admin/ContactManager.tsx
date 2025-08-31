import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, Trash2, Eye, Mail, Phone, Calendar, X } from 'lucide-react';
import { useContent } from '../../contexts/ContentContext';
import toast from 'react-hot-toast';

const ContactManager: React.FC = () => {
  const { contactSubmissions, markContactAsRead, deleteContact } = useContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const filteredContacts = contactSubmissions.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'read' && contact.read) ||
      (filterStatus === 'unread' && !contact.read);

    return matchesSearch && matchesFilter;
  });

  const handleMarkAsRead = (id: string) => {
    markContactAsRead(id);
    toast.success('הפנייה סומנה כנקראה');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הפנייה?')) {
      deleteContact(id);
      toast.success('הפנייה נמחקה בהצלחה');
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק ${selectedContacts.length} פניות?`)) {
      selectedContacts.forEach(id => deleteContact(id));
      setSelectedContacts([]);
      toast.success('הפניות נמחקו בהצלחה');
    }
  };

  const exportToCSV = () => {
    const headers = ['שם', 'אימייל', 'טלפון', 'הודעה', 'תאריך', 'סטטוס'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone,
        `"${contact.message.replace(/"/g, '""')}"`,
        new Date(contact.submittedAt).toLocaleDateString('he-IL'),
        contact.read ? 'נקרא' : 'לא נקרא'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('הקובץ יוצא בהצלחה');
  };

  const selectedContactData = selectedContact 
    ? contactSubmissions.find(c => c.id === selectedContact)
    : null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ניהול פניות</h1>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
          >
            <Download className="w-4 h-4" />
            <span>יצוא CSV</span>
          </button>
          {selectedContacts.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
              <span>מחק נבחרים ({selectedContacts.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="חיפוש פניות..."
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
          <option value="all">כל הפניות</option>
          <option value="unread">לא נקראו</option>
          <option value="read">נקראו</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">סך הכל פניות</p>
              <p className="text-2xl font-bold text-gray-900">{contactSubmissions.length}</p>
            </div>
            <Mail className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">לא נקראו</p>
              <p className="text-2xl font-bold text-red-600">
                {contactSubmissions.filter(c => !c.read).length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">השבוע</p>
              <p className="text-2xl font-bold text-green-600">
                {contactSubmissions.filter(c => 
                  new Date(c.submittedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right">
                  <input
                    type="checkbox"
                    checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts(filteredContacts.map(c => c.id));
                      } else {
                        setSelectedContacts([]);
                      }
                    }}
                    className="w-4 h-4 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500"
                  />
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">סטטוס</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">שם</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">אימייל</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">טלפון</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">תאריך</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr 
                  key={contact.id} 
                  className={`hover:bg-gray-50 ${!contact.read ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedContacts([...selectedContacts, contact.id]);
                        } else {
                          setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                        }
                      }}
                      className="w-4 h-4 text-rose-600 bg-white border-gray-300 rounded focus:ring-rose-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contact.read 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {contact.read ? 'נקרא' : 'חדש'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{contact.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{contact.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{contact.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(contact.submittedAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => setSelectedContact(contact.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="צפייה"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!contact.read && (
                        <button
                          onClick={() => handleMarkAsRead(contact.id)}
                          className="text-green-600 hover:text-green-800"
                          title="סמן כנקרא"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(contact.id)}
                        className="text-red-600 hover:text-red-800"
                        title="מחק"
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

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">אין פניות להצגה</p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      <AnimatePresence>
        {selectedContactData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">פרטי הפנייה</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">שם מלא</label>
                    <p className="text-gray-900">{selectedContactData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                    <a 
                      href={`mailto:${selectedContactData.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {selectedContactData.email}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                    <a 
                      href={`tel:${selectedContactData.phone}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {selectedContactData.phone}
                    </a>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">תאריך פנייה</label>
                    <p className="text-gray-900">
                      {new Date(selectedContactData.submittedAt).toLocaleString('he-IL')}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">הודעה</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContactData.message}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
                  {!selectedContactData.read && (
                    <button
                      onClick={() => {
                        handleMarkAsRead(selectedContactData.id);
                        setSelectedContact(null);
                      }}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    >
                      סמן כנקרא
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleDelete(selectedContactData.id);
                      setSelectedContact(null);
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    מחק פנייה
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

export default ContactManager;