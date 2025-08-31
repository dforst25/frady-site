import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useContent } from '../contexts/ContentContext';
import toast, { Toaster } from 'react-hot-toast';

const schema = yup.object({
  name: yup.string().required('שם מלא הוא שדה חובה'),
  email: yup.string().email('כתובת אימייל לא תקינה').required('אימייל הוא שדה חובה'),
  phone: yup.string().required('מספר טלפון הוא שדה חובה'),
  message: yup.string().required('הודעה היא שדה חובה').min(10, 'ההודעה חייבת להכיל לפחות 10 תווים'),
});

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const { addContactSubmission } = useContent();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addContactSubmission(data);
      toast.success('ההודעה נשלחה בהצלחה! אחזור אליכם בהקדם.');
      reset();
    } catch (error) {
      toast.error('אירעה שגיאה בשליחת ההודעה. אנא נסו שוב.');
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'טלפון',
      value: '050-123-4567',
      href: 'tel:+972501234567'
    },
    {
      icon: Mail,
      label: 'אימייל',
      value: 'info@photography.co.il',
      href: 'mailto:info@photography.co.il'
    },
    {
      icon: MapPin,
      label: 'מיקום',
      value: 'תל אביב והמרכז',
      href: '#'
    },
    {
      icon: Clock,
      label: 'שעות פעילות',
      value: 'א׳-ה׳: 9:00-18:00',
      href: '#'
    }
  ];

  return (
    <div className="py-20">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            מעוניינים בצילום? שלחו לי הודעה ואשמח לתאם איתכם פגישת היכרות ולתכנן את הצילום המושלם עבורכם
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              שלחו הודעה
            </h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.name')} *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  placeholder="הזינו את שמכם המלא"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.email')} *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.phone')} *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  placeholder="050-123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact.message')} *
                </label>
                <textarea
                  {...register('message')}
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors resize-none"
                  placeholder="ספרו לי על הצילום שאתם מעוניינים בו - סוג הצילום, מיקום, מספר משתתפים ועוד פרטים רלוונטיים"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 rtl:space-x-reverse"
              >
                <Send className="w-5 h-5" />
                <span>{t('contact.send')}</span>
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('contact.info.title')}
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-4 rtl:space-x-reverse p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.label}</h3>
                      <p className="text-gray-600">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-rose-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                למה לבחור בי?
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>מעל 10 שנות ניסיון בצילום ילדים ומשפחות</span>
                </li>
                <li className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>התמחות בצילומי חלאקה ואירועים מיוחדים</span>
                </li>
                <li className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>ציוד מקצועי ועדכני לתוצאות מושלמות</span>
                </li>
                <li className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>גישה אישית וקשב לצרכים הייחודיים של כל משפחה</span>
                </li>
                <li className="flex items-start space-x-3 rtl:space-x-reverse">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>מחירים תחרותיים וחבילות מותאמות</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;